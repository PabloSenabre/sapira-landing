"use client";

import { useRouter } from "next/navigation";
import { ManifestoSection } from "@/components/manifesto";

/**
 * Homepage - Manifesto First
 * 
 * The homepage shows the Manifesto directly with the navbar.
 * When users click "Discover more", they navigate to /experience
 * which has the full immersive flow: Video → Terminal → XP → macOS
 */

export default function Home() {
  const router = useRouter();

  // Navigate to the immersive experience page
  const handleStartImmersiveExperience = () => {
    router.push("/experience");
  };

  return <ManifestoSection onComplete={handleStartImmersiveExperience} />;
}
