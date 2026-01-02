"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LiquidGlassLogosProps {
  /** Whether the logos are visible */
  isVisible: boolean;
  /** Starting position for the burst animation */
  startPosition: { x: number; y: number };
  /** Z-index */
  zIndex?: number;
}

// Simplified WebGL shader for logo backgrounds
const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform float u_hover;
  varying vec2 v_uv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(v_uv - center);
    
    // Rounded rectangle mask
    vec2 q = abs(v_uv - center) - vec2(0.35);
    float box = length(max(q, 0.0)) - 0.15;
    float mask = 1.0 - smoothstep(-0.02, 0.02, box);
    
    // Edge glow
    float edge = smoothstep(-0.05, -0.02, box) * (1.0 - smoothstep(-0.02, 0.0, box));
    
    // Subtle refraction waves
    float wave = sin(dist * 15.0 - u_time * 1.5) * 0.5 + 0.5;
    float innerShine = (1.0 - smoothstep(0.0, 0.4, dist)) * wave * 0.08;
    
    // Light mode glass colors
    vec3 glassColor = vec3(1.0, 0.995, 0.99);
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    
    // Hover enhancement
    float hoverBoost = u_hover * 0.15;
    
    vec3 finalColor = mix(glassColor, edgeColor, edge * 0.8);
    float alpha = (mask * (0.45 + hoverBoost) + edge * 0.6 + innerShine) * (0.8 + u_hover * 0.2);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Company logos - same as in ManifestoSection
const COMPANY_LOGOS = [
  { name: "Google", color: "#4285F4" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Salesforce", color: "#00A1E0" },
  { name: "Oracle", color: "#F80000" },
  { name: "Slack", color: "#4A154B" },
  { name: "Zoom", color: "#2D8CFF" },
  { name: "Adobe", color: "#FF0000" },
  { name: "Atlassian", color: "#0052CC" },
  { name: "Notion", color: "#000000" },
  { name: "Figma", color: "#F24E1E" },
];

// Individual logo with liquid glass background
function LiquidGlassLogo({
  logo,
  index,
  startPosition,
  isLeft,
  delay,
}: {
  logo: { name: string; color: string };
  index: number;
  startPosition: { x: number; y: number };
  isLeft: boolean;
  delay: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const [isHovered, setIsHovered] = useState(false);
  const hoverRef = useRef(0);

  // Calculate target position
  const targetPosition = useMemo(() => {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const sideIndex = Math.floor(index / 2);
    const padding = 100;
    const availableHeight = viewportHeight - padding * 2;
    const spacing = availableHeight / 4;
    const yOffset = padding + sideIndex * spacing;
    const centerX = viewportWidth / 2;
    const offsetFromCenter = viewportWidth * 0.32;
    
    return {
      x: isLeft ? centerX - offsetFromCenter : centerX + offsetFromCenter,
      y: yOffset,
    };
  }, [index, isLeft]);

  // Compile shader
  const compileShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }, []);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    glRef.current = gl;
    const size = 64;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);
    programRef.current = program;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const draw = () => {
      if (!glRef.current || !programRef.current) return;
      
      const time = (Date.now() - startTimeRef.current) / 1000;
      
      // Smooth hover transition
      hoverRef.current += (isHovered ? 1 : 0 - hoverRef.current) * 0.1;
      
      gl.uniform1f(gl.getUniformLocation(programRef.current, "u_time"), time);
      gl.uniform1f(gl.getUniformLocation(programRef.current, "u_hover"), hoverRef.current);
      
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      animationRef.current = requestAnimationFrame(draw);
    };

    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
    };
  }, [compileShader, isHovered]);

  // Get logo SVG based on name
  const LogoSVG = () => {
    const size = 28;
    switch (logo.name) {
      case "Google":
        return (
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case "Microsoft":
        return (
          <svg viewBox="0 0 21 21" width={size} height={size}>
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
        );
      case "Salesforce":
        return (
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path fill="#00A1E0" d="M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.16 5.22c-.345 0-.69-.03-1.02-.105-.645 1.155-1.875 1.935-3.3 1.935-.585 0-1.155-.135-1.65-.39-.66 1.545-2.19 2.625-3.96 2.625-1.86 0-3.435-1.17-4.035-2.82a3.659 3.659 0 0 1-.825.09c-2.01 0-3.645-1.65-3.645-3.675 0-1.5.9-2.79 2.19-3.345-.24-.57-.375-1.2-.375-1.86C2.22 6.06 4.41 3.87 7.11 3.87c1.5 0 2.865.69 3.75 1.785l-.854-.24z"/>
          </svg>
        );
      case "Slack":
        return (
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
            <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
            <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/>
            <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
          </svg>
        );
      case "Zoom":
        return (
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <circle fill="#2D8CFF" cx="12" cy="12" r="11"/>
            <path fill="white" d="M16.5 9l-2.5 1.5V9c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1.5l2.5 1.5V9z"/>
          </svg>
        );
      case "Adobe":
        return (
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path fill="#FF0000" d="M14.5 0H24v24L14.5 0zM9.5 0H0v24L9.5 0zM12 8.5l4.5 11.5h-3l-1.3-3.5H8.5L12 8.5z"/>
          </svg>
        );
      case "Notion":
        return (
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path fill="#000000" d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.047-.747.327-.747.933z"/>
          </svg>
        );
      case "Figma":
        return (
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path fill="#F24E1E" d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8z"/>
            <path fill="#A259FF" d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z"/>
            <path fill="#1ABCFE" d="M12 0v8h4a4 4 0 0 0 0-8h-4z"/>
            <path fill="#0ACF83" d="M4 4a4 4 0 0 0 4 4h4V0H8a4 4 0 0 0-4 4z"/>
            <path fill="#FF7262" d="M16 12a4 4 0 1 1-4-4 4 4 0 0 1 4 4z"/>
          </svg>
        );
      case "Atlassian":
        return (
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path fill="#2684FF" d="M7.127 11.167a.592.592 0 0 0-1.01.103L1.06 21.793a.593.593 0 0 0 .528.857h6.962a.593.593 0 0 0 .529-.322c1.585-3.123.612-7.848-1.952-11.161z"/>
            <path fill="#2684FF" d="M11.126 1.361a13.822 13.822 0 0 0-.792 13.79l3.592 7.098a.593.593 0 0 0 .528.322h6.963a.593.593 0 0 0 .528-.857L12.137 1.464a.592.592 0 0 0-1.011-.103z"/>
          </svg>
        );
      case "Oracle":
        return (
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path fill="#F80000" d="M7.076 7.076C4.862 7.076 3.076 8.862 3.076 11.076v1.848c0 2.214 1.786 4 4 4h9.848c2.214 0 4-1.786 4-4v-1.848c0-2.214-1.786-4-4-4H7.076zm0 2h9.848c1.103 0 2 .897 2 2v1.848c0 1.103-.897 2-2 2H7.076c-1.103 0-2-.897-2-2v-1.848c0-1.103.897-2 2-2z"/>
          </svg>
        );
      default:
        return (
          <div 
            className="w-7 h-7 rounded-lg"
            style={{ backgroundColor: logo.color, opacity: 0.8 }}
          />
        );
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer"
      style={{ left: 0, top: 0 }}
      initial={{
        x: startPosition.x,
        y: startPosition.y,
        opacity: 0,
        scale: 0,
      }}
      animate={{
        x: targetPosition.x - 32,
        y: targetPosition.y - 32,
        opacity: 1,
        scale: isHovered ? 1.15 : 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.2 },
      }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        scale: { duration: 0.2 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container with glass effect */}
      <div className="relative w-16 h-16">
        {/* WebGL liquid glass background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-2xl"
          style={{
            width: 64,
            height: 64,
          }}
        />
        
        {/* Logo centered */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            animate={{
              y: isHovered ? -3 : [0, -2, 0],
              rotateY: isLeft ? 8 : -8,
            }}
            transition={{
              y: isHovered ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
              perspective: 500,
            }}
          >
            <LogoSVG />
          </motion.div>
        </div>

        {/* Soft shadow underneath */}
        <motion.div
          className="absolute -bottom-2 left-1/2 w-10 h-3 rounded-full"
          style={{
            transform: "translateX(-50%)",
            background: "radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)",
            filter: "blur(3px)",
          }}
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.6 : 0.8,
          }}
        />

        {/* Border highlight */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: isHovered 
              ? "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)"
              : "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
            transition: "box-shadow 0.3s ease",
          }}
        />
      </div>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute left-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{
              top: "100%",
              marginTop: 8,
              transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              color: "rgba(0,0,0,0.7)",
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {logo.name}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LiquidGlassLogos({
  isVisible,
  startPosition,
  zIndex = 100,
}: LiquidGlassLogosProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex }}
        >
          {COMPANY_LOGOS.map((logo, index) => (
            <LiquidGlassLogo
              key={logo.name}
              logo={logo}
              index={index}
              startPosition={startPosition}
              isLeft={index % 2 === 0}
              delay={index * 0.05}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

