"use client";

import { useState, createContext, useContext } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Theme type for light/dark mode support
type Theme = "light" | "dark";

// Context for hover state coordination
interface HoverContextValue {
  isAppsHovered: boolean;
  isSapiraHovered: boolean;
  setAppsHovered: (v: boolean) => void;
  setSapiraHovered: (v: boolean) => void;
}

const HoverContext = createContext<HoverContextValue>({
  isAppsHovered: false,
  isSapiraHovered: false,
  setAppsHovered: () => {},
  setSapiraHovered: () => {},
});

// All legacy enterprise apps with REAL logo URLs - using reliable CDNs
// Grid 5x4 = 20 icons
const legacyApps = [
  // Row 1
  { id: "sap", label: "SAP", logoUrl: "https://cdn.worldvectorlogo.com/logos/sap-3.svg" },
  { id: "oracle", label: "Oracle", logoUrl: "https://cdn.worldvectorlogo.com/logos/oracle-6.svg" },
  { id: "salesforce", label: "Salesforce", logoUrl: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg" },
  { id: "hubspot", label: "HubSpot", logoUrl: "https://cdn.worldvectorlogo.com/logos/hubspot.svg" },
  { id: "quickbooks", label: "QuickBooks", logoUrl: "https://cdn.worldvectorlogo.com/logos/quickbooks-2.svg" },
  // Row 2
  { id: "netsuite", label: "NetSuite", logoUrl: "https://cdn.worldvectorlogo.com/logos/netsuite-1.svg" },
  { id: "tableau", label: "Tableau", logoUrl: "https://cdn.worldvectorlogo.com/logos/tableau-software.svg" },
  { id: "powerbi", label: "Power BI", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" },
  { id: "slack", label: "Slack", logoUrl: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" },
  { id: "figma", label: "Figma", logoUrl: "https://cdn.worldvectorlogo.com/logos/figma-icon.svg" },
  // Row 3
  { id: "zoom", label: "Zoom", logoUrl: "https://cdn.worldvectorlogo.com/logos/zoom-app.svg" },
  { id: "gmail", label: "Gmail", logoUrl: "https://cdn.worldvectorlogo.com/logos/gmail-icon-2.svg" },
  { id: "jira", label: "Jira", logoUrl: "https://cdn.worldvectorlogo.com/logos/jira-1.svg" },
  { id: "asana", label: "Asana", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg" },
  { id: "monday", label: "Monday", logoUrl: "https://cdn.worldvectorlogo.com/logos/monday-1.svg" },
  // Row 4
  { id: "trello", label: "Trello", logoUrl: "https://cdn.worldvectorlogo.com/logos/trello.svg" },
  { id: "zendesk", label: "Zendesk", logoUrl: "https://cdn.worldvectorlogo.com/logos/zendesk-1.svg" },
  { id: "servicenow", label: "ServiceNow", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/ServiceNow_logo.svg" },
  { id: "aws", label: "AWS", logoUrl: "https://cdn.worldvectorlogo.com/logos/aws-2.svg" },
  { id: "notion", label: "Notion", logoUrl: "https://cdn.worldvectorlogo.com/logos/notion-2.svg" },
];

// Locked legacy icon component - compact version for grid
function LockedIcon({ 
  label, 
  logoUrl,
  theme = "light",
  index = 0,
  onDoubleClick 
}: { 
  id: string; 
  label: string; 
  logoUrl: string;
  index?: number;
  theme?: Theme;
  onDoubleClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isSapiraHovered } = useContext(HoverContext);
  const isLight = theme === "light";

  // When Sapira is hovered, apps "organize" (become more visible and colored)
  const organizedOpacity = isSapiraHovered ? 0.95 : 0.7;
  const organizedGrayscale = isSapiraHovered ? "grayscale(30%)" : "grayscale(100%)";

  return (
    <motion.button
      className="flex flex-col items-center p-1 rounded-xl cursor-default"
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      whileHover={{ scale: 1.08 }}
      transition={{ 
        duration: 0.2,
        delay: index * 0.015,
      }}
    >
      {/* Icon container */}
      <motion.div 
        className="relative w-12 h-12 rounded-xl flex items-center justify-center p-1.5"
        style={{
          background: isLight 
            ? `linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,248,250,0.95) 100%)`
            : `linear-gradient(145deg, rgba(120,120,135,0.98) 0%, rgba(100,100,115,0.95) 100%)`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: isLight
            ? "1px solid rgba(255,255,255,0.9)"
            : "1px solid rgba(255,255,255,0.35)",
          boxShadow: isLight
            ? "0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)"
            : "0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
        animate={{
          boxShadow: isSapiraHovered
            ? isLight
              ? "0 6px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1)"
              : "0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)"
            : undefined,
        }}
      >
        {/* Logo image */}
        <motion.div 
          className="w-full h-full relative"
          animate={{
            filter: isHovered 
              ? "grayscale(0%) brightness(1.1)" 
              : `${organizedGrayscale} opacity(${organizedOpacity})`,
          }}
          transition={{ duration: 0.25 }}
        >
          {!imageError ? (
            <Image
              src={logoUrl}
              alt={label}
              fill
              className="object-contain"
              unoptimized
              loading="eager"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
              {label.charAt(0)}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

// Connection line component between apps and Sapira
function ConnectionLine({ theme = "light" }: { theme?: Theme }) {
  const { isAppsHovered, isSapiraHovered } = useContext(HoverContext);
  const isLight = theme === "light";
  
  // Line pulses when either side is hovered
  const isActive = isAppsHovered || isSapiraHovered;
  
  return (
    <div className="flex flex-col items-center justify-center px-6">
      {/* The connecting line with animated flow */}
      <div className="relative h-[3px] w-28 rounded-full overflow-hidden">
        {/* Base line */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: isLight 
              ? "rgba(0,0,0,0.12)" 
              : "rgba(255,255,255,0.2)",
          }}
          animate={{
            opacity: isActive ? 0.6 : 0.35,
          }}
        />
        
        {/* Animated flow effect */}
        <motion.div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute h-full w-12"
            style={{
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)"} 50%, 
                transparent 100%)`,
              borderRadius: "4px",
            }}
            animate={{
              x: isActive ? ["-48px", "160px"] : "-48px",
              opacity: isActive ? 1 : 0,
            }}
            transition={{
              x: {
                duration: 1.2,
                repeat: isActive ? Infinity : 0,
                ease: "linear",
              },
              opacity: { duration: 0.3 },
            }}
          />
        </motion.div>
        
        {/* Glow effect when Sapira is hovered */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
            filter: "blur(6px)",
          }}
          animate={{
            opacity: isSapiraHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Ratio indicator */}
      <motion.div 
        className="mt-6 flex items-center gap-4"
        animate={{
          opacity: isActive ? 1 : 0.7,
        }}
      >
        <motion.span 
          className="text-5xl font-extralight tracking-tight"
          style={{
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
          }}
          animate={{
            color: isAppsHovered 
              ? (isLight ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)")
              : (isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"),
          }}
        >
          1000
        </motion.span>
        <span 
          className="text-3xl font-light"
          style={{
            color: isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)",
          }}
        >
          :
        </span>
        <motion.span 
          className="text-5xl font-extralight tracking-tight"
          style={{
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
          }}
          animate={{
            color: isSapiraHovered 
              ? (isLight ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,1)")
              : (isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"),
            textShadow: isSapiraHovered 
              ? "0 0 30px rgba(255,255,255,0.4)"
              : "none",
          }}
        >
          1
        </motion.span>
      </motion.div>
    </div>
  );
}

// Special Sapira icon - the "1" in 1000:1
function SapiraSpecialIcon({ theme = "light", onDoubleClick }: { theme?: Theme; onDoubleClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const { setSapiraHovered } = useContext(HoverContext);
  const isLight = theme === "light";

  const handleMouseEnter = () => {
    setIsHovered(true);
    setSapiraHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSapiraHovered(false);
  };
  
  return (
    <motion.button
      className="flex flex-col items-center gap-3 p-3 rounded-xl cursor-pointer"
      onDoubleClick={onDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Outer glow container */}
      <motion.div
        className="relative"
        animate={{
          filter: isHovered 
            ? "drop-shadow(0 0 30px rgba(255,255,255,0.35)) drop-shadow(0 0 60px rgba(255,255,255,0.15))" 
            : "drop-shadow(0 0 10px rgba(255,255,255,0.1))",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Premium rectangular container */}
        <div 
          className="relative w-[140px] h-[60px] rounded-2xl flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(145deg, 
                rgba(12,12,15,0.99) 0%, 
                rgba(22,22,28,0.97) 50%,
                rgba(16,16,20,0.98) 100%)`,
            boxShadow: isHovered
              ? `0 16px 48px rgba(0,0,0,0.5), 
                 inset 0 1px 0 rgba(255,255,255,0.2),
                 inset 0 -1px 0 rgba(255,255,255,0.05),
                 0 0 0 1px rgba(255,255,255,0.1)`
              : `0 8px 28px rgba(0,0,0,0.35), 
                 inset 0 1px 0 rgba(255,255,255,0.1)`,
            transition: "box-shadow 300ms ease",
          }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: isHovered
                ? `inset 0 0 0 1.5px rgba(255,255,255,0.4), 0 0 0 1px rgba(255,255,255,0.1)`
                : `inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0)`,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Static top gloss */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(168deg, 
                rgba(255,255,255,0.18) 0%, 
                rgba(255,255,255,0.04) 30%,
                transparent 50%)`,
            }}
          />

          {/* Initial flash burst on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.5) 0%, transparent 60%)",
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? [0, 0.9, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          />

          {/* Main shimmer sweep */}
          <motion.div 
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
          >
            <motion.div
              className="absolute -top-8 -bottom-8 w-[100px]"
              style={{
                left: "-80px",
                background: `linear-gradient(105deg, 
                  transparent 0%, 
                  rgba(255,255,255,0.1) 30%,
                  rgba(255,255,255,0.4) 48%, 
                  rgba(255,255,255,0.6) 50%, 
                  rgba(255,255,255,0.4) 52%,
                  rgba(255,255,255,0.1) 70%,
                  transparent 100%)`,
                transform: "skewX(-20deg)",
              }}
              animate={{
                x: isHovered ? [0, 280] : 0,
                opacity: isHovered ? [0, 1, 1, 0] : 0,
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.1, 0.85, 1],
              }}
            />
          </motion.div>
          
          {/* Sapira text logo */}
          <motion.span 
            className="relative z-10 font-light select-none"
            style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              fontSize: 30,
              letterSpacing: "-0.02em",
            }}
            animate={{
              color: isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.90)",
              textShadow: isHovered 
                ? "0 0 30px rgba(255,255,255,0.5), 0 2px 10px rgba(0,0,0,0.4)"
                : "0 1px 8px rgba(255,255,255,0.1)",
            }}
            transition={{ duration: 0.3 }}
          >
            Sapira
          </motion.span>
        </div>
      </motion.div>
      
      {/* Label */}
      <motion.span 
        className="text-xs font-medium text-center px-2 py-0.5 rounded"
        style={{
          letterSpacing: "0.04em",
          textShadow: isLight 
            ? "0 1px 2px rgba(255,255,255,0.8)"
            : "0 1px 3px rgba(0,0,0,0.5)",
        }}
        animate={{
          color: isLight
            ? isHovered ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.65)"
            : isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.8)",
        }}
        transition={{ duration: 0.2 }}
      >
        Transform Now
      </motion.span>
    </motion.button>
  );
}

// Apps grid container with hover detection
function AppsGrid({ 
  theme, 
  onAppOpen 
}: { 
  theme: Theme; 
  onAppOpen: (appId: string) => void;
}) {
  const { setAppsHovered } = useContext(HoverContext);

  return (
    <motion.div 
      className="grid gap-1"
      style={{
        gridTemplateColumns: "repeat(5, 1fr)",
        gridTemplateRows: "repeat(4, 1fr)",
      }}
      onMouseEnter={() => setAppsHovered(true)}
      onMouseLeave={() => setAppsHovered(false)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {legacyApps.map((app, index) => (
        <LockedIcon
          key={app.id}
          id={app.id}
          label={app.label}
          logoUrl={app.logoUrl}
          index={index}
          theme={theme}
          onDoubleClick={() => onAppOpen(app.id)}
        />
      ))}
    </motion.div>
  );
}

interface DesktopIconsProps {
  onAppOpen: (appId: string) => void;
  onSapiraClick: () => void;
  theme?: Theme;
}

export default function DesktopIcons({ onAppOpen, onSapiraClick, theme = "light" }: DesktopIconsProps) {
  const [isAppsHovered, setAppsHovered] = useState(false);
  const [isSapiraHovered, setSapiraHovered] = useState(false);
  const isLight = theme === "light";

  return (
    <HoverContext.Provider value={{ isAppsHovered, isSapiraHovered, setAppsHovered, setSapiraHovered }}>
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-[50] pointer-events-none px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center gap-8 p-8 rounded-3xl pointer-events-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: isLight 
              ? "rgba(255,255,255,0.45)"
              : "rgba(90,90,110,0.95)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: isLight 
              ? "1px solid rgba(255,255,255,0.7)"
              : "1px solid rgba(255,255,255,0.3)",
            boxShadow: isLight
              ? "0 25px 70px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)"
              : "0 35px 90px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          {/* Left: Grid of legacy apps (the "1000") */}
          <AppsGrid theme={theme} onAppOpen={onAppOpen} />
          
          {/* Center: Connection line with ratio */}
          <ConnectionLine theme={theme} />
          
          {/* Right: Sapira (the "1") */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <SapiraSpecialIcon theme={theme} onDoubleClick={onSapiraClick} />
          </motion.div>
        </motion.div>
      </motion.div>
    </HoverContext.Provider>
  );
}
