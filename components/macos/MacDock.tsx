"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLiquidGlassOptional } from "./liquid-glass";
import Image from "next/image";

interface MacDockProps {
  openApps: string[];
  activeApp: string | null;
  onAppClick: (appId: string) => void;
}

// Authentic macOS-style app icons with enhanced visuals
const AppIcon = ({ 
  id, 
  name,
  iconUrl, 
  isOpen, 
  isHovered, 
  scale,
  onClick 
}: { 
  id: string; 
  name: string;
  iconUrl?: string; 
  isOpen: boolean;
  isHovered: boolean;
  scale: number;
  onClick: () => void;
}) => {
  const [imgError, setImgError] = useState(false);

  // Use real icon if available
  if (iconUrl && !imgError) {
    return (
      <motion.button
        className="relative flex items-center justify-center"
        style={{ 
          width: 50, 
          height: 50,
          transform: `scale(${scale}) translateY(${scale > 1 ? -(scale - 1) * 16 : 0}px)`,
          transition: "transform 0.15s ease-out",
        }}
        onClick={onClick}
      >
        <div
          className="w-[44px] h-[44px] rounded-[22%] overflow-hidden relative"
          style={{
            boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
          }}
        >
          <Image
            src={iconUrl}
            alt={name}
            fill
            className="object-contain"
            unoptimized
            priority
            onError={() => setImgError(true)}
          />
        </div>
        <motion.div
          className="absolute -bottom-2 w-[5px] h-[5px] rounded-full"
          style={{
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 0 4px rgba(255,255,255,0.6)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </motion.button>
    );
  }

  const getIconContent = () => {
    switch (id) {
      case "finder":
        // Finder - Real macOS Finder icon (two-tone face with smile)
        return (
          <div 
            className="w-full h-full rounded-[22%] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #3CCDFE 0%, #2BBAFC 30%, #23A8F6 70%, #1B96EE 100%)",
              boxShadow: `
                inset 0 2px 2px rgba(255,255,255,0.35),
                inset 0 -2px 3px rgba(0,0,0,0.15),
                0 4px 12px rgba(0,0,0,0.35)
              `,
            }}
          >
            {/* Real Finder happy face */}
            <svg viewBox="0 0 60 60" className="w-9 h-9">
              {/* Face background/outline */}
              <rect x="8" y="5" width="44" height="50" rx="6" fill="none" stroke="white" strokeWidth="3.5"/>
              {/* Left eye (round) */}
              <circle cx="22" cy="24" r="4" fill="white"/>
              <circle cx="22" cy="24" r="2" fill="#1B96EE"/>
              {/* Right eye (round) */}
              <circle cx="38" cy="24" r="4" fill="white"/>
              <circle cx="38" cy="24" r="2" fill="#1B96EE"/>
              {/* Nose - vertical line */}
              <line x1="30" y1="26" x2="30" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              {/* Smile */}
              <path d="M18 42 Q30 52 42 42" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        );
      case "whatwedo":
        // What We Do - PHARO System icon with light/forge/tower symbols
        return (
          <div 
            className="w-full h-full rounded-[22%] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0D1117 0%, #161B22 50%, #21262D 100%)",
              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.1),
                inset 0 -1px 2px rgba(0,0,0,0.2),
                0 2px 8px rgba(0,0,0,0.3)
              `,
            }}
          >
            <svg viewBox="0 0 32 32" className="w-6 h-6">
              {/* Three pillars representing LIGHT, FORGE, TOWER */}
              {/* Light bulb */}
              <circle cx="8" cy="10" r="4" fill="#00D4D4" opacity="0.8"/>
              <rect x="6" y="14" width="4" height="3" rx="0.5" fill="#00D4D4" opacity="0.6"/>
              {/* Forge/fountain */}
              <path d="M16 8 L16 14" stroke="#00D4D4" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
              <path d="M14 12 L16 8 L18 12" stroke="#00D4D4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
              <rect x="13" y="14" width="6" height="3" rx="0.5" fill="#00D4D4" opacity="0.6"/>
              {/* Tower */}
              <path d="M24 6 L24 14" stroke="#00D4D4" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="24" cy="5" r="2" fill="#00D4D4" opacity="0.9"/>
              <rect x="22" y="14" width="4" height="3" rx="0.5" fill="#00D4D4" opacity="0.6"/>
              {/* Base platform */}
              <rect x="4" y="20" width="24" height="6" rx="1.5" fill="white" opacity="0.15"/>
              <rect x="6" y="22" width="20" height="2" rx="0.5" fill="#00D4D4" opacity="0.4"/>
            </svg>
          </div>
        );
      case "aio":
        // AIO Platform - Dashboard/Analytics icon
        return (
          <div 
            className="w-full h-full rounded-[22%] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.15),
                inset 0 -1px 2px rgba(0,0,0,0.2),
                0 2px 8px rgba(0,0,0,0.3)
              `,
            }}
          >
            <svg viewBox="0 0 32 32" className="w-6 h-6">
              {/* Bar chart */}
              <rect x="4" y="18" width="5" height="10" rx="1" fill="#4FD1C5"/>
              <rect x="11" y="12" width="5" height="16" rx="1" fill="#63B3ED"/>
              <rect x="18" y="6" width="5" height="22" rx="1" fill="#B794F4"/>
              <rect x="25" y="14" width="5" height="14" rx="1" fill="#F687B3"/>
              {/* Trend line */}
              <path d="M6 16 L13 10 L20 4 L28 12" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
              <circle cx="6" cy="16" r="1.5" fill="white"/>
              <circle cx="20" cy="4" r="1.5" fill="white"/>
            </svg>
          </div>
        );
      case "faro":
        // Faro Analytics - Lighthouse/Beacon icon
        return (
          <div 
            className="w-full h-full rounded-[22%] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.25),
                inset 0 -1px 2px rgba(0,0,0,0.15),
                0 2px 8px rgba(0,0,0,0.3)
              `,
            }}
          >
            <svg viewBox="0 0 32 32" className="w-6 h-6">
              {/* Lighthouse beacon */}
              <circle cx="16" cy="10" r="5" fill="white" opacity="0.95"/>
              <circle cx="16" cy="10" r="2.5" fill="#FFD93D"/>
              {/* Light rays */}
              <path d="M16 3 L16 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <path d="M10 6 L8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <path d="M22 6 L24 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <path d="M7 10 L4 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <path d="M25 10 L28 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              {/* Tower */}
              <path d="M13 15 L11 28 L21 28 L19 15 Z" fill="white" opacity="0.9"/>
              <rect x="14" y="20" width="4" height="4" rx="0.5" fill="#667EEA"/>
            </svg>
          </div>
        );
      case "equity":
        // Equity - Stock/Investment icon
        return (
          <div 
            className="w-full h-full rounded-[22%] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #11998E 0%, #38EF7D 100%)",
              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.25),
                inset 0 -1px 2px rgba(0,0,0,0.15),
                0 2px 8px rgba(0,0,0,0.3)
              `,
            }}
          >
            <svg viewBox="0 0 32 32" className="w-6 h-6">
              {/* Chart line going up */}
              <path d="M4 24 L10 18 L16 20 L26 6" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Arrow */}
              <path d="M22 6 L26 6 L26 10" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Dollar sign */}
              <circle cx="20" cy="22" r="6" fill="white" opacity="0.9"/>
              <text x="20" y="25" textAnchor="middle" fill="#11998E" fontSize="8" fontWeight="bold">$</text>
            </svg>
          </div>
        );
      case "about":
        // About - Apple Books icon (orange gradient with open book)
        return (
          <div 
            className="w-full h-full rounded-[22%] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #FFB347 0%, #FF9933 30%, #FF7B1C 70%, #E85D04 100%)",
              boxShadow: `
                inset 0 2px 2px rgba(255,255,255,0.3),
                inset 0 -2px 3px rgba(0,0,0,0.15),
                0 4px 12px rgba(0,0,0,0.35)
              `,
            }}
          >
            <svg viewBox="0 0 60 60" className="w-8 h-8">
              {/* Open book */}
              {/* Left page */}
              <path d="M30 12 L30 50 C24 48 14 46 8 48 L8 14 C14 12 24 10 30 12 Z" fill="white"/>
              {/* Right page */}
              <path d="M30 12 L30 50 C36 48 46 46 52 48 L52 14 C46 12 36 10 30 12 Z" fill="#FFF5E6"/>
              {/* Page lines left */}
              <line x1="14" y1="22" x2="26" y2="20" stroke="#E85D04" strokeWidth="1" opacity="0.4"/>
              <line x1="14" y1="28" x2="26" y2="26" stroke="#E85D04" strokeWidth="1" opacity="0.4"/>
              <line x1="14" y1="34" x2="26" y2="32" stroke="#E85D04" strokeWidth="1" opacity="0.4"/>
              {/* Page lines right */}
              <line x1="34" y1="20" x2="46" y2="22" stroke="#E85D04" strokeWidth="1" opacity="0.3"/>
              <line x1="34" y1="26" x2="46" y2="28" stroke="#E85D04" strokeWidth="1" opacity="0.3"/>
              <line x1="34" y1="32" x2="46" y2="34" stroke="#E85D04" strokeWidth="1" opacity="0.3"/>
              {/* Spine shadow */}
              <line x1="30" y1="12" x2="30" y2="50" stroke="#E0A050" strokeWidth="2"/>
            </svg>
          </div>
        );
      case "contact":
        // Contact - Apple Mail icon (blue gradient with white envelope)
        return (
          <div 
            className="w-full h-full rounded-[22%] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #5CC8FA 0%, #3CA8E8 30%, #2196E8 70%, #1A7CD6 100%)",
              boxShadow: `
                inset 0 2px 2px rgba(255,255,255,0.3),
                inset 0 -2px 3px rgba(0,0,0,0.15),
                0 4px 12px rgba(0,0,0,0.35)
              `,
            }}
          >
            <svg viewBox="0 0 60 60" className="w-8 h-8">
              {/* Envelope body */}
              <rect x="6" y="16" width="48" height="32" rx="4" fill="white"/>
              {/* Envelope flap - the V shape */}
              <path d="M6 18 L30 36 L54 18" fill="none" stroke="#1A7CD6" strokeWidth="2" strokeLinejoin="round"/>
              {/* Bottom fold lines */}
              <path d="M6 46 L22 32" stroke="#B0D4F1" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M54 46 L38 32" stroke="#B0D4F1" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        );
      case "sapira-ai":
        // Sapira AI - Sapira logo (dark with elegant typography)
        return (
          <div 
            className="w-full h-full rounded-[22%] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #1a1a1f 0%, #252530 40%, #1f1f25 100%)",
              boxShadow: `
                inset 0 2px 2px rgba(255,255,255,0.08),
                inset 0 -2px 3px rgba(0,0,0,0.3),
                0 4px 12px rgba(0,0,0,0.4)
              `,
            }}
          >
            {/* Sapira text logo */}
            <span 
              style={{
                fontFamily: "'Times New Roman', 'Georgia', serif",
                fontSize: 14,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "rgba(255,255,255,0.95)",
                textShadow: "0 1px 4px rgba(255,255,255,0.15)",
              }}
            >
              Sapira
            </span>
            {/* Subtle shine overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(165deg, rgba(255,255,255,0.12) 0%, transparent 40%)",
              }}
            />
            {/* AI indicator dot */}
            <div 
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
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
        width: 50,
        height: 50,
        transform: `scale(${scale}) translateY(${scale > 1 ? -(scale - 1) * 16 : 0}px)`,
        transition: "transform 0.15s ease-out",
      }}
      onClick={onClick}
    >
      {/* App Icon Container */}
      <div className="w-[44px] h-[44px] rounded-[22%]">
        {getIconContent()}
      </div>


      {/* Open indicator dot */}
      <motion.div
        className="absolute -bottom-2 w-[5px] h-[5px] rounded-full"
        style={{
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 0 4px rgba(255,255,255,0.6)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isOpen ? 1 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
    </motion.button>
  );
};

const dockApps = [
  { 
    id: "finder", 
    name: "Finder", 
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png"
  },
  { id: "whatwedo", name: "What We Do" },
  { id: "faro", name: "Pharo Platform" },
  { id: "equity", name: "Equity" },
  { 
    id: "about", 
    name: "About Sapira",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Apple_Books_icon.svg"
  },
  { 
    id: "contact", 
    name: "Contact",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg"
  },
  { id: "sapira-ai", name: "Sapira AI" },
];

export default function MacDock({ openApps, activeApp, onAppClick }: MacDockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const liquidGlass = useLiquidGlassOptional();
  const isWebGLActive = !!liquidGlass?.isWebGLAvailable;

  // Register dock as a liquid glass element
  const updateDockBounds = useCallback(() => {
    if (!liquidGlass || !dockRef.current) return;

    const rect = dockRef.current.getBoundingClientRect();
    liquidGlass.registerElement({
      id: "macdock",
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

    const timer = setTimeout(updateDockBounds, 100);

    const handleResize = () => {
      requestAnimationFrame(updateDockBounds);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      liquidGlass.unregisterElement("macdock");
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
    
    const iconWidth = 56;
    const gap = 4;
    const totalWidth = iconWidth + gap;
    const iconCenter = 14 + (index + 0.5) * totalWidth;
    const distance = Math.abs(mouseX - iconCenter);
    const maxDistance = totalWidth * 1.8; // Reduced influence radius
    
    if (distance > maxDistance) return 1;
    
    // Gentler cubic easing - max scale reduced to 1.2 (20% increase)
    const progress = 1 - (distance / maxDistance);
    const scale = 1 + (progress * progress) * 0.2;
    return Math.min(scale, 1.2);
  };

  return (
    <motion.div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[200]"
      initial={{ y: 120, opacity: 0 }}
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
            : "linear-gradient(180deg, rgba(55,55,60,0.7) 0%, rgba(40,40,45,0.8) 100%)",
          backdropFilter: isWebGLActive ? "none" : "blur(40px) saturate(150%)",
          WebkitBackdropFilter: isWebGLActive ? "none" : "blur(40px) saturate(150%)",
          borderRadius: 16,
          border: "0.5px solid rgba(255,255,255,0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 0.5px 0 rgba(255,255,255,0.1)",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {dockApps.map((app, index) => {
          const scale = getIconScale(index);
          const isOpen = openApps.includes(app.id);
          const isHovered = hoveredApp === app.id;
          const showDivider = app.id === "contact"; // Divider before Sapira AI
          
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
                      className="absolute -top-10 px-3 py-1.5 rounded-md whitespace-nowrap pointer-events-none"
                      style={{
                        background: "rgba(30,30,32,0.95)",
                        backdropFilter: "blur(12px)",
                        border: "0.5px solid rgba(255,255,255,0.15)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(0,0,0,0.3)",
                      }}
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                    >
                      <span className="text-white/95 text-xs font-medium">{app.name}</span>
                      {/* Tooltip arrow */}
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                        style={{
                          background: "rgba(30,30,32,0.95)",
                          borderRight: "0.5px solid rgba(255,255,255,0.15)",
                          borderBottom: "0.5px solid rgba(255,255,255,0.15)",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AppIcon
                  id={app.id}
                  name={app.name}
                  iconUrl={app.iconUrl}
                  isOpen={isOpen}
                  isHovered={isHovered}
                  scale={scale}
                  onClick={() => onAppClick(app.id)}
                />
              </div>

              {/* Separator before Sapira AI */}
              {showDivider && (
                <div 
                  className="w-[1px] h-10 mx-2 self-center"
                  style={{
                    background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
