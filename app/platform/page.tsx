"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import NavbarMinimal from "@/components/NavbarMinimal";
import Link from "next/link";
import { LiquidGlassCursor } from "@/components/liquid-glass";
import {
  MousePointerClick,
  Clock,
  Sparkles,
  Shield,
  BarChart3,
  Briefcase,
  FolderKanban,
  Target,
  ChevronRight,
  Users,
  CheckCircle2,
  Circle,
  Zap,
  DollarSign,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  Globe,
} from "lucide-react";

// ============================================
// LOGO COMPONENTS
// ============================================

// Real logos from Wikipedia/CDNs
const CHROME_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/512px-Google_Chrome_icon_%28February_2022%29.svg.png";
const APPLE_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/512px-Apple_logo_black.svg.png";
const MICROSOFT_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png";
const SALESFORCE_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/512px-Salesforce.com_logo.svg.png";
const SAP_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/512px-SAP_2011_logo.svg.png";

function ChromeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img 
      src={CHROME_LOGO_URL} 
      alt="Chrome" 
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

function AppleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img 
      src={APPLE_LOGO_URL} 
      alt="Apple" 
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

function MicrosoftLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img 
      src={MICROSOFT_LOGO_URL} 
      alt="Microsoft" 
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

function SalesforceLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img 
      src={SALESFORCE_LOGO_URL} 
      alt="Salesforce" 
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

function SAPLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img 
      src={SAP_LOGO_URL} 
      alt="SAP" 
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// Real logos using img tags
const TEAMS_LOGO_URL = "https://img.icons8.com/color/512/microsoft-teams.png";
const SLACK_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/512px-Slack_icon_2019.svg.png";

function TeamsLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img 
      src={TEAMS_LOGO_URL} 
      alt="Microsoft Teams" 
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

function SlackLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img 
      src={SLACK_LOGO_URL} 
      alt="Slack" 
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// ============================================
// PILLAR DATA
// ============================================

const pillars = [
  {
    id: "light",
    name: "Light",
    subtitle: "Discovery",
    badge: { text: "Beta", style: "bg-white/80 text-gray-700 border border-gray-200" },
    tagline: "See what others miss.",
    description: "AI-powered discovery engine that identifies automation opportunities hidden in your daily workflow.",
    features: [
      { title: "Browser & Device Integration", description: "Chrome, macOS, Windows", logos: [ChromeLogo, AppleLogo, MicrosoftLogo], demoTarget: "browser" },
      { title: "User Monitoring", description: "Track workflow patterns", icon: Eye, demoTarget: "monitoring" },
      { title: "API Integrations", description: "ERP, CRM, and more", logos: [SalesforceLogo, SAPLogo], demoTarget: "api" },
      { title: "Surveys", description: "Gather employee feedback", icon: MessageSquare, demoTarget: "surveys" },
    ],
  },
  {
    id: "forge",
    name: "Forge",
    subtitle: "PMO",
    badge: { text: "Live", style: "bg-[#1a1a1a] text-white" },
    tagline: "Build with precision.",
    description: "End-to-end project management platform designed for complex deliveries.",
    features: [
      { title: "Project Management", description: "Plan, execute, track", icon: FolderKanban, demoTarget: "projects" },
      { title: "Team Integration", description: "Teams & Slack", logos: [TeamsLogo, SlackLogo], demoTarget: "teams" },
      { title: "OKR Settings", description: "Align with objectives", icon: Target, demoTarget: "okrs" },
    ],
  },
  {
    id: "tower",
    name: "Tower",
    subtitle: "Monitoring",
    badge: { text: "Live", style: "bg-[#1a1a1a] text-white" },
    tagline: "Control with clarity.",
    description: "Real-time oversight platform for complete portfolio visibility.",
    features: [
      { title: "Compliance", description: "Automated audit trails", icon: Shield, demoTarget: "compliance" },
      { title: "Metrics & ROI", description: "Business impact tracking", icon: BarChart3, demoTarget: "metrics" },
      { title: "AI Evaluations", description: "Model performance", icon: Gauge, demoTarget: "ai-evals" },
      { title: "Billing", description: "Cost intelligence", icon: DollarSign, demoTarget: "billing" },
    ],
  },
];

// ============================================
// FLOATING LIQUID GLASS NAVIGATOR (Centered Right)
// Premium floating pill with ultra-smooth transitions
// ============================================

function ScrollProgressIndicator({ activePillar, onPillarClick, visible }: { 
  activePillar: string; 
  onPillarClick: (id: string) => void;
  visible: boolean;
}) {
  const activeIndex = pillars.findIndex(p => p.id === activePillar);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.9 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
        >
          {/* Main floating pill container - liquid glass style */}
          <motion.div
            className="relative rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.35) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: `
                0 8px 32px rgba(0,0,0,0.08),
                0 2px 8px rgba(0,0,0,0.04),
                inset 0 1px 0 rgba(255,255,255,0.8),
                inset 0 -1px 0 rgba(0,0,0,0.02)
              `,
              padding: "6px",
            }}
            layout
            transition={{ 
              layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            <div className="flex flex-col gap-1">
              {pillars.map((pillar, index) => {
                const isActive = activePillar === pillar.id;
                
                return (
                  <motion.button
                    key={pillar.id}
                    onClick={() => onPillarClick(pillar.id)}
                    className="relative flex items-center justify-center cursor-pointer overflow-hidden"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                    }}
                    animate={{
                      width: isActive ? 34 : 28,
                      height: isActive ? 34 : 28,
                      borderRadius: isActive ? "8px" : "50%",
                    }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ scale: isActive ? 1.02 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Active background - square with rounded corners */}
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0"
                        style={{
                          borderRadius: 8,
                          background: "linear-gradient(145deg, #1a1a1f 0%, #252530 100%)",
                          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.1), 0 3px 10px rgba(0,0,0,0.2)",
                        }}
                        transition={{ 
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}
                    
                    {/* Inactive - show pillar initial */}
                    {!isActive && (
                      <motion.span
                        className="text-[10px] font-medium"
                        style={{
                          color: "rgba(26,26,26,0.3)",
                          fontFamily: "Georgia, 'Times New Roman', serif",
                        }}
                        whileHover={{
                          color: "rgba(26,26,26,0.6)",
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {pillar.name.charAt(0)}
                      </motion.span>
                    )}
                    
                    {/* Active content - Sapira word small */}
                    {isActive && (
                      <motion.span
                        className="relative z-10 font-normal"
                        style={{ 
                          color: "rgba(255,255,255,0.9)",
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "6px",
                          letterSpacing: "0.01em",
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                      >
                        Sapira
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
          
          {/* Floating label for active pillar - compact */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePillar}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.45) 100%)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
                }}
              >
                <span 
                  className="text-xs font-medium"
                  style={{ 
                    color: "#1a1a1a",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {pillars.find(p => p.id === activePillar)?.name}
                </span>
                <span 
                  className="text-[8px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: pillars.find(p => p.id === activePillar)?.badge.text === "Live" 
                      ? "rgba(26,26,26,0.85)" 
                      : "rgba(26,26,26,0.12)",
                    color: pillars.find(p => p.id === activePillar)?.badge.text === "Live"
                      ? "#fff"
                      : "rgba(26,26,26,0.6)",
                  }}
                >
                  {pillars.find(p => p.id === activePillar)?.badge.text}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// BROWSER SIMULATION DEMO (Light)
// ============================================

function BrowserDemo({ activeFeature }: { activeFeature?: string }) {
  const [clickCount, setClickCount] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [activeTab, setActiveTab] = useState<"crm" | "gmail" | "calendar">("crm");
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isClicking, setIsClicking] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  
  // Respond to feature clicks
  useEffect(() => {
    if (activeFeature === "surveys") {
      setShowSurvey(true);
    } else {
      setShowSurvey(false);
    }
    if (activeFeature === "api") {
      setActiveTab("crm");
    }
  }, [activeFeature]);
  
  useEffect(() => {
    const interval = setInterval(() => setFocusTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sequence = [
      { x: 25, y: 30 }, { x: 50, y: 30 }, { x: 35, y: 55 },
      { x: 35, y: 65 }, { x: 52, y: 5 }, { x: 40, y: 45 },
    ];
    let index = 0;
    const interval = setInterval(() => {
      const pos = sequence[index % sequence.length];
      setCursorPos(pos);
      setIsClicking(true);
      setClickCount(prev => prev + 1);
      setTimeout(() => setIsClicking(false), 150);
      if (index % 5 === 4) {
        setActiveTab(["crm", "gmail", "calendar"][Math.floor(index / 5) % 3] as "crm" | "gmail" | "calendar");
      }
      if (pos.y > 45 && pos.y < 85) {
        setSelectedRow(Math.floor((pos.y - 45) / 10));
      } else {
        setSelectedRow(null);
      }
      index++;
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 h-full flex flex-col">
      {/* Browser Chrome */}
      <div className="bg-gradient-to-b from-gray-700 to-gray-800 px-3 py-2 flex items-center gap-2 border-b border-gray-600 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          {[
            { id: "crm", label: "CRM" },
            { id: "gmail", label: "Gmail" },
            { id: "calendar", label: "Calendar" },
          ].map((tab) => (
            <div
              key={tab.id}
              className={`px-3 py-1 rounded-t-lg text-[10px] font-medium transition-all ${
                activeTab === tab.id ? "bg-white text-gray-800" : "bg-gray-600 text-gray-300"
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>
        
        <div className="flex-1" />
        <div className="p-1.5 rounded-lg bg-gray-700">
          <Sparkles className="w-4 h-4 text-gray-300" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative flex-1 min-h-[360px] bg-white overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-700" />
              <span className="font-semibold text-gray-800 text-sm">Sales Dashboard</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-300" />
          </div>
          
          <div className="p-3">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { label: "Revenue", value: "$124K" },
                { label: "Deals", value: "47" },
                { label: "Conversion", value: "23%" },
                { label: "Pipeline", value: "$890K" },
              ].map((m) => (
                <div key={m.label} className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-[9px] text-gray-500">{m.label}</p>
                  <p className="text-sm font-bold text-gray-900">{m.value}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-700">Recent Deals</span>
              </div>
              {[
                { name: "Acme Corp", amount: "$45,000" },
                { name: "TechStart", amount: "$28,500" },
                { name: "Global Sys", amount: "$67,200" },
              ].map((deal, i) => (
                <div
                  key={deal.name}
                  className={`px-3 py-2 border-b border-gray-100 flex items-center justify-between transition-all ${
                    selectedRow === i ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
                      {deal.name[0]}
                    </div>
                    <span className="text-xs font-medium text-gray-900">{deal.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{deal.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Cursor */}
        <motion.div
          className="absolute pointer-events-none z-50"
          animate={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%`, scale: isClicking ? 0.85 : 1 }}
          transition={{ left: { duration: 0.5 }, top: { duration: 0.5 }, scale: { duration: 0.1 } }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="#111827" stroke="#fff" strokeWidth="1.5"/>
          </svg>
        </motion.div>
        
        {/* Extension Popup - Changes based on active feature */}
        <AnimatePresence mode="wait">
          {activeFeature === "surveys" ? (
            <motion.div
              key="survey"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-2 right-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-30"
            >
              <div className="bg-gray-900 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-white" />
                  <span className="text-white font-medium text-[10px]">Quick Survey</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-300">Live</span>
              </div>
              
              <div className="p-3 space-y-2">
                <p className="text-[10px] font-medium text-gray-800">How often do you copy-paste data?</p>
                <div className="space-y-1.5">
                  {["Multiple times/day", "Few times/week", "Rarely"].map((opt, i) => (
                    <motion.button
                      key={opt}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[9px] bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors"
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
                <div className="pt-1 border-t border-gray-100">
                  <p className="text-[8px] text-gray-400">12 responses collected</p>
                </div>
              </div>
            </motion.div>
          ) : activeFeature === "api" ? (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-2 right-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-30"
            >
              <div className="bg-gray-900 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-white" />
                  <span className="text-white font-medium text-[10px]">API Sync</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-300">Live</span>
              </div>
              
              <div className="p-2 space-y-1.5">
                {[
                  { name: "Salesforce", status: "synced", records: "1,247" },
                  { name: "SAP", status: "synced", records: "892" },
                  { name: "HubSpot", status: "pending", records: "—" },
                ].map((api, i) => (
                  <motion.div
                    key={api.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${api.status === "synced" ? "bg-green-500" : "bg-gray-300"}`} />
                      <span className="text-[9px] font-medium text-gray-700">{api.name}</span>
                    </div>
                    <span className="text-[8px] text-gray-400">{api.records}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : activeFeature === "browser" ? (
            <motion.div
              key="browser"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-2 right-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-30"
            >
              <div className="bg-gray-900 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-white" />
                  <span className="text-white font-medium text-[10px]">Browser Extension</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-300">On</span>
              </div>
              
              <div className="p-2 space-y-1.5">
                {[
                  { name: "Chrome", version: "v2.4.1", active: true },
                  { name: "macOS App", version: "v1.2.0", active: true },
                  { name: "Windows", version: "v1.1.8", active: false },
                ].map((device, i) => (
                  <motion.div
                    key={device.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${device.active ? "bg-green-500" : "bg-gray-300"}`} />
                      <span className="text-[9px] font-medium text-gray-700">{device.name}</span>
                    </div>
                    <span className="text-[8px] text-gray-400">{device.version}</span>
                  </motion.div>
                ))}
                <div className="pt-1 border-t border-gray-100">
                  <p className="text-[8px] text-gray-400">Capturing across 3 devices</p>
                </div>
              </div>
            </motion.div>
          ) : activeFeature === "monitoring" ? (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-2 right-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-30"
            >
              <div className="bg-gray-900 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-white font-medium text-[10px]">Workflow Patterns</span>
                </div>
              </div>
              
              <div className="p-2 space-y-1.5">
                <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-[9px] font-medium text-gray-700 mb-1">Top Patterns Detected</p>
                  <div className="space-y-1">
                    {[
                      { pattern: "Copy-paste invoice data", count: 23 },
                      { pattern: "Manual report export", count: 18 },
                      { pattern: "Tab switching CRM→Excel", count: 45 },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[8px] text-gray-500 truncate flex-1">{p.pattern}</span>
                        <span className="text-[8px] font-medium text-gray-700 ml-2">{p.count}x</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span className="text-[9px] font-medium text-amber-800">3 automation opportunities</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-2 right-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-30"
            >
              <div className="bg-gray-900 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span className="text-white font-medium text-[10px]">Pharo Light</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/10 text-white">Active</span>
              </div>
              
              <div className="p-2 space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-1 mb-0.5">
                      <MousePointerClick className="w-2.5 h-2.5 text-gray-400" />
                      <span className="text-[8px] text-gray-500">Clicks</span>
                    </div>
                    <motion.p key={clickCount} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="text-base font-bold text-gray-900">
                      {clickCount}
                    </motion.p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Clock className="w-2.5 h-2.5 text-gray-400" />
                      <span className="text-[8px] text-gray-500">Focus</span>
                    </div>
                    <p className="text-base font-bold text-gray-900">
                      {Math.floor(focusTime / 60)}:{String(focusTime % 60).padStart(2, '0')}
                    </p>
                  </div>
                </div>
                
                <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Sparkles className="w-3 h-3 text-gray-500" />
                    <span className="text-[9px] font-medium text-gray-700">3 opportunities</span>
                  </div>
                  <p className="text-[8px] text-gray-500">Invoice copy-paste detected</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// PLATFORM PREVIEW DEMO (Forge) - Enhanced Interactive
// ============================================

function PlatformDemo({ activeFeature }: { activeFeature?: string }) {
  const [activeView, setActiveView] = useState<"projects" | "initiatives" | "teams" | "okrs">("projects");
  const [selectedProject, setSelectedProject] = useState<string | null>("Invoice Automation");
  
  // Respond to feature clicks from parent
  useEffect(() => {
    if (activeFeature === "projects") {
      setActiveView("projects");
    } else if (activeFeature === "teams") {
      setActiveView("teams");
    } else if (activeFeature === "okrs") {
      setActiveView("okrs");
    }
  }, [activeFeature]);
  
  const projects = [
    { name: "Invoice Automation", status: "Active", progress: 65, team: ["SC", "MJ", "JD"], dueIn: "2 weeks" },
    { name: "Budget Planning", status: "Active", progress: 85, team: ["AG", "TW"], dueIn: "5 days" },
    { name: "Expense Tracking", status: "Planned", progress: 0, team: ["JD"], dueIn: "1 month" },
  ];

  const initiatives = [
    { id: "1", title: "Implement OCR scanning", status: "done", priority: "high" },
    { id: "2", title: "Connect SAP integration", status: "in_progress", priority: "high" },
    { id: "3", title: "Create approval workflow", status: "in_progress", priority: "medium" },
    { id: "4", title: "Build tracking dashboard", status: "todo", priority: "low" },
    { id: "5", title: "Email notifications", status: "todo", priority: "medium" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
      <div className="flex h-[380px]">
        {/* Mini Sidebar */}
        <div className="w-14 bg-gray-50 border-r border-gray-100 py-3 flex flex-col items-center gap-2">
          {/* Sapira Logo */}
          <div 
            className="rounded-[4px] overflow-hidden flex items-center justify-center mb-2"
            style={{
              padding: "4px 8px",
              background: "linear-gradient(145deg, #1a1a1f 0%, #252530 40%, #1f1f25 100%)",
              boxShadow: "inset 0 0.5px 0.5px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            <span 
              className="select-none"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 8,
                fontWeight: 400,
                letterSpacing: "0.01em",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              Sapira
            </span>
          </div>
          <div className="w-8 h-px bg-gray-200" />
          {[
            { id: "projects", icon: FolderKanban, label: "Projects" },
            { id: "initiatives", icon: CheckCircle2, label: "Tasks" },
            { id: "teams", icon: Users, label: "Teams" },
            { id: "okrs", icon: Target, label: "OKRs" },
          ].map((item) => (
            <motion.button 
              key={item.id}
              onClick={() => setActiveView(item.id as "projects" | "initiatives" | "teams" | "okrs")}
              className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                activeView === item.id 
                  ? "bg-white shadow-md border border-gray-200" 
                  : "hover:bg-white/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className={`w-4 h-4 ${activeView === item.id ? "text-gray-900" : "text-gray-400"}`} />
              <span className={`text-[8px] ${activeView === item.id ? "text-gray-900" : "text-gray-400"}`}>{item.label}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Projects View - Project Management */}
            {activeView === "projects" && (
              <motion.div key="projects" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col">
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">Project Management</span>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gray-900 text-white">3 active</span>
                </div>
                <div className="flex-1 p-3 overflow-auto">
                  <div className="space-y-2">
                    {projects.map((project, i) => (
                      <motion.div
                        key={project.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setSelectedProject(selectedProject === project.name ? null : project.name)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedProject === project.name 
                            ? "border-gray-300 bg-gray-50 shadow-sm" 
                            : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900 text-sm">{project.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            project.status === "Active" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        
                        {project.progress > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-gray-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress}%` }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium">{project.progress}%</span>
                          </div>
                        )}
                        
                        <AnimatePresence>
                          {selectedProject === project.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  {project.team.map((member, j) => (
                                    <motion.div 
                                      key={member}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: j * 0.05 }}
                                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-medium text-gray-600 -ml-1 first:ml-0 border-2 border-white"
                                    >
                                      {member}
                                    </motion.div>
                                  ))}
                                </div>
                                <span className="text-[10px] text-gray-500">Due in {project.dueIn}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Initiatives/Tasks View */}
            {activeView === "initiatives" && (
              <motion.div key="initiatives" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col">
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">Initiatives & Tasks</span>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-blue-100 text-blue-700">5 tasks</span>
                </div>
                <div className="flex-1 p-3 overflow-auto">
                  {/* Kanban-like columns */}
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {/* To Do */}
                    <div className="bg-gray-50 rounded-xl p-2">
                      <div className="flex items-center gap-1.5 mb-2 px-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-[10px] font-medium text-gray-600">To Do</span>
                        <span className="text-[9px] text-gray-400 ml-auto">2</span>
                      </div>
                      <div className="space-y-1.5">
                        {initiatives.filter(t => t.status === "todo").map((task, i) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm"
                          >
                            <p className="text-[10px] text-gray-800 font-medium mb-1">{task.title}</p>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                              task.priority === "high" ? "bg-red-100 text-red-600" : 
                              task.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"
                            }`}>
                              {task.priority}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* In Progress */}
                    <div className="bg-blue-50 rounded-xl p-2">
                      <div className="flex items-center gap-1.5 mb-2 px-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-medium text-blue-700">In Progress</span>
                        <span className="text-[9px] text-blue-400 ml-auto">2</span>
                      </div>
                      <div className="space-y-1.5">
                        {initiatives.filter(t => t.status === "in_progress").map((task, i) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="bg-white p-2 rounded-lg border border-blue-200 shadow-sm"
                          >
                            <p className="text-[10px] text-gray-800 font-medium mb-1">{task.title}</p>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                              task.priority === "high" ? "bg-red-100 text-red-600" : 
                              task.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"
                            }`}>
                              {task.priority}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Done */}
                    <div className="bg-green-50 rounded-xl p-2">
                      <div className="flex items-center gap-1.5 mb-2 px-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[10px] font-medium text-green-700">Done</span>
                        <span className="text-[9px] text-green-400 ml-auto">1</span>
                      </div>
                      <div className="space-y-1.5">
                        {initiatives.filter(t => t.status === "done").map((task, i) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className="bg-white p-2 rounded-lg border border-green-200 shadow-sm"
                          >
                            <p className="text-[10px] text-gray-800 font-medium mb-1 line-through opacity-60">{task.title}</p>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                              task.priority === "high" ? "bg-red-100 text-red-600" : 
                              task.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"
                            }`}>
                              {task.priority}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Teams View - Conversation, Activity & Triage */}
            {activeView === "teams" && (
              <motion.div key="teams" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col">
                <div className="border-b border-gray-100 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">#project-alpha</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] text-gray-500">12 online</span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  {/* Conversation */}
                  <div className="p-2 space-y-2 border-b border-gray-100">
                    {[
                      { user: "SC", name: "Sara C.", msg: "Just pushed the invoice automation update 🚀", time: "10:42", isOwn: false },
                      { user: "MJ", name: "Mike J.", msg: "Great! Running tests now. ETA 15 min.", time: "10:44", isOwn: false },
                      { user: "You", name: "You", msg: "Perfect, let me know when it's ready for review", time: "10:45", isOwn: true },
                    ].map((message, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex gap-2 ${message.isOwn ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium shrink-0 ${
                          message.isOwn ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"
                        }`}>
                          {message.user}
                        </div>
                        <div className={`max-w-[75%] ${message.isOwn ? "text-right" : ""}`}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-medium text-gray-700">{message.name}</span>
                            <span className="text-[8px] text-gray-400">{message.time}</span>
                          </div>
                          <div className={`px-2.5 py-1.5 rounded-xl text-[11px] ${
                            message.isOwn ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
                          }`}>
                            {message.msg}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Triage Section */}
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] text-gray-400 uppercase tracking-wide">Triage</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">3 pending</span>
                    </div>
                    {[
                      { task: "Review PR #142", priority: "high", from: "Sara" },
                      { task: "Approve budget change", priority: "medium", from: "Finance" },
                      { task: "Schedule demo call", priority: "low", from: "Sales" },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center justify-between py-1 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            item.priority === "high" ? "bg-red-500" : 
                            item.priority === "medium" ? "bg-amber-500" : "bg-gray-400"
                          }`} />
                          <span className="text-[10px] text-gray-700 group-hover:text-gray-900">{item.task}</span>
                        </div>
                        <span className="text-[9px] text-gray-400">{item.from}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="p-2">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide block mb-1.5">Recent Activity</span>
                    {[
                      { action: "Sara completed Invoice OCR task", time: "2m", icon: "✓" },
                      { action: "Mike joined the channel", time: "15m", icon: "→" },
                      { action: "New file uploaded: specs.pdf", time: "1h", icon: "📎" },
                    ].map((activity, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="flex items-center gap-2 py-1"
                      >
                        <span className="text-[10px]">{activity.icon}</span>
                        <span className="text-[10px] text-gray-600 flex-1">{activity.action}</span>
                        <span className="text-[8px] text-gray-400">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* OKRs View - Enhanced OKR Settings */}
            {activeView === "okrs" && (
              <motion.div key="okrs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col">
                <div className="border-b border-gray-100 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">OKR Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-500">Q1 2026</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-900 text-white">58% on track</span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  {/* Summary Stats */}
                  <div className="p-2 border-b border-gray-100">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Objectives", value: "4", status: "active" },
                        { label: "Key Results", value: "12", status: "tracking" },
                        { label: "At Risk", value: "2", status: "warning" },
                      ].map((stat, i) => (
                        <motion.div 
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-2 rounded-lg bg-gray-50 text-center"
                        >
                          <p className={`text-lg font-bold ${
                            stat.status === "warning" ? "text-amber-600" : "text-gray-900"
                          }`}>{stat.value}</p>
                          <p className="text-[8px] text-gray-500 uppercase">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* OKR Cards */}
                  <div className="p-2 space-y-2">
                    {[
                      { 
                        objective: "Increase operational efficiency", 
                        owner: "SC",
                        progress: 72,
                        status: "on-track",
                        keyResults: [
                          { name: "Reduce manual tasks by 50%", progress: 85, trend: "up" },
                          { name: "Automate 10 workflows", progress: 60, trend: "up" },
                          { name: "Cut processing time 30%", progress: 70, trend: "stable" },
                        ]
                      },
                      { 
                        objective: "Improve team collaboration", 
                        owner: "MJ",
                        progress: 45,
                        status: "at-risk",
                        keyResults: [
                          { name: "100% team onboarding", progress: 90, trend: "up" },
                          { name: "Weekly sync completion", progress: 30, trend: "down" },
                          { name: "NPS score > 8", progress: 15, trend: "down" },
                        ]
                      },
                    ].map((okr, i) => (
                      <motion.div 
                        key={okr.objective} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className={`p-2.5 rounded-xl border bg-white ${
                          okr.status === "at-risk" ? "border-amber-200" : "border-gray-100"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-medium text-gray-900 text-[12px]">{okr.objective}</p>
                              {okr.status === "at-risk" && (
                                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">At Risk</span>
                              )}
                            </div>
                            <span className="text-[9px] text-gray-400">Owner: {okr.owner}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{okr.progress}%</p>
                          </div>
                        </div>
                        
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-2">
                          <motion.div 
                            className={`h-full rounded-full ${
                              okr.status === "at-risk" ? "bg-amber-500" : "bg-gray-800"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${okr.progress}%` }}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          {okr.keyResults.map((kr, j) => (
                            <div key={kr.name} className="flex items-center gap-2 py-0.5">
                              <div className="flex-1 flex items-center gap-1.5">
                                <div className={`w-1 h-1 rounded-full ${
                                  kr.progress >= 70 ? "bg-green-500" : 
                                  kr.progress >= 40 ? "bg-amber-500" : "bg-red-500"
                                }`} />
                                <span className="text-[9px] text-gray-600 truncate">{kr.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={`text-[9px] ${
                                  kr.trend === "up" ? "text-green-600" : 
                                  kr.trend === "down" ? "text-red-500" : "text-gray-400"
                                }`}>
                                  {kr.trend === "up" ? "↑" : kr.trend === "down" ? "↓" : "→"}
                                </span>
                                <span className="text-[9px] font-medium text-gray-500 w-7 text-right">{kr.progress}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEPLOY PREVIEW DEMO (Tower)
// ============================================

function DeployDemo({ activeFeature }: { activeFeature?: string }) {
  const [activeTab, setActiveTab] = useState<"compliance" | "metrics" | "ai-evals" | "billing">("metrics");
  
  // Respond to feature clicks from parent
  useEffect(() => {
    if (activeFeature === "compliance" || activeFeature === "metrics" || activeFeature === "ai-evals" || activeFeature === "billing") {
      setActiveTab(activeFeature);
    }
  }, [activeFeature]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg h-full">
      <div className="flex h-full min-h-[420px]">
        {/* Mini Sidebar */}
        <div className="w-12 bg-gray-50 border-r border-gray-100 py-3 flex flex-col items-center gap-2">
          {/* Sapira Logo */}
          <div 
            className="rounded-[4px] overflow-hidden flex items-center justify-center"
            style={{
              padding: "4px 8px",
              background: "linear-gradient(145deg, #1a1a1f 0%, #252530 40%, #1f1f25 100%)",
              boxShadow: "inset 0 0.5px 0.5px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            <span 
              className="select-none"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 8,
                fontWeight: 400,
                letterSpacing: "0.01em",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              Sapira
            </span>
          </div>
          <div className="w-8 h-px bg-gray-200 my-1" />
          {[
            { id: "compliance", icon: Shield },
            { id: "metrics", icon: BarChart3 },
            { id: "ai-evals", icon: Gauge },
            { id: "billing", icon: DollarSign },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as "compliance" | "metrics" | "ai-evals" | "billing")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                activeTab === item.id ? "bg-white shadow-sm border border-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-gray-900" : "text-gray-400"}`} />
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "metrics" && (
              <motion.div key="metrics" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full">
                <div className="border-b border-gray-100 px-4 py-3">
                  <span className="font-semibold text-gray-900 text-sm">Business Impact</span>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: "Hours Saved", value: "1,247h", change: "+23%" },
                      { label: "ROI", value: "127%", change: "+15%" },
                      { label: "Cost Reduction", value: "$34.5K", change: "+12%" },
                      { label: "Automations", value: "12", change: "+3" },
                    ].map((m, i) => (
                      <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} 
                        className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] text-gray-500">{m.label}</span>
                          <span className="text-[9px] font-medium text-gray-600 flex items-center gap-0.5">
                            <ArrowUpRight className="w-2.5 h-2.5" />{m.change}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{m.value}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-medium text-gray-700 mb-2">Weekly Performance</p>
                    <div className="flex items-end justify-between h-10">
                      {[45, 52, 48, 61, 55, 67, 72].map((v, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: 0.2 + i * 0.05 }} 
                          className="w-4 bg-gray-400 rounded-t-sm"/>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "compliance" && (
              <motion.div key="compliance" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full">
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-sm">Compliance & Audit Trails</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700">Compliant</span>
                </div>
                <div className="p-3 space-y-2">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-500">Last Audit</span>
                      <span className="text-[10px] text-gray-700 font-medium">Jan 10, 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">All checks passed</span>
                    </div>
                  </div>
                  {[
                    { action: "User authentication verified", time: "2 min ago", status: "passed" },
                    { action: "Data encryption validated", time: "5 min ago", status: "passed" },
                    { action: "Access permissions reviewed", time: "1 hour ago", status: "passed" },
                    { action: "Workflow approval logged", time: "3 hours ago", status: "passed" },
                  ].map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-2 rounded-lg border border-gray-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-gray-400" />
                        <span className="text-[11px] text-gray-700">{log.action}</span>
                      </div>
                      <span className="text-[9px] text-gray-400">{log.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "ai-evals" && (
              <motion.div key="ai-evals" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col">
                <div className="border-b border-gray-100 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">AI Model Evaluations</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">2 healthy</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">1 needs review</span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  {/* Summary Stats */}
                  <div className="p-2 border-b border-gray-100">
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "Avg Accuracy", value: "89.7%", trend: "+2.1%" },
                        { label: "Avg Latency", value: "135ms", trend: "-12ms" },
                        { label: "Total Calls", value: "25.7K", trend: "+4.2K" },
                        { label: "Error Rate", value: "0.3%", trend: "-0.1%" },
                      ].map((stat, i) => (
                        <motion.div 
                          key={stat.label}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-1.5 rounded-lg bg-gray-50 text-center"
                        >
                          <p className="text-[11px] font-bold text-gray-900">{stat.value}</p>
                          <p className="text-[7px] text-gray-400 uppercase">{stat.label}</p>
                          <p className="text-[8px] text-green-600">{stat.trend}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Model Cards */}
                  <div className="p-2 space-y-2">
                    {[
                      { 
                        name: "Invoice Extraction", 
                        version: "v2.4.1",
                        status: "healthy",
                        accuracy: 97, 
                        precision: 96,
                        recall: 98,
                        f1: 97,
                        latency: "120ms", 
                        calls: "12.4K",
                        trend: [92, 94, 95, 96, 97, 97],
                        lastEval: "2h ago"
                      },
                      { 
                        name: "Email Classification", 
                        version: "v1.8.3",
                        status: "healthy",
                        accuracy: 94, 
                        precision: 93,
                        recall: 95,
                        f1: 94,
                        latency: "85ms", 
                        calls: "8.2K",
                        trend: [91, 92, 93, 93, 94, 94],
                        lastEval: "4h ago"
                      },
                      { 
                        name: "Data Validation", 
                        version: "v1.2.0",
                        status: "warning",
                        accuracy: 78, 
                        precision: 82,
                        recall: 74,
                        f1: 78,
                        latency: "200ms", 
                        calls: "5.1K",
                        trend: [85, 83, 81, 80, 79, 78],
                        lastEval: "1h ago"
                      },
                    ].map((model, i) => (
                      <motion.div 
                        key={model.name} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className={`p-2.5 rounded-xl border ${
                          model.status === "warning" ? "border-amber-200 bg-amber-50/30" : "border-gray-100 bg-white"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-gray-900 text-[12px]">{model.name}</span>
                              <span className="text-[8px] px-1 py-0.5 rounded bg-gray-100 text-gray-500">{model.version}</span>
                            </div>
                            <span className="text-[9px] text-gray-400">Last eval: {model.lastEval}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              model.status === "healthy" ? "bg-green-500" : "bg-amber-500"
                            }`} />
                            <span className="text-lg font-bold text-gray-900">{model.accuracy}%</span>
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-4 gap-1 mb-2">
                          {[
                            { label: "Precision", value: model.precision },
                            { label: "Recall", value: model.recall },
                            { label: "F1 Score", value: model.f1 },
                            { label: "Latency", value: model.latency },
                          ].map((metric) => (
                            <div key={metric.label} className="text-center p-1 rounded bg-gray-50">
                              <p className="text-[10px] font-medium text-gray-700">
                                {typeof metric.value === "number" ? `${metric.value}%` : metric.value}
                              </p>
                              <p className="text-[7px] text-gray-400 uppercase">{metric.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Trend Line */}
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] text-gray-400">7d trend</span>
                          <div className="flex-1 flex items-end gap-0.5 h-4">
                            {model.trend.map((v, j) => (
                              <motion.div 
                                key={j}
                                initial={{ height: 0 }}
                                animate={{ height: `${(v / 100) * 100}%` }}
                                transition={{ delay: 0.3 + j * 0.03 }}
                                className={`flex-1 rounded-sm ${
                                  model.status === "warning" 
                                    ? (j === model.trend.length - 1 ? "bg-amber-500" : "bg-amber-300")
                                    : (j === model.trend.length - 1 ? "bg-gray-800" : "bg-gray-300")
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-[9px] font-medium ${
                            model.trend[model.trend.length - 1] > model.trend[0] ? "text-green-600" : "text-red-500"
                          }`}>
                            {model.trend[model.trend.length - 1] > model.trend[0] ? "↑" : "↓"}
                            {Math.abs(model.trend[model.trend.length - 1] - model.trend[0])}%
                          </span>
                        </div>

                        {/* Warning message for at-risk models */}
                        {model.status === "warning" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-2 pt-2 border-t border-amber-200 flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span className="text-[9px] text-amber-700">Recall dropping — consider retraining with recent data</span>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div key="billing" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full">
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-sm">Billing & Cost Intelligence</span>
                </div>
                <div className="p-3">
                  <div className="p-3 rounded-lg bg-gray-900 text-white mb-3">
                    <p className="text-[9px] text-gray-400 mb-1">Total Monthly</p>
                    <p className="text-xl font-bold">$14,010</p>
                    <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                      <ArrowDownRight className="w-3 h-3" />
                      <span>-8% vs last month</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ bu: "Finance", cost: 4250 }, { bu: "Operations", cost: 2890 }, { bu: "Technology", cost: 5670 }, { bu: "HR", cost: 1200 }].map((c) => (
                      <div key={c.bu} className="p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-gray-500">{c.bu}</p>
                        <p className="text-sm font-bold text-gray-900">${c.cost.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PILLAR SECTION
// ============================================

function PillarSection({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const [activeFeature, setActiveFeature] = useState<string | undefined>(undefined);
  
  return (
    <section id={pillar.id} className="scroll-mt-24 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-[#1a1a1a]/40 uppercase tracking-widest">{pillar.subtitle}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${pillar.badge.style}`}>
              {pillar.badge.text}
            </span>
          </div>
          
          <h2 
            className="text-5xl lg:text-6xl text-[#1a1a1a] mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400 }}
          >
            {pillar.name}
          </h2>
          
          <p 
            className="text-2xl lg:text-3xl text-[#1a1a1a]/60 max-w-2xl"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 300 }}
          >
            {pillar.tagline}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Features - Now clickable */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-lg text-[#1a1a1a]/50 mb-6">{pillar.description}</p>
            
            {pillar.features.map((feature, i) => {
              const isActive = activeFeature === feature.demoTarget;
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => setActiveFeature(isActive ? undefined : feature.demoTarget)}
                  className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all group ${
                    isActive 
                      ? "border-[#1a1a1a] shadow-lg ring-1 ring-[#1a1a1a]/10" 
                      : "border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-4">
                    {"icon" in feature && feature.icon && (
                      <div className={`p-2 rounded-xl transition-colors ${
                        isActive ? "bg-[#1a1a1a] text-white" : "bg-[#1a1a1a]/5 group-hover:bg-[#1a1a1a]/10"
                      }`}>
                        <feature.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#1a1a1a]"}`} />
                      </div>
                    )}
                    {"logos" in feature && feature.logos && (
                      <div className={`flex gap-1.5 p-2 rounded-xl transition-colors ${
                        isActive ? "bg-[#1a1a1a]" : "bg-[#1a1a1a]/5 group-hover:bg-[#1a1a1a]/10"
                      }`}>
                        {feature.logos.map((Logo, j) => (
                          <div key={j} className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center">
                            <Logo className="w-4 h-4" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-[#1a1a1a] mb-1">{feature.title}</h4>
                        <motion.div 
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isActive ? "bg-[#1a1a1a]" : "bg-[#1a1a1a]/5 group-hover:bg-[#1a1a1a]/10"
                          }`}
                          animate={{ rotate: isActive ? 45 : 0 }}
                        >
                          <ChevronRight className={`w-3 h-3 ${isActive ? "text-white" : "text-[#1a1a1a]/50"}`} />
                        </motion.div>
                      </div>
                      <p className="text-sm text-[#1a1a1a]/50">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Demo - Now receives activeFeature */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-32"
          >
            {pillar.id === "light" && <BrowserDemo activeFeature={activeFeature} />}
            {pillar.id === "forge" && <PlatformDemo activeFeature={activeFeature} />}
            {pillar.id === "tower" && <DeployDemo activeFeature={activeFeature} />}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function PlatformPage() {
  const [activePillar, setActivePillar] = useState(pillars[0].id);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Show indicator after scrolling past hero, hide near footer
      const nearBottom = scrollY + windowHeight > docHeight - 400;
      setShowScrollIndicator(scrollY > 400 && !nearBottom);
      
      for (const pillar of pillars) {
        const el = document.getElementById(pillar.id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollY >= offsetTop - 300 && scrollY < offsetTop + offsetHeight - 300) {
            setActivePillar(pillar.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPillar = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <LiquidGlassCursor enabled={true} size={40} zIndex={9999} />
      <NavbarMinimal />
      
      {/* Scroll Progress Indicator - Right Side */}
      <ScrollProgressIndicator 
        activePillar={activePillar} 
        onPillarClick={scrollToPillar}
        visible={showScrollIndicator}
      />

      {/* Hero - Full viewport height */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-32">
        <div className="text-center max-w-4xl">
          <motion.p 
            className="text-sm uppercase tracking-[0.3em] mb-6 text-[#1a1a1a]/40"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            Our Platform
          </motion.p>
          
          <motion.h1 
            className="leading-[0.95] tracking-[-0.03em] text-[#1a1a1a] mb-4"
            style={{ 
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.8rem, 10vw, 5.5rem)",
              fontWeight: 400,
            }}
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
          >
            Three pillars.
          </motion.h1>
          
          <motion.h1 
            className="leading-[0.95] tracking-[-0.03em] italic text-[#1a1a1a] mb-8"
            style={{ 
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.8rem, 10vw, 5.5rem)",
              fontWeight: 400,
            }}
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
          >
            One platform.
          </motion.h1>
          
          <motion.p 
            className="text-xl lg:text-2xl text-[#1a1a1a]/50 max-w-xl mx-auto"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 300 }}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
          >
            Pharo unifies discovery, execution, and oversight into a seamless experience.
          </motion.p>
          
          {/* Scroll indicator */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(26,26,26,0.3)" strokeWidth="1.5" className="mx-auto">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      {pillars.map((pillar, index) => (
        <PillarSection key={pillar.id} pillar={pillar} index={index} />
      ))}

      {/* Footer - Premium Dark Liquid Glass Experience */}
      <footer className="relative bg-[#F5F5F3] overflow-hidden">
        {/* Watermark - extra wide, elegant, behind everything */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <h2 
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(280px, 42vw, 700px)",
              fontWeight: 400,
              color: "rgba(0,0,0,0.025)",
              letterSpacing: "-0.02em",
              lineHeight: 0.8,
              transform: "translateY(10%)",
            }}
          >
            Sapira
          </h2>
        </div>
        
        {/* Content */}
        <div className="relative z-10 px-6">
          {/* Main CTA in dark liquid glass card */}
          <div className="max-w-4xl mx-auto pt-32 pb-20">
            <motion.div
              className="rounded-3xl p-12 md:p-16 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(26,26,30,0.92) 0%, rgba(20,20,24,0.88) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: `
                  0 40px 80px rgba(0,0,0,0.25),
                  0 20px 40px rgba(0,0,0,0.15),
                  inset 0 1px 0 rgba(255,255,255,0.08),
                  inset 0 -1px 0 rgba(0,0,0,0.2)
                `,
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl mb-6"
                style={{ 
                  fontFamily: "Georgia, 'Times New Roman', serif", 
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: "rgba(255,255,255,0.95)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Ready to see it
                <br />
                <em style={{ color: "rgba(255,255,255,0.6)" }}>in action?</em>
              </motion.h2>
              
              <motion.p 
                className="text-base md:text-lg mb-10 max-w-md mx-auto"
                style={{ color: "rgba(255,255,255,0.4)" }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Experience the platform with a guided demo tailored to your needs.
              </motion.p>
              
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link 
                  href="/start"
                  className="group relative"
                >
                  <motion.div
                    className="relative px-12 py-4 rounded-full overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.15),
                        0 8px 32px rgba(0,0,0,0.12)
                      `,
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%)",
                      borderColor: "rgba(255,255,255,0.25)",
                      boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.2),
                        0 12px 40px rgba(0,0,0,0.15)
                      `,
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span 
                      className="flex items-center gap-3 text-[15px] tracking-wide"
                      style={{ 
                        fontFamily: "var(--font-geist-sans)",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      Discover
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 16 16" 
                        fill="none"
                        className="opacity-50 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all duration-300"
                      >
                        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
        </div>
      </footer>
    </div>
  );
}
