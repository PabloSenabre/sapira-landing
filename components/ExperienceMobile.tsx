"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Mobile-friendly Experience page
 * 
 * Instead of the full immersive experience (Video → Terminal → XP → macOS),
 * this shows a beautiful message inviting the user to visit on desktop.
 */
export default function ExperienceMobile() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
      }}
    >
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Icon */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div 
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <span className="text-4xl">🖥️</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-white text-3xl font-light mb-4 leading-tight"
          style={{ 
            fontFamily: "Georgia, 'Times New Roman', serif",
            letterSpacing: "-0.02em",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          This experience is<br />
          <span className="italic">crafted for desktop</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-white/50 text-base mb-10 leading-relaxed"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Our immersive journey through software evolution includes nostalgic animations and interactive elements designed for larger screens.
        </motion.p>

        {/* Visual preview hint */}
        <motion.div
          className="mb-10 flex justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span className="text-2xl opacity-50">📺</span>
          </div>
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span className="text-2xl opacity-50">💻</span>
          </div>
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span className="text-2xl opacity-50">🖥️</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* Primary: Back to manifesto */}
          <Link
            href="/"
            className="block w-full py-4 px-6 rounded-full text-center font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            ← Back to Manifesto
          </Link>

          {/* Hint */}
          <p 
            className="text-xs text-white/30"
            style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
          >
            Open sapira.ai on your laptop or desktop for the full experience
          </p>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 50%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

