"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { headerVariants } from "@/lib/animations";
import MegaMenu from "./MegaMenu";

interface HeaderProps {
  showOnLoad?: boolean;
}

const navItems = [
  {
    label: "Products",
    hasMegaMenu: true,
    menuType: "products" as const,
  },
  {
    label: "Sectors",
    hasMegaMenu: true,
    menuType: "sectors" as const,
  },
  {
    label: "Functions",
    hasMegaMenu: true,
    menuType: "functions" as const,
  },
  {
    label: "Company",
    href: "/about",
    hasMegaMenu: false,
  },
];

export default function Header({ showOnLoad = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <>
      <motion.header
        className="fixed top-10 left-0 right-0 z-50"
        variants={headerVariants}
        initial={showOnLoad ? "hidden" : "visible"}
        animate="visible"
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Palantir style */}
            <Link href="/" className="relative z-10 flex items-center gap-2">
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasMegaMenu && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className="flex items-center gap-1 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                      {item.hasMegaMenu && (
                        <ChevronDown 
                          size={14} 
                          className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>
                  )}
                  
                  {/* Mega Menu */}
                  <AnimatePresence>
                    {item.hasMegaMenu && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 pt-2"
                      >
                        <MegaMenu type={item.menuType!} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right side - CTA + Search + Menu */}
            <div className="flex items-center gap-2">
              {/* Get Started Button */}
              <Link
                href="#contact"
                className="hidden sm:block px-6 py-2.5 text-sm font-medium bg-white text-black hover:bg-white/90 transition-colors duration-200"
              >
                Get Started
              </Link>

              {/* Search button */}
              <button 
                className="p-3 text-white/70 hover:text-white transition-colors border border-white/20 hover:border-white/40"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              {/* Hamburger Menu */}
              <button
                className="p-3 text-white/70 hover:text-white transition-colors border border-white/20 hover:border-white/40"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="w-[18px] h-[14px] flex flex-col justify-between">
                  <span className={`block h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                  <span className={`block h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Full screen menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-h-full flex flex-col pt-28 pb-12 px-8 lg:px-24">
              {/* Grid layout for menu categories */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Products Column */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
                    Products
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { label: "AIO Platform", href: "/aio", desc: "All-in-One Enterprise Intelligence" },
                      { label: "Faro", href: "/faro", desc: "Predictive Analytics Platform" },
                      { label: "Equity", href: "/equity", desc: "Investment Intelligence" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="group block"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-xl lg:text-2xl font-light text-white/80 group-hover:text-white transition-colors">
                            {item.label}
                          </span>
                          <span className="block text-sm text-white/40 mt-1">
                            {item.desc}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Sectors Column */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
                    Sectors
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { label: "Manufacturing", href: "/sectors/manufacturing" },
                      { label: "Infrastructure", href: "/sectors/infrastructure" },
                      { label: "Engineering", href: "/sectors/engineering" },
                      { label: "Energy", href: "/sectors/energy" },
                      { label: "Financial Services", href: "/sectors/finance" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="text-xl lg:text-2xl font-light text-white/80 hover:text-white transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Functions Column */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
                    Functions
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { label: "Procurement", href: "/functions/procurement" },
                      { label: "Human Resources", href: "/functions/hr" },
                      { label: "Administrative", href: "/functions/administrative" },
                      { label: "Operations", href: "/functions/operations" },
                      { label: "Finance", href: "/functions/finance" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="text-xl lg:text-2xl font-light text-white/80 hover:text-white transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Company Links Row */}
              <motion.div
                className="mt-16 pt-8 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-wrap gap-8">
                  {[
                    { label: "About", href: "/about" },
                    { label: "Careers", href: "/careers" },
                    { label: "Contact", href: "/contact" },
                    { label: "Blog", href: "/blog" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Bottom section */}
              <motion.div
                className="mt-8 pt-8 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-wrap gap-8 text-sm text-white/40">
                  <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <span>© 2024 Sapira</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
