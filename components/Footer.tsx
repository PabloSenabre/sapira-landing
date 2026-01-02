"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUpVariants, viewportSettings } from "@/lib/animations";

const footerLinks = {
  products: [
    { label: "AIO Platform", href: "/aio" },
    { label: "Faro", href: "/faro" },
    { label: "Equity", href: "/equity" },
    { label: "Ontology", href: "#ontology" },
    { label: "API", href: "#api" },
  ],
  capabilities: [
    { label: "AI + ML", href: "#ai" },
    { label: "Data Integration", href: "#data" },
    { label: "Digital Twin", href: "#twin" },
    { label: "Edge AI", href: "#edge" },
    { label: "Real-Time Alerting", href: "#alerts" },
  ],
  customers: [
    { label: "Commercial", href: "#commercial" },
    { label: "Government", href: "#government" },
    { label: "Impact Studies", href: "#impact" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Developer Portal", href: "#developers" },
    { label: "Blog", href: "#blog" },
    { label: "Newsroom", href: "#news" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
    { label: "Investors", href: "#investors" },
  ],
  legal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Security", href: "#security" },
    { label: "Cookies", href: "#cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Main footer content */}
        <motion.div
          className="py-16 lg:py-24"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          {/* Top section with logo and tagline */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-24 mb-16">
            {/* Brand */}
            <div className="lg:max-w-sm">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" fill="currentColor"/>
                </svg>
                <span className="text-lg font-light tracking-wide text-white">
                  Sapira
                </span>
              </Link>
              <p className="text-sm text-white/50 leading-relaxed">
                AI-powered automation for every decision. Enterprise intelligence that transforms how organizations operate.
              </p>
            </div>

            {/* Links grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
              {/* Products */}
              <div>
                <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                  Products
                </h4>
                <ul className="space-y-3">
                  {footerLinks.products.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Capabilities */}
              <div>
                <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                  Capabilities
                </h4>
                <ul className="space-y-3">
                  {footerLinks.capabilities.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customers */}
              <div>
                <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                  Customers
                </h4>
                <ul className="space-y-3">
                  {footerLinks.customers.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                  Resources
                </h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                  Company
                </h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                  Legal
                </h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Sapira. All rights reserved.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
