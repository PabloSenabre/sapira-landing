"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  vertexShaderSource,
  fragmentShaderSource,
  type GlassElement,
  type CursorSpotlight,
} from "./shaders";

interface LiquidGlassCanvasProps {
  elements: GlassElement[];
  cursor: CursorSpotlight;
  className?: string;
}

// Compile a WebGL shader
function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Create and link a WebGL program
function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export default function LiquidGlassCanvas({
  elements,
  cursor,
  className = "",
}: LiquidGlassCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const animationFrameRef = useRef<number>(0);
  const isInitializedRef = useRef(false);
  const lastTimeRef = useRef(performance.now());

  // Current interpolated values for smooth animation
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isInitializedRef.current) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    glRef.current = gl;

    // Compile shaders
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error("Failed to compile shaders");
      return;
    }

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error("Failed to create program");
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Create position buffer (fullscreen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Setup position attribute
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    uniformsRef.current = {
      u_dpr: gl.getUniformLocation(program, "u_dpr"),
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_mouse: gl.getUniformLocation(program, "u_mouse"),
      u_time: gl.getUniformLocation(program, "u_time"),
      u_elementCount: gl.getUniformLocation(program, "u_elementCount"),
      u_cursorPos: gl.getUniformLocation(program, "u_cursorPos"),
      u_cursorSize: gl.getUniformLocation(program, "u_cursorSize"),
      u_cursorActive: gl.getUniformLocation(program, "u_cursorActive"),
    };

    // Get array uniform locations
    for (let i = 0; i < 8; i++) {
      uniformsRef.current[`u_elements[${i}]`] = gl.getUniformLocation(
        program,
        `u_elements[${i}]`
      );
      uniformsRef.current[`u_elementRadius[${i}]`] = gl.getUniformLocation(
        program,
        `u_elementRadius[${i}]`
      );
      uniformsRef.current[`u_elementIntensity[${i}]`] = gl.getUniformLocation(
        program,
        `u_elementIntensity[${i}]`
      );
    }

    // Set DPR uniform
    const dpr = window.devicePixelRatio || 1;
    gl.uniform1f(uniformsRef.current.u_dpr, dpr);

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Set clear color to fully transparent
    gl.clearColor(0, 0, 0, 0);

    isInitializedRef.current = true;
  }, []);

  // Resize canvas
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    gl.viewport(0, 0, canvas.width, canvas.height);
  }, []);

  // Main render loop
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas || !isInitializedRef.current) {
      animationFrameRef.current = requestAnimationFrame(render);
      return;
    }

    const now = performance.now();
    const delta = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    // Smooth mouse interpolation
    const speed = 8.0;
    currentMouseRef.current.x +=
      (targetMouseRef.current.x - currentMouseRef.current.x) * speed * delta;
    currentMouseRef.current.y +=
      (targetMouseRef.current.y - currentMouseRef.current.y) * speed * delta;

    // Update resolution
    gl.uniform2f(
      uniformsRef.current.u_resolution,
      canvas.width,
      canvas.height
    );

    // Update mouse position
    gl.uniform2f(
      uniformsRef.current.u_mouse,
      currentMouseRef.current.x,
      currentMouseRef.current.y
    );

    // Update time
    gl.uniform1f(uniformsRef.current.u_time, now * 0.001);

    // Update element count
    gl.uniform1i(uniformsRef.current.u_elementCount, Math.min(elements.length, 8));

    // Update each element
    for (let i = 0; i < 8; i++) {
      const elem = elements[i];
      if (elem) {
        gl.uniform4f(
          uniformsRef.current[`u_elements[${i}]`],
          elem.x,
          elem.y,
          elem.width,
          elem.height
        );
        gl.uniform1f(uniformsRef.current[`u_elementRadius[${i}]`], elem.radius);
        gl.uniform1f(uniformsRef.current[`u_elementIntensity[${i}]`], elem.intensity);
      } else {
        gl.uniform4f(uniformsRef.current[`u_elements[${i}]`], 0, 0, 0, 0);
        gl.uniform1f(uniformsRef.current[`u_elementRadius[${i}]`], 0);
        gl.uniform1f(uniformsRef.current[`u_elementIntensity[${i}]`], 0);
      }
    }

    // Update cursor spotlight
    gl.uniform2f(uniformsRef.current.u_cursorPos, cursor.x, cursor.y);
    gl.uniform1f(uniformsRef.current.u_cursorSize, cursor.size);
    gl.uniform1f(uniformsRef.current.u_cursorActive, cursor.active ? 1.0 : 0.0);

    // Clear to transparent and draw
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animationFrameRef.current = requestAnimationFrame(render);
  }, [elements, cursor]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetMouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Initialize on mount
  useEffect(() => {
    initWebGL();
    resize();

    // Start render loop
    animationFrameRef.current = requestAnimationFrame(render);

    // Event listeners
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);

      // Cleanup WebGL resources
      const gl = glRef.current;
      if (gl) {
        if (programRef.current) gl.deleteProgram(programRef.current);
      }

      isInitializedRef.current = false;
    };
  }, [initWebGL, resize, render, handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ 
        zIndex: 10,
        background: "transparent",
      }}
    />
  );
}
