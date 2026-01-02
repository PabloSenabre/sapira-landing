"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XPTaskbar from "./XPTaskbar";
import XPIcon from "./XPIcon";
import XPStartMenu from "./XPStartMenu";
import CrashExperience from "./CrashExperience";
import BlueScreenOfDeath from "./BlueScreenOfDeath";
import { ManifestoSection } from "../manifesto";
import PHAROExperience from "../macos/pharo-experience/PHAROExperience";

// Desktop icons configuration - Clean enterprise layout with Real Logos
const desktopIcons = [
  // Column 1 - System Icons
  { id: "my-computer", label: "My Computer", type: "system" as const, col: 0, row: 0 },
  { id: "my-documents", label: "My Documents", type: "system" as const, col: 0, row: 1 },
  { id: "recycle-bin", label: "Recycle Bin", type: "system" as const, col: 0, row: 2 },
  
  // Column 2 - ERPs (Enterprise Resource Planning)
  { 
    id: "sap", 
    label: "SAP R/3", 
    type: "legacy" as const, 
    col: 1, 
    row: 0, 
    tooltip: "Loading... 5 min",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" 
  },
  { 
    id: "oracle", 
    label: "Oracle EBS", 
    type: "legacy" as const, 
    col: 1, 
    row: 1, 
    tooltip: "E-Business Suite 11i",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg"
  },
  { 
    id: "jde", 
    label: "JD Edwards", 
    type: "legacy" as const, 
    col: 1, 
    row: 2, 
    tooltip: "OneWorld Xe",
    // Fallback to SVG manual if image fails
  },
  { 
    id: "peoplesoft", 
    label: "PeopleSoft", 
    type: "legacy" as const, 
    col: 1, 
    row: 3, 
    tooltip: "HRMS 8.9",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/PeopleSoft_logo.svg"
  },
  { 
    id: "dynamics", 
    label: "Dynamics GP", 
    type: "legacy" as const, 
    col: 1, 
    row: 4, 
    tooltip: "Great Plains 9.0",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/Microsoft_Dynamics_365_Logo.svg"
  },
  { 
    id: "netsuite", 
    label: "NetSuite", 
    type: "legacy" as const, 
    col: 1, 
    row: 5, 
    tooltip: "2007 Edition",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/NetSuite_Logo.svg"
  },
  
  // Column 3 - CRMs (Customer Relationship Management)
  { 
    id: "salesforce", 
    label: "Salesforce", 
    type: "legacy" as const, 
    col: 2, 
    row: 0, 
    tooltip: "Classic Edition",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg"
  },
  { 
    id: "siebel", 
    label: "Siebel CRM", 
    type: "legacy" as const, 
    col: 2, 
    row: 1, 
    tooltip: "Siebel 7.8",
    // Fallback to SVG
  },
  { 
    id: "act", 
    label: "ACT! 2005", 
    type: "legacy" as const, 
    col: 2, 
    row: 2, 
    tooltip: "Contact Manager",
    // Fallback to SVG
  },
  { 
    id: "goldmine", 
    label: "GoldMine", 
    type: "legacy" as const, 
    col: 2, 
    row: 3, 
    tooltip: "Sales & Marketing",
    // Fallback to SVG
  },
  
  // Column 4 - BI & Analytics
  { 
    id: "hyperion", 
    label: "Hyperion", 
    type: "legacy" as const, 
    col: 3, 
    row: 0, 
    tooltip: "Financial Planning",
    // Fallback to SVG
  },
  { 
    id: "cognos", 
    label: "Cognos BI", 
    type: "legacy" as const, 
    col: 3, 
    row: 1, 
    tooltip: "ReportNet",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/IBM_Cognos_Logo.svg"
  },
  { 
    id: "crystal", 
    label: "Crystal Reports", 
    type: "legacy" as const, 
    col: 3, 
    row: 2, 
    tooltip: "Version 9",
    // Fallback to SVG
  },
  
  // Column 5 - Office & Productivity (Using iconic Office 2003 style images)
  { 
    id: "outlook", 
    label: "Outlook 2003", 
    type: "legacy" as const, 
    col: 4, 
    row: 0, 
    tooltip: "847 unread emails",
    // Fallback to SVG manual for better look
  },
  { 
    id: "excel", 
    label: "Excel 2003", 
    type: "legacy" as const, 
    col: 4, 
    row: 1, 
    tooltip: "65K row limit",
    // Fallback to SVG
  },
  { 
    id: "word", 
    label: "Word 2003", 
    type: "legacy" as const, 
    col: 4, 
    row: 2, 
    tooltip: ".doc format only",
    // Fallback to SVG
  },
  { 
    id: "access", 
    label: "Access 2003", 
    type: "legacy" as const, 
    col: 4, 
    row: 3, 
    tooltip: "Database",
    // Fallback to SVG
  },
  { 
    id: "powerpoint", 
    label: "PowerPoint", 
    type: "legacy" as const, 
    col: 4, 
    row: 4, 
    tooltip: "Slide Master",
    // Fallback to SVG
  },
  { 
    id: "lotus-notes", 
    label: "Lotus Notes", 
    type: "legacy" as const, 
    col: 4, 
    row: 5, 
    tooltip: "R5 Client",
    // Fallback to SVG
  },
  
  // Column 6 - Finance & Utils
  { 
    id: "quickbooks", 
    label: "QuickBooks", 
    type: "legacy" as const, 
    col: 5, 
    row: 0, 
    tooltip: "Pro 2005",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/QuickBooks_logo.svg"
  },
  { 
    id: "sage", 
    label: "Sage 50", 
    type: "legacy" as const, 
    col: 5, 
    row: 1, 
    tooltip: "Accounting",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Sage_Group_logo.svg"
  },
  { 
    id: "acrobat", 
    label: "Acrobat 6", 
    type: "legacy" as const, 
    col: 5, 
    row: 2, 
    tooltip: "Reader",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/38/Adobe_Acrobat_DC_logo_2020.svg"
  },
  { 
    id: "ie", 
    label: "IE 6.0", 
    type: "legacy" as const, 
    col: 5, 
    row: 3, 
    tooltip: "Best at 800x600",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/Internet_Explorer_10%2B11_logo.svg"
  },
  { 
    id: "netscape", 
    label: "Netscape", 
    type: "legacy" as const, 
    col: 5, 
    row: 4, 
    tooltip: "Navigator 4.7",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Netscape_icon.svg"
  },
];

interface WindowsXPDesktopProps {
  onCrashTrigger?: () => void;
  onLearnSapiraClick?: () => void;
}

// Selection rectangle state
interface SelectionRect {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export default function WindowsXPDesktop({ onCrashTrigger, onLearnSapiraClick }: WindowsXPDesktopProps) {
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [experienceState, setExperienceState] = useState<'desktop' | 'crashing' | 'bsod' | 'manifesto'>('desktop');
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [pharoExperienceActive, setPharoExperienceActive] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Handle outside click to deselect icons
  const handleDesktopClick = () => {
    setSelectedIcons([]);
    setIsStartMenuOpen(false);
  };

  // Handle selection start (mouse down on desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start selection if clicking on the desktop background (not on icons/buttons)
    if (e.target === desktopRef.current || (e.target as HTMLElement).classList.contains('desktop-bg')) {
      setIsSelecting(true);
      setSelectionRect({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      });
      // Clear selection when starting new drag
      if (!e.shiftKey && !e.ctrlKey) {
        setSelectedIcons([]);
      }
      setIsStartMenuOpen(false);
    }
  };

  // Handle selection update (mouse move)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSelecting || !selectionRect) return;

    setSelectionRect(prev => prev ? {
      ...prev,
      currentX: e.clientX,
      currentY: e.clientY,
    } : null);

    // Calculate which icons are inside the selection rectangle
    const rect = {
      left: Math.min(selectionRect.startX, e.clientX),
      right: Math.max(selectionRect.startX, e.clientX),
      top: Math.min(selectionRect.startY, e.clientY),
      bottom: Math.max(selectionRect.startY, e.clientY),
    };

    const selected: string[] = [];
    iconRefs.current.forEach((element, iconId) => {
      const iconRect = element.getBoundingClientRect();
      // Check if icon intersects with selection rectangle
      if (
        iconRect.left < rect.right &&
        iconRect.right > rect.left &&
        iconRect.top < rect.bottom &&
        iconRect.bottom > rect.top
      ) {
        selected.push(iconId);
      }
    });

    setSelectedIcons(selected);
  }, [isSelecting, selectionRect]);

  // Handle selection end (mouse up)
  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
    setSelectionRect(null);
  }, []);

  // Register icon ref for selection detection
  const registerIconRef = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      iconRefs.current.set(id, element);
    } else {
      iconRefs.current.delete(id);
    }
  }, []);

  // Handle legacy app click - triggers crash sequence
  const handleLegacyAppClick = useCallback((appId: string) => {
    // Single click triggers the crash experience first
    setExperienceState('crashing');
  }, []);

  // Handle icon click (single click)
  const handleIconClick = useCallback((iconId: string, type: 'system' | 'legacy', e: React.MouseEvent) => {
    // Handle ctrl/cmd click for multi-select
    if (e.ctrlKey || e.metaKey) {
      setSelectedIcons(prev => 
        prev.includes(iconId) 
          ? prev.filter(id => id !== iconId)
          : [...prev, iconId]
      );
    } else {
      setSelectedIcons([iconId]);
    }
    
    if (type === 'legacy') {
      handleLegacyAppClick(iconId); // Trigger crash on single click for legacy apps
    }
  }, [handleLegacyAppClick]);

  // Handle start menu item click
  const handleStartMenuItemClick = useCallback((itemId: string) => {
    setIsStartMenuOpen(false);
    // Trigger crash for any legacy app from start menu
    if (['ie', 'outlook', 'excel', 'salesforce', 'erp', 'crm'].includes(itemId)) {
      setExperienceState('crashing');
    }
  }, []);

  // Handle manifesto completion - return to desktop or call callback
  const handleManifestoComplete = () => {
    if (onLearnSapiraClick) {
      onLearnSapiraClick();
    } else {
      // Return to desktop if no callback provided
      setExperienceState('desktop');
    }
  };

  // If crashing, show crash experience (error popups chaos)
  if (experienceState === 'crashing') {
    return <CrashExperience onComplete={() => setExperienceState('bsod')} />;
  }

  // If BSOD, show the Blue Screen of Death
  if (experienceState === 'bsod') {
    return <BlueScreenOfDeath onComplete={() => setExperienceState('manifesto')} />;
  }

  // Render Manifesto when in manifesto state (takes over entire page for scroll)
  if (experienceState === 'manifesto') {
    return <ManifestoSection onComplete={handleManifestoComplete} />;
  }
  
  // Calculate selection rectangle dimensions for rendering
  const getSelectionRectStyle = () => {
    if (!selectionRect) return null;
    const left = Math.min(selectionRect.startX, selectionRect.currentX);
    const top = Math.min(selectionRect.startY, selectionRect.currentY);
    const width = Math.abs(selectionRect.currentX - selectionRect.startX);
    const height = Math.abs(selectionRect.currentY - selectionRect.startY);
    return { left, top, width, height };
  };
  
  return (
    <>
      <div 
        ref={desktopRef}
        className="fixed inset-0 overflow-hidden font-tahoma select-none"
        onClick={handleDesktopClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background Image - Real Bliss */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center desktop-bg pointer-events-none"
          style={{
            backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(1.05) contrast(1.1)', // Slight boost to match memory
          }}
        />

        {/* Selection Rectangle */}
        {isSelecting && selectionRect && (
          <div
            className="fixed z-[80] pointer-events-none"
            style={{
              ...getSelectionRectStyle(),
              border: '1px dashed #0054E3',
              backgroundColor: 'rgba(0, 84, 227, 0.15)',
            }}
          />
        )}

        {/* Desktop Icons - Clean enterprise grid */}
        <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
          {[0, 1, 2, 3, 4, 5].map((col) => (
            <div key={col} className="flex flex-col gap-1">
              {desktopIcons
                .filter((icon) => icon.col === col)
                .sort((a, b) => a.row - b.row)
                .map((icon) => (
                  <XPIcon
                    key={icon.id}
                    id={icon.id}
                    label={icon.label}
                    type={icon.type}
                    tooltip={icon.tooltip}
                    imageUrl={icon.imageUrl}
                    isSelected={selectedIcons.includes(icon.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIconClick(icon.id, icon.type, e);
                    }}
                    registerRef={registerIconRef}
                  />
                ))}
            </div>
          ))}
        </div>

        {/* Learn what Sapira really is Button (Draggable window style) - Moved to Bottom Right */}
        <motion.div
          className="absolute bottom-16 right-4 z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <div className="bg-[#ECE9D8] border border-[#0054E3] rounded-t-lg shadow-xl overflow-hidden w-[300px]">
            {/* XP Title Bar */}
            <div className="h-[30px] bg-gradient-to-r from-[#0058EE] via-[#3593FF] to-[#288EFF] flex items-center justify-between px-2 cursor-move">
              <span className="text-white font-bold text-[13px] drop-shadow-md">Sapira.exe</span>
              <div className="flex gap-1">
                <button className="w-[21px] h-[21px] bg-[#D75442] border border-white/20 rounded-[3px] flex items-center justify-center text-white text-[10px] font-bold shadow-inner">
                  X
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4 flex flex-col items-center gap-3">
              <p className="text-[11px] text-center text-gray-800">
                Ready to modernize your enterprise stack?
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setPharoExperienceActive(true);
                }}
                className="px-6 py-1.5 bg-[#F4F4F4] border border-[#0054E3] rounded-[3px] text-[11px] text-black hover:bg-[#E1E1E1] active:bg-[#CECECE] active:shadow-inner transition-colors shadow-sm"
              >
                Learn what Sapira really is
              </button>
            </div>
          </div>
        </motion.div>

        {/* Start Menu */}
        <AnimatePresence>
          {isStartMenuOpen && (
            <XPStartMenu
              onClose={() => setIsStartMenuOpen(false)}
              onItemClick={handleStartMenuItemClick}
            />
          )}
        </AnimatePresence>

        {/* Taskbar */}
        <XPTaskbar 
          onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)} 
          isStartMenuOpen={isStartMenuOpen} 
          openWindows={[]}
        />
      </div>

      {/* PHARO Experience - Activated from "Learn what Sapira really is" button */}
      <PHAROExperience 
        isActive={pharoExperienceActive}
        onComplete={() => {
          setPharoExperienceActive(false);
          // Optionally transition to manifesto after PHARO experience
          // setExperienceState('manifesto');
        }}
      />
    </>
  );
}
