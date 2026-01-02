"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SapiraRecoveryProps {
  onComplete: () => void;
}

const RECOVERY_LINES = [
  { text: "C:\\> System crash detected... 💀", delay: 0, type: "error" as const },
  { text: "C:\\> Legacy software incompatibility identified", delay: 700, type: "error" as const },
  { text: "C:\\> Analyzing deprecated applications...", delay: 1400, type: "info" as const },
  { text: "    └─ Excel 2003: Deprecated", delay: 1800, type: "warning" as const },
  { text: "    └─ Outlook Express: Unsupported", delay: 2100, type: "warning" as const },
  { text: "    └─ SAP R/3: End of life", delay: 2400, type: "warning" as const },
  { text: "    └─ Salesforce Classic: Obsolete", delay: 2700, type: "warning" as const },
  { text: "    └─ ACT! CRM: Discontinued", delay: 3000, type: "warning" as const },
  { text: "    └─ Internet Explorer: Extinct", delay: 3300, type: "warning" as const },
  { text: "", delay: 3800, type: "info" as const },
  { text: "C:\\> ════════════════════════════════════════════════════", delay: 3900, type: "success" as const },
  { text: "C:\\>   SAPIRA AI: THE SOLUTION", delay: 4100, type: "success" as const },
  { text: "C:\\> ════════════════════════════════════════════════════", delay: 4300, type: "success" as const },
  { text: "", delay: 4500, type: "info" as const },
  { text: "C:\\> We don't support outdated, fragmented tools.", delay: 4700, type: "info" as const },
  { text: "C:\\> Sapira AI unifies ALL your business applications", delay: 5200, type: "success" as const },
  { text: "C:\\> into ONE intelligent, AI-powered operating system.", delay: 5700, type: "success" as const },
  { text: "", delay: 6200, type: "info" as const },
  { text: "C:\\> 6 legacy apps → 1 unified platform", delay: 6500, type: "success" as const },
  { text: "C:\\> Manual processes → AI automation", delay: 6900, type: "success" as const },
  { text: "C:\\> Fragmented data → Connected intelligence", delay: 7300, type: "success" as const },
  { text: "", delay: 7700, type: "info" as const },
  { text: "C:\\> Initializing Sapira AI transformation...", delay: 8000, type: "success" as const },
];

type LineType = "error" | "warning" | "info" | "success";

interface TerminalLine {
  text: string;
  type: LineType;
  isVisible: boolean;
}

export default function SapiraRecovery({ onComplete }: SapiraRecoveryProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update clock like XP taskbar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      setCurrentTime(`${displayHours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reveal lines progressively
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    RECOVERY_LINES.forEach((line) => {
      const timeout = setTimeout(() => {
        setLines(prev => [
          ...prev,
          { text: line.text, type: line.type, isVisible: true }
        ]);
      }, line.delay);
      timeouts.push(timeout);
    });

    // Complete after all lines
    const completeTimeout = setTimeout(() => {
      setIsComplete(true);
    }, RECOVERY_LINES[RECOVERY_LINES.length - 1].delay + 1500);
    timeouts.push(completeTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Transition to next phase
  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(onComplete, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, onComplete]);

  const getLineColor = (type: LineType) => {
    switch (type) {
      case "error": return "#FF6B6B";
      case "warning": return "#FFFF00";
      case "info": return "#C0C0C0";
      case "success": return "#00FF00";
      default: return "#C0C0C0";
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex flex-col"
      style={{ background: "#000080" }} // Classic blue screen style background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Windows XP Bliss Wallpaper Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, 
              #3A6EA5 0%,
              #6B9BC3 15%,
              #87CEEB 30%,
              #98D4E8 45%,
              #7CB854 50%,
              #5DA03C 55%,
              #4A9030 65%,
              #3D7A28 80%,
              #2D6420 100%
            )
          `,
          filter: "brightness(0.6) saturate(0.8)",
        }}
      >
        {/* Bliss hills effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 200% 100% at 50% 100%, 
                rgba(77, 153, 45, 0.8) 0%, 
                rgba(93, 160, 60, 0.6) 20%,
                transparent 50%
              )
            `,
          }}
        />
      </div>

      {/* Scanlines effect for CRT feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 z-10"
        style={{
          background: "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8 pb-14 relative z-20">
        {/* Terminal window - XP Style */}
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Window Shadow */}
          <div 
            className="absolute inset-0"
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
              transform: "translateY(4px)",
              borderRadius: "8px 8px 0 0",
            }}
          />

          {/* Window Frame */}
          <div 
            className="relative overflow-hidden"
            style={{
              border: "1px solid #0054E3",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
              borderRadius: "8px 8px 0 0",
            }}
          >
            {/* Title Bar - XP Blue */}
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
                {/* Sapira Recovery Icon */}
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" className="w-4 h-4">
                    <rect x="1" y="1" width="14" height="14" fill="#000" stroke="#808080" strokeWidth="0.5" />
                    <text x="2" y="10" fill="#00FF00" fontSize="6" fontFamily="monospace">AI</text>
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
                  Sapira AI Recovery Console
                </span>
              </div>

              {/* Window Buttons */}
              <div className="flex items-center gap-[2px] relative z-10">
                {/* Minimize */}
                <button
                  className="w-[21px] h-[21px] rounded-sm flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #3D7AE0 0%, #2563EB 50%, #1D4ED8 100%)",
                    border: "1px solid #1E40AF",
                  }}
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
                </button>

                {/* Maximize */}
                <button
                  className="w-[21px] h-[21px] rounded-sm flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #3D7AE0 0%, #2563EB 50%, #1D4ED8 100%)",
                    border: "1px solid #1E40AF",
                  }}
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
                </button>

                {/* Close */}
                <button
                  className="w-[21px] h-[21px] rounded-sm flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #E04040 0%, #D03030 50%, #B02020 100%)",
                    border: "1px solid #700000",
                  }}
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
                </button>
              </div>
            </div>

            {/* Terminal content - Black CMD style */}
            <div 
              className="p-4 min-h-[400px]"
              style={{
                background: "#000000",
                fontFamily: "'Lucida Console', 'Consolas', monospace",
              }}
            >
              {/* Sapira Logo ASCII - retro style */}
              <motion.pre
                className="text-center mb-6 text-[10px] leading-tight"
                style={{ 
                  color: "#00FF00",
                  fontFamily: "'Lucida Console', 'Consolas', monospace",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
{`
   _____             _           
  / ____|           (_)          
 | (___   __ _ _ __  _ _ __ __ _ 
  \\___ \\ / _\` | '_ \\| | '__/ _\` |
  ____) | (_| | |_) | | | | (_| |
 |_____/ \\__,_| .__/|_|_|  \\__,_|
              | |                
              |_|    AI Recovery
`}
              </motion.pre>

              {/* Terminal lines */}
              <div className="space-y-1">
                <AnimatePresence mode="sync">
                  {lines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm"
                      style={{ 
                        color: getLineColor(line.type),
                        fontFamily: "'Lucida Console', 'Consolas', monospace",
                      }}
                    >
                      <TypewriterText text={line.text} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Cursor */}
                {!isComplete && (
                  <div className="flex items-center">
                    <span 
                      className="text-sm"
                      style={{ 
                        color: "#C0C0C0",
                        fontFamily: "'Lucida Console', 'Consolas', monospace",
                      }}
                    >
                      {"C:\\> "}
                    </span>
                    <motion.span
                      className="w-2 h-4 ml-1"
                      style={{ 
                        background: "#C0C0C0",
                        opacity: cursorVisible ? 1 : 0,
                      }}
                    />
                  </div>
                )}

                {/* Continue prompt */}
                <AnimatePresence>
                  {isComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-8 text-center"
                    >
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2"
                        style={{
                          background: "rgba(0, 255, 0, 0.1)",
                          border: "1px solid rgba(0, 255, 0, 0.4)",
                        }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <span 
                          className="text-xs"
                          style={{ 
                            color: "#00FF00",
                            fontFamily: "'Lucida Console', 'Consolas', monospace",
                          }}
                        >
                          Launching Sapira AI Assistant...
                        </span>
                        <motion.span
                          style={{ color: "#00FF00" }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⟳
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Windows XP Taskbar */}
      <div 
        className="h-[30px] z-[501] flex items-stretch relative"
        style={{
          background: "linear-gradient(180deg, #3168d5 0%, #4993E4 3%, #2663D1 5%, #1941A5 90%, #1941A5 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
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
                <linearGradient id="xp-red-rec" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF5E5E" />
                  <stop offset="100%" stopColor="#DA1F1F" />
                </linearGradient>
                <linearGradient id="xp-green-rec" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7FD858" />
                  <stop offset="100%" stopColor="#1FA51F" />
                </linearGradient>
                <linearGradient id="xp-blue-rec" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5EB8FF" />
                  <stop offset="100%" stopColor="#1F5FDA" />
                </linearGradient>
                <linearGradient id="xp-yellow-rec" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE75E" />
                  <stop offset="100%" stopColor="#FFBA1F" />
                </linearGradient>
              </defs>
              <path d="M2 2 L11 3 L11 11 L2 11 Z" fill="url(#xp-red-rec)" />
              <path d="M13 3 L22 2 L22 11 L13 11 Z" fill="url(#xp-green-rec)" />
              <path d="M2 13 L11 13 L11 22 L2 21 Z" fill="url(#xp-blue-rec)" />
              <path d="M13 13 L22 13 L22 21 L13 22 Z" fill="url(#xp-yellow-rec)" />
            </svg>
          </div>
          
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
          <div className="w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-4 h-4">
              <circle cx="10" cy="10" r="8" fill="#4BA3E3" stroke="#1C5C8A" strokeWidth="1" />
              <ellipse cx="10" cy="10" rx="7" ry="3" fill="none" stroke="white" strokeWidth="1.5" />
              <text x="10" y="13" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontStyle="italic">e</text>
            </svg>
          </div>
        </div>

        {/* Active Window */}
        <div className="flex-1 flex items-center gap-1 px-1">
          <div
            className="h-[22px] px-3 flex items-center gap-2 rounded min-w-[140px] max-w-[220px]"
            style={{
              background: "linear-gradient(180deg, #1E4B9E 0%, #1941A5 50%, #15378E 100%)",
              border: "1px solid #0A246A",
              boxShadow: "inset 0 0 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4">
              <rect x="1" y="1" width="14" height="14" fill="#000" stroke="#808080" />
              <text x="2" y="10" fill="#00FF00" fontSize="6" fontFamily="monospace">AI</text>
            </svg>
            <span 
              className="text-xs truncate"
              style={{
                color: "white",
                textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                fontFamily: "Tahoma, sans-serif",
              }}
            >
              Sapira AI Recovery Console
            </span>
          </div>
        </div>

        {/* System Tray */}
        <div 
          className="flex items-center gap-2 px-3 h-full"
          style={{
            background: "linear-gradient(180deg, #0F8AE8 0%, #1163C6 50%, #0D5BB5 100%)",
            borderLeft: "1px solid #1941A5",
            boxShadow: "inset 1px 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <div className="w-4 h-4 flex items-center justify-center opacity-90">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
              <path d="M2 5h2l4-3v12l-4-3H2V5z" />
              <path d="M11 4c1.5 1.5 1.5 6.5 0 8" stroke="white" fill="none" strokeWidth="1.5" />
            </svg>
          </div>
          
          <div className="w-px h-4 bg-[#1941A5]" />
          
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
      </div>
    </motion.div>
  );
}

// Typewriter text component
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}
