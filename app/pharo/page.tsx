"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Pharo Onboarding - Placeholder Page
 * 
 * This page will be replaced with the actual Pharo onboarding experience.
 * For now, it shows a placeholder with a back link.
 */

export default function PharoPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo/Icon */}
        <motion.div
          className="text-6xl mb-8"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🚀
        </motion.div>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl text-white mb-4"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 400,
          }}
        >
          Pharo Onboarding
        </h1>

        {/* Description */}
        <p
          className="text-lg mb-8"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
        >
          The personalized onboarding experience is coming soon.
        </p>

        {/* Status badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-yellow-400"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span 
            className="text-sm"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Under construction
          </span>
        </div>

        {/* Back button */}
        <div>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.8)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back to Start</span>
          </Link>
        </div>
      </motion.div>

      {/* Gradient background */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(50,50,80,0.15) 0%, transparent 70%)`
        }}
      />
    </div>
  );
}

