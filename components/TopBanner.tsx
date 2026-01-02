"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TopBannerProps {
  show?: boolean;
}

export default function TopBanner({ show = true }: TopBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!show || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] bg-black border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center h-10 relative">
            <p className="text-sm text-white/70">
              Read our latest{" "}
              <Link 
                href="#whitepaper" 
                className="text-white underline underline-offset-4 hover:no-underline transition-all"
              >
                AI Whitepaper
              </Link>
            </p>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-0 p-2 text-white/50 hover:text-white transition-colors"
              aria-label="Close banner"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

