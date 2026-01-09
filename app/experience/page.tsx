"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import VideoIntro from "@/components/VideoIntro";
import TerminalExperience from "@/components/TerminalExperience";
import WindowsXPDesktop from "@/components/windowsxp/WindowsXPDesktop";
import MacOSDesktop from "@/components/macos/MacOSDesktop";

/**
 * Immersive Experience Page
 * 
 * Full immersive flow for curious users:
 * Video → Terminal → Windows XP → macOS (new OS)
 * 
 * This page does NOT return to the manifesto - it goes straight to macOS.
 */

type ExperiencePhase = "video" | "terminal" | "windowsxp" | "macos";

export default function ExperiencePage() {
  const [phase, setPhase] = useState<ExperiencePhase>("video");

  const handleVideoComplete = () => {
    setPhase("terminal");
  };

  const handleTerminalComplete = () => {
    setPhase("windowsxp");
  };

  // Goes directly to macOS - no manifesto return
  const handleXPComplete = () => {
    setPhase("macos");
  };

  return (
    <div className="min-h-screen bg-black overflow-visible">
      {/* Phase 1: Video Intro */}
      <AnimatePresence>
        {phase === "video" && <VideoIntro onComplete={handleVideoComplete} />}
      </AnimatePresence>

      {/* Phase 2: Terminal Experience */}
      <AnimatePresence>
        {phase === "terminal" && <TerminalExperience onComplete={handleTerminalComplete} />}
      </AnimatePresence>

      {/* Phase 3: Windows XP Desktop */}
      <AnimatePresence>
        {phase === "windowsxp" && (
          <WindowsXPDesktop onLearnSapiraClick={handleXPComplete} />
        )}
      </AnimatePresence>

      {/* Phase 4: Modern macOS Desktop - Final destination */}
      <AnimatePresence>
        {phase === "macos" && <MacOSDesktop />}
      </AnimatePresence>
    </div>
  );
}

