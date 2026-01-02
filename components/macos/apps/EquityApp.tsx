"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import LiquidGlassButton from "@/components/liquid-glass/LiquidGlassButton";

// Comparison table data - Pixelmatters style
const comparisonData = [
  { 
    label: "Investment Type", 
    traditional: "Cash only", 
    sapira: "Services + Capital (up to €2M)",
    highlight: true 
  },
  { 
    label: "Decision Timeline", 
    traditional: "3-6 months", 
    sapira: "30 days maximum",
    highlight: false 
  },
  { 
    label: "Team Support", 
    traditional: "Build it yourself", 
    sapira: "Full AI & engineering team ready",
    highlight: true 
  },
  { 
    label: "Product Quality", 
    traditional: "Variable", 
    sapira: "World-class, guaranteed",
    highlight: true 
  },
  { 
    label: "Post-Investment", 
    traditional: "Quarterly check-ins", 
    sapira: "Daily collaboration partner",
    highlight: true 
  },
];

// Approach pillars
const approachPillars = [
  {
    title: "By Founders, for Founders",
    description: "We've been in your shoes. We earned the right to give advice by building companies ourselves.",
  },
  {
    title: "Hands-on Partnership",
    description: "We don't just write checks. We build alongside you—design, engineering, AI, all in.",
  },
  {
    title: "AI-Native Approach",
    description: "Every company we back integrates AI at its core. Not as a feature—as the foundation.",
  },
  {
    title: "Craft Over Speed",
    description: "We believe in building products that last. Quality compounds. Shortcuts don't.",
  },
];

// What we look for
const targetProfile = [
  {
    title: "Business Traction",
    description: "At least €30k MRR or significant month-over-month growth.",
  },
  {
    title: "AI-First Thinking",
    description: "Founders who see AI as the core of their product.",
  },
  {
    title: "Global Ambition",
    description: "Companies built for international scale from day one.",
  },
  {
    title: "Quality Obsession",
    description: "Founders who care about every pixel, every interaction.",
  },
];

export default function EquityApp() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div 
      className="h-full w-full overflow-auto"
      style={{ 
        background: "linear-gradient(180deg, #F8F7F4 0%, #F5F4F1 50%, #F2F1EE 100%)",
      }}
    >
      {/* Subtle gradient overlay on right side */}
      <div 
        className="absolute top-0 right-0 w-1/3 h-full pointer-events-none z-0"
        style={{
          background: "linear-gradient(270deg, rgba(230, 250, 220, 0.3) 0%, transparent 100%)",
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-full flex items-center justify-center px-8 py-16">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* Badge - Liquid Glass Component */}
          <motion.div 
            className="mb-10 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LiquidGlassButton size="small" variant="light">
              Sapira Equity
            </LiquidGlassButton>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span 
              className="block leading-[1.1] text-[#1a1a1a]"
              style={{ 
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Investing in <em>AI-native</em> founders
            </span>
            <span 
              className="block leading-[1.1] text-[#1a1a1a] mt-2"
              style={{ 
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              by building together.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base text-[#666] max-w-md mx-auto mb-10"
            style={{ fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            We provide craft capital—a different way of investing where we earn our seat at the table by shipping alongside you.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#999] text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Scroll to explore
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span 
              className="text-xs uppercase tracking-[0.2em] text-[#666] block mb-3"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Our Approach
            </span>
            <h2 
              className="text-[#1a1a1a]"
              style={{ 
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                fontWeight: 400,
              }}
            >
              We provide <em>craft capital</em>
            </h2>
          </motion.div>

          {/* Approach pillars grid */}
          <div className="grid grid-cols-2 gap-4">
            {approachPillars.map((pillar, index) => (
              <motion.div
                key={index}
                className="p-5 rounded-xl border border-[#e0e0e0] hover:border-[#ccc] transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.8)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 
                  className="text-sm mb-2 text-[#1a1a1a]"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}
                >
                  {pillar.title}
                </h3>
                <p 
                  className="text-[#666] text-xs leading-relaxed"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <motion.div 
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-[#1a1a1a] mb-2"
              style={{ 
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                fontWeight: 400,
              }}
            >
              Say goodbye to the <em>traditional model</em>
            </h2>
          </motion.div>

          {/* Comparison Table */}
          <motion.div 
            className="overflow-hidden rounded-2xl border border-[#e0e0e0]"
            style={{
              background: "rgba(255,255,255,0.9)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-[#e0e0e0]">
              <div className="p-4 border-r border-[#e0e0e0]">
                <span 
                  className="text-[10px] text-[#999] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  Criteria
                </span>
              </div>
              <div className="p-4 border-r border-[#e0e0e0] text-center">
                <span 
                  className="text-[10px] text-[#999] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  Traditional VC
                </span>
              </div>
              <div className="p-4 text-center bg-gradient-to-r from-transparent to-[rgba(230,250,220,0.3)]">
                <span 
                  className="text-[10px] text-[#1a1a1a] uppercase tracking-[0.15em] font-medium"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  Sapira Equity
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {comparisonData.map((row, index) => (
              <div 
                key={index}
                className={`grid grid-cols-3 border-b border-[#e0e0e0] last:border-b-0 transition-colors duration-200 ${
                  hoveredRow === index ? 'bg-[#fafafa]' : ''
                }`}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div className="p-4 border-r border-[#e0e0e0] flex items-center">
                  <span 
                    className="text-[#1a1a1a] text-xs font-medium"
                    style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                  >
                    {row.label}
                  </span>
                </div>
                <div className="p-4 border-r border-[#e0e0e0] flex items-center justify-center">
                  <span 
                    className="text-[#888] text-xs text-center"
                    style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                  >
                    {row.traditional}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-center bg-gradient-to-r from-transparent to-[rgba(230,250,220,0.15)]">
                  <span 
                    className={`text-xs text-center ${row.highlight ? 'text-[#1a1a1a] font-medium' : 'text-[#1a1a1a]'}`}
                    style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                  >
                    {row.sapira}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="py-16 px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span 
              className="text-xs uppercase tracking-[0.2em] text-[#666] block mb-3"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Target Profile
            </span>
            <h2 
              className="text-[#1a1a1a]"
              style={{ 
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                fontWeight: 400,
              }}
            >
              What we look for
            </h2>
          </motion.div>

          {/* Target profile grid */}
          <div className="grid grid-cols-2 gap-5">
            {targetProfile.map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ 
                    background: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)",
                  }}
                >
                  <Check size={14} className="text-white" />
                </div>
                <div>
                  <h3 
                    className="text-sm mb-1 text-[#1a1a1a]"
                    style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-[#666] text-xs leading-relaxed"
                    style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 relative z-10">
        <motion.div 
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 
            className="mb-4 text-[#1a1a1a]"
            style={{ 
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            Building something<br />
            <em>exceptional</em>?
          </h2>
          
          <p 
            className="text-sm text-[#666] mb-8"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            We'd love to hear from you.
          </p>

          {/* Liquid Glass Button - CTA using CSS classes */}
          <div className="flex justify-center">
            <div className="liquid-glass-wrap">
              <a 
                href="mailto:equity@sapira.ai"
                className="liquid-glass-button"
              >
                <span>Get in Touch</span>
              </a>
              <div className="liquid-glass-shadow"></div>
            </div>
          </div>

          {/* Secondary link */}
          <motion.p
            className="mt-6 text-xs text-[#999]"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            or read our{" "}
            <a href="/manifesto" className="text-[#666] underline underline-offset-4 hover:text-[#1a1a1a] transition-colors">
              manifesto
            </a>
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-[#e0e0e0] relative z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div 
            className="text-xs text-[#999]"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            Sapira, Inc. ©2025
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-xs text-[#666] hover:text-[#1a1a1a] transition-colors"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-xs text-[#666] hover:text-[#1a1a1a] transition-colors"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
