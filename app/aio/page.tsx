"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Search, Cpu, LineChart } from "lucide-react";

const phases = [
  {
    id: "discovery",
    number: "01",
    title: "Discovery",
    subtitle: "Understand your data landscape",
    description: "We analyze your existing systems, data flows, and business processes to identify opportunities for AI-driven optimization.",
    icon: Search,
    features: [
      "Data inventory & mapping",
      "Process documentation",
      "Opportunity identification",
      "ROI assessment",
    ],
  },
  {
    id: "execution",
    number: "02",
    title: "Execution",
    subtitle: "Build & deploy intelligent systems",
    description: "Our team implements custom AI solutions that integrate seamlessly with your existing infrastructure.",
    icon: Cpu,
    features: [
      "Custom model development",
      "System integration",
      "User training",
      "Staged deployment",
    ],
  },
  {
    id: "monitoring",
    number: "03",
    title: "Monitoring",
    subtitle: "Continuous improvement",
    description: "We provide ongoing monitoring, optimization, and support to ensure your AI systems deliver sustained value.",
    icon: LineChart,
    features: [
      "Real-time dashboards",
      "Performance optimization",
      "Model retraining",
      "24/7 support",
    ],
  },
];

export default function AIOPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      <Header />

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-white z-[100]"
        style={{ width: progressWidth }}
      />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/40 border border-white/10 mb-8">
              AIO Platform
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif-display leading-[1.1] mb-8">
              All-in-One
              <br />
              <span className="text-white/50">Enterprise Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12">
              From discovery to deployment, we transform your data into actionable intelligence that drives real business outcomes.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#discovery"
                className="px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <span>Explore Our Process</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#contact"
                className="px-8 py-4 border border-white/30 text-white font-medium hover:bg-white hover:text-black transition-all"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Phases */}
      {phases.map((phase, index) => (
        <section
          key={phase.id}
          id={phase.id}
          className="min-h-screen flex items-center py-24 lg:py-32"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={index % 2 === 1 ? "lg:order-2" : ""}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl lg:text-8xl font-serif-display text-white/10">
                    {phase.number}
                  </span>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                <h2 className="text-4xl lg:text-5xl font-serif-display mb-4">
                  {phase.title}
                </h2>
                <p className="text-xl text-white/60 mb-6">
                  {phase.subtitle}
                </p>
                <p className="text-white/40 leading-relaxed mb-8">
                  {phase.description}
                </p>

                <ul className="space-y-3">
                  {phase.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-3 text-white/70"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual */}
              <motion.div
                className={`relative ${index % 2 === 1 ? "lg:order-1" : ""}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="aspect-square relative">
                  {/* Icon container */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Orbiting rings */}
                      <motion.div
                        className="absolute inset-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 border border-white/10 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute inset-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 border border-white/5 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {/* Center icon */}
                      <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                        <phase.icon size={32} className="text-white/70" />
                      </div>
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-l border-t border-white/10" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-r border-t border-white/10" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-l border-b border-white/10" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-white/10" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-24 lg:py-32 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-serif-display mb-6">
              Ready to transform your enterprise?
            </h2>
            <p className="text-lg text-white/50 mb-12">
              Let&apos;s discuss how AIO can drive measurable impact for your organization.
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
