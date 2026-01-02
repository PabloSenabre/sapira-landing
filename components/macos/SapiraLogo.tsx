"use client";

interface SapiraLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

export default function SapiraLogo({ className = "", size = "md", showTagline = false }: SapiraLogoProps) {
  const sizes = {
    xs: { text: "text-sm", tracking: "tracking-normal" },
    sm: { text: "text-base", tracking: "tracking-wide" },
    md: { text: "text-xl", tracking: "tracking-wide" },
    lg: { text: "text-4xl", tracking: "tracking-normal" },
    xl: { text: "text-7xl", tracking: "tracking-tight" },
  };

  const { text, tracking } = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span 
        className={`${text} ${tracking} font-light select-none`}
        style={{
          fontFamily: "'Times New Roman', 'Georgia', serif",
          letterSpacing: size === "xl" ? "-0.03em" : "0.05em",
        }}
      >
        Sapira
      </span>
      {showTagline && (
        <span 
          className="text-[10px] tracking-[0.3em] uppercase mt-1"
          style={{ opacity: 0.4 }}
        >
          Enterprise AI
        </span>
      )}
    </div>
  );
}
