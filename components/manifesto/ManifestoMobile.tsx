"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import NavbarMinimal from "@/components/NavbarMinimal";

interface ManifestoMobileProps {
  onComplete?: () => void;
}

/**
 * Simplified Manifesto for mobile devices
 * 
 * Key simplifications:
 * - No easter eggs (Konami, Matrix, bloatware, server room)
 * - No floating parallax logos
 * - No custom cursor
 * - No complex animations
 * - Clean, readable typography
 * - Single desktop reminder banner (inline)
 */
export default function ManifestoMobile({ onComplete }: ManifestoMobileProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative bg-[#F5F5F3] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Navbar */}
      <NavbarMinimal />

      {/* Main Content */}
      <div 
        className="relative z-10 mx-auto" 
        style={{ maxWidth: "640px", padding: "100px 24px 48px" }}
      >
        
        {/* Section 1: Opening Statement */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="mb-10 flex justify-center"
            >
              <div 
                className="px-4 py-2 rounded-full text-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.6)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                  color: "#1a1a1a",
                }}
              >
                Sapira AI • Manifesto
              </div>
            </motion.div>

            {/* Main Title */}
            <h1 className="text-center mb-12">
              <span 
                className="block leading-[1] tracking-[-0.03em] text-[#1a1a1a]"
                style={{ 
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(2.2rem, 9vw, 3.5rem)",
                  fontWeight: 400,
                }}
              >
                The one-size-fits-all
              </span>
              <span 
                className="block leading-[1] tracking-[-0.03em] italic text-[#1a1a1a]"
                style={{ 
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(2.2rem, 9vw, 3.5rem)",
                  fontWeight: 400,
                }}
              >
                era is over.
              </span>
            </h1>
          </motion.div>
        </section>

        {/* Desktop Banner - Single inline banner */}
        <motion.div
          className="w-full py-4 px-5 rounded-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.06) 100%)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">🖥️</span>
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

        {/* Section 2: The Problem */}
        <section className="mb-12">
          <MobileParagraph delay={0}>
            We reached the limit of standardized solutions.
          </MobileParagraph>

          <MobileParagraph delay={0.1}>
            For years, we <em className="text-[#1a1a1a] font-medium">adapted to the cloud</em>.
            But year after year, our workflows remained trapped in the same boxes.
          </MobileParagraph>

          <MobileParagraph delay={0.2}>
            <span className="opacity-50 line-through">The vision of agile tools</span>{" "}
            gave way to a dozen generic platforms that we pay for but barely use.
          </MobileParagraph>
        </section>

        {/* Section 3: The Contrast */}
        <section className="mb-12">
          <MobileParagraph delay={0}>
            We choose our <em>mission</em>. Our <em>culture</em>. Our <em>strategy</em>.
          </MobileParagraph>

          <MobileParagraph delay={0.1}>
            But our software? Still a rental.
            <span className="block mt-2">
              Made for billions. <strong>Not for you.</strong>
            </span>
          </MobileParagraph>
        </section>

        {/* Section 4: The Vision */}
        <section className="mb-12">
          <MobileParagraph delay={0}>
            When software is oriented around <em>your</em> business…
          </MobileParagraph>

          <MobileParagraph delay={0.1}>
            It's freed from the friction, the bloat, and the rigid structures.
          </MobileParagraph>

          <MobileParagraph delay={0.2}>
            We believe your ambition becomes reality when software is the{" "}
            <strong>nervous system</strong> of your unique vision.
          </MobileParagraph>
        </section>

        {/* Section 5: Introducing Sapira */}
        <section className="py-16 text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p 
              className="text-base mb-4 tracking-wide text-[#666]"
              style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
            >
              That's why we built
            </p>
            <h2 
              className="leading-none tracking-[-0.02em] text-[#1a1a1a] mb-4"
              style={{ 
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "clamp(3rem, 12vw, 6rem)",
                fontWeight: 300,
              }}
            >
              Sapira.
            </h2>
            <p 
              className="text-xl text-[#1a1a1a]"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400 }}
            >
              The first <em>AI-native</em> software factory.
            </p>
          </motion.div>
        </section>

        {/* Section 6: The Solution */}
        <section className="mb-12">
          <MobileParagraph delay={0}>
            Operating systems based on <strong>your logic</strong>, <strong>your data</strong>, 
            and <strong>your context</strong>.
          </MobileParagraph>

          <MobileParagraph delay={0.1}>
            Not another subscription—<br />
            <span className="italic">a system built for you.</span>
          </MobileParagraph>
        </section>

        {/* Section 7: The Future */}
        <section className="mb-12">
          <MobileParagraph delay={0}>
            Someday, we'll look back on traditional SaaS like old server rooms.
          </MobileParagraph>

          <MobileParagraph delay={0.1}>
            We believe in a future where software is no longer rented, but <strong>born</strong>.
          </MobileParagraph>

          <MobileParagraph delay={0.2}>
            Where the code adapts to the company—<br />
            for those who dare to build different.
          </MobileParagraph>
        </section>

        {/* Section 8: CTA */}
        <section className="py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 
              className="mb-4 leading-[1.15] tracking-[-0.02em] text-[#1a1a1a]"
              style={{ 
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "clamp(1.8rem, 7vw, 2.5rem)",
                fontWeight: 400,
              }}
            >
              A new era of<br />
              <span className="italic">enterprise software</span><br />
              is here.
            </h2>

            <motion.p
              className="text-xl mb-8 text-[#1a1a1a]"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              We are Sapira.
            </motion.p>

            {/* CTA Button - Liquid Glass style */}
            <motion.div
              className="flex justify-center"
              whileTap={{ scale: 0.98 }}
            >
              <div className="liquid-glass-wrap">
                <button 
                  className="liquid-glass-button"
                  onClick={() => {
                    if (onComplete) {
                      onComplete();
                    }
                  }}
                >
                  <span>Discover more →</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-6 border-t border-[#e0e0e0]">
          <div 
            className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#999]"
            style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
          >
            <span>Sapira, Inc. ©2025</span>
            <span>•</span>
            <a href="#" className="hover:text-[#666] transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-[#666] transition-colors">Privacy</a>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}

// Simplified paragraph component for mobile
function MobileParagraph({ 
  children, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  delay?: number;
}) {
  return (
    <motion.p
      className="mb-6 last:mb-0"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "clamp(1.15rem, 4vw, 1.4rem)",
        lineHeight: 1.6,
        letterSpacing: "-0.01em",
        color: "#1a1a1a",
        fontWeight: 400,
      }}
    >
      {children}
    </motion.p>
  );
}

