"use client";

import { motion } from "framer-motion";
import { fadeUpVariants, fadeLeftVariants, fadeRightVariants, viewportSettings } from "@/lib/animations";
import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

const problems = [
  "Datos dispersos sin estructura ni aprovechamiento",
  "Procesos manuales que consumen tiempo y recursos",
  "Falta de visibilidad en tiempo real del negocio",
  "Dependencia de soluciones genéricas que no encajan",
];

const solutions = [
  "Unificación inteligente de todas tus fuentes de datos",
  "Automatización con IA que aprende de tu negocio",
  "Dashboards predictivos con insights accionables",
  "Soluciones a medida integradas con tus sistemas",
];

export default function ProblemSolution() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          <h2 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            El problema que resolvemos
          </h2>
          <p className="text-lg text-foreground-secondary">
            La mayoría de empresas tienen datos valiosos pero carecen del conocimiento 
            para convertirlos en ventaja competitiva.
          </p>
        </motion.div>

        {/* Problem/Solution Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Problems Column */}
          <motion.div
            className="space-y-6"
            variants={fadeLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-semibold">Sin Sapira</h3>
            </div>
            
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-5 rounded-xl bg-background-secondary/50 border border-border"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={viewportSettings}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-xs text-red-400 font-medium">
                  {index + 1}
                </span>
                <p className="text-foreground-secondary">{problem}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Solutions Column */}
          <motion.div
            className="space-y-6"
            variants={fadeRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckCircle size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Con Sapira</h3>
            </div>
            
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-5 rounded-xl glass border border-accent/20"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                viewport={viewportSettings}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs text-accent font-medium">
                  ✓
                </span>
                <p className="text-foreground">{solution}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Connecting Arrow (Desktop) */}
        <motion.div 
          className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          viewport={viewportSettings}
        >
          <div className="w-16 h-16 rounded-full bg-background-tertiary border border-border flex items-center justify-center">
            <ArrowRight size={24} className="text-accent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

