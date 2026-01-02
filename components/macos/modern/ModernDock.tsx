"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLiquidGlassOptional } from "../liquid-glass";
import { useTheme } from "./ModernMacOSDesktop";

interface ModernDockProps {
  openApps: string[];
  activeApp: string | null;
  onAppClick: (appId: string) => void;
  lockedApps?: string[];
}

// Premium macOS-style app icons with authentic styling
const ModernAppIcon = ({ 
  id, 
  name, 
  isOpen, 
  isHovered, 
  scale,
  isLocked,
  isFeatured,
  onClick 
}: { 
  id: string; 
  name: string; 
  isOpen: boolean;
  isHovered: boolean;
  scale: number;
  isLocked: boolean;
  isFeatured: boolean;
  onClick: () => void;
}) => {
  const getIconContent = () => {
    switch (id) {
      case "finder":
        // Finder - Authentic blue smiling face
        return (
          <div 
            className="w-full h-full rounded-[22%] relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #6CB5F9 0%, #3B9CF4 50%, #1E7FE0 100%)",
              boxShadow: `
                0 4px 12px rgba(30,127,224,0.35),
                inset 0 1px 1px rgba(255,255,255,0.4),
                inset 0 -1px 2px rgba(0,0,0,0.1)
              `,
            }}
          >
            {/* Face */}
            <svg viewBox="0 0 48 48" className="w-full h-full">
              {/* Left eye */}
              <ellipse cx="17" cy="21" rx="4.5" ry="5.5" fill="#1a1a1a"/>
              {/* Right eye */}
              <ellipse cx="31" cy="21" rx="4.5" ry="5.5" fill="#1a1a1a"/>
              {/* Smile */}
              <path d="M14 30 Q24 40, 34 30" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        );
      
      case "aio":
        return (
          <div 
            className="w-full h-full rounded-[22%] relative overflow-hidden"
            style={{
              background: isLocked 
                ? "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)"
                : "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              boxShadow: `
                0 4px 12px ${isLocked ? "rgba(107,114,128,0.3)" : "rgba(109,40,217,0.35)"},
                inset 0 1px 1px rgba(255,255,255,0.3),
                inset 0 -1px 2px rgba(0,0,0,0.1)
              `,
            }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-full p-2">
              {/* Bar chart */}
              <rect x="6" y="28" width="7" height="14" rx="1.5" fill="rgba(255,255,255,0.9)"/>
              <rect x="16" y="20" width="7" height="22" rx="1.5" fill="rgba(255,255,255,0.9)"/>
              <rect x="26" y="10" width="7" height="32" rx="1.5" fill="rgba(255,255,255,0.95)"/>
              <rect x="36" y="24" width="7" height="18" rx="1.5" fill="rgba(255,255,255,0.85)"/>
              {/* Trend line */}
              <path d="M9 26 L19 18 L29 8 L40 20" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      
      case "whatwedo":
        // What We Do - PHARO System with three pillars
        return (
          <div 
            className="w-full h-full rounded-[22%] relative overflow-hidden"
            style={{
              background: isFeatured 
                ? "linear-gradient(135deg, #0D1117 0%, #161B22 50%, #21262D 100%)"
                : "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
              boxShadow: `
                0 4px 12px rgba(0,200,200,0.2),
                inset 0 1px 1px rgba(255,255,255,0.1),
                inset 0 -1px 2px rgba(0,0,0,0.2)
              `,
            }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-full p-2">
              {/* Three pillars: Light, Forge, Tower */}
              {/* Light bulb */}
              <circle cx="12" cy="14" r="5" fill="#00D4D4" opacity="0.8"/>
              <rect x="10" y="20" width="4" height="4" rx="0.5" fill="#00D4D4" opacity="0.6"/>
              {/* Forge/fountain */}
              <path d="M24 10 L24 18" stroke="#00D4D4" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
              <path d="M21 16 L24 10 L27 16" stroke="#00D4D4" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
              <rect x="20" y="20" width="8" height="4" rx="0.5" fill="#00D4D4" opacity="0.6"/>
              {/* Tower */}
              <path d="M36 8 L36 18" stroke="#00D4D4" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="36" cy="6" r="3" fill="#00D4D4" opacity="0.9"/>
              <rect x="33" y="20" width="6" height="4" rx="0.5" fill="#00D4D4" opacity="0.6"/>
              {/* Base platform */}
              <rect x="6" y="28" width="36" height="10" rx="2" fill="rgba(255,255,255,0.1)"/>
              <rect x="8" y="31" width="32" height="4" rx="1" fill="#00D4D4" opacity="0.4"/>
            </svg>
          </div>
        );
      
      case "faro":
        return (
          <div 
            className="w-full h-full rounded-[22%] relative overflow-hidden"
            style={{
              background: isFeatured 
                ? "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)"
                : isLocked 
                ? "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)"
                : "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
              boxShadow: `
                0 4px 12px ${isFeatured ? "rgba(0,200,200,0.2)" : isLocked ? "rgba(107,114,128,0.3)" : "rgba(245,158,11,0.35)"},
                inset 0 1px 1px rgba(255,255,255,0.4),
                inset 0 -1px 2px rgba(0,0,0,0.1)
              `,
            }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-full p-2">
              {/* P for Pharo */}
              <rect x="14" y="10" width="20" height="28" rx="2" fill="rgba(0,200,200,0.1)" stroke="#00D4D4" strokeWidth="1" opacity="0.5"/>
              <text x="24" y="30" textAnchor="middle" fill="#00D4D4" fontSize="20" fontWeight="300" fontFamily="Georgia, serif">P</text>
            </svg>
          </div>
        );
      
      case "equity":
        return (
          <div 
            className="w-full h-full rounded-[22%] relative overflow-hidden"
            style={{
              background: isFeatured 
                ? "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)"
                : isLocked 
                ? "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)"
                : "linear-gradient(135deg, #34D399 0%, #059669 100%)",
              boxShadow: `
                0 4px 12px ${isFeatured ? "rgba(0,200,200,0.2)" : isLocked ? "rgba(107,114,128,0.3)" : "rgba(5,150,105,0.35)"},
                inset 0 1px 1px rgba(255,255,255,0.35),
                inset 0 -1px 2px rgba(0,0,0,0.1)
              `,
            }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-full p-2.5">
              {/* Upward trend line */}
              <path d="M6 36 L14 28 L22 32 L34 14 L42 22" stroke={isFeatured ? "#00D4D4" : "white"} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Arrow head */}
              <path d="M32 14 L42 14 L42 24" stroke={isFeatured ? "#00D4D4" : "white"} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Data points */}
              <circle cx="6" cy="36" r="3" fill={isFeatured ? "#00D4D4" : "white"}/>
              <circle cx="14" cy="28" r="3" fill={isFeatured ? "#00D4D4" : "white"}/>
              <circle cx="22" cy="32" r="3" fill={isFeatured ? "#00D4D4" : "white"}/>
              <circle cx="34" cy="14" r="3.5" fill={isFeatured ? "#00D4D4" : "white"}/>
            </svg>
          </div>
        );
      
      case "about":
        return (
          <div 
            className="w-full h-full rounded-[22%] relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
              boxShadow: `
                0 4px 12px rgba(219,39,119,0.35),
                inset 0 1px 1px rgba(255,255,255,0.3),
                inset 0 -1px 2px rgba(0,0,0,0.1)
              `,
            }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-full p-2.5">
              {/* Book */}
              <rect x="8" y="6" width="32" height="36" rx="2" fill="white" opacity="0.95"/>
              <rect x="8" y="6" width="16" height="36" rx="2" fill="white"/>
              <rect x="22" y="6" width="2" height="36" fill="rgba(0,0,0,0.06)"/>
              {/* Info 'i' */}
              <circle cx="24" cy="18" r="2" fill="#DB2777"/>
              <rect x="22" y="23" width="4" height="12" rx="1" fill="#DB2777"/>
            </svg>
          </div>
        );
      
      case "contact":
        return (
          <div 
            className="w-full h-full rounded-[22%] relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
              boxShadow: `
                0 4px 12px rgba(2,132,199,0.35),
                inset 0 1px 1px rgba(255,255,255,0.4),
                inset 0 -1px 2px rgba(0,0,0,0.1)
              `,
            }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-full p-2.5">
              {/* Envelope body */}
              <rect x="4" y="14" width="40" height="26" rx="3" fill="white" opacity="0.95"/>
              {/* Envelope flap */}
              <path d="M4 17 L24 30 L44 17 L44 14 Q44 11 41 11 L7 11 Q4 11 4 14 Z" fill="white"/>
              <path d="M4 17 L24 30 L44 17" stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none"/>
            </svg>
          </div>
        );
      
      case "sapira-ai":
        // Featured Sapira AI icon with glow
        return (
          <div 
            className="w-full h-full rounded-[22%] relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #818CF8 0%, #6366F1 50%, #4F46E5 100%)",
              boxShadow: `
                0 4px 16px rgba(99,102,241,0.4),
                0 0 24px rgba(99,102,241,0.2),
                inset 0 1px 1px rgba(255,255,255,0.4),
                inset 0 -1px 2px rgba(0,0,0,0.1)
              `,
            }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-full p-2">
              {/* Atom/AI orbits */}
              <circle cx="24" cy="24" r="14" stroke="white" strokeWidth="1.5" fill="none" opacity="0.9"/>
              <ellipse cx="24" cy="24" rx="14" ry="6" stroke="white" strokeWidth="1.5" fill="none" transform="rotate(60 24 24)" opacity="0.8"/>
              <ellipse cx="24" cy="24" rx="14" ry="6" stroke="white" strokeWidth="1.5" fill="none" transform="rotate(-60 24 24)" opacity="0.8"/>
              {/* Core */}
              <circle cx="24" cy="24" r="4" fill="white"/>
              {/* Orbital nodes */}
              <circle cx="24" cy="10" r="2.5" fill="white"/>
              <circle cx="24" cy="38" r="2.5" fill="white"/>
              <circle cx="11" cy="31" r="2" fill="white" opacity="0.9"/>
              <circle cx="37" cy="17" r="2" fill="white" opacity="0.9"/>
            </svg>
            {/* Active indicator */}
            <div 
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{
                background: "#10B981",
                boxShadow: "0 0 6px #10B981",
              }}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.button
      className="relative flex items-center justify-center"
      style={{
        width: 52,
        height: 52,
        cursor: isLocked ? "not-allowed" : "pointer",
        opacity: isLocked ? 0.5 : 1,
      }}
      animate={{
        scale,
        y: scale > 1 ? -(scale - 1) * 28 : 0,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      onClick={isLocked ? undefined : onClick}
      whileTap={isLocked ? {} : { scale: 0.9 }}
    >
      {/* Featured glow effect */}
      {isFeatured && !isLocked && (
        <motion.div
          className="absolute inset-0 rounded-[22%]"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
            filter: "blur(6px)",
            transform: "scale(1.2)",
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Icon container */}
      <div 
        className="w-[44px] h-[44px] relative transition-all duration-150"
        style={{
          filter: isLocked 
            ? "saturate(0.3) brightness(0.9)"
            : isHovered 
              ? "brightness(1.05)" 
              : "brightness(1)",
          transform: isHovered && !isLocked ? "translateY(-1px)" : "translateY(0)",
        }}
      >
        {getIconContent()}
      </div>

      {/* Reflection shadow */}
      {isHovered && !isLocked && (
        <div 
          className="absolute -bottom-1 w-9 h-2 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
      )}

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
      )}

      {/* Open app indicator dot */}
      <motion.div
        className="absolute -bottom-1.5 w-[5px] h-[5px] rounded-full"
        style={{
          background: isFeatured ? "rgba(99,102,241,0.9)" : "rgba(0,0,0,0.6)",
          boxShadow: isFeatured ? "0 0 4px rgba(99,102,241,0.4)" : "none",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isOpen ? 1 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Featured badge (when not open) */}
      {isFeatured && !isOpen && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full z-30"
          style={{
            background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
            boxShadow: "0 0 6px rgba(16, 185, 129, 0.5)",
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
};

const dockApps = [
  { id: "finder", name: "Finder" },
  { id: "whatwedo", name: "What We Do", featured: true },
  { id: "faro", name: "Pharo Platform", featured: true },
  { id: "equity", name: "Equity", featured: true },
  { id: "about", name: "About Sapira" },
  { id: "contact", name: "Contact" },
  { id: "sapira-ai", name: "Sapira AI", featured: true },
];

export default function ModernDock({ 
  openApps, 
  activeApp, 
  onAppClick, 
  lockedApps = [] 
}: ModernDockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const liquidGlass = useLiquidGlassOptional();
  const isWebGLActive = !!liquidGlass?.isWebGLAvailable;
  
  // Theme integration
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Register dock as a liquid glass element
  const updateDockBounds = useCallback(() => {
    if (!liquidGlass || !dockRef.current) return;

    const rect = dockRef.current.getBoundingClientRect();
    liquidGlass.registerElement({
      id: "modern-dock",
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
      radius: 20,
      intensity: 1.4,
    });
  }, [liquidGlass]);

  useEffect(() => {
    if (!liquidGlass) return;

    const timer = setTimeout(updateDockBounds, 1100);
    const interval = setInterval(updateDockBounds, 500);

    const handleResize = () => {
      requestAnimationFrame(updateDockBounds);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      liquidGlass.unregisterElement("modern-dock");
    };
  }, [liquidGlass, updateDockBounds]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
    setHoveredApp(null);
  };

  const getIconScale = (index: number) => {
    if (mouseX === null) return 1;
    
    const iconWidth = 58;
    const iconCenter = 14 + (index + 0.5) * iconWidth;
    const distance = Math.abs(mouseX - iconCenter);
    const maxDistance = iconWidth * 2.2;
    
    if (distance > maxDistance) return 1;
    
    // Smooth cubic curve for magnification
    const normalizedDistance = distance / maxDistance;
    const scale = 1 + Math.pow(1 - normalizedDistance, 2.5) * 0.45;
    return Math.min(scale, 1.45);
  };

  return (
    <motion.div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[200]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Dock container with authentic macOS glass effect */}
      <div
        ref={dockRef}
        className="flex items-end gap-1 px-3.5 py-2 relative"
        style={{
          background: isWebGLActive 
            ? "transparent"
            : isLight
              ? "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.6) 100%)"
              : "linear-gradient(180deg, rgba(50,50,55,0.75) 0%, rgba(35,35,40,0.7) 100%)",
          backdropFilter: isWebGLActive ? "none" : "blur(50px) saturate(180%)",
          WebkitBackdropFilter: isWebGLActive ? "none" : "blur(50px) saturate(180%)",
          borderRadius: 18,
          border: isLight 
            ? "0.5px solid rgba(255,255,255,0.6)" 
            : "0.5px solid rgba(255,255,255,0.1)",
          boxShadow: isLight
            ? `
              0 0 0 0.5px rgba(0,0,0,0.06),
              0 20px 40px rgba(0,0,0,0.08),
              0 10px 20px rgba(0,0,0,0.05),
              0 5px 10px rgba(0,0,0,0.03),
              inset 0 1px 0 rgba(255,255,255,0.9),
              inset 0 -1px 0 rgba(0,0,0,0.02)
            `
            : `
              0 0 0 0.5px rgba(0,0,0,0.3),
              0 20px 40px rgba(0,0,0,0.4),
              0 10px 20px rgba(0,0,0,0.25),
              0 5px 10px rgba(0,0,0,0.15),
              inset 0 1px 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 rgba(0,0,0,0.1)
            `,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top glass highlight */}
        <div 
          className="absolute inset-x-3 top-0 h-px pointer-events-none"
          style={{
            background: isLight 
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.8) 70%, transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent)",
          }}
        />

        {dockApps.map((app, index) => {
          const scale = getIconScale(index);
          const isOpen = openApps.includes(app.id);
          const isHovered = hoveredApp === app.id;
          const isLocked = lockedApps.includes(app.id);
          const isFeatured = !!(app as { featured?: boolean }).featured;
          const showSeparator = app.id === "contact";
          
          return (
            <div key={app.id} className="flex items-end">
              <div
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
              >
                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute -top-10 px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none z-50"
                      style={{
                        background: "rgba(30,30,35,0.92)",
                        backdropFilter: "blur(16px)",
                        border: "0.5px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.15)",
                      }}
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                    >
                      <span className="text-white/95 text-[11px] font-medium">
                        {isLocked ? `${app.name} — Coming Soon` : app.name}
                      </span>
                      {/* Tooltip arrow */}
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                        style={{
                          background: "rgba(30,30,35,0.92)",
                          borderRight: "0.5px solid rgba(255,255,255,0.1)",
                          borderBottom: "0.5px solid rgba(255,255,255,0.1)",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <ModernAppIcon
                  id={app.id}
                  name={app.name}
                  isOpen={isOpen}
                  isHovered={isHovered}
                  scale={scale}
                  isLocked={isLocked}
                  isFeatured={isFeatured}
                  onClick={() => onAppClick(app.id)}
                />
              </div>

              {/* Separator before Sapira AI */}
              {showSeparator && (
                <div 
                  className="w-px h-9 mx-1.5 self-center"
                  style={{
                    background: isLight 
                      ? "linear-gradient(180deg, transparent, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent)"
                      : "linear-gradient(180deg, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Dock shadow/reflection */}
      <div 
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[85%] h-3 rounded-full"
        style={{
          background: isLight 
            ? "radial-gradient(ellipse, rgba(0,0,0,0.05) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)",
          filter: "blur(3px)",
        }}
      />
    </motion.div>
  );
}
