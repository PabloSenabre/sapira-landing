"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface XPWindowProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isError?: boolean;
  style?: React.CSSProperties;
  className?: string;
  showButtons?: boolean;
  width?: number;
  height?: number;
}

export default function XPWindow({
  title,
  icon,
  children,
  onClose,
  onMinimize,
  onMaximize,
  isError = false,
  style,
  className = "",
  showButtons = true,
  width = 400,
  height,
}: XPWindowProps) {
  return (
    <motion.div
      className={`rounded-t-lg overflow-hidden shadow-xl ${className}`}
      style={{
        width,
        height: height || "auto",
        border: "1px solid #0054E3",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.1)",
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Title Bar */}
      <div
        className="h-[30px] flex items-center justify-between px-1 relative"
        style={{
          background: isError
            ? "linear-gradient(180deg, #DA1F1F 0%, #B00000 20%, #8B0000 80%, #700000 100%)"
            : "linear-gradient(180deg, #0A246A 0%, #0F3B91 10%, #1457C0 50%, #0C3D9F 90%, #0A246A 100%)",
        }}
      >
        {/* Shine effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 60%)",
          }}
        />

        {/* Icon and Title */}
        <div className="flex items-center gap-2 relative z-10">
          {icon && (
            <div className="w-4 h-4 flex items-center justify-center">
              {icon}
            </div>
          )}
          {!icon && isError && (
            <div className="w-4 h-4 flex items-center justify-center">
              <XPErrorIcon />
            </div>
          )}
          <span 
            className="text-[12px] font-medium truncate max-w-[280px]"
            style={{
              color: "white",
              textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
              fontFamily: "Tahoma, Trebuchet MS, sans-serif",
            }}
          >
            {title}
          </span>
        </div>

        {/* Window Buttons */}
        {showButtons && (
          <div className="flex items-center gap-[2px] relative z-10">
            {onMinimize && (
              <WindowButton type="minimize" onClick={onMinimize} />
            )}
            {onMaximize && (
              <WindowButton type="maximize" onClick={onMaximize} />
            )}
            {onClose && (
              <WindowButton type="close" onClick={onClose} isError={isError} />
            )}
            {!onClose && !onMinimize && !onMaximize && (
              <WindowButton type="close" onClick={() => {}} isError={isError} />
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        style={{
          background: "#ECE9D8",
          borderTop: "1px solid #0054E3",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// Window control button
function WindowButton({ 
  type, 
  onClick,
  isError = false,
}: { 
  type: "minimize" | "maximize" | "close";
  onClick: () => void;
  isError?: boolean;
}) {
  const getButtonStyle = () => {
    if (type === "close") {
      return {
        background: isError
          ? "linear-gradient(180deg, #FF6B6B 0%, #E04040 50%, #C02020 100%)"
          : "linear-gradient(180deg, #E04040 0%, #D03030 50%, #B02020 100%)",
        border: "1px solid #700000",
      };
    }
    return {
      background: "linear-gradient(180deg, #3D7AE0 0%, #2563EB 50%, #1D4ED8 100%)",
      border: "1px solid #1E40AF",
    };
  };

  const getIcon = () => {
    switch (type) {
      case "minimize":
        return (
          <svg viewBox="0 0 10 10" className="w-[8px] h-[8px]">
            <rect x="1" y="7" width="8" height="2" fill="white" />
          </svg>
        );
      case "maximize":
        return (
          <svg viewBox="0 0 10 10" className="w-[8px] h-[8px]">
            <rect x="1" y="1" width="8" height="8" fill="none" stroke="white" strokeWidth="1.5" />
            <rect x="1" y="1" width="8" height="2" fill="white" />
          </svg>
        );
      case "close":
        return (
          <svg viewBox="0 0 10 10" className="w-[8px] h-[8px]">
            <path d="M1 1 L9 9 M9 1 L1 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <motion.button
      className="w-[21px] h-[21px] rounded-sm flex items-center justify-center relative overflow-hidden"
      style={getButtonStyle()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ filter: "brightness(1.15)" }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Button shine */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 50%)",
        }}
      />
      <div className="relative z-10">
        {getIcon()}
      </div>
    </motion.button>
  );
}

// XP Error Icon
function XPErrorIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4">
      <circle cx="8" cy="8" r="7" fill="#FF0000" stroke="#800000" strokeWidth="1" />
      <path d="M5 5 L11 11 M11 5 L5 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Export error window variant
export function XPErrorWindow({
  title,
  message,
  details,
  onClose,
  style,
}: {
  title: string;
  message: string;
  details?: string;
  onClose?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <XPWindow
      title={title}
      isError={true}
      onClose={onClose}
      style={style}
      width={420}
    >
      <div className="p-4 flex gap-4">
        {/* Error Icon */}
        <div className="shrink-0">
          <XPLargeErrorIcon />
        </div>

        {/* Message */}
        <div className="flex-1">
          <p 
            className="text-[12px] leading-relaxed mb-3"
            style={{
              color: "#000",
              fontFamily: "Tahoma, sans-serif",
            }}
          >
            {message}
          </p>
          {details && (
            <p 
              className="text-[11px] leading-relaxed"
              style={{
                color: "#666",
                fontFamily: "Tahoma, sans-serif",
              }}
            >
              {details}
            </p>
          )}
        </div>
      </div>

      {/* Button Area */}
      <div 
        className="px-4 py-3 flex justify-center gap-2"
        style={{
          borderTop: "1px solid #ACA899",
        }}
      >
        <XPButton onClick={onClose}>OK</XPButton>
      </div>
    </XPWindow>
  );
}

// Large error icon for dialogs
function XPLargeErrorIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12">
      <defs>
        <radialGradient id="error-gradient" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#CC0000" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#error-gradient)" stroke="#800000" strokeWidth="2" />
      <path d="M14 14 L34 34 M34 14 L14 34" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// XP-style button
export function XPButton({ 
  children, 
  onClick,
  primary = false,
}: { 
  children: ReactNode; 
  onClick?: () => void;
  primary?: boolean;
}) {
  return (
    <motion.button
      className="px-6 py-1 min-w-[75px] rounded-sm text-[12px] relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F5F5F5 0%, #E8E8E8 45%, #D4D4D4 50%, #C4C4C4 100%)",
        border: primary ? "2px solid #003C74" : "1px solid #003C74",
        boxShadow: "inset 0 1px 0 white",
        fontFamily: "Tahoma, sans-serif",
        color: "#000",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      whileHover={{ filter: "brightness(1.05)" }}
      whileTap={{ 
        background: "linear-gradient(180deg, #D4D4D4 0%, #C4C4C4 50%, #D4D4D4 100%)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      {/* Button highlight */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 50%)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

