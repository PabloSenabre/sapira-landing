"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileDesktopBannerProps {
  variant?: "floating" | "inline";
}

/**
 * Banner that reminds mobile users that the full experience is on desktop
 * Two variants:
 * - floating: Fixed at bottom of screen, dismissible
 * - inline: Embedded in the page content
 */
export default function MobileDesktopBanner({ variant = "floating" }: MobileDesktopBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed && variant === "floating") return null;

  if (variant === "inline") {
    return (
      <motion.div
        className="w-full py-4 px-6 rounded-2xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.06) 100%)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🖥️</span>
          <div>
            <p 
              className="text-[#1a1a1a] font-medium text-sm leading-snug"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            >
              The full experience awaits on desktop
            </p>
            <p 
              className="text-[#666] text-xs mt-1"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            >
              Immersive animations and interactive elements designed for larger screens.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Floating variant
  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 z-[200]"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div
            className="rounded-2xl p-4 shadow-xl"
            style={{
              background: "rgba(26, 26, 26, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">✨</span>
              <div className="flex-1">
                <p className="text-white font-medium text-sm leading-snug">
                  Best on desktop
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Experience the full immersive journey with animations and interactions.
                </p>
              </div>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-white/40 hover:text-white/80 transition-colors p-1"
                aria-label="Dismiss"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

