"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface XPIconProps {
  id: string;
  label: string;
  type: "system" | "legacy";
  imageUrl?: string; // New prop for real images
  tooltip?: string;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  registerRef?: (id: string, element: HTMLElement | null) => void;
}

export default function XPIcon({
  id,
  label,
  type,
  imageUrl,
  tooltip,
  isSelected,
  onClick,
  registerRef,
}: XPIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Register ref for selection detection
  useEffect(() => {
    if (registerRef) {
      registerRef(id, buttonRef.current);
      return () => registerRef(id, null);
    }
  }, [id, registerRef]);

  // Fallback to SVGs if no image URL provided (for system icons) or if image fails
  const getIconContent = () => {
    if (imageUrl && !imageError) {
      return (
        <img 
          src={imageUrl} 
          alt={label}
          className="w-full h-full object-contain drop-shadow-md select-none"
          draggable={false}
          onError={() => setImageError(true)}
        />
      );
    }

    switch (id) {
      // System
      case "my-computer": return <MyComputerIcon />;
      case "my-documents": return <MyDocumentsIcon />;
      case "recycle-bin": return <RecycleBinIcon />;
      // ERPs
      case "sap": return <SAPIcon />;
      case "oracle": return <OracleIcon />;
      case "jde": return <JDEIcon />;
      case "peoplesoft": return <PeopleSoftIcon />;
      case "dynamics": return <DynamicsIcon />;
      case "netsuite": return <NetSuiteIcon />;
      // CRMs
      case "salesforce": return <SalesforceIcon />;
      case "siebel": return <SiebelIcon />;
      case "act": return <ACTIcon />;
      case "goldmine": return <GoldMineIcon />;
      // Office & Productivity
      case "word": return <WordIcon />;
      case "excel": return <ExcelIcon />;
      case "powerpoint": return <PowerPointIcon />;
      case "access": return <AccessIcon />;
      case "outlook": return <OutlookIcon />;
      case "lotus-notes": return <LotusNotesIcon />;
      case "acrobat": return <AcrobatIcon />;
      // BI & Analytics
      case "hyperion": return <HyperionIcon />;
      case "cognos": return <CognosIcon />;
      case "crystal": return <CrystalReportsIcon />;
      // Web & Comms
      case "ie": return <IEIcon />;
      case "netscape": return <NetscapeIcon />;
      // Utilities
      case "quickbooks": return <QuickBooksIcon />;
      case "sage": return <SageIcon />;
      default: return <DefaultIcon />;
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      className="flex flex-col items-center gap-1 p-2 rounded relative"
      style={{
        width: 85,
        height: 90,
        background: isSelected 
          ? "rgba(11, 97, 209, 0.4)" 
          : isHovered 
            ? "rgba(11, 97, 209, 0.2)" 
            : "transparent",
        border: isSelected 
          ? "1px dotted rgba(255,255,255,0.5)" 
          : "1px solid transparent",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      title={tooltip}
    >
      <div className="w-10 h-10 flex items-center justify-center relative shrink-0">
        {getIconContent()}
      </div>

      <span 
        className="text-[11px] text-center leading-tight w-full px-0.5"
        style={{
          color: "white",
          textShadow: "1px 1px 2px rgba(0,0,0,1), -1px -1px 2px rgba(0,0,0,1)",
          fontFamily: "Tahoma, sans-serif",
          wordBreak: "break-word",
          hyphens: "auto",
        }}
      >
        {label}
      </span>

      {type === "legacy" && (
        <motion.div
          className="absolute top-7 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-[7px] font-bold z-10"
          style={{
            background: "linear-gradient(135deg, #FF6B6B 0%, #CC0000 100%)",
            color: "white",
            boxShadow: "0 1px 2px rgba(0,0,0,0.5)",
            border: "1px solid #990000",
          }}
        >
          !
        </motion.div>
      )}
    </motion.button>
  );
}

// ... (Rest of the SVGs remain the same as previous file content, ensuring we have the robust manual SVGs as fallback)
// Pasting the same SVG definitions as before for completeness
// === SYSTEM ICONS ===
function MyComputerIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <defs>
        <linearGradient id="monitor-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0f0f0" />
          <stop offset="100%" stopColor="#d4d0c8" />
        </linearGradient>
      </defs>
      <path d="M8 6h32v24H8z" fill="#e0e0e0" stroke="#808080" />
      <path d="M11 9h26v18H11z" fill="#3a6ea5" />
      <path d="M12 30h24v4H12z" fill="#d4d0c8" />
      <path d="M18 34h12v2H18z" fill="#808080" />
    </svg>
  );
}

function MyDocumentsIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M4 10h40v30H4z" fill="#e8c76d" stroke="#c9a227" />
      <path d="M4 14h40v26H4z" fill="#fce49e" />
      <path d="M16 20h20v18H16z" fill="#fff" stroke="#e0e0e0" />
    </svg>
  );
}

function RecycleBinIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M14 12h20l-2 30H16z" fill="#fff" fillOpacity="0.5" stroke="#808080" />
      <path d="M18 16v22M24 16v22M30 16v22" stroke="#808080" strokeDasharray="2 2" />
      <path d="M12 12h24v2H12z" fill="#c0c0c0" stroke="#808080" />
      <path d="M22 8h4v4h-4z" fill="#c0c0c0" stroke="#808080" />
    </svg>
  );
}

// === ERPs ===
function SAPIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <defs>
        <linearGradient id="sapBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6699CC" />
          <stop offset="100%" stopColor="#003366" />
        </linearGradient>
      </defs>
      <rect x="2" y="10" width="44" height="28" fill="url(#sapBlue)" />
      <path d="M2 10h44v14H2z" fill="white" fillOpacity="0.1" />
      <text x="24" y="31" textAnchor="middle" fill="white" fontSize="16" fontFamily="Arial" fontWeight="bold">SAP</text>
    </svg>
  );
}

function OracleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="2" y="14" width="44" height="20" fill="#ff0000" />
      <rect x="2" y="34" width="44" height="2" fill="#cc0000" />
      <text x="24" y="28" textAnchor="middle" fill="white" fontSize="9" fontFamily="Arial" fontWeight="bold" letterSpacing="1">ORACLE</text>
    </svg>
  );
}

function JDEIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <circle cx="24" cy="24" r="20" fill="#cc0000" />
      <circle cx="24" cy="24" r="16" fill="white" />
      <path d="M18 16h4v16h-4z M26 16h4v16h-4z" fill="#cc0000" />
      <path d="M14 22h20v4H14z" fill="#cc0000" />
    </svg>
  );
}

function PeopleSoftIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="4" y="12" width="40" height="24" fill="#660099" />
      <text x="24" y="29" textAnchor="middle" fill="white" fontSize="7" fontFamily="Arial">PeopleSoft</text>
    </svg>
  );
}

function DynamicsIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M10 36 L20 12 L30 36" fill="#8dc63f" opacity="0.8" />
      <path d="M22 36 L32 12 L42 36" fill="#0072c6" opacity="0.8" />
    </svg>
  );
}

function NetSuiteIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="2" y="14" width="44" height="20" fill="#000" />
      <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="Arial" fontWeight="bold">N</text>
      <rect x="2" y="14" width="10" height="20" fill="#555" />
    </svg>
  );
}

// === CRMs ===
function SalesforceIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M12 30 Q6 30 6 22 Q6 14 14 14 Q16 8 24 8 Q32 8 34 14 Q42 14 42 22 Q42 30 36 30 Z" fill="#1798c1" />
      <text x="24" y="24" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial" fontWeight="bold" fontStyle="italic">salesforce</text>
    </svg>
  );
}

function SiebelIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="4" y="14" width="40" height="20" fill="#000" />
      <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="Arial" fontWeight="bold">SIEBEL</text>
    </svg>
  );
}

function ACTIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="8" y="8" width="32" height="32" rx="4" fill="#ffcc00" stroke="#cc9900" strokeWidth="2" />
      <text x="24" y="30" textAnchor="middle" fill="#000" fontSize="10" fontFamily="Arial" fontWeight="bold">ACT!</text>
    </svg>
  );
}

function GoldMineIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="6" y="6" width="36" height="36" fill="#fdd017" stroke="#b8860b" />
      <path d="M12 12h24v24H12z" fill="none" stroke="#b8860b" strokeWidth="2" />
      <text x="24" y="32" textAnchor="middle" fill="#b8860b" fontSize="24" fontFamily="serif" fontWeight="bold">G</text>
    </svg>
  );
}

// === OFFICE 2003 STYLE ===
function WordIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M10 4h20l8 8v32H10z" fill="#fff" stroke="#2b579a" />
      <path d="M30 4v8h8" fill="#a4c2f4" stroke="#2b579a" />
      <text x="24" y="36" textAnchor="middle" fill="#2b579a" fontSize="28" fontFamily="Times New Roman" fontWeight="bold">W</text>
    </svg>
  );
}

function ExcelIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M10 4h20l8 8v32H10z" fill="#fff" stroke="#1d7044" />
      <path d="M30 4v8h8" fill="#a4c2f4" stroke="#1d7044" />
      <text x="24" y="36" textAnchor="middle" fill="#1d7044" fontSize="28" fontFamily="Arial" fontWeight="bold">X</text>
      <path d="M14 20h20 M14 28h20 M24 14v24" stroke="#1d7044" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function PowerPointIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M10 4h20l8 8v32H10z" fill="#fff" stroke="#d04c23" />
      <path d="M30 4v8h8" fill="#f4b183" stroke="#d04c23" />
      <text x="24" y="36" textAnchor="middle" fill="#d04c23" fontSize="28" fontFamily="Arial" fontWeight="bold">P</text>
    </svg>
  );
}

function AccessIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M10 4h20l8 8v32H10z" fill="#fff" stroke="#77204f" />
      <path d="M30 4v8h8" fill="#e1bee7" stroke="#77204f" />
      <path d="M18 36l6-16 6 16" fill="none" stroke="#77204f" strokeWidth="3" />
      <path d="M20 30h8" stroke="#77204f" strokeWidth="2" />
      <circle cx="34" cy="20" r="4" fill="none" stroke="#77204f" strokeWidth="2" />
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M8 12h32v24H8z" fill="#fce49e" stroke="#c0a062" />
      <path d="M8 12l16 12 16-12" fill="none" stroke="#c0a062" strokeWidth="1" />
      <text x="24" y="32" textAnchor="middle" fill="#333" fontSize="16" fontFamily="Arial" fontWeight="bold">@</text>
    </svg>
  );
}

function LotusNotesIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="8" y="8" width="32" height="32" fill="#ffcc00" />
      <path d="M16 16l16 16" stroke="#000" strokeWidth="2" />
      <path d="M32 16l-16 16" stroke="#000" strokeWidth="2" />
      <rect x="20" y="8" width="8" height="32" fill="none" />
      <text x="24" y="46" textAnchor="middle" fontSize="6" fontFamily="Arial">NOTES</text>
    </svg>
  );
}

function AcrobatIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M12 8h24v32H12z" fill="#fff" stroke="#cc0000" />
      <path d="M24 16c-4 0-8 4-8 8s4 8 8 8 8-4 8-8-4-8-8-8z" fill="#cc0000" />
      <path d="M24 20c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" fill="#fff" />
    </svg>
  );
}

// === BI ===
function HyperionIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <circle cx="24" cy="24" r="18" fill="#003399" />
      <text x="24" y="30" textAnchor="middle" fill="#fff" fontSize="24" fontFamily="serif" fontStyle="italic">H</text>
    </svg>
  );
}

function CognosIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="8" y="16" width="32" height="16" fill="#0066cc" />
      <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="Arial" fontWeight="bold">COGNOS</text>
    </svg>
  );
}

function CrystalReportsIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M24 8l10 10-4 22H18l-4-22z" fill="#78909c" stroke="#37474f" />
      <path d="M24 8l-6 10 6 22 6-22z" fill="#b0bec5" opacity="0.5" />
    </svg>
  );
}

// === WEB ===
function IEIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <circle cx="24" cy="24" r="18" fill="#43a6dd" />
      <path d="M36 18c0-5-4-8-10-8s-11 5-11 12h14" fill="none" stroke="#fff" strokeWidth="4" />
      <path d="M15 22c0 6 5 10 11 10 4 0 7-2 9-5" fill="none" stroke="#fff" strokeWidth="4" />
      <ellipse cx="24" cy="24" rx="22" ry="6" fill="none" stroke="#f4b400" strokeWidth="2" transform="rotate(-30 24 24)" />
    </svg>
  );
}

function NetscapeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="4" y="4" width="40" height="40" fill="#003333" />
      <path d="M4 30c10-5 20 0 40-5v19H4z" fill="#006666" />
      <text x="24" y="34" textAnchor="middle" fill="#fff" fontSize="32" fontFamily="Times New Roman" fontWeight="bold" stroke="#00cccc" strokeWidth="1">N</text>
      <path d="M4 4l8 8 M44 4l-8 8" stroke="#00cccc" strokeWidth="2" />
    </svg>
  );
}

// === UTILS ===
function QuickBooksIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <circle cx="24" cy="24" r="18" fill="#2ca01c" />
      <text x="24" y="32" textAnchor="middle" fill="#fff" fontSize="24" fontFamily="Arial" fontWeight="bold">qb</text>
    </svg>
  );
}

function SageIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="6" y="16" width="36" height="16" fill="#00d664" />
      <text x="24" y="28" textAnchor="middle" fill="#000" fontSize="10" fontFamily="Arial" fontWeight="bold">sage</text>
    </svg>
  );
}

function DefaultIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="10" y="8" width="28" height="32" fill="#fff" stroke="#000" />
    </svg>
  );
}
