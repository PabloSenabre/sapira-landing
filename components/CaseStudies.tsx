"use client";

import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainerVariants, viewportSettings } from "@/lib/animations";
import { ArrowUpRight, TrendingUp, Clock, Target } from "lucide-react";

const caseStudies = [
  {
    client: "Manufacturing Enterprise",
    industry: "Manufacturing",
    title: "Optimización de cadena de suministro con IA predictiva",
    description: "Implementamos un sistema de forecasting que redujo el inventario obsoleto en un 40% mientras mejoraba la disponibilidad de producto.",
    metrics: [
      { label: "Reducción de costes", value: "40%", icon: TrendingUp },
      { label: "Tiempo de implementación", value: "3 meses", icon: Clock },
      { label: "ROI primer año", value: "320%", icon: Target },
    ],
  },
  {
    client: "Infrastructure Company",
    industry: "Infrastructure",
    title: "Mantenimiento predictivo para activos críticos",
    description: "Sistema de monitorización IoT + ML que predice fallos antes de que ocurran, reduciendo paradas no planificadas en un 65%.",
    metrics: [
      { label: "Reducción de paradas", value: "65%", icon: TrendingUp },
      { label: "Tiempo de implementación", value: "4 meses", icon: Clock },
      { label: "Ahorro anual", value: "€2.1M", icon: Target },
    ],
  },
];

export default function CaseStudies() {
  return (
    <section className="py-24 lg:py-32 bg-background-secondary relative">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-3xl mb-16"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider mb-4 block">
            Case Studies
          </span>
          <h2 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Resultados que hablan por sí solos
          </h2>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Casos reales de transformación digital con impacto medible en el negocio.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <motion.div
          className="grid lg:grid-cols-2 gap-8"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              className="group p-8 lg:p-10 rounded-2xl bg-background border border-border hover:border-border-hover transition-colors duration-300"
              variants={fadeUpVariants}
            >
              {/* Industry Tag */}
              <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full mb-6">
                {study.industry}
              </span>

              {/* Title */}
              <h3 className="text-2xl font-semibold mb-4 group-hover:text-accent transition-colors">
                {study.title}
              </h3>

              {/* Description */}
              <p className="text-foreground-secondary leading-relaxed mb-8">
                {study.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {study.metrics.map((metric, mIndex) => (
                  <div key={mIndex} className="text-center p-4 rounded-xl bg-background-secondary">
                    <metric.icon size={20} className="mx-auto mb-2 text-accent" />
                    <div className="text-2xl font-semibold text-foreground mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs text-foreground-muted">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Read More Link */}
              <button className="flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                <span>Read full case study</span>
                <ArrowUpRight size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

