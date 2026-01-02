"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Theme type for light/dark mode support
type Theme = "light" | "dark";

// All legacy enterprise apps with REAL logo URLs - using reliable CDNs
// Grid 4x5 = 20 icons
const legacyApps = [
  // Row 1
  { 
    id: "sap", 
    label: "SAP", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/sap-3.svg"
  },
  { 
    id: "oracle", 
    label: "Oracle", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/oracle-6.svg"
  },
  { 
    id: "salesforce", 
    label: "Salesforce", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg"
  },
  { 
    id: "hubspot", 
    label: "HubSpot", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/hubspot.svg"
  },
  // Row 2
  { 
    id: "quickbooks", 
    label: "QuickBooks", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/quickbooks-2.svg"
  },
  { 
    id: "netsuite", 
    label: "NetSuite", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/netsuite-1.svg"
  },
  { 
    id: "tableau", 
    label: "Tableau", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/tableau-software.svg"
  },
  { 
    id: "powerbi", 
    label: "Power BI", 
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg"
  },
  // Row 3
  { 
    id: "slack", 
    label: "Slack", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg"
  },
  { 
    id: "figma", 
    label: "Figma", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/figma-icon.svg"
  },
  { 
    id: "zoom", 
    label: "Zoom", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/zoom-app.svg"
  },
  { 
    id: "gmail", 
    label: "Gmail", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/gmail-icon-2.svg"
  },
  // Row 4
  { 
    id: "jira", 
    label: "Jira", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/jira-1.svg"
  },
  { 
    id: "asana", 
    label: "Asana", 
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg"
  },
  { 
    id: "monday", 
    label: "Monday", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/monday-1.svg"
  },
  { 
    id: "trello", 
    label: "Trello", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/trello.svg"
  },
  // Row 5
  { 
    id: "zendesk", 
    label: "Zendesk", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/zendesk-1.svg"
  },
  { 
    id: "servicenow", 
    label: "ServiceNow", 
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/ServiceNow_logo.svg"
  },
  { 
    id: "aws", 
    label: "AWS", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/aws-2.svg"
  },
  { 
    id: "notion", 
    label: "Notion", 
    logoUrl: "https://cdn.worldvectorlogo.com/logos/notion-2.svg"
  },
];

// Locked legacy icon component with Mac glass aesthetic
function LockedIcon({ 
  label, 
  logoUrl,
  theme = "light",
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
  const isLight = theme === "light";

  return (
    <motion.button
      className="flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-default"
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.15 }}
    >
      {/* Icon container with frosted glass + grayscale + lock */}
      <div 
        className="relative w-14 h-14 rounded-xl flex items-center justify-center p-2"
        style={{
          background: isLight 
            ? `linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(248,248,250,0.85) 100%)`
            : `linear-gradient(145deg, rgba(60,60,65,0.85) 0%, rgba(45,45,50,0.9) 100%)`,
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: isLight
            ? "1px solid rgba(255,255,255,0.8)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: isLight
            ? isHovered
              ? "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)"
              : "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)"
            : isHovered
              ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Real logo image */}
        <div 
          className="w-full h-full relative transition-all duration-300"
          style={{
            filter: isHovered 
              ? "grayscale(20%) opacity(0.85)" 
              : "grayscale(100%) opacity(0.5)",
          }}
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
            // Fallback if image fails to load
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
              {label.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Lock badge - corner indicator */}
        <div 
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isLight
              ? "linear-gradient(145deg, #8e8e93 0%, #6d6d72 100%)"
              : "linear-gradient(145deg, #636366 0%, #48484a 100%)",
            border: "2px solid " + (isLight ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.3)"),
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5">
            <path 
              d="M12 2C9.24 2 7 4.24 7 7V10H6C4.9 10 4 10.9 4 12V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V12C20 10.9 19.1 10 18 10H17V7C17 4.24 14.76 2 12 2ZM12 4C13.66 4 15 5.34 15 7V10H9V7C9 5.34 10.34 4 12 4Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      
      {/* Label - macOS style */}
      <span 
        className="text-[11px] font-medium text-center max-w-[70px] leading-tight transition-colors truncate px-1 py-0.5 rounded"
        style={{
          color: isLight ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.85)",
          textShadow: isLight 
            ? "0 1px 2px rgba(255,255,255,0.8)" 
            : "0 1px 3px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}

// Special Sapira icon - rectangular with stunning shine effect
function SapiraSpecialIcon({ theme = "light", onDoubleClick }: { theme?: Theme; onDoubleClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const isLight = theme === "light";
  
  return (
    <motion.button
      className="flex flex-col items-center gap-2 p-2 rounded-xl cursor-pointer"
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Outer glow container */}
      <motion.div
        className="relative"
        animate={{
          filter: isHovered 
            ? "drop-shadow(0 0 20px rgba(255,255,255,0.25)) drop-shadow(0 0 40px rgba(255,255,255,0.1))" 
            : "drop-shadow(0 0 0px rgba(255,255,255,0))",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Premium rectangular container */}
        <div 
          className="relative w-[130px] h-[56px] rounded-2xl flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(145deg, 
                rgba(12,12,15,0.99) 0%, 
                rgba(22,22,28,0.97) 50%,
                rgba(16,16,20,0.98) 100%)`,
            boxShadow: isHovered
              ? `0 12px 40px rgba(0,0,0,0.4), 
                 inset 0 1px 0 rgba(255,255,255,0.15),
                 inset 0 -1px 0 rgba(255,255,255,0.05)`
              : `0 6px 24px rgba(0,0,0,0.3), 
                 inset 0 1px 0 rgba(255,255,255,0.1)`,
            transition: "box-shadow 300ms ease",
          }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: "1px solid transparent",
              backgroundClip: "padding-box",
            }}
            animate={{
              boxShadow: isHovered
                ? `inset 0 0 0 1px rgba(255,255,255,0.35), 
                   0 0 0 1px rgba(255,255,255,0.08)`
                : `inset 0 0 0 1px rgba(255,255,255,0.12), 
                   0 0 0 1px rgba(255,255,255,0)`,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Static top gloss */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(168deg, 
                rgba(255,255,255,0.15) 0%, 
                rgba(255,255,255,0.03) 30%,
                transparent 50%)`,
            }}
          />

          {/* Initial flash burst on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)",
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? [0, 0.8, 0] : 0,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          />

          {/* Main shimmer sweep - bright and impactful */}
          <motion.div 
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
            initial={false}
          >
            <motion.div
              className="absolute -top-8 -bottom-8 w-[100px]"
              style={{
                left: "-80px",
                background: `linear-gradient(105deg, 
                  transparent 0%, 
                  rgba(255,255,255,0.08) 30%,
                  rgba(255,255,255,0.35) 48%, 
                  rgba(255,255,255,0.5) 50%, 
                  rgba(255,255,255,0.35) 52%,
                  rgba(255,255,255,0.08) 70%,
                  transparent 100%)`,
                transform: "skewX(-20deg)",
              }}
              animate={{
                x: isHovered ? [0, 260] : 0,
                opacity: isHovered ? [0, 1, 1, 0] : 0,
              }}
              transition={{
                duration: 0.7,
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
              fontSize: 28,
              letterSpacing: "-0.02em",
            }}
            animate={{
              color: isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.90)",
              textShadow: isHovered 
                ? "0 0 20px rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.3)"
                : "0 1px 6px rgba(255,255,255,0.08)",
            }}
            transition={{ duration: 0.3 }}
          >
            Sapira
          </motion.span>
        </div>
      </motion.div>
      
      {/* Label */}
      <motion.span 
        className="text-[11px] font-medium text-center px-2 py-0.5 rounded"
        style={{
          letterSpacing: "0.03em",
          textShadow: isLight 
            ? "0 1px 2px rgba(255,255,255,0.8)"
            : "0 1px 3px rgba(0,0,0,0.5)",
        }}
        animate={{
          color: isLight
            ? isHovered ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.7)"
            : isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.85)",
        }}
        transition={{ duration: 0.2 }}
      >
        Transform Now
      </motion.span>
    </motion.button>
  );
}

interface DesktopIconsProps {
  onAppOpen: (appId: string) => void;
  onSapiraClick: () => void;
  theme?: Theme;
}

export default function DesktopIcons({ onAppOpen, onSapiraClick, theme = "light" }: DesktopIconsProps) {
  return (
    <div className="absolute top-14 left-3 bottom-32 flex flex-col items-start gap-1 z-[10]">
      {/* Grid of locked legacy icons - 4 columns on left side */}
      <div className="grid grid-cols-4 gap-0">
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
      </div>
      
      {/* Sapira special icon BELOW the grid */}
      <div className="mt-2 self-start">
        <SapiraSpecialIcon theme={theme} onDoubleClick={onSapiraClick} />
      </div>
    </div>
  );
}
