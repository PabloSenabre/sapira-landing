"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface StorySectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  scrollProgress: MotionValue<number>;
  startProgress: number;
  endProgress: number;
  children?: ReactNode;
}

export default function StorySection({
  id,
  eyebrow,
  title,
  description,
  scrollProgress,
  startProgress,
  endProgress,
  children,
}: StorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Calculate opacity based on scroll position within the section
  const midPoint = (startProgress + endProgress) / 2;
  const opacity = useTransform(
    scrollProgress,
    [startProgress, startProgress + 0.05, midPoint, endProgress - 0.05, endProgress],
    [0, 1, 1, 1, 0]
  );
  
  // Parallax for background elements
  const y = useTransform(
    scrollProgress,
    [startProgress, endProgress],
    ["0%", "-10%"]
  );

  // Scale effect for content
  const scale = useTransform(
    scrollProgress,
    [startProgress, startProgress + 0.05, midPoint, endProgress - 0.05, endProgress],
    [0.95, 1, 1, 1, 0.95]
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/95" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center"
        style={{ opacity, scale }}
      >
        {/* Eyebrow */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/40 border border-white/10">
            {eyebrow}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-serif-display text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {description}
        </motion.p>

        {/* Child content (visualizations, cards, etc.) */}
        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-white/5" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-white/5" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-white/5" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-white/5" />

      {/* Section indicator line */}
      <motion.div
        className="absolute left-1/2 bottom-0 w-[1px] h-24 bg-gradient-to-t from-white/20 to-transparent"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ transformOrigin: "bottom" }}
      />
    </section>
  );
}

