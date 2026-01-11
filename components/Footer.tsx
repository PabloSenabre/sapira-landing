"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
    <footer className="relative bg-[#0a0a0a] overflow-hidden">
      {/* Subtle gradient glow from top */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)",
        }}
      />
      
      <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Main footer content */}
        <motion.div
          className="py-16 lg:py-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Liquid Glass Container for links */}
          <div 
            className="rounded-3xl p-8 lg:p-12 mb-12"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Top section with logo and tagline */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-24 mb-12">
              {/* Brand */}
              <div className="lg:max-w-sm">
                <Link href="/" className="inline-flex items-center mb-6">
                  {/* Sapira Logo Badge - matching navbar style */}
                  <motion.div 
                    className="flex items-center justify-center rounded-lg overflow-hidden"
                    style={{
                      padding: "8px 16px",
                      background: "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.2)",
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span 
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: 16,
                        fontWeight: 400,
                        letterSpacing: "0.02em",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      Sapira
                    </span>
                  </motion.div>
                </Link>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  AI-powered automation for every decision. Enterprise intelligence that transforms how organizations operate.
                </p>
              </div>

              {/* Links grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
                {/* Products */}
                <div>
                  <h4 
                    className="text-xs font-medium uppercase tracking-wider mb-4"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Products
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.products.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 
                    className="text-xs font-medium uppercase tracking-wider mb-4"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Capabilities
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.capabilities.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Customers */}
                <div>
                  <h4 
                    className="text-xs font-medium uppercase tracking-wider mb-4"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Customers
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.customers.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 
                    className="text-xs font-medium uppercase tracking-wider mb-4"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Resources
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h4 
                    className="text-xs font-medium uppercase tracking-wider mb-4"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Company
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 
                    className="text-xs font-medium uppercase tracking-wider mb-4"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Legal
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar - outside the glass container */}
        <div 
          className="py-8 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()} Sapira. All rights reserved.
            </p>
            
            {/* Social links - liquid glass pills */}
            <div className="flex items-center gap-3">
              {[
                { label: "LinkedIn", href: "#" },
                { label: "Twitter", href: "#" },
                { label: "GitHub", href: "#" },
              ].map((social) => (
                <motion.a 
                  key={social.label}
                  href={social.href} 
                  className="px-4 py-2 rounded-full text-xs transition-all"
                  style={{ 
                    color: "rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {social.label}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Giant watermark text */}
      <div 
        className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none"
        style={{ height: 220 }}
      >
        <h2 
          className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 whitespace-nowrap"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(140px, 22vw, 320px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.015)",
            letterSpacing: "-0.02em",
          }}
        >
          Sapira
        </h2>
      </div>
    </footer>
  );
}
