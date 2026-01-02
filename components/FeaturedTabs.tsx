"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Featured categories with their content
const categories = [
  {
    id: "aio",
    name: "AIO Platform",
    items: [
      {
        eyebrow: "Platform",
        title: "All-in-One Intelligence for Enterprise",
        description: "Unified AI platform that transforms raw data into actionable insights.",
        image: "/videos/intro.mp4",
        href: "/aio",
      },
      {
        eyebrow: "Case Study",
        title: "Manufacturing Optimization",
        description: "How we reduced downtime by 40% for a Fortune 500 manufacturer.",
        image: "/videos/intro.mp4",
        href: "/aio",
      },
    ],
  },
  {
    id: "faro",
    name: "Faro",
    items: [
      {
        eyebrow: "Predictive Analytics",
        title: "See the Future of Your Business",
        description: "Advanced forecasting powered by machine learning.",
        image: "/videos/intro.mp4",
        href: "/faro",
      },
    ],
  },
  {
    id: "equity",
    name: "Equity",
    items: [
      {
        eyebrow: "Investment Intelligence",
        title: "Data-Driven Investment Decisions",
        description: "AI-powered analysis for private equity and venture capital.",
        image: "/videos/intro.mp4",
        href: "/equity",
      },
    ],
  },
  {
    id: "impact",
    name: "Impact Studies",
    items: [
      {
        eyebrow: "Results",
        title: "Measurable Business Transformation",
        description: "Real outcomes from our enterprise deployments.",
        image: "/videos/intro.mp4",
        href: "#impact",
      },
    ],
  },
  {
    id: "docs",
    name: "Documentation",
    items: [
      {
        eyebrow: "Resources",
        title: "Technical Documentation",
        description: "Comprehensive guides for developers and engineers.",
        image: "/videos/intro.mp4",
        href: "#docs",
      },
    ],
  },
];

export default function FeaturedTabs() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];
  const currentItems = currentCategory.items;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % currentItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + currentItems.length) % currentItems.length);
  };

  // Reset slide when changing category
  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setCurrentSlide(0);
  };

  return (
    <section className="relative bg-black py-0">
      {/* Full width container */}
      <div className="relative">
        {/* Category tabs - horizontal scrollable */}
        <div className="border-b border-white/10">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`
                    px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200
                    ${activeCategory === category.id 
                      ? "bg-white text-black" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
              
              {/* See All link */}
              <Link
                href="#all"
                className="ml-auto px-4 py-2 text-sm text-white/50 hover:text-white transition-colors whitespace-nowrap"
              >
                See All
              </Link>
            </div>
          </div>
        </div>

        {/* Featured content area */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${currentSlide}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Background video/image */}
              <div className="absolute inset-0">
                <video
                  className="w-full h-full object-cover"
                  src={currentItems[currentSlide]?.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)"
                  }}
                />
              </div>

              {/* Content overlay */}
              <div className="relative z-10 h-full max-w-[1800px] mx-auto px-6 lg:px-12 flex items-center">
                <div className="max-w-xl">
                  {/* Category badge */}
                  <motion.p
                    className="text-xs tracking-[0.2em] uppercase text-white/50 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {currentCategory.name}
                  </motion.p>

                  {/* Eyebrow */}
                  <motion.p
                    className="text-sm text-white/70 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {currentItems[currentSlide]?.eyebrow}
                  </motion.p>

                  {/* Title */}
                  <motion.h2
                    className="text-3xl md:text-4xl lg:text-5xl font-serif-display text-white mb-4 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentItems[currentSlide]?.title}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    className="text-white/60 text-lg mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    {currentItems[currentSlide]?.description}
                  </motion.p>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href={currentItems[currentSlide]?.href || "#"}
                      className="inline-block text-sm text-white border-b border-white/30 hover:border-white pb-1 transition-colors"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </div>

                {/* Navigation arrows */}
                {currentItems.length > 1 && (
                  <div className="absolute bottom-8 right-12 flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="p-3 border border-white/30 hover:border-white hover:bg-white hover:text-black transition-all"
                      aria-label="Previous"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-3 border border-white/30 hover:border-white hover:bg-white hover:text-black transition-all"
                      aria-label="Next"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                )}

                {/* See All link for current category */}
                <div className="absolute bottom-8 left-12">
                  <Link
                    href="#"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    See All
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

