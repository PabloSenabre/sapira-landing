"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AppWindow } from "./MacOSDesktop";
import { useLiquidGlassOptional } from "./liquid-glass";

interface MacWindowProps {
  window: AppWindow;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  children: React.ReactNode;
}

export default function MacWindow({
  window,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  onDrag,
  children,
}: MacWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isHoveringTrafficLights, setIsHoveringTrafficLights] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState<{ position: { x: number; y: number }; size: { width: number; height: number } } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  
  // Liquid Glass integration
  const liquidGlass = useLiquidGlassOptional();
  const isWebGLActive = !!liquidGlass?.isWebGLAvailable;

  // Calculate title bar position for liquid glass registration
  const updateTitleBarBounds = useCallback(() => {
    if (!liquidGlass || !titleBarRef.current) return;

    const rect = titleBarRef.current.getBoundingClientRect();
    liquidGlass.registerElement({
      id: `window-titlebar-${window.id}`,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
      radius: isMaximized ? 0 : 10,
      intensity: isActive ? 1.0 : 0.6,
    });
  }, [liquidGlass, window.id, isMaximized, isActive]);

  // Register title bar on mount and update on window state changes
  useEffect(() => {
    if (!liquidGlass) return;

    const timer = setTimeout(updateTitleBarBounds, 50);

    const handleResize = () => {
      requestAnimationFrame(updateTitleBarBounds);
    };

    globalThis.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      globalThis.removeEventListener("resize", handleResize);
      liquidGlass.unregisterElement(`window-titlebar-${window.id}`);
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
      // Restore previous state
      setIsMaximized(false);
      if (preMaximizeState) {
        onDrag(preMaximizeState.position);
      }
    } else {
      // Save current state before maximizing
      setPreMaximizeState({
        position: window.position,
        size: window.size,
      });
      setIsMaximized(true);
      onDrag({ x: 8, y: 36 });
    }
  };

  // Fullscreen mode: almost full screen with small margins (8px on sides)
  const windowStyle = isMaximized
    ? {
        left: 8,
        top: 36,
        width: "calc(100vw - 16px)",
        height: "calc(100vh - 44px)",
      }
    : {
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
      };

  return (
    <motion.div
      ref={windowRef}
      className="fixed"
      style={{
        ...windowStyle,
        zIndex: window.zIndex,
        borderRadius: isMaximized ? 0 : 10,
      }}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseDown={() => onFocus()}
    >
      {/* Outer window shadow layer */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: isMaximized ? 0 : 10,
          boxShadow: isActive
            ? `
              0 22px 70px 4px rgba(0,0,0,0.56),
              0 0 0 0.5px rgba(0,0,0,0.5),
              0 0 0 1px rgba(255,255,255,0.08)
            `
            : `
              0 10px 30px 0 rgba(0,0,0,0.35),
              0 0 0 0.5px rgba(0,0,0,0.4),
              0 0 0 1px rgba(255,255,255,0.04)
            `,
        }}
      />

      {/* Window Frame */}
      <div
        className="relative flex flex-col h-full overflow-hidden"
        style={{
          background: isActive 
            ? "linear-gradient(180deg, rgba(40,40,43,0.98) 0%, rgba(28,28,30,0.99) 100%)"
            : "linear-gradient(180deg, rgba(50,50,53,0.95) 0%, rgba(38,38,40,0.96) 100%)",
          backdropFilter: "blur(60px) saturate(180%)",
          WebkitBackdropFilter: "blur(60px) saturate(180%)",
          borderRadius: isMaximized ? 0 : 10,
          border: isActive 
            ? "0.5px solid rgba(255,255,255,0.18)" 
            : "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Title Bar */}
        <div
          ref={titleBarRef}
          className="h-[52px] flex items-center px-4 relative cursor-move shrink-0"
          style={{
            background: isWebGLActive
              ? "transparent"
              : isActive
                ? "linear-gradient(180deg, rgba(56,56,60,0.9) 0%, rgba(44,44,47,0.8) 100%)"
                : "linear-gradient(180deg, rgba(65,65,68,0.85) 0%, rgba(52,52,55,0.75) 100%)",
            borderBottom: "0.5px solid rgba(0,0,0,0.35)",
            boxShadow: "inset 0 -0.5px 0 rgba(255,255,255,0.05)",
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Traffic Light Buttons - macOS Authentic */}
          <div 
            className="flex items-center gap-2 z-10 window-controls"
            onMouseEnter={() => setIsHoveringTrafficLights(true)}
            onMouseLeave={() => {
              setIsHoveringTrafficLights(false);
              setHoveredButton(null);
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              onMouseEnter={() => setHoveredButton("close")}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all duration-100"
              style={{
                background: isActive
                  ? "linear-gradient(180deg, #FF5F57 0%, #FF4136 100%)"
                  : "#4A4A4A",
                boxShadow: isActive
                  ? "inset 0 0 0 0.5px rgba(0,0,0,0.15), inset 0 -0.5px 1px rgba(148,30,30,0.3)"
                  : "inset 0 0 0 0.5px rgba(255,255,255,0.05)",
                border: isActive ? "0.5px solid rgba(215,80,73,0.6)" : "0.5px solid rgba(255,255,255,0.05)",
              }}
            >
              {isHoveringTrafficLights && (
                <svg className="w-[6px] h-[6px]" viewBox="0 0 12 12">
                  <path 
                    d="M3 3L9 9M9 3L3 9" 
                    stroke={isActive ? "rgba(77,0,0,0.9)" : "rgba(255,255,255,0.4)"} 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            {/* Minimize Button */}
            <button
              onClick={onMinimize}
              onMouseEnter={() => setHoveredButton("minimize")}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all duration-100"
              style={{
                background: isActive
                  ? "linear-gradient(180deg, #FEBC2E 0%, #F5A623 100%)"
                  : "#4A4A4A",
                boxShadow: isActive
                  ? "inset 0 0 0 0.5px rgba(0,0,0,0.15), inset 0 -0.5px 1px rgba(148,100,30,0.3)"
                  : "inset 0 0 0 0.5px rgba(255,255,255,0.05)",
                border: isActive ? "0.5px solid rgba(215,160,73,0.6)" : "0.5px solid rgba(255,255,255,0.05)",
              }}
            >
              {isHoveringTrafficLights && (
                <svg className="w-[8px] h-[8px]" viewBox="0 0 12 12">
                  <path 
                    d="M2 6H10" 
                    stroke={isActive ? "rgba(102,60,0,0.9)" : "rgba(255,255,255,0.4)"} 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            {/* Maximize Button */}
            <button
              onClick={handleMaximize}
              onMouseEnter={() => setHoveredButton("maximize")}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all duration-100"
              style={{
                background: isActive
                  ? "linear-gradient(180deg, #28C840 0%, #1AAB29 100%)"
                  : "#4A4A4A",
                boxShadow: isActive
                  ? "inset 0 0 0 0.5px rgba(0,0,0,0.15), inset 0 -0.5px 1px rgba(30,100,30,0.3)"
                  : "inset 0 0 0 0.5px rgba(255,255,255,0.05)",
                border: isActive ? "0.5px solid rgba(73,180,73,0.6)" : "0.5px solid rgba(255,255,255,0.05)",
              }}
            >
              {isHoveringTrafficLights && (
                <svg className="w-[6px] h-[6px]" viewBox="0 0 12 12">
                  {isMaximized ? (
                    // Restore icon - two overlapping squares
                    <>
                      <rect x="2" y="4" width="5" height="5" rx="0.5" stroke={isActive ? "rgba(0,77,0,0.9)" : "rgba(255,255,255,0.4)"} strokeWidth="1.2" fill="none"/>
                      <rect x="5" y="2" width="5" height="5" rx="0.5" stroke={isActive ? "rgba(0,77,0,0.9)" : "rgba(255,255,255,0.4)"} strokeWidth="1.2" fill="none"/>
                    </>
                  ) : (
                    // Fullscreen arrows
                    <>
                      <path d="M2.5 9.5L5 7" stroke={isActive ? "rgba(0,77,0,0.9)" : "rgba(255,255,255,0.4)"} strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M9.5 2.5L7 5" stroke={isActive ? "rgba(0,77,0,0.9)" : "rgba(255,255,255,0.4)"} strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M2 7.5V9.5H4" stroke={isActive ? "rgba(0,77,0,0.9)" : "rgba(255,255,255,0.4)"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M10 4.5V2.5H8" stroke={isActive ? "rgba(0,77,0,0.9)" : "rgba(255,255,255,0.4)"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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
                color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
                textShadow: "0 0.5px 0 rgba(0,0,0,0.2)",
              }}
            >
              {window.title}
            </span>
          </div>

          {/* Title bar subtle highlight */}
          <div 
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)",
            }}
          />
        </div>

        {/* Window Content */}
        <div 
          className="flex-1 overflow-hidden"
          style={{ 
            background: "rgba(30,30,32,1)",
            boxShadow: "inset 0 1px 0 rgba(0,0,0,0.15)",
          }}
        >
          {children}
        </div>

        {/* Bottom resize handle indicator */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.02)",
          }}
        />
      </div>
    </motion.div>
  );
}
