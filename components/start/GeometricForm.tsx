"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperience } from "./AwakeningExperience";

// ============================================
// GEOMETRIC FORM
// An angular, pulsing crystalline shape representing action
// Sober, elegant aesthetic with typography
// ============================================

export default function GeometricForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isNear, setIsNear] = useState(false);

  const {
    mousePosition,
    phase,
    hoveredForm,
    hoverDuration,
    setHoveredForm,
    selectPath,
  } = useExperience();

  const isHovered = hoveredForm === "geometric";
  const showMessage = isHovered && hoverDuration >= 1500;

  // Detect if cursor is near this form
  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = mousePosition.x - (centerX - (containerRef.current.offsetParent as HTMLElement)?.offsetLeft || 0);
    const dy = mousePosition.y - (centerY - (containerRef.current.offsetParent as HTMLElement)?.offsetTop || 0);
    const distance = Math.sqrt(dx * dx + dy * dy);

    setIsNear(distance < 200);
  }, [mousePosition]);

  // Draw the geometric shape - now in sober cool grays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 220;
    canvas.width = size;
    canvas.height = size;

    let time = 0;
    let pulsePhase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);
      time += 0.015;
      pulsePhase += 0.03;

      const centerX = size / 2;
      const centerY = size / 2;
      const baseRadius = isHovered ? 70 : isNear ? 60 : 55;
      const rotationSpeed = isHovered ? 0.02 : 0.01;

      // Pulse effect
      const pulse = Math.sin(pulsePhase) * (isHovered ? 6 : 3);
      const currentRadius = baseRadius + pulse;

      // Draw multiple layered hexagons
      const layers = 3;
      for (let layer = layers - 1; layer >= 0; layer--) {
        const layerRadius = currentRadius * (1 - layer * 0.15);
        const layerRotation = time * rotationSpeed * (layer % 2 === 0 ? 1 : -1);
        const layerOpacity = isHovered ? 0.25 - layer * 0.06 : 0.12 - layer * 0.03;

        ctx.beginPath();
        const sides = 6;
        for (let i = 0; i <= sides; i++) {
          const angle = (i * Math.PI * 2) / sides + layerRotation;
          const x = centerX + Math.cos(angle) * layerRadius;
          const y = centerY + Math.sin(angle) * layerRadius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        // Gradient fill - SOBER cool gray tones
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, layerRadius
        );
        // Cool silver to gray
        gradient.addColorStop(0, `rgba(230, 235, 240, ${layerOpacity * 1.2})`);
        gradient.addColorStop(0.5, `rgba(200, 205, 215, ${layerOpacity})`);
        gradient.addColorStop(1, `rgba(160, 165, 175, ${layerOpacity * 0.5})`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Edge glow - subtle silver
        ctx.strokeStyle = `rgba(220, 225, 235, ${layerOpacity * 0.8})`;
        ctx.lineWidth = layer === 0 ? 1.5 : 0.5;
        ctx.stroke();
      }

      // Inner crystal structure - subtle
      const innerLines = 6;
      ctx.strokeStyle = `rgba(255, 255, 255, ${isHovered ? 0.2 : 0.1})`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < innerLines; i++) {
        const angle = (i * Math.PI * 2) / innerLines + time * 0.01;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * currentRadius * 0.7,
          centerY + Math.sin(angle) * currentRadius * 0.7
        );
        ctx.stroke();
      }

      // Central core - pulsing
      const coreSize = 12 + Math.sin(pulsePhase * 2) * 2;
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreSize
      );
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${isHovered ? 0.7 : 0.4})`);
      coreGradient.addColorStop(0.5, `rgba(220, 225, 235, ${isHovered ? 0.4 : 0.2})`);
      coreGradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Outer glow rings - subtle
      const ringCount = 2;
      for (let r = 0; r < ringCount; r++) {
        const ringPhase = (pulsePhase + r * Math.PI * 0.5) % (Math.PI * 2);
        const ringRadius = currentRadius + 15 + r * 20 + Math.sin(ringPhase) * 3;
        const ringOpacity = (1 - r / ringCount) * (isHovered ? 0.12 : 0.06) * Math.max(0, Math.sin(ringPhase));

        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(220, 225, 235, ${ringOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Floating corner particles - subtle
      if (isHovered || isNear) {
        const particleCount = 6;
        for (let i = 0; i < particleCount; i++) {
          const angle = (i * Math.PI * 2) / particleCount + time * 0.5;
          const distance = currentRadius + 25 + Math.sin(time * 2 + i) * 8;
          const px = centerX + Math.cos(angle) * distance;
          const py = centerY + Math.sin(angle) * distance;
          const particleSize = 1.5 + Math.sin(time * 3 + i) * 0.5;

          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${isHovered ? 0.4 : 0.2})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [isHovered, isNear]);

  if (phase !== "revelation" && phase !== "choice") return null;

  return (
    <motion.div
      ref={containerRef}
      className="relative flex flex-col items-center cursor-pointer"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ 
        opacity: 1, 
        scale: isHovered ? 1.08 : 1,
        y: 0,
      }}
      transition={{ 
        duration: 0.8,
        delay: 0.2,
        scale: { duration: 0.3 },
      }}
      onMouseEnter={() => setHoveredForm("geometric")}
      onMouseLeave={() => setHoveredForm(null)}
      onClick={() => selectPath("geometric")}
    >
      {/* The geometric shape canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-[220px] h-[220px]"
        />

        {/* Typography - full word "Empieza ya" - serif but upright (not italic) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ 
            opacity: isHovered ? 1 : 0.6,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.75rem",
              fontWeight: 400,
              fontStyle: "normal", // Upright, not italic - this is the difference
              color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
              letterSpacing: "0.08em", // Slightly more tracking
              textShadow: isHovered ? "0 0 40px rgba(255,255,255,0.15)" : "none",
              transition: "all 0.3s ease",
            }}
          >
            Empieza ya
          </span>
        </motion.div>
      </div>

      {/* Message that appears on prolonged hover */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="absolute -bottom-28 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="text-xl mb-2"
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 300,
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              Construye.
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Tu visión cobra vida ahora.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for layout consistency */}
      <div className="h-8" />
    </motion.div>
  );
}
