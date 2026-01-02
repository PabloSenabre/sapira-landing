"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";

const screenshots = [
  {
    id: 1,
    title: "Dashboard Overview",
    description: "Real-time visibility across all your operations",
    image: "/placeholder-dashboard.png", // Placeholder
  },
  {
    id: 2,
    title: "Predictive Analytics",
    description: "AI-powered forecasting and trend analysis",
    image: "/placeholder-analytics.png", // Placeholder
  },
  {
    id: 3,
    title: "Data Integration",
    description: "Seamless connection to your existing systems",
    image: "/placeholder-integration.png", // Placeholder
  },
  {
    id: 4,
    title: "Custom Reports",
    description: "Generate insights tailored to your needs",
    image: "/placeholder-reports.png", // Placeholder
  },
];

const features = [
  {
    title: "Real-time Analytics",
    description: "Process millions of data points per second with our distributed computing architecture.",
  },
  {
    title: "Predictive Models",
    description: "Machine learning models trained on your data to forecast outcomes with high accuracy.",
  },
  {
    title: "Visual Insights",
    description: "Interactive dashboards and visualizations that make complex data accessible.",
  },
  {
    title: "Automated Alerts",
    description: "Intelligent notifications when anomalies are detected or thresholds are crossed.",
  },
];

export default function FaroPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), 
                                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "60px 60px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/40 border border-white/10 mb-8">
              Faro Platform
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif-display leading-[1.1] mb-8">
              Navigate complexity
              <br />
              <span className="text-white/50">with precision</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12">
              Advanced predictive analytics that transforms raw data into strategic foresight.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#demo"
                className="px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <Play size={18} />
                <span>Watch Demo</span>
              </Link>
              <Link
                href="#contact"
                className="px-8 py-4 border border-white/30 text-white font-medium hover:bg-white hover:text-black transition-all"
              >
                Request Access
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Screenshots Carousel */}
      <section className="py-24 lg:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-serif-display mb-4">
              Platform Overview
            </h2>
            <p className="text-lg text-white/50">
              Explore the capabilities that set Faro apart
            </p>
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            {/* Main display */}
            <div className="relative aspect-[16/10] bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Placeholder for screenshot */}
                  <div className="text-center p-12">
                    <div className="w-full h-64 bg-white/5 border border-white/10 rounded mb-6 flex items-center justify-center">
                      <span className="text-white/30 text-sm">[Platform Screenshot]</span>
                    </div>
                    <h3 className="text-2xl font-serif-display mb-2">
                      {screenshots[currentSlide].title}
                    </h3>
                    <p className="text-white/50">
                      {screenshots[currentSlide].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-12 h-1 transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-white/20"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 lg:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-serif-display mb-4">
              Core Capabilities
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-black p-8 lg:p-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-serif-display mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-serif-display mb-6">
              See Faro in action
            </h2>
            <p className="text-lg text-white/50 mb-12">
              Schedule a personalized demo with our team.
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              <span>Request Demo</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
