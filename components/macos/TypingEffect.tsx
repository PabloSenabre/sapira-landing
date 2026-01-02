"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTypingEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  enabled?: boolean;
}

export function useTypingEffect({
  text,
  speed = 40,
  delay = 0,
  onComplete,
  enabled = true,
}: UseTypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Store onComplete in a ref to avoid re-triggering effect
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const reset = useCallback(() => {
    setDisplayedText("");
    setIsTyping(false);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      reset();
      return;
    }

    let timeout: NodeJS.Timeout;
    let charIndex = 0;
    let cancelled = false;

    const startTyping = () => {
      if (cancelled) return;
      setIsTyping(true);
      
      const typeChar = () => {
        if (cancelled) return;
        
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
          // Vary speed slightly for more natural feel
          const variation = Math.random() * 20 - 10;
          timeout = setTimeout(typeChar, speed + variation);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          onCompleteRef.current?.();
        }
      };

      typeChar();
    };

    timeout = setTimeout(startTyping, delay);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [text, speed, delay, enabled, reset]);

  return { displayedText, isTyping, isComplete, reset };
}

// Cursor component for typing effect
export function TypingCursor({ isVisible = true }: { isVisible?: boolean }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setShow((prev) => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <span
      className="inline-block w-[2px] h-[1.1em] ml-0.5 align-text-bottom"
      style={{
        backgroundColor: show ? "rgba(255,255,255,0.8)" : "transparent",
        transition: "background-color 0.1s",
      }}
    />
  );
}

