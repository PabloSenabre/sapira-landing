"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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

// Smooth easing curves for cinematic feel
const smoothEasing = [0.4, 0, 0.2, 1];
const gentleEasing = [0.25, 0.1, 0.25, 1];

export default function SoftwareEvolution({ isOpen, onClose }: SoftwareEvolutionProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all timers helper
  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Phase progression with smoother timing
  useEffect(() => {
    if (!isOpen) {
      setPhase("intro");
      setIsTransitioning(false);
      clearAllTimers();
      return;
    }

    clearAllTimers();
    
    timersRef.current = [
      setTimeout(() => setPhase("era1"), 400),
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setPhase("era2");
          setIsTransitioning(false);
        }, 600);
      }, 7500),
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setPhase("era3");
          setIsTransitioning(false);
        }, 600);
      }, 14700),
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setPhase("final");
          setIsTransitioning(false);
        }, 600);
      }, 21900),
    ];

    return clearAllTimers;
  }, [isOpen]);

  // Keyboard to skip with smoother transition
  useEffect(() => {
    if (!isOpen || isTransitioning) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        setIsTransitioning(true);
        
        const nextPhase = () => {
          if (phase === "era1") setPhase("era2");
          else if (phase === "era2") setPhase("era3");
          else if (phase === "era3") setPhase("final");
          setIsTransitioning(false);
        };
        
        setTimeout(nextPhase, 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, phase, isTransitioning, onClose]);

  if (!isOpen) return null;

  // Transition durations - longer for smoother feel
  const transitionDuration = prefersReducedMotion ? 0.2 : 0.6;

  return (
    <motion.div
      className="mt-16 mb-8 flex justify-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ 
        type: "spring", 
        damping: 28, 
        stiffness: 180,
        mass: 1.2 
      }}
      style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        willChange: "transform, opacity",
      }}
    >
      {/* iPad Pro Landscape - Edge to edge */}
      <div
        className="relative"
        style={{
          width: "min(calc(100vw - 80px), 1000px)",
          height: "520px",
          transform: "translateZ(0)", // Force GPU layer
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
            transform: "translateZ(0)",
          }}
        >
          {/* Screen - edge to edge display - landscape */}
          <div
            className="relative w-full h-full rounded-[10px] md:rounded-[16px] overflow-hidden"
            style={{ 
              background: "linear-gradient(180deg, #0c0c0c 0%, #000 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Camera dot (left side for landscape) */}
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ background: "#1a1a1a", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.9)" }}
            />

            {/* Screen content - with GPU-optimized container */}
            <div 
              className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
              style={{
                transform: "translateZ(0)",
                willChange: "contents",
              }}
            >
              {/* Smooth crossfade transitions between phases */}
              <AnimatePresence mode="sync">
                {phase === "era1" && (
                  <SingleEraView
                    key="era1"
                    era={ERAS[0]}
                    eraIndex={0}
                    transitionDuration={transitionDuration}
                  />
                )}
                {phase === "era2" && (
                  <SingleEraView
                    key="era2"
                    era={ERAS[1]}
                    eraIndex={1}
                    transitionDuration={transitionDuration}
                  />
                )}
                {phase === "era3" && (
                  <SingleEraView
                    key="era3"
                    era={ERAS[2]}
                    eraIndex={2}
                    transitionDuration={transitionDuration}
                  />
                )}
                {phase === "final" && (
                  <FinalSlideView 
                    key="final" 
                    onClose={onClose} 
                    transitionDuration={transitionDuration}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Progress dots - with smoother transitions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {["era1", "era2", "era3", "final"].map((p, i) => {
                const isActive = 
                  (phase === "era1" && i === 0) ||
                  (phase === "era2" && i === 1) ||
                  (phase === "era3" && i === 2) ||
                  (phase === "final" && i === 3);
                
                return (
                  <motion.div
                    key={p}
                    className="h-1 rounded-full"
                    initial={false}
                    animate={{
                      width: isActive ? 16 : 6,
                      backgroundColor: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.3)",
                    }}
                    transition={{
                      duration: 0.4,
                      ease: gentleEasing,
                    }}
                  />
                );
              })}
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

interface SingleEraViewProps {
  era: typeof ERAS[0];
  eraIndex: number;
  transitionDuration: number;
}

function SingleEraView({ era, eraIndex, transitionDuration }: SingleEraViewProps) {
  const [stage, setStage] = useState(0);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear existing timers on remount
    timersRef.current.forEach(clearTimeout);
    setStage(0);
    
    // Cinematic sequence: smooth and deliberate
    timersRef.current = [
      setTimeout(() => setStage(1), 350),   // Show period
      setTimeout(() => setStage(2), 2100),  // Show headline
      setTimeout(() => setStage(3), 4600),  // Show visual + ratio
      setTimeout(() => setStage(4), 5900),  // Show description
    ];
    
    return () => timersRef.current.forEach(clearTimeout);
  }, [era.id]); // Depend on era.id to properly reset on era change

  // Smoother easing for internal animations
  const smoothEase = [0.4, 0, 0.2, 1];
  const gentleEase = [0.25, 0.1, 0.25, 1];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center w-full px-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ 
        duration: transitionDuration,
        ease: smoothEase,
      }}
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Stage 1: Period - sets the scene prominently */}
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: stage >= 1 ? 1 : 0, 
          y: stage >= 1 ? 0 : -20 
        }}
        transition={{ 
          duration: 0.7, 
          ease: gentleEase,
        }}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-sm md:text-base font-light tracking-[0.5em] uppercase">
            {era.period}
          </span>
          <motion.div 
            className="w-8 h-px bg-white/30"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: stage >= 1 ? 1 : 0,
              opacity: stage >= 1 ? 1 : 0,
            }}
            transition={{ delay: 0.25, duration: 0.5, ease: gentleEase }}
            style={{ transformOrigin: "center" }}
          />
        </div>
      </motion.div>

      {/* Stage 2: Headline - tells the story with patience */}
      <motion.div
        className="flex flex-col items-center px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: stage >= 2 && stage < 3 ? 1 : 0, 
          y: stage >= 2 && stage < 3 ? 0 : (stage >= 3 ? -20 : 20),
        }}
        transition={{ 
          duration: 0.8, 
          ease: smoothEase,
        }}
        style={{ 
          willChange: "transform, opacity",
          pointerEvents: stage >= 2 && stage < 3 ? "auto" : "none",
        }}
      >
        <h2
          className="text-white text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-xl leading-relaxed text-center"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {era.headline}
        </h2>
        <motion.p
          className="text-white/50 text-base md:text-lg mt-6 italic max-w-md text-center"
          style={{ fontFamily: "Georgia, serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 2 && stage < 3 ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: gentleEase }}
        >
          {era.narrative}
        </motion.p>
      </motion.div>

      {/* Stage 3: Visual + Ratio - the reveal */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: stage >= 3 ? 1 : 0,
          scale: stage >= 3 ? 1 : 0.9,
        }}
        transition={{ 
          duration: 0.7, 
          ease: smoothEase,
        }}
        style={{ 
          willChange: "transform, opacity",
          pointerEvents: stage >= 3 ? "auto" : "none",
        }}
      >
        {/* Visual */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ 
            opacity: stage >= 3 ? 1 : 0, 
            scale: stage >= 3 ? 1 : 0.85 
          }}
          transition={{ duration: 0.6, ease: smoothEase }}
          style={{ willChange: "transform, opacity" }}
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
          animate={{ 
            opacity: stage >= 3 ? 1 : 0, 
            scale: stage >= 3 ? 1 : 1.1 
          }}
          transition={{ delay: 0.2, duration: 0.6, ease: smoothEase }}
        >
          {era.ratio}
        </motion.span>
      </motion.div>

      {/* Stage 4: Description - the takeaway */}
      <motion.p
        className="absolute bottom-14 left-1/2 -translate-x-1/2 text-white/50 text-sm md:text-base max-w-sm text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ 
          opacity: stage >= 4 ? 1 : 0, 
          y: stage >= 4 ? 0 : 12 
        }}
        transition={{ duration: 0.6, ease: gentleEase }}
        style={{ willChange: "transform, opacity" }}
      >
        {era.description}
      </motion.p>

      {/* Transition hint for non-final eras */}
      {eraIndex < 2 && (
        <motion.div
          className="absolute bottom-5 right-8 flex items-center gap-2 text-white/25 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 4 ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: gentleEase }}
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

interface FinalSlideViewProps {
  onClose: () => void;
  transitionDuration: number;
}

function FinalSlideView({ onClose, transitionDuration }: FinalSlideViewProps) {
  // Smoother easing
  const smoothEase = [0.4, 0, 0.2, 1];
  const gentleEase = [0.25, 0.1, 0.25, 1];
  
  return (
    <motion.div
      className="absolute inset-0 w-full h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ 
        duration: transitionDuration,
        ease: smoothEase,
      }}
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Close button */}
      <motion.button
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all z-10"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4, ease: gentleEase }}
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.15 + i * 0.1,
              duration: 0.6,
              ease: smoothEase,
            }}
            style={{ willChange: "transform, opacity" }}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: gentleEase }}
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
// ERA VISUALS - GPU optimized
// ============================================

// Smooth spring config for visuals
const visualSpring = {
  type: "spring" as const,
  damping: 22,
  stiffness: 300,
  mass: 0.8,
};

const gentleEase = [0.25, 0.1, 0.25, 1];

function EraVisual1({ small = false }: { small?: boolean }) {
  const dotSize = small ? "w-9 h-9 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16";
  const lineWidth = small ? 32 : 50;

  return (
    <div className="flex items-center gap-2 gpu-accelerated">
      <motion.div
        className={`${dotSize} rounded-full bg-white`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...visualSpring, delay: 0.1 }}
        style={{ willChange: "transform" }}
      />
      <motion.div
        className="h-[2px] bg-white/50 rounded-full"
        style={{ width: lineWidth, transformOrigin: "left", willChange: "transform" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: gentleEase }}
      />
      <motion.div
        className={`${dotSize} rounded-full bg-white`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...visualSpring, delay: 0.3 }}
        style={{ willChange: "transform" }}
      />
    </div>
  );
}

function EraVisual2({ small = false }: { small?: boolean }) {
  const dotSize = small ? "w-7 h-7 md:w-10 md:h-10" : "w-12 h-12 md:w-14 md:h-14";
  const gridDotSize = small ? "w-2 h-2 md:w-2.5 md:h-2.5" : "w-3 h-3 md:w-3.5 md:h-3.5";

  // Reduced number of dots with staggered animation for performance
  return (
    <div 
      className="flex items-center gap-1.5 md:gap-2 gpu-accelerated"
    >
      <motion.div
        className={`${dotSize} rounded-full bg-white flex-shrink-0`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...visualSpring, delay: 0.1 }}
        style={{ willChange: "transform" }}
      />
      <motion.div
        className="h-[2px] bg-white/30 rounded-full flex-shrink-0"
        style={{ width: small ? 8 : 16, transformOrigin: "left", willChange: "transform" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3, ease: gentleEase }}
      />
      <motion.div 
        className={`grid grid-cols-6 ${small ? "gap-[2px]" : "gap-1"} gpu-accelerated`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: gentleEase }}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Use CSS animation from globals.css for grid dots - better performance */}
        {Array.from({ length: 36 }, (_, i) => (
          <div
            key={i}
            className={`${gridDotSize} rounded-full bg-white`}
            style={{
              opacity: 0,
              transform: "scale(0) translateZ(0)",
              animation: `dotAppear 0.3s ease-out forwards`,
              animationDelay: `${0.25 + i * 0.008}s`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function EraVisual3({ small = false }: { small?: boolean }) {
  const dotSize = small ? "w-9 h-9 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16";
  const lineWidth = small ? 32 : 50;

  return (
    <div className="flex items-center gap-2 relative gpu-accelerated">
      <motion.div
        className={`relative ${dotSize} rounded-full bg-white`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...visualSpring, delay: 0.1 }}
        style={{ 
          boxShadow: "0 0 20px rgba(255,255,255,0.4)",
          willChange: "transform",
        }}
      >
        {/* Pulse effect using CSS class from globals.css */}
        <div className="absolute inset-0 rounded-full bg-white era-pulse" />
      </motion.div>

      <motion.div
        className="relative h-[2px] bg-white rounded-full overflow-hidden"
        style={{ width: lineWidth, transformOrigin: "left", willChange: "transform" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: gentleEase }}
      >
        {/* Shimmer effect using CSS class from globals.css */}
        <div
          className={`absolute inset-y-0 w-4 ${small ? "era-shimmer-small" : "era-shimmer"}`}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
          }}
        />
      </motion.div>

      <motion.div
        className={`relative ${dotSize} rounded-full bg-white`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...visualSpring, delay: 0.3 }}
        style={{ 
          boxShadow: "0 0 20px rgba(255,255,255,0.4)",
          willChange: "transform",
        }}
      >
        {/* Pulse effect with offset using CSS class */}
        <div className="absolute inset-0 rounded-full bg-white era-pulse-delay" />
      </motion.div>
    </div>
  );
}
