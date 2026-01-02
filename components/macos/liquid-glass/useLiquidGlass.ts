"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useLiquidGlassOptional } from "./LiquidGlassProvider";
import type { GlassElement } from "./shaders";

interface UseLiquidGlassOptions {
  // Unique identifier for this element
  id: string;
  // Corner radius in pixels
  radius?: number;
  // Effect intensity (0-2, where 1 is default)
  intensity?: number;
  // Whether the element is currently active/visible
  active?: boolean;
  // Offset from the element bounds (can expand or shrink the glass area)
  padding?: number;
}

interface UseLiquidGlassReturn {
  // Ref to attach to the element
  ref: React.RefObject<HTMLDivElement>;
  // Whether WebGL liquid glass is available
  isWebGLActive: boolean;
  // Manually update bounds (useful for animated elements)
  updateBounds: () => void;
}

/**
 * Hook to register an element for liquid glass WebGL rendering.
 * 
 * Usage:
 * ```tsx
 * const { ref, isWebGLActive } = useLiquidGlass({ id: 'my-element', radius: 24 });
 * return (
 *   <div ref={ref} style={{ background: isWebGLActive ? 'transparent' : 'rgba(...)' }}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useLiquidGlass({
  id,
  radius = 20,
  intensity = 1,
  active = true,
  padding = 0,
}: UseLiquidGlassOptions): UseLiquidGlassReturn {
  const ref = useRef<HTMLDivElement>(null);
  const context = useLiquidGlassOptional();
  const [isRegistered, setIsRegistered] = useState(false);

  // Calculate and update element bounds
  const updateBounds = useCallback(() => {
    if (!context || !ref.current || !active) return;

    const rect = ref.current.getBoundingClientRect();
    
    // Calculate center position and size with padding
    const element: GlassElement = {
      id,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
      radius,
      intensity,
    };

    if (isRegistered) {
      context.updateElement(id, element);
    } else {
      context.registerElement(element);
      setIsRegistered(true);
    }
  }, [context, id, radius, intensity, active, padding, isRegistered]);

  // Register element on mount, update on changes
  useEffect(() => {
    if (!context || !active) {
      // Unregister if context exists but element is not active
      if (context && isRegistered) {
        context.unregisterElement(id);
        setIsRegistered(false);
      }
      return;
    }

    // Initial registration
    updateBounds();

    // Update on resize
    const handleResize = () => {
      requestAnimationFrame(updateBounds);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (context && isRegistered) {
        context.unregisterElement(id);
        setIsRegistered(false);
      }
    };
  }, [context, id, active, updateBounds, isRegistered]);

  // Update bounds when radius or intensity changes
  useEffect(() => {
    if (isRegistered && context) {
      context.updateElement(id, { radius, intensity });
    }
  }, [radius, intensity, id, context, isRegistered]);

  return {
    ref: ref as React.RefObject<HTMLDivElement>,
    isWebGLActive: !!context?.isWebGLAvailable && active,
    updateBounds,
  };
}

/**
 * Hook for hover-based liquid glass effect on icons/buttons.
 * Only registers the element while hovered.
 */
export function useLiquidGlassHover({
  id,
  radius = 16,
  intensity = 0.8,
  padding = 4,
}: Omit<UseLiquidGlassOptions, "active">): UseLiquidGlassReturn & {
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
} {
  const [isHovered, setIsHovered] = useState(false);
  
  const { ref, isWebGLActive, updateBounds } = useLiquidGlass({
    id,
    radius,
    intensity,
    active: isHovered,
    padding,
  });

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
    // Small delay to let React update, then calculate bounds
    requestAnimationFrame(updateBounds);
  }, [updateBounds]);

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return {
    ref,
    isWebGLActive,
    updateBounds,
    isHovered,
    onMouseEnter,
    onMouseLeave,
  };
}

/**
 * Hook to control the ambient cursor spotlight
 */
export function useCursorSpotlight() {
  const context = useLiquidGlassOptional();

  const setActive = useCallback(
    (active: boolean) => {
      context?.setCursorActive(active);
    },
    [context]
  );

  return {
    setActive,
    isAvailable: !!context?.isWebGLAvailable,
  };
}

