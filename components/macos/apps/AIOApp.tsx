"use client";

import { motion } from "framer-motion";
import { ArrowRight, Database, Cpu, BarChart3, Shield, Zap, Globe } from "lucide-react";

export default function AIOApp() {
  const features = [
    { icon: Database, title: "Data Integration", description: "Connect all your enterprise data sources seamlessly" },
    { icon: Cpu, title: "AI Processing", description: "Advanced machine learning for intelligent automation" },
    { icon: BarChart3, title: "Analytics", description: "Real-time insights and predictive analytics" },
    { icon: Shield, title: "Security", description: "Enterprise-grade security and compliance" },
    { icon: Zap, title: "Automation", description: "Streamline workflows with intelligent automation" },
    { icon: Globe, title: "Global Scale", description: "Deploy anywhere with global infrastructure" },
  ];

  return (
    <div className="h-full overflow-auto bg-[#0a0a0b]">
      {/* Hero Section - Minimal */}
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
            <BarChart3 className="w-6 h-6 text-white/80" strokeWidth={1.5} />
          </motion.div>
          <motion.h1 
            className="text-2xl font-medium text-white mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            AIO Platform
          </motion.h1>
          <motion.p 
            className="text-white/50 text-sm max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            All-in-One Enterprise Intelligence. Unify your data, automate decisions.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-6">Core Capabilities</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-4 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <feature.icon className="w-5 h-5 text-white/40 mb-3 group-hover:text-white/60 transition-colors" strokeWidth={1.5} />
              <h3 className="text-white/90 font-medium text-sm mb-1">{feature.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 p-5 rounded-lg border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/90 font-medium text-sm">Ready to transform your enterprise?</h3>
              <p className="text-white/40 text-xs mt-1">Get a personalized demo of the AIO platform.</p>
            </div>
            <button className="px-5 py-2.5 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2">
              Request Demo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
