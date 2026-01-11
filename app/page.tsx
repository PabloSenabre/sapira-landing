"use client";

import { useRouter } from "next/navigation";
import { ManifestoSection, ManifestoMobile } from "@/components/manifesto";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Homepage - Manifesto First
 * 
 * The homepage shows the Manifesto directly with the navbar.
 * - On desktop: Full experience with easter eggs, animations, and interactive elements
 * - On mobile: Simplified, readable version with reminder to visit on desktop
 * 
 * When users click "Discover more", they navigate to /experience
 * which has the full immersive flow (desktop only)
 */

export default function Home() {
  const router = useRouter();
  const isMobile = useIsMobile();

  // Navigate to the immersive experience page
  const handleStartImmersiveExperience = () => {
    router.push("/experience");
  };

  // Show simplified version on mobile
  if (isMobile) {
    return <ManifestoMobile onComplete={handleStartImmersiveExperience} />;
  }

  return <ManifestoSection onComplete={handleStartImmersiveExperience} />;
}
