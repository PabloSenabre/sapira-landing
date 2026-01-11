"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, MotionValue } from "framer-motion";

interface PageWipeTransitionProps {
  phaseName: string;
  phaseLabel: string;
  fromTheme: "light" | "dark";
  toTheme: "light" | "dark";
  fromName?: string;
  toName?: string;
  /** Narrative description of what this section is about */
  narrative?: string;
}

// Section narratives
const SECTION_NARRATIVES: Record<string, string> = {
  "II": "Where we architect and deploy your custom AI workforce",
  "III": "Command center for your autonomous operations",
};

// Separate component for animated letters to avoid hook rules violation
function AnimatedLetter({
  letter,
  index,
  total,
  letterProgress,
  color,
}: {
  letter: string;
  index: number;
  total: number;
  letterProgress: MotionValue<number>;
  color: string;
}) {
  const opacity = useTransform(
    letterProgress,
    [index / total, (index + 1) / total],
    [0, 1]
  );
  const y = useTransform(
    letterProgress,
    [index / total, (index + 1) / total],
    [30, 0]
  );

  return (
    <motion.span
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        color,
        letterSpacing: "-0.02em",
        display: "inline-block",
        opacity,
        y,
      }}
    >
      {letter}
    </motion.span>
  );
}

export default function PageWipeTransition({
  phaseName,
  phaseLabel,
  fromTheme,
  toTheme,
  fromName,
  narrative,
}: PageWipeTransitionProps) {
  // Get narrative text
  const sectionNarrative = narrative || SECTION_NARRATIVES[phaseLabel] || "Next phase";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [phase, setPhase] = useState<"expanding" | "revealing" | "entering">("expanding");
  const scrollAccumulator = useRef(0);

  const progress = useMotionValue(0);

  // === PHASE 1: CIRCLE EXPANDING (0 - 0.5) ===
  const clipPath = useTransform(progress, [0, 0.5], [
    "circle(0% at 50% 50%)",
    "circle(100% at 50% 50%)"
  ]);
  
  // From section fading
  const fromOpacity = useTransform(progress, [0, 0.3], [1, 0]);
  
  // "Light → Forge" transition indicator
  const transitionOpacity = useTransform(progress, [0.05, 0.15, 0.35, 0.45], [0, 1, 1, 0]);
  const fromNameX = useTransform(progress, [0.1, 0.35], [0, -30]);
  const toNameX = useTransform(progress, [0.1, 0.35], [0, 30]);
  const arrowScale = useTransform(progress, [0.15, 0.25, 0.35], [0, 1.2, 1]);

  // === PHASE 2: NAME REVEAL (0.4 - 0.7) ===
  const nameContainerOpacity = useTransform(progress, [0.4, 0.5, 0.7, 0.8], [0, 1, 1, 0]);
  
  // Letter-by-letter stagger effect simulation
  const letterProgress = useTransform(progress, [0.45, 0.65], [0, 1]);
  
  // Decorative lines around the name
  const lineWidth = useTransform(progress, [0.5, 0.6, 0.7, 0.8], [0, 60, 60, 0]);
  const lineOpacity = useTransform(progress, [0.5, 0.55, 0.75, 0.8], [0, 0.6, 0.6, 0]);

  // === PHASE 3: ENTERING (0.7 - 0.9) - shorter, then fade to content ===
  const enteringOpacity = useTransform(progress, [0.7, 0.78, 0.88, 0.95], [0, 1, 1, 0]);
  const enteringY = useTransform(progress, [0.7, 0.85], [30, 0]);
  const enteringScale = useTransform(progress, [0.7, 0.85], [0.98, 1]);
  
  // Final content reveal lines
  const revealLineWidth = useTransform(progress, [0.75, 0.88], ["0%", "100%"]);
  
  // Final fade to content - smooth transition
  const finalOverlayOpacity = useTransform(progress, [0.9, 1], [1, 0]);
  
  // Tagline opacity
  const taglineOpacity = useTransform(progress, [0.55, 0.65, 0.7, 0.8], [0, 1, 1, 0]);

  // Decorative element in narrative
  const narrativeDecorOpacity = useTransform(progress, [0.8, 0.9], [0, 1]);

  // Progress bar
  const progressBarWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  const isFromDark = fromTheme === "dark";
  const isToDark = toTheme === "dark";

  // Track phase changes
  useEffect(() => {
    const unsubscribe = progress.on("change", (v) => {
      if (v < 0.45) setPhase("expanding");
      else if (v < 0.75) setPhase("revealing");
      else setPhase("entering");
    });
    return unsubscribe;
  }, [progress]);

  const checkInView = useCallback(() => {
    if (!containerRef.current || hasCompleted) return false;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    return rect.top < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4;
  }, [hasCompleted]);

  useEffect(() => {
    if (hasCompleted) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked && checkInView()) {
        setIsLocked(true);
        scrollAccumulator.current = 0;
        progress.set(0);
      }

      if (isLocked) {
        e.preventDefault();
        
        scrollAccumulator.current += e.deltaY * 0.0005;
        const newProgress = Math.max(0, Math.min(1, scrollAccumulator.current));
        
        animate(progress, newProgress, { duration: 0.12, ease: "easeOut" });
        
        if (newProgress >= 0.99) {
          setTimeout(() => {
            setIsLocked(false);
            setHasCompleted(true);
          }, 150);
        }
        
        if (newProgress <= 0.02 && e.deltaY < 0) {
          setIsLocked(false);
          scrollAccumulator.current = 0;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isLocked, hasCompleted, checkInView, progress]);

  useEffect(() => {
    document.body.style.overflow = isLocked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isLocked]);

  // Split name into letters for animation
  const letters = phaseName.split("");

  return (
    <section ref={containerRef} className="relative h-[60vh]">
      
      {isLocked && (
        <motion.div 
          className="fixed inset-0 z-[100]"
          style={{ opacity: finalOverlayOpacity }}
        >
          
          {/* FROM BACKGROUND */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: isFromDark ? "#0a0a0a" : "#FAFAF9",
              opacity: fromOpacity,
            }}
          />
          
          {/* TO BACKGROUND - revealed through expanding circle */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: isToDark ? "#0a0a0a" : "#FAFAF9",
              clipPath,
            }}
          />

          {/* === TRANSITION INDICATOR: "Light → Forge" === */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: transitionOpacity }}
          >
            {/* Translucent container */}
            <div 
              className="px-12 py-10 rounded-2xl backdrop-blur-sm"
              style={{
                background: isToDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${isToDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              <div className="flex flex-col items-center">
                {/* Small label */}
                <p 
                  className="text-[10px] tracking-[0.5em] uppercase mb-8 font-medium"
                  style={{ color: isToDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)" }}
                >
                  Transitioning
                </p>
                
                {/* The transition: From → To */}
                <div className="flex items-center gap-10">
                  {/* From name - fading out */}
                  <motion.div
                    className="text-center"
                    style={{ x: fromNameX }}
                  >
                    <span
                      className="text-4xl md:text-5xl font-light block"
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        color: isToDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                      }}
                    >
                      {fromName || "Light"}
                    </span>
                    <span 
                      className="text-[9px] tracking-[0.3em] uppercase mt-3 block"
                      style={{ color: isToDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" }}
                    >
                      Phase {phaseLabel === "II" ? "I" : "II"}
                    </span>
                  </motion.div>
                  
                  {/* Animated arrow */}
                  <motion.div
                    className="flex items-center px-2"
                    style={{ scale: arrowScale }}
                  >
                    <svg width="50" height="20" viewBox="0 0 50 20" fill="none">
                      <motion.path
                        d="M0 10H40M40 10L30 3M40 10L30 17"
                        stroke={isToDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  
                  {/* To name - coming in */}
                  <motion.div
                    className="text-center"
                    style={{ x: toNameX }}
                  >
                    <span
                      className="text-4xl md:text-5xl font-light block"
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        color: isToDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
                      }}
                    >
                      {phaseName}
                    </span>
                    <span 
                      className="text-[9px] tracking-[0.3em] uppercase mt-3 block"
                      style={{ color: isToDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }}
                    >
                      Phase {phaseLabel}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>


          {/* === PHASE NAME REVEAL === */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: nameContainerOpacity }}
          >
            <div className="text-center">
              {/* Phase label */}
              <motion.p 
                className="text-[11px] tracking-[0.6em] uppercase mb-6 font-medium"
                style={{ 
                  color: isToDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
                }}
              >
                Phase {phaseLabel}
              </motion.p>
              
              {/* Main name with letter reveal */}
              <div className="relative">
                {/* Decorative line left */}
                <motion.div
                  className="absolute top-1/2 right-full mr-8 h-[1px] -translate-y-1/2"
                  style={{
                    width: lineWidth,
                    opacity: lineOpacity,
                    background: isToDark 
                      ? "linear-gradient(to left, rgba(255,255,255,0.4), transparent)"
                      : "linear-gradient(to left, rgba(0,0,0,0.3), transparent)",
                  }}
                />
                
                {/* Letters */}
                <h2 className="text-8xl md:text-9xl lg:text-[11rem] font-light flex justify-center">
                  {letters.map((letter, i) => (
                    <AnimatedLetter
                      key={i}
                      letter={letter}
                      index={i}
                      total={letters.length}
                      letterProgress={letterProgress}
                      color={isToDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)"}
                    />
                  ))}
                </h2>

                {/* Decorative line right */}
                <motion.div
                  className="absolute top-1/2 left-full ml-8 h-[1px] -translate-y-1/2"
                  style={{
                    width: lineWidth,
                    opacity: lineOpacity,
                    background: isToDark 
                      ? "linear-gradient(to right, rgba(255,255,255,0.4), transparent)"
                      : "linear-gradient(to right, rgba(0,0,0,0.3), transparent)",
                  }}
                />
              </div>

              {/* Subtle tagline - positioned lower */}
              <motion.p
                className="mt-16 text-base tracking-wide"
                style={{
                  color: isToDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
                  opacity: taglineOpacity,
                  fontStyle: "italic",
                }}
              >
                {phaseLabel === "II" ? "Time to build" : "Time to control"}
              </motion.p>
            </div>
          </motion.div>

          {/* === ENTERING: NARRATIVE === */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: enteringOpacity,
              y: enteringY,
              scale: enteringScale,
            }}
          >
            <div className="text-center max-w-2xl px-8">
              {/* Decorative top element */}
              <motion.div
                className="mx-auto mb-8 flex items-center justify-center gap-4"
                style={{ opacity: narrativeDecorOpacity }}
              >
                <div 
                  className="w-8 h-[1px]"
                  style={{ background: isToDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }}
                />
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ background: isToDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
                />
                <div 
                  className="w-8 h-[1px]"
                  style={{ background: isToDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }}
                />
              </motion.div>

              {/* Narrative text - the main message */}
              <p
                className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed tracking-wide"
                style={{ 
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  color: isToDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
                  letterSpacing: "0.02em",
                }}
              >
                {sectionNarrative}
              </p>
              
              {/* Reveal line */}
              <motion.div
                className="mx-auto mt-10 h-[1px]"
                style={{
                  width: revealLineWidth,
                  maxWidth: 150,
                  background: isToDark 
                    ? "rgba(255,255,255,0.25)" 
                    : "rgba(0,0,0,0.15)",
                }}
              />
            </div>
          </motion.div>

          {/* === PROGRESS INDICATOR === */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
            <div className="flex flex-col items-center gap-3">
              <div 
                className="w-28 h-[2px] rounded-full overflow-hidden"
                style={{ background: isToDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}
              >
                <motion.div
                  className="h-full"
                  style={{
                    width: progressBarWidth,
                    background: isToDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
                  }}
                />
              </div>
              <span 
                className="text-[9px] tracking-[0.3em] uppercase"
                style={{ color: isToDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" }}
              >
                {phase === "expanding" ? `${fromName || "Light"} → ${phaseName}` : phase === "revealing" ? `Phase ${phaseLabel}` : "Continue"}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Trigger zone */}
      {!isLocked && !hasCompleted && (
        <div 
          className="h-full"
          style={{ background: isFromDark ? "#0a0a0a" : "#FAFAF9" }}
        />
      )}

      {/* Completed */}
      {hasCompleted && (
        <div 
          className="h-full"
          style={{ background: isToDark ? "#0a0a0a" : "#FAFAF9" }}
        />
      )}
    </section>
  );
}
