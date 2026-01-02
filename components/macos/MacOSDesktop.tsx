"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MacDock from "./MacDock";
import MacMenuBar from "./MacMenuBar";
import MacWindow from "./MacWindow";
import SapiraAIButton from "./SapiraAIButton";
import TransformationOverlay from "./TransformationOverlay";
import ModernMacOSDesktop from "./modern/ModernMacOSDesktop";
import { LiquidGlassProvider } from "./liquid-glass";
import AIOApp from "./apps/AIOApp";
import FaroApp from "./apps/FaroApp";
import EquityApp from "./apps/EquityApp";
import WhatWeDoApp from "./apps/WhatWeDoApp";
import AboutApp from "./apps/AboutApp";
import ContactApp from "./apps/ContactApp";
import FinderApp from "./apps/FinderApp";
import SapiraAIChat from "./apps/SapiraAIChat";
import DesktopIcons from "./DesktopIcons";
import { PHAROExperience } from "./pharo-experience";

export interface AppWindow {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// Experience state machine
type ExperienceState = 
  | 'idle'           // Desktop normal with floating button
  | 'chat-open'      // Chat window visible, auto experience running
  | 'transforming'   // Transformation animation in progress
  | 'modern';        // Modern desktop fully active

const defaultApps = [
  { id: "finder", title: "Finder", icon: "finder" },
  { id: "whatwedo", title: "What We Do", icon: "whatwedo" },
  { id: "faro", title: "Pharo Platform", icon: "faro" },
  { id: "equity", title: "Equity", icon: "equity" },
  { id: "about", title: "About Sapira", icon: "about" },
  { id: "contact", title: "Contact", icon: "contact" },
  { id: "sapira-ai", title: "Sapira AI", icon: "sapira-ai" },
];

// Inner desktop component that uses the liquid glass context
function MacOSDesktopInner() {
  const [experienceState, setExperienceState] = useState<ExperienceState>('idle');
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(1000);
  const [activeApp, setActiveApp] = useState("Finder");
  const [pharoExperienceActive, setPharoExperienceActive] = useState(false);

  const getAppComponent = useCallback((appId: string, onTransformReady?: () => void) => {
    switch (appId) {
      case "finder":
        return <FinderApp />;
      case "aio":
        return <AIOApp />;
      case "whatwedo":
        return <WhatWeDoApp />;
      case "faro":
        return <FaroApp />;
      case "equity":
        return <EquityApp />;
      case "about":
        return <AboutApp />;
      case "contact":
        return <ContactApp />;
      case "sapira-ai":
        return (
          <SapiraAIChat 
            onTransformationReady={onTransformReady || (() => {})}
            autoStart={true}
          />
        );
      default:
        return <div className="p-8 text-white">App not found</div>;
    }
  }, []);

  const getWindowDefaults = (appId: string, index: number) => {
    const baseX = 80 + (index * 40);
    const baseY = 60 + (index * 40);
    
    // Special positioning for Sapira AI chat window
    if (appId === "sapira-ai") {
      return {
        position: { x: 180, y: 80 },
        size: { width: 700, height: 600 },
      };
    }
    
    return {
      position: { x: baseX, y: baseY },
      size: { width: 900, height: 580 },
    };
  };

  // Handle the "View Results" click from the chat
  const handleTransformationReady = useCallback(() => {
    // Close the chat window first
    setOpenWindows([]);
    setActiveWindowId(null);
    
    // Start transformation
    setExperienceState('transforming');
  }, []);

  // Handle transformation animation complete
  const handleTransformationComplete = useCallback(() => {
    setExperienceState('modern');
  }, []);

  // Handle floating button click - open Sapira AI chat
  const handleSapiraButtonClick = useCallback(() => {
    // Activate the PHARO experience instead of opening a chat
    setPharoExperienceActive(true);
  }, []);

  const openApp = useCallback((appId: string) => {
    // Special case: Sapira AI triggers the PHARO experience
    if (appId === "sapira-ai") {
      setPharoExperienceActive(true);
      return;
    }

    const existingWindow = openWindows.find((w) => w.id === appId);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setOpenWindows((prev) =>
          prev.map((w) =>
            w.id === appId ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 } : w
          )
        );
        setHighestZIndex((prev) => prev + 1);
      } else {
        bringToFront(appId);
      }
      setActiveWindowId(appId);
      const app = defaultApps.find((a) => a.id === appId);
      if (app) setActiveApp(app.title);
      return;
    }

    const app = defaultApps.find((a) => a.id === appId);
    if (!app) return;

    const defaults = getWindowDefaults(appId, openWindows.length);
    const newWindow: AppWindow = {
      id: appId,
      title: app.title,
      icon: app.icon,
      component: getAppComponent(appId),
      isMinimized: false,
      zIndex: highestZIndex + 1,
      position: defaults.position,
      size: defaults.size,
    };

    setOpenWindows((prev) => [...prev, newWindow]);
    setHighestZIndex((prev) => prev + 1);
    setActiveWindowId(appId);
    setActiveApp(app.title);
  }, [openWindows, highestZIndex, getAppComponent]);

  const closeWindow = useCallback((appId: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== appId));
    if (activeWindowId === appId) {
      const remaining = openWindows.filter((w) => w.id !== appId);
      if (remaining.length > 0) {
        const topWindow = remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
        setActiveWindowId(topWindow.id);
        const app = defaultApps.find((a) => a.id === topWindow.id);
        if (app) setActiveApp(app.title);
      } else {
        setActiveWindowId(null);
        setActiveApp("Finder");
        // If closing the Sapira AI chat, return to idle
        if (appId === "sapira-ai" && experienceState === 'chat-open') {
          setExperienceState('idle');
        }
      }
    }
  }, [activeWindowId, openWindows, experienceState]);

  const minimizeWindow = useCallback((appId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === appId) {
      const remaining = openWindows.filter((w) => w.id !== appId && !w.isMinimized);
      if (remaining.length > 0) {
        const topWindow = remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
        setActiveWindowId(topWindow.id);
        const app = defaultApps.find((a) => a.id === topWindow.id);
        if (app) setActiveApp(app.title);
      } else {
        setActiveWindowId(null);
        setActiveApp("Finder");
      }
    }
  }, [activeWindowId, openWindows]);

  const bringToFront = useCallback((appId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.id === appId ? { ...w, zIndex: highestZIndex + 1 } : w
      )
    );
    setHighestZIndex((prev) => prev + 1);
    setActiveWindowId(appId);
    const app = defaultApps.find((a) => a.id === appId);
    if (app) setActiveApp(app.title);
  }, [highestZIndex]);

  const updateWindowPosition = useCallback((appId: string, position: { x: number; y: number }) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, position } : w))
    );
  }, []);

  const handleNavigate = (section: string) => {
    openApp(section);
  };

  // Render Modern Desktop when in modern state
  if (experienceState === 'modern') {
    return <ModernMacOSDesktop isVisible={true} />;
  }

  return (
    <>
      {/* Legacy MacOS Desktop */}
      <motion.div
        className="fixed inset-0 overflow-hidden"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ 
          opacity: experienceState === 'transforming' ? 0 : 1, 
          scale: experienceState === 'transforming' ? 0.98 : 1 
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Optimized Light Wallpaper - Single layer gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(219, 234, 254, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 80% 70%, rgba(254, 226, 200, 0.3) 0%, transparent 50%),
              linear-gradient(145deg, #fdfcfb 0%, #f7f4f1 30%, #f2eeea 60%, #ebe6e1 100%)
            `,
          }}
        >
          {/* Centered Sapira logo watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 
              className="text-8xl md:text-9xl font-light select-none opacity-[0.04]"
              style={{
                fontFamily: "'Times New Roman', 'Georgia', serif",
                letterSpacing: "-0.03em",
              }}
            >
              Sapira
            </h1>
          </div>
        </div>

        {/* Desktop Icons - Legacy apps locked + Sapira hero */}
        <DesktopIcons 
          onAppOpen={(appId) => {
            // Legacy apps just show a message or trigger experience
            console.log(`Legacy app clicked: ${appId}`);
          }}
          onSapiraClick={handleSapiraButtonClick}
        />

        {/* Menu Bar */}
        <MacMenuBar activeApp={activeApp} onNavigate={handleNavigate} />

        {/* Windows */}
        <AnimatePresence>
          {openWindows
            .filter((w) => !w.isMinimized)
            .map((window) => (
              <MacWindow
                key={window.id}
                window={window}
                isActive={activeWindowId === window.id}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onFocus={() => bringToFront(window.id)}
                onDrag={(position) => updateWindowPosition(window.id, position)}
              >
                {window.component}
              </MacWindow>
            ))}
        </AnimatePresence>

        {/* Floating Sapira AI Button - only visible in idle state */}
        <AnimatePresence>
          {experienceState === 'idle' && (
            <SapiraAIButton 
              onClick={handleSapiraButtonClick}
              isVisible={true}
            />
          )}
        </AnimatePresence>

        {/* Dock */}
        <MacDock
          openApps={openWindows.map((w) => w.id)}
          activeApp={activeWindowId}
          onAppClick={openApp}
        />
      </motion.div>

      {/* Transformation Overlay */}
      <TransformationOverlay 
        isActive={experienceState === 'transforming'}
        onComplete={handleTransformationComplete}
      />

      {/* PHARO Experience - Activated from Sapira AI chat */}
      <PHAROExperience 
        isActive={pharoExperienceActive}
        onComplete={() => setPharoExperienceActive(false)}
        theme="light"
      />
    </>
  );
}

// Main export with LiquidGlassProvider wrapper
export default function MacOSDesktop() {
  return (
    <LiquidGlassProvider 
      enableCursorSpotlight={false}
      cursorSize={45}
    >
      <MacOSDesktopInner />
    </LiquidGlassProvider>
  );
}
