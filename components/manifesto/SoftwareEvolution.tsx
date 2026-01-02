"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SoftwareEvolutionProps {
  isOpen: boolean;
  onClose: () => void;
}

// The three eras of software - with narrative context
const ERAS = [
  {
    id: 1,
    period: "Before 2000s",
    title: "Custom Operating Systems",
    ratio: "1:1",
    headline: "Companies built their own software",
    description: "Expensive, but made to measure.",
    narrative: "Each company, one unique system.",
  },
  {
    id: 2,
    period: "2000s — Today",
    title: "The SaaS Era",
    ratio: "1:1000",
    headline: "Companies bought cloud software",
    description: "Accessible, but one-size-fits-all.",
    narrative: "One product, thousands of companies.",
  },
  {
    id: 3,
    period: "Now",
    title: "AI-native Operating Systems",
    ratio: "1:1",
    headline: "Companies develop intelligent systems",
    description: "Accessible AND made to measure.",
    narrative: "From reactive tools to proactive partners.",
  },
];

type Phase = "intro" | "era1" | "era2" | "era3" | "final";

export default function SoftwareEvolution({ isOpen, onClose }: SoftwareEvolutionProps) {
  const [phase, setPhase] = useState<Phase>("intro");

  // Phase progression
  useEffect(() => {
    if (!isOpen) {
      setPhase("intro");
      return;
    }

    const timers = [
      setTimeout(() => setPhase("era1"), 300),
      setTimeout(() => setPhase("era2"), 7500),
      setTimeout(() => setPhase("era3"), 14700),
      setTimeout(() => setPhase("final"), 21900),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isOpen]);

  // Keyboard to skip
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        if (phase === "era1") setPhase("era2");
        else if (phase === "era2") setPhase("era3");
        else if (phase === "era3") setPhase("final");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, phase, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="mt-16 mb-8 flex justify-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{
        // Break out of parent container to center on viewport
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
    >
      {/* iPad Pro Landscape - Edge to edge */}
      <div
        className="relative"
        style={{
          width: "min(calc(100vw - 80px), 1000px)",
          height: "520px",
        }}
      >
        {/* iPad Pro body - sleek dark aluminum frame - landscape */}
        <div
          className="absolute inset-0 rounded-[16px] md:rounded-[22px]"
          style={{
            background: "linear-gradient(145deg, #2a2a2c 0%, #1a1a1a 50%, #0f0f0f 100%)",
            padding: "10px 14px",
            boxShadow: `
              0 60px 120px rgba(0,0,0,0.6),
              0 25px 50px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.6)
            `,
          }}
        >
          {/* Screen - edge to edge display - landscape */}
          <div
            className="relative w-full h-full rounded-[10px] md:rounded-[16px] overflow-hidden"
            style={{ 
              background: "linear-gradient(180deg, #0c0c0c 0%, #000 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Camera dot (left side for landscape) */}
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ background: "#1a1a1a", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.9)" }}
            />

            {/* Screen content - compact for landscape */}
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
              {/* All slides in single AnimatePresence for smooth transitions */}
              <AnimatePresence mode="wait">
                {phase === "era1" && (
                  <SingleEraView
                    key="era1"
                    era={ERAS[0]}
                    eraIndex={0}
                  />
                )}
                {phase === "era2" && (
                  <SingleEraView
                    key="era2"
                    era={ERAS[1]}
                    eraIndex={1}
                  />
                )}
                {phase === "era3" && (
                  <SingleEraView
                    key="era3"
                    era={ERAS[2]}
                    eraIndex={2}
                  />
                )}
                {phase === "final" && (
                  <FinalSlideView key="final" onClose={onClose} />
                )}
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {["era1", "era2", "era3", "final"].map((p, i) => (
                <div
                  key={p}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    (phase === "era1" && i === 0) ||
                    (phase === "era2" && i === 1) ||
                    (phase === "era3" && i === 2) ||
                    (phase === "final" && i === 3)
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}

// ============================================
// SINGLE ERA VIEW - One era at a time
// ============================================

function SingleEraView({ era, eraIndex }: { era: typeof ERAS[0]; eraIndex: number }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Cinematic sequence: slow and deliberate
    const timers = [
      setTimeout(() => setStage(1), 300),   // Show period
      setTimeout(() => setStage(2), 2000),  // Show headline
      setTimeout(() => setStage(3), 4500),  // Show visual + ratio
      setTimeout(() => setStage(4), 5800),  // Show description
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center w-full px-6 h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Stage 1: Period - sets the scene prominently */}
      <AnimatePresence>
        {stage >= 1 && (
          <motion.div
            className="absolute top-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-white/60 text-sm md:text-base font-light tracking-[0.5em] uppercase">
                {era.period}
              </span>
              <motion.div 
                className="w-8 h-px bg-white/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 2: Headline - tells the story with patience */}
      <AnimatePresence>
        {stage >= 2 && stage < 3 && (
          <motion.div
            className="flex flex-col items-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.h2
              className="text-white text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-xl leading-relaxed text-center"
              style={{ fontFamily: "Georgia, serif" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {era.headline}
            </motion.h2>
            <motion.p
              className="text-white/50 text-base md:text-lg mt-6 italic max-w-md text-center"
              style={{ fontFamily: "Georgia, serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {era.narrative}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3: Visual + Ratio - the reveal */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Visual */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {eraIndex === 0 && <EraVisual1 />}
              {eraIndex === 1 && <EraVisual2 />}
              {eraIndex === 2 && <EraVisual3 />}
            </motion.div>

            {/* Ratio - the big reveal */}
            <motion.span
              className="text-white text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              {era.ratio}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 4: Description - the takeaway */}
      <AnimatePresence>
        {stage >= 4 && (
          <motion.p
            className="absolute bottom-14 left-1/2 -translate-x-1/2 text-white/50 text-sm md:text-base max-w-sm text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {era.description}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Transition hint for non-final eras */}
      {eraIndex < 2 && stage >= 4 && (
        <motion.div
          className="absolute bottom-5 right-8 flex items-center gap-2 text-white/25 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span>Then came...</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================
// FINAL SLIDE VIEW - All 3 eras side by side
// ============================================

function FinalSlideView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="w-full h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Close button */}
      <motion.button
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all z-10"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Three columns - edge to edge */}
      <div className="flex-1 grid grid-cols-3 gap-6 md:gap-12 lg:gap-16 items-start px-8 md:px-16 lg:px-24 py-8">
        {ERAS.map((era, i) => (
          <motion.div
            key={era.id}
            className="flex flex-col items-center text-center h-full"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.12 }}
          >
            {/* Period label - fixed height */}
            <div className="h-6 flex items-center justify-center mb-4">
              <span className="text-white/50 text-[10px] md:text-xs font-mono tracking-widest uppercase">
                {era.period}
              </span>
            </div>

            {/* Visual - fixed height */}
            <div className="h-16 md:h-20 flex items-center justify-center mb-4">
              {i === 0 && <EraVisual1 small />}
              {i === 1 && <EraVisual2 small />}
              {i === 2 && <EraVisual3 small />}
            </div>

            {/* Ratio - fixed height */}
            <div className="h-16 md:h-20 flex items-center justify-center">
              <span
                className={`text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight ${
                  i === 2 ? "text-white" : "text-white/50"
                }`}
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
              >
                {era.ratio}
              </span>
            </div>

            {/* Brand label - fixed height for all columns */}
            <div className="h-8 flex items-center justify-center">
              {i === 2 ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <SapiraLogo />
                </motion.div>
              ) : (
                <span className="text-white/20 text-sm font-light tracking-wider" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
                  {i === 0 ? "Custom" : "SaaS"}
                </span>
              )}
            </div>

            {/* Description - fixed height */}
            <div className="h-20 md:h-24 flex items-start justify-center mt-2">
              <p className="text-white/40 text-[10px] md:text-xs leading-relaxed max-w-[180px]">
                {era.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// SAPIRA LOGO
// ============================================

function SapiraLogo() {
  return (
    <motion.span
      className="text-white text-base md:text-lg font-light tracking-wider"
      style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, type: "spring", damping: 20 }}
    >
      Sapira
    </motion.span>
  );
}

// ============================================
// ERA VISUALS
// ============================================

function EraVisual1({ small = false }: { small?: boolean }) {
  const dotSize = small ? "w-9 h-9 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16";
  const lineWidth = small ? 32 : 50;

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`${dotSize} rounded-full bg-white`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
      />
      <motion.div
        className="h-[2px] bg-white/50 rounded-full"
        style={{ width: lineWidth }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2 }}
      />
      <motion.div
        className={`${dotSize} rounded-full bg-white`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
      />
    </div>
  );
}

function EraVisual2({ small = false }: { small?: boolean }) {
  const dotSize = small ? "w-7 h-7 md:w-10 md:h-10" : "w-12 h-12 md:w-14 md:h-14";
  const gridDotSize = small ? "w-2 h-2 md:w-2.5 md:h-2.5" : "w-3 h-3 md:w-3.5 md:h-3.5";
  const dots = Array.from({ length: 36 }, (_, i) => i);

  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      <motion.div
        className={`${dotSize} rounded-full bg-white flex-shrink-0`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
      />
      <motion.div
        className="h-[2px] bg-white/30 rounded-full flex-shrink-0"
        style={{ width: small ? 8 : 16 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.15 }}
      />
      <div className={`grid grid-cols-6 ${small ? "gap-[2px]" : "gap-1"}`}>
        {dots.map((_, i) => (
          <motion.div
            key={i}
            className={`${gridDotSize} rounded-full bg-white`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2 + i * 0.006,
              type: "spring",
              stiffness: 500,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EraVisual3({ small = false }: { small?: boolean }) {
  const dotSize = small ? "w-9 h-9 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16";
  const lineWidth = small ? 32 : 50;

  return (
    <div className="flex items-center gap-2 relative">
      <motion.div
        className={`relative ${dotSize} rounded-full bg-white`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        style={{ boxShadow: "0 0 20px rgba(255,255,255,0.4)" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-white"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className="relative h-[2px] bg-white rounded-full overflow-hidden"
        style={{ width: lineWidth }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="absolute inset-y-0 w-4"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
          }}
          animate={{ x: [-16, lineWidth + 16] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.div
        className={`relative ${dotSize} rounded-full bg-white`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
        style={{ boxShadow: "0 0 20px rgba(255,255,255,0.4)" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-white"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>
    </div>
  );
}
