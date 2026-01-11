"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

// Lazy load the embedded methodology page - only loads when window opens
const EmbeddedMethodology = lazy(() => import("./EmbeddedMethodology"));

/**
 * Loading component for the embedded content
 */
function LoadingFallback() {
  return (
    <div className="h-full w-full bg-white flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-black/10 border-t-black/40 mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-black/40 text-sm">Loading Our Methodology...</p>
      </div>
    </div>
  );
}

interface WhatWeDoAppProps {
  autoPlay?: boolean;
  onComplete?: () => void;
}

/**
 * What We Do App
 * Displays the full /methodology page content embedded in the window
 * Uses lazy loading to only fetch content when the window opens
 */
export default function WhatWeDoApp({ autoPlay, onComplete }: WhatWeDoAppProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EmbeddedMethodology />
    </Suspense>
  );
}
