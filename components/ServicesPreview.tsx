"use client";

import { motion } from "framer-motion";
import { Search, Zap, BarChart3 } from "lucide-react";
import { fadeUpVariants, staggerContainerVariants, viewportSettings } from "@/lib/animations";
import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Discovery",
    description: "Análisis profundo de datos y procesos empresariales para identificar oportunidades de optimización con IA.",
    icon: Search,
    href: "/aio#discovery",
    features: [
      "Auditoría de datos",
      "Mapeo de procesos",
      "Identificación de oportunidades",
    ],
  },
  {
    title: "Ejecución",
    description: "Implementación de soluciones AI a medida, integradas perfectamente con tus sistemas existentes.",
    icon: Zap,
    href: "/aio#execution",
    features: [
      "Desarrollo a medida",
      "Integración de sistemas",
      "Automatización inteligente",
    ],
  },
  {
    title: "Monitorización",
    description: "Dashboards en tiempo real y seguimiento continuo del rendimiento de tus soluciones AI.",
    icon: BarChart3,
    href: "/aio#monitoring",
    features: [
      "Dashboards en tiempo real",
      "Alertas inteligentes",
      "Optimización continua",
    ],
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
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
            What We Do
          </span>
          <h2 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            De la idea a la implementación,{" "}
            <span className="text-foreground-secondary">con resultados medibles</span>
          </h2>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Nuestro enfoque integral cubre todo el ciclo de vida de tus proyectos de 
            inteligencia artificial, desde el análisis inicial hasta la optimización continua.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={fadeUpVariants}>
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

