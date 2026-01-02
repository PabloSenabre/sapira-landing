"use client";

import { motion } from "framer-motion";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  isTyping?: boolean;
}

interface AIMessageProps {
  message: Message;
  onTypingComplete?: () => void;
  shouldType?: boolean;
}

export default function AIMessage({ message }: AIMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className={`max-w-[85%] ${isUser ? "order-2" : "order-1"}`}>
        <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {/* Avatar */}
          <motion.div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isUser ? (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>U</span>
            ) : (
              <span 
                style={{ 
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                S
              </span>
            )}
          </motion.div>

          {/* Message */}
          <motion.div
            className="px-4 py-3 rounded-lg"
            style={{
              background: isUser ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, x: isUser ? 5 : -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: isUser ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)" }}
            >
              {message.content}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
