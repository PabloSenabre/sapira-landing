"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";

export default function AboutApp() {
  const team = [
    { name: "Leadership", count: 5 },
    { name: "Engineering", count: 24 },
    { name: "Data Science", count: 18 },
    { name: "Product", count: 8 },
  ];

  return (
    <div className="h-full overflow-auto bg-[#0a0a0b]">
      {/* Hero - Minimal */}
      <div 
        className="relative h-56 flex items-center justify-center border-b border-white/5"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
        }}
      >
        <div className="relative text-center px-8">
          <motion.div
            className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Info className="w-6 h-6 text-white/80" strokeWidth={1.5} />
          </motion.div>
          <motion.h1 
            className="text-2xl font-medium text-white mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            About Sapira
          </motion.h1>
          <motion.p 
            className="text-white/50 text-sm max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Building the future of enterprise intelligence.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Mission */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">Our Mission</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We believe that every enterprise decision should be powered by intelligence. 
            Sapira transforms complex data into actionable insights, enabling organizations 
            to operate with unprecedented clarity and precision.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">Our Values</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Innovation", desc: "Pushing boundaries of what's possible" },
              { title: "Integrity", desc: "Transparency in everything we do" },
              { title: "Impact", desc: "Measurable results for our clients" },
              { title: "Excellence", desc: "Uncompromising quality standards" },
            ].map((value) => (
              <div key={value.title} className="p-4 rounded-lg border border-white/5">
                <h3 className="text-white/80 font-medium text-sm">{value.title}</h3>
                <p className="text-white/40 text-xs mt-1">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">Our Team</h2>
          <div className="flex items-center gap-3">
            {team.map((dept) => (
              <div key={dept.name} className="flex-1 p-4 rounded-lg border border-white/5 text-center">
                <p className="text-xl font-medium text-white">{dept.count}</p>
                <p className="text-white/40 text-xs mt-1">{dept.name}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/30 mt-4 text-xs">
            55+ experts across engineering, data science, and product
          </p>
        </motion.div>
      </div>
    </div>
  );
}
