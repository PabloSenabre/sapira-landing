"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";

/**
 * Embedded Methodology Page
 * Uses an iframe to display the actual /methodology page content
 * Only loads when component mounts (when window opens)
 */
const EmbeddedMethodology = memo(function EmbeddedMethodology() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="h-full w-full bg-white relative overflow-hidden">
      {/* Loading state */}
      {isLoading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-white z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <motion.div
              className="w-12 h-12 rounded-full border-2 border-black/10 border-t-black/40 mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-black/40 text-sm">Loading methodology...</p>
          </div>
        </motion.div>
      )}

      {/* Iframe with the actual page */}
      <iframe
        src="/methodology"
        className="w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        title="Our Methodology"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
});

export default EmbeddedMethodology;

