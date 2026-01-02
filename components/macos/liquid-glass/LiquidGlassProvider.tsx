"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import LiquidGlassCanvas from "./LiquidGlassCanvas";
import type { GlassElement, CursorSpotlight } from "./shaders";

interface LiquidGlassContextType {
  // Register a glass element
  registerElement: (element: GlassElement) => void;
  // Unregister a glass element by ID
  unregisterElement: (id: string) => void;
  // Update an existing element
  updateElement: (id: string, updates: Partial<GlassElement>) => void;
  // Set cursor spotlight visibility
  setCursorActive: (active: boolean) => void;
  // Check if WebGL is available
  isWebGLAvailable: boolean;
}

const LiquidGlassContext = createContext<LiquidGlassContextType | null>(null);

interface LiquidGlassProviderProps {
  children: ReactNode;
  cursorSize?: number;
  enableCursorSpotlight?: boolean;
}

export function LiquidGlassProvider({
  children,
  cursorSize = 50,
  enableCursorSpotlight = true,
}: LiquidGlassProviderProps) {
  const [elements, setElements] = useState<Map<string, GlassElement>>(new Map());
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorActive, setCursorActiveState] = useState(enableCursorSpotlight);
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);
  const [isHoveringElement, setIsHoveringElement] = useState(false);

  // Check WebGL availability on mount
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    setIsWebGLAvailable(!!gl);
  }, []);

  // Track mouse position for cursor spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Track if hovering over any registered element
  useEffect(() => {
    const elementsArray = Array.from(elements.values());
    const { x, y } = cursorPosition;

    const isHovering = elementsArray.some((elem) => {
      const halfW = elem.width / 2;
      const halfH = elem.height / 2;
      return (
        x >= elem.x - halfW &&
        x <= elem.x + halfW &&
        y >= elem.y - halfH &&
        y <= elem.y + halfH
      );
    });

    setIsHoveringElement(isHovering);
  }, [cursorPosition, elements]);

  // Register a new glass element
  const registerElement = useCallback((element: GlassElement) => {
    setElements((prev) => {
      const next = new Map(prev);
      next.set(element.id, element);
      return next;
    });
  }, []);

  // Unregister a glass element
  const unregisterElement = useCallback((id: string) => {
    setElements((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Update an existing element
  const updateElement = useCallback((id: string, updates: Partial<GlassElement>) => {
    setElements((prev) => {
      const existing = prev.get(id);
      if (!existing) return prev;

      const next = new Map(prev);
      next.set(id, { ...existing, ...updates });
      return next;
    });
  }, []);

  // Set cursor spotlight active state
  const setCursorActive = useCallback((active: boolean) => {
    setCursorActiveState(active);
  }, []);

  // Convert elements map to array for canvas
  const elementsArray = useMemo(() => Array.from(elements.values()), [elements]);

  // Cursor spotlight config - only active when not hovering elements
  const cursor: CursorSpotlight = useMemo(
    () => ({
      x: cursorPosition.x,
      y: cursorPosition.y,
      size: cursorSize,
      active: cursorActive && enableCursorSpotlight && !isHoveringElement,
    }),
    [cursorPosition, cursorSize, cursorActive, enableCursorSpotlight, isHoveringElement]
  );

  const contextValue = useMemo(
    () => ({
      registerElement,
      unregisterElement,
      updateElement,
      setCursorActive,
      isWebGLAvailable,
    }),
    [registerElement, unregisterElement, updateElement, setCursorActive, isWebGLAvailable]
  );

  return (
    <LiquidGlassContext.Provider value={contextValue}>
      {/* WebGL Canvas Layer - transparent overlay for glass effects */}
      {isWebGLAvailable && (
        <LiquidGlassCanvas
          elements={elementsArray}
          cursor={cursor}
        />
      )}
      {/* Children render on top */}
      {children}
    </LiquidGlassContext.Provider>
  );
}

// Hook to access the liquid glass context
export function useLiquidGlassContext() {
  const context = useContext(LiquidGlassContext);
  if (!context) {
    throw new Error("useLiquidGlassContext must be used within a LiquidGlassProvider");
  }
  return context;
}

// Check if we're inside a provider (for optional usage)
export function useLiquidGlassOptional() {
  return useContext(LiquidGlassContext);
}

