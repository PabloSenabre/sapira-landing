"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Experience phases - More granular for detailed storytelling
type PHAROPhase = 
  | "idle"
  | "intro"
  | "problem-1"
  | "problem-2"
  | "solution-intro"
  | "discover-intro"
  | "discover-define"
  | "discover-ingest"
  | "discover-analyze"
  | "discover-rank"
  | "discover-summary"
  | "build-intro"
  | "build-blueprints"
  | "build-fdes"
  | "build-pmo"
  | "build-summary"
  | "control-intro"
  | "control-monitoring"
  | "control-compliance"
  | "control-billing"
  | "control-summary"
  | "timeline"
  | "complete";

interface PHAROExperienceProps {
  isActive: boolean;
  onComplete: () => void;
  theme?: "light" | "dark";
}

// Timeline phases
const PHASE_SEQUENCE: PHAROPhase[] = [
  "intro",
  "problem-1",
  "problem-2",
  "solution-intro",
  "discover-intro",
  "discover-define",
  "discover-ingest",
  "discover-analyze",
  "discover-rank",
  "discover-summary",
  "build-intro",
  "build-blueprints",
  "build-fdes",
  "build-pmo",
  "build-summary",
  "control-intro",
  "control-monitoring",
  "control-compliance",
  "control-billing",
  "control-summary",
  "timeline",
  "complete",
];

// Phase durations in ms - Longer for reading
const PHASE_DURATIONS: Record<PHAROPhase, number> = {
  "idle": 0,
  "intro": 4000,
  "problem-1": 6000,
  "problem-2": 6000,
  "solution-intro": 5000,
  "discover-intro": 4000,
  "discover-define": 6000,
  "discover-ingest": 6000,
  "discover-analyze": 6500,
  "discover-rank": 6000,
  "discover-summary": 5000,
  "build-intro": 4000,
  "build-blueprints": 6000,
  "build-fdes": 6500,
  "build-pmo": 6000,
  "build-summary": 5000,
  "control-intro": 4000,
  "control-monitoring": 6000,
  "control-compliance": 6000,
  "control-billing": 6000,
  "control-summary": 5000,
  "timeline": 7000,
  "complete": 99999999, // Stay on complete until user closes
};

// Section definitions for navigation
const SECTIONS = [
  { id: "intro", label: "Intro", startIndex: 0 },
  { id: "discover", label: "Discover", startIndex: 4 },
  { id: "build", label: "Build", startIndex: 10 },
  { id: "control", label: "Control", startIndex: 15 },
  { id: "summary", label: "Summary", startIndex: 20 },
];

// Example workflows discovered
const DISCOVERED_WORKFLOWS = [
  { 
    id: "invoice", 
    name: "PO Invoice Reconciliation", 
    volume: "14,000/mo",
    currentTime: "12 min",
    targetTime: "30 sec",
    aiScore: 94,
    impact: "+$2M",
  },
  { 
    id: "contract", 
    name: "Contract Redlining", 
    volume: "2,400/mo",
    currentTime: "45 min",
    targetTime: "8 min",
    aiScore: 87,
    impact: "+$800K",
  },
  { 
    id: "support", 
    name: "Customer Support Triage", 
    volume: "8,200/mo",
    currentTime: "15 min",
    targetTime: "2 min",
    aiScore: 91,
    impact: "+$1.2M",
  },
];

export default function PHAROExperience({ isActive, onComplete }: PHAROExperienceProps) {
  const [phase, setPhase] = useState<PHAROPhase>("idle");
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  // Navigate to specific index
  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < PHASE_SEQUENCE.length) {
      setPhaseIndex(index);
      setPhase(PHASE_SEQUENCE[index]);
    }
  }, []);

  // Go to next slide
  const goNext = useCallback(() => {
    if (phaseIndex < PHASE_SEQUENCE.length - 1) {
      goToIndex(phaseIndex + 1);
    }
  }, [phaseIndex, goToIndex]);

  // Go to previous slide
  const goPrev = useCallback(() => {
    if (phaseIndex > 0) {
      goToIndex(phaseIndex - 1);
    }
  }, [phaseIndex, goToIndex]);

  // Jump to section
  const goToSection = useCallback((sectionId: string) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (section) {
      goToIndex(section.startIndex);
    }
  }, [goToIndex]);

  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      setPhaseIndex(-1);
      setIsPaused(false);
      return;
    }

    // Start the sequence
    setPhaseIndex(0);
    setPhase(PHASE_SEQUENCE[0]);
  }, [isActive]);

  // Auto-progress through phases (when not paused)
  useEffect(() => {
    if (phaseIndex < 0 || phaseIndex >= PHASE_SEQUENCE.length || isPaused) return;

    const currentPhase = PHASE_SEQUENCE[phaseIndex];
    const duration = PHASE_DURATIONS[currentPhase];

    const timer = setTimeout(() => {
      if (phaseIndex < PHASE_SEQUENCE.length - 1) {
        goNext();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [phaseIndex, isPaused, goNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onComplete();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused(p => !p);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isActive, onComplete, goNext, goPrev]);

  if (!isActive && phase === "idle") return null;

  // Determine current section
  const getCurrentSection = () => {
    if (phaseIndex < 4) return "intro";
    if (phaseIndex < 10) return "discover";
    if (phaseIndex < 15) return "build";
    if (phaseIndex < 20) return "control";
    return "summary";
  };

  const currentSection = getCurrentSection();

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/40"
            onClick={onComplete}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* macOS Window */}
          <motion.div
            className="relative w-full h-full max-w-[98vw] max-h-[96vh] rounded-xl overflow-hidden flex flex-col"
            style={{
              background: "#fafafa",
              boxShadow: "0 0 0 0.5px rgba(0,0,0,0.1), 0 25px 80px rgba(0,0,0,0.3)",
            }}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Title Bar with Traffic Lights */}
            <div 
              className="h-12 flex items-center justify-between px-4 shrink-0 select-none"
              style={{ background: "#f0f0f0", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
            >
              {/* Traffic Light Buttons - macOS Style */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onComplete(); }}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center group hover:brightness-90 transition-all"
                  style={{ 
                    background: "#ff5f57",
                    boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.15)",
                  }}
                  title="Close"
                >
                  <svg className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsPaused(p => !p); }}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center group hover:brightness-90 transition-all"
                  style={{ 
                    background: "#febc2e",
                    boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.15)",
                  }}
                  title={isPaused ? "Resume" : "Pause"}
                >
                  <svg className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4H7" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <div 
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ 
                    background: "#28c840",
                    boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </div>

              {/* Title */}
              <span className="text-[12px] text-black/50 font-medium tracking-wide">
                What We Do — Pharo AI Office System
              </span>

              {/* Slide counter */}
              <div className="flex items-center gap-2 text-[11px] text-black/40">
                <span>{phaseIndex + 1} / {PHASE_SEQUENCE.length}</span>
                {isPaused && (
                  <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[9px] font-medium">
                    PAUSED
                  </span>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div 
              className="flex-1 overflow-hidden relative bg-white"
              onMouseEnter={() => setIsHoveringNav(true)}
              onMouseLeave={() => setIsHoveringNav(false)}
            >
              <AnimatePresence mode="wait">
                {/* INTRO */}
                {phase === "intro" && <IntroSlide key="intro" />}
                
                {/* PROBLEM */}
                {phase === "problem-1" && <Problem1Slide key="problem-1" />}
                {phase === "problem-2" && <Problem2Slide key="problem-2" />}
                {phase === "solution-intro" && <SolutionIntroSlide key="solution-intro" />}
                
                {/* DISCOVER */}
                {phase === "discover-intro" && <DiscoverIntroSlide key="discover-intro" />}
                {phase === "discover-define" && <DiscoverDefineSlide key="discover-define" />}
                {phase === "discover-ingest" && <DiscoverIngestSlide key="discover-ingest" />}
                {phase === "discover-analyze" && <DiscoverAnalyzeSlide key="discover-analyze" />}
                {phase === "discover-rank" && <DiscoverRankSlide key="discover-rank" workflows={DISCOVERED_WORKFLOWS} />}
                {phase === "discover-summary" && <DiscoverSummarySlide key="discover-summary" />}
                
                {/* BUILD */}
                {phase === "build-intro" && <BuildIntroSlide key="build-intro" />}
                {phase === "build-blueprints" && <BuildBlueprintsSlide key="build-blueprints" />}
                {phase === "build-fdes" && <BuildFDEsSlide key="build-fdes" />}
                {phase === "build-pmo" && <BuildPMOSlide key="build-pmo" />}
                {phase === "build-summary" && <BuildSummarySlide key="build-summary" />}
                
                {/* CONTROL */}
                {phase === "control-intro" && <ControlIntroSlide key="control-intro" />}
                {phase === "control-monitoring" && <ControlMonitoringSlide key="control-monitoring" />}
                {phase === "control-compliance" && <ControlComplianceSlide key="control-compliance" />}
                {phase === "control-billing" && <ControlBillingSlide key="control-billing" />}
                {phase === "control-summary" && <ControlSummarySlide key="control-summary" />}
                
                {/* TIMELINE & COMPLETE */}
                {phase === "timeline" && <TimelineSlide key="timeline" />}
                {phase === "complete" && <CompleteSlide key="complete" onClose={onComplete} />}
              </AnimatePresence>

              {/* Navigation Arrows - Always visible on hover */}
              <motion.div
                className="absolute inset-y-0 left-0 flex items-center pl-4 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHoveringNav || isPaused ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={goPrev}
                  disabled={phaseIndex <= 0}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </motion.div>

              <motion.div
                className="absolute inset-y-0 right-0 flex items-center pr-4 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHoveringNav || isPaused ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={goNext}
                  disabled={phaseIndex >= PHASE_SEQUENCE.length - 1}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            </div>

            {/* Bottom Navigation Bar */}
            <div 
              className="h-14 flex items-center justify-center gap-8 shrink-0 border-t"
              style={{ background: "#fafafa", borderColor: "rgba(0,0,0,0.06)" }}
            >
              {/* Section Navigation */}
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => goToSection(section.id)}
                  className={`text-[11px] tracking-[0.15em] uppercase transition-all px-3 py-1.5 rounded ${
                    currentSection === section.id 
                      ? "text-black/70 font-medium bg-black/[0.04]" 
                      : "text-black/30 hover:text-black/50"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-black/5">
              <motion.div 
                className="h-full bg-black/20"
                initial={{ width: 0 }}
                animate={{ width: `${((phaseIndex + 1) / PHASE_SEQUENCE.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// SHARED SLIDE WRAPPER
// ============================================

function SlideWrapper({ 
  children, 
  label,
  align = "center",
}: { 
  children: React.ReactNode;
  label?: string;
  align?: "center" | "top";
}) {
  return (
    <motion.div
      className={`absolute inset-0 flex flex-col ${align === "center" ? "justify-center" : "justify-start pt-16"} px-16 md:px-24 bg-white overflow-y-auto`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      {label && (
        <motion.span 
          className="text-[10px] tracking-[0.4em] uppercase text-black/25 mb-6"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.span>
      )}
      {children}
    </motion.div>
  );
}

// ============================================
// INTRO SLIDE
// ============================================

function IntroSlide() {
  return (
    <SlideWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <motion.h1
          className="text-7xl md:text-8xl select-none mb-8"
          style={{ 
            fontFamily: "'Times New Roman', Georgia, serif",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            color: "rgba(0,0,0,0.85)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Pharo
        </motion.h1>
        
        <motion.p
          className="text-xl text-black/50 font-light mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          AI Office System for Enterprise Operations
        </motion.p>
        
        <motion.p
          className="text-black/30 text-sm tracking-[0.2em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Discover · Build · Control
        </motion.p>
      </div>
    </SlideWrapper>
  );
}

// ============================================
// PROBLEM SLIDES
// ============================================

function Problem1Slide() {
  return (
    <SlideWrapper label="The Problem">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-light text-black/80 mb-12 leading-tight"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          AI appears in slides, workshops, and PoCs.
          <br />
          <span className="text-black/40">But not in the daily work.</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {[
            { number: "1000s", label: "of models and tools" },
            { number: "0", label: "interoperability" },
            { number: "∞", label: "shadow IT" },
            { number: "?", label: "value generated" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              className="text-center py-8 px-4 rounded-xl"
              style={{ background: "rgba(0,0,0,0.02)" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <p className="text-3xl font-light text-black/80 mb-2">{stat.number}</p>
              <p className="text-xs text-black/40 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

function Problem2Slide() {
  return (
    <SlideWrapper label="Why Pilots Don't Scale">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-light text-black/80 mb-12"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Four structural failures prevent AI from becoming operational.
        </motion.h2>
        
        <div className="grid grid-cols-2 gap-8">
          {[
            { 
              title: "Guesswork", 
              desc: "Use cases invented in workshops. Not based on real data about how work actually flows.",
            },
            { 
              title: "Fragmentation", 
              desc: "Deliveries as one-off projects. PoCs that never become robust production systems.",
            },
            { 
              title: "Chaos", 
              desc: "Agents scattered across vendors and teams. No ownership, no central observability.",
            },
            { 
              title: "Stagnation", 
              desc: "No data-driven roadmap. No production control means no sustained ROI.",
            },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              className="p-8 rounded-xl"
              style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              <h3 className="text-lg font-medium text-black/70 mb-3">{item.title}</h3>
              <p className="text-sm text-black/50 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

function SolutionIntroSlide() {
  return (
    <SlideWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <motion.p
          className="text-sm text-black/30 uppercase tracking-[0.3em] mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          The Solution
        </motion.p>
        
        <motion.h2
          className="text-4xl md:text-5xl font-light text-black/80 mb-8 leading-tight"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Pharo is an end-to-end AI Office System
          <br />
          <span className="text-black/50">built on real workflows.</span>
        </motion.h2>
        
        <motion.p
          className="text-lg text-black/40 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Discovers, builds, and controls AI systems across your enterprise.
        </motion.p>
        
        {/* Three pillars preview */}
        <motion.div
          className="flex justify-center gap-16 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { name: "Light", label: "Discover" },
            { name: "Forge", label: "Build" },
            { name: "Tower", label: "Control" },
          ].map((pillar, i) => (
            <motion.div 
              key={pillar.name}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.15 }}
            >
              <p className="text-2xl font-light text-black/70 mb-1">{pillar.name}</p>
              <p className="text-xs text-black/30 uppercase tracking-wider">{pillar.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// ============================================
// DISCOVER SLIDES
// ============================================

function DiscoverIntroSlide() {
  return (
    <SlideWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <motion.p
          className="text-sm text-black/30 uppercase tracking-[0.3em] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Pharo Light
        </motion.p>
        
        <motion.h2
          className="text-5xl font-light text-black/80 mb-6"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Discover
        </motion.h2>
        
        <motion.p
          className="text-xl text-black/50 font-light mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Turn daily work into a data-backed AI pipeline.
        </motion.p>
        
        <motion.p
          className="text-black/30 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Pharo Light observes how work really happens in your organization.
          Not from workshops. From real data.
        </motion.p>
      </div>
    </SlideWrapper>
  );
}

function DiscoverDefineSlide() {
  return (
    <SlideWrapper label="Discover · Step 1">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="flex items-center gap-6 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-4xl font-light text-black/20">01</span>
          <h2 className="text-3xl font-light text-black/80" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Define
          </h2>
        </motion.div>
        
        <motion.p
          className="text-lg text-black/50 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Select teams and systems. We ingest signals from API logs, ERP backend data,
          and workflow analysis to map how work really flows.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { label: "API Logs", desc: "REST, GraphQL, internal services" },
            { label: "ERP Backend", desc: "SAP, Navision, Oracle, Workday" },
            { label: "Workflow Events", desc: "Email, tickets, approvals" },
          ].map((source) => (
            <div 
              key={source.label}
              className="p-6 rounded-xl text-center"
              style={{ background: "rgba(0,0,0,0.02)" }}
            >
              <p className="text-sm font-medium text-black/70 mb-2">{source.label}</p>
              <p className="text-xs text-black/40">{source.desc}</p>
            </div>
          ))}
        </motion.div>
        
        <motion.p
          className="text-sm text-black/30 mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Always read-only. Zero impact on your systems.
        </motion.p>
      </div>
    </SlideWrapper>
  );
}

function DiscoverIngestSlide() {
  return (
    <SlideWrapper label="Discover · Step 2">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="flex items-center gap-6 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-4xl font-light text-black/20">02</span>
          <h2 className="text-3xl font-light text-black/80" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Ingest
          </h2>
        </motion.div>
        
        <motion.p
          className="text-lg text-black/50 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Group events into workflows. Compute baseline metrics for each one:
          volumes, handling times, hand-offs, error rates.
        </motion.p>
        
        <motion.div 
          className="p-8 rounded-xl mb-6"
          style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-black/40 uppercase tracking-wider mb-6">Example: Invoice Approval Workflow</p>
          <div className="flex items-center justify-between">
            {["Receive", "Validate", "Match PO", "Route", "Approve", "Post"].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2 mx-auto"
                    style={{ background: "rgba(0,0,0,0.04)" }}
                  >
                    <span className="text-xs text-black/50">{i + 1}</span>
                  </div>
                  <p className="text-xs text-black/60">{step}</p>
                </div>
                {i < 5 && <div className="w-8 h-px bg-black/10 mx-2" />}
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { value: "14,000", label: "Monthly volume" },
            { value: "12 min", label: "Avg. handling time" },
            { value: "4.2", label: "Avg. hand-offs" },
            { value: "4.8%", label: "Error rate" },
          ].map((metric) => (
            <div key={metric.label} className="text-center py-4">
              <p className="text-2xl font-light text-black/70">{metric.value}</p>
              <p className="text-[10px] text-black/40 uppercase tracking-wider">{metric.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

function DiscoverAnalyzeSlide() {
  return (
    <SlideWrapper label="Discover · Step 3">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="flex items-center gap-6 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-4xl font-light text-black/20">03</span>
          <h2 className="text-3xl font-light text-black/80" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Analyze
          </h2>
        </motion.div>
        
        <motion.p
          className="text-lg text-black/50 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          For every workflow, we calculate three critical dimensions
          to determine AI-readiness.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { 
              title: "AI-Fit Score", 
              desc: "How suitable is this workflow for AI automation? Based on data structure, decision complexity, and volume.",
              example: "94/100",
            },
            { 
              title: "Effort & Complexity", 
              desc: "Technical complexity, integrations required, risks involved. What does it take to build?",
              example: "Medium",
            },
            { 
              title: "Impact Estimate", 
              desc: "Time saved, cost reduction, error prevention. Quantified in hours and currency.",
              example: "+$2M/year",
            },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              className="p-8 rounded-xl"
              style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <p className="text-2xl font-light text-black/70 mb-4">{item.example}</p>
              <h3 className="text-sm font-medium text-black/60 mb-2">{item.title}</h3>
              <p className="text-xs text-black/40 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

function DiscoverRankSlide({ workflows }: { workflows: typeof DISCOVERED_WORKFLOWS }) {
  return (
    <SlideWrapper label="Discover · Step 4" align="top">
      <div className="max-w-5xl mx-auto w-full">
        <motion.div 
          className="flex items-center gap-6 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-4xl font-light text-black/20">04</span>
          <h2 className="text-3xl font-light text-black/80" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Rank
          </h2>
        </motion.div>
        
        <motion.p
          className="text-lg text-black/50 mb-8 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Prioritize opportunities by business unit, impact, risk, and effort.
          Select the next use-cases to forge.
        </motion.p>
        
        {/* Table header */}
        <motion.div 
          className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-black/30"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="col-span-3">Workflow</div>
          <div className="col-span-2 text-center">Volume</div>
          <div className="col-span-2 text-center">Time Saved</div>
          <div className="col-span-2 text-center">AI Score</div>
          <div className="col-span-3 text-right">Annual Impact</div>
        </motion.div>
        
        {workflows.map((w, i) => (
          <motion.div 
            key={w.id}
            className="grid grid-cols-12 gap-4 px-4 py-5 items-center"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15 }}
          >
            <div className="col-span-3">
              <p className="text-sm font-medium text-black/80">{w.name}</p>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-sm text-black/50 font-mono">{w.volume}</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-black/30 text-sm">{w.currentTime}</span>
              <span className="mx-2 text-black/20">→</span>
              <span className="text-black/70 text-sm font-medium">{w.targetTime}</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-lg font-light text-black/70">{w.aiScore}</span>
            </div>
            <div className="col-span-3 text-right">
              <span className="text-xl font-light text-black/80">{w.impact}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </SlideWrapper>
  );
}

function DiscoverSummarySlide() {
  return (
    <SlideWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <motion.p
          className="text-sm text-black/30 uppercase tracking-[0.3em] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Pharo Light · Result
        </motion.p>
        
        <motion.h2
          className="text-4xl font-light text-black/80 mb-12"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          A data-backed AI pipeline.
          <br />
          <span className="text-black/50">Not guesswork.</span>
        </motion.h2>
        
        <motion.div 
          className="flex justify-center gap-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: "3", label: "Workflows identified" },
            { value: "+$4M", label: "Annual impact" },
            { value: "92%", label: "Avg. AI score" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <p className="text-4xl font-light text-black/80 mb-2">{stat.value}</p>
              <p className="text-xs text-black/40 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// ============================================
// BUILD SLIDES
// ============================================

function BuildIntroSlide() {
  return (
    <SlideWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <motion.p
          className="text-sm text-black/30 uppercase tracking-[0.3em] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Pharo Forge
        </motion.p>
        
        <motion.h2
          className="text-5xl font-light text-black/80 mb-6"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Build
        </motion.h2>
        
        <motion.p
          className="text-xl text-black/50 font-light mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Turn on your industrialized assembly line for AI.
        </motion.p>
        
        <motion.p
          className="text-black/30 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Pharo Forge is a centralized PMO to track, build, and deliver
          your AI workforce. Not one-off projects. Repeatable systems.
        </motion.p>
      </div>
    </SlideWrapper>
  );
}

function BuildBlueprintsSlide() {
  return (
    <SlideWrapper label="Build · Layer 01">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-light text-black/80 mb-4"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          The Blueprints
        </motion.h2>
        
        <motion.p
          className="text-lg text-black/50 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Unlock accelerated development through pre-built &ldquo;Agent Patterns.&rdquo;
          Access to Pharo&apos;s library of production-ready templates.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { name: "RAG Legal", desc: "Contract analysis, compliance review, redlining" },
            { name: "Transactional ERP", desc: "Invoice processing, PO matching, reconciliation" },
            { name: "Classification", desc: "Ticket routing, triage, categorization" },
          ].map((blueprint, i) => (
            <motion.div 
              key={blueprint.name}
              className="p-8 rounded-xl"
              style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <h3 className="text-lg font-medium text-black/70 mb-3">{blueprint.name}</h3>
              <p className="text-sm text-black/40">{blueprint.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

function BuildFDEsSlide() {
  return (
    <SlideWrapper label="Build · Layer 02">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-light text-black/80 mb-4"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          The Builders
        </motion.h2>
        
        <motion.p
          className="text-sm text-black/40 uppercase tracking-wider mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Forward Deployed Engineers
        </motion.p>
        
        <motion.p
          className="text-lg text-black/50 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Adapt the technology to your operations. A collaborative workspace
          where your team and our FDEs work side-by-side.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div 
            className="p-8 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-lg font-medium text-black/70 mb-4">Your Team</h3>
            <ul className="space-y-3">
              {["Domain expertise", "Business context", "Process knowledge", "Stakeholder access"].map(item => (
                <li key={item} className="text-sm text-black/50 flex items-center gap-3">
                  <span className="w-4 h-px bg-black/20" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div 
            className="p-8 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-lg font-medium text-black/70 mb-4">Pharo FDEs</h3>
            <ul className="space-y-3">
              {["AI/ML engineering", "Production patterns", "Integration expertise", "Deployment experience"].map(item => (
                <li key={item} className="text-sm text-black/50 flex items-center gap-3">
                  <span className="w-4 h-px bg-black/20" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

function BuildPMOSlide() {
  return (
    <SlideWrapper label="Build · Layer 03">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-light text-black/80 mb-4"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          The AI PMO Dashboard
        </motion.h2>
        
        <motion.p
          className="text-lg text-black/50 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          A single pane of glass for all AI initiatives. Track Business Unit Owners,
          Timelines, Priorities, and real-time Status.
        </motion.p>
        
        {/* Simplified dashboard preview */}
        <motion.div 
          className="rounded-xl overflow-hidden"
          style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-4 gap-px" style={{ background: "rgba(0,0,0,0.06)" }}>
            {["Initiative", "Owner", "Status", "Timeline"].map(header => (
              <div key={header} className="bg-white/80 px-4 py-3">
                <span className="text-[10px] text-black/40 uppercase tracking-wider">{header}</span>
              </div>
            ))}
            {[
              { name: "Invoice Agent", owner: "Finance", status: "Live", timeline: "Completed" },
              { name: "Contract Analyzer", owner: "Legal", status: "UAT", timeline: "Week 2" },
              { name: "Support Triage", owner: "CX", status: "Build", timeline: "Week 4" },
            ].map((row) => (
              <>
                <div key={`${row.name}-name`} className="bg-white px-4 py-4">
                  <span className="text-sm text-black/70">{row.name}</span>
                </div>
                <div key={`${row.name}-owner`} className="bg-white px-4 py-4">
                  <span className="text-sm text-black/50">{row.owner}</span>
                </div>
                <div key={`${row.name}-status`} className="bg-white px-4 py-4">
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      background: row.status === "Live" ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.04)",
                      color: row.status === "Live" ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
                    }}
                  >
                    {row.status}
                  </span>
                </div>
                <div key={`${row.name}-timeline`} className="bg-white px-4 py-4">
                  <span className="text-sm text-black/40">{row.timeline}</span>
                </div>
              </>
            ))}
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

function BuildSummarySlide() {
  return (
    <SlideWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <motion.p
          className="text-sm text-black/30 uppercase tracking-[0.3em] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Pharo Forge · Result
        </motion.p>
        
        <motion.h2
          className="text-4xl font-light text-black/80 mb-12"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          AI workers as industrial units.
          <br />
          <span className="text-black/50">Not experiments.</span>
        </motion.h2>
        
        <motion.div 
          className="flex justify-center gap-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: "3", label: "Blueprints deployed" },
            { value: "2", label: "FDEs assigned" },
            { value: "100%", label: "PMO visibility" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <p className="text-4xl font-light text-black/80 mb-2">{stat.value}</p>
              <p className="text-xs text-black/40 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// ============================================
// CONTROL SLIDES
// ============================================

function ControlIntroSlide() {
  return (
    <SlideWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <motion.p
          className="text-sm text-black/30 uppercase tracking-[0.3em] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Pharo Tower
        </motion.p>
        
        <motion.h2
          className="text-5xl font-light text-black/80 mb-6"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Control
        </motion.h2>
        
        <motion.p
          className="text-xl text-black/50 font-light mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Turn on ongoing control and reinforcement.
        </motion.p>
        
        <motion.p
          className="text-black/30 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Complete governance, forensic auditability, and financial control
          in one platform. Because once AI is live, the problem is no longer technical.
        </motion.p>
      </div>
    </SlideWrapper>
  );
}

function ControlMonitoringSlide() {
  return (
    <SlideWrapper label="Control · Monitoring">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-light text-black/80 mb-4"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          The Forensic Lens
        </motion.h2>
        
        <motion.p
          className="text-lg text-black/50 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Live Traces: Drill down into any interaction to see the &ldquo;Reasoning Trace.&rdquo;
          Real-time dashboards for latency, error rates, and volume spikes.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { value: "12,847", label: "Reasoning traces", sub: "Last 24h" },
            { value: "< 200ms", label: "Latency p99", sub: "All workers" },
            { value: "99.2%", label: "Accuracy", sub: "Across fleet" },
          ].map((metric, i) => (
            <motion.div 
              key={metric.label}
              className="p-10 rounded-xl text-center"
              style={{ background: "rgba(0,0,0,0.02)" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <p className="text-3xl font-light text-black/80 mb-2">{metric.value}</p>
              <p className="text-sm text-black/50 mb-1">{metric.label}</p>
              <p className="text-xs text-black/30">{metric.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

function ControlComplianceSlide() {
  return (
    <SlideWrapper label="Control · Compliance">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-light text-black/80 mb-4"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          The Safety Valve
        </motion.h2>
        
        <motion.p
          className="text-lg text-black/50 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Automated guardrails and human-in-the-loop controls.
          Set confidence thresholds where low-confidence actions are routed to humans.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div 
            className="p-8 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-lg font-medium text-black/70 mb-6">Automated Guardrails</h3>
            <ul className="space-y-4">
              {[
                "PII detection and masking",
                "Sensitive data classification",
                "Output validation rules",
                "Rate limiting per agent",
              ].map(item => (
                <li key={item} className="text-sm text-black/50 flex items-center gap-3">
                  <span className="w-4 h-px bg-black/20" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div 
            className="p-8 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-lg font-medium text-black/70 mb-6">Human-in-the-Loop</h3>
            <ul className="space-y-4">
              {[
                "Confidence threshold: < 90%",
                "Escalation to human reviewer",
                "Approval workflows",
                "Full audit trail",
              ].map(item => (
                <li key={item} className="text-sm text-black/50 flex items-center gap-3">
                  <span className="w-4 h-px bg-black/20" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

function ControlBillingSlide() {
  return (
    <SlideWrapper label="Control · Billing">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-light text-black/80 mb-4"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          The P&L View
        </motion.h2>
        
        <motion.p
          className="text-lg text-black/50 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          ROI Tracking and &ldquo;Cost-to-Serve&rdquo; per ticket or transaction.
          Budget caps per department or agent to prevent runaway API bills.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { value: "$0.12", label: "Cost per ticket" },
            { value: "$340K", label: "Monthly savings" },
            { value: "28x", label: "ROI multiplier" },
            { value: "$50K", label: "Budget cap" },
          ].map((metric, i) => (
            <motion.div 
              key={metric.label}
              className="p-8 rounded-xl text-center"
              style={{ background: "rgba(0,0,0,0.02)" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <p className="text-2xl font-light text-black/80 mb-2">{metric.value}</p>
              <p className="text-xs text-black/40 uppercase tracking-wider">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

function ControlSummarySlide() {
  return (
    <SlideWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <motion.p
          className="text-sm text-black/30 uppercase tracking-[0.3em] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Pharo Tower · Result
        </motion.p>
        
        <motion.h2
          className="text-4xl font-light text-black/80 mb-12"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          AI as a governed operation.
          <br />
          <span className="text-black/50">Not an experiment.</span>
        </motion.h2>
        
        <motion.div 
          className="flex justify-center gap-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: "100%", label: "Trace coverage" },
            { value: "< 90%", label: "HITL threshold" },
            { value: "Real-time", label: "Cost tracking" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <p className="text-4xl font-light text-black/80 mb-2">{stat.value}</p>
              <p className="text-xs text-black/40 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// ============================================
// TIMELINE SLIDE
// ============================================

function TimelineSlide() {
  return (
    <SlideWrapper label="The Journey" align="top">
      <div className="max-w-5xl mx-auto w-full">
        <motion.h2
          className="text-3xl font-light text-black/80 mb-4 text-center"
          style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          In 6 months: from AI guesswork to a managed AI workforce.
        </motion.h2>
        
        <motion.div 
          className="mt-12 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Timeline line */}
          <div className="absolute top-6 left-0 right-0 h-px bg-black/10" />
          
          <div className="grid grid-cols-5 gap-4">
            {[
              { time: "Day 0", desc: "Deploy Pharo Light. Connect to systems." },
              { time: "Month 1", desc: "See where time goes. First AI-ready list." },
              { time: "Month 3", desc: "AI pipeline with ROI. First workers in Forge." },
              { time: "Month 6", desc: "1-3 workers live. Tower switched on." },
              { time: "Ongoing", desc: "Fleet of AI workers. Full exec visibility." },
            ].map((milestone, i) => (
              <motion.div 
                key={milestone.time}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div 
                  className="w-3 h-3 rounded-full bg-black/30 mx-auto mb-4"
                />
                <p className="text-sm font-medium text-black/70 mb-2">{milestone.time}</p>
                <p className="text-xs text-black/40 leading-relaxed">{milestone.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// ============================================
// COMPLETE SLIDE
// ============================================

function CompleteSlide({ onClose }: { onClose: () => void }) {
  return (
    <SlideWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <motion.h2
          className="text-5xl mb-8 select-none"
          style={{ 
            fontFamily: "'Times New Roman', Georgia, serif",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "rgba(0,0,0,0.8)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Your AI workforce is ready.
        </motion.h2>
        
        <motion.p
          className="text-xl text-black/40 font-light mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          From guesswork to managed operations.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex justify-center gap-24 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: "3", label: "Workflows" },
            { value: "3", label: "AI Workers" },
            { value: "+$4M", label: "Annual Impact" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label} 
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <p className="text-4xl font-light text-black/80 mb-2">{stat.value}</p>
              <p className="text-[10px] text-black/40 uppercase tracking-[0.15em]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          className="px-12 py-4 rounded-lg text-sm font-medium bg-black/90 text-white hover:bg-black transition-colors"
          onClick={onClose}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Close
        </motion.button>
      </div>
    </SlideWrapper>
  );
}
