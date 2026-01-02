"use client";

import { ManifestoSection } from "@/components/manifesto";

export default function ManifestoPage() {
  const handleComplete = () => {
    console.log("Manifesto complete!");
  };

  return <ManifestoSection onComplete={handleComplete} />;
}

