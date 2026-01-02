"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

export interface ActionStep {
  id: string;
  type: "thinking" | "tool" | "progress" | "success" | "complete";
  title: string;
  description?: string;
  toolName?: string;
  progress?: number;
  items?: string[];
  delay: number;
  duration: number;
}

interface AgentActionProps {
  step: ActionStep;
  isActive: boolean;
  onComplete?: () => void;
}

export default function AgentAction({ step, isActive, onComplete }: AgentActionProps) {
  const [progress, setProgress] = useState(0);
  const [visibleItems, setVisibleItems] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Colors for liquid glass theme (dark text on light bg)
  const colors = useMemo(() => ({
    check: "rgba(0,0,0,0.5)",
    activeDot: "rgba(0,0,0,0.4)",
    inactiveDot: "rgba(0,0,0,0.15)",
    toolPrefix: "rgba(0,0,0,0.3)",
    toolName: isCompleted ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.7)",
    toolSuffix: "rgba(0,0,0,0.3)",
    title: isCompleted ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.7)",
    description: "rgba(0,0,0,0.4)",
    progressBg: "rgba(0,0,0,0.1)",
    progressFill: isCompleted ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.4)",
    arrow: "rgba(0,0,0,0.3)",
    item: "rgba(0,0,0,0.5)",
  }), [isCompleted]);

  useEffect(() => {
    if (!isActive) return;

    let timeout: NodeJS.Timeout;

    if (step.type === "progress" || step.type === "thinking") {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const linearProgress = Math.min(elapsed / step.duration, 1);
        const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
        setProgress(easedProgress * 100);

        if (linearProgress < 1) {
          timeout = setTimeout(animate, 30);
        } else {
          setIsCompleted(true);
          onComplete?.();
        }
      };
      animate();
    } else if (step.type === "tool") {
      timeout = setTimeout(() => {
        setIsCompleted(true);
        onComplete?.();
      }, step.duration);
    } else if (step.type === "success" && step.items) {
      let itemIndex = 0;
      const revealNext = () => {
        if (itemIndex < step.items!.length) {
          setVisibleItems(itemIndex + 1);
          itemIndex++;
          timeout = setTimeout(revealNext, 250);
        } else {
          setIsCompleted(true);
          onComplete?.();
        }
      };
      timeout = setTimeout(revealNext, 200);
    } else if (step.type === "complete") {
      timeout = setTimeout(() => {
        setIsCompleted(true);
        onComplete?.();
      }, step.duration);
    }

    return () => clearTimeout(timeout);
  }, [isActive, step, onComplete]);

  return (
    <motion.div
      className="py-2.5"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        {/* Status indicator */}
        <div className="w-5 flex items-center justify-center pt-0.5">
          {isCompleted ? (
            <motion.span
              className="text-[12px] font-medium"
              style={{ color: colors.check }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ✓
            </motion.span>
          ) : isActive ? (
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.activeDot }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.inactiveDot }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {step.type === "tool" && step.toolName && (
            <div className="font-mono text-[12px] leading-relaxed">
              <span style={{ color: colors.toolPrefix }}>sapira.</span>
              <span style={{ color: colors.toolName, fontWeight: 500 }}>
                {step.toolName}
              </span>
              <span style={{ color: colors.toolSuffix }}>()</span>
            </div>
          )}

          {(step.type === "thinking" || step.type === "progress") && (
            <div>
              <p
                className="text-[12px] font-medium"
                style={{ color: colors.title }}
              >
                {step.title}
              </p>
              {step.description && (
                <p 
                  className="text-[11px] mt-1"
                  style={{ color: colors.description }}
                >
                  {step.description}
                </p>
              )}
              <div className="mt-2">
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: colors.progressBg }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: colors.progressFill }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.05 }}
                  />
                </div>
              </div>
            </div>
          )}

          {step.type === "success" && (
            <div>
              <p className="text-[12px] font-medium mb-2" style={{ color: colors.title }}>
                {step.title}
              </p>
              {step.items && (
                <div className="space-y-1.5 pl-1">
                  {step.items.slice(0, visibleItems).map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 text-[11px]"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span style={{ color: colors.arrow }}>→</span>
                      <span style={{ color: colors.item }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step.type === "complete" && (
            <div>
              <p className="text-[12px] font-medium" style={{ color: colors.title }}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-[11px] mt-1" style={{ color: colors.description }}>
                  {step.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
