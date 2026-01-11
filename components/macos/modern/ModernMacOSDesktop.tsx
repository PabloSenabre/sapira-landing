"use client";

import { useState, useCallback, useRef, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModernDock from "./ModernDock";
import ModernMenuBar from "./ModernMenuBar";
import ModernWindow, { ModernAppWindow } from "./ModernWindow";
import { LiquidGlassProvider, useLiquidGlassOptional } from "../liquid-glass";
import AIOApp from "../apps/AIOApp";
import FaroApp from "../apps/FaroApp";
import EquityApp from "../apps/EquityApp";
import WhatWeDoApp from "../apps/WhatWeDoApp";
import ContactApp from "../apps/ContactApp";
import FinderApp from "../apps/FinderApp";
import SapiraAIChat from "../apps/SapiraAIChat";
import DesktopIcons from "../DesktopIcons";
import { PHAROExperience } from "../pharo-experience";

// Theme Context
export type Theme = "light" | "dark";
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextValue>({ theme: "light", toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const defaultApps = [
  { id: "finder", title: "Finder", icon: "finder" },
  { id: "whatwedo", title: "What We Do", icon: "whatwedo", featured: true },
  { id: "faro", title: "Pharo Platform", icon: "faro", featured: true },
  { id: "equity", title: "Equity", icon: "equity", featured: true },
  { id: "contact", title: "Contact", icon: "contact" },
  { id: "sapira-ai", title: "Sapira AI", icon: "sapira-ai", featured: true },
];

// Locked App Icon - Grayscale, blurred, with lock overlay
const LockedAppIcon = ({ 
  id, 
  label,
}: { 
  id: string; 
  label: string; 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getIconContent = () => {
    switch (id) {
      case "aio":
        return (
          <svg viewBox="0 0 120 120" className="w-14 h-14">
            <defs>
              <linearGradient id={`locked-${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B8B8B" />
                <stop offset="100%" stopColor="#6B6B6B" />
              </linearGradient>
              <linearGradient id={`locked-${id}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="100" height="100" rx="22" fill={`url(#locked-${id}-bg)`}/>
            <rect x="10" y="10" width="100" height="100" rx="22" fill={`url(#locked-${id}-shine)`}/>
            <g transform="translate(25, 25)" opacity="0.5">
              <rect x="5" y="45" width="12" height="25" rx="3" fill="rgba(255,255,255,0.7)"/>
              <rect x="23" y="30" width="12" height="40" rx="3" fill="rgba(255,255,255,0.7)"/>
              <rect x="41" y="15" width="12" height="55" rx="3" fill="rgba(255,255,255,0.7)"/>
              <rect x="59" y="35" width="12" height="35" rx="3" fill="rgba(255,255,255,0.7)"/>
            </g>
            <path d="M32 75 L50 60 L68 45 L86 55" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        );
      case "faro":
        return (
          <svg viewBox="0 0 120 120" className="w-14 h-14">
            <defs>
              <linearGradient id={`locked-${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9A9A9A" />
                <stop offset="100%" stopColor="#7A7A7A" />
              </linearGradient>
              <linearGradient id={`locked-${id}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="100" height="100" rx="22" fill={`url(#locked-${id}-bg)`}/>
            <rect x="10" y="10" width="100" height="100" rx="22" fill={`url(#locked-${id}-shine)`}/>
            <g opacity="0.5">
              <circle cx="60" cy="42" r="14" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3"/>
              <circle cx="60" cy="42" r="5" fill="rgba(255,255,255,0.6)"/>
              <path d="M50 58 L48 95 L72 95 L70 58 Z" fill="rgba(255,255,255,0.6)"/>
              <rect x="42" y="92" width="36" height="8" rx="2" fill="rgba(255,255,255,0.5)"/>
            </g>
          </svg>
        );
      case "equity":
        return (
          <svg viewBox="0 0 120 120" className="w-14 h-14">
            <defs>
              <linearGradient id={`locked-${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C8C8C" />
                <stop offset="100%" stopColor="#6C6C6C" />
              </linearGradient>
              <linearGradient id={`locked-${id}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="100" height="100" rx="22" fill={`url(#locked-${id}-bg)`}/>
            <rect x="10" y="10" width="100" height="100" rx="22" fill={`url(#locked-${id}-shine)`}/>
            <g opacity="0.5">
              <path d="M25 80 L40 65 L55 72 L75 40 L95 55" stroke="rgba(255,255,255,0.7)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <circle cx="25" cy="80" r="4" fill="rgba(255,255,255,0.6)"/>
              <circle cx="40" cy="65" r="4" fill="rgba(255,255,255,0.6)"/>
              <circle cx="55" cy="72" r="4" fill="rgba(255,255,255,0.6)"/>
              <circle cx="75" cy="40" r="5" fill="rgba(255,255,255,0.7)"/>
              <circle cx="95" cy="55" r="4" fill="rgba(255,255,255,0.6)"/>
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center gap-1.5 p-2"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div 
              className="px-3 py-1.5 rounded-lg whitespace-nowrap"
              style={{
                background: "linear-gradient(180deg, rgba(60,60,60,0.95) 0%, rgba(40,40,40,0.95) 100%)",
                backdropFilter: "blur(20px)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <span className="text-[11px] font-medium text-white/90">
                Coming soon with Sapira AI
              </span>
            </div>
            {/* Arrow */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
              style={{ background: "rgba(40,40,40,0.95)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked icon container with Liquid Glass */}
      <motion.div
        className="relative cursor-not-allowed"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        style={{
          filter: "saturate(0.3) brightness(0.9)",
        }}
      >
        {/* Icon with reduced opacity */}
        <div 
          className="relative"
          style={{
            opacity: 0.55,
            filter: "blur(0.3px)",
          }}
        >
          {getIconContent()}
        </div>

        {/* Lock overlay - elegant frosted circle */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 100%)",
              backdropFilter: "blur(8px)",
              border: "0.5px solid rgba(255,255,255,0.6)",
              boxShadow: `
                0 2px 8px rgba(0,0,0,0.12),
                inset 0 1px 0 rgba(255,255,255,0.9)
              `,
            }}
          >
            <svg 
              className="w-4 h-4" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Label */}
      <span 
        className="text-[11px] font-medium text-center max-w-[90px] px-2 py-0.5"
        style={{
          color: "rgba(0,0,0,0.4)",
          textShadow: "0 1px 2px rgba(255,255,255,0.9)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// Shiny Featured App Icon - Sapira AI with premium glow and WebGL effect
const ShinyAppIcon = ({ 
  id, 
  label, 
  onDoubleClick 
}: { 
  id: string; 
  label: string; 
  onDoubleClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const liquidGlass = useLiquidGlassOptional();

  // Register icon as glass element on hover
  useEffect(() => {
    if (!liquidGlass || !iconRef.current) return;

    if (isHovered) {
      const rect = iconRef.current.getBoundingClientRect();
      liquidGlass.registerElement({
        id: `shiny-icon-${id}`,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width + 8,
        height: rect.height + 8,
        radius: 20,
        intensity: 1.2,
      });
    } else {
      liquidGlass.unregisterElement(`shiny-icon-${id}`);
    }

    return () => {
      liquidGlass.unregisterElement(`shiny-icon-${id}`);
    };
  }, [isHovered, id, liquidGlass]);

  return (
    <motion.button
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg group relative"
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsSelected(false); }}
      onClick={() => setIsSelected(true)}
      onDoubleClick={onDoubleClick}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        delay: 0.2 
      }}
    >
      {/* Premium glow behind icon */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          opacity: isHovered ? 1 : 0.6,
          filter: "blur(12px)",
          transform: "scale(1.2)",
        }}
      />

      {/* Icon with Liquid Glass container and premium shine */}
      <div 
        ref={iconRef}
        className="relative transition-all duration-300"
        style={{
          filter: isHovered 
            ? "drop-shadow(0 12px 28px rgba(99, 102, 241, 0.25)) drop-shadow(0 4px 12px rgba(0,0,0,0.12))" 
            : "drop-shadow(0 8px 20px rgba(99, 102, 241, 0.18)) drop-shadow(0 3px 8px rgba(0,0,0,0.1))",
          transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        }}
      >
        {/* SVG Icon */}
        <svg viewBox="0 0 120 120" className="w-16 h-16">
          <defs>
            {/* Premium gradient background */}
            <linearGradient id="sapira-ai-premium-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            {/* Top shine highlight */}
            <linearGradient id="sapira-ai-shine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="35%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            {/* Inner glow */}
            <radialGradient id="sapira-ai-glow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            {/* Premium shadow filter */}
            <filter id="sapira-premium-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366F1" floodOpacity="0.25"/>
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
            </filter>
          </defs>
          
          {/* Background with glow */}
          <rect 
            x="10" y="10" 
            width="100" height="100" 
            rx="24" 
            fill="url(#sapira-ai-premium-bg)" 
            filter="url(#sapira-premium-shadow)"
          />
          
          {/* Inner radial glow */}
          <rect x="10" y="10" width="100" height="100" rx="24" fill="url(#sapira-ai-glow)"/>
          
          {/* Top shine */}
          <rect x="10" y="10" width="100" height="100" rx="24" fill="url(#sapira-ai-shine)"/>
          
          {/* Subtle border highlight */}
          <rect 
            x="10.5" y="10.5" 
            width="99" height="99" 
            rx="23.5" 
            fill="none" 
            stroke="rgba(255,255,255,0.35)" 
            strokeWidth="1"
          />
          
          {/* Neural network design - elegant and minimal */}
          <g stroke="rgba(255,255,255,0.95)" strokeWidth="2" fill="none">
            {/* Outer ring */}
            <circle cx="60" cy="60" r="28" strokeWidth="2.5" opacity="0.9"/>
            {/* Inner ring */}
            <circle cx="60" cy="60" r="14" strokeWidth="1.5" opacity="0.8"/>
            {/* Core - bright center */}
            <circle cx="60" cy="60" r="6" fill="rgba(255,255,255,1)" stroke="none"/>
            {/* Radial connections */}
            <line x1="60" y1="32" x2="60" y2="46" strokeWidth="1.5"/>
            <line x1="60" y1="74" x2="60" y2="88" strokeWidth="1.5"/>
            <line x1="32" y1="60" x2="46" y2="60" strokeWidth="1.5"/>
            <line x1="74" y1="60" x2="88" y2="60" strokeWidth="1.5"/>
            {/* Diagonal connections */}
            <line x1="40" y1="40" x2="50" y2="50" strokeWidth="1.5" opacity="0.7"/>
            <line x1="80" y1="40" x2="70" y2="50" strokeWidth="1.5" opacity="0.7"/>
            <line x1="40" y1="80" x2="50" y2="70" strokeWidth="1.5" opacity="0.7"/>
            <line x1="80" y1="80" x2="70" y2="70" strokeWidth="1.5" opacity="0.7"/>
          </g>
          {/* Outer nodes - subtle glow */}
          <g fill="rgba(255,255,255,0.95)">
            <circle cx="60" cy="30" r="4"/>
            <circle cx="60" cy="90" r="4"/>
            <circle cx="30" cy="60" r="4"/>
            <circle cx="90" cy="60" r="4"/>
            <circle cx="38" cy="38" r="3" opacity="0.8"/>
            <circle cx="82" cy="38" r="3" opacity="0.8"/>
            <circle cx="38" cy="82" r="3" opacity="0.8"/>
            <circle cx="82" cy="82" r="3" opacity="0.8"/>
          </g>
        </svg>

        {/* Static shine overlay - the premium touch */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
          style={{
            background: `
              linear-gradient(
                125deg, 
                rgba(255,255,255,0.25) 0%, 
                rgba(255,255,255,0.08) 30%,
                transparent 50%
              )
            `,
          }}
        />
      </div>

      {/* Label with elegant styling */}
      <span 
        className="text-[11px] font-semibold text-center max-w-[90px] transition-all duration-200 px-2 py-0.5 rounded"
        style={{
          color: isSelected ? "white" : "rgba(79, 70, 229, 0.95)",
          textShadow: isSelected ? "none" : "0 1px 2px rgba(255,255,255,0.9)",
          background: isSelected ? "rgba(99, 102, 241, 0.9)" : "transparent",
        }}
      >
        {label}
      </span>

      {/* Subtle "Available" indicator */}
      {!isSelected && (
        <motion.div
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      )}
    </motion.button>
  );
};

// Desktop icons configuration with lock status
const desktopIcons = [
  { id: "aio", label: "AIO Platform", locked: true },
  { id: "faro", label: "Faro", locked: true },
  { id: "equity", label: "Equity", locked: true },
  { id: "sapira-ai", label: "Sapira AI", locked: false, featured: true },
];

interface ModernMacOSDesktopProps {
  isVisible: boolean;
}

function ModernMacOSDesktopInner({ isVisible }: ModernMacOSDesktopProps) {
  const [openWindows, setOpenWindows] = useState<ModernAppWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [activeApp, setActiveApp] = useState("Finder");
  const [theme, setTheme] = useState<Theme>("light");
  const [pharoExperienceActive, setPharoExperienceActive] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  }, []);

  const getAppComponent = (appId: string) => {
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
      case "contact":
        return <ContactApp />;
      case "sapira-ai":
        return <SapiraAIChat onTransformationReady={() => {}} autoStart={false} />;
      default:
        return <div className="p-8 text-gray-800">App not found</div>;
    }
  };

  const getWindowDefaults = (appId: string, index: number) => {
    const baseX = 100 + (index * 45);
    const baseY = 80 + (index * 45);
    
    return {
      position: { x: baseX, y: baseY },
      size: { width: 920, height: 600 },
    };
  };

  const openApp = useCallback((appId: string) => {
    // Special case: Sapira AI triggers the PHARO experience
    if (appId === "sapira-ai") {
      setPharoExperienceActive(true);
      return;
    }

    // Check if app is locked
    const iconConfig = desktopIcons.find(i => i.id === appId);
    if (iconConfig?.locked) return;

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
    const newWindow: ModernAppWindow = {
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
  }, [openWindows, highestZIndex]);

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
      }
    }
  }, [activeWindowId, openWindows]);

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

  if (!isVisible) return null;

  // Theme-aware styles
  const isLight = theme === "light";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <motion.div
        className="fixed inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ===== THEME-AWARE WALLPAPER ===== */}
        <div className="absolute inset-0">
          {/* Solid opaque base layer - covers body background */}
          <div 
            className="absolute inset-0 transition-colors duration-500"
            style={{
              backgroundColor: isLight ? "#f5f3f0" : "#0d0d0f",
            }}
          />
          
          {/* Base gradient - Light vs Dark - fully opaque */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: isLight
                ? `linear-gradient(145deg, 
                    #fdfcfb 0%, 
                    #f7f4f1 20%,
                    #f2eeea 45%,
                    #ebe6e1 70%,
                    #f5f2ef 100%
                  )`
                : `linear-gradient(145deg, 
                    #0a0a0c 0%, 
                    #111114 20%,
                    #18181c 45%,
                    #1f1f24 70%,
                    #151518 100%
                  )`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Soft gradient orbs - Theme aware */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: isLight
                ? `
                  radial-gradient(ellipse 90% 70% at 15% 25%, rgba(219, 234, 254, 0.35) 0%, transparent 55%),
                  radial-gradient(ellipse 80% 55% at 85% 75%, rgba(254, 226, 200, 0.28) 0%, transparent 55%),
                  radial-gradient(ellipse 65% 45% at 55% 15%, rgba(237, 223, 255, 0.22) 0%, transparent 45%),
                  radial-gradient(ellipse 55% 45% at 25% 85%, rgba(209, 250, 229, 0.18) 0%, transparent 45%)
                `
                : `
                  radial-gradient(ellipse 90% 70% at 15% 25%, rgba(99, 102, 241, 0.08) 0%, transparent 55%),
                  radial-gradient(ellipse 80% 55% at 85% 75%, rgba(236, 72, 153, 0.06) 0%, transparent 55%),
                  radial-gradient(ellipse 65% 45% at 55% 15%, rgba(139, 92, 246, 0.07) 0%, transparent 45%),
                  radial-gradient(ellipse 55% 45% at 25% 85%, rgba(34, 211, 238, 0.05) 0%, transparent 45%)
                `,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Subtle aurora animation */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: isLight
                ? [
                    "radial-gradient(ellipse 120% 35% at 25% -5%, rgba(186, 212, 255, 0.12) 0%, transparent 45%)",
                    "radial-gradient(ellipse 120% 35% at 75% -5%, rgba(216, 200, 255, 0.12) 0%, transparent 45%)",
                    "radial-gradient(ellipse 120% 35% at 25% -5%, rgba(186, 212, 255, 0.12) 0%, transparent 45%)",
                  ]
                : [
                    "radial-gradient(ellipse 120% 35% at 25% -5%, rgba(99, 102, 241, 0.08) 0%, transparent 45%)",
                    "radial-gradient(ellipse 120% 35% at 75% -5%, rgba(139, 92, 246, 0.08) 0%, transparent 45%)",
                    "radial-gradient(ellipse 120% 35% at 25% -5%, rgba(99, 102, 241, 0.08) 0%, transparent 45%)",
                  ],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Ultra-subtle noise texture */}
          <div
            className="absolute inset-0"
            style={{
              opacity: isLight ? 0.012 : 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Sapira watermark - Large centered text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1.8, ease: "easeOut" }}
            >
              <h1 
                className="select-none"
                style={{
                  fontFamily: "'Times New Roman', Georgia, serif",
                  fontSize: "clamp(8rem, 22vw, 16rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  color: isLight ? "rgba(0,0,0,0.045)" : "rgba(255,255,255,0.04)",
                  textShadow: isLight 
                    ? "0 2px 40px rgba(0,0,0,0.02)" 
                    : "0 2px 40px rgba(255,255,255,0.01)",
                }}
              >
                Sapira
              </h1>
            </motion.div>
          </div>
        </div>

        {/* ===== DESKTOP ICONS - All Legacy Apps Locked + Sapira Hero ===== */}
        <DesktopIcons
          theme={theme}
          onAppOpen={(appId) => {
            // Legacy apps are locked - could show a message
            console.log(`Legacy app clicked: ${appId}`);
          }}
          onSapiraClick={() => openApp("sapira-ai")}
        />

        {/* Modern Menu Bar - Updated with Sapira branding */}
        <ModernMenuBar activeApp={activeApp} onNavigate={handleNavigate} />

        {/* Windows */}
        <AnimatePresence>
          {openWindows
            .filter((w) => !w.isMinimized)
            .map((window) => (
              <ModernWindow
                key={window.id}
                window={window}
                isActive={activeWindowId === window.id}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onFocus={() => bringToFront(window.id)}
                onDrag={(position) => updateWindowPosition(window.id, position)}
              >
                {window.component}
              </ModernWindow>
            ))}
        </AnimatePresence>

        {/* Modern Dock */}
        <ModernDock
          openApps={openWindows.map((w) => w.id)}
          activeApp={activeWindowId}
          onAppClick={openApp}
          lockedApps={[]}
        />

        {/* PHARO Experience - Activated when clicking Sapira AI */}
        <PHAROExperience 
          isActive={pharoExperienceActive}
          onComplete={() => setPharoExperienceActive(false)}
          theme={theme}
        />

        {/* "Powered by Sapira AI" badge - Premium Liquid Glass */}
        <motion.div
          className="fixed bottom-20 right-6 z-[50]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div
            className="px-3.5 py-2 rounded-full flex items-center gap-2.5"
            style={{
              background: isLight 
                ? "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 100%)"
                : "linear-gradient(180deg, rgba(40,40,45,0.88) 0%, rgba(30,30,35,0.72) 100%)",
              border: isLight ? "0.5px solid rgba(255,255,255,0.8)" : "0.5px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(24px) saturate(180%)",
              boxShadow: isLight
                ? `
                  0 4px 16px rgba(0,0,0,0.06),
                  0 1px 4px rgba(0,0,0,0.04),
                  inset 0 1px 0 rgba(255,255,255,0.9)
                `
                : `
                  0 4px 16px rgba(0,0,0,0.3),
                  0 1px 4px rgba(0,0,0,0.2),
                  inset 0 1px 0 rgba(255,255,255,0.05)
                `,
            }}
          >
            <div 
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #818CF8 0%, #6366F1 100%)",
                boxShadow: "0 0 8px rgba(99, 102, 241, 0.3)",
              }}
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" />
              </svg>
            </div>
            <span 
              className="text-[10px] font-medium tracking-wide"
              style={{ color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.7)" }}
            >
              Powered by Sapira AI
            </span>
          </div>
        </motion.div>
      </motion.div>
    </ThemeContext.Provider>
  );
}

// Main export - LiquidGlass WebGL enabled for premium glass effects
export default function ModernMacOSDesktop({ isVisible }: ModernMacOSDesktopProps) {
  return (
    <LiquidGlassProvider enableCursorSpotlight={false}>
      <ModernMacOSDesktopInner isVisible={isVisible} />
    </LiquidGlassProvider>
  );
}
