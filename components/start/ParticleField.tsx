"use client";

import { useEffect, useRef, useMemo } from "react";
import { useExperience } from "./AwakeningExperience";

// ============================================
// PARTICLE FIELD
// Reactive particles that respond to cursor movement
// ============================================

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  awakened: boolean;
  awakeningProgress: number;
  angle: number;
  angularVelocity: number;
  orbitRadius: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const { mousePosition, phase, energy, selectedPath, idleTime } = useExperience();

  // Initialize particles
  const particleCount = useMemo(() => {
    if (typeof window === "undefined") return 150;
    return window.innerWidth > 768 ? 200 : 100;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reinitialize particles on resize
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        awakened: false,
        awakeningProgress: 0,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.02,
        orbitRadius: Math.random() * 50 + 20,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Check for idle easter egg (form Sapira logo hint)
      const isIdle = idleTime > 10000;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Calculate distance to cursor
        const dx = mousePosition.x - p.x;
        const dy = mousePosition.y - p.y;
        const distToCursor = Math.sqrt(dx * dx + dy * dy);

        // Awaken particles near cursor in silence phase
        if (phase === "silence" && distToCursor < 100 && !p.awakened) {
          p.awakened = true;
        }

        // Progress awakening
        if (p.awakened && p.awakeningProgress < 1) {
          p.awakeningProgress = Math.min(p.awakeningProgress + 0.01, 1);
        }

        // Movement behavior based on phase
        if (phase === "silence") {
          // Particles drift slowly, react to cursor proximity
          const attractionStrength = distToCursor < 150 ? 0.002 : 0;
          p.vx += dx * attractionStrength;
          p.vy += dy * attractionStrength;

          // Return to base position slowly
          p.vx += (p.baseX - p.x) * 0.001;
          p.vy += (p.baseY - p.y) * 0.001;

          // Apply velocity with damping
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;

        } else if (phase === "revelation" || phase === "choice") {
          // Particles orbit or float more actively
          p.angle += p.angularVelocity;

          // Gentle orbit around center with some randomness
          const targetX = centerX + Math.cos(p.angle) * p.orbitRadius * (1 + i % 3);
          const targetY = centerY + Math.sin(p.angle) * p.orbitRadius * (1 + i % 3);

          p.vx += (targetX - p.x) * 0.01;
          p.vy += (targetY - p.y) * 0.01;

          // Cursor influence
          if (distToCursor < 200) {
            const repelStrength = (200 - distToCursor) / 200 * 0.3;
            p.vx -= dx * repelStrength * 0.01;
            p.vy -= dy * repelStrength * 0.01;
          }

          p.x += p.vx * 0.5;
          p.y += p.vy * 0.5;
          p.vx *= 0.95;
          p.vy *= 0.95;

        } else if (phase === "crossing") {
          // Particles converge toward center
          const convergeDx = centerX - p.x;
          const convergeDy = centerY - p.y;

          p.vx += convergeDx * 0.02;
          p.vy += convergeDy * 0.02;

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.92;
          p.vy *= 0.92;
        }

        // Idle easter egg - particles drift toward forming a pattern
        if (isIdle && phase !== "crossing") {
          const patternX = centerX + Math.cos(i * 0.1) * 100;
          const patternY = centerY + Math.sin(i * 0.1) * 100;
          p.vx += (patternX - p.x) * 0.001;
          p.vy += (patternY - p.y) * 0.001;
        }

        // Keep particles in bounds
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        const baseOpacity = p.awakened ? p.opacity * p.awakeningProgress : p.opacity * 0.2;
        const phaseOpacity = phase === "silence" ? 0.3 : 0.6;
        const finalOpacity = baseOpacity * phaseOpacity * (1 + energy / 200);

        // Color based on selected path during crossing - sober palette
        let particleColor: string;
        if (phase === "crossing" && selectedPath) {
          particleColor = selectedPath === "organic"
            ? `rgba(255, 250, 242, ${finalOpacity})`  // Warm white
            : `rgba(240, 245, 255, ${finalOpacity})`; // Cool white
        } else {
          particleColor = `rgba(255, 255, 255, ${finalOpacity})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.awakened ? 1 + p.awakeningProgress : 1), 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Glow effect for awakened particles
        if (p.awakened && p.awakeningProgress > 0.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = particleColor.replace(/[\d.]+\)$/, `${finalOpacity * 0.2})`);
          ctx.fill();
        }

        // Draw connections between nearby particles in revelation/choice
        if ((phase === "revelation" || phase === "choice") && i % 3 === 0) {
          for (let j = i + 1; j < Math.min(i + 10, particles.length); j++) {
            const p2 = particles[j];
            const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
            if (dist < 80) {
              const lineOpacity = (1 - dist / 80) * 0.1;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [particleCount, mousePosition, phase, energy, selectedPath, idleTime]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
}

