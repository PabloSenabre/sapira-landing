"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalExperienceProps {
  onComplete: () => void;
}

// Terminal text sequence
const terminalLines = [
  { text: "Hello.", delay: 600 },
  { text: "We are Sapira AI.", delay: 800 },
  { text: "You probably don't understand what this is about.", delay: 1000 },
  { text: "Let us explain.", delay: 800 },
  { text: "Initializing Graphical User Interface...", delay: 1200 },
];

// Alternating paths for variety
const terminalPaths = [
  "C:\\Legacy\\StuckIn2003\\Sapira>",
  "C:\\WINDOWS\\system32\\before_ai\\pray>",
];

export default function TerminalExperience({ onComplete }: TerminalExperienceProps) {
  const [mounted, setMounted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const [exitPhase, setExitPhase] = useState<"idle" | "reveal" | "lift" | "remove" | "done">("idle");
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Easter egg: Always show 4:04 PM (Error 404)
  const currentTime = "4:04 PM";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Type a single line character by character
  const typeLine = useCallback((line: string, onComplete: () => void) => {
    setIsTyping(true);
    setCurrentText("");
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < line.length) {
        setCurrentText(line.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        onComplete();
      }
    }, 40 + Math.random() * 20);

    return () => clearInterval(typeInterval);
  }, []);

  // Sequence through all lines
  useEffect(() => {
    if (!mounted || isExiting) return;

    if (currentLineIndex < terminalLines.length) {
      const currentLine = terminalLines[currentLineIndex];
      
      const startDelay = setTimeout(() => {
        typeLine(currentLine.text, () => {
          setTimeout(() => {
            setCompletedLines((prev) => [...prev, currentLine.text]);
            setCurrentText("");
            setCurrentLineIndex((prev) => prev + 1);
            
            // If this was the last line ("Initializing GUI..."), start the reveal sequence
            if (currentLineIndex === terminalLines.length - 1) {
               startRevealSequence();
            }
          }, currentLine.delay);
        });
      }, currentLineIndex === 0 ? 400 : 200);

      return () => clearTimeout(startDelay);
    }
  }, [mounted, currentLineIndex, typeLine, isExiting]);

  const startRevealSequence = () => {
    setIsExiting(true);
    setExitPhase("reveal"); // Reveal desktop behind terminal

    setTimeout(() => {
        setExitPhase("remove"); // Close terminal window
    }, 2000);

    setTimeout(() => {
      setExitPhase("done");
      onComplete();
    }, 2800);
  };

  const handleCloseClick = () => {
    if (!isExiting) {
      // Manual close just triggers the transition
      setIsExiting(true);
      setExitPhase("reveal");
      setTimeout(() => setExitPhase("remove"), 500);
      setTimeout(() => {
          setExitPhase("done");
          onComplete();
      }, 1300);
    }
  };

  if (!mounted) return null;
  if (exitPhase === "done") return null;

  return (
    <AnimatePresence>
      {/* Background Container */}
      <div className="fixed inset-0 z-[99] bg-black">
          {/* Windows XP Bliss Wallpaper Background - Fades in */}
          <motion.div 
            key="xp-wallpaper"
            className="absolute inset-0 bg-cover bg-center"
            style={{
                backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png")',
                filter: 'brightness(1.05) contrast(1.1)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: (exitPhase === "reveal" || exitPhase === "remove") ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          />

          {/* Windows XP Taskbar - Slides up */}
          <motion.div
            key="xp-taskbar"
            className="fixed bottom-0 left-0 right-0 h-[30px] z-[101] flex items-stretch"
            style={{
              background: "linear-gradient(180deg, #3168d5 0%, #4993E4 3%, #2663D1 5%, #1941A5 90%, #1941A5 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
            initial={{ y: 30 }}
            animate={{ y: (exitPhase === "reveal" || exitPhase === "remove") ? 0 : 30 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Start Button */}
            <div
              className="h-full px-3 flex items-center gap-2 rounded-r-lg relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #3C9E44 0%, #4DB657 10%, #3FA548 50%, #2F8F38 90%, #236B28 100%)",
                borderRight: "2px solid #52AA5E",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                paddingLeft: "6px",
                paddingRight: "12px",
              }}
            >
              {/* Windows Logo */}
              <div className="w-5 h-5 relative">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <defs>
                    <linearGradient id="xp-red" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF5E5E" />
                      <stop offset="100%" stopColor="#DA1F1F" />
                    </linearGradient>
                    <linearGradient id="xp-green" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7FD858" />
                      <stop offset="100%" stopColor="#1FA51F" />
                    </linearGradient>
                    <linearGradient id="xp-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5EB8FF" />
                      <stop offset="100%" stopColor="#1F5FDA" />
                    </linearGradient>
                    <linearGradient id="xp-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFE75E" />
                      <stop offset="100%" stopColor="#FFBA1F" />
                    </linearGradient>
                  </defs>
                  <path d="M2 2 L11 3 L11 11 L2 11 Z" fill="url(#xp-red)" />
                  <path d="M13 3 L22 2 L22 11 L13 11 Z" fill="url(#xp-green)" />
                  <path d="M2 13 L11 13 L11 22 L2 21 Z" fill="url(#xp-blue)" />
                  <path d="M13 13 L22 13 L22 21 L13 22 Z" fill="url(#xp-yellow)" />
                </svg>
              </div>
              
              {/* Start text with italic style */}
              <span 
                className="text-sm font-bold tracking-wide"
                style={{
                  fontStyle: "italic",
                  color: "white",
                  textShadow: "1px 1px 1px rgba(0,0,0,0.4)",
                  fontFamily: "Franklin Gothic Medium, Tahoma, sans-serif",
                }}
              >
                start
              </span>

              {/* Shine effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  borderRadius: "inherit",
                }}
              />
            </div>

            {/* Quick Launch */}
            <div className="flex items-center gap-1 px-2 border-l border-r border-[#1941A5] mx-1">
              {/* IE Icon */}
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 20 20" className="w-4 h-4">
                  <circle cx="10" cy="10" r="8" fill="#4BA3E3" stroke="#1C5C8A" strokeWidth="1" />
                  <ellipse cx="10" cy="10" rx="7" ry="3" fill="none" stroke="white" strokeWidth="1.5" />
                  <text x="10" y="13" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontStyle="italic">e</text>
                </svg>
              </div>
              {/* Explorer Icon */}
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 20 20" className="w-4 h-4">
                  <path d="M3 4 L8 4 L10 6 L17 6 L17 16 L3 16 Z" fill="#F4D03F" stroke="#B7950B" strokeWidth="0.5" />
                </svg>
              </div>
            </div>

            {/* Active Window in Taskbar */}
            <AnimatePresence>
            {exitPhase !== "remove" && (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex-1 flex items-center gap-1 px-1 overflow-hidden"
                >
                <div
                    className="h-[22px] px-3 flex items-center gap-2 rounded min-w-[140px] max-w-[220px]"
                    style={{
                    background: "linear-gradient(180deg, #1E4B9E 0%, #1941A5 50%, #15378E 100%)",
                    border: "1px solid #0A246A",
                    boxShadow: "inset 0 0 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                >
                    {/* CMD Icon */}
                    <svg viewBox="0 0 16 16" className="w-4 h-4 flex-shrink-0">
                    <rect x="1" y="1" width="14" height="14" fill="#000" stroke="#808080" />
                    <text x="3" y="11" fill="#C0C0C0" fontSize="8" fontFamily="monospace">C:\</text>
                    </svg>
                    <span 
                    className="text-xs truncate"
                    style={{
                        color: "white",
                        textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                        fontFamily: "Tahoma, sans-serif",
                    }}
                    >
                    sapira_intervention.bat
                    </span>
                </div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* System Tray */}
            <div 
              className="flex items-center gap-2 px-3 h-full ml-auto"
              style={{
                background: "linear-gradient(180deg, #0F8AE8 0%, #1163C6 50%, #0D5BB5 100%)",
                borderLeft: "1px solid #1941A5",
                boxShadow: "inset 1px 0 1px rgba(255,255,255,0.1)",
              }}
            >
              {/* Volume icon */}
              <div className="w-4 h-4 flex items-center justify-center opacity-90">
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
                  <path d="M2 5h2l4-3v12l-4-3H2V5z" />
                  <path d="M11 4c1.5 1.5 1.5 6.5 0 8" stroke="white" fill="none" strokeWidth="1.5" />
                </svg>
              </div>
              
              {/* Divider */}
              <div className="w-px h-4 bg-[#1941A5]" />
              
              {/* Clock */}
              <span 
                className="text-xs font-medium"
                style={{
                  color: "white",
                  textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                  fontFamily: "Tahoma, sans-serif",
                }}
              >
                {currentTime}
              </span>
            </div>
          </motion.div>
      </div>

      {/* Terminal Window Container */}
      <motion.div 
        key="terminal-window-container"
        className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center p-8 pb-14 pointer-events-none"
        style={{ 
          perspective: "1500px",
          perspectiveOrigin: "center 70%",
        }}
      >
        {/* Terminal Window - Windows XP CMD Style */}
        <motion.div
          className="relative w-full max-w-4xl pointer-events-auto shadow-2xl"
          style={{ 
            transformStyle: "preserve-3d",
            transformOrigin: "center top",
          }}
          initial={{ 
            rotateX: 0, 
            y: 0, 
            scale: 0.9,
            opacity: 1,
          }}
          animate={{
            rotateX: 0,
            y: 0, 
            scale: exitPhase === "remove" ? 0.95 : 1,
            opacity: exitPhase === "remove" ? 0 : 1,
          }}
          transition={{
            duration: exitPhase === "remove" ? 0.3 : 0.5,
          }}
        >
          {/* Window Frame - XP Style */}
          <div 
            className="relative overflow-hidden"
            style={{
              border: "1px solid #0054E3",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 10px 40px rgba(0,0,0,0.5)",
              borderRadius: "8px 8px 0 0",
            }}
          >
            {/* Title Bar - XP Blue Gradient */}
            <div 
              className="h-[30px] flex items-center justify-between px-1 relative"
              style={{
                background: "linear-gradient(180deg, #0A246A 0%, #0F3B91 10%, #1457C0 50%, #0C3D9F 90%, #0A246A 100%)",
              }}
            >
              {/* Shine effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 60%)",
                }}
              />

              {/* Icon and Title */}
              <div className="flex items-center gap-2 relative z-10 pl-2">
                {/* CMD Icon */}
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" className="w-4 h-4">
                    <rect x="1" y="1" width="14" height="14" fill="#000" stroke="#808080" strokeWidth="0.5" />
                    <text x="3" y="10" fill="#C0C0C0" fontSize="6" fontFamily="monospace">C:\</text>
                  </svg>
                </div>
                <span 
                  className="text-[12px] font-medium truncate"
                  style={{
                    color: "white",
                    textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
                    fontFamily: "Tahoma, Trebuchet MS, sans-serif",
                  }}
                >
                  C:\WINDOWS\system32\cmd.exe - sapira_intervention.bat
                </span>
              </div>

              {/* Window Buttons */}
              <div className="flex items-center gap-[2px] relative z-10">
                {/* Minimize Button */}
                <motion.button
                  onMouseEnter={() => setHoveredButton("minimize")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-[21px] h-[21px] rounded-sm flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #3D7AE0 0%, #2563EB 50%, #1D4ED8 100%)",
                    border: "1px solid #1E40AF",
                  }}
                  whileHover={{ filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 50%)",
                    }}
                  />
                  <svg viewBox="0 0 10 10" className="w-[8px] h-[8px] relative z-10">
                    <rect x="1" y="7" width="8" height="2" fill="white" />
                  </svg>
                </motion.button>

                {/* Maximize Button */}
                <motion.button
                  onMouseEnter={() => setHoveredButton("maximize")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-[21px] h-[21px] rounded-sm flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #3D7AE0 0%, #2563EB 50%, #1D4ED8 100%)",
                    border: "1px solid #1E40AF",
                  }}
                  whileHover={{ filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 50%)",
                    }}
                  />
                  <svg viewBox="0 0 10 10" className="w-[8px] h-[8px] relative z-10">
                    <rect x="1" y="1" width="8" height="8" fill="none" stroke="white" strokeWidth="1.5" />
                    <rect x="1" y="1" width="8" height="2" fill="white" />
                  </svg>
                </motion.button>

                {/* Close Button */}
                <motion.button
                  onClick={handleCloseClick}
                  onMouseEnter={() => setHoveredButton("close")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-[21px] h-[21px] rounded-sm flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #E04040 0%, #D03030 50%, #B02020 100%)",
                    border: "1px solid #700000",
                  }}
                  whileHover={{ filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 50%)",
                    }}
                  />
                  <svg viewBox="0 0 10 10" className="w-[8px] h-[8px] relative z-10">
                    <path d="M1 1 L9 9 M9 1 L1 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Terminal Content Area - Classic CMD Black */}
            <div 
              className="p-4 min-h-[400px] font-mono text-sm leading-relaxed"
              style={{
                background: "#000000",
                fontFamily: "'Lucida Console', 'Consolas', monospace",
              }}
            >
              {/* Sapira custom header */}
              <div className="mb-4" style={{ color: "#C0C0C0" }}>
                <div>Microsoft Windows XP [Version Pre-AI.0]</div>
                <div>(C) Copyright 1985-2001 Microsoft Corp. | Last update: Never</div>
              </div>

              {/* Completed lines */}
              {completedLines.map((line, index) => (
                <motion.div
                  key={index}
                  className="mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <span style={{ color: "#C0C0C0" }}>{terminalPaths[index % terminalPaths.length]}</span>
                  <span style={{ color: "#FFFFFF" }}> {line}</span>
                </motion.div>
              ))}

              {/* Currently typing line */}
              {currentLineIndex < terminalLines.length && (
                <div className="mb-1">
                  <span style={{ color: "#C0C0C0" }}>{terminalPaths[currentLineIndex % terminalPaths.length]}</span>
                  <span style={{ color: "#FFFFFF" }}> {currentText}</span>
                  <motion.span
                    className="inline-block w-2 h-4 ml-0.5 align-middle"
                    style={{ background: "#C0C0C0" }}
                    animate={{ opacity: showCursor ? [1, 0] : 0 }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </div>
              )}

              {/* Blinking cursor after all lines */}
              {currentLineIndex >= terminalLines.length && !isExiting && (
                <div className="mb-1">
                  <span style={{ color: "#C0C0C0" }}>{terminalPaths[0]}</span>
                  <motion.span
                    className="inline-block w-2 h-4 ml-1 align-middle"
                    style={{ background: "#C0C0C0" }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
