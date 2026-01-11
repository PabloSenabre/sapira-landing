"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

// ============================================
// START EXPERIENCE
// A memorable "choose your path" experience
// ============================================

// Particle system for ambient effect
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.3 + 0.1,
    speed: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));
}

export default function StartExperience() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<"book" | "build" | null>(null);
  const [selectedPath, setSelectedPath] = useState<"book" | "build" | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transforms
  const bgX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const contentX = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);
  const contentY = useTransform(smoothY, [-0.5, 0.5], [-3, 3]);

  useEffect(() => {
    setMounted(true);
    // Generate particles on client to avoid hydration mismatch
    setParticles(generateParticles(50));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // Handle path selection
  const handleSelectPath = (path: "book" | "build") => {
    setSelectedPath(path);
    setIsExiting(true);
    
    setTimeout(() => {
      if (path === "book") {
        // TODO: Replace with actual Calendly/booking link
        window.open("https://calendly.com/sapira", "_blank");
        setIsExiting(false);
        setSelectedPath(null);
      } else {
        // Navigate to Pharo onboarding (placeholder for now)
        router.push("/pharo");
      }
    }, 800);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-y-auto"
      onMouseMove={handleMouseMove}
    >
      {/* Animated particles background */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ x: bgX, y: bgY }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            }}
            transition={{
              duration: particle.speed,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
                         radial-gradient(ellipse at 70% 70%, rgba(255,255,255,0.02) 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20"
        style={{ x: contentX, y: contentY }}
      >
        {/* Header section */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-block mb-4 md:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span 
              className="px-4 py-2 rounded-full text-sm font-medium tracking-wider"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              READY TO START
            </span>
          </motion.div>

          {/* Main title */}
          <h1 
            className="text-white leading-[1.1] tracking-[-0.03em]"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 400,
            }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Begin your
            </motion.span>
            <motion.span
              className="block italic"
              style={{ color: "rgba(255,255,255,0.7)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Sapira journey.
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 text-lg max-w-md mx-auto"
            style={{ 
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Choose how you'd like to get started
          </motion.p>
        </motion.div>

        {/* Path selection cards */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {/* Book a call option */}
          <PathCard
            type="book"
            title="Book a call"
            description="Schedule a conversation with our team. We'll understand your needs and show you what's possible."
            icon={<CalendarIcon />}
            isHovered={hoveredPath === "book"}
            isSelected={selectedPath === "book"}
            isExiting={isExiting}
            onHover={() => setHoveredPath("book")}
            onLeave={() => setHoveredPath(null)}
            onSelect={() => handleSelectPath("book")}
          />

          {/* Divider */}
          <div className="hidden md:flex items-center justify-center">
            <div 
              className="w-px h-32"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)"
              }}
            />
            <span 
              className="absolute px-3 py-1 text-xs font-medium tracking-wider"
              style={{
                background: "black",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              OR
            </span>
          </div>
          <div className="flex md:hidden items-center justify-center py-2">
            <span 
              className="px-4 py-1 text-xs font-medium tracking-wider rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              OR
            </span>
          </div>

          {/* Start building option */}
          <PathCard
            type="build"
            title="Start building"
            description="Jump right in. Create your account and start building your personalized software today."
            icon={<RocketIcon />}
            isHovered={hoveredPath === "build"}
            isSelected={selectedPath === "build"}
            isExiting={isExiting}
            onHover={() => setHoveredPath("build")}
            onLeave={() => setHoveredPath(null)}
            onSelect={() => handleSelectPath("build")}
          />
        </motion.div>

        {/* Already have an account link */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <Link
            href="/login"
            className="text-sm transition-colors"
            style={{ 
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
          >
            Already have an account? Sign in →
          </Link>
        </motion.div>
      </motion.div>

      {/* Back to home */}
      <motion.div
        className="absolute top-6 left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>
      </motion.div>

      {/* Transition overlay */}
      <AnimatePresence>
        {isExiting && selectedPath && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: selectedPath === "build" 
                ? "radial-gradient(circle at center, rgba(0,0,0,0.95), black)"
                : "radial-gradient(circle at center, rgba(20,20,20,0.98), black)"
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="text-center"
            >
              {selectedPath === "build" ? (
                <>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🚀
                  </motion.div>
                  <p className="text-white/60 text-lg">Launching Pharo...</p>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-5xl mb-4"
                  >
                    📅
                  </motion.div>
                  <p className="text-white/60 text-lg">Opening calendar...</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)"
        }}
      />
    </div>
  );
}

// ============================================
// PATH CARD COMPONENT
// ============================================

interface PathCardProps {
  type: "book" | "build";
  title: string;
  description: string;
  icon: React.ReactNode;
  isHovered: boolean;
  isSelected: boolean;
  isExiting: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}

function PathCard({
  type,
  title,
  description,
  icon,
  isHovered,
  isSelected,
  isExiting,
  onHover,
  onLeave,
  onSelect,
}: PathCardProps) {
  return (
    <motion.button
      className="flex-1 relative group text-left"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      disabled={isExiting}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card background with glass effect */}
      <div
        className="relative rounded-3xl p-8 transition-all duration-500 overflow-hidden"
        style={{
          background: isHovered 
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.03)",
          border: isHovered 
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: type === "build"
              ? "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 70%)"
              : "radial-gradient(ellipse at 50% 0%, rgba(200,200,255,0.08) 0%, transparent 70%)"
          }}
        />

        {/* Icon */}
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative"
          style={{
            background: isHovered 
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          animate={{
            scale: isHovered ? 1.05 : 1,
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="transition-all duration-300"
            style={{ 
              color: isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)" 
            }}
          >
            {icon}
          </div>
        </motion.div>

        {/* Title */}
        <h3
          className="text-2xl mb-3 transition-colors duration-300"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 500,
            color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)",
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6 transition-colors duration-300"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            color: isHovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)",
          }}
        >
          {description}
        </p>

        {/* CTA indicator */}
        <div className="flex items-center gap-2">
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: isHovered 
                ? "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            animate={{
              x: isHovered ? 4 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <span 
              className="text-sm font-medium transition-colors duration-300"
              style={{
                color: isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
              }}
            >
              {type === "book" ? "Schedule now" : "Get started"}
            </span>
            <motion.svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none"
              animate={{ x: isHovered ? 2 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path 
                d="M6 4L10 8L6 12" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{
                  color: isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                }}
              />
            </motion.svg>
          </motion.div>
        </div>

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ 
            x: isHovered ? "100%" : "-100%",
            opacity: isHovered ? 0.1 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
        />
      </div>

      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute -inset-1 rounded-[28px] pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              border: "2px solid rgba(255,255,255,0.4)",
              boxShadow: "0 0 30px rgba(255,255,255,0.2)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ============================================
// ICONS
// ============================================

function CalendarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="6" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 12H28" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="22" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="10" cy="23" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="23" r="1.5" fill="currentColor"/>
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path 
        d="M16 4C16 4 12 8 12 16C12 20 14 24 16 28C18 24 20 20 20 16C20 8 16 4 16 4Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 20L8 22V26L12 24" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M20 20L24 22V26L20 24" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="16" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

