"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface MegaMenuProps {
  type: "products" | "sectors" | "functions";
}

const menuData = {
  products: {
    items: [
      {
        label: "AIO Platform",
        href: "/aio",
        description: "All-in-One Enterprise Intelligence",
        featured: true,
      },
      {
        label: "Faro",
        href: "/faro",
        description: "Predictive Analytics Platform",
      },
      {
        label: "Equity",
        href: "/equity",
        description: "Investment Intelligence",
      },
    ],
    cta: {
      label: "View all products",
      href: "/products",
    },
  },
  sectors: {
    items: [
      { label: "Manufacturing", href: "/sectors/manufacturing", description: "Industrial optimization" },
      { label: "Infrastructure", href: "/sectors/infrastructure", description: "Asset management" },
      { label: "Engineering", href: "/sectors/engineering", description: "Design & development" },
      { label: "Energy", href: "/sectors/energy", description: "Resource optimization" },
      { label: "Financial Services", href: "/sectors/finance", description: "Risk & compliance" },
    ],
    cta: {
      label: "View all sectors",
      href: "/sectors",
    },
  },
  functions: {
    items: [
      { label: "Procurement", href: "/functions/procurement", description: "Supply chain optimization" },
      { label: "Human Resources", href: "/functions/hr", description: "Workforce intelligence" },
      { label: "Administrative", href: "/functions/administrative", description: "Operational efficiency" },
      { label: "Operations", href: "/functions/operations", description: "Process automation" },
      { label: "Finance", href: "/functions/finance", description: "Financial planning" },
    ],
    cta: {
      label: "View all functions",
      href: "/functions",
    },
  },
};

export default function MegaMenu({ type }: MegaMenuProps) {
  const data = menuData[type];

  return (
    <div className="min-w-[320px] bg-black border border-white/10 shadow-2xl">
      <div className="p-2">
        {data.items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className="group flex items-start gap-4 p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex-1">
                <span className="block text-sm text-white group-hover:text-white/90 transition-colors">
                  {item.label}
                </span>
                <span className="block text-xs text-white/40 mt-0.5">
                  {item.description}
                </span>
              </div>
              <ArrowUpRight 
                size={14} 
                className="text-white/20 group-hover:text-white/60 transition-colors mt-1" 
              />
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* CTA */}
      <div className="border-t border-white/10">
        <Link
          href={data.cta.href}
          className="flex items-center justify-between p-4 text-xs uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>{data.cta.label}</span>
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
