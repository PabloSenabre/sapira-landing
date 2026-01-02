"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Folder, FileText, Film, HardDrive, Cloud, ChevronRight, ChevronDown,
  BarChart3, Telescope, TrendingUp, Tag, Clock, Download, Trash2,
  Grid3X3, List, LayoutGrid
} from "lucide-react";

export default function FinderApp() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewMode] = useState<"list" | "grid">("list");
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    icloud: false,
    locations: false,
    tags: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sidebarFavorites = [
    { icon: Clock, label: "Recents", count: 12 },
    { icon: Download, label: "Downloads", count: 3 },
    { icon: HardDrive, label: "Sapira", type: "device" },
    { icon: Cloud, label: "Cloud", type: "location" },
    { icon: Folder, label: "Products", type: "folder", active: true },
    { icon: Folder, label: "Documents", type: "folder" },
    { icon: Folder, label: "Resources", type: "folder" },
  ];

  const tags = [
    { color: "#FF3B30", label: "Important" },
    { color: "#FF9500", label: "Work" },
    { color: "#34C759", label: "Personal" },
    { color: "#007AFF", label: "Projects" },
    { color: "#AF52DE", label: "Archive" },
  ];

  const files = [
    { Icon: BarChart3, name: "AIO Platform", type: "Application", size: "—", modified: "Today", color: "#0F3460" },
    { Icon: Telescope, name: "Faro Analytics", type: "Application", size: "—", modified: "Today", color: "#764BA2" },
    { Icon: TrendingUp, name: "Equity", type: "Application", size: "—", modified: "Today", color: "#11998E" },
    { Icon: FileText, name: "Documentation.pdf", type: "PDF Document", size: "2.4 MB", modified: "Dec 20" },
    { Icon: Folder, name: "Case Studies", type: "Folder", size: "—", modified: "Dec 18", isFolder: true },
    { Icon: Folder, name: "API Reference", type: "Folder", size: "—", modified: "Dec 15", isFolder: true },
    { Icon: Film, name: "Product Demo.mp4", type: "MPEG-4 Movie", size: "124 MB", modified: "Dec 10" },
    { Icon: FileText, name: "ROI Calculator.xlsx", type: "Excel Spreadsheet", size: "856 KB", modified: "Dec 5" },
  ];

  return (
    <div className="h-full flex bg-[#1e1e1e]">
      {/* Sidebar */}
      <div 
        className="w-[180px] shrink-0 flex flex-col"
        style={{ 
          background: "linear-gradient(180deg, rgba(32,32,34,0.95) 0%, rgba(28,28,30,0.98) 100%)",
          borderRight: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {/* Favorites Section */}
          <div className="mb-1">
            <button 
              onClick={() => toggleSection("favorites")}
              className="w-full flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider text-white/40 hover:text-white/60 transition-colors"
            >
              <ChevronRight 
                className={`w-2.5 h-2.5 transition-transform ${expandedSections.favorites ? "rotate-90" : ""}`} 
                strokeWidth={2}
              />
              Favorites
            </button>
            {expandedSections.favorites && (
              <div className="mt-1 space-y-0.5">
                {sidebarFavorites.map((item, i) => (
                  <motion.button
                    key={item.label}
                    className={`w-full flex items-center gap-2 px-2 py-[5px] rounded-md transition-colors text-left group ${
                      item.active ? "bg-[#3478F6]" : "hover:bg-white/[0.06]"
                    }`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <item.icon 
                      className={`w-[14px] h-[14px] ${item.active ? "text-white" : "text-[#4A9EFF]"}`} 
                      strokeWidth={1.5} 
                    />
                    <span className={`text-[12px] flex-1 ${item.active ? "text-white" : "text-white/80"}`}>
                      {item.label}
                    </span>
                    {item.count && (
                      <span className="text-[10px] text-white/30">{item.count}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="mb-1 mt-4">
            <button 
              onClick={() => toggleSection("tags")}
              className="w-full flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider text-white/40 hover:text-white/60 transition-colors"
            >
              <ChevronRight 
                className={`w-2.5 h-2.5 transition-transform ${expandedSections.tags ? "rotate-90" : ""}`} 
                strokeWidth={2}
              />
              Tags
            </button>
            {expandedSections.tags && (
              <div className="mt-1 space-y-0.5">
                {tags.map((tag) => (
                  <button
                    key={tag.label}
                    className="w-full flex items-center gap-2 px-2 py-[5px] rounded-md hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <div 
                      className="w-[10px] h-[10px] rounded-full" 
                      style={{ background: tag.color }}
                    />
                    <span className="text-white/70 text-[12px]">{tag.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#232325]">
        {/* Toolbar */}
        <div 
          className="h-[38px] flex items-center justify-between px-3 shrink-0"
          style={{ 
            background: "linear-gradient(180deg, rgba(45,45,48,0.9) 0%, rgba(38,38,40,0.95) 100%)",
            borderBottom: "0.5px solid rgba(0,0,0,0.4)",
            boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Left - Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-md hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 rotate-180" strokeWidth={2} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-white/[0.08] text-white/25 cursor-not-allowed">
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="text-white/45">Sapira</span>
              <ChevronRight className="w-3 h-3 text-white/30" strokeWidth={2} />
              <span className="text-white/80 font-medium">Products</span>
            </div>
          </div>

          {/* Right - View Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div 
              className="flex items-center p-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <button 
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white/10" : ""}`}
              >
                <Grid3X3 className="w-3.5 h-3.5 text-white/60" strokeWidth={1.5} />
              </button>
              <button 
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-white/10" : ""}`}
              >
                <List className="w-3.5 h-3.5 text-white/80" strokeWidth={1.5} />
              </button>
              <button className="p-1.5 rounded">
                <LayoutGrid className="w-3.5 h-3.5 text-white/60" strokeWidth={1.5} />
              </button>
            </div>

            {/* Sort/Group */}
            <button 
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/[0.06] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="12" height="1.5" rx="0.5"/>
                <rect x="4" y="7" width="8" height="1.5" rx="0.5"/>
                <rect x="6" y="11" width="4" height="1.5" rx="0.5"/>
              </svg>
              <ChevronDown className="w-2.5 h-2.5 text-white/40" strokeWidth={2} />
            </button>

            {/* Search */}
            <div 
              className="flex items-center gap-2 px-2.5 py-1 rounded-md min-w-[140px]"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[12px] text-white/35">Search</span>
            </div>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-auto">
          {/* Column Headers */}
          <div 
            className="grid gap-2 px-3 py-1.5 text-[11px] uppercase tracking-wider text-white/35 font-medium sticky top-0 z-10"
            style={{ 
              gridTemplateColumns: "minmax(200px, 1fr) 140px 80px 100px",
              background: "rgba(35,35,37,0.98)",
              borderBottom: "0.5px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="flex items-center gap-1">
              Name
              <ChevronDown className="w-2.5 h-2.5 opacity-60" strokeWidth={2} />
            </span>
            <span>Kind</span>
            <span>Size</span>
            <span>Date Modified</span>
          </div>

          {/* Files */}
          <div className="py-1">
            {files.map((file, i) => {
              const Icon = file.Icon;
              const isSelected = selectedFile === file.name;
              
              return (
                <motion.button
                  key={file.name}
                  className={`w-full grid gap-2 px-3 py-[6px] transition-colors text-left ${
                    isSelected 
                      ? "bg-[#3478F6]" 
                      : "hover:bg-white/[0.04]"
                  }`}
                  style={{ gridTemplateColumns: "minmax(200px, 1fr) 140px 80px 100px" }}
                  onClick={() => setSelectedFile(file.name)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    {/* File Icon */}
                    <div 
                      className={`w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 ${
                        file.isFolder ? "" : ""
                      }`}
                      style={file.color ? {
                        background: `linear-gradient(135deg, ${file.color}88 0%, ${file.color} 100%)`,
                      } : undefined}
                    >
                      <Icon 
                        className={`w-3.5 h-3.5 ${
                          file.color 
                            ? "text-white" 
                            : file.isFolder 
                              ? "text-[#4A9EFF]" 
                              : "text-white/50"
                        }`} 
                        strokeWidth={1.5} 
                      />
                    </div>
                    <span className={`text-[13px] truncate ${isSelected ? "text-white" : "text-white/85"}`}>
                      {file.name}
                    </span>
                  </span>
                  <span className={`text-[12px] ${isSelected ? "text-white/80" : "text-white/45"}`}>
                    {file.type}
                  </span>
                  <span className={`text-[12px] tabular-nums ${isSelected ? "text-white/80" : "text-white/45"}`}>
                    {file.size}
                  </span>
                  <span className={`text-[12px] ${isSelected ? "text-white/80" : "text-white/45"}`}>
                    {file.modified}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Status Bar */}
        <div 
          className="h-[22px] flex items-center justify-between px-3 text-[11px] text-white/40 shrink-0"
          style={{ 
            background: "linear-gradient(180deg, rgba(38,38,40,0.95) 0%, rgba(32,32,34,0.98) 100%)",
            borderTop: "0.5px solid rgba(255,255,255,0.04)",
          }}
        >
          <span>8 items, 127.3 MB available</span>
          {selectedFile && (
            <span className="text-white/60">"{selectedFile}" selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
