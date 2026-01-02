"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useLiquidGlassOptional } from "../liquid-glass";
import { useTheme } from "./ModernMacOSDesktop";

export interface ModernAppWindow {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface ModernWindowProps {
  window: ModernAppWindow;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  children: React.ReactNode;
}

export default function ModernWindow({
  window,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  onDrag,
  children,
}: ModernWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHoveringTrafficLights, setIsHoveringTrafficLights] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  
  // Theme integration
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // Liquid Glass integration
  const liquidGlass = useLiquidGlassOptional();
  const isWebGLActive = !!liquidGlass?.isWebGLAvailable;

  // Calculate title bar position for liquid glass registration
  const updateTitleBarBounds = useCallback(() => {
    if (!liquidGlass || !titleBarRef.current) return;

    const rect = titleBarRef.current.getBoundingClientRect();
    liquidGlass.registerElement({
      id: `modern-window-titlebar-${window.id}`,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
      radius: isMaximized ? 0 : 12,
      intensity: isActive ? 1.0 : 0.6,
    });
  }, [liquidGlass, window.id, isMaximized, isActive]);

  useEffect(() => {
    if (!liquidGlass) return;

    const timer = setTimeout(updateTitleBarBounds, 100);

    return () => {
      clearTimeout(timer);
      liquidGlass.unregisterElement(`modern-window-titlebar-${window.id}`);
    };
  }, [liquidGlass, updateTitleBarBounds, window.id]);

  useEffect(() => {
    if (liquidGlass) {
      requestAnimationFrame(updateTitleBarBounds);
    }
  }, [window.position, window.size, isMaximized, isActive, liquidGlass, updateTitleBarBounds]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
    
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = Math.max(0, e.clientX - dragOffset.x);
      const newY = Math.max(28, e.clientY - dragOffset.y);
      
      onDrag({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, onDrag]);

  const handleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
    } else {
      setIsMaximized(true);
      onDrag({ x: 0, y: 28 });
    }
  };

  const windowStyle = isMaximized
    ? {
        left: 0,
        top: 28,
        width: "100vw",
        height: "calc(100vh - 28px - 88px)",
      }
    : {
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
      };

  const borderRadius = isMaximized ? 0 : 12;

  return (
    <motion.div
      ref={windowRef}
      className="fixed"
      style={{
        ...windowStyle,
        zIndex: window.zIndex,
        borderRadius,
      }}
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 12 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onMouseDown={() => onFocus()}
    >
      {/* Outer shadow layer for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius,
          boxShadow: isActive
            ? isLight
              ? `
                0 25px 50px -12px rgba(0, 0, 0, 0.15),
                0 12px 24px -8px rgba(0, 0, 0, 0.1),
                0 8px 16px -6px rgba(0, 0, 0, 0.08),
                0 4px 8px -4px rgba(0, 0, 0, 0.06),
                0 0 0 0.5px rgba(0, 0, 0, 0.08)
              `
              : `
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 12px 24px -8px rgba(0, 0, 0, 0.35),
                0 8px 16px -6px rgba(0, 0, 0, 0.25),
                0 4px 8px -4px rgba(0, 0, 0, 0.2),
                0 0 0 0.5px rgba(255, 255, 255, 0.08)
              `
            : isLight
              ? `
                0 10px 25px -5px rgba(0, 0, 0, 0.08),
                0 6px 12px -4px rgba(0, 0, 0, 0.05),
                0 0 0 0.5px rgba(0, 0, 0, 0.04)
              `
              : `
                0 10px 25px -5px rgba(0, 0, 0, 0.35),
                0 6px 12px -4px rgba(0, 0, 0, 0.25),
                0 0 0 0.5px rgba(255, 255, 255, 0.05)
              `,
        }}
      />

      {/* Window Frame */}
      <div
        className="relative flex flex-col h-full overflow-hidden"
        style={{
          background: isActive 
            ? isLight
              ? "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(252,252,253,0.99) 100%)"
              : "linear-gradient(180deg, rgba(45,45,50,0.98) 0%, rgba(35,35,40,0.99) 100%)"
            : isLight
              ? "linear-gradient(180deg, rgba(250,250,251,0.95) 0%, rgba(248,248,249,0.96) 100%)"
              : "linear-gradient(180deg, rgba(40,40,45,0.92) 0%, rgba(30,30,35,0.94) 100%)",
          backdropFilter: "blur(80px) saturate(180%)",
          WebkitBackdropFilter: "blur(80px) saturate(180%)",
          borderRadius,
          border: isActive 
            ? isLight ? "0.5px solid rgba(0,0,0,0.12)" : "0.5px solid rgba(255,255,255,0.12)"
            : isLight ? "0.5px solid rgba(0,0,0,0.06)" : "0.5px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Top highlight line */}
        {!isMaximized && (
          <div 
            className="absolute top-0 left-3 right-3 h-px pointer-events-none"
            style={{
              background: isActive
                ? isLight 
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.9) 70%, transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent)"
                : isLight
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 50%, transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 50%, transparent)",
            }}
          />
        )}

        {/* Title Bar */}
        <div
          ref={titleBarRef}
          className="h-[52px] flex items-center px-[14px] relative cursor-move shrink-0"
          style={{
            background: isWebGLActive
              ? "transparent"
              : isActive
                ? isLight
                  ? "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,248,250,0.98) 100%)"
                  : "linear-gradient(180deg, rgba(55,55,60,1) 0%, rgba(45,45,50,0.98) 100%)"
                : isLight
                  ? "linear-gradient(180deg, rgba(252,252,253,0.96) 0%, rgba(246,246,248,0.94) 100%)"
                  : "linear-gradient(180deg, rgba(50,50,55,0.96) 0%, rgba(40,40,45,0.94) 100%)",
            borderBottom: isLight ? "0.5px solid rgba(0,0,0,0.06)" : "0.5px solid rgba(255,255,255,0.06)",
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Traffic Light Buttons - macOS Authentic */}
          <div 
            className="flex items-center gap-2 z-10 window-controls"
            onMouseEnter={() => setIsHoveringTrafficLights(true)}
            onMouseLeave={() => setIsHoveringTrafficLights(false)}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all duration-100"
              style={{
                background: isActive
                  ? "linear-gradient(180deg, #FF5F57 0%, #E64940 100%)"
                  : "#D4D4D8",
                boxShadow: isActive
                  ? "inset 0 0 0 0.5px rgba(0,0,0,0.08), inset 0 -0.5px 0.5px rgba(0,0,0,0.15)"
                  : "inset 0 0 0 0.5px rgba(0,0,0,0.06)",
                border: isActive ? "0.5px solid rgba(185,65,60,0.5)" : "none",
              }}
            >
              {isHoveringTrafficLights && (
                <svg className="w-[6px] h-[6px]" viewBox="0 0 12 12">
                  <path 
                    d="M3 3L9 9M9 3L3 9" 
                    stroke={isActive ? "rgba(77,0,0,0.85)" : "rgba(0,0,0,0.4)"} 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            {/* Minimize Button */}
            <button
              onClick={onMinimize}
              className="w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all duration-100"
              style={{
                background: isActive
                  ? "linear-gradient(180deg, #FEBC2E 0%, #E5A620 100%)"
                  : "#D4D4D8",
                boxShadow: isActive
                  ? "inset 0 0 0 0.5px rgba(0,0,0,0.08), inset 0 -0.5px 0.5px rgba(0,0,0,0.15)"
                  : "inset 0 0 0 0.5px rgba(0,0,0,0.06)",
                border: isActive ? "0.5px solid rgba(190,135,40,0.5)" : "none",
              }}
            >
              {isHoveringTrafficLights && (
                <svg className="w-[8px] h-[8px]" viewBox="0 0 12 12">
                  <path 
                    d="M2 6H10" 
                    stroke={isActive ? "rgba(102,60,0,0.85)" : "rgba(0,0,0,0.4)"} 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            {/* Maximize Button */}
            <button
              onClick={handleMaximize}
              className="w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all duration-100"
              style={{
                background: isActive
                  ? "linear-gradient(180deg, #28C840 0%, #1AAB29 100%)"
                  : "#D4D4D8",
                boxShadow: isActive
                  ? "inset 0 0 0 0.5px rgba(0,0,0,0.08), inset 0 -0.5px 0.5px rgba(0,0,0,0.15)"
                  : "inset 0 0 0 0.5px rgba(0,0,0,0.06)",
                border: isActive ? "0.5px solid rgba(30,140,50,0.5)" : "none",
              }}
            >
              {isHoveringTrafficLights && (
                <svg className="w-[6px] h-[6px]" viewBox="0 0 12 12">
                  {isMaximized ? (
                    // Restore icon
                    <>
                      <rect x="2" y="4" width="5" height="5" rx="0.5" stroke={isActive ? "rgba(0,77,0,0.85)" : "rgba(0,0,0,0.4)"} strokeWidth="1.2" fill="none"/>
                      <rect x="5" y="2" width="5" height="5" rx="0.5" stroke={isActive ? "rgba(0,77,0,0.85)" : "rgba(0,0,0,0.4)"} strokeWidth="1.2" fill="none"/>
                    </>
                  ) : (
                    // Fullscreen arrows
                    <>
                      <path d="M2.5 9.5L5 7" stroke={isActive ? "rgba(0,77,0,0.85)" : "rgba(0,0,0,0.4)"} strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M9.5 2.5L7 5" stroke={isActive ? "rgba(0,77,0,0.85)" : "rgba(0,0,0,0.4)"} strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M2 7.5V9.5H4" stroke={isActive ? "rgba(0,77,0,0.85)" : "rgba(0,0,0,0.4)"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M10 4.5V2.5H8" stroke={isActive ? "rgba(0,77,0,0.85)" : "rgba(0,0,0,0.4)"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </>
                  )}
                </svg>
              )}
            </button>
          </div>

          {/* Window Title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span 
              className="text-[13px] font-medium tracking-[-0.01em]"
              style={{
                color: isActive 
                  ? isLight ? "rgba(0,0,0,0.88)" : "rgba(255,255,255,0.92)" 
                  : isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.4)",
              }}
            >
              {window.title}
            </span>
          </div>

          {/* Title bar bottom separator shadow */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: isLight
                ? "linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.04) 70%, transparent 95%)"
                : "linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.2) 70%, transparent 95%)",
            }}
          />
        </div>

        {/* Window Content */}
        <div 
          className="flex-1 overflow-hidden relative" 
          style={{ 
            background: isLight ? "#ffffff" : "#1a1a1c",
          }}
        >
          {/* Content top inner shadow for depth */}
          <div 
            className="absolute top-0 left-0 right-0 h-4 pointer-events-none z-10"
            style={{
              background: isLight 
                ? "linear-gradient(180deg, rgba(0,0,0,0.015) 0%, transparent 100%)"
                : "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 100%)",
            }}
          />
          {children}
        </div>

        {/* Bottom border highlight */}
        {!isMaximized && (
          <div 
            className="absolute bottom-0 left-4 right-4 h-px pointer-events-none"
            style={{
              background: isLight 
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 50%, transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 50%, transparent)",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
