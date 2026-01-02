"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Navigation structure
type MainSection = "overview" | "discover" | "build" | "control";
type DiscoverPage = "intro" | "define" | "ingest" | "analyze" | "rank";
type BuildPage = "intro" | "blueprints" | "fdes" | "pmo";
type ControlPage = "intro" | "monitoring" | "compliance" | "billing";

interface NavigationState {
  section: MainSection;
  discoverPage: DiscoverPage;
  buildPage: BuildPage;
  controlPage: ControlPage;
}

// Workflow data for Discover section
const DISCOVERED_WORKFLOWS = [
  { 
    id: "invoice", 
    name: "PO Invoice Reconciliation", 
    volume: "14,000/mo",
    currentTime: "12 min",
    targetTime: "30 sec",
    aiScore: 94,
    impact: "+$2M",
    touchlessRate: { before: "12%", after: "92%" },
    errorRate: { before: "4.8%", after: "<0.5%" },
  },
  { 
    id: "contract", 
    name: "Contract Redlining", 
    volume: "2,400/mo",
    currentTime: "45 min",
    targetTime: "8 min",
    aiScore: 87,
    impact: "+$800K",
  },
  { 
    id: "support", 
    name: "Customer Support Triage", 
    volume: "8,200/mo",
    currentTime: "15 min",
    targetTime: "2 min",
    aiScore: 91,
    impact: "+$1.2M",
  },
  { 
    id: "onboarding", 
    name: "Employee Onboarding", 
    volume: "450/mo",
    currentTime: "4 hours",
    targetTime: "45 min",
    aiScore: 78,
    impact: "+$300K",
  },
  { 
    id: "expense", 
    name: "Expense Report Processing", 
    volume: "6,800/mo",
    currentTime: "8 min",
    targetTime: "1 min",
    aiScore: 89,
    impact: "+$600K",
  },
];

export default function WhatWeDoApp() {
  const [nav, setNav] = useState<NavigationState>({
    section: "overview",
    discoverPage: "intro",
    buildPage: "intro",
    controlPage: "intro",
  });

  const navigateToSection = (section: MainSection) => {
    setNav(prev => ({ ...prev, section }));
  };

  const navigateDiscoverPage = (page: DiscoverPage) => {
    setNav(prev => ({ ...prev, discoverPage: page }));
  };

  const navigateBuildPage = (page: BuildPage) => {
    setNav(prev => ({ ...prev, buildPage: page }));
  };

  const navigateControlPage = (page: ControlPage) => {
    setNav(prev => ({ ...prev, controlPage: page }));
  };

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar Navigation */}
      <aside 
        className="w-56 shrink-0 border-r overflow-y-auto"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "#fafafa" }}
      >
        <div className="p-6">
          <h1 
            className="text-2xl mb-1"
            style={{ 
              fontFamily: "'Times New Roman', Georgia, serif",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "rgba(0,0,0,0.8)",
            }}
          >
            Pharo
          </h1>
          <p className="text-[10px] text-black/40 uppercase tracking-[0.2em]">
            AI Office System
          </p>
        </div>

        <nav className="px-3 pb-6">
          {/* Overview */}
          <NavItem 
            label="Overview" 
            active={nav.section === "overview"}
            onClick={() => navigateToSection("overview")}
          />

          {/* Discover Section */}
          <NavSection
            label="Discover"
            sublabel="Pharo Light"
            active={nav.section === "discover"}
            onClick={() => navigateToSection("discover")}
          >
            {nav.section === "discover" && (
              <div className="ml-4 mt-1 space-y-0.5">
                <SubNavItem label="Introduction" active={nav.discoverPage === "intro"} onClick={() => navigateDiscoverPage("intro")} />
                <SubNavItem label="01 · Define" active={nav.discoverPage === "define"} onClick={() => navigateDiscoverPage("define")} />
                <SubNavItem label="02 · Ingest" active={nav.discoverPage === "ingest"} onClick={() => navigateDiscoverPage("ingest")} />
                <SubNavItem label="03 · Analyze" active={nav.discoverPage === "analyze"} onClick={() => navigateDiscoverPage("analyze")} />
                <SubNavItem label="04 · Rank" active={nav.discoverPage === "rank"} onClick={() => navigateDiscoverPage("rank")} />
              </div>
            )}
          </NavSection>

          {/* Build Section */}
          <NavSection
            label="Build"
            sublabel="Pharo Forge"
            active={nav.section === "build"}
            onClick={() => navigateToSection("build")}
          >
            {nav.section === "build" && (
              <div className="ml-4 mt-1 space-y-0.5">
                <SubNavItem label="Introduction" active={nav.buildPage === "intro"} onClick={() => navigateBuildPage("intro")} />
                <SubNavItem label="The Blueprints" active={nav.buildPage === "blueprints"} onClick={() => navigateBuildPage("blueprints")} />
                <SubNavItem label="The Builders" active={nav.buildPage === "fdes"} onClick={() => navigateBuildPage("fdes")} />
                <SubNavItem label="AI PMO Dashboard" active={nav.buildPage === "pmo"} onClick={() => navigateBuildPage("pmo")} />
              </div>
            )}
          </NavSection>

          {/* Control Section */}
          <NavSection
            label="Control"
            sublabel="Pharo Tower"
            active={nav.section === "control"}
            onClick={() => navigateToSection("control")}
          >
            {nav.section === "control" && (
              <div className="ml-4 mt-1 space-y-0.5">
                <SubNavItem label="Introduction" active={nav.controlPage === "intro"} onClick={() => navigateControlPage("intro")} />
                <SubNavItem label="Forensic Lens" active={nav.controlPage === "monitoring"} onClick={() => navigateControlPage("monitoring")} />
                <SubNavItem label="Safety Valve" active={nav.controlPage === "compliance"} onClick={() => navigateControlPage("compliance")} />
                <SubNavItem label="P&L View" active={nav.controlPage === "billing"} onClick={() => navigateControlPage("billing")} />
              </div>
            )}
          </NavSection>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {nav.section === "overview" && <OverviewPage key="overview" onNavigate={navigateToSection} />}
          {nav.section === "discover" && <DiscoverSection key="discover" page={nav.discoverPage} />}
          {nav.section === "build" && <BuildSection key="build" page={nav.buildPage} />}
          {nav.section === "control" && <ControlSection key="control" page={nav.controlPage} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ============================================
// NAVIGATION COMPONENTS
// ============================================

function NavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
        active ? "bg-black/5 text-black/80 font-medium" : "text-black/50 hover:bg-black/[0.02] hover:text-black/70"
      }`}
    >
      {label}
    </button>
  );
}

function NavSection({ 
  label, 
  sublabel, 
  active, 
  onClick, 
  children 
}: { 
  label: string; 
  sublabel: string;
  active: boolean; 
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-1">
      <button
        onClick={onClick}
        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
          active ? "bg-black/5" : "hover:bg-black/[0.02]"
        }`}
      >
        <span className={`text-sm ${active ? "text-black/80 font-medium" : "text-black/50"}`}>
          {label}
        </span>
        <span className="block text-[9px] text-black/30 uppercase tracking-wider mt-0.5">
          {sublabel}
        </span>
      </button>
      {children}
    </div>
  );
}

function SubNavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
        active ? "text-black/70 font-medium bg-black/[0.03]" : "text-black/40 hover:text-black/60"
      }`}
    >
      {label}
    </button>
  );
}

// ============================================
// PAGE WRAPPER
// ============================================

function PageWrapper({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <motion.div
      className="p-8 md:p-12 lg:p-16 max-w-4xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-4 block">
          {label}
        </span>
      )}
      {children}
    </motion.div>
  );
}

// ============================================
// OVERVIEW PAGE
// ============================================

function OverviewPage({ onNavigate }: { onNavigate: (section: MainSection) => void }) {
  return (
    <PageWrapper>
      <h1 
        className="text-4xl md:text-5xl mb-6"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "rgba(0,0,0,0.85)",
        }}
      >
        What We Do
      </h1>
      
      <p className="text-lg text-black/50 mb-12 max-w-2xl leading-relaxed">
        Pharo is an end-to-end AI Office System that discovers, builds, and governs 
        AI workers based on real workflows observed in your production systems.
      </p>

      {/* The Problem */}
      <section className="mb-16">
        <h2 className="text-xl font-medium text-black/70 mb-4">The Problem</h2>
        <p className="text-black/50 mb-6 leading-relaxed">
          AI appears in slides, workshops, and PoCs. But not in the daily work.
          Thousands of models and tools, zero interoperability, infinite shadow IT,
          and no one can answer how much value is being generated.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Guesswork", desc: "Use cases invented in workshops, not from real data." },
            { title: "Fragmentation", desc: "One-off projects that never become robust systems." },
            { title: "Chaos", desc: "Agents scattered across vendors with no ownership." },
            { title: "Stagnation", desc: "No data-driven roadmap, no sustained ROI." },
          ].map((item) => (
            <div 
              key={item.title}
              className="p-4 rounded-lg"
              style={{ background: "rgba(0,0,0,0.02)" }}
            >
              <h3 className="text-sm font-medium text-black/70 mb-1">{item.title}</h3>
              <p className="text-xs text-black/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Solution */}
      <section className="mb-16">
        <h2 className="text-xl font-medium text-black/70 mb-4">The Solution</h2>
        <p className="text-black/50 mb-8 leading-relaxed">
          Pharo is composed of three functional layers, corresponding to the three 
          natural phases of an AI operation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              name: "Discover", 
              product: "Pharo Light",
              desc: "Observe how work really happens. Map workflows from real data, not workshops.",
              onClick: () => onNavigate("discover"),
            },
            { 
              name: "Build", 
              product: "Pharo Forge",
              desc: "Industrial assembly line for AI workers. Blueprints, builders, and PMO.",
              onClick: () => onNavigate("build"),
            },
            { 
              name: "Control", 
              product: "Pharo Tower",
              desc: "Govern AI in production. Monitoring, compliance, and cost tracking.",
              onClick: () => onNavigate("control"),
            },
          ].map((section) => (
            <button
              key={section.name}
              onClick={section.onClick}
              className="text-left p-6 rounded-xl transition-all hover:shadow-lg group"
              style={{ 
                background: "rgba(0,0,0,0.02)", 
                border: "1px solid rgba(0,0,0,0.04)" 
              }}
            >
              <h3 
                className="text-2xl mb-1 group-hover:text-black/90 transition-colors"
                style={{ 
                  fontFamily: "'Times New Roman', Georgia, serif",
                  fontWeight: 300,
                  color: "rgba(0,0,0,0.7)",
                }}
              >
                {section.name}
              </h3>
              <p className="text-[10px] text-black/30 uppercase tracking-wider mb-3">
                {section.product}
              </p>
              <p className="text-sm text-black/50">
                {section.desc}
              </p>
              <span className="text-xs text-black/30 mt-4 block group-hover:text-black/50 transition-colors">
                Explore →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-xl font-medium text-black/70 mb-6">The Journey</h2>
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-black/10" />
          <div className="grid grid-cols-5 gap-2">
            {[
              { time: "Day 0", desc: "Deploy Pharo Light" },
              { time: "Month 1", desc: "First AI-ready list" },
              { time: "Month 3", desc: "AI pipeline with ROI" },
              { time: "Month 6", desc: "Workers live in Tower" },
              { time: "Ongoing", desc: "Fleet of AI workers" },
            ].map((milestone) => (
              <div key={milestone.time} className="text-center">
                <div className="w-2 h-2 rounded-full bg-black/30 mx-auto mb-3" />
                <p className="text-xs font-medium text-black/70">{milestone.time}</p>
                <p className="text-[10px] text-black/40 mt-1">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

// ============================================
// DISCOVER SECTION
// ============================================

function DiscoverSection({ page }: { page: DiscoverPage }) {
  return (
    <AnimatePresence mode="wait">
      {page === "intro" && <DiscoverIntro key="intro" />}
      {page === "define" && <DiscoverDefine key="define" />}
      {page === "ingest" && <DiscoverIngest key="ingest" />}
      {page === "analyze" && <DiscoverAnalyze key="analyze" />}
      {page === "rank" && <DiscoverRank key="rank" />}
    </AnimatePresence>
  );
}

function DiscoverIntro() {
  return (
    <PageWrapper label="Pharo Light">
      <h1 
        className="text-4xl md:text-5xl mb-6"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "rgba(0,0,0,0.85)",
        }}
      >
        Discover
      </h1>
      
      <p className="text-xl text-black/50 mb-8 max-w-2xl">
        Turn daily work into a data-backed AI pipeline.
      </p>
      
      <p className="text-black/40 mb-12 max-w-2xl leading-relaxed">
        Pharo Light observes how work really happens in your organization. 
        Not from workshops. Not from guesswork. From real data flowing through 
        your systems every day.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-xl" style={{ background: "rgba(0,0,0,0.02)" }}>
          <h3 className="text-lg font-medium text-black/70 mb-2">The Old Way</h3>
          <ul className="space-y-2 text-sm text-black/50">
            <li>• Workshops to guess use cases</li>
            <li>• Stakeholder interviews</li>
            <li>• Manual process mapping</li>
            <li>• Subjective prioritization</li>
          </ul>
        </div>
        <div className="p-6 rounded-xl" style={{ background: "rgba(0,0,0,0.02)" }}>
          <h3 className="text-lg font-medium text-black/70 mb-2">The Pharo Way</h3>
          <ul className="space-y-2 text-sm text-black/50">
            <li>• Observe real workflows</li>
            <li>• Measure baseline metrics</li>
            <li>• Calculate AI-fit scores</li>
            <li>• Data-driven prioritization</li>
          </ul>
        </div>
      </div>

      <div className="p-6 rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <h3 className="text-sm font-medium text-black/50 mb-4">The Discovery Pipeline</h3>
        <div className="flex items-center justify-between">
          {["Define", "Ingest", "Analyze", "Rank"].map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="text-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{ background: "rgba(0,0,0,0.05)" }}
                >
                  <span className="text-sm font-medium text-black/50">{i + 1}</span>
                </div>
                <p className="text-xs text-black/60">{step}</p>
              </div>
              {i < 3 && <div className="w-16 h-px bg-black/10 mx-4" />}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function DiscoverDefine() {
  return (
    <PageWrapper label="Discover · Step 1">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl font-light text-black/20">01</span>
        <h1 
          className="text-3xl"
          style={{ 
            fontFamily: "'Times New Roman', Georgia, serif",
            fontWeight: 300,
            color: "rgba(0,0,0,0.85)",
          }}
        >
          Define
        </h1>
      </div>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        Select the teams, systems, and data sources to analyze. 
        We connect to your existing infrastructure in read-only mode.
      </p>

      <h3 className="text-sm font-medium text-black/50 mb-4 uppercase tracking-wider">
        Data Sources
      </h3>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { name: "API Logs", desc: "REST, GraphQL, internal services, webhooks", examples: "Salesforce, SAP, custom APIs" },
          { name: "ERP Backend", desc: "Transaction logs, process events, batch jobs", examples: "SAP, Oracle, Navision, Workday" },
          { name: "Workflow Events", desc: "Email flows, ticket systems, approvals", examples: "ServiceNow, Jira, Zendesk" },
        ].map((source) => (
          <div 
            key={source.name}
            className="p-5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <h4 className="text-sm font-medium text-black/70 mb-2">{source.name}</h4>
            <p className="text-xs text-black/40 mb-3">{source.desc}</p>
            <p className="text-[10px] text-black/30">{source.examples}</p>
          </div>
        ))}
      </div>

      <div 
        className="p-5 rounded-xl flex items-center gap-4"
        style={{ background: "rgba(0,0,0,0.02)" }}
      >
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <span className="text-green-600 text-lg">✓</span>
        </div>
        <div>
          <h4 className="text-sm font-medium text-black/70">Read-Only Access</h4>
          <p className="text-xs text-black/40">Zero impact on your production systems. We observe, never modify.</p>
        </div>
      </div>
    </PageWrapper>
  );
}

function DiscoverIngest() {
  return (
    <PageWrapper label="Discover · Step 2">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl font-light text-black/20">02</span>
        <h1 
          className="text-3xl"
          style={{ 
            fontFamily: "'Times New Roman', Georgia, serif",
            fontWeight: 300,
            color: "rgba(0,0,0,0.85)",
          }}
        >
          Ingest
        </h1>
      </div>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        Group events into workflows. Compute baseline metrics for each one:
        volumes, handling times, hand-offs, error rates.
      </p>

      <div 
        className="p-6 rounded-xl mb-8"
        style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
      >
        <p className="text-xs text-black/40 uppercase tracking-wider mb-4">
          Example: Invoice Approval Workflow
        </p>
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {["Receive", "Validate", "Match PO", "Route", "Approve", "Post"].map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="text-center min-w-[60px]">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2 mx-auto"
                  style={{ background: "rgba(0,0,0,0.05)" }}
                >
                  <span className="text-xs text-black/50">{i + 1}</span>
                </div>
                <p className="text-[10px] text-black/60">{step}</p>
              </div>
              {i < 5 && <div className="w-6 h-px bg-black/10" />}
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-sm font-medium text-black/50 mb-4 uppercase tracking-wider">
        Baseline Metrics Computed
      </h3>
      
      <div className="grid grid-cols-4 gap-4">
        {[
          { value: "14,000", label: "Monthly volume", desc: "Total transactions" },
          { value: "12 min", label: "Avg. handling time", desc: "Per transaction" },
          { value: "4.2", label: "Avg. hand-offs", desc: "Between people" },
          { value: "4.8%", label: "Error rate", desc: "Requiring rework" },
        ].map((metric) => (
          <div 
            key={metric.label}
            className="p-4 rounded-xl text-center"
            style={{ background: "rgba(0,0,0,0.02)" }}
          >
            <p className="text-2xl font-light text-black/80 mb-1">{metric.value}</p>
            <p className="text-xs text-black/50">{metric.label}</p>
            <p className="text-[10px] text-black/30 mt-1">{metric.desc}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function DiscoverAnalyze() {
  return (
    <PageWrapper label="Discover · Step 3">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl font-light text-black/20">03</span>
        <h1 
          className="text-3xl"
          style={{ 
            fontFamily: "'Times New Roman', Georgia, serif",
            fontWeight: 300,
            color: "rgba(0,0,0,0.85)",
          }}
        >
          Analyze
        </h1>
      </div>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        For every workflow, we calculate three critical dimensions
        to determine AI-readiness.
      </p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { 
            title: "AI-Fit Score", 
            value: "94/100",
            desc: "How suitable is this workflow for AI automation? Based on data structure, decision complexity, and volume.",
            factors: ["Data availability", "Decision patterns", "Volume consistency", "Error tolerance"],
          },
          { 
            title: "Effort & Complexity", 
            value: "Medium",
            desc: "Technical complexity, integrations required, risks involved. What does it take to build?",
            factors: ["Integration points", "Data quality", "Edge cases", "Compliance needs"],
          },
          { 
            title: "Impact Estimate", 
            value: "+$2M/year",
            desc: "Time saved, cost reduction, error prevention. Quantified in hours and currency.",
            factors: ["Time savings", "Error reduction", "FTE reallocation", "Customer satisfaction"],
          },
        ].map((item) => (
          <div 
            key={item.title}
            className="p-6 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <p className="text-3xl font-light text-black/80 mb-2">{item.value}</p>
            <h3 className="text-sm font-medium text-black/70 mb-2">{item.title}</h3>
            <p className="text-xs text-black/40 mb-4 leading-relaxed">{item.desc}</p>
            <div className="space-y-1">
              {item.factors.map((factor) => (
                <p key={factor} className="text-[10px] text-black/30 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-black/20" />
                  {factor}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div 
        className="p-5 rounded-xl"
        style={{ background: "rgba(0,0,0,0.02)" }}
      >
        <h4 className="text-sm font-medium text-black/50 mb-2">
          Automated Assessment
        </h4>
        <p className="text-xs text-black/40">
          Each workflow is scored automatically based on observed patterns, 
          data quality, and historical performance. No manual assessment required.
        </p>
      </div>
    </PageWrapper>
  );
}

function DiscoverRank() {
  return (
    <PageWrapper label="Discover · Step 4">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl font-light text-black/20">04</span>
        <h1 
          className="text-3xl"
          style={{ 
            fontFamily: "'Times New Roman', Georgia, serif",
            fontWeight: 300,
            color: "rgba(0,0,0,0.85)",
          }}
        >
          Rank
        </h1>
      </div>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        Prioritize opportunities by business unit, impact, risk, and effort.
        Select the next use-cases to forge.
      </p>

      {/* Table */}
      <div 
        className="rounded-xl overflow-hidden mb-8"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div 
          className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] tracking-[0.1em] uppercase text-black/40"
          style={{ background: "#fafafa", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="col-span-4">Workflow</div>
          <div className="col-span-2 text-center">Volume</div>
          <div className="col-span-2 text-center">Time Saved</div>
          <div className="col-span-2 text-center">AI Score</div>
          <div className="col-span-2 text-right">Annual Impact</div>
        </div>
        
        {DISCOVERED_WORKFLOWS.map((w) => (
          <div 
            key={w.id}
            className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-black/[0.01] transition-colors"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
          >
            <div className="col-span-4">
              <p className="text-sm text-black/80">{w.name}</p>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-xs text-black/50 font-mono">{w.volume}</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-black/30 text-xs">{w.currentTime}</span>
              <span className="mx-1 text-black/20">→</span>
              <span className="text-black/70 text-xs font-medium">{w.targetTime}</span>
            </div>
            <div className="col-span-2 text-center">
              <span 
                className="text-sm font-medium"
                style={{ color: w.aiScore >= 90 ? "rgba(0,0,0,0.8)" : w.aiScore >= 80 ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)" }}
              >
                {w.aiScore}
              </span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-lg font-light text-black/80">{w.impact}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl text-center" style={{ background: "rgba(0,0,0,0.02)" }}>
          <p className="text-2xl font-light text-black/80 mb-1">5</p>
          <p className="text-xs text-black/40">Workflows identified</p>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ background: "rgba(0,0,0,0.02)" }}>
          <p className="text-2xl font-light text-black/80 mb-1">+$4.9M</p>
          <p className="text-xs text-black/40">Total annual impact</p>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ background: "rgba(0,0,0,0.02)" }}>
          <p className="text-2xl font-light text-black/80 mb-1">88</p>
          <p className="text-xs text-black/40">Average AI score</p>
        </div>
      </div>
    </PageWrapper>
  );
}

// ============================================
// BUILD SECTION
// ============================================

function BuildSection({ page }: { page: BuildPage }) {
  return (
    <AnimatePresence mode="wait">
      {page === "intro" && <BuildIntro key="intro" />}
      {page === "blueprints" && <BuildBlueprints key="blueprints" />}
      {page === "fdes" && <BuildFDEs key="fdes" />}
      {page === "pmo" && <BuildPMO key="pmo" />}
    </AnimatePresence>
  );
}

function BuildIntro() {
  return (
    <PageWrapper label="Pharo Forge">
      <h1 
        className="text-4xl md:text-5xl mb-6"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "rgba(0,0,0,0.85)",
        }}
      >
        Build
      </h1>
      
      <p className="text-xl text-black/50 mb-8 max-w-2xl">
        Turn on your industrialized assembly line for AI.
      </p>
      
      <p className="text-black/40 mb-12 max-w-2xl leading-relaxed">
        Pharo Forge is a centralized system to track, build, and deliver
        your AI workforce. Not one-off projects. Repeatable, industrial systems.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {[
          { 
            layer: "Layer 01", 
            name: "The Blueprints",
            desc: "Pre-built agent patterns for common enterprise workflows. Production-ready templates.",
          },
          { 
            layer: "Layer 02", 
            name: "The Builders",
            desc: "Forward Deployed Engineers who work alongside your team to customize and deploy.",
          },
          { 
            layer: "Layer 03", 
            name: "AI PMO Dashboard",
            desc: "Single pane of glass for all AI initiatives. Track status, owners, and timelines.",
          },
        ].map((item) => (
          <div 
            key={item.layer}
            className="p-6 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <p className="text-[10px] text-black/30 uppercase tracking-wider mb-2">{item.layer}</p>
            <h3 className="text-lg font-medium text-black/70 mb-2">{item.name}</h3>
            <p className="text-xs text-black/40 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function BuildBlueprints() {
  const blueprints = [
    { 
      name: "RAG Legal", 
      category: "Document Processing",
      desc: "Contract analysis, compliance review, redlining, and clause extraction.",
      features: ["Multi-document RAG", "Citation tracking", "Version comparison", "Risk flagging"],
      time: "4-6 weeks",
    },
    { 
      name: "Transactional ERP", 
      category: "Finance Operations",
      desc: "Invoice processing, PO matching, reconciliation, and payment approval.",
      features: ["3-way matching", "Exception routing", "Audit trail", "ERP integration"],
      time: "3-5 weeks",
    },
    { 
      name: "Classification Agent", 
      category: "Customer Operations",
      desc: "Ticket routing, triage, categorization, and priority assignment.",
      features: ["Intent detection", "Sentiment analysis", "Auto-routing", "SLA tracking"],
      time: "2-4 weeks",
    },
    { 
      name: "Data Entry Agent", 
      category: "Operations",
      desc: "Form processing, data extraction, validation, and system entry.",
      features: ["OCR integration", "Field validation", "Error detection", "Batch processing"],
      time: "3-4 weeks",
    },
    { 
      name: "Report Generator", 
      category: "Analytics",
      desc: "Automated report creation, data aggregation, and insight generation.",
      features: ["Template system", "Data connectors", "Scheduling", "Distribution"],
      time: "2-3 weeks",
    },
    { 
      name: "Email Processor", 
      category: "Communications",
      desc: "Email classification, response drafting, and workflow triggering.",
      features: ["Intent extraction", "Template responses", "Escalation rules", "CRM sync"],
      time: "2-4 weeks",
    },
  ];

  return (
    <PageWrapper label="Build · Layer 01">
      <h1 
        className="text-3xl mb-4"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          color: "rgba(0,0,0,0.85)",
        }}
      >
        The Blueprints
      </h1>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        Unlock accelerated development through pre-built "Agent Patterns."
        Production-ready templates that have been battle-tested across industries.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {blueprints.map((bp) => (
          <div 
            key={bp.name}
            className="p-5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-sm font-medium text-black/70">{bp.name}</h3>
                <p className="text-[10px] text-black/30 uppercase tracking-wider">{bp.category}</p>
              </div>
              <span className="text-[10px] text-black/40 bg-black/[0.03] px-2 py-1 rounded">
                {bp.time}
              </span>
            </div>
            <p className="text-xs text-black/40 mb-3">{bp.desc}</p>
            <div className="flex flex-wrap gap-1">
              {bp.features.map((f) => (
                <span 
                  key={f} 
                  className="text-[9px] text-black/30 bg-black/[0.02] px-1.5 py-0.5 rounded"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function BuildFDEs() {
  return (
    <PageWrapper label="Build · Layer 02">
      <h1 
        className="text-3xl mb-2"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          color: "rgba(0,0,0,0.85)",
        }}
      >
        The Builders
      </h1>
      <p className="text-sm text-black/40 uppercase tracking-wider mb-8">
        Forward Deployed Engineers
      </p>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        Adapt the technology to your operations. A collaborative workspace
        where your team and our engineers work side-by-side.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div 
          className="p-6 rounded-xl"
          style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <h3 className="text-lg font-medium text-black/70 mb-4">Your Team Brings</h3>
          <ul className="space-y-3">
            {[
              { item: "Domain expertise", desc: "Deep knowledge of your industry and processes" },
              { item: "Business context", desc: "Understanding of stakeholder needs and constraints" },
              { item: "Process knowledge", desc: "Actual workflows, edge cases, and exceptions" },
              { item: "Stakeholder access", desc: "Direct line to decision makers and end users" },
            ].map(({ item, desc }) => (
              <li key={item} className="text-sm text-black/60">
                <span className="font-medium">{item}</span>
                <p className="text-xs text-black/40 mt-0.5">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
        <div 
          className="p-6 rounded-xl"
          style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <h3 className="text-lg font-medium text-black/70 mb-4">Pharo FDEs Bring</h3>
          <ul className="space-y-3">
            {[
              { item: "AI/ML engineering", desc: "LLM orchestration, fine-tuning, prompt engineering" },
              { item: "Production patterns", desc: "Scalable architectures that work in enterprise" },
              { item: "Integration expertise", desc: "Connecting to SAP, Salesforce, custom systems" },
              { item: "Deployment experience", desc: "Security, compliance, and monitoring setup" },
            ].map(({ item, desc }) => (
              <li key={item} className="text-sm text-black/60">
                <span className="font-medium">{item}</span>
                <p className="text-xs text-black/40 mt-0.5">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div 
        className="p-5 rounded-xl"
        style={{ background: "rgba(0,0,0,0.02)" }}
      >
        <h4 className="text-sm font-medium text-black/50 mb-2">Working Model</h4>
        <p className="text-xs text-black/40 leading-relaxed">
          FDEs are embedded with your team for the duration of the build. 
          Weekly syncs, shared Slack channels, and real-time collaboration 
          ensure alignment and rapid iteration.
        </p>
      </div>
    </PageWrapper>
  );
}

function BuildPMO() {
  const initiatives = [
    { name: "Invoice Reconciliation", owner: "Finance", status: "Live", timeline: "Completed", roi: "+$2M/yr" },
    { name: "Contract Analyzer", owner: "Legal", status: "UAT", timeline: "Week 2", roi: "+$800K/yr" },
    { name: "Support Triage", owner: "CX", status: "Build", timeline: "Week 4", roi: "+$1.2M/yr" },
    { name: "Expense Processing", owner: "Finance", status: "Design", timeline: "Week 6", roi: "+$600K/yr" },
    { name: "Employee Onboarding", owner: "HR", status: "Backlog", timeline: "Q2", roi: "+$300K/yr" },
  ];

  return (
    <PageWrapper label="Build · Layer 03">
      <h1 
        className="text-3xl mb-4"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          color: "rgba(0,0,0,0.85)",
        }}
      >
        AI PMO Dashboard
      </h1>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        A single pane of glass for all AI initiatives. Track Business Unit Owners,
        Timelines, Priorities, and real-time Status.
      </p>

      {/* Dashboard Table */}
      <div 
        className="rounded-xl overflow-hidden mb-8"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div 
          className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] tracking-[0.1em] uppercase text-black/40"
          style={{ background: "#fafafa", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="col-span-3">Initiative</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Timeline</div>
          <div className="col-span-3 text-right">Projected ROI</div>
        </div>
        
        {initiatives.map((init) => (
          <div 
            key={init.name}
            className="grid grid-cols-12 gap-4 px-4 py-4 items-center"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
          >
            <div className="col-span-3">
              <p className="text-sm text-black/70">{init.name}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-black/50">{init.owner}</span>
            </div>
            <div className="col-span-2 text-center">
              <span 
                className="text-[10px] px-2 py-1 rounded"
                style={{ 
                  background: init.status === "Live" ? "rgba(34,197,94,0.1)" : 
                              init.status === "UAT" ? "rgba(59,130,246,0.1)" :
                              init.status === "Build" ? "rgba(234,179,8,0.1)" :
                              "rgba(0,0,0,0.03)",
                  color: init.status === "Live" ? "rgb(22,163,74)" : 
                         init.status === "UAT" ? "rgb(37,99,235)" :
                         init.status === "Build" ? "rgb(161,98,7)" :
                         "rgba(0,0,0,0.4)",
                }}
              >
                {init.status}
              </span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-xs text-black/40">{init.timeline}</span>
            </div>
            <div className="col-span-3 text-right">
              <span className="text-sm font-medium text-black/70">{init.roi}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { value: "5", label: "Total initiatives" },
          { value: "1", label: "Live in production" },
          { value: "3", label: "In development" },
          { value: "+$4.9M", label: "Total projected ROI" },
        ].map((stat) => (
          <div 
            key={stat.label}
            className="p-4 rounded-xl text-center"
            style={{ background: "rgba(0,0,0,0.02)" }}
          >
            <p className="text-xl font-light text-black/80 mb-1">{stat.value}</p>
            <p className="text-[10px] text-black/40">{stat.label}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ============================================
// CONTROL SECTION
// ============================================

function ControlSection({ page }: { page: ControlPage }) {
  return (
    <AnimatePresence mode="wait">
      {page === "intro" && <ControlIntro key="intro" />}
      {page === "monitoring" && <ControlMonitoring key="monitoring" />}
      {page === "compliance" && <ControlCompliance key="compliance" />}
      {page === "billing" && <ControlBilling key="billing" />}
    </AnimatePresence>
  );
}

function ControlIntro() {
  return (
    <PageWrapper label="Pharo Tower">
      <h1 
        className="text-4xl md:text-5xl mb-6"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "rgba(0,0,0,0.85)",
        }}
      >
        Control
      </h1>
      
      <p className="text-xl text-black/50 mb-8 max-w-2xl">
        Turn on ongoing control and reinforcement.
      </p>
      
      <p className="text-black/40 mb-12 max-w-2xl leading-relaxed">
        Complete governance, forensic auditability, and financial control
        in one platform. Because once AI is live, the problem is no longer 
        technical—it&apos;s operational.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {[
          { 
            name: "Forensic Lens", 
            subtitle: "Monitoring",
            desc: "Live reasoning traces, real-time dashboards, latency and error tracking.",
          },
          { 
            name: "Safety Valve", 
            subtitle: "Compliance",
            desc: "Automated guardrails, human-in-the-loop controls, full audit trail.",
          },
          { 
            name: "P&L View", 
            subtitle: "Billing",
            desc: "Cost-to-serve tracking, ROI monitoring, budget caps per agent.",
          },
        ].map((item) => (
          <div 
            key={item.name}
            className="p-6 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-lg font-medium text-black/70 mb-1">{item.name}</h3>
            <p className="text-[10px] text-black/30 uppercase tracking-wider mb-3">{item.subtitle}</p>
            <p className="text-xs text-black/40 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function ControlMonitoring() {
  return (
    <PageWrapper label="Control · Monitoring">
      <h1 
        className="text-3xl mb-4"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          color: "rgba(0,0,0,0.85)",
        }}
      >
        The Forensic Lens
      </h1>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        Live reasoning traces for every interaction. Real-time dashboards for 
        latency, error rates, and volume spikes across your entire AI workforce.
      </p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { value: "12,847", label: "Reasoning traces", sub: "Last 24 hours" },
          { value: "<200ms", label: "Latency p99", sub: "All workers" },
          { value: "99.2%", label: "Accuracy", sub: "Across fleet" },
        ].map((metric) => (
          <div 
            key={metric.label}
            className="p-6 rounded-xl text-center"
            style={{ background: "rgba(0,0,0,0.02)" }}
          >
            <p className="text-3xl font-light text-black/80 mb-1">{metric.value}</p>
            <p className="text-sm text-black/50">{metric.label}</p>
            <p className="text-xs text-black/30 mt-1">{metric.sub}</p>
          </div>
        ))}
      </div>

      <div 
        className="p-6 rounded-xl mb-6"
        style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
      >
        <h3 className="text-sm font-medium text-black/50 mb-4">Example: Reasoning Trace</h3>
        <div className="font-mono text-xs text-black/60 space-y-2">
          <p><span className="text-black/30">[09:23:45]</span> Received invoice #INV-2024-8847</p>
          <p><span className="text-black/30">[09:23:45]</span> Extracted: vendor=ACME Corp, amount=$12,450.00</p>
          <p><span className="text-black/30">[09:23:46]</span> Matched PO #PO-2024-1123 (confidence: 0.97)</p>
          <p><span className="text-black/30">[09:23:46]</span> Variance check: within tolerance (0.2%)</p>
          <p><span className="text-black/30">[09:23:46]</span> Decision: AUTO-APPROVE → posted to SAP</p>
          <p><span className="text-black/30">[09:23:47]</span> Total time: 1.8s | Tokens: 847</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.02)" }}>
          <h4 className="text-sm font-medium text-black/50 mb-2">Real-time Alerts</h4>
          <p className="text-xs text-black/40">Slack/Teams notifications for anomalies, errors, and threshold breaches.</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.02)" }}>
          <h4 className="text-sm font-medium text-black/50 mb-2">Historical Analysis</h4>
          <p className="text-xs text-black/40">90-day retention for compliance audits and performance trending.</p>
        </div>
      </div>
    </PageWrapper>
  );
}

function ControlCompliance() {
  return (
    <PageWrapper label="Control · Compliance">
      <h1 
        className="text-3xl mb-4"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          color: "rgba(0,0,0,0.85)",
        }}
      >
        The Safety Valve
      </h1>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        Automated guardrails and human-in-the-loop controls.
        Set confidence thresholds where low-confidence actions are routed to humans.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div 
          className="p-6 rounded-xl"
          style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <h3 className="text-lg font-medium text-black/70 mb-4">Automated Guardrails</h3>
          <ul className="space-y-3">
            {[
              { item: "PII Detection", desc: "Automatic masking of personal data before processing" },
              { item: "Sensitive Data Classification", desc: "Tagging and routing based on data sensitivity" },
              { item: "Output Validation", desc: "Schema checks, format validation, business rules" },
              { item: "Rate Limiting", desc: "Per-agent, per-user, per-action throttling" },
            ].map(({ item, desc }) => (
              <li key={item} className="text-sm text-black/60">
                <span className="font-medium">{item}</span>
                <p className="text-xs text-black/40 mt-0.5">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
        <div 
          className="p-6 rounded-xl"
          style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <h3 className="text-lg font-medium text-black/70 mb-4">Human-in-the-Loop</h3>
          <ul className="space-y-3">
            {[
              { item: "Confidence Threshold", desc: "Route to human when confidence < 90%" },
              { item: "Escalation Rules", desc: "Custom rules by dollar amount, customer tier, etc." },
              { item: "Approval Workflows", desc: "Multi-step approvals for high-stakes actions" },
              { item: "Audit Trail", desc: "Complete record of human decisions and overrides" },
            ].map(({ item, desc }) => (
              <li key={item} className="text-sm text-black/60">
                <span className="font-medium">{item}</span>
                <p className="text-xs text-black/40 mt-0.5">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div 
        className="p-5 rounded-xl"
        style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.1)" }}
      >
        <h4 className="text-sm font-medium text-amber-800 mb-2">Example: HITL Trigger</h4>
        <p className="text-xs text-amber-700/80">
          Invoice #INV-2024-9921 routed to human review: confidence 84% on vendor match.
          Reason: New vendor not in approved list. Average review time: 45 seconds.
        </p>
      </div>
    </PageWrapper>
  );
}

function ControlBilling() {
  return (
    <PageWrapper label="Control · Billing">
      <h1 
        className="text-3xl mb-4"
        style={{ 
          fontFamily: "'Times New Roman', Georgia, serif",
          fontWeight: 300,
          color: "rgba(0,0,0,0.85)",
        }}
      >
        The P&L View
      </h1>
      
      <p className="text-lg text-black/50 mb-8 max-w-2xl">
        ROI Tracking and "Cost-to-Serve" per ticket or transaction.
        Budget caps per department or agent to prevent runaway API bills.
      </p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { value: "$0.12", label: "Cost per ticket", trend: "-15% vs last month" },
          { value: "$340K", label: "Monthly savings", trend: "+8% vs last month" },
          { value: "28x", label: "ROI multiplier", trend: "Stable" },
          { value: "$50K", label: "Budget cap", trend: "67% utilized" },
        ].map((metric) => (
          <div 
            key={metric.label}
            className="p-5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)" }}
          >
            <p className="text-2xl font-light text-black/80 mb-1">{metric.value}</p>
            <p className="text-xs text-black/50 mb-2">{metric.label}</p>
            <p className="text-[10px] text-black/30">{metric.trend}</p>
          </div>
        ))}
      </div>

      <div 
        className="rounded-xl overflow-hidden mb-6"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div 
          className="px-4 py-3 text-[10px] tracking-[0.1em] uppercase text-black/40"
          style={{ background: "#fafafa", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          Cost Breakdown by Agent
        </div>
        {[
          { agent: "Invoice Reconciliation", transactions: "14,230", cost: "$1,708", cpt: "$0.12" },
          { agent: "Contract Analyzer", transactions: "1,847", cost: "$923", cpt: "$0.50" },
          { agent: "Support Triage", transactions: "7,892", cost: "$789", cpt: "$0.10" },
        ].map((row) => (
          <div 
            key={row.agent}
            className="grid grid-cols-4 gap-4 px-4 py-3 text-sm"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
          >
            <span className="text-black/70">{row.agent}</span>
            <span className="text-black/50 text-center">{row.transactions}</span>
            <span className="text-black/50 text-center">{row.cost}</span>
            <span className="text-black/70 text-right font-mono">{row.cpt}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.02)" }}>
          <h4 className="text-sm font-medium text-black/50 mb-2">Budget Controls</h4>
          <p className="text-xs text-black/40">Set monthly caps per agent, department, or API provider. Automatic alerts at 80% utilization.</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.02)" }}>
          <h4 className="text-sm font-medium text-black/50 mb-2">Executive Reports</h4>
          <p className="text-xs text-black/40">Monthly ROI summaries, cost trends, and value generation reports for leadership.</p>
        </div>
      </div>
    </PageWrapper>
  );
}
