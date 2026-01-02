"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cardHoverVariants } from "@/lib/animations";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  features?: string[];
}

export default function ServiceCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  features 
}: ServiceCardProps) {
  return (
    <motion.div
      className="group relative"
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
    >
      <Link href={href} className="block h-full">
        <div className="h-full p-8 rounded-2xl glass border border-border hover:border-border-hover transition-colors duration-300">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-background-tertiary flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors duration-300">
            <Icon size={28} className="text-accent" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-foreground-secondary text-sm leading-relaxed mb-6">
            {description}
          </p>

          {/* Features List */}
          {features && features.length > 0 && (
            <ul className="space-y-2 mb-6">
              {features.map((feature, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-2 text-sm text-foreground-muted"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Arrow Link */}
          <div className="flex items-center gap-2 text-sm font-medium text-accent">
            <span>Learn more</span>
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Glow effect on hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent/20 to-accent-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}

