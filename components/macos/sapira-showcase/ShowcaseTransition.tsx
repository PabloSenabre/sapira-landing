"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ShowcaseTransitionProps {
  isActive: boolean;
  nextLabel?: string;
  onComplete?: () => void;
}

export default function ShowcaseTransition({ 
  isActive, 
  nextLabel,
  onComplete 
}: ShowcaseTransitionProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onAnimationComplete={(definition) => {
            // Only call onComplete when the animation is finishing the "animate" phase
            if (definition === "animate" && onComplete) {
              const timer = setTimeout(onComplete, 800);
              return () => clearTimeout(timer);
            }
          }}
        >
          {/* Subtle vignette */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          {/* Next section label */}
          {nextLabel && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Decorative line above */}
              <motion.div
                className="w-8 h-px bg-white/20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              />

              {/* Label */}
              <span 
                className="text-white/50 text-xs tracking-[0.4em] uppercase"
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
              >
                {nextLabel}
              </span>

              {/* Decorative line below */}
              <motion.div
                className="w-8 h-px bg-white/20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              />

              {/* Loading dots animation */}
              <motion.div
                className="flex gap-1 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-white/30"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simpler fade transition for entering/exiting showcase
export function ShowcaseFade({ 
  isActive, 
  children 
}: { 
  isActive: boolean; 
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Progress indicator for the showcase
export function ShowcaseProgress({ 
  current, 
  total,
  labels,
}: { 
  current: number; 
  total: number;
  labels?: string[];
}) {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`transition-all duration-300 ${
            i === current
              ? "w-6 h-1.5 bg-white rounded-full"
              : i < current
              ? "w-1.5 h-1.5 bg-white/60 rounded-full"
              : "w-1.5 h-1.5 bg-white/20 rounded-full hover:bg-white/40"
          }`}
          title={labels?.[i]}
        />
      ))}
    </motion.div>
  );
}

// Controls overlay for the showcase
export function ShowcaseControls({
  onNext,
  onPrev,
  onExit,
  canGoNext,
  canGoPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}) {
  return (
    <motion.div
      className="fixed top-6 right-6 z-[90] flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      {/* Navigation buttons */}
      <div className="flex items-center gap-1 mr-4">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            canGoPrev 
              ? "text-white/60 hover:text-white hover:bg-white/10" 
              : "text-white/20 cursor-not-allowed"
          }`}
        >
          ←
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            canGoNext 
              ? "text-white/60 hover:text-white hover:bg-white/10" 
              : "text-white/20 cursor-not-allowed"
          }`}
        >
          →
        </button>
      </div>

      {/* Exit button */}
      <button
        onClick={onExit}
        className="px-3 py-1.5 rounded-lg text-white/40 text-xs hover:text-white hover:bg-white/10 transition-colors"
      >
        ESC to exit
      </button>
    </motion.div>
  );
}

