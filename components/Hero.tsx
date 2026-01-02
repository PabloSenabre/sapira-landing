"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform mouse position to parallax offsets
  const bgX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const textX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const textY = useTransform(smoothY, [-0.5, 0.5], [-5, 5]);
  const floatingX = useTransform(smoothX, [-0.5, 0.5], [30, -30]);
  const floatingY = useTransform(smoothY, [-0.5, 0.5], [20, -20]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Background video with parallax */}
      <motion.div
        className="absolute inset-[-20px]"
        style={{ x: bgX, y: bgY }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover scale-110"
          src="/videos/intro.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        
        {/* Dark overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)"
          }}
        />
      </motion.div>

      {/* Floating abstract elements with heavy parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: floatingX, y: floatingY }}
      >
        {/* Geometric shapes */}
        <div className="absolute top-[20%] left-[10%] w-32 h-32 border border-white/5 rotate-45" />
        <div className="absolute top-[60%] right-[15%] w-24 h-24 border border-white/5 rotate-12" />
        <div className="absolute bottom-[30%] left-[20%] w-16 h-16 border border-white/10 -rotate-12" />
        
        {/* Dots/nodes */}
        <div className="absolute top-[30%] right-[25%] w-2 h-2 bg-white/20 rounded-full" />
        <div className="absolute top-[45%] left-[30%] w-1.5 h-1.5 bg-white/15 rounded-full" />
        <div className="absolute bottom-[40%] right-[35%] w-2 h-2 bg-white/10 rounded-full" />
        
        {/* Lines */}
        <div className="absolute top-[25%] left-[15%] w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[30deg]" />
        <div className="absolute bottom-[35%] right-[10%] w-[150px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -rotate-[20deg]" />
      </motion.div>

      {/* Main headline with subtle parallax */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <motion.div
          className="text-center max-w-5xl"
          style={{ x: textX, y: textY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-serif-display text-white">
            <motion.span 
              className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] leading-[1.1]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              AI-Powered Automation
            </motion.span>
            <motion.span 
              className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] leading-[1.1] mt-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              for Every Decision
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mt-8 text-lg md:text-xl text-white/50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Enterprise intelligence that transforms how organizations operate.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <a
              href="#contact"
              className="px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              Get Started
            </a>
            <a
              href="#learn"
              className="px-8 py-4 border border-white/30 text-white font-medium hover:bg-white hover:text-black transition-all"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white/50"
          >
            <path 
              d="M12 5v14M19 12l-7 7-7-7" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Subtle vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)"
        }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}
