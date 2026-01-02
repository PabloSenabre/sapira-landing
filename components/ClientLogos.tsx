"use client";

import { motion } from "framer-motion";

// Client logos section - Palantir style
const clients = [
  "Airbus",
  "BP",
  "Ferrari",
  "Hertz",
  "Jacobs",
  "L3Harris",
  "Merck",
  "PG&E",
  "Swiss Re",
  "WFP",
];

export default function ClientLogos() {
  return (
    <section className="bg-black py-16 border-t border-white/10">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">
            Trusted by Industry Leaders
          </h3>
          <a 
            href="#customers" 
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            View All Customers
          </a>
        </div>

        {/* Logo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-8 items-center">
          {clients.map((client, index) => (
            <motion.div
              key={client}
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              {/* Placeholder - would be actual logos */}
              <span className="text-sm text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                {client}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
