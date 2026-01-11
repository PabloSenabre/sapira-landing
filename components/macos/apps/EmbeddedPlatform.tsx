"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";

/**
 * Embedded Platform Page
 * Uses an iframe to display the actual /platform page content
 * Only loads when component mounts (when window opens)
 */
const EmbeddedPlatform = memo(function EmbeddedPlatform() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="h-full w-full bg-black relative overflow-hidden">
      {/* Loading state */}
      {isLoading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-black z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <motion.div
              className="w-12 h-12 rounded-full border-2 border-white/10 border-t-cyan-400/60 mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-white/40 text-sm">Loading platform...</p>
          </div>
        </motion.div>
      )}

      {/* Iframe with the actual page */}
      <iframe
        src="/platform"
        className="w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        title="PHARO Platform"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
});

export default EmbeddedPlatform;

