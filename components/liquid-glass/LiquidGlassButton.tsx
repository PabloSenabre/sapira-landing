"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// ============================================
// LIQUID GLASS BUTTON COMPONENT
// Recreated from scratch for reliable glass coverage
// Based on Petr Knoll's CodePen design
// ============================================

interface LiquidGlassButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  size?: "small" | "default" | "large";
  variant?: "light" | "dark";
  disabled?: boolean;
  className?: string;
}

export default function LiquidGlassButton({
  children,
  href,
  onClick,
  size = "default",
  variant = "light",
  disabled = false,
  className = "",
}: LiquidGlassButtonProps) {
  // Size configurations - balanced glow coverage
  const sizeConfig = {
    small: {
      fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)",
      paddingX: "1.2em",
      paddingY: "0.6em",
      glowExtend: "0.6em",
      glowExtendHorizontal: "0.9em",
    },
    default: {
      fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
      paddingX: "1.5em",
      paddingY: "0.875em",
      glowExtend: "1em",
      glowExtendHorizontal: "1.5em",
    },
    large: {
      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
      paddingX: "1.8em",
      paddingY: "1em",
      glowExtend: "1.2em",
      glowExtendHorizontal: "1.8em",
    },
  };

  const config = sizeConfig[size];

  // Common styles for the glass effect
  const glassBackground = variant === "light"
    ? "linear-gradient(-75deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))"
    : "linear-gradient(-75deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))";

  const textColor = variant === "light" ? "rgba(50, 50, 50, 1)" : "rgba(255, 255, 255, 0.85)";

  // Common button styles
  const buttonBaseStyle = {
    all: "unset" as const,
    cursor: disabled ? "default" : "pointer",
    position: "relative" as const,
    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
    pointerEvents: "auto" as const,
    zIndex: 3,
    background: glassBackground,
    borderRadius: "999vw",
    boxShadow: `
      inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
      inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
      0 0.25em 0.125em -0.125em rgba(0, 0, 0, 0.2),
      0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2),
      0 0 0 0 rgba(255, 255, 255, 1)
    `,
    backdropFilter: "blur(clamp(1px, 0.125em, 4px))",
    WebkitBackdropFilter: "blur(clamp(1px, 0.125em, 4px))",
    display: "block",
    transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",
  };

  // Text span styles
  const textSpanStyle = {
    position: "relative" as const,
    display: "block",
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    letterSpacing: "-0.05em",
    fontWeight: 500,
    fontSize: "1em",
    color: textColor,
    WebkitFontSmoothing: "antialiased",
    textShadow: "0em 0.25em 0.05em rgba(0, 0, 0, 0.1)",
    paddingInline: config.paddingX,
    paddingBlock: config.paddingY,
  };

  // Border outline style
  const borderOutlineStyle = {
    content: '""',
    position: "absolute" as const,
    zIndex: 1,
    inset: "-1px",
    borderRadius: "999vw",
    padding: "clamp(1px, 0.0625em, 4px)",
    boxSizing: "border-box" as const,
    background: `
      conic-gradient(
        from -75deg at 50% 50%,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0) 5% 40%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0) 60% 95%,
        rgba(0, 0, 0, 0.5)
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))
    `,
    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    maskComposite: "exclude",
    WebkitMaskComposite: "xor",
    boxShadow: "inset 0 0 0 calc(clamp(1px, 0.0625em, 4px) / 2) rgba(255, 255, 255, 0.5)",
    pointerEvents: "none" as const,
  };

  // Shine effect style
  const shineStyle = {
    content: '""',
    display: "block",
    position: "absolute" as const,
    zIndex: 3,
    width: "calc(100% - clamp(1px, 0.0625em, 4px))",
    height: "calc(100% - clamp(1px, 0.0625em, 4px))",
    top: "calc(0% + clamp(1px, 0.0625em, 4px) / 2)",
    left: "calc(0% + clamp(1px, 0.0625em, 4px) / 2)",
    boxSizing: "border-box" as const,
    borderRadius: "999vw",
    overflow: "clip" as const,
    background: `linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 40% 50%,
      rgba(255, 255, 255, 0) 55%
    )`,
    mixBlendMode: "screen" as const,
    pointerEvents: "none" as const,
    backgroundSize: "200% 200%",
    backgroundPosition: "0% 50%",
    backgroundRepeat: "no-repeat" as const,
  };

  // Inner button content
  const buttonContent = (
    <>
      {/* Border Outline */}
      <span style={borderOutlineStyle} aria-hidden="true" />

      {/* Text Content */}
      <span style={textSpanStyle}>
        {/* Shine effect overlay */}
        <span style={shineStyle} aria-hidden="true" />
        {children}
      </span>
    </>
  );

  // Render as link or button
  const renderButton = () => {
    if (href) {
      return (
        <motion.a
          href={href}
          style={buttonBaseStyle}
          whileHover={{ 
            transform: "scale(0.975)",
          }}
          whileTap={{ transform: "scale(0.95)" }}
        >
          {buttonContent}
        </motion.a>
      );
    }

    if (onClick && !disabled) {
      return (
        <motion.button
          onClick={onClick}
          style={buttonBaseStyle}
          whileHover={{ transform: "scale(0.975)" }}
          whileTap={{ transform: "scale(0.95)" }}
        >
          {buttonContent}
        </motion.button>
      );
    }

    // Non-interactive badge/label
    return (
      <motion.div
        style={buttonBaseStyle}
      >
        {buttonContent}
      </motion.div>
    );
  };

  return (
    <div
      className={`liquid-glass-component ${className}`}
      style={{
        position: "relative",
        zIndex: 2,
        borderRadius: "999vw",
        background: "transparent",
        fontSize: config.fontSize,
      }}
    >
      {/* Shadow/Glow Layer - Covers the entire button uniformly */}
      <div
        className="liquid-glass-glow"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <div
          style={{
            position: "absolute",
            zIndex: 0,
            borderRadius: "999vw",
            // Full uniform coverage glow - enlarged to cover all text content
            background: `radial-gradient(
              ellipse 120% 120% at 50% 50%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.8) 30%,
              rgba(255, 255, 255, 0.5) 60%,
              rgba(255, 255, 255, 0.2) 85%,
              transparent 100%
            )`,
            // Symmetric extension beyond button edges - increased for full coverage
            top: `-${config.glowExtend}`,
            bottom: `-${config.glowExtend}`,
            left: `-${config.glowExtendHorizontal}`,
            right: `-${config.glowExtendHorizontal}`,
            filter: "blur(3px)",
            boxSizing: "border-box",
            transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        />
      </div>

      {renderButton()}
    </div>
  );
}
