"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Grid of featured content cards - Palantir style
const cards = [
  {
    category: "Capabilities",
    title: "AI + ML",
    description: "Deploy and manage machine learning models at enterprise scale.",
    href: "#ai",
  },
  {
    category: "Capabilities",
    title: "Data Integration",
    description: "Connect, clean, and transform data from any source.",
    href: "#data",
  },
  {
    category: "Capabilities",
    title: "Digital Twin",
    description: "Create living models of your physical operations.",
    href: "#twin",
  },
  {
    category: "Capabilities",
    title: "Edge AI",
    description: "Run AI models at the edge for real-time decisions.",
    href: "#edge",
  },
  {
    category: "Resources",
    title: "Developer Portal",
    description: "APIs, SDKs, and documentation for builders.",
    href: "#developers",
  },
  {
    category: "Resources",
    title: "Impact Studies",
    description: "See how organizations transform with Sapira.",
    href: "#impact",
  },
];

export default function FeaturedCards() {
  return (
    <section className="bg-black py-24 border-t border-white/10">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif-display text-white mb-4">
              Explore Our Platform
            </h2>
            <p className="text-white/50 max-w-xl">
              Discover the capabilities that power enterprise transformation.
            </p>
          </div>
          <Link
            href="#capabilities"
            className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1"
          >
            View All Capabilities
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={card.href}
                className="group block bg-black p-8 lg:p-12 h-full hover:bg-white/5 transition-colors"
              >
                {/* Category */}
                <p className="text-xs text-white/40 uppercase tracking-wider mb-4">
                  {card.category}
                </p>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-serif-display text-white mb-3 group-hover:text-white transition-colors">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/50 mb-6 group-hover:text-white/70 transition-colors">
                  {card.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-white/30 group-hover:text-white transition-colors">
                  <span className="text-sm">Learn more</span>
                  <ArrowUpRight 
                    size={14} 
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" 
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

