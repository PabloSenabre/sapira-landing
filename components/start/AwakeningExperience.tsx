"use client";

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LightCursor from "./LightCursor";
import ParticleField from "./ParticleField";
import OrganicForm from "./OrganicForm";
import GeometricForm from "./GeometricForm";
import AudioEngine from "./AudioEngine";
import EchoEffect from "./EchoEffect";

// ============================================
// TYPES & CONTEXT
// ============================================

type ExperiencePhase = "silence" | "revelation" | "choice" | "crossing" | "complete";
type SelectedPath = "organic" | "geometric" | null;

interface ExperienceState {
  phase: ExperiencePhase;
  energy: number; // 0-100, accumulated from movement
  mousePosition: { x: number; y: number };
  hoveredForm: SelectedPath;
  hoverDuration: number;
  selectedPath: SelectedPath;
  audioEnabled: boolean;
  lastMoveTime: number;
  idleTime: number;
}

interface ExperienceContextType extends ExperienceState {
  setHoveredForm: (form: SelectedPath) => void;
  selectPath: (path: SelectedPath) => void;
  enableAudio: () => void;
}

const ExperienceContext = createContext<ExperienceContextType | null>(null);

export const useExperience = () => {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used within AwakeningExperience");
  return ctx;
};

// ============================================
// AWAKENING EXPERIENCE
// ============================================

export default function AwakeningExperience() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Core state
  const [state, setState] = useState<ExperienceState>({
    phase: "silence",
    energy: 0,
    mousePosition: { x: 0, y: 0 },
    hoveredForm: null,
    hoverDuration: 0,
    selectedPath: null,
    audioEnabled: false,
    lastMoveTime: Date.now(),
    idleTime: 0,
  });

  // Track mouse movement and accumulate energy
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate movement distance
    const dx = x - lastMouseRef.current.x;
    const dy = y - lastMouseRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    lastMouseRef.current = { x, y };

    setState(prev => {
      // Only accumulate energy in silence phase
      const energyGain = prev.phase === "silence" ? Math.min(distance * 0.15, 2) : 0;
      const newEnergy = Math.min(prev.energy + energyGain, 100);

      // Transition to revelation when enough energy
      let newPhase = prev.phase;
      if (prev.phase === "silence" && newEnergy >= 60) {
        newPhase = "revelation";
      }

      return {
        ...prev,
        mousePosition: { x, y },
        energy: newEnergy,
        phase: newPhase,
        lastMoveTime: Date.now(),
        idleTime: 0,
      };
    });
  }, []);

  // Track idle time
  useEffect(() => {
    const idleInterval = setInterval(() => {
      setState(prev => {
        const newIdleTime = Date.now() - prev.lastMoveTime;
        return { ...prev, idleTime: newIdleTime };
      });
    }, 100);

    return () => clearInterval(idleInterval);
  }, []);

  // Auto-transition from revelation to choice after forms appear
  useEffect(() => {
    if (state.phase === "revelation") {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, phase: "choice" }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.phase]);

  // Handle hover duration tracking
  useEffect(() => {
    if (state.hoveredForm && state.phase === "choice") {
      hoverTimerRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          hoverDuration: prev.hoverDuration + 100,
        }));
      }, 100);
    } else {
      if (hoverTimerRef.current) {
        clearInterval(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      setState(prev => ({ ...prev, hoverDuration: 0 }));
    }

    return () => {
      if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
    };
  }, [state.hoveredForm, state.phase]);

  // Set up mouse move listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Context methods
  const setHoveredForm = useCallback((form: SelectedPath) => {
    setState(prev => ({ ...prev, hoveredForm: form }));
  }, []);

  const selectPath = useCallback((path: SelectedPath) => {
    if (state.phase !== "choice") return;
    
    setState(prev => ({ ...prev, selectedPath: path, phase: "crossing" }));

    // Navigate after transition
    setTimeout(() => {
      setState(prev => ({ ...prev, phase: "complete" }));
      setTimeout(() => {
        // Stop audio before any redirect
        setState(prev => ({ ...prev, audioEnabled: false }));
        
        setTimeout(() => {
          if (path === "organic") {
            window.open("https://calendly.com/sapira", "_blank");
            setState(prev => ({ ...prev, phase: "choice", selectedPath: null }));
          } else {
            router.push("/pharo");
          }
        }, 150);
      }, 500);
    }, 2000);
  }, [state.phase, router]);

  const enableAudio = useCallback(() => {
    setState(prev => ({ ...prev, audioEnabled: true }));
  }, []);

  const contextValue: ExperienceContextType = {
    ...state,
    setHoveredForm,
    selectPath,
    enableAudio,
  };

  return (
    <ExperienceContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className="fixed inset-0 bg-black overflow-hidden"
        style={{ cursor: "none" }}
      >
        {/* Audio Engine */}
        <AudioEngine />

        {/* Light Cursor with Trail */}
        <LightCursor />

        {/* Particle Field */}
        <ParticleField />

        {/* Echo Effect (double-click easter egg) */}
        <EchoEffect />

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          {/* Silence Phase - Awakening Text */}
          {state.phase === "silence" && state.energy > 30 && (
            <motion.div
              key="awakening-text"
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <p
                className="text-center italic"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(1rem, 3vw, 1.5rem)",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                Algo despierta...
              </p>
            </motion.div>
          )}

          {/* Revelation & Choice Phase - Forms and Text */}
          {(state.phase === "revelation" || state.phase === "choice") && (
            <motion.div
              key="forms-container"
              className="absolute inset-0 flex items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Central Text */}
              <motion.div
                className="absolute top-1/4 left-0 right-0 text-center pointer-events-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <p
                  className="italic"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "clamp(1.2rem, 4vw, 2rem)",
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.05em",
                  }}
                >
                  Dos caminos se abren ante ti
                </p>
              </motion.div>

              {/* Forms Container */}
              <div className="flex items-center justify-center gap-32 md:gap-48 lg:gap-64">
                <OrganicForm />
                <GeometricForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crossing Transition Overlay */}
        <AnimatePresence>
          {state.phase === "crossing" && (
            <motion.div
              key="crossing-overlay"
              className="fixed inset-0 z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: state.selectedPath === "organic"
                  ? "radial-gradient(circle at center, rgba(255,250,245,0.08), rgba(0,0,0,0.95))"
                  : "radial-gradient(circle at center, rgba(240,245,255,0.08), rgba(0,0,0,0.95))",
              }}
            >
              {/* Expanding light from center */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{
                  width: "300vmax",
                  height: "300vmax",
                  opacity: [0, 0.8, 1],
                }}
                transition={{ duration: 1.8, ease: "easeIn" }}
                style={{
                  background: state.selectedPath === "organic"
                    ? "radial-gradient(circle, rgba(255,252,248,0.25) 0%, rgba(255,250,245,0.1) 30%, transparent 70%)"
                    : "radial-gradient(circle, rgba(245,248,255,0.25) 0%, rgba(240,245,255,0.1) 30%, transparent 70%)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complete - White flash */}
        <AnimatePresence>
          {state.phase === "complete" && (
            <motion.div
              key="complete-flash"
              className="fixed inset-0 z-50 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Audio Enable Button */}
        {!state.audioEnabled && (
          <motion.button
            className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full text-sm"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)",
            }}
            whileHover={{
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
            onClick={enableAudio}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            🔇 Enable sound
          </motion.button>
        )}

        {/* Skip button (for testing/accessibility) */}
        {state.phase === "silence" && (
          <motion.button
            className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full text-xs"
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.15)",
            }}
            whileHover={{ color: "rgba(255,255,255,0.4)" }}
            onClick={() => setState(prev => ({ ...prev, phase: "revelation", energy: 100 }))}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5 }}
          >
            Skip →
          </motion.button>
        )}

        {/* Back to Home */}
        <motion.a
          href="/"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.3)",
          }}
          whileHover={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.6)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </motion.a>

        {/* Energy indicator (debug/subtle) */}
        {state.phase === "silence" && (
          <div className="fixed bottom-6 left-6 z-50">
            <div 
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: `${state.energy}px`,
                background: `rgba(255,255,255,${0.1 + state.energy * 0.003})`,
              }}
            />
          </div>
        )}
      </div>
    </ExperienceContext.Provider>
  );
}

