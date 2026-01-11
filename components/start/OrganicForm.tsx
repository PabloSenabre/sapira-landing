"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperience } from "./AwakeningExperience";

// ============================================
// ORGANIC FORM
// A fluid, breathing form representing dialogue
// Sober, elegant aesthetic with typography
// ============================================

export default function OrganicForm() {
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

  const isHovered = hoveredForm === "organic";
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

  // Draw the organic blob - now in sober grays/warm whites
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 220;
    canvas.width = size;
    canvas.height = size;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);
      time += 0.02;

      const centerX = size / 2;
      const centerY = size / 2;
      const baseRadius = isHovered ? 75 : isNear ? 65 : 60;
      const breathingAmplitude = isHovered ? 10 : 6;
      const breathingSpeed = isHovered ? 1.5 : 1;

      // Number of control points
      const points = 8;
      const angleStep = (Math.PI * 2) / points;

      ctx.beginPath();

      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep;
        
        // Organic distortion using multiple sine waves
        const distortion = 
          Math.sin(angle * 2 + time * breathingSpeed) * breathingAmplitude +
          Math.sin(angle * 3 - time * 1.3) * (breathingAmplitude * 0.5) +
          Math.sin(angle * 5 + time * 0.7) * (breathingAmplitude * 0.3);

        const radius = baseRadius + distortion;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Use bezier curves for smoothness
          const prevAngle = (i - 1) * angleStep;
          const prevDistortion = 
            Math.sin(prevAngle * 2 + time * breathingSpeed) * breathingAmplitude +
            Math.sin(prevAngle * 3 - time * 1.3) * (breathingAmplitude * 0.5) +
            Math.sin(prevAngle * 5 + time * 0.7) * (breathingAmplitude * 0.3);
          const prevRadius = baseRadius + prevDistortion;

          const cp1x = centerX + Math.cos(prevAngle + angleStep * 0.3) * (prevRadius * 1.1);
          const cp1y = centerY + Math.sin(prevAngle + angleStep * 0.3) * (prevRadius * 1.1);
          const cp2x = centerX + Math.cos(angle - angleStep * 0.3) * (radius * 1.1);
          const cp2y = centerY + Math.sin(angle - angleStep * 0.3) * (radius * 1.1);

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
      }

      ctx.closePath();

      // Gradient fill - SOBER warm grays/cream tones
      const intensity = isHovered ? 0.25 : isNear ? 0.15 : 0.1;
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        baseRadius + breathingAmplitude
      );
      // Warm off-white to warm gray
      gradient.addColorStop(0, `rgba(255, 252, 248, ${intensity * 1.3})`);
      gradient.addColorStop(0.5, `rgba(240, 235, 228, ${intensity})`);
      gradient.addColorStop(1, `rgba(200, 195, 188, ${intensity * 0.4})`);

      ctx.fillStyle = gradient;
      ctx.fill();

      // Subtle border
      ctx.strokeStyle = `rgba(255, 252, 248, ${isHovered ? 0.3 : 0.15})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer glow - subtle warm
      const glowIntensity = isHovered ? 0.15 : isNear ? 0.08 : 0.04;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + 25, 0, Math.PI * 2);
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, baseRadius,
        centerX, centerY, baseRadius + 50
      );
      glowGradient.addColorStop(0, `rgba(255, 250, 245, ${glowIntensity})`);
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.ellipse(
        centerX - 15,
        centerY - 15,
        25 + Math.sin(time) * 3,
        20 + Math.sin(time * 1.3) * 2,
        -0.5,
        0,
        Math.PI * 2
      );
      const highlightGradient = ctx.createRadialGradient(
        centerX - 15, centerY - 15, 0,
        centerX - 15, centerY - 15, 25
      );
      highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.4})`);
      highlightGradient.addColorStop(1, "transparent");
      ctx.fillStyle = highlightGradient;
      ctx.fill();

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
        scale: { duration: 0.3 },
      }}
      onMouseEnter={() => setHoveredForm("organic")}
      onMouseLeave={() => setHoveredForm(null)}
      onClick={() => selectPath("organic")}
    >
      {/* The organic blob canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-[220px] h-[220px]"
        />

        {/* Typography - full word "Habla con nosotros" */}
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
              fontStyle: "italic",
              color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
              letterSpacing: "0.02em",
              textShadow: isHovered ? "0 0 40px rgba(255,255,255,0.15)" : "none",
              transition: "all 0.3s ease",
            }}
          >
            Habla con nosotros
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
              className="italic text-xl mb-2"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              Conversemos.
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Descubramos juntos lo que necesitas.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for layout consistency */}
      <div className="h-8" />
    </motion.div>
  );
}
