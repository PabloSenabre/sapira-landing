"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface LiquidGlassCursorProps {
  enabled?: boolean;
  size?: number;
  zIndex?: number;
}

export default function LiquidGlassCursor({
  enabled = true,
  size = 48,
  zIndex = 50,
}: LiquidGlassCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Spring-based mouse position for smooth, organic following
  // Initialize at 0 to avoid hydration mismatch
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Slower, more organic spring for main cursor
  const springConfig = { damping: 25, stiffness: 200, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Faster spring for the trailing ring
  const trailConfig = { damping: 35, stiffness: 150, mass: 1.2 };
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  // Mark as mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
    // Initialize position at center once mounted
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);
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

    // Detect hovering over interactive elements
    const handleElementCheck = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        "a, button, input, textarea, [role='button'], .pointer-events-auto, .liquid-glass-button"
      );
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementCheck);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Initialize at center
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementCheck);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [enabled, isMounted, mouseX, mouseY, isVisible]);

  // Don't render until mounted to avoid hydration issues
  if (!enabled || !isMounted) return null;

  // Dynamic sizing based on state
  const currentSize = isClicking ? size * 0.7 : isHovering ? size * 1.4 : size;
  const trailSize = isHovering ? size * 2.2 : size * 1.6;

  return (
    <>
      {/* Outer trailing ring - follows slower, creates depth */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trailX,
          y: trailY,
          zIndex: zIndex - 1,
          width: trailSize,
          height: trailSize,
          marginLeft: -trailSize / 2,
          marginTop: -trailSize / 2,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isVisible ? (isHovering ? 0.4 : 0.2) : 0,
          scale: isVisible ? 1 : 0,
          width: trailSize,
          height: trailSize,
          marginLeft: -trailSize / 2,
          marginTop: -trailSize / 2,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.06)",
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Main cursor - glass orb */}
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
        {/* Glass orb container */}
        <div
          className="relative w-full h-full rounded-full overflow-hidden"
          style={{
            backdropFilter: "blur(8px) saturate(1.3)",
            WebkitBackdropFilter: "blur(8px) saturate(1.3)",
            background: isHovering 
              ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 100%)"
              : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.01) 100%)",
            boxShadow: `
              0 4px 16px rgba(0, 0, 0, 0.06),
              0 1px 4px rgba(0, 0, 0, 0.04),
              inset 0 0 0 1px rgba(255, 255, 255, 0.35),
              inset 0 1px 2px rgba(255, 255, 255, 0.4)
            `,
          }}
        >
          {/* Top highlight - like light hitting a glass sphere */}
          <div
            className="absolute rounded-full"
            style={{
              top: "12%",
              left: "20%",
              width: "35%",
              height: "25%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)",
              filter: "blur(1px)",
            }}
          />

          {/* Secondary highlight */}
          <div
            className="absolute rounded-full"
            style={{
              top: "20%",
              right: "15%",
              width: "20%",
              height: "15%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)",
              filter: "blur(1px)",
            }}
          />

          {/* Inner depth shadow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 70% 70%, rgba(0,0,0,0.04) 0%, transparent 50%)",
            }}
          />

          {/* Subtle animated shimmer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Tiny center dot - gives sense of depth */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: "50%",
            left: "50%",
            width: 4,
            height: 4,
            marginLeft: -2,
            marginTop: -2,
            background: "rgba(0, 0, 0, 0.08)",
            boxShadow: "0 0 4px rgba(0,0,0,0.05)",
          }}
          animate={{
            scale: isClicking ? 0.5 : 1,
          }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
    </>
  );
}
