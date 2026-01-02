"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StorySection from "./StorySection";
import Link from "next/link";

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative bg-black">
      {/* Section 1: The Problem */}
      <StorySection
        id="problem"
        eyebrow="The Challenge"
        title="Enterprises drown in data."
        description="Disconnected systems, siloed information, missed opportunities. The complexity of modern business creates chaos."
        scrollProgress={scrollYProgress}
        startProgress={0}
        endProgress={0.25}
      >
        {/* Chaotic data visualization */}
        <ChaoticDataViz scrollProgress={scrollYProgress} />
      </StorySection>

      {/* Section 2: The Transformation */}
      <StorySection
        id="transformation"
        eyebrow="The Transformation"
        title="We bring order to chaos."
        description="Our AI doesn't just analyze data—it understands your business. Connecting dots that humans can't see."
        scrollProgress={scrollYProgress}
        startProgress={0.25}
        endProgress={0.5}
      >
        {/* Organized data visualization */}
        <OrganizedDataViz scrollProgress={scrollYProgress} />
      </StorySection>

      {/* Section 3: The Solution */}
      <StorySection
        id="solution"
        eyebrow="The Solution"
        title="Three platforms. One vision."
        description="Purpose-built tools for enterprise intelligence, predictive analytics, and investment decisions."
        scrollProgress={scrollYProgress}
        startProgress={0.5}
        endProgress={0.75}
      >
        {/* Product cards */}
        <ProductCards />
      </StorySection>

      {/* Section 4: The Results */}
      <StorySection
        id="results"
        eyebrow="The Results"
        title="Measurable impact."
        description="Real outcomes from organizations that chose to lead with AI."
        scrollProgress={scrollYProgress}
        startProgress={0.75}
        endProgress={1}
      >
        {/* Metrics */}
        <ResultsMetrics />
      </StorySection>
    </div>
  );
}

// Chaotic data visualization component
function ChaoticDataViz({ scrollProgress }: { scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const opacity = useTransform(scrollProgress, [0, 0.1, 0.2], [0, 1, 0.3]);
  
  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity }}
    >
      {/* Random floating numbers */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/10 font-mono text-xs md:text-sm"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          {Math.floor(Math.random() * 10000)}
        </motion.div>
      ))}
      
      {/* Disconnected lines */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-[1px] bg-white/10"
          style={{
            width: `${50 + Math.random() * 100}px`,
            left: `${Math.random() * 80}%`,
            top: `${Math.random() * 80}%`,
            rotate: `${Math.random() * 360}deg`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: Math.random(),
          }}
        />
      ))}
    </motion.div>
  );
}

// Organized data visualization component
function OrganizedDataViz({ scrollProgress }: { scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const opacity = useTransform(scrollProgress, [0.25, 0.35, 0.45], [0, 1, 0.3]);
  const scale = useTransform(scrollProgress, [0.25, 0.35], [0.8, 1]);
  
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity, scale }}
    >
      {/* Connected nodes in a graph pattern */}
      <svg className="w-full h-full max-w-2xl max-h-96" viewBox="0 0 400 200">
        {/* Lines connecting nodes */}
        {[
          { x1: 100, y1: 100, x2: 200, y2: 50 },
          { x1: 100, y1: 100, x2: 200, y2: 100 },
          { x1: 100, y1: 100, x2: 200, y2: 150 },
          { x1: 200, y1: 50, x2: 300, y2: 100 },
          { x1: 200, y1: 100, x2: 300, y2: 100 },
          { x1: 200, y1: 150, x2: 300, y2: 100 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        ))}
        
        {/* Nodes */}
        {[
          { cx: 100, cy: 100, r: 8 },
          { cx: 200, cy: 50, r: 6 },
          { cx: 200, cy: 100, r: 6 },
          { cx: 200, cy: 150, r: 6 },
          { cx: 300, cy: 100, r: 10 },
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="rgba(255,255,255,0.3)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// Product cards component
function ProductCards() {
  const products = [
    {
      name: "AIO",
      description: "All-in-One Enterprise Intelligence",
      href: "/aio",
    },
    {
      name: "Faro",
      description: "Predictive Analytics Platform",
      href: "/faro",
    },
    {
      name: "Equity",
      description: "Investment Intelligence",
      href: "/equity",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 mt-12">
      {products.map((product, i) => (
        <motion.div
          key={product.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <Link
            href={product.href}
            className="block bg-black p-8 lg:p-12 hover:bg-white/5 transition-colors group"
          >
            <h3 className="text-2xl lg:text-3xl font-serif-display text-white mb-2 group-hover:text-white/80 transition-colors">
              {product.name}
            </h3>
            <p className="text-white/50 text-sm">
              {product.description}
            </p>
            <div className="mt-6 text-white/30 group-hover:text-white transition-colors text-sm">
              Explore →
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// Results metrics component
function ResultsMetrics() {
  const metrics = [
    { value: "40%", label: "Reduction in operational costs" },
    { value: "3x", label: "Faster decision making" },
    { value: "85%", label: "Improvement in data accuracy" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 mt-12">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-5xl lg:text-7xl font-serif-display text-white mb-4"
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: i * 0.15 + 0.2 }}
            viewport={{ once: true }}
          >
            {metric.value}
          </motion.div>
          <p className="text-white/50 text-sm uppercase tracking-wider">
            {metric.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

