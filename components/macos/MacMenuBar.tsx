"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLiquidGlassOptional } from "./liquid-glass";

interface MacMenuBarProps {
  activeApp: string;
  onNavigate?: (section: string) => void;
  theme?: "light" | "dark";
}

// Sapira Logo Icon - miniature dark rectangle with "Sapira" text (matches dock/desktop icon)
const SapiraMenuIcon = () => (
  <div 
    className="flex items-center justify-center rounded-[4px] overflow-hidden"
    style={{
      width: 38,
      height: 16,
      background: "linear-gradient(145deg, #1a1a1f 0%, #252530 40%, #1f1f25 100%)",
      boxShadow: "inset 0 0.5px 0.5px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.2)",
    }}
  >
    <span 
      className="select-none"
      style={{
        fontFamily: "'Times New Roman', 'Georgia', serif",
        fontSize: 9,
        fontWeight: 300,
        letterSpacing: "-0.01em",
        color: "rgba(255,255,255,0.92)",
      }}
    >
      Sapira
    </span>
  </div>
);

export default function MacMenuBar({ activeApp, onNavigate, theme = "light" }: MacMenuBarProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter();
  
  const isLight = theme === "light";
  
  // Liquid Glass integration
  const menuRef = useRef<HTMLDivElement>(null);
  const liquidGlass = useLiquidGlassOptional();

  // Register menu bar as a liquid glass element
  const updateMenuBarBounds = useCallback(() => {
    if (!liquidGlass || !menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    liquidGlass.registerElement({
      id: "mac-menubar",
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
      radius: 0,
      intensity: 0.8,
    });
  }, [liquidGlass]);

  useEffect(() => {
    if (!liquidGlass) return;

    const timer = setTimeout(updateMenuBarBounds, 150);

    const handleResize = () => {
      requestAnimationFrame(updateMenuBarBounds);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      liquidGlass.unregisterElement("mac-menubar");
    };
  }, [liquidGlass, updateMenuBarBounds]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Color definitions based on theme
  const colors = {
    text: isLight ? "#1d1d1f" : "rgba(255,255,255,0.92)",
    textSecondary: isLight ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)",
    hoverBg: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)",
    icon: isLight ? "#1d1d1f" : "rgba(255,255,255,0.88)",
    iconSecondary: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.6)",
  };

  const menuItems = [
    { id: "finder", label: "Finder" },
    { id: "sapira-ai", label: "Sapira AI", featured: true },
    { id: "contact", label: "Contact" },
  ];

  const getItemStyle = (id: string) => ({
    background: hoveredItem === id ? colors.hoverBg : "transparent",
    borderRadius: "4px",
  });

  return (
    <motion.div
      ref={menuRef}
      className="fixed top-0 left-0 right-0 h-[26px] z-[300] flex items-center justify-between px-1"
      style={{
        background: isLight
          ? "rgba(255, 255, 255, 0.72)"
          : "rgba(28, 28, 30, 0.78)",
        backdropFilter: "blur(50px) saturate(180%)",
        WebkitBackdropFilter: "blur(50px) saturate(180%)",
        borderBottom: isLight 
          ? "0.5px solid rgba(0,0,0,0.1)" 
          : "0.5px solid rgba(255,255,255,0.08)",
        boxShadow: isLight 
          ? "inset 0 0.5px 0 rgba(255,255,255,0.9), 0 0.5px 1px rgba(0,0,0,0.03)"
          : "inset 0 0.5px 0 rgba(255,255,255,0.04)",
      }}
      initial={{ y: -26, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left side - Sapira Logo, App Name, Menu Items */}
      <div className="flex items-center h-full gap-px">
        {/* Sapira Logo - Click to go home */}
        <motion.button 
          className="h-[22px] px-2.5 mx-0.5 flex items-center justify-center transition-all duration-150 cursor-pointer"
          style={getItemStyle("sapira")}
          onMouseEnter={() => setHoveredItem("sapira")}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => router.push("/")}
          whileTap={{ scale: 0.97 }}
          title="Go to Home"
        >
          <SapiraMenuIcon />
        </motion.button>

        {/* Active App Name (Bold) */}
        <motion.button
          className="h-[22px] px-2 mx-0.5 flex items-center transition-all duration-150"
          style={getItemStyle("appname")}
          onMouseEnter={() => setHoveredItem("appname")}
          onMouseLeave={() => setHoveredItem(null)}
          whileTap={{ scale: 0.97 }}
        >
          <span 
            className="text-[13px] font-semibold leading-none"
            style={{ 
              color: colors.text,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
            }}
          >
            {activeApp}
          </span>
        </motion.button>

        {/* Menu Items */}
        <div className="flex items-center h-full gap-px">
          {menuItems.map((section) => (
            <motion.button
              key={section.id}
              className="h-[22px] px-2 mx-0.5 flex items-center transition-all duration-150 relative"
              style={getItemStyle(section.id)}
              onMouseEnter={() => setHoveredItem(section.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => onNavigate?.(section.id)}
              whileTap={{ scale: 0.97 }}
            >
              <span 
                className="text-[13px] leading-none"
                style={{ 
                  color: section.featured 
                    ? "#6366F1"
                    : colors.text,
                  fontWeight: section.featured ? 600 : 400,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
                }}
              >
                {section.label}
              </span>
              {section.featured && (
                <motion.span 
                  className="absolute -top-0.5 -right-0.5 w-[5px] h-[5px] rounded-full"
                  style={{
                    background: "#10B981",
                    boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)",
                  }}
                  animate={{ 
                    scale: [1, 1.15, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right side - System Status Icons */}
      <div className="flex items-center h-full">
        {/* Battery - macOS Sequoia authentic */}
        <button 
          className="h-[22px] w-[30px] mx-0.5 flex items-center justify-center transition-all duration-150 rounded"
          style={getItemStyle("battery")}
          onMouseEnter={() => setHoveredItem("battery")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <svg className="w-[22px] h-[10px]" viewBox="0 0 27 11" fill="none">
            {/* Battery body - rounded rectangle outline */}
            <rect 
              x="0.5" y="0.5" 
              width="22" height="10" 
              rx="2.5" 
              stroke={colors.iconSecondary} 
              strokeWidth="1"
              fill="none"
            />
            {/* Battery fill - ~75% charge */}
            <rect 
              x="2" y="2" 
              width="16" height="7" 
              rx="1.5" 
              fill={colors.iconSecondary}
            />
            {/* Battery cap/nub */}
            <path 
              d="M24 3.5C25.1 3.5 26 4.4 26 5.5C26 6.6 25.1 7.5 24 7.5V3.5Z" 
              fill={colors.iconSecondary}
            />
          </svg>
        </button>

        {/* WiFi - macOS Sequoia authentic (filled sector style) */}
        <button 
          className="h-[22px] w-[20px] mx-0.5 flex items-center justify-center transition-all duration-150 rounded"
          style={getItemStyle("wifi")}
          onMouseEnter={() => setHoveredItem("wifi")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <svg className="w-[15px] h-[11px]" viewBox="0 0 16 12" fill="none">
            {/* Filled WiFi fan shape - macOS Sequoia style */}
            <path 
              d="M8 11.5C8.69 11.5 9.25 10.94 9.25 10.25C9.25 9.56 8.69 9 8 9C7.31 9 6.75 9.56 6.75 10.25C6.75 10.94 7.31 11.5 8 11.5Z" 
              fill={colors.icon}
            />
            <path 
              d="M4.46 7.46C5.4 6.52 6.65 6 8 6C9.35 6 10.6 6.52 11.54 7.46" 
              stroke={colors.icon} 
              strokeWidth="1.6" 
              strokeLinecap="round"
            />
            <path 
              d="M1.76 4.76C3.42 3.1 5.62 2.15 8 2.15C10.38 2.15 12.58 3.1 14.24 4.76" 
              stroke={colors.icon} 
              strokeWidth="1.6" 
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Spotlight Search - macOS authentic magnifying glass */}
        <button 
          className="h-[22px] w-[20px] mx-0.5 flex items-center justify-center transition-all duration-150 rounded"
          style={getItemStyle("spotlight")}
          onMouseEnter={() => setHoveredItem("spotlight")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <svg 
            className="w-[13px] h-[13px]" 
            viewBox="0 0 16 16" 
            fill="none"
          >
            <circle 
              cx="6.5" cy="6.5" r="5" 
              stroke={colors.icon} 
              strokeWidth="1.5"
            />
            <path 
              d="M10.5 10.5L14.5 14.5" 
              stroke={colors.icon} 
              strokeWidth="1.8" 
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Control Center - macOS Sequoia style (two toggles) */}
        <button 
          className="h-[22px] w-[22px] mx-0.5 flex items-center justify-center transition-all duration-150 rounded"
          style={getItemStyle("control")}
          onMouseEnter={() => setHoveredItem("control")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <svg 
            className="w-[16px] h-[13px]" 
            viewBox="0 0 16 13" 
            fill="none"
          >
            {/* Two horizontal sliders - authentic Control Center icon */}
            <rect x="0" y="1" width="16" height="4" rx="2" fill={colors.iconSecondary} fillOpacity="0.35"/>
            <circle cx="11" cy="3" r="2.5" fill={colors.icon}/>
            <rect x="0" y="8" width="16" height="4" rx="2" fill={colors.iconSecondary} fillOpacity="0.35"/>
            <circle cx="5" cy="10" r="2.5" fill={colors.icon}/>
          </svg>
        </button>

        {/* Date & Time */}
        <div 
          className="h-[22px] px-2 mx-0.5 flex items-center gap-1.5 cursor-default rounded transition-all duration-150"
          style={getItemStyle("datetime")}
          onMouseEnter={() => setHoveredItem("datetime")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <span 
            className="text-[12px] tabular-nums leading-none" 
            style={{ 
              color: colors.textSecondary,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
            }}
          >
            {currentDate}
          </span>
          <span 
            className="text-[12px] tabular-nums leading-none" 
            style={{ 
              color: colors.text,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
              fontWeight: 500,
            }}
          >
            {currentTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
