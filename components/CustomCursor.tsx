"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Custom Cursor Component
 * 
 * A smooth, animated cursor that follows the mouse.
 * Can be added to any page for consistent visual experience.
 */

interface CustomCursorProps {
  color?: string;
  size?: number;
  showRing?: boolean;
}

export default function CustomCursor({
  color = "#1a1a1a",
  size = 8,
  showRing = true,
}: CustomCursorProps) {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Hide default cursor globally */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePos.x - size / 2,
          y: mousePos.y - size / 2,
          scale: isClicking ? 0.8 : isPointer ? 1.5 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: isPointer ? "#fff" : color,
          }}
        />
      </motion.div>

      {/* Outer ring */}
      {showRing && (
        <motion.div
          className="fixed pointer-events-none z-[9998] border rounded-full mix-blend-difference"
          style={{
            borderColor: color,
            borderWidth: 1,
          }}
          animate={{
            x: mousePos.x - 20,
            y: mousePos.y - 20,
            width: 40,
            height: 40,
            scale: isClicking ? 0.9 : isPointer ? 1.5 : 1,
            opacity: isHidden ? 0 : isPointer ? 0.5 : 0.3,
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 0.1,
          }}
        />
      )}
    </>
  );
}

