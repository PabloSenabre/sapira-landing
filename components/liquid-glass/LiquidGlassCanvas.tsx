"use client";

import { useRef, useEffect, useCallback } from "react";

interface LiquidGlassCanvasProps {
  /** Background image URL or will capture from parent */
  backgroundUrl?: string;
  /** Width of the glass element in pixels */
  width?: number;
  /** Height of the glass element in pixels */
  height?: number;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Refraction intensity (0-1) */
  refractionIntensity?: number;
  /** Blur intensity (0-1) */
  blurIntensity?: number;
  /** Edge glow intensity (0-1) */
  glowIntensity?: number;
  /** Whether to follow mouse position */
  followMouse?: boolean;
  /** Fixed position if not following mouse */
  position?: { x: number; y: number };
  /** Z-index */
  zIndex?: number;
  /** Additional class names */
  className?: string;
  /** Children to render inside the glass */
  children?: React.ReactNode;
  /** Whether this is for light mode (manifesto) or dark mode */
  lightMode?: boolean;
}

// Vertex shader
const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = vec2(a_position.x, -a_position.y) * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader - based on bergice/liquidglass
const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_dpr;
  uniform sampler2D u_background;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_size;
  uniform float u_refraction;
  uniform float u_blur;
  uniform float u_glow;
  uniform float u_lightMode;
  varying vec2 v_uv;

  float cssPxUV() {
    return u_dpr / min(u_resolution.x, u_resolution.y);
  }

  float roundedBox(vec2 uv, vec2 center, vec2 size, float radius) {
    vec2 q = abs(uv - center) - size + radius;
    return length(max(q, 0.0)) - radius;
  }

  vec3 blurBackground(vec2 uv, vec2 resolution) {
    vec3 result = vec3(0.0);
    float total = 0.0;
    float radius = 3.0 * u_blur;
    int samples = 3;
    for (int x = -3; x <= 3; x++) {
      for (int y = -3; y <= 3; y++) {
        vec2 offset = vec2(float(x), float(y)) * 2.0 / resolution;
        float weight = exp(-(float(x * x + y * y)) / (2.0 * radius));
        result += texture2D(u_background, uv + offset).rgb * weight;
        total += weight;
      }
    }
    return result / total;
  }

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return length(max(d, 0.0)) - r;
  }

  vec2 getNormal(vec2 uv, vec2 center, vec2 size, float radius) {
    vec2 eps = vec2(1.0) / u_resolution * 2.0;
    vec2 p = uv - center;

    float sdfCenter = roundedBoxSDF(p, size, radius);
    float dx = (roundedBoxSDF(p + vec2(eps.x, 0.0), size, radius) - roundedBoxSDF(p - vec2(eps.x, 0.0), size, radius)) * 0.5;
    float dy = (roundedBoxSDF(p + vec2(0.0, eps.y), size, radius) - roundedBoxSDF(p - vec2(0.0, eps.y), size, radius)) * 0.5;

    vec2 gradient = vec2(dx, dy);

    float dxy1 = roundedBoxSDF(p + eps, size, radius);
    float dxy2 = roundedBoxSDF(p - eps, size, radius);
    vec2 diag = vec2(dxy1 - dxy2);

    gradient = mix(gradient, diag, 0.25);

    if (length(gradient) < 0.001) {
      return vec2(0.0);
    }
    return normalize(gradient);
  }

  void main() {
    vec2 pixelUV = (v_uv * u_resolution) / u_dpr;
    vec2 center = u_mouse;
    vec2 size = u_size * 0.5;

    vec2 local = (pixelUV - center) / size;
    local.y *= u_resolution.x / u_resolution.y;

    float radius = 20.0;
    float dist = roundedBox(pixelUV, center, size, radius);

    if (dist > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    // Radial curvature refraction (center-based)
    float r = clamp(length(local * 1.0), 0.0, 1.0);
    float curvature = pow(r, 1.0);
    vec2 domeNormal = normalize(local) * curvature;
    float eta = 1.0 / 1.5;
    vec2 incident = -domeNormal;
    vec2 refractVec = refract(incident, domeNormal, eta);
    vec2 curvedRefractUV = v_uv + refractVec * 0.03 * u_refraction;

    // Edge contour refraction
    float contourFalloff = exp(-abs(dist) * 0.4);
    vec2 normal = getNormal(pixelUV, center, size, radius);
    vec2 domeNormalContour = normal * pow(contourFalloff, 1.5);
    vec2 refractVecContour = refract(vec2(0.0), domeNormalContour, eta);
    vec2 uvContour = v_uv + refractVecContour * 0.35 * contourFalloff * u_refraction;

    // Blend based on distance from edge and radial distance
    float edgeWeight = smoothstep(0.0, 1.0, abs(dist));
    float radialWeight = smoothstep(0.5, 1.0, r);
    float combinedWeight = clamp((edgeWeight * 1.0) + (-radialWeight * 0.5), 0.0, 1.0);
    vec2 refractUV = mix(curvedRefractUV, uvContour, combinedWeight);

    vec3 refracted = texture2D(u_background, refractUV).rgb;
    vec3 blurred = blurBackground(refractUV, u_resolution);
    vec3 base = mix(refracted, blurred, 0.5 * u_blur);

    // Shadow - adjusted for light/dark mode
    float edgeFalloff = smoothstep(0.01, 0.0, dist);
    float verticalBand = 1.0 - smoothstep(-1.5, -0.2, local.y);
    float topShadow = edgeFalloff * verticalBand;
    vec3 shadowColor = u_lightMode > 0.5 ? vec3(0.0) : vec3(0.0);
    base = mix(base, shadowColor, topShadow * 0.1);

    // Edge glow - adjusted for mode
    float edge = 1.0 - smoothstep(0.0, 0.03, dist * -2.0);
    vec3 glowColor = u_lightMode > 0.5 ? vec3(1.0) : vec3(0.7);
    vec3 color = mix(base, glowColor, edge * 0.5 * u_glow);

    // Alpha - lighter in light mode for subtlety
    float alpha = u_lightMode > 0.5 ? 0.65 : 0.75;
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function LiquidGlassCanvas({
  backgroundUrl,
  width = 200,
  height = 80,
  borderRadius = 20,
  refractionIntensity = 1.0,
  blurIntensity = 0.5,
  glowIntensity = 1.0,
  followMouse = true,
  position = { x: 0, y: 0 },
  zIndex = 100,
  className = "",
  children,
  lightMode = false,
}: LiquidGlassCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: position.x, y: position.y });
  const currentMouseRef = useRef({ x: position.x, y: position.y });
  const textureRef = useRef<WebGLTexture | null>(null);
  const uniformsRef = useRef<{
    resolution: WebGLUniformLocation | null;
    mouse: WebGLUniformLocation | null;
    size: WebGLUniformLocation | null;
    dpr: WebGLUniformLocation | null;
    refraction: WebGLUniformLocation | null;
    blur: WebGLUniformLocation | null;
    glow: WebGLUniformLocation | null;
    lightMode: WebGLUniformLocation | null;
  }>({
    resolution: null,
    mouse: null,
    size: null,
    dpr: null,
    refraction: null,
    blur: null,
    glow: null,
    lightMode: null,
  });

  // Compile shader helper
  const compileShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
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
  }, []);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    glRef.current = gl;

    // Compile shaders
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
      console.error("Shader compilation failed");
      return;
    }

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);
    programRef.current = program;

    // Set up geometry (full-screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    uniformsRef.current = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      size: gl.getUniformLocation(program, "u_size"),
      dpr: gl.getUniformLocation(program, "u_dpr"),
      refraction: gl.getUniformLocation(program, "u_refraction"),
      blur: gl.getUniformLocation(program, "u_blur"),
      glow: gl.getUniformLocation(program, "u_glow"),
      lightMode: gl.getUniformLocation(program, "u_lightMode"),
    };

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Load background texture
    const texture = gl.createTexture();
    textureRef.current = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Use a default gradient if no background URL
    const gradientCanvas = document.createElement("canvas");
    gradientCanvas.width = 512;
    gradientCanvas.height = 512;
    const ctx = gradientCanvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      if (lightMode) {
        gradient.addColorStop(0, "#F5F5F3");
        gradient.addColorStop(0.5, "#EBEBEA");
        gradient.addColorStop(1, "#E8E8E6");
      } else {
        gradient.addColorStop(0, "#0a0a0c");
        gradient.addColorStop(0.5, "#0d0d10");
        gradient.addColorStop(1, "#08080a");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gradientCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    gl.uniform1i(gl.getUniformLocation(program, "u_background"), 0);
    gl.uniform1f(uniformsRef.current.dpr, window.devicePixelRatio || 1);
    gl.uniform1f(uniformsRef.current.refraction, refractionIntensity);
    gl.uniform1f(uniformsRef.current.blur, blurIntensity);
    gl.uniform1f(uniformsRef.current.glow, glowIntensity);
    gl.uniform1f(uniformsRef.current.lightMode, lightMode ? 1.0 : 0.0);

    // If background URL provided, load it
    if (backgroundUrl) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = backgroundUrl;
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      };
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [compileShader, backgroundUrl, lightMode, refractionIntensity, blurIntensity, glowIntensity]);

  // Animation loop
  useEffect(() => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (!gl || !canvas) return;

    let lastTime = performance.now();

    const draw = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = displayWidth + "px";
        canvas.style.height = displayHeight + "px";
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      // Smooth mouse interpolation
      const speed = 8.0;
      currentMouseRef.current.x += (mouseRef.current.x - currentMouseRef.current.x) * speed * delta;
      currentMouseRef.current.y += (mouseRef.current.y - currentMouseRef.current.y) * speed * delta;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniformsRef.current.resolution, canvas.width, canvas.height);
      gl.uniform2f(uniformsRef.current.mouse, currentMouseRef.current.x, currentMouseRef.current.y);
      gl.uniform2f(uniformsRef.current.size, width, height);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [width, height]);

  // Mouse tracking
  useEffect(() => {
    if (!followMouse) {
      mouseRef.current = position;
      currentMouseRef.current = position;
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Initialize at center
    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    currentMouseRef.current = { ...mouseRef.current };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [followMouse, position]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
      {/* Children container - positioned at mouse */}
      {children && (
        <div
          className="fixed pointer-events-none flex items-center justify-center"
          style={{
            left: currentMouseRef.current.x,
            top: currentMouseRef.current.y,
            transform: "translate(-50%, -50%)",
            width,
            height,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

