"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlueScreenOfDeathProps {
  onComplete: () => void;
}

// BSOD content - short, punchy, with storytelling and jokes
const BSOD_CONTENT = {
  header: "A problem has been detected and Windows has been shut down to prevent damage to your sanity.",
  errorCode: "LEGACY_SOFTWARE_EXISTENTIAL_CRISIS",
  stopCode: "*** STOP: 0xDEADBEEF (0xCAFE, 0xBABE, 0xFACE, 0xB00C)",
  
  // The storytelling part - quick and punchy
  story: [
    { text: "What happened:", delay: 800, type: "header" },
    { text: "You clicked on software from 2003.", delay: 1000, type: "normal" },
    { text: "It couldn't handle the emotional weight of being 22 years old.", delay: 1200, type: "normal" },
    { text: "", delay: 1400, type: "normal" },
    { text: "Casualties:", delay: 1600, type: "header" },
    { text: "• Your patience", delay: 1800, type: "warning" },
    { text: "• 847 unread emails (they're gone, you're welcome)", delay: 2000, type: "warning" },
    { text: "• That Excel macro from 2007 that \"only Carlos knows how to fix\"", delay: 2200, type: "warning" },
    { text: "• Internet Explorer (finally at peace 🪦)", delay: 2400, type: "warning" },
    { text: "", delay: 2600, type: "normal" },
    { text: "But wait...", delay: 2800, type: "success" },
    { text: "", delay: 3000, type: "normal" },
    { text: "SAPIRA AI RECOVERY PROTOCOL ACTIVATED", delay: 3200, type: "success" },
    { text: "There's a better way. No more legacy nightmares.", delay: 3400, type: "success" },
  ],
  
  footer: "Press any key to discover the future (or keep suffering, your call)",
};

export default function BlueScreenOfDeath({ onComplete }: BlueScreenOfDeathProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [glitchText, setGlitchText] = useState(false);

  // Initial screen glitch effect
  useEffect(() => {
    // Quick glitch on entry
    setGlitchText(true);
    const glitchTimeout = setTimeout(() => setGlitchText(false), 150);
    return () => clearTimeout(glitchTimeout);
  }, []);

  // Reveal lines progressively
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    BSOD_CONTENT.story.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
      timeouts.push(timeout);
    });

    // Show button after all lines
    const buttonTimeout = setTimeout(() => {
      setShowButton(true);
    }, BSOD_CONTENT.story[BSOD_CONTENT.story.length - 1].delay + 600);
    timeouts.push(buttonTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Handle continue
  const handleContinue = useCallback(() => {
    if (!showButton || isExiting) return;
    setIsExiting(true);
    setTimeout(() => onComplete(), 200);
  }, [showButton, isExiting, onComplete]);

  // Listen for any key press
  useEffect(() => {
    if (showButton) {
      const handleKeyDown = () => handleContinue();
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [showButton, handleContinue]);

  const getLineStyle = (type: string) => {
    switch (type) {
      case "header": return "text-white font-bold mt-4";
      case "warning": return "text-[#FFFF00]";
      case "success": return "text-[#00FF00] font-bold";
      default: return "text-white";
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[600] overflow-hidden select-none"
      style={{ backgroundColor: "#0000AA" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: isExiting ? 0.2 : 0.1 }}
      onClick={handleContinue}
    >
      {/* CRT flicker effect on entry */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-white"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.4) 1px, rgba(0,0,0,0.4) 2px)",
        }}
      />

      {/* Main content */}
      <div className="h-full w-full p-6 md:p-10 lg:p-14 flex flex-col">
        <div 
          className="max-w-3xl mx-auto font-mono text-sm md:text-base"
          style={{ fontFamily: "'Lucida Console', 'Consolas', 'Courier New', monospace" }}
        >
          {/* Header - always visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white mb-4 leading-relaxed"
          >
            {BSOD_CONTENT.header}
          </motion.div>

          {/* Error code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-white font-bold text-lg md:text-xl mb-2 ${glitchText ? 'animate-pulse' : ''}`}
          >
            {BSOD_CONTENT.errorCode}
          </motion.div>

          {/* Stop code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white text-xs md:text-sm mb-6 opacity-70"
          >
            {BSOD_CONTENT.stopCode}
          </motion.div>

          {/* Story lines */}
          <div className="space-y-1">
            <AnimatePresence mode="sync">
              {BSOD_CONTENT.story.slice(0, visibleLines).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  className={getLineStyle(line.type)}
                >
                  {line.text || "\u00A0"}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Continue button */}
          <AnimatePresence>
            {showButton && !isExiting && (
              <motion.div
                className="mt-10 flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Footer text */}
                <motion.p
                  className="text-white/60 text-xs text-center mb-2"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {BSOD_CONTENT.footer}
                </motion.p>

                <motion.button
                  onClick={handleContinue}
                  className="px-6 py-2.5 text-sm font-bold cursor-pointer relative group"
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid #FFFFFF",
                    color: "white",
                  }}
                  whileHover={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    borderColor: ["#FFFFFF", "#00FF00", "#FFFFFF"],
                  }}
                  transition={{
                    borderColor: { duration: 1.5, repeat: Infinity },
                  }}
                >
                  <span className="relative z-10">[ WHAT IS SAPIRA ]</span>
                </motion.button>

                <motion.span
                  className="text-[10px] text-white/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  (cualquier tecla sirve, no te compliques)
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-3 left-6 right-6 flex justify-between text-[10px] text-white/30 font-mono">
        <span>SAPIRA_RECOVERY.exe v2025.1</span>
        <span>Collecting your tears... 100% complete</span>
      </div>
    </motion.div>
  );
}
