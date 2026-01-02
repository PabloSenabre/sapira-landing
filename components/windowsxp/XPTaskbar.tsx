"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface XPTaskbarProps {
  isStartMenuOpen: boolean;
  onStartClick: () => void;
  openWindows: Array<{ id: string; title: string }>;
}

export default function XPTaskbar({ isStartMenuOpen, onStartClick, openWindows }: XPTaskbarProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      setCurrentTime(`${displayHours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-[30px] z-[100] flex items-stretch"
      style={{
        background: "linear-gradient(180deg, #3168d5 0%, #4993E4 3%, #2663D1 5%, #1941A5 90%, #1941A5 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      {/* Start Button */}
      <motion.button
        className="h-full px-3 flex items-center gap-2 rounded-r-lg relative overflow-hidden"
        style={{
          background: isStartMenuOpen 
            ? "linear-gradient(180deg, #2F8F38 0%, #3C9E44 10%, #358C3D 50%, #2A7B32 90%, #1F6424 100%)"
            : "linear-gradient(180deg, #3C9E44 0%, #4DB657 10%, #3FA548 50%, #2F8F38 90%, #236B28 100%)",
          borderRight: "2px solid #52AA5E",
          boxShadow: isStartMenuOpen
            ? "inset 0 0 4px rgba(0,0,0,0.3)"
            : "inset 0 1px 0 rgba(255,255,255,0.4)",
          paddingLeft: "6px",
          paddingRight: "12px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onStartClick();
        }}
        whileHover={{ filter: "brightness(1.05)" }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Windows Logo */}
        <div className="w-5 h-5 relative">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            {/* Windows XP-style logo */}
            <defs>
              <linearGradient id="xp-red" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF5E5E" />
                <stop offset="100%" stopColor="#DA1F1F" />
              </linearGradient>
              <linearGradient id="xp-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7FD858" />
                <stop offset="100%" stopColor="#1FA51F" />
              </linearGradient>
              <linearGradient id="xp-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5EB8FF" />
                <stop offset="100%" stopColor="#1F5FDA" />
              </linearGradient>
              <linearGradient id="xp-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE75E" />
                <stop offset="100%" stopColor="#FFBA1F" />
              </linearGradient>
            </defs>
            {/* Four-pane window effect */}
            <path d="M2 2 L11 3 L11 11 L2 11 Z" fill="url(#xp-red)" />
            <path d="M13 3 L22 2 L22 11 L13 11 Z" fill="url(#xp-green)" />
            <path d="M2 13 L11 13 L11 22 L2 21 Z" fill="url(#xp-blue)" />
            <path d="M13 13 L22 13 L22 21 L13 22 Z" fill="url(#xp-yellow)" />
          </svg>
        </div>
        
        {/* Start text with italic style */}
        <span 
          className="text-sm font-bold tracking-wide"
          style={{
            fontStyle: "italic",
            color: "white",
            textShadow: "1px 1px 1px rgba(0,0,0,0.4)",
            fontFamily: "Franklin Gothic Medium, Tahoma, sans-serif",
          }}
        >
          start
        </span>

        {/* Shine effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
            borderRadius: "inherit",
          }}
        />
      </motion.button>

      {/* Quick Launch */}
      <div className="flex items-center gap-1 px-2 border-l border-r border-[#1941A5] mx-1">
        <QuickLaunchIcon icon="ie" />
        <QuickLaunchIcon icon="outlook" />
        <QuickLaunchIcon icon="explorer" />
      </div>

      {/* Task Area - Open Windows */}
      <div className="flex-1 flex items-center gap-1 px-1">
        {openWindows.map((window) => (
          <TaskbarButton key={window.id} title={window.title} />
        ))}
      </div>

      {/* System Tray */}
      <div 
        className="flex items-center gap-2 px-3 h-full"
        style={{
          background: "linear-gradient(180deg, #0F8AE8 0%, #1163C6 50%, #0D5BB5 100%)",
          borderLeft: "1px solid #1941A5",
          boxShadow: "inset 1px 0 1px rgba(255,255,255,0.1)",
        }}
      >
        {/* System tray icons */}
        <TrayIcon icon="volume" />
        <TrayIcon icon="network" />
        
        {/* Divider */}
        <div className="w-px h-4 bg-[#1941A5]" />
        
        {/* Clock */}
        <span 
          className="text-xs font-medium"
          style={{
            color: "white",
            textShadow: "0 1px 1px rgba(0,0,0,0.3)",
            fontFamily: "Tahoma, sans-serif",
          }}
        >
          {currentTime}
        </span>
      </div>
    </div>
  );
}

// Quick Launch Icon
function QuickLaunchIcon({ icon }: { icon: string }) {
  const getIcon = () => {
    switch (icon) {
      case "ie":
        return (
          <svg viewBox="0 0 20 20" className="w-4 h-4">
            <circle cx="10" cy="10" r="8" fill="#4BA3E3" stroke="#1C5C8A" strokeWidth="1" />
            <ellipse cx="10" cy="10" rx="7" ry="3" fill="none" stroke="white" strokeWidth="1.5" />
            <text x="10" y="13" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontStyle="italic">e</text>
          </svg>
        );
      case "outlook":
        return (
          <svg viewBox="0 0 20 20" className="w-4 h-4">
            <rect x="2" y="5" width="16" height="12" rx="1" fill="#1976D2" />
            <path d="M2 6 L10 11 L18 6" stroke="white" strokeWidth="1.5" fill="none" />
          </svg>
        );
      case "explorer":
        return (
          <svg viewBox="0 0 20 20" className="w-4 h-4">
            <path d="M3 4 L8 4 L10 6 L17 6 L17 16 L3 16 Z" fill="#F4D03F" stroke="#B7950B" strokeWidth="0.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.button
      className="w-6 h-6 flex items-center justify-center rounded"
      whileHover={{ background: "rgba(255,255,255,0.2)" }}
      whileTap={{ scale: 0.9 }}
    >
      {getIcon()}
    </motion.button>
  );
}

// Taskbar Button for open windows
function TaskbarButton({ title }: { title: string }) {
  return (
    <motion.button
      className="h-[22px] px-3 flex items-center gap-2 rounded min-w-[120px] max-w-[180px]"
      style={{
        background: "linear-gradient(180deg, #3C7FB9 0%, #2E6AA5 50%, #245D94 100%)",
        border: "1px solid #1941A5",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
      whileHover={{ filter: "brightness(1.1)" }}
    >
      <span 
        className="text-xs truncate"
        style={{
          color: "white",
          textShadow: "0 1px 1px rgba(0,0,0,0.3)",
          fontFamily: "Tahoma, sans-serif",
        }}
      >
        {title}
      </span>
    </motion.button>
  );
}

// Tray Icon
function TrayIcon({ icon }: { icon: string }) {
  const getIcon = () => {
    switch (icon) {
      case "volume":
        return (
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
            <path d="M2 5h2l4-3v12l-4-3H2V5z" />
            <path d="M11 4c1.5 1.5 1.5 6.5 0 8" stroke="white" fill="none" strokeWidth="1.5" />
            <path d="M13 2c2.5 2.5 2.5 9.5 0 12" stroke="white" fill="none" strokeWidth="1.5" />
          </svg>
        );
      case "network":
        return (
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
            <rect x="1" y="8" width="6" height="6" rx="1" />
            <rect x="9" y="8" width="6" height="6" rx="1" />
            <path d="M4 8V5h8v3" stroke="white" fill="none" strokeWidth="1" />
            <path d="M8 5V2" stroke="white" fill="none" strokeWidth="1" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="w-4 h-4 flex items-center justify-center opacity-90"
      whileHover={{ opacity: 1 }}
    >
      {getIcon()}
    </motion.div>
  );
}

