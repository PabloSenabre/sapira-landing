"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the user is on a mobile device
 * Uses screen width as the primary detection method
 * 
 * Important: Returns false during SSR/initial render to avoid hydration issues
 * The mobile version is shown only when window.innerWidth < breakpoint
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  // Start with false (desktop) to avoid hydration mismatch
  // The check happens in useEffect on client-side
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    // Check screen width - primary method
    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < breakpoint;
      setIsMobile(isSmallScreen);
    };

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  // Only return true for mobile after client-side hydration
  // This prevents SSR/CSR mismatch
  return hasMounted && isMobile;
}

/**
 * Hook to get if we should show the full desktop experience
 * Returns false on mobile, true on desktop
 */
export function useDesktopExperience(): boolean {
  return !useIsMobile(1024);
}

