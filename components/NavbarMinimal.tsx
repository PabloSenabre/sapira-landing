"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Our Story" },
  { href: "/methodology", label: "Our Methodology" },
  { href: "/platform", label: "Our Platform" },
  { href: "/start", label: "Start" },
];

export default function NavbarMinimal() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Glass effect appears after scrolling 100px
      setScrolled(currentScrollY > 100);
      
      // Always visible in the top zone (first 300px)
      if (currentScrollY < 300) {
        setIsVisible(true);
      }
      // Hide when scrolling down past threshold
      else if (currentScrollY > lastScrollY.current && currentScrollY > 400) {
        setIsVisible(false);
      }
      // Show when scrolling up
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -30, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div className={`max-w-5xl mx-auto px-4 md:px-6 transition-all duration-500 ${
          scrolled ? "mx-4 md:mx-auto" : ""
        }`}>
          <div className={`flex items-center justify-between transition-all duration-500 h-[70px] ${
            scrolled ? "nav-glass rounded-full px-6 py-3" : ""
          }`}>
          
            {/* Logo - Elegant dark badge with serif typography */}
            <Link href="/" className="flex items-center group">
              <motion.div 
                className="flex items-center justify-center rounded-[6px] overflow-hidden"
                style={{
                  padding: "6px 14px",
                  background: "linear-gradient(145deg, #1a1a1f 0%, #252530 40%, #1f1f25 100%)",
                  boxShadow: "inset 0 0.5px 0.5px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.15)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span 
                  className="select-none"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: 14,
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  Sapira
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300"
                    style={{
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      color: isActive ? "#1a1a1a" : "#1a1a1a",
                      opacity: isActive ? 1 : 0.6,
                      background: isActive 
                        ? "rgba(255, 255, 255, 0.6)" 
                        : "rgba(255, 255, 255, 0.25)",
                      boxShadow: isActive
                        ? "inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -1px 1px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.08)"
                        : "inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 1px rgba(0,0,0,0.02), 0 1px 4px rgba(0,0,0,0.04)",
                      border: isActive 
                        ? "1px solid rgba(255,255,255,0.5)" 
                        : "1px solid rgba(255,255,255,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.opacity = "0.9";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.opacity = "0.6";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button - Liquid Glass - Starts immersive experience */}
            <div className="hidden md:block">
              <motion.div
                className="liquid-glass-wrap liquid-glass-wrap--small"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/experience" className="liquid-glass-button">
                  <span>Discover</span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              style={{ color: "rgba(0,0,0,0.6)" }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-5 h-3.5 flex flex-col justify-between">
                <motion.span
                  className="block h-[1.5px] bg-current origin-center"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 6 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                />
                <motion.span
                  className="block h-[1.5px] bg-current"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                    scaleX: isMobileMenuOpen ? 0 : 0.7,
                  }}
                  style={{ marginLeft: "auto" }}
                  transition={{ duration: 0.25 }}
                />
                <motion.span
                  className="block h-[1.5px] bg-current origin-center"
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -6 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "rgba(245,245,243,0.92)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu Content */}
            <motion.nav
              className="relative h-full flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-4">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="text-center"
                    >
                      <Link
                        href={link.href}
                        className="block py-3 text-3xl font-light tracking-wide transition-colors"
                        style={{
                          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                          color: isActive ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.4)",
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA in mobile menu - Starts immersive experience */}
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="liquid-glass-wrap">
                  <Link
                    href="/experience"
                    className="liquid-glass-button"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Discover</span>
                  </Link>
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                className="absolute bottom-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xs" style={{ color: "rgba(0,0,0,0.3)" }}>
                  © {new Date().getFullYear()} Sapira
                </p>
              </motion.div>
            </motion.nav>

            {/* Close button */}
            <motion.button
              className="absolute top-8 right-8 p-3"
              style={{ color: "rgba(0,0,0,0.5)" }}
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

