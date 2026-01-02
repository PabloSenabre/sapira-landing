"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AIMessage, { Message } from "../AIMessage";
import AgentAction, { ActionStep } from "../AgentAction";

type ChatPhase = "idle" | "user-typing" | "agent-thinking" | "agent-running" | "complete";

interface SapiraAIChatProps {
  onTransformationReady: () => void;
  autoStart?: boolean;
  recoveryMode?: boolean;
}

const USER_PROMPT = "@Sapira AI, please digitize my entire operating system structure and design. It's outdated and I want it to leverage artificial intelligence capabilities.";
const RECOVERY_PROMPT = "@Sapira AI, my old applications just crashed. I need a modern solution that integrates all my tools with AI capabilities.";

const DISCOVERY_STEPS: ActionStep[] = [
  { id: "analyze", type: "thinking", title: "Analyzing current system architecture", description: "Scanning UI components, layouts, and design patterns", delay: 0, duration: 2000 },
  { id: "discovery-1", type: "tool", title: "Running Discovery Phase", toolName: "identify_pain_points", delay: 200, duration: 1200 },
  { id: "discovery-2", type: "tool", title: "Mapping user workflows", toolName: "map_user_workflows", delay: 200, duration: 1000 },
  { id: "discovery-3", type: "tool", title: "Assessing technology stack", toolName: "assess_technology_stack", delay: 200, duration: 1100 },
  { id: "design-1", type: "tool", title: "Designing new experience", toolName: "generate_modern_ui_system", delay: 300, duration: 1500 },
  { id: "design-2", type: "tool", title: "Implementing AI integration", toolName: "implement_ai_integration", delay: 200, duration: 1300 },
  { id: "design-3", type: "tool", title: "Creating component library", toolName: "create_component_library", delay: 200, duration: 1200 },
  { id: "apply", type: "progress", title: "Applying transformations", description: "Processing 47 components", delay: 300, duration: 2500 },
  { id: "success", type: "success", title: "Transformations applied", items: ["Menu bar modernized", "Dock redesigned", "Windows updated", "Icons refreshed"], delay: 200, duration: 2000 },
  { id: "complete", type: "complete", title: "Transformation complete", description: "Your system is ready for the future", delay: 500, duration: 800 },
];

const RECOVERY_STEPS: ActionStep[] = [
  { id: "detect", type: "thinking", title: "Analyzing legacy applications crash", description: "Detecting incompatible software", delay: 0, duration: 1800 },
  { id: "legacy-1", type: "tool", title: "Scanning legacy applications", toolName: "detect_legacy_software", delay: 200, duration: 1000 },
  { id: "migrate-excel", type: "tool", title: "Excel 2003 → AIO Analytics", toolName: "migrate_spreadsheet_data", delay: 200, duration: 1100 },
  { id: "migrate-outlook", type: "tool", title: "Outlook Express → Communications Hub", toolName: "migrate_email_platform", delay: 200, duration: 1000 },
  { id: "migrate-erp", type: "tool", title: "SAP R/3 → Business Intelligence", toolName: "migrate_erp_system", delay: 200, duration: 1200 },
  { id: "migrate-salesforce", type: "tool", title: "Salesforce Classic → Sales Cloud", toolName: "migrate_salesforce", delay: 200, duration: 1100 },
  { id: "migrate-crm", type: "tool", title: "ACT! CRM → Customer 360", toolName: "migrate_crm_platform", delay: 200, duration: 1000 },
  { id: "integrate-ai", type: "tool", title: "Injecting AI layer", toolName: "implement_ai_layer", delay: 300, duration: 1400 },
  { id: "apply", type: "progress", title: "Building unified platform", description: "6 apps → 1 platform", delay: 300, duration: 2000 },
  { id: "success", type: "success", title: "Migration complete", items: ["Excel → Analytics ✓", "Outlook → Comms ✓", "SAP → BI ✓", "Salesforce → Sales ✓", "CRM → 360 ✓", "AI integrated ✓"], delay: 200, duration: 2000 },
  { id: "complete", type: "complete", title: "Your AI workspace is ready", description: "Welcome to the future", delay: 500, duration: 800 },
];

function TypingCursor({ isLight = false }: { isLight?: boolean }) {
  return (
    <motion.span
      className="inline-block w-[2px] h-[1.1em] ml-[2px] align-text-bottom rounded-full"
      style={{ backgroundColor: isLight ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)" }}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function SapiraAIChat({ 
  onTransformationReady, 
  autoStart = true,
  recoveryMode = false,
}: SapiraAIChatProps) {
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [visibleSteps, setVisibleSteps] = useState<ActionStep[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIndexRef = useRef(0);

  const currentPrompt = useMemo(() => recoveryMode ? RECOVERY_PROMPT : USER_PROMPT, [recoveryMode]);
  const currentSteps = useMemo(() => recoveryMode ? RECOVERY_STEPS : DISCOVERY_STEPS, [recoveryMode]);
  const agentMessage = useMemo(() => 
    recoveryMode 
      ? "Your legacy applications couldn't scale. Let me consolidate them into one unified, AI-powered platform."
      : "Analyzing and transforming your system."
  , [recoveryMode]);

  useEffect(() => {
    if (phase !== "user-typing") {
      typingIndexRef.current = 0;
      setDisplayedText("");
      setIsTypingComplete(false);
      return;
    }
    const startDelay = setTimeout(() => {
      const typeNext = () => {
        if (typingIndexRef.current < currentPrompt.length) {
          typingIndexRef.current++;
          setDisplayedText(currentPrompt.slice(0, typingIndexRef.current));
          setTimeout(typeNext, 22 + Math.random() * 12 + (currentPrompt[typingIndexRef.current - 1] === ',' ? 120 : 0));
        } else {
          setIsTypingComplete(true);
          setTimeout(() => {
            setMessages([{ id: "user-1", role: "user", content: currentPrompt }]);
            setDisplayedText("");
            setPhase("agent-thinking");
          }, 500);
        }
      };
      typeNext();
    }, 600);
    return () => clearTimeout(startDelay);
  }, [phase, currentPrompt]);

  useEffect(() => {
    if (autoStart && phase === "idle") {
      const timeout = setTimeout(() => setPhase("user-typing"), recoveryMode ? 500 : 800);
      return () => clearTimeout(timeout);
    }
  }, [autoStart, phase, recoveryMode]);

  useEffect(() => {
    if (phase === "agent-thinking") {
      const timeout = setTimeout(() => {
        setPhase("agent-running");
        setCurrentStepIndex(0);
        setVisibleSteps([currentSteps[0]]);
      }, 1800);
      return () => clearTimeout(timeout);
    }
  }, [phase, currentSteps]);

  const handleStepComplete = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < currentSteps.length) {
      const nextStep = currentSteps[nextIndex];
      setTimeout(() => {
        setCurrentStepIndex(nextIndex);
        setVisibleSteps((prev) => [...prev, nextStep]);
      }, nextStep.delay);
    } else {
      setPhase("complete");
    }
  }, [currentStepIndex, currentSteps]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, visibleSteps, displayedText]);

  // LIQUID GLASS LIGHT THEME for recovery mode
  if (recoveryMode) {
    return (
      <div className="h-full flex flex-col relative overflow-hidden">
        {/* === LIQUID GLASS BACKGROUND === */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          }}
        />
        
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
            top: "-20%",
            left: "-10%",
            filter: "blur(60px)",
          }}
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
            bottom: "-15%",
            right: "-10%",
            filter: "blur(80px)",
          }}
          animate={{ 
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%)",
            top: "40%",
            left: "30%",
            filter: "blur(100px)",
          }}
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* === FLOATING GLASS HEADER === */}
        <motion.div
          className="mx-6 mt-6 rounded-3xl relative z-10"
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-16 flex items-center justify-center px-6">
            <span 
              className="text-2xl font-light tracking-wide"
              style={{
                fontFamily: "'Times New Roman', Georgia, serif",
                color: "rgba(255,255,255,0.95)",
                textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                letterSpacing: "0.05em",
              }}
            >
              Sapira
            </span>
            <AnimatePresence mode="wait">
              {(phase === "agent-thinking" || phase === "agent-running") && (
                <motion.div
                  className="ml-3 flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* === MAIN CONTENT AREA === */}
        <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
          {/* Welcome state */}
          <AnimatePresence>
            {phase === "idle" && messages.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="inline-block p-8 rounded-3xl mb-6"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(40px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span 
                    className="text-4xl font-light"
                    style={{
                      fontFamily: "'Times New Roman', Georgia, serif",
                      color: "rgba(255,255,255,0.95)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Sapira
                  </span>
                </motion.div>
                <motion.p 
                  className="text-sm tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Unifying Your Workspace
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User message bubble */}
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className="mb-6 flex justify-end"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <div 
                  className="px-5 py-4 rounded-3xl max-w-[80%]"
                  style={{
                    background: "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(40px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.95)" }}>
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Agent response */}
          <AnimatePresence>
            {phase !== "idle" && phase !== "user-typing" && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar - Floating glass */}
                  <motion.div 
                    className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.3)",
                      backdropFilter: "blur(40px)",
                      border: "1px solid rgba(255,255,255,0.4)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                  >
                    <span 
                      className="text-xl font-light"
                      style={{
                        fontFamily: "'Times New Roman', Georgia, serif",
                        color: "rgba(255,255,255,0.95)",
                      }}
                    >
                      S
                    </span>
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    {phase === "agent-thinking" && (
                      <motion.div
                        className="flex items-center gap-2 py-4 px-5 rounded-2xl inline-block"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(40px)",
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-white/70"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </motion.div>
                    )}

                    {(phase === "agent-running" || phase === "complete") && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.p 
                          className="text-[15px] leading-relaxed mb-5 px-1"
                          style={{ color: "rgba(255,255,255,0.9)" }}
                        >
                          {agentMessage}
                        </motion.p>

                        {/* === MAIN FLOATING GLASS CARD === */}
                        <motion.div 
                          className="rounded-3xl overflow-hidden"
                          style={{
                            background: "rgba(255,255,255,0.25)",
                            backdropFilter: "blur(60px) saturate(200%)",
                            WebkitBackdropFilter: "blur(60px) saturate(200%)",
                            border: "1px solid rgba(255,255,255,0.5)",
                            boxShadow: `
                              0 20px 60px rgba(0,0,0,0.15),
                              0 8px 24px rgba(0,0,0,0.1),
                              inset 0 1px 0 rgba(255,255,255,0.8),
                              inset 0 -1px 0 rgba(255,255,255,0.2)
                            `,
                          }}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {/* Card header */}
                          <div 
                            className="px-6 py-4 flex items-center gap-3"
                            style={{ 
                              borderBottom: "1px solid rgba(255,255,255,0.3)",
                              background: "rgba(255,255,255,0.1)",
                            }}
                          >
                            <div className="flex gap-2">
                              {[0,1,2].map(i => (
                                <div key={i} className="w-3 h-3 rounded-full bg-white/40" />
                              ))}
                            </div>
                            <span 
                              className="ml-2 text-[12px] tracking-[0.15em] uppercase font-medium"
                              style={{ color: "rgba(255,255,255,0.8)" }}
                            >
                              Unification Process
                            </span>
                          </div>

                          {/* Steps */}
                          <div className="p-6">
                            {visibleSteps.map((step, index) => (
                              <AgentAction
                                key={step.id}
                                step={step}
                                isActive={index === currentStepIndex}
                                onComplete={index === currentStepIndex ? handleStepComplete : undefined}
                              />
                            ))}
                          </div>
                        </motion.div>

                        {/* CTA Button */}
                        <AnimatePresence>
                          {phase === "complete" && (
                            <motion.div
                              className="mt-8"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <motion.button
                                className="px-10 py-5 rounded-2xl text-[14px] tracking-wide font-medium w-full"
                                style={{
                                  background: "rgba(255,255,255,0.35)",
                                  backdropFilter: "blur(40px)",
                                  border: "1px solid rgba(255,255,255,0.5)",
                                  color: "rgba(255,255,255,0.95)",
                                  boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
                                }}
                                whileHover={{
                                  background: "rgba(255,255,255,0.45)",
                                  boxShadow: "0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
                                  scale: 1.02,
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onTransformationReady}
                              >
                                <span className="flex items-center justify-center gap-3">
                                  Enter Your New Workspace
                                  <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  >
                                    →
                                  </motion.span>
                                </span>
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* === FLOATING GLASS INPUT === */}
        <motion.div
          className="mx-6 mb-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <div className="min-h-[60px] p-5 pr-16 text-[14px]" style={{ color: "rgba(255,255,255,0.95)" }}>
              {phase === "user-typing" ? (
                <span>
                  {displayedText}
                  {!isTypingComplete && <TypingCursor isLight={false} />}
                </span>
              ) : (
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Message Sapira...</span>
              )}
            </div>
            <button
              className="absolute right-4 bottom-4 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: displayedText ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              <span style={{ fontSize: "18px" }}>↑</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // === DARK THEME (Original) ===
  return (
    <div className="h-full flex flex-col" style={{ background: "#000" }}>
      <motion.div
        className="h-14 flex items-center justify-center shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span 
          className="text-xl font-light tracking-wide"
          style={{
            fontFamily: "'Times New Roman', Georgia, serif",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Sapira
        </span>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence>
          {phase === "idle" && messages.length === 0 && (
            <motion.div className="text-center py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span style={{ fontFamily: "'Times New Roman', Georgia, serif", fontSize: "42px", fontWeight: 300, color: "rgba(255,255,255,0.85)" }}>Sapira</span>
              <motion.p className="text-xs tracking-[0.2em] uppercase mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>Ready</motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {messages.map((message) => (
            <AIMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {phase !== "idle" && phase !== "user-typing" && (
            <motion.div className="mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-start gap-4">
                <motion.div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontFamily: "'Times New Roman', Georgia, serif", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>S</span>
                </motion.div>
                <div className="flex-1 min-w-0 pt-0.5">
                  {phase === "agent-thinking" && (
                    <motion.div className="flex items-center gap-1 py-3">
                      {[0,1,2].map((i) => (
                        <motion.div key={i} className="w-1 h-1 rounded-full bg-white/40" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                      ))}
                    </motion.div>
                  )}
                  {(phase === "agent-running" || phase === "complete") && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <motion.p className="text-[13px] leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>{agentMessage}</motion.p>
                      <motion.div className="rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <div className="flex gap-1.5">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/10" />)}</div>
                          <span className="ml-2 text-[10px] tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>process</span>
                        </div>
                        <div className="p-4">
                          {visibleSteps.map((step, index) => (
                            <AgentAction key={step.id} step={step} isActive={index === currentStepIndex} onComplete={index === currentStepIndex ? handleStepComplete : undefined} />
                          ))}
                        </div>
                      </motion.div>
                      <AnimatePresence>
                        {phase === "complete" && (
                          <motion.div className="mt-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <motion.button
                              className="px-6 py-3 rounded-lg text-[12px] tracking-[0.1em] uppercase"
                              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
                              whileHover={{ background: "rgba(255,255,255,0.08)" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={onTransformationReady}
                            >
                              <span className="flex items-center gap-3">View Result <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span></span>
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <motion.div className="p-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="relative rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-full min-h-[52px] p-4 pr-12 text-[13px]" style={{ color: "rgba(255,255,255,0.8)" }}>
            {phase === "user-typing" ? <span>{displayedText}{!isTypingComplete && <TypingCursor />}</span> : <span style={{ color: "rgba(255,255,255,0.2)" }}>Message Sapira...</span>}
          </div>
          <button className="absolute right-3 bottom-3 w-7 h-7 rounded flex items-center justify-center" style={{ background: displayedText ? "rgba(255,255,255,0.1)" : "transparent", color: displayedText ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)" }}>
            <span style={{ fontSize: "14px" }}>↑</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
