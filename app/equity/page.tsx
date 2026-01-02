"use client";

import { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import LiquidGlassButton from "@/components/liquid-glass/LiquidGlassButton";

// Portfolio companies data
const portfolio = [
  {
    name: "NeuralOps",
    description: "AI-powered infrastructure automation",
    sector: "DevOps & AI",
    stage: "Series A",
    status: "Active",
    year: "2024",
  },
  {
    name: "DataWeave",
    description: "Enterprise data orchestration platform",
    sector: "Data Infrastructure",
    stage: "Seed",
    status: "Active",
    year: "2024",
  },
  {
    name: "CortexAI",
    description: "Conversational AI for enterprise workflows",
    sector: "Enterprise AI",
    stage: "Series B",
    status: "Exited",
    year: "2023",
  },
  {
    name: "FlowState",
    description: "Real-time collaboration for distributed teams",
    sector: "Productivity",
    stage: "Seed",
    status: "Active",
    year: "2024",
  },
];

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
    label: "Board Seat", 
    traditional: "Required", 
    sapira: "Flexible",
    highlight: false 
  },
  { 
    label: "Product Quality", 
    traditional: "Variable", 
    sapira: "World-class, guaranteed",
    highlight: true 
  },
  { 
    label: "Hidden Costs", 
    traditional: "Legal fees, consultants", 
    sapira: "None",
    highlight: false 
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
    icon: "👤",
  },
  {
    title: "Hands-on Partnership",
    description: "We don't just write checks. We build alongside you—design, engineering, AI, all in.",
    icon: "🤝",
  },
  {
    title: "AI-Native Approach",
    description: "Every company we back integrates AI at its core. Not as a feature—as the foundation.",
    icon: "✨",
  },
  {
    title: "Craft Over Speed",
    description: "We believe in building products that last. Quality compounds. Shortcuts don't.",
    icon: "🎯",
  },
];

// What we look for
const targetProfile = [
  {
    title: "Business Traction",
    description: "At least €30k MRR or significant month-over-month growth. We build with traction, not napkins.",
  },
  {
    title: "AI-First Thinking",
    description: "Founders who see AI as the core of their product, not just a marketing buzzword.",
  },
  {
    title: "Global Ambition",
    description: "Companies built for international scale from day one. Portugal, US, or anywhere.",
  },
  {
    title: "Quality Obsession",
    description: "Founders who care about every pixel, every interaction, every user experience detail.",
  },
];

export default function EquityPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen"
      style={{ 
        background: "linear-gradient(180deg, #F8F7F4 0%, #F5F4F1 50%, #F2F1EE 100%)",
      }}
    >
      {/* Subtle gradient overlay on right side - like Pixelmatters */}
      <div 
        className="fixed top-0 right-0 w-1/3 h-full pointer-events-none z-0"
        style={{
          background: "linear-gradient(270deg, rgba(230, 250, 220, 0.4) 0%, transparent 100%)",
        }}
      />

      {/* Navigation */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[#1a1a1a] hover:opacity-70 transition-opacity"
          >
            <span 
              className="text-xl font-medium tracking-tight"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            >
              sapira
            </span>
            <span 
              className="text-sm text-[#666] font-light"
              style={{ fontFamily: "Georgia, serif" }}
            >
              equity
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/manifesto" 
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Manifesto
            </Link>
            <Link 
              href="mailto:equity@sapira.ai"
              className="text-sm px-4 py-2 bg-[#1a1a1a] text-white rounded-full hover:bg-[#333] transition-colors"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Get in Touch
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge with Liquid Glass */}
          <motion.div 
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LiquidGlassButton size="small" variant="light">
              Sapira Equity
            </LiquidGlassButton>
          </motion.div>

          {/* Main Title - Pixelmatters serif style */}
          <motion.h1 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span 
              className="block leading-[1.1] text-[#1a1a1a]"
              style={{ 
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Investing in
            </span>
            <span 
              className="block leading-[1.1] text-[#1a1a1a]"
              style={{ 
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              <em>AI-native</em> founders
            </span>
            <span 
              className="block leading-[1.1] text-[#1a1a1a]"
              style={{ 
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              by building together.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-[#666] max-w-xl mx-auto mb-12"
            style={{ fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            We provide craft capital—a different way of investing where we earn our seat at the table by shipping alongside you.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#999] text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Read on ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-24 lg:py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">✦</span>
              <span 
                className="text-sm uppercase tracking-[0.2em] text-[#666]"
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
              >
                Our Approach
              </span>
            </div>
            <h2 
              className="text-[#1a1a1a]"
              style={{ 
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 400,
              }}
            >
              We provide <em>craft capital</em>
            </h2>
            <p 
              className="mt-4 text-[#666] max-w-2xl"
              style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: "1.1rem", lineHeight: 1.7 }}
            >
              A different way of investing. We don't just write checks—we roll up our sleeves and build with you.
            </p>
          </motion.div>

          {/* Approach pillars grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approachPillars.map((pillar, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl border border-[#e0e0e0] hover:border-[#ccc] transition-all duration-300 cursor-pointer group"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                  backdropFilter: "blur(10px)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <span className="text-3xl mb-4 block">{pillar.icon}</span>
                <h3 
                  className="text-xl mb-3 text-[#1a1a1a] group-hover:text-[#333] transition-colors"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}
                >
                  {pillar.title}
                </h3>
                <p 
                  className="text-[#666] leading-relaxed"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section - Pixelmatters Style */}
      <section className="py-24 lg:py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-[#1a1a1a] mb-4"
              style={{ 
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 400,
              }}
            >
              Say goodbye to the <em>traditional model</em>
            </h2>
            <p 
              className="text-[#666] max-w-xl mx-auto"
              style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: "1.1rem" }}
            >
              If you're a founder building with AI, this is for you.
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div 
            className="overflow-hidden rounded-3xl border border-[#e0e0e0]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-[#e0e0e0]">
              <div className="p-6 border-r border-[#e0e0e0]">
                <span 
                  className="text-sm text-[#999] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  Criteria
                </span>
              </div>
              <div className="p-6 border-r border-[#e0e0e0] text-center">
                <span 
                  className="text-sm text-[#999] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  Traditional VC
                </span>
              </div>
              <div className="p-6 text-center bg-gradient-to-r from-transparent to-[rgba(230,250,220,0.3)]">
                <span 
                  className="text-sm text-[#1a1a1a] uppercase tracking-[0.15em] font-medium"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  Sapira Equity
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {comparisonData.map((row, index) => (
              <motion.div 
                key={index}
                className={`grid grid-cols-3 border-b border-[#e0e0e0] last:border-b-0 transition-colors duration-200 ${
                  hoveredRow === index ? 'bg-[#fafafa]' : ''
                }`}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-6 border-r border-[#e0e0e0] flex items-center">
                  <span 
                    className="text-[#1a1a1a] font-medium"
                    style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                  >
                    {row.label}
                  </span>
                </div>
                <div className="p-6 border-r border-[#e0e0e0] flex items-center justify-center">
                  <span 
                    className="text-[#666] text-center"
                    style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                  >
                    {row.traditional}
                  </span>
                </div>
                <div className="p-6 flex items-center justify-center bg-gradient-to-r from-transparent to-[rgba(230,250,220,0.2)]">
                  <span 
                    className={`text-center ${row.highlight ? 'text-[#1a1a1a] font-medium' : 'text-[#1a1a1a]'}`}
                    style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                  >
                    {row.sapira}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="py-24 lg:py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">◎</span>
              <span 
                className="text-sm uppercase tracking-[0.2em] text-[#666]"
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
              >
                Target Profile
              </span>
            </div>
            <h2 
              className="text-[#1a1a1a]"
              style={{ 
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 400,
              }}
            >
              What we look for
            </h2>
          </motion.div>

          {/* Target profile grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {targetProfile.map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ 
                    background: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)",
                  }}
                >
                  <Check size={18} className="text-white" />
                </div>
                <div>
                  <h3 
                    className="text-lg mb-2 text-[#1a1a1a]"
                    style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-[#666] leading-relaxed"
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

      {/* Portfolio Section */}
      <section className="py-24 lg:py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div 
            className="mb-16 flex items-end justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">◆</span>
                <span 
                  className="text-sm uppercase tracking-[0.2em] text-[#666]"
                  style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  Portfolio
                </span>
              </div>
              <h2 
                className="text-[#1a1a1a]"
                style={{ 
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 400,
                }}
              >
                We've done it before
              </h2>
            </div>
          </motion.div>

          {/* Portfolio grid */}
          <div className="space-y-4">
            {portfolio.map((company, index) => (
              <motion.div
                key={index}
                className="group p-6 rounded-2xl border border-[#e0e0e0] hover:border-[#ccc] transition-all duration-300 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 8 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 
                        className="text-xl text-[#1a1a1a] group-hover:text-[#333] transition-colors"
                        style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}
                      >
                        {company.name}
                      </h3>
                      <span 
                        className={`text-xs px-3 py-1 rounded-full ${
                          company.status === "Exited" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-[#f0f0f0] text-[#666]"
                        }`}
                        style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                      >
                        {company.status}
                      </span>
                    </div>
                    <p 
                      className="text-[#666]"
                      style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                    >
                      {company.description}
                    </p>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-8 text-sm text-[#999]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
                    <span className="w-32">{company.sector}</span>
                    <span className="w-20">{company.stage}</span>
                    <span className="w-16">{company.year}</span>
                    <ArrowUpRight 
                      size={20} 
                      className="text-[#ccc] group-hover:text-[#666] transition-colors" 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 lg:py-40 px-6 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 
            className="mb-6 text-[#1a1a1a]"
            style={{ 
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            Building something<br />
            <em>exceptional</em>?
          </h2>
          
          <p 
            className="text-lg text-[#666] mb-12"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            We'd love to hear from you.
          </p>

          {/* Liquid Glass Button - CTA */}
          <div className="flex justify-center">
            <LiquidGlassButton 
              href="mailto:equity@sapira.ai" 
              size="default" 
              variant="light"
            >
              Get in Touch
            </LiquidGlassButton>
          </div>

          {/* Secondary link */}
          <motion.p
            className="mt-8 text-sm text-[#999]"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            or read our{" "}
            <Link href="/manifesto" className="text-[#666] underline underline-offset-4 hover:text-[#1a1a1a] transition-colors">
              manifesto
            </Link>
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#e0e0e0] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div 
            className="text-sm text-[#999]"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            Sapira, Inc. ©2025
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              href="#" 
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Terms
            </Link>
            <Link 
              href="#" 
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>

      {/* Subtle grain overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-[100]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
