"use client";

import { useState, useEffect, useCallback, useRef, RefObject } from "react";

interface UseScrollDismissOptions {
  /** Whether the easter egg is currently open */
  isOpen: boolean;
  /** Callback to close the easter egg */
  onClose: () => void;
  /** Reference to the element to track visibility (for viewport-based fade) */
  elementRef?: RefObject<HTMLElement | null>;
  /** Threshold at which to start fading (0.5 = when 50% is visible). Used with elementRef. */
  fadeThreshold?: number;
  /** Distance in pixels to scroll before fully fading (for scroll-distance mode). Used when no elementRef. */
  fadeDistance?: number;
  /** Whether to auto-close when faded out (default: true) */
  autoClose?: boolean;
}

interface UseScrollDismissReturn {
  /** Current opacity value (0-1) based on visibility or scroll distance */
  opacity: number;
}

/**
 * Hook to fade out and dismiss easter eggs.
 * 
 * Two modes:
 * 1. Viewport mode (with elementRef): Fades based on element visibility in viewport
 * 2. Scroll distance mode (without elementRef): Fades based on scroll distance from open position
 */
export function useScrollDismiss({
  isOpen,
  onClose,
  elementRef,
  fadeThreshold = 0.5,
  fadeDistance = 120,
  autoClose = true,
}: UseScrollDismissOptions): UseScrollDismissReturn {
  const [opacity, setOpacity] = useState(1);
  const hasClosedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const initialScrollRef = useRef<number | null>(null);

  // Mode: viewport-based (has elementRef) or scroll-distance-based
  const useViewportMode = !!elementRef;

  // Calculate visibility ratio of element in viewport
  const calculateVisibility = useCallback(() => {
    if (!elementRef?.current) return 1;

    const rect = elementRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;

    if (elementHeight === 0) return 1;

    // Calculate how much of the element is visible
    // Top of element relative to viewport
    const topVisible = Math.max(0, Math.min(rect.bottom, windowHeight));
    // Bottom of element relative to viewport  
    const bottomVisible = Math.max(0, Math.min(windowHeight - rect.top, windowHeight));
    
    // Actual visible height
    const visibleHeight = Math.min(topVisible, bottomVisible, elementHeight);
    
    // Visibility ratio (0 = not visible, 1 = fully visible)
    const visibilityRatio = Math.max(0, Math.min(1, visibleHeight / elementHeight));

    return visibilityRatio;
  }, [elementRef]);

  // Calculate opacity based on scroll distance from initial position
  const calculateScrollDistanceOpacity = useCallback(() => {
    if (initialScrollRef.current === null) return 1;

    const currentScroll = window.scrollY;
    const scrollDelta = Math.abs(currentScroll - initialScrollRef.current);

    // Map scroll delta to opacity
    const newOpacity = Math.max(0, 1 - scrollDelta / fadeDistance);
    return newOpacity;
  }, [fadeDistance]);

  // Reset when opening/closing
  useEffect(() => {
    if (isOpen) {
      // Capture initial scroll position for scroll-distance mode
      initialScrollRef.current = window.scrollY;
      hasClosedRef.current = false;
      setOpacity(1);
    } else {
      initialScrollRef.current = null;
      hasClosedRef.current = false;
    }
  }, [isOpen]);

  // Handle scroll events to update opacity
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleScroll = () => {
      if (hasClosedRef.current) return;

      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(() => {
        let newOpacity: number;

        if (useViewportMode) {
          // Viewport-based mode
          const visibility = calculateVisibility();

          // Start fading when visibility drops below threshold
          if (visibility <= fadeThreshold) {
            newOpacity = visibility / fadeThreshold;
          } else {
            newOpacity = 1;
          }
        } else {
          // Scroll-distance mode
          newOpacity = calculateScrollDistanceOpacity();
        }

        newOpacity = Math.max(0, Math.min(1, newOpacity));
        setOpacity(newOpacity);

        // Auto-close when almost invisible
        if (autoClose && newOpacity < 0.05 && !hasClosedRef.current) {
          hasClosedRef.current = true;
          onClose();
        }
      });
    };

    // Initial calculation
    handleScroll();

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isOpen, fadeThreshold, autoClose, onClose, calculateVisibility, calculateScrollDistanceOpacity, useViewportMode]);

  return {
    opacity,
  };
}
