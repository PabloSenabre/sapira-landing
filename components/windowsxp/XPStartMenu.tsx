"use client";

import { motion } from "framer-motion";

interface XPStartMenuProps {
  onClose: () => void;
  onItemClick: (itemId: string) => void;
}

const menuItems = {
  left: [
    { id: "ie", label: "Internet Explorer", icon: "ie", description: "Browse the World Wide Web" },
    { id: "outlook", label: "Outlook Express", icon: "outlook", description: "Read and send email" },
    { id: "excel", label: "Microsoft Excel", icon: "excel", description: "Create spreadsheets" },
    { id: "salesforce", label: "Salesforce", icon: "salesforce", description: "Classic Edition 2008" },
    { id: "erp", label: "SAP R/3", icon: "erp", description: "Enterprise Resource Planning" },
    { id: "crm", label: "ACT! CRM", icon: "crm", description: "Contact Management" },
  ],
  right: [
    { id: "my-documents", label: "My Documents", icon: "folder" },
    { id: "my-pictures", label: "My Pictures", icon: "folder" },
    { id: "my-music", label: "My Music", icon: "folder" },
    { id: "my-computer", label: "My Computer", icon: "computer" },
    { id: "control-panel", label: "Control Panel", icon: "control" },
    { id: "help", label: "Help and Support", icon: "help" },
  ],
};

export default function XPStartMenu({ onClose, onItemClick }: XPStartMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[90]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Start Menu */}
      <motion.div
        className="fixed left-0 z-[95] overflow-hidden"
        style={{
          bottom: 30,
          width: 380,
          borderRadius: "8px 8px 0 0",
          border: "2px solid #4169E1",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Header */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{
            background: "linear-gradient(180deg, #2156C6 0%, #1941A5 50%, #0D2F80 100%)",
          }}
        >
          {/* User Avatar */}
          <div 
            className="w-12 h-12 rounded-lg overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #87CEEB 0%, #4169E1 100%)",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <circle cx="24" cy="18" r="10" fill="white" />
              <path d="M6 48 C6 32 42 32 42 48" fill="white" />
            </svg>
          </div>
          <span 
            className="text-[14px] font-bold"
            style={{
              color: "white",
              textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
              fontFamily: "Franklin Gothic Medium, Tahoma, sans-serif",
            }}
          >
            Administrator
          </span>
        </div>

        {/* Menu Content */}
        <div className="flex">
          {/* Left Column - Programs (White) */}
          <div 
            className="flex-1 py-2"
            style={{
              background: "white",
              borderRight: "1px solid #D3D3D3",
            }}
          >
            {/* Pinned Programs */}
            <div className="px-1">
              {menuItems.left.map((item, index) => (
                <MenuItem 
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick(item.id)}
                  delay={index * 0.02}
                />
              ))}
            </div>

            {/* Separator */}
            <div 
              className="my-2 mx-3 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #D3D3D3, transparent)" }}
            />

            {/* All Programs */}
            <div className="px-3">
              <motion.button
                className="w-full py-2 px-2 flex items-center justify-between rounded text-[12px]"
                style={{
                  fontFamily: "Tahoma, sans-serif",
                  color: "#000",
                }}
                whileHover={{ background: "#316AC5", color: "white" }}
              >
                <span className="font-semibold">All Programs</span>
                <span>▶</span>
              </motion.button>
            </div>
          </div>

          {/* Right Column - Places (Light Blue) */}
          <div 
            className="w-[160px] py-2"
            style={{
              background: "#D3E5FA",
            }}
          >
            {menuItems.right.map((item, index) => (
              <PlaceItem 
                key={item.id}
                item={item}
                onClick={() => onItemClick(item.id)}
                delay={index * 0.02}
              />
            ))}

            {/* Separator */}
            <div 
              className="my-2 mx-3 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #A0C0E0, transparent)" }}
            />

            {/* Printers and Faxes */}
            <PlaceItem 
              item={{ id: "printers", label: "Printers and Faxes", icon: "printer" }}
              onClick={() => onItemClick("printers")}
              delay={0.12}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-3 py-2"
          style={{
            background: "linear-gradient(180deg, #4993E4 0%, #3168d5 50%, #2156C6 100%)",
            borderTop: "1px solid #4169E1",
          }}
        >
          <FooterButton icon="logoff" label="Log Off" />
          <FooterButton icon="shutdown" label="Shut Down" />
        </div>
      </motion.div>
    </>
  );
}

// Menu Item Component
function MenuItem({ 
  item, 
  onClick,
  delay = 0,
}: { 
  item: { id: string; label: string; icon: string; description?: string };
  onClick: () => void;
  delay?: number;
}) {
  return (
    <motion.button
      className="w-full py-1.5 px-2 flex items-center gap-3 rounded"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ background: "#316AC5" }}
      style={{ fontFamily: "Tahoma, sans-serif" }}
    >
      <div className="w-8 h-8">
        <MenuIcon type={item.icon} />
      </div>
      <div className="text-left">
        <div className="text-[12px] font-semibold text-[#000] group-hover:text-white">
          {item.label}
        </div>
        {item.description && (
          <div className="text-[10px] text-[#666]">
            {item.description}
          </div>
        )}
      </div>
    </motion.button>
  );
}

// Place Item Component (Right column)
function PlaceItem({ 
  item, 
  onClick,
  delay = 0,
}: { 
  item: { id: string; label: string; icon: string };
  onClick: () => void;
  delay?: number;
}) {
  return (
    <motion.button
      className="w-full py-1 px-3 flex items-center gap-2 text-[11px] font-medium"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ background: "#316AC5", color: "white" }}
      style={{ 
        fontFamily: "Tahoma, sans-serif",
        color: "#000",
      }}
    >
      <div className="w-6 h-6">
        <PlaceIcon type={item.icon} />
      </div>
      <span>{item.label}</span>
    </motion.button>
  );
}

// Footer Button
function FooterButton({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.button
      className="flex items-center gap-2 px-3 py-1 rounded"
      whileHover={{ background: "rgba(255,255,255,0.2)" }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-5 h-5">
        {icon === "logoff" && (
          <svg viewBox="0 0 20 20" fill="white">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 6h4v4h3l-5 5-5-5h3V6z" />
          </svg>
        )}
        {icon === "shutdown" && (
          <svg viewBox="0 0 20 20" fill="white">
            <circle cx="10" cy="10" r="8" fill="none" stroke="white" strokeWidth="2" />
            <line x1="10" y1="3" x2="10" y2="10" stroke="white" strokeWidth="2" />
          </svg>
        )}
      </div>
      <span 
        className="text-[11px]"
        style={{
          color: "white",
          fontFamily: "Tahoma, sans-serif",
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}

// Menu Icons (small versions for menu)
function MenuIcon({ type }: { type: string }) {
  switch (type) {
    case "ie":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <circle cx="16" cy="16" r="14" fill="#4BA3E3" stroke="#1C5C8A" strokeWidth="1" />
          <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="#FFCC00" strokeWidth="2" transform="rotate(-25, 16, 16)" />
          <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontStyle="italic">e</text>
        </svg>
      );
    case "outlook":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <rect x="3" y="8" width="26" height="18" rx="2" fill="#1976D2" />
          <path d="M3 9 L16 18 L29 9" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      );
    case "excel":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <rect x="4" y="2" width="24" height="28" rx="2" fill="white" stroke="#1B5E20" strokeWidth="1" />
          <rect x="4" y="2" width="24" height="8" fill="#2E7D32" rx="2 2 0 0" />
          <text x="16" y="9" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">X</text>
          <g stroke="#4CAF50" strokeWidth="0.5">
            <line x1="8" y1="14" x2="24" y2="14" />
            <line x1="8" y1="18" x2="24" y2="18" />
            <line x1="8" y1="22" x2="24" y2="22" />
            <line x1="14" y1="12" x2="14" y2="26" />
            <line x1="20" y1="12" x2="20" y2="26" />
          </g>
        </svg>
      );
    case "salesforce":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <path 
            d="M8 18 C5 18 3 15 3 12 C3 9 6 6 10 6 C12 3 16 1 20 1 C26 1 30 5 31 11 C34 11 36 14 36 17 C36 21 33 23 29 23 L8 23 C5 23 3 21 3 18"
            fill="#00A1E0" 
            stroke="#0070D2" 
            strokeWidth="0.5"
            transform="scale(0.85) translate(2, 4)"
          />
          <text x="16" y="17" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">SF</text>
        </svg>
      );
    case "erp":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <ellipse cx="16" cy="8" rx="12" ry="5" fill="#FF9800" stroke="#BF360C" strokeWidth="1" />
          <rect x="4" y="8" width="24" height="16" fill="#FFC107" />
          <ellipse cx="16" cy="24" rx="12" ry="5" fill="#FF9800" stroke="#BF360C" strokeWidth="1" />
          <text x="16" y="18" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SAP</text>
        </svg>
      );
    case "crm":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <rect x="4" y="4" width="24" height="24" rx="3" fill="#9C27B0" />
          <rect x="7" y="8" width="18" height="6" rx="1" fill="white" />
          <rect x="7" y="16" width="18" height="6" rx="1" fill="#E1BEE7" />
          <circle cx="11" cy="19" r="2" fill="#9C27B0" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <rect x="4" y="2" width="24" height="28" rx="2" fill="white" stroke="#666" strokeWidth="1" />
        </svg>
      );
  }
}

// Place Icons (right column)
function PlaceIcon({ type }: { type: string }) {
  switch (type) {
    case "folder":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M2 6 L2 20 L22 20 L22 8 L10 8 L8 5 L2 5 Z" fill="#FFC107" stroke="#B8860B" strokeWidth="0.5" />
        </svg>
      );
    case "computer":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect x="2" y="3" width="20" height="14" rx="1" fill="#E0E0E0" stroke="#666" strokeWidth="0.5" />
          <rect x="4" y="5" width="16" height="10" fill="#000080" />
          <rect x="8" y="17" width="8" height="2" fill="#C0C0C0" />
          <rect x="6" y="19" width="12" height="2" rx="1" fill="#A0A0A0" />
        </svg>
      );
    case "control":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect x="2" y="2" width="20" height="20" rx="2" fill="#1976D2" />
          <rect x="5" y="5" width="6" height="6" rx="1" fill="white" />
          <rect x="13" y="5" width="6" height="6" rx="1" fill="white" />
          <rect x="5" y="13" width="6" height="6" rx="1" fill="white" />
          <rect x="13" y="13" width="6" height="6" rx="1" fill="white" />
        </svg>
      );
    case "help":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="10" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1" />
          <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">?</text>
        </svg>
      );
    case "printer":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect x="4" y="8" width="16" height="10" rx="1" fill="#E0E0E0" stroke="#666" strokeWidth="0.5" />
          <rect x="6" y="3" width="12" height="6" fill="white" stroke="#666" strokeWidth="0.5" />
          <rect x="6" y="16" width="12" height="6" fill="white" stroke="#666" strokeWidth="0.5" />
          <circle cx="17" cy="11" r="1" fill="#4CAF50" />
        </svg>
      );
    default:
      return null;
  }
}

