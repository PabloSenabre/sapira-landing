"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperience } from "./AwakeningExperience";

// ============================================
// ECHO EFFECT
// Visual ripples that appear on double-click
// ============================================

interface Echo {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export default function EchoEffect() {
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const { mousePosition, phase } = useExperience();
  const [lastClickTime, setLastClickTime] = useState(0);
  const [idCounter, setIdCounter] = useState(0);

  // Handle double click detection
  const handleClick = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;

    // Double click detected (within 300ms)
    if (timeSinceLastClick < 300 && phase !== "crossing") {
      const newEcho: Echo = {
        id: idCounter,
        x: mousePosition.x,
        y: mousePosition.y,
        timestamp: now,
      };

      setEchoes(prev => [...prev, newEcho]);
      setIdCounter(prev => prev + 1);

      // Remove echo after animation
      setTimeout(() => {
        setEchoes(prev => prev.filter(e => e.id !== newEcho.id));
      }, 2000);
    }

    setLastClickTime(now);
  }, [lastClickTime, mousePosition, phase, idCounter]);

  // Listen for clicks
  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [handleClick]);

  return (
    <div className="fixed inset-0 pointer-events-none z-25">
      <AnimatePresence>
        {echoes.map((echo) => (
          <motion.div
            key={echo.id}
            className="absolute"
            style={{
              left: echo.x,
              top: echo.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Multiple expanding rings */}
            {[0, 1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
                initial={{ 
                  width: 0, 
                  height: 0, 
                  opacity: 0.6,
                }}
                animate={{ 
                  width: 200 + ring * 80, 
                  height: 200 + ring * 80,
                  opacity: 0,
                }}
                transition={{
                  duration: 1.5,
                  delay: ring * 0.15,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Central flash */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
              }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: 100, height: 100, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Particle burst */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const distance = 80 + Math.random() * 40;
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0.8,
                    scale: 1,
                  }}
                  animate={{ 
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.1,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

