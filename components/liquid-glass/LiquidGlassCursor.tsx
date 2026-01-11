"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface LiquidGlassCursorProps {
  enabled?: boolean;
  size?: number;
  zIndex?: number;
}

export default function LiquidGlassCursor({
  enabled = true,
  size = 32,
  zIndex = 9999,
}: LiquidGlassCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, fluid spring for the glass orb
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if it's a touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    setIsMounted(true);
    setIsVisible(true);
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    // Hide native cursor
    const style = document.createElement('style');
    style.id = 'liquid-glass-cursor-style';
    style.textContent = `
      * { cursor: none !important; }
    `;
    if (!document.getElementById('liquid-glass-cursor-style')) {
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById('liquid-glass-cursor-style');
      if (existingStyle) existingStyle.remove();
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!enabled || !isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementCheck = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        "a, button, input, textarea, [role='button'], .pointer-events-auto"
      );
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementCheck);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementCheck);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [enabled, isMounted, mouseX, mouseY, isVisible]);

  if (!enabled || !isMounted) return null;

  // Single translucent sphere - dynamic size
  const currentSize = isClicking ? size * 0.85 : isHovering ? size * 1.3 : size;

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        x: smoothX,
        y: smoothY,
        zIndex,
        width: currentSize,
        height: currentSize,
        marginLeft: -currentSize / 2,
        marginTop: -currentSize / 2,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
        width: currentSize,
        height: currentSize,
        marginLeft: -currentSize / 2,
        marginTop: -currentSize / 2,
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Single translucent glass sphere */}
      <div
        className="w-full h-full rounded-full"
        style={{
          // The key: backdrop-filter for true glass refraction
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          // Translucent fill - very subtle
          background: `
            radial-gradient(
              circle at 35% 35%,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(255, 255, 255, 0.2) 30%,
              rgba(255, 255, 255, 0.08) 60%,
              rgba(255, 255, 255, 0.03) 100%
            )
          `,
          // Glass edge and inner glow
          boxShadow: `
            inset 0 0 0 1px rgba(255, 255, 255, 0.4),
            inset 0 2px 8px rgba(255, 255, 255, 0.3),
            inset 0 -2px 8px rgba(0, 0, 0, 0.05),
            0 4px 24px rgba(0, 0, 0, 0.08),
            0 1px 4px rgba(0, 0, 0, 0.04)
          `,
        }}
      >
        {/* Highlight - light refraction at top */}
        <div
          className="absolute rounded-full"
          style={{
            top: "10%",
            left: "15%",
            width: "45%",
            height: "30%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        
        {/* Secondary highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: "20%",
            right: "18%",
            width: "25%",
            height: "18%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%)",
            filter: "blur(1px)",
          }}
        />
        
        {/* Bottom subtle reflection */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "20%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
      </div>
    </motion.div>
  );
}
