"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import VideoIntro from "@/components/VideoIntro";
import TerminalExperience from "@/components/TerminalExperience";
import WindowsXPDesktop from "@/components/windowsxp/WindowsXPDesktop";
import MacOSDesktop from "@/components/macos/MacOSDesktop";

type IntroPhase = "video" | "terminal" | "windowsxp" | "macos";

export default function Home() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>("video");

  const handleVideoComplete = () => {
    setIntroPhase("terminal");
  };

  const handleTerminalComplete = () => {
    setIntroPhase("windowsxp");
  };

  const handleManifestoComplete = () => {
    setIntroPhase("macos");
  };

  return (
    <div className="min-h-screen bg-black overflow-visible">
      {/* Phase 1: Video Intro with Portal Effect */}
      <AnimatePresence>
        {introPhase === "video" && <VideoIntro onComplete={handleVideoComplete} />}
      </AnimatePresence>

      {/* Phase 2: Terminal Experience (Windows XP style) */}
      <AnimatePresence>
        {introPhase === "terminal" && <TerminalExperience onComplete={handleTerminalComplete} />}
      </AnimatePresence>

      {/* Phase 3: Windows XP Desktop Experience */}
      {/* The XP Desktop handles its own internal states:
          - Desktop idle
          - Crash experience (when clicking legacy apps)
          - BSOD
          - Manifesto
          - Then transitions to macOS */}
      <AnimatePresence>
        {introPhase === "windowsxp" && (
          <WindowsXPDesktop onLearnSapiraClick={handleManifestoComplete} />
        )}
      </AnimatePresence>

      {/* Phase 4: Modern macOS Desktop */}
      <AnimatePresence>
        {introPhase === "macos" && <MacOSDesktop />}
      </AnimatePresence>
    </div>
  );
}
