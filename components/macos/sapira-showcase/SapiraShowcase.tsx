"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShowcaseTransition, { ShowcaseProgress, ShowcaseControls } from "./ShowcaseTransition";
import WhatWeDoApp from "../apps/WhatWeDoApp";
import FaroApp from "../apps/FaroApp";
import EquityApp from "../apps/EquityApp";

// Showcase states
type ShowcaseState = 
  | "idle"
  | "intro"
  | "what-we-do"
  | "transition-1"
  | "pharo"
  | "transition-2"
  | "equity"
  | "outro";

const SHOWCASE_MODULES: { state: ShowcaseState; label: string }[] = [
  { state: "what-we-do", label: "What We Do" },
  { state: "pharo", label: "Pharo Platform" },
  { state: "equity", label: "Equity" },
];

interface SapiraShowcaseProps {
  isActive: boolean;
  onClose: () => void;
}

export default function SapiraShowcase({ isActive, onClose }: SapiraShowcaseProps) {
  const [state, setState] = useState<ShowcaseState>("idle");
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  // Reset state when showcase opens
  useEffect(() => {
    if (isActive) {
      setState("intro");
      setCurrentModuleIndex(0);
    } else {
      setState("idle");
    }
  }, [isActive]);

  // Intro -> first module transition
  useEffect(() => {
    if (state === "intro") {
      const timer = setTimeout(() => {
        setState("what-we-do");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, state, currentModuleIndex]);

  const goToNext = useCallback(() => {
    if (state === "what-we-do") {
      setState("transition-1");
      setTimeout(() => {
        setState("pharo");
        setCurrentModuleIndex(1);
      }, 1500);
    } else if (state === "pharo") {
      setState("transition-2");
      setTimeout(() => {
        setState("equity");
        setCurrentModuleIndex(2);
      }, 1500);
    } else if (state === "equity") {
      setState("outro");
      setTimeout(onClose, 1500);
    }
  }, [state, onClose]);

  const goToPrev = useCallback(() => {
    if (state === "pharo") {
      setState("what-we-do");
      setCurrentModuleIndex(0);
    } else if (state === "equity") {
      setState("pharo");
      setCurrentModuleIndex(1);
    }
  }, [state]);

  const handleModuleComplete = useCallback(() => {
    goToNext();
  }, [goToNext]);

  if (!isActive && state === "idle") return null;

  const canGoNext = state === "what-we-do" || state === "pharo" || state === "equity";
  const canGoPrev = state === "pharo" || state === "equity";

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[500] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Intro animation */}
          <AnimatePresence>
            {state === "intro" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Sapira logo/text */}
                  <motion.h1
                    className="text-white text-5xl md:text-6xl font-light tracking-tight mb-4"
                    style={{ fontFamily: "Georgia, serif" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    Sapira
                  </motion.h1>

                  <motion.p
                    className="text-white/40 text-sm tracking-[0.3em] uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    Discover our platform
                  </motion.p>

                  {/* Loading indicator */}
                  <motion.div
                    className="mt-8 flex justify-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-white/40"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* What We Do module */}
          <AnimatePresence>
            {state === "what-we-do" && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <WhatWeDoApp 
                  autoPlay={false} 
                  onComplete={handleModuleComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transition 1 */}
          <ShowcaseTransition 
            isActive={state === "transition-1"} 
            nextLabel="Pharo Platform"
          />

          {/* Pharo module */}
          <AnimatePresence>
            {state === "pharo" && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FaroApp />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transition 2 */}
          <ShowcaseTransition 
            isActive={state === "transition-2"} 
            nextLabel="Equity"
          />

          {/* Equity module */}
          <AnimatePresence>
            {state === "equity" && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <EquityApp />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Outro animation */}
          <AnimatePresence>
            {state === "outro" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h2
                    className="text-white text-3xl font-light mb-4"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Thank you
                  </motion.h2>
                  <p className="text-white/40 text-sm">Returning to desktop...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls - visible during module viewing */}
          {(state === "what-we-do" || state === "pharo" || state === "equity") && (
            <ShowcaseControls
              onNext={goToNext}
              onPrev={goToPrev}
              onExit={onClose}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
            />
          )}

          {/* Progress indicator */}
          {(state === "what-we-do" || state === "pharo" || state === "equity") && (
            <ShowcaseProgress
              current={currentModuleIndex}
              total={SHOWCASE_MODULES.length}
              labels={SHOWCASE_MODULES.map(m => m.label)}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export a button component to trigger the showcase
export function DiscoverSapiraButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      className="px-5 py-2.5 rounded-full flex items-center gap-2"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(20px)",
      }}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 8px 32px rgba(0,200,200,0.15)",
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Animated dot */}
      <motion.div
        className="w-2 h-2 rounded-full bg-cyan-400"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-white/80 text-sm font-medium">Discover Sapira</span>
    </motion.button>
  );
}

