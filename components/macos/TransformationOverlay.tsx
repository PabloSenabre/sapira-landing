"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

interface TransformationOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function TransformationOverlay({ isActive, onComplete }: TransformationOverlayProps) {
  const [phase, setPhase] = useState<"idle" | "scanning" | "transforming" | "revealing" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [scanPosition, setScanPosition] = useState(0);

  // Pre-generate random values for particles
  const particles = useMemo(() => 
    [...Array(60)].map((_, i) => ({
      angle: (i / 60) * Math.PI * 2 + (Math.random() - 0.5) * 0.3,
      distance: 300 + Math.random() * 500,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 0.15,
      duration: 0.4 + Math.random() * 0.4,
    })), []
  );

  const streaks = useMemo(() =>
    [...Array(40)].map((_, i) => ({
      angle: (i / 40) * Math.PI * 2,
      length: 100 + Math.random() * 300,
      delay: Math.random() * 0.1,
    })), []
  );

  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      setProgress(0);
      setScanPosition(0);
      return;
    }

    setPhase("scanning");

    const timeline = [
      { phase: "scanning" as const, duration: 2200 },
      { phase: "transforming" as const, duration: 2000 },
      { phase: "revealing" as const, duration: 1200 },
      { phase: "complete" as const, duration: 100 },
    ];

    let currentIndex = 0;
    let startTime = Date.now();

    const animate = () => {
      if (currentIndex >= timeline.length) {
        onComplete();
        return;
      }

      const current = timeline[currentIndex];
      const elapsed = Date.now() - startTime;
      const phaseProgress = Math.min(elapsed / current.duration, 1);

      if (current.phase === "scanning") {
        setScanPosition(phaseProgress * 100);
      }

      const previousDuration = timeline.slice(0, currentIndex).reduce((sum, t) => sum + t.duration, 0);
      const totalDuration = timeline.reduce((sum, t) => sum + t.duration, 0);
      const overallProgress = ((previousDuration + elapsed) / totalDuration) * 100;
      setProgress(Math.min(overallProgress, 100));

      if (phaseProgress >= 1) {
        currentIndex++;
        startTime = Date.now();
        if (currentIndex < timeline.length) {
          setPhase(timeline[currentIndex].phase);
        }
      }

      if (currentIndex < timeline.length) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }, [isActive, onComplete]);

  if (!isActive && phase === "idle") return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: phase === "revealing" ? "transparent" : "#000",
            }}
            animate={{ opacity: phase === "revealing" ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />

          {/* Scanning effect */}
          {phase === "scanning" && (
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute left-0 right-0 h-px"
                style={{
                  top: `${scanPosition}%`,
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 70%, transparent 100%)",
                }}
              />
              <motion.div
                className="absolute left-0 right-0"
                style={{
                  top: 0,
                  height: `${scanPosition}%`,
                  background: "linear-gradient(180deg, transparent 90%, rgba(255,255,255,0.02) 100%)",
                }}
              />
            </motion.div>
          )}

          {/* Transforming effect */}
          {phase === "transforming" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 80 + i * 60,
                    height: 80 + i * 60,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Progress indicator */}
          {phase !== "revealing" && phase !== "complete" && (
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="mb-8"
                animate={phase === "transforming" ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span 
                    style={{ 
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "28px",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    S
                  </span>
                </div>
              </motion.div>

              <motion.p
                className="text-[11px] tracking-[0.2em] uppercase mb-6"
                style={{ color: "rgba(255,255,255,0.4)" }}
                key={phase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {phase === "scanning" && "Scanning"}
                {phase === "transforming" && "Transforming"}
              </motion.p>

              <div className="w-40">
                <div 
                  className="h-px rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <motion.p 
                  className="text-[10px] tracking-[0.1em] mt-3 text-center tabular-nums"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {Math.round(progress)}%
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* === SPECTACULAR EXPLOSION === */}
          {phase === "revealing" && (
            <>
              {/* Layer 1: Initial bright core pulse */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  background: "white",
                  boxShadow: "0 0 60px 30px white, 0 0 100px 60px rgba(255,255,255,0.8)",
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 3, 0], opacity: [1, 1, 0] }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              {/* Layer 2: Shockwave rings */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute rounded-full"
                  style={{
                    border: `${3 - i * 0.4}px solid rgba(255,255,255,${0.8 - i * 0.1})`,
                    boxShadow: i < 2 ? `0 0 ${20 - i * 5}px rgba(255,255,255,0.5)` : "none",
                  }}
                  initial={{ width: 0, height: 0, opacity: 1 }}
                  animate={{ 
                    width: 1500 + i * 300, 
                    height: 1500 + i * 300,
                    opacity: 0,
                  }}
                  transition={{ 
                    duration: 0.8 + i * 0.1,
                    delay: i * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                />
              ))}

              {/* Layer 3: Light streaks radiating outward */}
              {streaks.map((streak, i) => {
                const x = Math.cos(streak.angle);
                const y = Math.sin(streak.angle);
                return (
                  <motion.div
                    key={`streak-${i}`}
                    className="absolute"
                    style={{
                      width: 2,
                      height: streak.length,
                      background: "linear-gradient(to bottom, white 0%, transparent 100%)",
                      transformOrigin: "top center",
                      transform: `rotate(${streak.angle * (180 / Math.PI) + 90}deg)`,
                    }}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scaleY: [0, 1, 1],
                      x: x * 200,
                      y: y * 200,
                    }}
                    transition={{ 
                      duration: 0.5,
                      delay: streak.delay,
                      ease: "easeOut",
                    }}
                  />
                );
              })}

              {/* Layer 4: Particle burst */}
              {particles.map((p, i) => {
                const endX = Math.cos(p.angle) * p.distance;
                const endY = Math.sin(p.angle) * p.distance;
                return (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: p.size,
                      height: p.size,
                      boxShadow: `0 0 ${p.size * 2}px white`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ 
                      x: endX, 
                      y: endY, 
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ 
                      duration: p.duration,
                      delay: p.delay,
                      ease: "easeOut",
                    }}
                  />
                );
              })}

              {/* Layer 5: Secondary particle wave */}
              {[...Array(30)].map((_, i) => {
                const angle = (i / 30) * Math.PI * 2;
                const distance = 200 + Math.random() * 300;
                return (
                  <motion.div
                    key={`particle2-${i}`}
                    className="absolute w-0.5 h-0.5 rounded-full bg-white/80"
                    initial={{ x: 0, y: 0, opacity: 0.8 }}
                    animate={{ 
                      x: Math.cos(angle) * distance, 
                      y: Math.sin(angle) * distance, 
                      opacity: 0,
                    }}
                    transition={{ 
                      duration: 0.7,
                      delay: 0.2 + Math.random() * 0.1,
                      ease: "easeOut",
                    }}
                  />
                );
              })}

              {/* Layer 6: Central radial gradient explosion */}
              <motion.div
                className="absolute"
                style={{
                  width: "300vw",
                  height: "300vh",
                  background: "radial-gradient(circle at 50% 50%, white 0%, rgba(255,255,255,0.6) 10%, rgba(255,255,255,0.2) 30%, transparent 60%)",
                }}
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.1, 0.8, 1, 1.5] }}
                transition={{ 
                  duration: 0.8,
                  times: [0, 0.1, 0.4, 1],
                  ease: "easeOut",
                }}
              />

              {/* Layer 7: Final white flash overlay */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ 
                  duration: 1,
                  times: [0, 0.1, 0.3, 1],
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />

              {/* Layer 8: Vignette fade out */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 100%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 0] }}
                transition={{ 
                  duration: 1,
                  times: [0, 0.5, 0.7, 1],
                }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
