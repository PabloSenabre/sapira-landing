"use client";

import { useMemo, useState } from "react";
import { motion, useTransform, MotionValue, AnimatePresence } from "framer-motion";

interface FloatingAppIconsProps {
  scrollProgress: MotionValue<number>;
  konamiMode?: boolean;
}

// Removed the generic floating icons - now company logos animate from the inline text
const APP_ICONS: Array<{
  id: string;
  emoji: string;
  x: string;
  y: string;
  size: number;
  scrollStart: number;
  rotation: number;
  label: string;
}> = [];

// Easter egg: Special icons that appear in Konami mode
const KONAMI_ICONS = [
  { id: "k1", emoji: "🎮", x: "50%", y: "20%", size: 100, delay: 0 },
  { id: "k2", emoji: "👾", x: "30%", y: "40%", size: 80, delay: 0.1 },
  { id: "k3", emoji: "🕹️", x: "70%", y: "40%", size: 80, delay: 0.2 },
  { id: "k4", emoji: "🚀", x: "50%", y: "60%", size: 90, delay: 0.3 },
  { id: "k5", emoji: "⭐", x: "20%", y: "70%", size: 60, delay: 0.4 },
  { id: "k6", emoji: "🌟", x: "80%", y: "70%", size: 60, delay: 0.5 },
  { id: "k7", emoji: "💎", x: "50%", y: "80%", size: 70, delay: 0.6 },
];

export default function FloatingAppIcons({ scrollProgress, konamiMode = false }: FloatingAppIconsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {konamiMode ? (
          // Konami mode special icons
          KONAMI_ICONS.map((icon) => (
            <motion.div
              key={icon.id}
              className="absolute"
              style={{
                left: icon.x,
                top: icon.y,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360],
                y: [0, -20, 0],
              }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                delay: icon.delay,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span style={{ fontSize: icon.size }}>
                {icon.emoji}
              </span>
            </motion.div>
          ))
        ) : (
          // Normal mode - floating app icons
          APP_ICONS.map((icon) => (
            <FloatingIcon
              key={icon.id}
              icon={icon}
              scrollProgress={scrollProgress}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

interface FloatingIconProps {
  icon: typeof APP_ICONS[0];
  scrollProgress: MotionValue<number>;
}

function FloatingIcon({ icon, scrollProgress }: FloatingIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Icon appears only at the beginning and fades out quickly
  const opacity = useTransform(
    scrollProgress,
    [0, 0.02, 0.08, 0.15],
    [0.7, 0.7, 0.3, 0]
  );

  // Parallax effect - icons move up as user scrolls
  const y = useTransform(
    scrollProgress,
    [0, 1],
    [100, -200]
  );

  // Scale in effect
  const scale = useTransform(
    scrollProgress,
    [icon.scrollStart, icon.scrollStart + 0.05],
    [0.5, 1]
  );

  // Slight rotation animation
  const floatDuration = useMemo(() => 5 + Math.random() * 3, []);
  const floatDelay = useMemo(() => Math.random() * 2, []);

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer"
      style={{
        left: icon.x,
        top: icon.y,
        opacity,
        scale,
        y,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotate: [icon.rotation - 3, icon.rotation + 3, icon.rotation - 3],
        }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* 3D Icon with hover effect */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{
            width: icon.size,
            height: icon.size,
            filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.15)) drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
            transform: `rotate(${icon.rotation}deg)`,
          }}
          whileHover={{ scale: 1.3 }}
          animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <span 
            className="select-none"
            style={{ 
              fontSize: icon.size * 0.85,
              lineHeight: 1,
              filter: isHovered ? "saturate(1.5)" : "saturate(0.7)",
              transition: "filter 0.3s ease",
            }}
          >
            {icon.emoji}
          </span>
        </motion.div>

        {/* Tooltip on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute top-full left-1/2 mt-2 px-3 py-1.5 bg-black text-white text-xs rounded-lg whitespace-nowrap"
              style={{ transform: "translateX(-50%)" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {icon.label}
              <span className="block text-[10px] text-gray-400 mt-0.5">
                One of many...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
