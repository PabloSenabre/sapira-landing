"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XPErrorWindow } from "./XPWindow";

interface CrashExperienceProps {
  onComplete: () => void;
}

// Simple, clean error messages
const ERROR_MESSAGES = [
  {
    title: "Application Error",
    message: "This application is no longer supported.",
    details: "Legacy software detected.",
  },
  {
    title: "Compatibility Issue",
    message: "Unable to connect to modern services.",
    details: "Please update your software.",
  },
  {
    title: "System Warning",
    message: "Outdated components detected.",
    details: "Consider upgrading to a modern solution.",
  },
  {
    title: "Connection Failed",
    message: "Cloud services unavailable for this version.",
    details: "Your software requires an update.",
  },
  {
    title: "Performance Alert",
    message: "This application is running in compatibility mode.",
    details: "Functionality may be limited.",
  },
  // Easter egg messages that appear when trying to close
  {
    title: "Nice Try!",
    message: "You can't close me that easily.",
    details: "Have another popup instead!",
  },
  {
    title: "Error: Close Failed",
    message: "The close button is deprecated.",
    details: "Please accept your fate.",
  },
  {
    title: "Task Manager Disabled",
    message: "Alt+F4 won't save you either.",
    details: "Resistance is futile.",
  },
  {
    title: "System Overwhelmed",
    message: "Too many popups to handle.",
    details: "Your CPU thanks you for the workout.",
  },
  {
    title: "Memory Leak Detected",
    message: "Each close spawns two more.",
    details: "It's like a hydra!",
  },
];

type CrashPhase = "initial" | "building" | "peak" | "collapse" | "blackout";

interface ErrorPopup {
  id: string;
  message: typeof ERROR_MESSAGES[0];
  position: { x: number; y: number };
}

export default function CrashExperience({ onComplete }: CrashExperienceProps) {
  const [phase, setPhase] = useState<CrashPhase>("initial");
  const [popups, setPopups] = useState<ErrorPopup[]>([]);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [screenGlitch, setScreenGlitch] = useState(false);
  const [closeAttempts, setCloseAttempts] = useState(0);
  const isUserInteracting = useRef(false);

  // Get random position for popup
  const getRandomPosition = useCallback(() => {
    const margin = 100;
    const maxX = typeof window !== 'undefined' ? window.innerWidth - 350 : 800;
    const maxY = typeof window !== 'undefined' ? window.innerHeight - 180 : 500;
    return {
      x: margin + Math.random() * (maxX - margin * 2),
      y: margin + Math.random() * (maxY - margin * 2),
    };
  }, []);

  // Spawn a new popup with optional easter egg message
  const spawnPopup = useCallback((useEasterEgg: boolean = false) => {
    // Easter egg messages start at index 5
    const messagePool = useEasterEgg 
      ? ERROR_MESSAGES.slice(5) // Only easter egg messages
      : ERROR_MESSAGES.slice(0, 5); // Only regular messages
    
    const newPopup: ErrorPopup = {
      id: `popup-${Date.now()}-${Math.random()}`,
      message: messagePool[Math.floor(Math.random() * messagePool.length)],
      position: getRandomPosition(),
    };
    setPopups(prev => [...prev, newPopup]);
  }, [getRandomPosition]);

  // Easter egg: When user tries to close a popup, spawn more!
  const handleCloseAttempt = useCallback((popupId: string) => {
    isUserInteracting.current = true;
    setCloseAttempts(prev => prev + 1);
    
    // Trigger a mini glitch
    setScreenGlitch(true);
    setTimeout(() => setScreenGlitch(false), 80);

    // Increase shake slightly
    setShakeIntensity(prev => Math.min(prev + 0.5, 4));

    // Spawn 1-2 new popups with easter egg messages
    const numNewPopups = Math.random() > 0.5 ? 2 : 1;
    for (let i = 0; i < numNewPopups; i++) {
      setTimeout(() => spawnPopup(true), i * 100);
    }

    // After too many attempts (8+), accelerate to crash
    if (closeAttempts >= 7) {
      setPhase("collapse");
    }
  }, [closeAttempts, spawnPopup]);

  // Phase 1: Initial (0-1.5s) - first popup appears
  useEffect(() => {
    if (phase !== "initial") return;

    const timeout = setTimeout(() => spawnPopup(false), 300);
    const nextPhase = setTimeout(() => setPhase("building"), 1500);

    return () => {
      clearTimeout(timeout);
      clearTimeout(nextPhase);
    };
  }, [phase, spawnPopup]);

  // Phase 2: Building (1.5-3s) - a few more popups
  useEffect(() => {
    if (phase !== "building") return;

    setShakeIntensity(1);

    const intervals: NodeJS.Timeout[] = [];
    intervals.push(setTimeout(() => spawnPopup(false), 400));
    intervals.push(setTimeout(() => spawnPopup(false), 900));

    // If user is interacting (clicking close), wait longer before auto-advancing
    const waitTime = isUserInteracting.current ? 3000 : 1500;
    const nextPhase = setTimeout(() => setPhase("peak"), waitTime);

    return () => {
      intervals.forEach(clearTimeout);
      clearTimeout(nextPhase);
    };
  }, [phase, spawnPopup]);

  // Phase 3: Peak (3-4s) - slight escalation
  useEffect(() => {
    if (phase !== "peak") return;

    setShakeIntensity(2);

    // Just one or two more if user hasn't spawned too many
    if (popups.length < 8) {
      setTimeout(() => spawnPopup(false), 300);
    }

    // Brief glitch
    const glitchTimeout = setTimeout(() => {
      setScreenGlitch(true);
      setTimeout(() => setScreenGlitch(false), 100);
    }, 600);

    // If user is actively clicking, extend the chaos
    const waitTime = isUserInteracting.current ? 2500 : 1000;
    const nextPhase = setTimeout(() => {
      setShakeIntensity(0);
      setPhase("collapse");
    }, waitTime);

    return () => {
      clearTimeout(glitchTimeout);
      clearTimeout(nextPhase);
    };
  }, [phase, popups.length, spawnPopup]);

  // Phase 4: Collapse (4-5s) - Go straight to completion
  useEffect(() => {
    if (phase !== "collapse") return;

    // Immediately trigger completion (which triggers BIOS)
    const nextPhase = setTimeout(() => {
        setPhase("blackout"); // Set blackout state for cleanup
        onComplete();
    }, 200);

    return () => clearTimeout(nextPhase);
  }, [phase, onComplete]);

  // Phase 5: Blackout (Cleanup only)
  useEffect(() => {
    if (phase !== "blackout") return;
    // No delay here, handled in Phase 4
  }, [phase]);

  // Shake style
  const shakeStyle = useMemo(() => {
    if (shakeIntensity === 0) return {};
    return {
      animation: `shake ${0.15}s infinite`,
    };
  }, [shakeIntensity]);

  return (
    <motion.div
      className="fixed inset-0 z-[400] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "blackout" ? 0 : 1 }}
      transition={{ duration: phase === "blackout" ? 1 : 0.3 }}
      style={shakeStyle}
    >
      {/* XP Desktop Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, 
              #3A6EA5 0%,
              #6B9BC3 15%,
              #87CEEB 30%,
              #98D4E8 45%,
              #7CB854 50%,
              #5DA03C 55%,
              #4A9030 65%,
              #3D7A28 80%,
              #2D6420 100%
            )
          `,
        }}
      />

      {/* Subtle screen glitch */}
      <AnimatePresence>
        {screenGlitch && (
          <motion.div
            className="absolute inset-0 z-[500] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 2px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Popups */}
      <AnimatePresence mode="sync">
        {phase !== "blackout" && popups.map((popup, index) => (
          <motion.div
            key={popup.id}
            className="absolute z-[450]"
            style={{
              left: popup.position.x,
              top: popup.position.y,
              zIndex: 450 + index, // Stack newer popups on top
            }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={phase === "collapse" ? {
              opacity: 0,
              scale: 0.8,
              y: 20,
            } : {
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: phase === "collapse" ? 0.6 : 0.25,
              delay: phase === "collapse" ? index * 0.05 : 0,
              ease: "easeOut",
            }}
          >
            <XPErrorWindow
              title={popup.message.title}
              message={popup.message.message}
              details={popup.message.details}
              onClose={() => handleCloseAttempt(popup.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* CRT turn-off effect */}
      <AnimatePresence>
        {phase === "blackout" && (
          <>
            <motion.div
              className="absolute left-0 right-0 bg-white z-[700]"
              style={{ top: "50%", height: 2 }}
              initial={{ scaleX: 1, opacity: 1 }}
              animate={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
            <motion.div
              className="absolute inset-0 bg-white z-[650]"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Shake keyframes */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-${shakeIntensity}px, 0); }
          50% { transform: translate(${shakeIntensity}px, 0); }
          75% { transform: translate(-${shakeIntensity}px, 0); }
        }
      `}</style>
    </motion.div>
  );
}
