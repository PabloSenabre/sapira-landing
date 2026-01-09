"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import NavbarMinimal from "@/components/NavbarMinimal";
import Link from "next/link";
import {
  Chrome,
  MousePointerClick,
  Monitor,
  Clock,
  Sparkles,
  Shield,
  Search,
  Bell,
  Settings,
  Menu,
  BarChart3,
  Globe,
  Briefcase,
  FolderKanban,
  Target,
  ChevronRight,
  Users,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Zap,
  DollarSign,
  Gauge,
  Check,
  Loader2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
} from "lucide-react";

/**
 * Our Platform Page - Interactive Demo Experience
 * 
 * Shows the 3 pillars of Pharo with live interactive demos:
 * - Light (Discovery) - Browser simulation with Chrome extension
 * - Forge (PMO) - Platform preview with BU/Projects/Initiatives
 * - Tower (Monitoring) - Deploy preview with metrics & evals
 */

// ============================================
// LIGHT: Browser Simulation (Discovery Demo)
// ============================================

function BrowserSimulation() {
  const [clickCount, setClickCount] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isClicking, setIsClicking] = useState(false);
  const [activeTab, setActiveTab] = useState<"crm" | "gmail" | "calendar">("crm");
  const [actionIndex, setActionIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Focus timer
  useEffect(() => {
    const interval = setInterval(() => setFocusTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Action sequence
  const ACTION_SEQUENCE = [
    { type: "move", x: 18, y: 28 },
    { type: "wait", duration: 400 },
    { type: "click" },
    { type: "move", x: 42, y: 28 },
    { type: "click" },
    { type: "move", x: 35, y: 58 },
    { type: "click" },
    { type: "move", x: 52, y: 3 },
    { type: "click" },
    { type: "tab", tab: "gmail" },
    { type: "move", x: 40, y: 42 },
    { type: "click" },
    { type: "move", x: 62, y: 3 },
    { type: "click" },
    { type: "tab", tab: "calendar" },
    { type: "move", x: 35, y: 45 },
    { type: "click" },
    { type: "move", x: 42, y: 3 },
    { type: "click" },
    { type: "tab", tab: "crm" },
    { type: "wait", duration: 1000 },
  ];

  useEffect(() => {
    const action = ACTION_SEQUENCE[actionIndex % ACTION_SEQUENCE.length] as any;

    const executeAction = () => {
      switch (action.type) {
        case "move":
          setCursorPos({ x: action.x, y: action.y });
          break;
        case "click":
          setIsClicking(true);
          setClickCount((prev) => prev + 1);
          setTimeout(() => setIsClicking(false), 150);
          if (cursorPos.y > 45 && cursorPos.y < 85) {
            setSelectedRow(Math.floor((cursorPos.y - 45) / 10));
          }
          break;
        case "tab":
          setActiveTab(action.tab);
          setScrollOffset(0);
          setSelectedRow(null);
          break;
      }
    };

    executeAction();

    const delay =
      action.type === "wait"
        ? action.duration
        : action.type === "move"
        ? 500
        : 300;

    const timeout = setTimeout(() => {
      setActionIndex((prev) => (prev + 1) % ACTION_SEQUENCE.length);
    }, delay);

    return () => clearTimeout(timeout);
  }, [actionIndex, cursorPos.y]);

  const getUrl = () => {
    switch (activeTab) {
      case "crm":
        return "app.company-crm.com/dashboard";
      case "gmail":
        return "mail.google.com/mail/u/0/#inbox";
      case "calendar":
        return "calendar.google.com/calendar/r/week";
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
      {/* Browser Chrome */}
      <div className="bg-gradient-to-b from-gray-700 to-gray-800 px-3 py-2 flex items-center gap-2 border-b border-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 ml-2">
          {[
            { id: "crm", label: "CRM" },
            { id: "gmail", label: "Gmail" },
            { id: "calendar", label: "Calendar" },
          ].map((tab) => (
            <div
              key={tab.id}
              className={`px-3 py-1 rounded-t-lg text-[10px] font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-800"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center ml-2">
          <div className="bg-gray-900/50 rounded-lg px-3 py-1 flex items-center gap-2 text-[10px] max-w-[220px] w-full">
            <Shield className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400 truncate">{getUrl()}</span>
          </div>
        </div>

        {/* Extension icon */}
        <div
          className="p-1.5 rounded-lg bg-amber-500/20 cursor-pointer hover:bg-amber-500/30 transition-colors"
          onClick={() => setShowPopup(!showPopup)}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      {/* Content */}
      <div className="relative h-[320px] bg-white overflow-hidden">
        <AnimatePresence mode="wait">
          {/* CRM Content */}
          {activeTab === "crm" && (
            <motion.div
              key="crm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Menu className="w-5 h-5 text-gray-400" />
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-700" />
                    <span className="font-semibold text-gray-800 text-sm">
                      Sales Dashboard
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                </div>
              </div>

              <motion.div
                className="p-4"
                animate={{ y: -scrollOffset }}
                transition={{ duration: 0.3 }}
              >
                {/* Metrics */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Revenue", value: "$124.5K", change: "+12%" },
                    { label: "Deals", value: "47", change: "+5" },
                    { label: "Conversion", value: "23%", change: "+2%" },
                    { label: "Pipeline", value: "$890K", change: "+18%" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="p-3 rounded-xl border bg-gray-50 border-gray-100"
                    >
                      <p className="text-[10px] text-gray-500">{m.label}</p>
                      <p className="text-lg font-bold text-gray-900">
                        {m.value}
                      </p>
                      <p className="text-[10px] text-emerald-600">{m.change}</p>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-700">
                      Recent Deals
                    </span>
                  </div>
                  {[
                    { name: "Acme Corp", amount: "$45,000", status: "Won" },
                    { name: "TechStart Inc", amount: "$28,500", status: "Pending" },
                    { name: "Global Systems", amount: "$67,200", status: "Won" },
                  ].map((deal, i) => (
                    <div
                      key={deal.name}
                      className={`px-4 py-2.5 border-b border-gray-100 flex items-center justify-between transition-all ${
                        selectedRow === i ? "bg-amber-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          {deal.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {deal.name}
                          </p>
                          <p className="text-xs text-gray-500">{deal.amount}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {deal.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Gmail Content */}
          {activeTab === "gmail" && (
            <motion.div
              key="gmail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full bg-white"
            >
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-4">
                <Menu className="w-5 h-5 text-gray-400" />
                <div className="flex-1 max-w-xl">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <div className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-3 text-sm text-gray-400">
                      Search mail
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex h-[calc(100%-52px)]">
                <div className="w-16 bg-gray-50 border-r border-gray-100 py-2 px-2">
                  {["Inbox", "Starred", "Sent"].map((item) => (
                    <div
                      key={item}
                      className="py-2 px-2 rounded-lg text-[10px] text-gray-600 hover:bg-gray-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex-1 overflow-hidden">
                  {[
                    { from: "John Smith", subject: "Q4 Invoice Review", time: "10:32 AM", unread: true },
                    { from: "Finance Team", subject: "Monthly Report - October", time: "9:15 AM", unread: true },
                    { from: "Sarah Chen", subject: "Re: Project Timeline", time: "Yesterday", unread: false },
                    { from: "HR Department", subject: "Benefits Enrollment", time: "Yesterday", unread: false },
                  ].map((email, i) => (
                    <div
                      key={i}
                      className={`px-4 py-3 border-b border-gray-100 flex items-center gap-3 ${
                        selectedRow === i ? "bg-amber-50" : email.unread ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${email.unread ? "bg-amber-500" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${email.unread ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                            {email.from}
                          </span>
                          <span className="text-[10px] text-gray-400">{email.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{email.subject}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Calendar Content */}
          {activeTab === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Menu className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-800 text-sm">
                    January 2026
                  </span>
                </div>
                <button className="px-3 py-1 text-xs bg-gray-200 rounded-lg">
                  Today
                </button>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-[10px] font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 3;
                    const isCurrentMonth = day >= 0 && day < 31;
                    const hasEvent = [2, 5, 8, 10, 15].includes(day);
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg p-1 text-center ${
                          !isCurrentMonth ? "text-gray-300" : day === 9 ? "bg-amber-500 text-white" : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-[10px]">{isCurrentMonth ? day + 1 : ""}</span>
                        {hasEvent && isCurrentMonth && (
                          <div className="mt-0.5 h-1 w-full bg-amber-300 rounded-full" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 space-y-1.5">
                  <p className="text-[10px] font-medium text-gray-500 uppercase">Upcoming</p>
                  {[
                    { title: "Sprint Planning", time: "10:00 AM" },
                    { title: "Client Call - Acme", time: "2:00 PM" },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                      <div className="w-1 h-8 bg-amber-400 rounded-full" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{event.title}</p>
                        <p className="text-[10px] text-gray-500">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cursor */}
        <motion.div
          className="absolute pointer-events-none z-50"
          animate={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
            scale: isClicking ? 0.85 : 1,
          }}
          transition={{
            left: { duration: 0.5, ease: "easeOut" },
            top: { duration: 0.5, ease: "easeOut" },
            scale: { duration: 0.1 },
          }}
          style={{ transform: "translate(-2px, -2px)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
            <path
              d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.86a.5.5 0 0 0-.85.35Z"
              fill="#111827"
              stroke="#fff"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>

        {/* Extension Popup */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-2 right-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-30"
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-medium text-xs">Pharo Light</span>
                  <span className="ml-auto text-[8px] bg-white/20 px-1.5 py-0.5 rounded text-white">Active</span>
                </div>
              </div>

              <div className="p-2.5 space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-1 mb-0.5">
                      <MousePointerClick className="w-2.5 h-2.5 text-gray-400" />
                      <span className="text-[9px] text-gray-500">Clicks</span>
                    </div>
                    <motion.p
                      key={clickCount}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-bold text-gray-900"
                    >
                      {clickCount}
                    </motion.p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Clock className="w-2.5 h-2.5 text-gray-400" />
                      <span className="text-[9px] text-gray-500">Focus</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.floor(focusTime / 60)}:{String(focusTime % 60).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] text-amber-700 font-medium">3 automation opportunities found</span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 rounded-lg">
                  <Globe className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] text-gray-600 capitalize">{activeTab}</span>
                  <span className="text-[9px] text-gray-400 ml-auto">Tracking</span>
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
// FORGE: Platform Preview (PMO Demo)
// ============================================

function PlatformPreview() {
  const [activeEntity, setActiveEntity] = useState<"bu" | "project" | "initiative">("bu");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
      <div className="flex h-[320px]">
        {/* Mini Sidebar */}
        <div className="w-12 bg-gray-50 border-r border-gray-100 py-3 flex flex-col items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">P</span>
          </div>
          <div className="w-full h-px bg-gray-200 my-1" />
          <button
            onClick={() => setActiveEntity("bu")}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              activeEntity === "bu" ? "bg-white shadow-sm border border-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <Briefcase className={`w-4 h-4 ${activeEntity === "bu" ? "text-orange-500" : "text-gray-400"}`} />
          </button>
          <button
            onClick={() => setActiveEntity("project")}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              activeEntity === "project" ? "bg-white shadow-sm border border-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <FolderKanban className={`w-4 h-4 ${activeEntity === "project" ? "text-orange-500" : "text-gray-400"}`} />
          </button>
          <button
            onClick={() => setActiveEntity("initiative")}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              activeEntity === "initiative" ? "bg-white shadow-sm border border-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <Target className={`w-4 h-4 ${activeEntity === "initiative" ? "text-orange-500" : "text-gray-400"}`} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Business Units View */}
            {activeEntity === "bu" && (
              <motion.div
                key="bu"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full"
              >
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">Business Units</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">4 units</span>
                </div>
                <div className="p-3 space-y-2">
                  {[
                    { name: "Finance", manager: "Sarah Chen", projects: 3, color: "bg-orange-50" },
                    { name: "Operations", manager: "Mike Johnson", projects: 5, color: "bg-gray-50" },
                    { name: "Technology", manager: "Ana García", projects: 8, color: "bg-gray-50" },
                    { name: "Human Resources", manager: "Tom Wilson", projects: 2, color: "bg-gray-50" },
                  ].map((bu, i) => (
                    <motion.div
                      key={bu.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setActiveEntity("project")}
                      className={`p-3 rounded-xl border border-gray-100 ${bu.color} cursor-pointer hover:border-orange-200 transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{bu.name}</p>
                            <p className="text-[10px] text-gray-500">{bu.manager}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">{bu.projects} projects</span>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Projects View */}
            {activeEntity === "project" && (
              <motion.div
                key="project"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full"
              >
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">Projects</span>
                    <span className="text-xs text-gray-400">/ Finance</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">3 projects</span>
                </div>
                <div className="p-3 space-y-2">
                  {[
                    { name: "Invoice Automation", status: "Active", progress: 65, initiatives: 12 },
                    { name: "Budget Planning Tool", status: "Planned", progress: 0, initiatives: 4 },
                    { name: "Expense Tracking", status: "Active", progress: 85, initiatives: 8 },
                  ].map((project, i) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setActiveEntity("initiative")}
                      className="p-3 rounded-xl border border-gray-100 bg-white cursor-pointer hover:border-orange-200 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <FolderKanban className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{project.name}</p>
                            <p className="text-[10px] text-gray-500">{project.initiatives} initiatives</p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          project.status === "Active" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      {project.progress > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-orange-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-500">{project.progress}%</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Initiatives View */}
            {activeEntity === "initiative" && (
              <motion.div
                key="initiative"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full"
              >
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">Initiatives</span>
                    <span className="text-xs text-gray-400">/ Invoice Automation</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">12 items</span>
                </div>
                <div className="p-3 space-y-1.5">
                  {[
                    { title: "Implement OCR for invoice scanning", status: "done", assignee: "JD" },
                    { title: "Connect to SAP for auto-posting", status: "in_progress", assignee: "SC" },
                    { title: "Create approval workflow", status: "in_progress", assignee: "MJ" },
                    { title: "Build dashboard for tracking", status: "todo", assignee: "AG" },
                    { title: "Set up email notifications", status: "todo", assignee: "TW" },
                  ].map((initiative, i) => (
                    <motion.div
                      key={initiative.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-all group"
                    >
                      {initiative.status === "done" ? (
                        <CheckCircle2 className="w-4 h-4 text-orange-500" />
                      ) : initiative.status === "in_progress" ? (
                        <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                      )}
                      <span className={`flex-1 text-sm ${
                        initiative.status === "done" ? "text-gray-400 line-through" : "text-gray-700"
                      }`}>
                        {initiative.title}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-[9px] font-medium text-gray-600">{initiative.assignee}</span>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
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
// TOWER: Deploy Preview (Monitoring Demo)
// ============================================

function DeployPreview() {
  const [activeTab, setActiveTab] = useState<"automations" | "metrics" | "costs">("automations");
  const [deployProgress, setDeployProgress] = useState(0);

  useEffect(() => {
    if (activeTab === "automations") {
      const interval = setInterval(() => {
        setDeployProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const PIPELINE_STEPS = ["Build", "Test", "Stage", "Deploy"];
  const getStepStatus = (stepIndex: number) => {
    const threshold = (stepIndex + 1) * 25;
    if (deployProgress >= threshold) return "complete";
    if (deployProgress >= stepIndex * 25) return "current";
    return "pending";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
      <div className="flex h-[320px]">
        {/* Mini Sidebar */}
        <div className="w-12 bg-gray-50 border-r border-gray-100 py-3 flex flex-col items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">T</span>
          </div>
          <div className="w-full h-px bg-gray-200 my-1" />
          {[
            { id: "automations", icon: Zap },
            { id: "metrics", icon: BarChart3 },
            { id: "costs", icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                activeTab === tab.id ? "bg-white shadow-sm border border-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-blue-500" : "text-gray-400"}`} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Automations Tab */}
            {activeTab === "automations" && (
              <motion.div
                key="automations"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full"
              >
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">Automations Pipeline</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">2 Live</span>
                </div>

                <div className="p-4">
                  {/* Pipeline Steps */}
                  <div className="relative mb-4">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
                      <motion.div
                        className="absolute left-0 top-1/2 h-1 bg-blue-500 -translate-y-1/2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${deployProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                      {PIPELINE_STEPS.map((step, i) => {
                        const status = getStepStatus(i);
                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <motion.div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                status === "complete"
                                  ? "bg-blue-500 text-white"
                                  : status === "current"
                                  ? "bg-white border-2 border-blue-500 text-blue-500"
                                  : "bg-white border-2 border-gray-200 text-gray-400"
                              }`}
                              animate={status === "current" ? { scale: [1, 1.05, 1] } : {}}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              {status === "complete" ? (
                                <Check className="w-4 h-4" />
                              ) : status === "current" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <span className="text-xs font-bold">{i + 1}</span>
                              )}
                            </motion.div>
                            <span className="mt-1 text-[10px] font-medium text-gray-500">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Automations List */}
                  <div className="space-y-2">
                    {[
                      { name: "Invoice Processing", status: "live", performance: 98, runs: 1243 },
                      { name: "Report Generator", status: "deploying", performance: null, runs: 0 },
                      { name: "Data Sync Bot", status: "testing", performance: 94, runs: 89 },
                    ].map((automation, i) => (
                      <motion.div
                        key={automation.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              automation.status === "live" ? "bg-blue-500" :
                              automation.status === "deploying" ? "bg-blue-400 animate-pulse" : "bg-gray-400"
                            }`} />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{automation.name}</p>
                              <p className="text-[10px] text-gray-500">
                                {automation.status === "deploying" ? "Deploying..." :
                                 automation.status === "live" ? `${automation.runs} runs` : "Testing"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {automation.performance && (
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{automation.performance}%</p>
                                <p className="text-[10px] text-gray-500">accuracy</p>
                              </div>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              automation.status === "live" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                            }`}>
                              {automation.status === "deploying" ? `${deployProgress}%` : automation.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Metrics Tab */}
            {activeTab === "metrics" && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full"
              >
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">Business Impact</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">This month</span>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: "Hours Saved", value: "1,247", suffix: "h", change: "+23%", icon: Clock },
                      { label: "ROI", value: "127", suffix: "%", change: "+15%", icon: TrendingUp },
                      { label: "Cost Reduction", value: "$34.5K", suffix: "", change: "+12%", icon: DollarSign },
                      { label: "Automations", value: "12", suffix: "", change: "+3", icon: Zap },
                    ].map((metric, i) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <metric.icon className="w-4 h-4 text-gray-400" />
                          <div className="flex items-center gap-1 text-blue-600">
                            <ArrowUpRight className="w-3 h-3" />
                            <span className="text-[10px] font-medium">{metric.change}</span>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{metric.value}{metric.suffix}</p>
                        <p className="text-[10px] text-gray-500">{metric.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Weekly Chart */}
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-gray-700">Weekly Performance</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">+38%</span>
                    </div>
                    <div className="flex items-end justify-between h-12">
                      {[45, 52, 48, 61, 55, 67, 72].map((value, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${value}%` }}
                          transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                          className="w-5 bg-blue-400 rounded-t-md"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                        <span key={i} className="text-[9px] text-gray-400 w-5 text-center">{day}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Costs Tab */}
            {activeTab === "costs" && (
              <motion.div
                key="costs"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full"
              >
                <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">Cost Intelligence</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">4 BUs</span>
                </div>

                <div className="p-4">
                  {/* Total cost card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-blue-500 text-white mb-4"
                  >
                    <p className="text-[10px] text-blue-100 mb-1">Total Monthly Cost</p>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold">$14,010</p>
                      <div className="flex items-center gap-1 text-blue-100">
                        <ArrowDownRight className="w-3 h-3" />
                        <span className="text-xs">-8% vs last</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* BU breakdown */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { bu: "Finance", current: 4250, provider: "OpenAI" },
                      { bu: "Operations", current: 2890, provider: "AWS" },
                      { bu: "Technology", current: 5670, provider: "Azure" },
                      { bu: "HR", current: 1200, provider: "Anthropic" },
                    ].map((cost, i) => {
                      const shades = ["bg-blue-500", "bg-blue-400", "bg-blue-300", "bg-blue-200"];
                      return (
                        <motion.div
                          key={cost.bu}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="p-3 rounded-xl border border-gray-100"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2.5 h-2.5 rounded-full ${shades[i]}`} />
                            <span className="text-xs font-medium text-gray-900">{cost.bu}</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">${cost.current.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500">{cost.provider}</p>
                        </motion.div>
                      );
                    })}
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
// PILLAR DATA
// ============================================

const pillars = [
  {
    id: "light",
    name: "Light",
    subtitle: "Discovery",
    tagline: "See what others miss.",
    description: "AI-powered discovery engine that identifies automation opportunities hidden in your daily workflow. Pharo Light monitors your tools and surfaces actionable insights before you even know to look.",
    gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    iconColor: "#F59E0B",
    accentBg: "bg-amber-500/10",
    features: [
      "Smart browser extension that learns your patterns",
      "Cross-app workflow analysis across 50+ integrations",
      "AI-powered opportunity scoring and prioritization",
    ],
    Demo: BrowserSimulation,
  },
  {
    id: "forge",
    name: "Forge",
    subtitle: "PMO",
    tagline: "Build with precision.",
    description: "End-to-end project management platform designed for automation initiatives. Pharo Forge orchestrates resources, timelines, and dependencies from discovery to deployment.",
    gradient: "from-orange-500/20 via-red-500/10 to-transparent",
    iconColor: "#F97316",
    accentBg: "bg-orange-500/10",
    features: [
      "Business Units → Projects → Initiatives hierarchy",
      "Resource allocation and team assignment",
      "Progress tracking with real-time status updates",
    ],
    Demo: PlatformPreview,
  },
  {
    id: "tower",
    name: "Tower",
    subtitle: "Monitoring",
    tagline: "Control with clarity.",
    description: "Real-time oversight platform for complete automation visibility. Pharo Tower provides the command center for monitoring performance, quality, and financial health of every deployment.",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    iconColor: "#3B82F6",
    accentBg: "bg-blue-500/10",
    features: [
      "CI/CD pipeline with one-click deployment",
      "Business impact metrics and ROI tracking",
      "Cost intelligence across all business units",
    ],
    Demo: DeployPreview,
  },
];

// ============================================
// PILLAR SECTION COMPONENT
// ============================================

function PillarSection({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80, 0, 0, -80]);

  const isEven = index % 2 === 0;

  return (
    <motion.section
      ref={ref}
      className="min-h-screen flex items-center justify-center py-24 px-6"
      style={{ opacity }}
    >
      <motion.div className="max-w-6xl w-full" style={{ y }}>
        <div className={`grid md:grid-cols-2 gap-12 items-center ${isEven ? "" : "md:flex-row-reverse"}`}>
          {/* Content */}
          <div className={isEven ? "order-1" : "order-1 md:order-2"}>
            {/* Pill badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 ${pillar.accentBg}`}
              style={{ color: pillar.iconColor }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: pillar.iconColor }} />
              {pillar.subtitle}
            </div>

            {/* Title */}
            <h2
              className="text-5xl md:text-6xl font-light mb-4"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              {pillar.name}
            </h2>

            {/* Tagline */}
            <p className="text-xl md:text-2xl font-light mb-6" style={{ color: "rgba(0,0,0,0.5)" }}>
              {pillar.tagline}
            </p>

            {/* Description */}
            <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(0,0,0,0.6)" }}>
              {pillar.description}
            </p>

            {/* Features */}
            <div className="space-y-3">
              {pillar.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  className="flex gap-3 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: pillar.accentBg, color: pillar.iconColor }}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-gray-600">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Demo */}
          <div className={`relative ${isEven ? "order-2" : "order-2 md:order-1"}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} rounded-3xl blur-3xl -z-10`} />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <pillar.Demo />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function PlatformPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F5F5F3" }}>
      <NavbarMinimal />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center px-6 pt-32">
        <div className="text-center max-w-3xl">
          <motion.p
            className="text-sm uppercase tracking-[0.3em] mb-6"
            style={{ color: "rgba(0,0,0,0.4)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our Platform
          </motion.p>

          <motion.h1
            className="text-5xl md:text-7xl font-light leading-tight mb-8"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Three pillars.
            <br />
            <em>One platform.</em>
          </motion.h1>

          <motion.p
            className="text-xl font-light max-w-xl mx-auto mb-8"
            style={{ color: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Pharo unifies discovery, execution, and oversight into a seamless experience designed for the way modern teams actually work.
          </motion.p>

          {/* Pillar Pills */}
          <motion.div
            className="flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {pillars.map((pillar) => (
              <a
                key={pillar.id}
                href={`#${pillar.id}`}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${pillar.accentBg}`}
                style={{ color: pillar.iconColor }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: pillar.iconColor }} />
                {pillar.name}
              </a>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pillar Sections */}
      {pillars.map((pillar, index) => (
        <div key={pillar.id} id={pillar.id}>
          <PillarSection pillar={pillar} index={index} />
        </div>
      ))}

      {/* CTA Section */}
      <section className="min-h-[60vh] flex items-center justify-center px-6 pb-32">
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-4xl md:text-5xl font-light mb-8"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to see it in action?
          </h2>

          <p className="text-lg mb-12" style={{ color: "rgba(0,0,0,0.5)" }}>
            Experience the platform with a guided demo tailored to your needs.
          </p>

          <div className="liquid-glass-wrap">
            <Link href="/experience" className="liquid-glass-button">
              <span>Request Demo</span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.4)" }}>
            © {new Date().getFullYear()} Sapira. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
