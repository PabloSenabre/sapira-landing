"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

// Lazy load the embedded platform page - only loads when window opens
const EmbeddedPlatform = lazy(() => import("./EmbeddedPlatform"));

/**
 * Loading component for the embedded content
 */
function LoadingFallback() {
  return (
    <div className="h-full w-full bg-black flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-white/10 border-t-cyan-400/60 mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-white/40 text-sm">Loading PHARO Platform...</p>
      </div>
    </div>
  );
}

/**
 * PHARO Platform App
 * Displays the full /platform page content embedded in the window
 * Uses lazy loading to only fetch content when the window opens
 */
export default function FaroApp() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EmbeddedPlatform />
    </Suspense>
  );
}
