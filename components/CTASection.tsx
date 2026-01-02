"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-black py-32 border-t border-white/10">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif-display text-white leading-[1.1] mb-8">
            Ready to transform your enterprise?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-12">
            Connect with our team to see how Sapira can help your organization 
            make better decisions with AI-powered automation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="#contact"
              className="px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="#demo"
              className="px-8 py-4 border border-white/30 text-white font-medium hover:bg-white hover:text-black transition-all"
            >
              Request Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
