"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Project/use case status types
type ProjectStatus = "design" | "build" | "uat" | "production";

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  owner: string;
  lastUpdate: string;
  priority: "high" | "medium" | "low";
}

// Sample projects data
const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Invoice Processing Agent",
    description: "Automated invoice extraction and validation for AP department",
    status: "production",
    progress: 100,
    owner: "Finance Team",
    lastUpdate: "2h ago",
    priority: "high",
  },
  {
    id: "2",
    name: "Contract Analyzer",
    description: "RAG-based legal contract review and clause extraction",
    status: "uat",
    progress: 85,
    owner: "Legal Ops",
    lastUpdate: "1d ago",
    priority: "high",
  },
  {
    id: "3",
    name: "Customer Support Triage",
    description: "Intelligent ticket routing and initial response generation",
    status: "build",
    progress: 60,
    owner: "CS Operations",
    lastUpdate: "3h ago",
    priority: "medium",
  },
  {
    id: "4",
    name: "Inventory Forecasting",
    description: "Demand prediction and reorder point optimization",
    status: "design",
    progress: 25,
    owner: "Supply Chain",
    lastUpdate: "5d ago",
    priority: "low",
  },
  {
    id: "5",
    name: "Employee Onboarding Assistant",
    description: "Guided onboarding with document processing and Q&A",
    status: "build",
    progress: 45,
    owner: "HR Team",
    lastUpdate: "12h ago",
    priority: "medium",
  },
];

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  design: { label: "Design", color: "text-violet-400", bgColor: "bg-violet-400" },
  build: { label: "Build", color: "text-amber-400", bgColor: "bg-amber-400" },
  uat: { label: "UAT", color: "text-blue-400", bgColor: "bg-blue-400" },
  production: { label: "Production", color: "text-emerald-400", bgColor: "bg-emerald-400" },
};

type NavItem = "overview" | "projects" | "timeline" | "messages";

export default function FaroApp() {
  const [activeNav, setActiveNav] = useState<NavItem>("projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">("all");

  const filteredProjects = filterStatus === "all" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.status === filterStatus);

  const stats = {
    total: PROJECTS.length,
    inProduction: PROJECTS.filter(p => p.status === "production").length,
    inProgress: PROJECTS.filter(p => p.status !== "production").length,
    avgProgress: Math.round(PROJECTS.reduce((acc, p) => acc + p.progress, 0) / PROJECTS.length),
  };

  return (
    <div className="h-full w-full bg-black flex overflow-hidden">
      {/* Sidebar */}
      <div 
        className="w-56 flex-shrink-0 border-r border-white/5 flex flex-col"
        style={{ background: "rgba(255,255,255,0.01)" }}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                background: "linear-gradient(135deg, rgba(0,200,200,0.2) 0%, rgba(0,100,100,0.1) 100%)",
                border: "1px solid rgba(0,200,200,0.3)",
              }}
            >
              <span className="text-cyan-400 text-sm font-medium">P</span>
            </div>
            <div>
              <h1 className="text-white text-sm font-medium tracking-tight">Pharo</h1>
              <p className="text-white/30 text-[10px]">Platform</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "overview" as NavItem, label: "Overview", icon: "◉" },
            { id: "projects" as NavItem, label: "Projects", icon: "▦" },
            { id: "timeline" as NavItem, label: "Timeline", icon: "▤" },
            { id: "messages" as NavItem, label: "Messages", icon: "◈" },
          ].map((item, i) => (
            <motion.button
              key={item.id}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                activeNav === item.id 
                  ? "bg-white/5 text-white" 
                  : "text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
              }`}
              onClick={() => setActiveNav(item.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <span className="text-xs opacity-60">{item.icon}</span>
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* User/Team */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white/60 text-xs">YT</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-sm truncate">Your Team</p>
              <p className="text-white/30 text-[10px]">Enterprise Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6">
          <div>
            <h2 className="text-white text-sm font-medium">
              {activeNav === "projects" ? "AI Use Cases" : activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
            </h2>
            <p className="text-white/30 text-[10px]">Manage your AI workforce deployment</p>
          </div>

          {/* Status filter */}
          {activeNav === "projects" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1 rounded-full text-[10px] transition-colors ${
                  filterStatus === "all" 
                    ? "bg-white/10 text-white" 
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                All
              </button>
              {(Object.keys(STATUS_CONFIG) as ProjectStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-[10px] transition-colors ${
                    filterStatus === status 
                      ? "bg-white/10 text-white" 
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  {STATUS_CONFIG[status].label}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeNav === "overview" && (
            <OverviewView stats={stats} />
          )}
          
          {activeNav === "projects" && (
            <ProjectsView 
              projects={filteredProjects} 
              onSelect={setSelectedProject}
              selectedId={selectedProject?.id}
            />
          )}

          {activeNav === "timeline" && (
            <TimelineView projects={PROJECTS} />
          )}

          {activeNav === "messages" && (
            <MessagesView />
          )}
        </div>
      </div>

      {/* Project Detail Panel */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailPanel 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// OVERVIEW VIEW
// ============================================

function OverviewView({ stats }: { stats: { total: number; inProduction: number; inProgress: number; avgProgress: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: stats.total, suffix: "" },
          { label: "In Production", value: stats.inProduction, suffix: "" },
          { label: "In Progress", value: stats.inProgress, suffix: "" },
          { label: "Avg. Completion", value: stats.avgProgress, suffix: "%" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="p-5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-white text-2xl font-light">{stat.value}{stat.suffix}</p>
          </motion.div>
        ))}
      </div>

      {/* Welcome message */}
      <div 
        className="p-6 rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(0,200,200,0.05) 0%, rgba(0,100,100,0.02) 100%)",
          border: "1px solid rgba(0,200,200,0.1)",
        }}
      >
        <h3 className="text-white text-lg font-light mb-2" style={{ fontFamily: "Georgia, serif" }}>
          Welcome to Pharo Platform
        </h3>
        <p className="text-white/50 text-sm leading-relaxed">
          Your centralized hub for managing AI use case deployment. Track progress from design to production,
          collaborate with your Forward Deployed Engineers, and monitor your AI workforce.
        </p>
      </div>
    </motion.div>
  );
}

// ============================================
// PROJECTS VIEW
// ============================================

function ProjectsView({ 
  projects, 
  onSelect,
  selectedId,
}: { 
  projects: Project[]; 
  onSelect: (p: Project) => void;
  selectedId?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {projects.map((project, i) => (
        <motion.button
          key={project.id}
          className={`w-full text-left p-5 rounded-xl transition-all ${
            selectedId === project.id ? "ring-1 ring-cyan-400/30" : ""
          }`}
          style={{
            background: selectedId === project.id 
              ? "rgba(0,200,200,0.05)" 
              : "rgba(255,255,255,0.02)",
            border: `1px solid ${selectedId === project.id ? "rgba(0,200,200,0.2)" : "rgba(255,255,255,0.05)"}`,
          }}
          onClick={() => onSelect(project)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.005 }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white text-sm font-medium">{project.name}</h4>
                {project.priority === "high" && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400">
                    High Priority
                  </span>
                )}
              </div>
              <p className="text-white/40 text-xs">{project.description}</p>
            </div>
            
            {/* Status badge */}
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5`}>
              <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[project.status].bgColor}`} />
              <span className={`text-[10px] ${STATUS_CONFIG[project.status].color}`}>
                {STATUS_CONFIG[project.status].label}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400/60 to-cyan-400/30 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
              />
            </div>
            <span className="text-white/30 text-[10px] w-8 text-right">{project.progress}%</span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3 text-[10px] text-white/30">
            <span>{project.owner}</span>
            <span>•</span>
            <span>Updated {project.lastUpdate}</span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}

// ============================================
// TIMELINE VIEW
// ============================================

function TimelineView({ projects }: { projects: Project[] }) {
  const sortedProjects = [...projects].sort((a, b) => {
    const order = { production: 4, uat: 3, build: 2, design: 1 };
    return order[b.status] - order[a.status];
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

      <div className="space-y-6 pl-12">
        {sortedProjects.map((project, i) => (
          <motion.div
            key={project.id}
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Timeline dot */}
            <div 
              className={`absolute -left-10 top-2 w-3 h-3 rounded-full ${STATUS_CONFIG[project.status].bgColor}`}
              style={{ boxShadow: `0 0 10px ${STATUS_CONFIG[project.status].bgColor.replace("bg-", "")}` }}
            />

            <div 
              className="p-4 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white text-sm">{project.name}</h4>
                <span className={`text-[10px] ${STATUS_CONFIG[project.status].color}`}>
                  {STATUS_CONFIG[project.status].label}
                </span>
              </div>
              <p className="text-white/30 text-xs">{project.owner}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// MESSAGES VIEW
// ============================================

function MessagesView() {
  const messages = [
    { from: "FDE Team", message: "Invoice Processing Agent deployed to production successfully.", time: "2h ago" },
    { from: "System", message: "Contract Analyzer UAT tests completed. 94% accuracy achieved.", time: "1d ago" },
    { from: "Your Team", message: "New requirements added for Customer Support Triage.", time: "2d ago" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          className="p-4 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-400/80 text-xs font-medium">{msg.from}</span>
            <span className="text-white/20 text-[10px]">{msg.time}</span>
          </div>
          <p className="text-white/60 text-sm">{msg.message}</p>
        </motion.div>
      ))}

      {/* Empty state for more messages */}
      <div 
        className="p-6 rounded-xl text-center"
        style={{
          background: "rgba(255,255,255,0.01)",
          border: "1px dashed rgba(255,255,255,0.1)",
        }}
      >
        <p className="text-white/20 text-xs">Messages with your FDE team will appear here</p>
      </div>
    </motion.div>
  );
}

// ============================================
// PROJECT DETAIL PANEL
// ============================================

function ProjectDetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      className="w-80 border-l border-white/5 flex flex-col overflow-hidden"
      style={{ background: "rgba(255,255,255,0.01)" }}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white text-sm font-medium">Project Details</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Project name */}
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Name</p>
          <p className="text-white text-sm">{project.name}</p>
        </div>

        {/* Status */}
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Status</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5`}>
            <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[project.status].bgColor}`} />
            <span className={`text-xs ${STATUS_CONFIG[project.status].color}`}>
              {STATUS_CONFIG[project.status].label}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Progress</p>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-cyan-400/50 rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="text-white/50 text-xs">{project.progress}% complete</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Description</p>
          <p className="text-white/60 text-sm leading-relaxed">{project.description}</p>
        </div>

        {/* Owner */}
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Owner</p>
          <p className="text-white/60 text-sm">{project.owner}</p>
        </div>

        {/* Last Update */}
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Last Update</p>
          <p className="text-white/60 text-sm">{project.lastUpdate}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/5">
        <button 
          className="w-full py-2.5 rounded-lg text-sm font-medium text-black"
          style={{
            background: "linear-gradient(135deg, rgba(0,220,220,0.9) 0%, rgba(0,180,180,0.9) 100%)",
          }}
        >
          View Full Details
        </button>
      </div>
    </motion.div>
  );
}
