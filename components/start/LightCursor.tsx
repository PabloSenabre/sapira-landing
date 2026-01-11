"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "./AwakeningExperience";

// ============================================
// LIGHT CURSOR
// A mystical cursor with halo and light trail
// ============================================

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  opacity: number;
}

export default function LightCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const animationRef = useRef<number>(0);
  const { mousePosition, phase, energy, hoveredForm } = useExperience();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new trail point
      if (mousePosition.x > 0 && mousePosition.y > 0) {
        trailRef.current.push({
          x: mousePosition.x,
          y: mousePosition.y,
          age: 0,
          opacity: 1,
        });
      }

      // Limit trail length based on phase
      const maxTrailLength = phase === "silence" ? 100 : 50;
      while (trailRef.current.length > maxTrailLength) {
        trailRef.current.shift();
      }

      // Update and draw trail
      const trail = trailRef.current;
      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        point.age += 1;

        // Calculate opacity based on age and position in trail
        const positionFactor = i / trail.length;
        const ageFactor = Math.max(0, 1 - point.age / 60);
        point.opacity = positionFactor * ageFactor;

        if (point.opacity <= 0) continue;

        // Trail glow color - sober monochrome
        let trailColor: string;
        if (hoveredForm === "organic") {
          // Warm white for organic
          trailColor = `rgba(255, 252, 245, ${point.opacity * 0.4})`;
        } else if (hoveredForm === "geometric") {
          // Cool white for geometric
          trailColor = `rgba(235, 240, 250, ${point.opacity * 0.4})`;
        } else {
          // Neutral white
          trailColor = `rgba(255, 255, 255, ${point.opacity * 0.3})`;
        }

        // Size based on position in trail
        const size = (1 + positionFactor * 3) * (phase === "silence" ? 1.5 : 1);

        // Draw trail point
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = trailColor;
        ctx.fill();

        // Outer glow for recent points
        if (positionFactor > 0.7) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = trailColor.replace(/[\d.]+\)$/, `${point.opacity * 0.15})`);
          ctx.fill();
        }
      }

      // Draw main cursor halo
      if (mousePosition.x > 0 && mousePosition.y > 0) {
        const baseIntensity = 0.1 + (energy / 100) * 0.3;
        const haloSize = 20 + (energy / 100) * 30;

        // Multiple glow layers for richer effect
        for (let layer = 0; layer < 4; layer++) {
          const layerSize = haloSize * (1 + layer * 0.8);
          const layerOpacity = baseIntensity * (1 - layer * 0.2);

          let glowColor: string;
          if (hoveredForm === "organic") {
            // Warm white glow
            glowColor = `rgba(255, 250, 240, ${layerOpacity})`;
          } else if (hoveredForm === "geometric") {
            // Cool white glow
            glowColor = `rgba(240, 245, 255, ${layerOpacity})`;
          } else {
            // Neutral white
            glowColor = `rgba(255, 255, 255, ${layerOpacity})`;
          }

          const gradient = ctx.createRadialGradient(
            mousePosition.x,
            mousePosition.y,
            0,
            mousePosition.x,
            mousePosition.y,
            layerSize
          );
          gradient.addColorStop(0, glowColor);
          gradient.addColorStop(0.5, glowColor.replace(/[\d.]+\)$/, `${layerOpacity * 0.3})`));
          gradient.addColorStop(1, "transparent");

          ctx.beginPath();
          ctx.arc(mousePosition.x, mousePosition.y, layerSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core bright point
        const coreGradient = ctx.createRadialGradient(
          mousePosition.x,
          mousePosition.y,
          0,
          mousePosition.x,
          mousePosition.y,
          8
        );

        let coreColor: string;
        if (hoveredForm === "organic") {
          // Warm core
          coreColor = "rgba(255, 252, 245, 0.85)";
        } else if (hoveredForm === "geometric") {
          // Cool core
          coreColor = "rgba(245, 248, 255, 0.85)";
        } else {
          coreColor = "rgba(255, 255, 255, 0.75)";
        }

        coreGradient.addColorStop(0, coreColor);
        coreGradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();

        // Pulsing ring in choice phase
        if (phase === "choice" && hoveredForm) {
          const pulsePhase = (Date.now() % 2000) / 2000;
          const pulseSize = 30 + Math.sin(pulsePhase * Math.PI * 2) * 10;
          const pulseOpacity = 0.2 + Math.sin(pulsePhase * Math.PI * 2) * 0.1;

          ctx.beginPath();
          ctx.arc(mousePosition.x, mousePosition.y, pulseSize, 0, Math.PI * 2);
          ctx.strokeStyle = hoveredForm === "organic"
            ? `rgba(255, 250, 240, ${pulseOpacity})`
            : `rgba(240, 245, 255, ${pulseOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition, phase, energy, hoveredForm]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

