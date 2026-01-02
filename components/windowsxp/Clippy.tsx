"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClippyProps {
  onDismiss: () => void;
}

const clippyMessages = [
  "It looks like you're using outdated software! Would you like help... oh wait, I can't help with that.",
  "📎 Hi! I noticed you're running Windows XP. That's... vintage!",
  "Did you know Excel 2003 can only handle 65,536 rows? Cute, right?",
  "Pro tip: Try clicking those old apps to see what happens! 😈",
];

export default function Clippy({ onDismiss }: ClippyProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Show Clippy after a delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setMessageIndex(Math.floor(Math.random() * clippyMessages.length));
    }, 2000);

    // Auto-dismiss after some time
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 500);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-[200]"
          style={{
            bottom: 80,
            right: 40,
          }}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
        >
          {/* Speech Bubble */}
          <motion.div
            className="relative mb-2 p-4 rounded-lg max-w-[280px]"
            style={{
              background: "#FFFDE7",
              border: "2px solid #FFA000",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Close button */}
            <motion.button
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold"
              style={{
                background: "linear-gradient(135deg, #FF6B6B 0%, #E53935 100%)",
                color: "white",
                border: "2px solid #B71C1C",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
              onClick={() => {
                setIsVisible(false);
                setTimeout(onDismiss, 300);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>

            <p 
              className="text-[12px] leading-relaxed"
              style={{
                fontFamily: "Comic Sans MS, Tahoma, sans-serif",
                color: "#333",
              }}
            >
              {clippyMessages[messageIndex]}
            </p>

            {/* Speech bubble tail */}
            <div
              className="absolute -bottom-3 right-8 w-0 h-0"
              style={{
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: "12px solid #FFA000",
              }}
            />
            <div
              className="absolute -bottom-2 right-[34px] w-0 h-0"
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "10px solid #FFFDE7",
              }}
            />
          </motion.div>

          {/* Clippy Character */}
          <motion.div
            className="flex items-end justify-end"
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ClippyCharacter />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Clippy SVG Character
function ClippyCharacter() {
  return (
    <svg viewBox="0 0 80 120" className="w-20 h-28 drop-shadow-lg">
      <defs>
        <linearGradient id="clippy-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B0B0B0" />
          <stop offset="30%" stopColor="#E0E0E0" />
          <stop offset="50%" stopColor="#F5F5F5" />
          <stop offset="70%" stopColor="#D0D0D0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
        <linearGradient id="clippy-eye-white" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F0F0" />
        </linearGradient>
      </defs>

      {/* Main paperclip body */}
      <g strokeWidth="6" stroke="url(#clippy-metal)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer loop */}
        <path d="M25 15 
                 C25 10, 55 10, 55 15 
                 L55 95 
                 C55 105, 25 105, 25 95 
                 L25 35" />
        
        {/* Inner loop */}
        <path d="M35 25 
                 C35 22, 45 22, 45 25 
                 L45 85 
                 C45 90, 35 90, 35 85 
                 L35 45" />
      </g>

      {/* Eyes */}
      <g>
        {/* Left eye */}
        <ellipse cx="32" cy="50" rx="8" ry="10" fill="url(#clippy-eye-white)" stroke="#666" strokeWidth="1" />
        <ellipse cx="34" cy="51" rx="4" ry="5" fill="#333" />
        <circle cx="35" cy="49" r="1.5" fill="white" />
        
        {/* Right eye */}
        <ellipse cx="48" cy="50" rx="8" ry="10" fill="url(#clippy-eye-white)" stroke="#666" strokeWidth="1" />
        <ellipse cx="50" cy="51" rx="4" ry="5" fill="#333" />
        <circle cx="51" cy="49" r="1.5" fill="white" />
      </g>

      {/* Eyebrows - raised (surprised/curious expression) */}
      <g stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M24 40 Q32 36, 38 40" />
        <path d="M42 40 Q48 36, 56 40" />
      </g>

      {/* Smile */}
      <path 
        d="M35 65 Q40 72, 45 65" 
        stroke="#666" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round"
      />

      {/* Hands/Arms waving */}
      <motion.g
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
        style={{ transformOrigin: "15px 70px" }}
      >
        <path 
          d="M15 70 L5 60 L2 65 L8 70 L2 75 L5 80 L15 70" 
          fill="#E0E0E0" 
          stroke="#909090" 
          strokeWidth="1"
        />
      </motion.g>

      <motion.g
        animate={{ rotate: [0, -15, 15, 0] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.2 }}
        style={{ transformOrigin: "65px 70px" }}
      >
        <path 
          d="M65 70 L75 60 L78 65 L72 70 L78 75 L75 80 L65 70" 
          fill="#E0E0E0" 
          stroke="#909090" 
          strokeWidth="1"
        />
      </motion.g>
    </svg>
  );
}

