"use client";

import { motion } from "framer-motion";

interface SapiraAIButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export default function SapiraAIButton({ onClick, isVisible }: SapiraAIButtonProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed left-1/2 -translate-x-1/2 z-[199]"
      style={{ bottom: 90 }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Pure Liquid Glass Button - compact size to fit with dock */}
      <div 
        className="liquid-glass-wrap" 
        style={{ 
          // @ts-expect-error CSS custom property
          "--global--size": "0.7rem" 
        }}
      >
        <button 
          className="liquid-glass-button"
          onClick={onClick}
        >
          <span style={{ 
            fontSize: "0.75em", 
            paddingInline: "1.1em", 
            paddingBlock: "0.55em",
            letterSpacing: "0.01em",
          }}>
            Explain what really Sapira is
          </span>
        </button>
        <div className="liquid-glass-shadow"></div>
      </div>
    </motion.div>
  );
}
