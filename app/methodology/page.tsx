"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Database, Mail, FileText, Workflow, Menu, X } from "lucide-react";
import PageWipeTransition from "@/components/PageWipeTransition";
import { LiquidGlassCursor } from "@/components/liquid-glass";

// ============================================
// REAL LOGO URLs - Enterprise Systems (CDN reliable)
// ============================================
const LOGOS = {
  // ERP Systems
  SAP: "https://cdn.worldvectorlogo.com/logos/sap-3.svg",
  ORACLE: "https://cdn.worldvectorlogo.com/logos/oracle-6.svg",
  WORKDAY: "https://cdn.worldvectorlogo.com/logos/workday-2.svg",
  
  // Workflow & Comms  
  SALESFORCE: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg",
  SERVICENOW: "https://cdn.worldvectorlogo.com/logos/servicenow-1.svg",
  JIRA: "https://cdn.worldvectorlogo.com/logos/jira-1.svg",
  SLACK: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
  TEAMS: "https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg",
};

// Logo component
function Logo({ src, alt, size = "w-8 h-8" }: { src: string; alt: string; size?: string }) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${size} object-contain`}
      loading="lazy"
    />
  );
}

// ============================================
// MOBILE DESKTOP REMINDER BANNER
// ============================================

function MobileDesktopReminder() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only show on mobile (using CSS for the actual hiding)
  if (!mounted || isDismissed) return null;
  
  return (
    <motion.div
      className="fixed bottom-4 left-4 right-4 z-[90] md:hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      <div 
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,249,0.95) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        }}
      >
        <span className="text-lg">🖥️</span>
        <div className="flex-1">
          <p className="text-xs text-black/70 font-medium">Best on desktop</p>
          <p className="text-[10px] text-black/40">Full experience with all details</p>
        </div>
        <button 
          onClick={() => setIsDismissed(true)}
          className="text-black/30 hover:text-black/50 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================
// METHODOLOGY PAGE - Rich Visual Details
// ============================================

export default function MethodologyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative">
      {/* Liquid glass cursor - hidden on touch devices via CSS */}
      <div className="hidden md:block">
        <LiquidGlassCursor enabled={true} size={40} zIndex={9999} />
      </div>
      <MethodologyNavbar />
      <MobileDesktopReminder />

      <HeroSection />
      <ProblemSection onEnter={() => setCurrentTheme("dark")} />
      <SolutionIntroSection onEnter={() => setCurrentTheme("light")} />
      <DiscoverSection />
      <PageWipeTransition 
        phaseName="Forge" 
        phaseLabel="II" 
        fromTheme="light"
        toTheme="dark"
        fromName="Light"
        toName="Forge"
      />
      <BuildSection onEnter={() => setCurrentTheme("dark")} />
      <PageWipeTransition 
        phaseName="Tower" 
        phaseLabel="III" 
        fromTheme="dark"
        toTheme="light"
        fromName="Forge"
        toName="Tower"
      />
      <ControlSection onEnter={() => setCurrentTheme("light")} />
      <TimelineSection />
      <FinalCTASection onEnter={() => setCurrentTheme("dark")} />
    </div>
  );
}

// ============================================
// METHODOLOGY NAVBAR - Smooth & Performant
// ============================================

const methodologyNavLinks = [
  { href: "#intro", label: "Intro" },
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#discover", label: "Discover" },
  { href: "#build", label: "Build" },
  { href: "#control", label: "Control" },
];

function MethodologyNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("intro");
  const [isDarkSection, setIsDarkSection] = useState(false);
  const lastScrollY = useRef(0);

  // Dark sections in the page
  const darkSections = ["problem", "build"];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      
      setScrolled(currentScrollY > 100);
      
      // Always show in top zone
      if (currentScrollY < 200) {
        setIsVisible(true);
      }
      // Show immediately when scrolling up (any amount)
      else if (delta < -2) {
        setIsVisible(true);
      }
      // Hide when scrolling down past threshold
      else if (delta > 5 && currentScrollY > 300) {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;

      // Detect active section and theme
      const sections = methodologyNavLinks.map(link => link.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            setIsDarkSection(darkSections.includes(sections[i]));
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -120, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className={`max-w-5xl mx-auto px-4 md:px-6 transition-all duration-500`}>
        <div className={`flex items-center justify-between transition-all duration-500 h-[70px] ${scrolled ? "nav-glass rounded-full px-6 py-3" : ""}`}>
        
          {/* Logo Sapira - Left side */}
          <Link href="/" className="flex items-center group">
            <motion.div 
              className="flex items-center justify-center rounded-[6px] overflow-hidden"
              style={{
                padding: "6px 14px",
                background: isDarkSection 
                  ? "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)"
                  : "linear-gradient(145deg, #1a1a1f 0%, #252530 40%, #1f1f25 100%)",
                boxShadow: isDarkSection 
                  ? "inset 0 0.5px 0.5px rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.3)"
                  : "inset 0 0.5px 0.5px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.15)",
                border: isDarkSection ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span 
                className="select-none"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                Sapira
              </span>
            </motion.div>
          </Link>

          {/* Section Navigation - Center */}
          <div 
            className="flex items-center gap-1 rounded-full p-1 transition-all duration-300"
            style={{
              background: isDarkSection ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
              border: isDarkSection ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            {methodologyNavLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200"
                  style={{
                    background: isActive 
                      ? isDarkSection 
                        ? "rgba(255,255,255,0.15)" 
                        : "rgba(255,255,255,0.9)"
                      : "transparent",
                    color: isActive 
                      ? isDarkSection 
                        ? "rgba(255,255,255,0.95)" 
                        : "rgba(0,0,0,0.9)"
                      : isDarkSection 
                        ? "rgba(255,255,255,0.45)" 
                        : "rgba(0,0,0,0.5)",
                    boxShadow: isActive 
                      ? isDarkSection 
                        ? "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.2)" 
                        : "0 1px 3px rgba(0,0,0,0.08)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = isDarkSection 
                        ? "rgba(255,255,255,0.75)" 
                        : "rgba(0,0,0,0.8)";
                      e.currentTarget.style.background = isDarkSection 
                        ? "rgba(255,255,255,0.08)" 
                        : "rgba(255,255,255,0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = isDarkSection 
                        ? "rgba(255,255,255,0.45)" 
                        : "rgba(0,0,0,0.5)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Back Button - Right side */}
          <Link href="/" className="flex items-center group">
            <motion.div 
              className="flex items-center justify-center rounded-full px-3 py-2 transition-colors"
              style={{
                background: isDarkSection ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                border: isDarkSection ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft 
                className="w-4 h-4 transition-colors" 
                style={{ color: isDarkSection ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ============================================
// FLOATING NAVIGATION
// ============================================

function FloatingNav({ theme }: { theme: "light" | "dark" }) {
  const sections = [
    { id: "intro", num: "01" },
    { id: "problem", num: "02" },
    { id: "solution", num: "03" },
    { id: "discover", num: "04" },
    { id: "build", num: "05" },
    { id: "control", num: "06" },
    { id: "timeline", num: "07" },
  ];
  
  const isDark = theme === "dark";

  return (
    <motion.nav
      className="fixed right-8 top-1/2 -translate-y-1/2 z-[90] hidden lg:flex flex-col items-center gap-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="group relative flex items-center"
        >
          <span 
            className={`absolute right-5 text-[8px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${
              isDark ? "text-white/40" : "text-black/35"
            }`}
          >
            {section.num}
          </span>
          
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isDark ? "bg-white/25 group-hover:bg-white/60" : "bg-black/20 group-hover:bg-black/50"
            }`}
          />
        </a>
      ))}
    </motion.nav>
  );
}

// ============================================
// REVEAL TEXT
// ============================================

function RevealText({ children, className = "", delay = 0 }: { children: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const words = children.split(" ");

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  return (
    <section id="intro" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FAFAF9] text-[#1a1a1a]">
      <div ref={ref} className="w-full">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Corner frames */}
        <motion.div className="absolute top-16 left-16 w-20 h-20 border-l-2 border-t-2 border-black/[0.08]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
        <motion.div className="absolute top-16 right-16 w-20 h-20 border-r-2 border-t-2 border-black/[0.08]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
        <motion.div className="absolute bottom-16 left-16 w-20 h-20 border-l-2 border-b-2 border-black/[0.08]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
        <motion.div className="absolute bottom-16 right-16 w-20 h-20 border-r-2 border-b-2 border-black/[0.08]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />

        <motion.div className="relative z-10 text-center max-w-6xl mx-auto px-8" style={{ opacity, y }}>
          {/* Eyebrow */}
          <motion.div
            className="flex items-center justify-center gap-6 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div className="w-16 h-[1px] bg-black/15" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.5 }} />
            <span className="text-[11px] tracking-[0.5em] uppercase text-black/40 font-medium">Our Methodology</span>
            <motion.div className="w-16 h-[1px] bg-black/15" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.5 }} />
          </motion.div>

          {/* Main Title */}
          <div className="overflow-hidden mb-12">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span 
                className="text-[18vw] md:text-[15vw] lg:text-[220px] leading-[0.85] block text-[#0a0a0a]"
                style={{ fontFamily: "'Times New Roman', Georgia, serif", fontWeight: 300, letterSpacing: "-0.04em" }}
              >
                Pharo
              </span>
            </motion.h1>
          </div>

          <motion.p
            className="text-2xl md:text-3xl text-black/35 font-light mb-2"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            AI Office System
          </motion.p>
          
          <motion.p
            className="text-[11px] text-black/25 tracking-[0.4em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            for Enterprise Operations
          </motion.p>

          {/* Three pillars - LARGER */}
          <motion.div
            className="flex justify-center gap-20 md:gap-36 mt-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {[
              { name: "Light", label: "Discover", roman: "I" },
              { name: "Forge", label: "Build", roman: "II" },
              { name: "Tower", label: "Control", roman: "III" },
            ].map((pillar, i) => (
              <motion.div
                key={pillar.name}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.1 }}
              >
                <span className="text-[10px] text-black/20 tracking-[0.5em] block mb-4">{pillar.roman}</span>
                <p className="text-2xl md:text-3xl font-light text-black/70 mb-2" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  {pillar.name}
                </p>
                <p className="text-[10px] text-black/25 uppercase tracking-[0.35em]">{pillar.label}</p>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PROBLEM SECTION - Rich details
// ============================================

function ProblemSection({ onEnter }: { onEnter?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const isActive = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (isActive && onEnter) onEnter();
  }, [isActive, onEnter]);

  const problems = [
    { title: "Guesswork", desc: "Use cases invented in workshops, not based on real operational data about how work actually flows.", stat: "1000s", statLabel: "of models and tools" },
    { title: "Fragmentation", desc: "PoCs delivered as one-off projects that never evolve into robust, production-grade systems.", stat: "0", statLabel: "interoperability" },
    { title: "Chaos", desc: "Agents scattered across vendors and teams. No central ownership, no observability.", stat: "∞", statLabel: "shadow IT" },
    { title: "Stagnation", desc: "No data-driven roadmap. Without production control, no sustained ROI.", stat: "?", statLabel: "value generated" },
  ];

  return (
    <section id="problem" className="min-h-screen py-48 px-8 lg:px-20 bg-[#080808] text-white">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Label */}
        <motion.div
          className="flex items-center gap-8 mb-20"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-20 h-[1px] bg-white/20"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <span className="text-[10px] tracking-[0.5em] uppercase text-white/35 font-medium">The Problem</span>
        </motion.div>

        {/* Statement - LARGER */}
        <div className="mb-32">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.15] mb-6 text-white" style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}>
            <RevealText delay={0.2}>AI appears in slides, workshops, and PoCs.</RevealText>
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.15] text-white/25" style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}>
            <RevealText delay={0.4}>But not in the daily work.</RevealText>
          </h2>
        </div>

        {/* Description */}
        <motion.p
          className="text-lg text-white/40 max-w-2xl mb-20 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Four structural failures prevent AI from becoming operational. Each creates friction that compounds over time.
        </motion.p>

        {/* Grid - RICHER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/[0.04]">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              className="p-12 md:p-16 bg-[#080808] relative group"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.12 }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/[0.06] group-hover:border-white/15 transition-colors duration-500" />
              
              {/* Number */}
              <span className="text-[10px] text-white/15 tracking-[0.5em] block mb-10">0{i + 1}</span>
              
              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-light text-white/90 mb-6" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                {p.title}
              </h3>
              
              {/* Description */}
              <p className="text-white/40 text-base leading-relaxed mb-12">{p.desc}</p>
              
              {/* Stats */}
              <div className="flex items-baseline gap-4 pt-8 border-t border-white/[0.06]">
                <span className="text-4xl font-light text-white/60" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  {p.stat}
                </span>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.15em]">{p.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SOLUTION INTRO SECTION - Rich pillars
// ============================================

function SolutionIntroSection({ onEnter }: { onEnter?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isActive = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (isActive && onEnter) onEnter();
  }, [isActive, onEnter]);

  const pillars = [
    { name: "Light", label: "Discover", roman: "I", color: "#E8E4DF", accent: "#C4BEB6" },
    { name: "Forge", label: "Build", roman: "II", color: "#4A4A4A", accent: "#2A2A2A" },
    { name: "Tower", label: "Control", roman: "III", color: "#1A1A1A", accent: "#0A0A0A" },
  ];

  return (
    <section id="solution" className="min-h-screen py-40 px-8 bg-[#FAFAF9] text-[#1a1a1a] relative overflow-hidden">
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.01] to-transparent" />
      
      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-32"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          <motion.span 
            className="inline-block text-[10px] tracking-[0.6em] uppercase text-black/30 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            The Solution
          </motion.span>
          
          {/* Main headline */}
          <div className="overflow-hidden">
            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-light text-[#0a0a0a] mb-6"
              style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.03em" }}
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              AI Office System
            </motion.h2>
          </div>
          
          <motion.p
            className="text-xl md:text-2xl text-black/30 font-light max-w-xl mx-auto"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            built on real workflows
          </motion.p>
        </motion.div>

        {/* Convergence statement - refined */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-40"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
        >
          <div className="w-[1px] h-16 bg-black/10 mx-auto mb-12" />
          <p className="text-lg md:text-xl text-black/50 leading-relaxed">
            Pharo is where we converge. An enabling layer that aligns discovery, execution, and oversight so AI moves from intent to impact, together.
          </p>
          <div className="w-[1px] h-16 bg-black/10 mx-auto mt-12" />
        </motion.div>

        {/* Three Pillars - Premium Design */}
        <div className="grid grid-cols-3 gap-0 max-w-4xl mx-auto">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.name}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.8 }}
            >
              {/* Pillar column */}
              <div className="relative mx-auto" style={{ width: "100%" }}>
                {/* The bar */}
                <motion.div
                  className="mx-auto relative overflow-hidden"
                  style={{ 
                    width: 100,
                    backgroundColor: pillar.color,
                  }}
                  initial={{ height: 0 }}
                  animate={isInView ? { height: 140 + i * 50 } : {}}
                  transition={{ duration: 1.2, delay: 1 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Top accent line */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: pillar.accent }}
                  />
                  
                  {/* Roman numeral */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span 
                      className="text-sm tracking-[0.3em] font-light"
                      style={{ 
                        color: i === 0 ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)" 
                      }}
                    >
                      {pillar.roman}
                    </span>
                  </div>
                </motion.div>
                
                {/* Base line */}
                <div className="h-[2px] bg-black/[0.06] mx-auto" style={{ width: 100 }} />
              </div>
              
              {/* Labels */}
              <div className="text-center mt-10">
                <motion.p
                  className="text-2xl md:text-3xl font-light text-black/80 mb-3"
                  style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.4 + i * 0.1 }}
                >
                  {pillar.name}
                </motion.p>
                <motion.p
                  className="text-[10px] tracking-[0.4em] uppercase text-black/35"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5 + i * 0.1 }}
                >
                  {pillar.label}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// DISCOVER SECTION - Full details
// ============================================

function DiscoverSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section id="discover" className="py-48 px-8 lg:px-20 bg-[#FAFAF9] text-[#1a1a1a]">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div className="mb-36" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-8 mb-10">
            <span className="text-[10px] tracking-[0.5em] uppercase text-black/30 font-medium">Pharo Light</span>
            <motion.div className="flex-1 h-[1px] bg-black/[0.08]" initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 1, delay: 0.2 }} />
            <span className="text-[11px] tracking-[0.4em] text-black/20">I</span>
          </div>
          
          <div className="overflow-hidden">
            <motion.h2 
              className="text-6xl md:text-7xl lg:text-8xl font-light text-black/85 mb-10"
              style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.03em" }}
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover
            </motion.h2>
          </div>
          <motion.p className="text-xl text-black/40 max-w-2xl leading-relaxed" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
            Turn daily work into a data-backed AI pipeline. <span className="text-black/25">Not from workshops. From real operational data.</span>
          </motion.p>
        </motion.div>

        {/* Steps with rich details */}
        <div className="space-y-40">
          {/* Step 01 - Define */}
          <DiscoverStepRich
            num="01"
            title="Define"
            desc="Select teams and systems. We ingest signals from API logs, ERP backend data, and workflow analysis to map how work really flows."
            note="Always read-only. Zero impact on your systems."
            isInView={isInView}
            delay={0.3}
          >
            <div className="grid grid-cols-3 gap-[1px] bg-black/[0.06] rounded-xl overflow-hidden">
              {/* API Logs */}
              <motion.div
                className="bg-[#FAFAF9] p-8 text-center group hover:bg-black/[0.01] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center gap-3 mb-5 h-12">
                  <Database className="w-7 h-7 text-black/30" />
                  <Workflow className="w-6 h-6 text-black/20" />
                </div>
                <p className="text-base text-black/70 mb-2 font-medium">API Logs</p>
                <p className="text-[11px] text-black/35">REST, GraphQL, internal services</p>
              </motion.div>

              {/* ERP Backend */}
              <motion.div
                className="bg-[#FAFAF9] p-8 text-center group hover:bg-black/[0.01] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-center gap-3 mb-5 h-12">
                  <Logo src={LOGOS.SAP} alt="SAP" size="w-12 h-6" />
                  <Logo src={LOGOS.ORACLE} alt="Oracle" size="w-14 h-5" />
                </div>
                <p className="text-base text-black/70 mb-2 font-medium">ERP Backend</p>
                <p className="text-[11px] text-black/35">SAP, Oracle, Workday, Dynamics</p>
              </motion.div>

              {/* Workflow Events */}
              <motion.div
                className="bg-[#FAFAF9] p-8 text-center group hover:bg-black/[0.01] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-center gap-3 mb-5 h-12">
                  <Logo src={LOGOS.JIRA} alt="Jira" size="w-7 h-7" />
                  <Logo src={LOGOS.SERVICENOW} alt="ServiceNow" size="w-16 h-5" />
                </div>
                <p className="text-base text-black/70 mb-2 font-medium">Workflow Events</p>
                <p className="text-[11px] text-black/35">Email, tickets, approvals</p>
              </motion.div>
            </div>
          </DiscoverStepRich>

          {/* Step 02 - Ingest */}
          <DiscoverStepRich
            num="02"
            title="Ingest"
            desc="Group events into workflows. Compute baseline metrics for each one: volumes, handling times, hand-offs, error rates."
            isInView={isInView}
            delay={0.4}
          >
            <motion.div 
              className="p-12 rounded-xl bg-black/[0.02] border border-black/[0.04]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <p className="text-[10px] text-black/35 uppercase tracking-[0.35em] mb-12">Example: Invoice Approval Workflow</p>
              
              {/* Process flow - responsive grid */}
              <div className="grid grid-cols-6 gap-2 md:gap-4 mb-16">
                {["Receive", "Validate", "Match PO", "Route", "Approve", "Post"].map((step, i) => (
                  <div key={step} className="text-center relative">
                    <motion.div 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/[0.04] flex items-center justify-center mb-3 mx-auto border border-black/[0.06]"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.7 + i * 0.08, type: "spring" }}
                    >
                      <span className="text-xs md:text-sm text-black/50 font-medium">{i + 1}</span>
                    </motion.div>
                    <p className="text-[9px] md:text-[11px] text-black/50 font-medium">{step}</p>
                    {i < 5 && (
                      <div className="absolute top-4 md:top-5 left-[60%] w-[80%] h-[2px] bg-black/[0.08]" />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Metrics */}
              <div className="grid grid-cols-4 gap-8 pt-10 border-t border-black/[0.06]">
                {[
                  { value: "14,000", label: "Monthly volume" },
                  { value: "12 min", label: "Avg. handling time" },
                  { value: "4.2", label: "Avg. hand-offs" },
                  { value: "4.8%", label: "Error rate" },
                ].map((metric, i) => (
                  <motion.div 
                    key={metric.label} 
                    className="text-center"
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1 + i * 0.08 }}
                  >
                    <p className="text-3xl font-light text-black/70 mb-2" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                      {metric.value}
                    </p>
                    <p className="text-[9px] text-black/35 uppercase tracking-[0.2em]">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </DiscoverStepRich>

          {/* Step 03 - Analyze */}
          <DiscoverStepRich
            num="03"
            title="Analyze"
            desc="For every workflow, we calculate three critical dimensions to determine AI-readiness and prioritization."
            isInView={isInView}
            delay={0.5}
          >
            <div className="grid grid-cols-3 gap-6">
              {[
                { title: "AI-Fit Score", value: "94", unit: "/100", desc: "How suitable is this workflow for AI automation?" },
                { title: "Effort", value: "Medium", unit: "", desc: "Technical complexity, integration risks, data quality." },
                { title: "Impact", value: "+$2M", unit: "/year", desc: "Projected savings from time reduction and error elimination." },
              ].map((dim, i) => (
                <motion.div
                  key={dim.title}
                  className="p-10 rounded-xl bg-black/[0.02] border border-black/[0.04] relative overflow-hidden group hover:bg-black/[0.03] transition-colors"
                  initial={{ opacity: 0, y: 25 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-black/[0.05] group-hover:border-black/12 transition-colors duration-500" />
                  
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-light text-black/80" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                      {dim.value}
                    </span>
                    <span className="text-lg text-black/35">{dim.unit}</span>
                  </div>
                  <p className="text-base text-black/60 mb-3 font-medium">{dim.title}</p>
                  <p className="text-[12px] text-black/35 leading-relaxed">{dim.desc}</p>
                </motion.div>
              ))}
            </div>
          </DiscoverStepRich>

          {/* Step 04 - Rank */}
          <DiscoverStepRich
            num="04"
            title="Rank"
            desc="Prioritize opportunities by business unit, impact, risk, and effort. Create a data-backed AI roadmap."
            isInView={isInView}
            delay={0.6}
          >
            <motion.div 
              className="rounded-xl overflow-hidden border border-black/[0.06]"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-10 py-6 text-[9px] tracking-[0.25em] uppercase text-black/35 bg-black/[0.02]">
                <div className="col-span-4">Workflow</div>
                <div className="col-span-2 text-center">Volume</div>
                <div className="col-span-3 text-center">Time Saved</div>
                <div className="col-span-1 text-center">Score</div>
                <div className="col-span-2 text-right">Impact</div>
              </div>
              
              {/* Table rows */}
              {[
                { name: "PO Invoice Reconciliation", volume: "14K/mo", from: "12min", to: "30s", score: 94, impact: "+$2M" },
                { name: "Contract Redlining", volume: "2.4K/mo", from: "45min", to: "8min", score: 87, impact: "+$800K" },
                { name: "Customer Support Triage", volume: "8.2K/mo", from: "15min", to: "2min", score: 91, impact: "+$1.2M" },
              ].map((w, i) => (
                <motion.div
                  key={w.name}
                  className="grid grid-cols-12 gap-4 px-10 py-8 items-center group hover:bg-black/[0.015] transition-colors border-t border-black/[0.04]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className="col-span-4">
                    <p className="text-base text-black/80 font-medium">{w.name}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-base text-black/45 font-mono">{w.volume}</span>
                  </div>
                  <div className="col-span-3 text-center text-base">
                    <span className="text-black/30">{w.from}</span>
                    <span className="mx-3 text-black/20">→</span>
                    <span className="text-black/70 font-medium">{w.to}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-2xl font-light text-black/70" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                      {w.score}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-2xl font-light text-black/80" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                      {w.impact}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </DiscoverStepRich>
        </div>

        {/* Summary */}
        <DiscoverSummary isInView={isInView} />
      </div>
    </section>
  );
}

function DiscoverStepRich({ num, title, desc, note, isInView, delay, children }: { 
  num: string; title: string; desc: string; note?: string; isInView: boolean; delay: number; children: React.ReactNode 
}) {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-40">
          <span 
            className="text-[100px] font-light text-black/[0.04] block leading-none mb-6"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            {num}
          </span>
          <h3 
            className="text-4xl md:text-5xl font-light text-black/80 -mt-20"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            {title}
          </h3>
          <p className="text-black/45 mt-10 leading-relaxed text-base">{desc}</p>
          {note && (
            <p className="text-[11px] text-black/30 mt-10 pt-8 border-t border-black/[0.06]">{note}</p>
          )}
        </div>
      </div>
      <div className="lg:col-span-8">
        {children}
      </div>
    </motion.div>
  );
}

function DiscoverSummary({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      className="mt-48 text-center py-32 rounded-2xl relative overflow-hidden bg-black/[0.02] border border-black/[0.04]"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <div className="absolute top-10 left-10 w-16 h-16 border-l-2 border-t-2 border-black/[0.05]" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-r-2 border-b-2 border-black/[0.05]" />
      
      <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-12 font-medium">Pharo Light · Result</p>
      <h3 className="text-4xl md:text-5xl font-light text-black/85 mb-4" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
        A data-backed AI pipeline.
      </h3>
      <h3 className="text-4xl md:text-5xl font-light text-black/25 mb-20" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
        Not guesswork.
      </h3>
      
      <div className="flex justify-center gap-28 md:gap-40">
        {[
          { value: "3", label: "Workflows identified" },
          { value: "+$4M", label: "Annual impact" },
          { value: "92%", label: "Avg. AI score" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2 + i * 0.1 }}
          >
            <p className="text-6xl font-light text-black/80 mb-3" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              {stat.value}
            </p>
            <p className="text-[10px] text-black/35 uppercase tracking-[0.25em]">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// PhaseTransition components removed - now using PageWipeTransition

// ============================================
// BUILD SECTION - Full details
// ============================================

function BuildSection({ onEnter }: { onEnter?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const isActive = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (isActive && onEnter) onEnter();
  }, [isActive, onEnter]);

  return (
    <section id="build" className="py-48 px-8 lg:px-20 bg-[#080808] text-white">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div className="mb-36" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-8 mb-10">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-medium">Pharo Forge</span>
            <motion.div className="flex-1 h-[1px] bg-white/[0.08]" initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 1, delay: 0.2 }} />
            <span className="text-[11px] tracking-[0.4em] text-white/20">II</span>
          </div>
          
          <div className="overflow-hidden">
            <motion.h2 
              className="text-6xl md:text-7xl lg:text-8xl font-light text-white/95 mb-10"
              style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.03em" }}
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Build
            </motion.h2>
          </div>
          <motion.p className="text-xl text-white/40 max-w-2xl leading-relaxed" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
            Turn on your industrialized assembly line for AI. <span className="text-white/25">Not one-off projects. Repeatable systems.</span>
          </motion.p>
        </motion.div>

        {/* Layers - RICH */}
        <div className="space-y-36">
          {/* Layer 01 */}
          <BuildLayerRich
            num="01"
            title="The Blueprints"
            subtitle="Agent Patterns Library"
            description="Unlock accelerated development through pre-built production-ready templates. Each pattern is battle-tested and deployment-ready."
            isInView={isInView}
            delay={0.4}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.04] rounded-xl overflow-hidden">
              {[
                { name: "RAG Legal", desc: "Contract analysis, compliance review, redlining, risk flagging" },
                { name: "Transactional ERP", desc: "Invoice processing, PO matching, reconciliation, approval routing" },
                { name: "Classification", desc: "Ticket routing, triage, categorization, sentiment analysis" },
              ].map((blueprint, i) => (
                <motion.div
                  key={blueprint.name}
                  className="bg-[#080808] p-12 group relative"
                  initial={{ opacity: 0, y: 25 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {/* Geometric accent */}
                  <div className="w-10 h-10 mb-8 relative">
                    <div className="absolute inset-0 border-2 border-white/12 group-hover:border-white/25 transition-colors duration-400" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white/12 group-hover:bg-white/25 transition-colors duration-400" />
                  </div>
                  
                  <h4 className="text-xl font-light text-white/85 mb-5">{blueprint.name}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{blueprint.desc}</p>
                </motion.div>
              ))}
            </div>
          </BuildLayerRich>

          {/* Layer 02 */}
          <BuildLayerRich
            num="02"
            title="The Builders"
            subtitle="Forward Deployed Engineers"
            description="Adapt the technology to your operations. Your team and our FDEs work side-by-side to ensure production success."
            isInView={isInView}
            delay={0.5}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/[0.04] rounded-xl overflow-hidden">
              <motion.div
                className="bg-[#080808] p-12"
                initial={{ opacity: 0, x: -25 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <h4 className="text-lg font-light text-white/80">Your Team</h4>
                </div>
                <ul className="space-y-5">
                  {["Domain expertise", "Business context", "Process knowledge", "Stakeholder access"].map((item, i) => (
                    <motion.li 
                      key={item} 
                      className="text-base text-white/50 flex items-center gap-5"
                      initial={{ opacity: 0, x: -15 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.8 + i * 0.08 }}
                    >
                      <span className="w-10 h-[1px] bg-white/20" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                className="bg-[#080808] p-12"
                initial={{ opacity: 0, x: 25 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/50" />
                  <h4 className="text-lg font-light text-white/80">Pharo FDEs</h4>
                </div>
                <ul className="space-y-5">
                  {["AI/ML engineering", "Production patterns", "Integration expertise", "Deployment experience"].map((item, i) => (
                    <motion.li 
                      key={item} 
                      className="text-base text-white/50 flex items-center gap-5"
                      initial={{ opacity: 0, x: -15 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.9 + i * 0.08 }}
                    >
                      <span className="w-10 h-[1px] bg-white/20" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </BuildLayerRich>

          {/* Layer 03 */}
          <BuildLayerRich
            num="03"
            title="The AI PMO"
            subtitle="Central Command"
            description="A single pane of glass for all AI initiatives. Track owners, timelines, priorities, and status in real-time."
            isInView={isInView}
            delay={0.6}
          >
            <motion.div
              className="rounded-xl overflow-hidden border border-white/[0.06]"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
            >
              <div className="grid grid-cols-4 gap-[1px] bg-white/[0.04]">
                {["Initiative", "Owner", "Status", "Timeline"].map(header => (
                  <div key={header} className="bg-[#080808] px-8 py-5">
                    <span className="text-[9px] text-white/30 uppercase tracking-[0.25em]">{header}</span>
                  </div>
                ))}
                {[
                  { name: "Invoice Agent", owner: "Finance", status: "Live", timeline: "✓" },
                  { name: "Contract Analyzer", owner: "Legal", status: "UAT", timeline: "Week 2" },
                  { name: "Support Triage", owner: "CX", status: "Build", timeline: "Week 4" },
                ].map((row, i) => (
                  <React.Fragment key={row.name}>
                    <motion.div 
                      className="bg-[#080808] px-8 py-7"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.9 + i * 0.1 }}
                    >
                      <span className="text-base text-white/70">{row.name}</span>
                    </motion.div>
                    <div className="bg-[#080808] px-8 py-7">
                      <span className="text-base text-white/40">{row.owner}</span>
                    </div>
                    <div className="bg-[#080808] px-8 py-7">
                      <span
                        className="text-[10px] px-4 py-2 rounded-full uppercase tracking-wider"
                        style={{
                          background: row.status === "Live" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                          color: row.status === "Live" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {row.status}
                      </span>
                    </div>
                    <div className="bg-[#080808] px-8 py-7">
                      <span className="text-base text-white/30">{row.timeline}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </BuildLayerRich>
        </div>

        {/* Summary */}
        <motion.div
          className="mt-48 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-12 font-medium">Pharo Forge · Result</p>
          <h3 className="text-4xl md:text-5xl font-light text-white/95 mb-4" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            AI workers as industrial units.
          </h3>
          <h3 className="text-4xl md:text-5xl font-light text-white/30 mb-20" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Not experiments.
          </h3>

          <div className="flex justify-center gap-28 md:gap-40">
            {[
              { value: "3", label: "Blueprints deployed" },
              { value: "2", label: "FDEs assigned" },
              { value: "100%", label: "PMO visibility" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <p className="text-6xl font-light text-white/80 mb-3" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-white/35 uppercase tracking-[0.25em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BuildLayerRich({ num, title, subtitle, description, isInView, delay, children }: {
  num: string; title: string; subtitle: string; description: string; isInView: boolean; delay: number; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      <div className="flex items-center gap-6 mb-6">
        <span className="text-[10px] text-white/20 tracking-[0.35em]">LAYER {num}</span>
        <div className="w-12 h-[1px] bg-white/[0.08]" />
      </div>
      <h3 className="text-3xl md:text-4xl font-light text-white/95 mb-2" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
        {title}
      </h3>
      <p className="text-[11px] text-white/30 uppercase tracking-[0.35em] mb-6">{subtitle}</p>
      <p className="text-white/45 max-w-2xl mb-14 text-base leading-relaxed">{description}</p>
      {children}
    </motion.div>
  );
}

// ============================================
// CONTROL SECTION
// ============================================

function ControlSection({ onEnter }: { onEnter?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const isActive = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (isActive && onEnter) onEnter();
  }, [isActive, onEnter]);

  return (
    <section id="control" className="py-48 px-8 lg:px-20 bg-[#FAFAF9] text-[#1a1a1a]">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div className="mb-36" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-8 mb-10">
            <span className="text-[10px] tracking-[0.5em] uppercase text-black/30 font-medium">Pharo Tower</span>
            <motion.div className="flex-1 h-[1px] bg-black/[0.08]" initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 1, delay: 0.2 }} />
            <span className="text-[11px] tracking-[0.4em] text-black/20">III</span>
          </div>
          
          <div className="overflow-hidden">
            <motion.h2 
              className="text-6xl md:text-7xl lg:text-8xl font-light text-black/85 mb-10"
              style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.03em" }}
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Control
            </motion.h2>
          </div>
          <motion.p className="text-xl text-black/40 max-w-2xl leading-relaxed" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
            Complete governance, forensic auditability, and financial control. <span className="text-black/25">Because once AI is live, the problem is no longer technical.</span>
          </motion.p>
        </motion.div>

        {/* Cards - RICH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-black/[0.05] rounded-xl overflow-hidden mb-36">
          {[
            { 
              title: "The Forensic Lens", 
              subtitle: "Monitoring",
              desc: "Live Traces: Drill down into any interaction to see the complete 'Reasoning Trace' - every step the AI took.",
              metrics: [
                { value: "12,847", label: "Traces / 24h" },
                { value: "< 200ms", label: "Latency p99" },
                { value: "99.2%", label: "Accuracy" },
              ]
            },
            { 
              title: "The Safety Valve", 
              subtitle: "Compliance",
              desc: "Automated guardrails and human-in-the-loop controls. Every decision is logged, every escalation tracked.",
              items: ["PII detection & masking", "Confidence threshold: < 90%", "Escalation workflows", "Full audit trail"]
            },
            { 
              title: "The P&L View", 
              subtitle: "Billing",
              desc: "ROI tracking and 'Cost-to-Serve' per ticket. Budget caps per department. Real-time financial visibility.",
              metrics: [
                { value: "$0.12", label: "Cost per ticket" },
                { value: "28x", label: "ROI multiplier" },
                { value: "$340K", label: "Monthly savings" },
              ]
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              className="bg-[#FAFAF9] p-12 flex flex-col group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-black/20" />
                <span className="text-[9px] tracking-[0.35em] uppercase text-black/30">{card.subtitle}</span>
              </div>
              <h4 className="text-2xl font-light text-black/80 mb-5" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                {card.title}
              </h4>
              <p className="text-sm text-black/40 leading-relaxed mb-10 flex-1">{card.desc}</p>

              <div className="pt-8 border-t border-black/[0.06]">
                {card.metrics && (
                  <div className="space-y-5">
                    {card.metrics.map((m) => (
                      <div key={m.label} className="flex items-baseline justify-between">
                        <span className="text-[10px] text-black/35 uppercase tracking-[0.15em]">{m.label}</span>
                        <span className="text-2xl font-light text-black/70" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {card.items && (
                  <ul className="space-y-4">
                    {card.items.map((item) => (
                      <li key={item} className="text-sm text-black/45 flex items-center gap-4">
                        <span className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          className="text-center py-32 rounded-2xl relative overflow-hidden bg-black/[0.02] border border-black/[0.05]"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="absolute top-10 left-10 w-16 h-16 border-l-2 border-t-2 border-black/[0.05]" />
          <div className="absolute bottom-10 right-10 w-16 h-16 border-r-2 border-b-2 border-black/[0.05]" />
          
          <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-12 font-medium">Pharo Tower · Result</p>
          <h3 className="text-4xl md:text-5xl font-light text-black/85 mb-4" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            AI as a governed operation.
          </h3>
          <h3 className="text-4xl md:text-5xl font-light text-black/25 mb-20" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Not an experiment.
          </h3>

          <div className="flex justify-center gap-28 md:gap-40">
            {[
              { value: "100%", label: "Trace coverage" },
              { value: "< 90%", label: "HITL threshold" },
              { value: "Real-time", label: "Cost tracking" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <p className="text-6xl font-light text-black/80 mb-3" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-black/35 uppercase tracking-[0.25em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// TIMELINE SECTION
// ============================================

function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const milestones = [
    { time: "Day 0", desc: "Deploy Pharo Light. Connect to systems." },
    { time: "Month 1", desc: "See where time goes. First AI-ready list." },
    { time: "Month 3", desc: "AI pipeline with ROI. First workers in Forge." },
    { time: "Month 6", desc: "1-3 workers live. Tower switched on." },
    { time: "Ongoing", desc: "Fleet of AI workers. Full exec visibility." },
  ];

  return (
    <section id="timeline" className="py-48 px-8 lg:px-20 min-h-[80vh] flex items-center bg-[#FAFAF9] text-[#1a1a1a]">
      <div ref={ref} className="max-w-6xl mx-auto w-full">
        <motion.div className="text-center mb-28" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <div className="flex items-center justify-center gap-6 mb-16">
            <motion.div className="w-12 h-[1px] bg-black/12" initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ delay: 0.2 }} />
            <span className="text-[10px] tracking-[0.5em] uppercase text-black/30 font-medium">The Journey</span>
            <motion.div className="w-12 h-[1px] bg-black/12" initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ delay: 0.2 }} />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black/85 mb-4" style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}>
            <RevealText delay={0.1}>In 6 months: from AI guesswork</RevealText>
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black/25" style={{ fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "-0.02em" }}>
            <RevealText delay={0.3}>to a managed AI workforce.</RevealText>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <motion.div
            className="absolute top-6 left-0 right-0 h-[2px] bg-black/[0.08]"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "left" }}
          />

          <div className="grid grid-cols-5 gap-6 md:gap-10">
            {milestones.map((m, i) => (
              <motion.div
                key={m.time}
                className="text-center"
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.12 }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full bg-black/20 mx-auto mb-10 relative"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.12, type: "spring" }}
                >
                  {i === 4 && (
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-black/12"
                      animate={{ scale: [1, 2.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <p className="text-base font-light text-black/70 mb-4" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  {m.time}
                </p>
                <p className="text-[11px] text-black/40 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA SECTION
// ============================================

function FinalCTASection({ onEnter }: { onEnter?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isActive = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (isActive && onEnter) onEnter();
  }, [isActive, onEnter]);

  return (
    <footer id="cta" className="relative bg-[#F5F5F3] overflow-hidden">
      {/* Watermark - Pharo behind everything - hidden on mobile */}
      <div className="absolute inset-0 items-center justify-center pointer-events-none select-none hidden md:flex">
        <h2 
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(200px, 35vw, 500px)",
            fontWeight: 400,
            color: "rgba(0,0,0,0.02)",
            letterSpacing: "-0.02em",
            lineHeight: 0.8,
            transform: "translateY(5%)",
          }}
        >
          Pharo
        </h2>
      </div>
      
      {/* Content */}
      <div ref={ref} className="relative z-10 px-5 md:px-6 py-16 md:py-32">
        {/* Main CTA in dark liquid glass card */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(26,26,30,0.95) 0%, rgba(20,20,24,0.92) 100%)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `
                0 20px 60px rgba(0,0,0,0.2),
                0 10px 30px rgba(0,0,0,0.12),
                inset 0 1px 0 rgba(255,255,255,0.08)
              `,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Three pillars summary */}
            <motion.div 
              className="flex justify-center gap-6 md:gap-12 lg:gap-20 mb-8 md:mb-12"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              {[
                { name: "Light", desc: "Discover" },
                { name: "Forge", desc: "Build" },
                { name: "Tower", desc: "Control" },
              ].map((pillar) => (
                <div key={pillar.name} className="text-center">
                  <p className="text-base md:text-lg lg:text-xl text-white/80 mb-0.5 md:mb-1" style={{ fontFamily: "Georgia, serif" }}>
                    {pillar.name}
                  </p>
                  <p className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em]">{pillar.desc}</p>
                </div>
              ))}
            </motion.div>

            <motion.div 
              className="w-10 md:w-16 h-[1px] bg-white/10 mx-auto mb-6 md:mb-10"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            />

            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 md:mb-6"
              style={{ 
                fontFamily: "Georgia, 'Times New Roman', serif", 
                fontWeight: 400,
                lineHeight: 1.2,
                color: "rgba(255,255,255,0.95)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              From AI guesswork
              <br />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>to managed operation.</span>
            </motion.h2>
            
            <motion.p 
              className="text-xs md:text-sm lg:text-base mb-8 md:mb-10 max-w-md mx-auto"
              style={{ color: "rgba(255,255,255,0.35)" }}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Deploy your AI Office System in 6 months. Start with what you know, scale with what you learn.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link href="/start" className="group">
                <motion.div
                  className="px-6 md:px-10 py-3 md:py-4 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-black">
                    Start Your Journey
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </motion.div>
              </Link>
              
              <Link href="/platform" className="group">
                <motion.div
                  className="px-6 md:px-10 py-3 md:py-4 rounded-full"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  whileHover={{ 
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xs md:text-sm text-white/60">
                    View Platform
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Footer links */}
        <motion.div 
          className="max-w-4xl mx-auto mt-10 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <Link href="/" className="text-[10px] md:text-xs text-black/30 hover:text-black/50 transition-colors">
            Our Story
          </Link>
          <Link href="/platform" className="text-[10px] md:text-xs text-black/30 hover:text-black/50 transition-colors">
            Our Platform
          </Link>
          <Link href="/methodology" className="text-[10px] md:text-xs text-black/50 font-medium">
            Our Methodology
          </Link>
          <Link href="/start" className="text-[10px] md:text-xs text-black/30 hover:text-black/50 transition-colors">
            Start
          </Link>
        </motion.div>

        <motion.p 
          className="text-center mt-8 md:mt-12 text-[9px] md:text-[10px] text-black/20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          © {new Date().getFullYear()} Sapira. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
}
