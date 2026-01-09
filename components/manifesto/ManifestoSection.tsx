"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from "framer-motion";
import { useScrollDismiss } from "@/lib/useScrollDismiss";
import FloatingAppIcons from "./FloatingAppIcons";
import SoftwareEvolution from "./SoftwareEvolution";
import { LiquidGlassCursor } from "@/components/liquid-glass";
import MatrixCorporateRain from "./MatrixCorporateRain";
import { 
  HiddenManifestoProvider, 
  HiddenWord, 
  DiscoveryProgress, 
  SecretManifestoReveal 
} from "./HiddenManifesto";
import RentalInvoice from "./RentalInvoice";
import NavbarMinimal from "@/components/NavbarMinimal";

interface ManifestoSectionProps {
  onComplete?: () => void;
}

// Konami code sequence
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function ManifestoSection({ onComplete }: ManifestoSectionProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const [serverRoomOpen, setServerRoomOpen] = useState(false);
  const [bloatwareHellOpen, setBloatwareHellOpen] = useState(false);
  const [softwareEvolutionOpen, setSoftwareEvolutionOpen] = useState(false);
  const [matrixRainOpen, setMatrixRainOpen] = useState(false);
  const [rentalInvoiceOpen, setRentalInvoiceOpen] = useState(false);
  const [secretBuffer, setSecretBuffer] = useState('');
  
  const { scrollYProgress } = useScroll();

  // Console easter egg - runs once on mount
  useEffect(() => {
    console.log(`
    %c███████╗ █████╗ ██████╗ ██╗██████╗  █████╗ 
    %c██╔════╝██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗
    %c███████╗███████║██████╔╝██║██████╔╝███████║
    %c╚════██║██╔══██║██╔═══╝ ██║██╔══██╗██╔══██║
    %c███████║██║  ██║██║     ██║██║  ██║██║  ██║
    %c╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
    `, 
    'color: #6366f1',
    'color: #8b5cf6', 
    'color: #a855f7',
    'color: #d946ef',
    'color: #ec4899',
    'color: #f43f5e'
    );
    console.log('%c🔮 The future of software is personal.', 'font-size: 16px; color: #1a1a1a; font-family: Georgia;');
    console.log('%c💡 Hint: Try the Konami code...', 'font-size: 12px; color: #999;');
    console.log('%c📊 Or click on "billions"...', 'font-size: 12px; color: #999;');
    console.log('%c💊 What if I told you... type "matrix"', 'font-size: 12px; color: #00ff00;');
    console.log('%c📜 Some words are not what they seem. Find them all...', 'font-size: 12px; color: #d4a012;');
  }, []);

  // Konami code detector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase() === e.key ? e.key : e.key;
      
      if (key === KONAMI_CODE[konamiIndex] || key.toLowerCase() === KONAMI_CODE[konamiIndex]) {
        const newIndex = konamiIndex + 1;
        setKonamiIndex(newIndex);
        
        if (newIndex === KONAMI_CODE.length) {
          setKonamiActivated(true);
          setKonamiIndex(0);
          // Play a sound effect
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+dm5mTjIWBgH58fn+BhIeJi4uLi4qJh4WDgX99fHx8fX6Ag4aIi42OjY2Mi4mGg4F/fXx7e3x9f4KFiIuNj4+OjYuJhoOAfn18e3t8fYCDhoqMj5CQj46MiYaDgH59fHt7fH2AgoaJjI+QkI+OjImGg4B+fXx7e3x+gIOGioyPkJCPjoyJhoOAfn18e3t8foGEh4qNj5CQj42LiYaDgX5+fHt7fH6Bg4eKjY+QkI+NjImGg4F+fXx7e3x+gYSHio2PkJCPjYuJhoOBfn18e3t8foCDhomMj5CQj42LiYaDgX59fHt7fH6Bg4eKjY+QkI+NjImGg4F+fXx7fHx+gYSHio2PkJCPjYyJhoOBfn18e3t8foCDhoqMj5CQj46MiYaDgH5+fHt7fH6Bg4aKjI+QkI+OjImGg4B+fXx7');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  // Secret word detector for "matrix" and "wakeup"
  useEffect(() => {
    const handleSecretKey = (e: KeyboardEvent) => {
      // Only track letter keys
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        setSecretBuffer(prev => {
          const newBuffer = (prev + e.key.toLowerCase()).slice(-10); // Keep last 10 chars
          
          // Check for secret words
          if (newBuffer.includes('matrix') || newBuffer.includes('wakeup') || newBuffer.includes('neo')) {
            setMatrixRainOpen(true);
            return '';
          }
          return newBuffer;
        });
      }
    };

    window.addEventListener('keydown', handleSecretKey);
    return () => window.removeEventListener('keydown', handleSecretKey);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.97) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 100);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Removed auto-navigation on scroll end - user must click "Join Sapira" button


  return (
    <HiddenManifestoProvider>
    <motion.div
      ref={containerRef}
      className={`relative transition-all duration-500 ${konamiActivated ? 'bg-black' : 'bg-[#F5F5F3]'}`}
      style={{ minHeight: "350vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Navbar - Liquid Glass */}
      <NavbarMinimal />

      {/* Konami celebration */}
      <AnimatePresence>
        {konamiActivated && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <span className="text-8xl mb-4 block">🎮</span>
              <h2 className="text-4xl font-bold text-white mb-2">KONAMI UNLOCKED!</h2>
              <p className="text-green-400 font-mono text-lg">+ 30 lives • God mode activated</p>
              <p className="text-gray-400 mt-4 text-sm">You discovered the first easter egg...</p>
              <motion.button
                className="mt-8 px-6 py-3 bg-white text-black rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setKonamiActivated(false)}
              >
                Continue reading →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Server Room Easter Egg */}
      <AnimatePresence>
        {serverRoomOpen && (
          <ServerRoomExperience isOpen={serverRoomOpen} onClose={() => setServerRoomOpen(false)} />
        )}
      </AnimatePresence>

      {/* Bloatware Hell Easter Egg */}
      <AnimatePresence>
        {bloatwareHellOpen && (
          <BloatwareHell onClose={() => setBloatwareHellOpen(false)} />
        )}
      </AnimatePresence>

      {/* Software Evolution Easter Egg - rendered inline in the section */}

      {/* Matrix Easter Egg is now rendered inline in the sections below */}

      {/* Rental Invoice is now rendered inline in Section 6 */}

      {/* Floating App Icons */}
      <FloatingAppIcons scrollProgress={scrollYProgress} konamiMode={konamiActivated} />

      {/* Parallax Company Logos */}
      <ParallaxLogosContainer scrollProgress={scrollYProgress} />

      {/* Custom Liquid Glass cursor */}
      <LiquidGlassCursor 
        enabled={!konamiActivated && !serverRoomOpen && !bloatwareHellOpen && !softwareEvolutionOpen && !rentalInvoiceOpen}
        size={40}
        zIndex={5}
      />


      {/* Main Content */}
      <div 
        className="relative z-10 mx-auto" 
        style={{ maxWidth: "640px", padding: "0 24px" }}
      >
        
        {/* Section 1: Opening Statement */}
        <section className="min-h-screen flex flex-col justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {/* Badge - Liquid Glass style */}
            <motion.div 
              className="mb-16 flex justify-center"
              whileHover={{ scale: 1.02 }}
              title="Try the Konami code: ↑↑↓↓←→←→BA"
            >
              <div className={`liquid-glass-wrap liquid-glass-wrap--small ${konamiActivated ? 'liquid-glass-wrap--dark' : ''}`}>
                <div className="liquid-glass-button" style={{ cursor: 'default' }}>
                  <span>Sapira AI • Manifesto</span>
                </div>
              </div>
            </motion.div>

            {/* Main Title */}
            <h1 className="text-center mb-20">
              <motion.span 
                className={`block leading-[0.95] tracking-[-0.03em] ${konamiActivated ? 'text-white' : 'text-[#1a1a1a]'} ${glitchText ? 'animate-pulse' : ''}`}
                style={{ 
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(2.8rem, 10vw, 5.5rem)",
                  fontWeight: 400,
                }}
              >
                The one-size-fits-all
              </motion.span>
              <span 
                className={`block leading-[0.95] tracking-[-0.03em] italic ${konamiActivated ? 'text-purple-400' : 'text-[#1a1a1a]'}`}
                style={{ 
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(2.8rem, 10vw, 5.5rem)",
                  fontWeight: 400,
                }}
              >
                era is over.
              </span>
            </h1>

          </motion.div>
        </section>

        {/* Section 2: The Problem */}
        <section className="py-24">
          <ManifestoParagraph delay={0} konamiMode={konamiActivated}>
            <p>
              We reached the limit of standardized solutions.
            </p>
          </ManifestoParagraph>

          <ManifestoParagraph delay={0.1} konamiMode={konamiActivated}>
            <p>
              For years, we <HighlightText>adapted to the cloud</HighlightText>.<br />
              But year after year, our workflows remained trapped in the same boxes.
            </p>
          </ManifestoParagraph>

          <ManifestoParagraph delay={0.2} konamiMode={konamiActivated}>
            <p>
              <StrikeThrough>The <HiddenWord id="vision" konamiMode={konamiActivated}>vision</HiddenWord> of agile tools</StrikeThrough> gave way <HiddenWord id="to" konamiMode={konamiActivated}>to</HiddenWord> a dozen generic platforms <InlineTechLogos /> that we pay for but barely use.
            </p>
          </ManifestoParagraph>
        </section>

        {/* Section 3: The Contrast */}
        <section className="py-24">
          <ManifestoParagraph delay={0} konamiMode={konamiActivated}>
            <p>
              We choose our <em>mission</em>. Our <em>culture</em>. Our <em>strategy</em>.
            </p>
          </ManifestoParagraph>

          <ManifestoParagraph delay={0.1} konamiMode={konamiActivated}>
            <p>
              But our software? Still a rental.
              <span className="block mt-4">
                Made for <ClickableHighlight onClick={() => setSoftwareEvolutionOpen(true)}>billions</ClickableHighlight>. <strong>Not for <HiddenWord id="you" konamiMode={konamiActivated}>you</HiddenWord>.</strong>
              </span>
            </p>
          </ManifestoParagraph>

          {/* Software Evolution - iPad showing the 3 eras (inline) */}
          <AnimatePresence>
            {softwareEvolutionOpen && (
              <SoftwareEvolution 
                isOpen={softwareEvolutionOpen} 
                onClose={() => setSoftwareEvolutionOpen(false)} 
              />
            )}
          </AnimatePresence>

          </section>

        {/* Section 4: The Vision */}
        <section className="py-24">
          <ManifestoParagraph delay={0} konamiMode={konamiActivated}>
            <p>
              <HiddenWord id="when" konamiMode={konamiActivated}>When</HiddenWord> software is oriented around <em>your</em> business…
            </p>
          </ManifestoParagraph>

          <ManifestoParagraph delay={0.1} konamiMode={konamiActivated}>
            <p>
              It's freed from the friction, <ClickableHighlight onClick={() => setBloatwareHellOpen(true)}>the bloat</ClickableHighlight>, and the rigid structures.
            </p>
          </ManifestoParagraph>

          <ManifestoParagraph delay={0.2} konamiMode={konamiActivated}>
            <p>
              We believe your ambition <HiddenWord id="becomes" konamiMode={konamiActivated}>becomes</HiddenWord> <HiddenWord id="reality" konamiMode={konamiActivated}>reality</HiddenWord>{" "}
              when software is the <strong>nervous system</strong> of your unique vision.
            </p>
          </ManifestoParagraph>
        </section>

        {/* Matrix Corporate Rain Easter Egg - Inline in the manifesto */}
        <MatrixCorporateRain 
          isActive={matrixRainOpen} 
          onComplete={() => {}} 
        />

        {/* Section 5: Introducing Sapira - Hidden when Matrix easter egg is active */}
        <AnimatePresence>
          {!matrixRainOpen && (
            <motion.section 
              className="py-32 text-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p 
                  className={`text-lg mb-6 tracking-wide ${konamiActivated ? 'text-gray-400' : 'text-[#666]'}`}
                  style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
                >
                  That's why we built
                </p>
                <h2 
                  className={`leading-none tracking-[-0.02em] ${konamiActivated ? 'text-white' : 'text-[#1a1a1a]'}`}
                  style={{ 
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "clamp(4rem, 15vw, 10rem)",
                fontWeight: 300,
                  }}
                >
                  Sapira.
                </h2>
                <p 
                  className={`mt-8 text-2xl ${konamiActivated ? 'text-purple-400' : 'text-[#1a1a1a]'}`}
                  style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400 }}
                >
                  The first <em>AI-native</em> software factory.
                </p>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Section 6: The Solution */}
        <section className="py-24 relative">
          <ManifestoParagraph delay={0} konamiMode={konamiActivated}>
            <p>
              Operating systems based on <strong>your logic</strong>, <strong>your data</strong>, 
              and <strong>your context</strong>.
            </p>
          </ManifestoParagraph>

          <div className="relative">
            <ManifestoParagraph delay={0.1} konamiMode={konamiActivated}>
              <p>
                Not another <ClickableHighlight onClick={() => setRentalInvoiceOpen(true)}>subscription</ClickableHighlight>—<br />
                <span className="italic">a system built for you.</span>
              </p>
            </ManifestoParagraph>

            {/* Rental Invoice - positioned relative to this section */}
            <RentalInvoice 
              isOpen={rentalInvoiceOpen} 
              onClose={() => setRentalInvoiceOpen(false)}
              inline={true}
            />
          </div>
        </section>

        {/* Section 7: The Future */}
        <section className="py-24">
          <ManifestoParagraph delay={0} konamiMode={konamiActivated}>
            <p>
              Someday, we'll look back on traditional SaaS like{" "}
              <ClickableHighlight onClick={() => setServerRoomOpen(true)}>old server rooms</ClickableHighlight>.
            </p>
          </ManifestoParagraph>

          <ManifestoParagraph delay={0.1} konamiMode={konamiActivated}>
            <p>
              We believe in a future where software is no longer <TripleClickHighlight onClick={() => setMatrixRainOpen(true)}>rented</TripleClickHighlight>, but <strong>born</strong>.
            </p>
          </ManifestoParagraph>

          <ManifestoParagraph delay={0.2} konamiMode={konamiActivated}>
            <p>
              Where the code adapts to the company—<br />
              for those who <HiddenWord id="dare" konamiMode={konamiActivated}>dare</HiddenWord> to <HiddenWord id="build" konamiMode={konamiActivated}>build</HiddenWord> different.
            </p>
          </ManifestoParagraph>
        </section>

        {/* Section 8: CTA */}
        <section className="min-h-screen flex flex-col justify-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 
              className={`mb-6 leading-[1.15] tracking-[-0.02em] ${konamiActivated ? 'text-white' : 'text-[#1a1a1a]'}`}
              style={{ 
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                fontWeight: 400,
              }}
            >
              A new era of<br />
              <span className="italic">personal software</span><br />
              is here.
            </h2>

            <motion.p
              className={`text-3xl mb-16 ${konamiActivated ? 'text-purple-400' : 'text-[#1a1a1a]'}`}
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              We are Sapira.
            </motion.p>

            {/* Liquid Glass Button - Starts immersive experience */}
            <div className="liquid-glass-wrap">
              <button 
                className="liquid-glass-button"
                onClick={() => {
                  if (onComplete) {
                    onComplete();
                  }
                }}
              >
                <span>Discover more</span>
              </button>
            </div>

            {/* Easter egg hint */}
            <motion.p
              className={`mt-12 text-sm opacity-30 ${konamiActivated ? 'text-gray-400' : 'text-[#666]'}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              transition={{ delay: 1 }}
              viewport={{ once: true }}
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              ↑↑↓↓←→←→BA
            </motion.p>

            {/* Footer */}
            <footer className={`mt-32 pt-12 border-t ${konamiActivated ? 'border-gray-800' : 'border-[#e0e0e0]'}`}>
              <div 
                className={`flex flex-wrap items-center justify-center gap-4 text-sm ${konamiActivated ? 'text-gray-500' : 'text-[#999]'}`}
                style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
              >
                <span>Sapira, Inc. ©2025</span>
                <span>•</span>
                <a href="#" className="hover:text-[#666] transition-colors">Terms</a>
                <span>•</span>
                <a href="#" className="hover:text-[#666] transition-colors">Privacy</a>
              </div>
            </footer>
          </motion.div>
        </section>
      </div>

      {/* Subtle grain overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hidden Manifesto Components */}
      <DiscoveryProgress konamiMode={konamiActivated} />
      <SecretManifestoReveal konamiMode={konamiActivated} />
    </motion.div>
    </HiddenManifestoProvider>
  );
}

// Paragraph component with consistent styling
function ManifestoParagraph({ 
  children, 
  delay = 0,
  konamiMode = false
}: { 
  children: React.ReactNode; 
  delay?: number;
  konamiMode?: boolean;
}) {
  return (
    <motion.div
      className="mb-16 last:mb-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: "-100px" }}
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        lineHeight: 1.6,
        color: konamiMode ? "#e5e5e5" : "#1a1a1a",
        fontWeight: 400,
      }}
    >
      {children}
    </motion.div>
  );
}

// Highlight text with yellow background
function HighlightText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span 
      className="relative inline px-1 -mx-0.5 cursor-pointer"
      style={{
        background: "rgba(255, 230, 100, 0.5)",
        borderRadius: "2px",
      }}
      whileHover={{ 
        background: "rgba(255, 200, 50, 0.7)",
        transition: { duration: 0.2 }
      }}
    >
      <em>{children}</em>
    </motion.span>
  );
}

// Clickable highlight for easter eggs
function ClickableHighlight({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.span 
      className="relative inline px-1 -mx-0.5 cursor-pointer select-none"
      style={{
        background: "rgba(255, 230, 100, 0.5)",
        borderRadius: "2px",
      }}
      whileHover={{ 
        background: "rgba(255, 200, 50, 0.7)",
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      title="Click me..."
    >
      <em>{children}</em>
    </motion.span>
  );
}

// Triple-click highlight for Matrix easter egg
function TripleClickHighlight({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    clickCount.current += 1;
    
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }
    
    if (clickCount.current >= 3) {
      onClick();
      clickCount.current = 0;
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 500);
    }
  };

  return (
    <motion.span 
      className="relative inline px-1 -mx-0.5 cursor-pointer select-none"
      style={{
        background: "rgba(0, 255, 0, 0.15)",
        borderRadius: "2px",
      }}
      whileHover={{ 
        background: "rgba(0, 255, 0, 0.3)",
        scale: 1.02,
        textShadow: "0 0 8px rgba(0, 255, 0, 0.5)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      title="There's something hidden here..."
    >
      <em style={{ color: 'inherit' }}>{children}</em>
    </motion.span>
  );
}

// ============================================
// SERVER ROOM EASTER EGG - Mini CRT Monitor with real GIFs
// ============================================

// Real server room GIFs from the internet
const SERVER_ROOM_GIFS = [
  { 
    url: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
    title: 'server-room.gif',
    description: 'Data Center, circa 2005'
  },
  { 
    url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
    title: 'server-lights.gif', 
    description: 'The "cloud" before cloud'
  },
  { 
    url: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
    title: 'blinking-leds.gif',
    description: 'Friday 11:47 PM'
  },
  { 
    url: 'https://media.giphy.com/media/QNFhOolVeCzPQ2Mx85/giphy.gif',
    title: 'network-rack.gif',
    description: '"We\'ll fix it Monday"'
  },
  { 
    url: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
    title: 'matrix-code.gif',
    description: 'What IT sees'
  },
];

function ServerRoomExperience({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentGif, setCurrentGif] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Scroll-based fade out - dismisses easter egg when user scrolls
  const { opacity: scrollOpacity } = useScrollDismiss({
    isOpen,
    onClose,
    fadeDistance: 120,
    autoClose: true,
  });

  // Cycle through GIFs
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setImageLoaded(false);
      setCurrentGif(prev => (prev + 1) % SERVER_ROOM_GIFS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const gif = SERVER_ROOM_GIFS[currentGif];

  const handlePrev = () => {
    setImageLoaded(false);
    setCurrentGif(prev => prev === 0 ? SERVER_ROOM_GIFS.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setImageLoaded(false);
    setCurrentGif(prev => (prev + 1) % SERVER_ROOM_GIFS.length);
  };

  return (
    <motion.div
      className="fixed z-[300] pointer-events-none"
      style={{ 
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: scrollOpacity,
      }}
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: scrollOpacity, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 30 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      {/* CRT Monitor Frame */}
      <div 
        className="relative pointer-events-auto"
        style={{
          width: 'min(450px, 92vw)',
        }}
      >
        {/* Monitor body - Classic beige/gray CRT */}
        <div 
          className="rounded-2xl p-4 relative"
          style={{
            background: 'linear-gradient(160deg, #e8e4dc 0%, #c9c5bc 40%, #b0aca3 100%)',
            boxShadow: '0 30px 70px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {/* Screen bezel - dark frame */}
          <div 
            className="rounded-xl p-3 relative"
            style={{
              background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
              boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.9)',
            }}
          >
            {/* CRT Screen */}
            <div 
              className="relative rounded-lg overflow-hidden bg-black"
              style={{
                aspectRatio: '4/3',
              }}
            >
              {/* GIF Display */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black"
                key={currentGif}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={gif.url}
                  alt={gif.title}
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoaded(true)}
                  style={{ 
                    filter: 'contrast(1.1) saturate(0.9)',
                  }}
                />
              </motion.div>

              {/* Loading state */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="text-green-500 font-mono text-sm"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Loading...
                  </motion.div>
                </div>
              )}

              {/* Screen curvature effect */}
              <div 
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
                  boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6)',
                }}
              />

              {/* Scanlines overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-10 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
                  mixBlendMode: 'multiply',
                }}
              />

              {/* Screen reflection */}
              <div 
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, transparent 100%)',
                }}
              />

              {/* Bottom info bar - VCR style */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-2 z-30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-red-600"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-red-500 text-[10px] font-mono font-bold tracking-wider">● REC</span>
                  </div>
                  <span className="text-white/70 text-[10px] font-mono">
                    {currentGif + 1}/{SERVER_ROOM_GIFS.length}
                  </span>
                </div>
              </div>

              {/* CRT flicker effect */}
              <motion.div 
                className="absolute inset-0 bg-white pointer-events-none z-30"
                animate={{ opacity: [0, 0, 0.02, 0, 0, 0, 0.015, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Monitor info bar */}
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
              <span className="text-[10px] text-zinc-600 font-mono tracking-wider">PWR</span>
            </div>
            <motion.span 
              className="text-[11px] text-zinc-500 font-mono"
              key={currentGif}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {gif.description}
            </motion.span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-widest">LEGACY™</span>
          </div>

          {/* Monitor controls - VCR style buttons */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <button 
              onClick={handlePrev}
              className="w-10 h-7 rounded bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 transition-colors flex items-center justify-center border-b-2 border-zinc-900"
            >
              <span className="text-zinc-300 text-xs">⏮</span>
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-7 rounded bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 transition-colors flex items-center justify-center border-b-2 border-zinc-900"
            >
              <span className="text-zinc-300 text-sm">{isPlaying ? '⏸' : '▶︎'}</span>
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-7 rounded bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 transition-colors flex items-center justify-center border-b-2 border-zinc-900"
            >
              <span className="text-zinc-300 text-xs">⏭</span>
            </button>
          </div>
        </div>

        {/* Monitor stand - chunky 90s style */}
        <div className="flex justify-center">
          <div 
            className="w-20 h-8 -mt-1 rounded-b-lg"
            style={{
              background: 'linear-gradient(180deg, #b0aca3 0%, #8a8680 100%)',
            }}
          />
        </div>
        <div className="flex justify-center -mt-1">
          <div 
            className="w-32 h-3 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, #9a968d 0%, #7a766d 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Close button - red power button style */}
        <motion.button
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(145deg, #ff6b6b, #ee5a5a)',
            boxShadow: '0 3px 10px rgba(238, 90, 90, 0.4)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          <span className="text-white text-sm font-bold">×</span>
        </motion.button>
      </div>

      {/* Invisible click-away area (no background change) */}
      <motion.div 
        className="fixed inset-0 -z-10 pointer-events-auto" 
        onClick={onClose}
      />
    </motion.div>
  );
}

// ============================================
// BLOATWARE HELL EASTER EGG
// ============================================

// SOFTWARE_POPUPS is defined after logo components below

function BloatwareHell({ onClose }: { onClose: () => void }) {
  const [popups, setPopups] = useState<typeof SOFTWARE_POPUPS>([]);
  const [clippyVisible, setClippyVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Spawn popups progressively
    SOFTWARE_POPUPS.forEach((popup, i) => {
      setTimeout(() => {
        setPopups(prev => [...prev, popup]);
      }, i * 350);
    });

    // Show Clippy after popups
    setTimeout(() => setClippyVisible(true), 4000);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 400);
  };

  // Positions spread across screen
  const getRandomPosition = (id: number) => {
    const positions = [
      { top: '8%', left: '3%' },
      { top: '5%', right: '8%' },
      { top: '22%', left: '12%' },
      { top: '12%', left: '35%' },
      { top: '30%', right: '3%' },
      { bottom: '35%', left: '5%' },
      { bottom: '28%', right: '12%' },
      { top: '42%', left: '22%' },
      { bottom: '18%', left: '28%' },
      { bottom: '8%', right: '20%' },
    ];
    return positions[id - 1] || positions[0];
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.75)' }}
    >
      {/* Close button - Liquid Glass style - Top Right */}
      <motion.div 
        className="fixed top-6 right-6 z-[500]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="liquid-glass-wrap" style={{ fontSize: '0.9rem' }}>
          <button 
            className="liquid-glass-button"
            onClick={handleClose}
          >
            <span>Close ×</span>
          </button>
          <div className="liquid-glass-shadow"></div>
        </div>
      </motion.div>

      {/* Popups - Each styled like real software */}
      {popups.map((popup, index) => (
        <motion.div
          key={popup.id}
          className="absolute rounded-xl shadow-2xl overflow-hidden"
          style={{ 
            ...getRandomPosition(popup.id),
            width: 'min(300px, 85vw)',
            zIndex: 300 + index,
            background: '#ffffff',
          }}
          initial={{ opacity: 0, scale: 0.3, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotate: (index % 2 === 0 ? 1.5 : -1.5) * ((index % 4) + 1) * 0.5,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          whileHover={{ scale: 1.03, zIndex: 450, rotate: 0 }}
        >
          {/* Header - Software branded with real logo */}
          <div 
            className="flex items-center justify-between px-4 py-3"
            style={{ background: popup.headerBg }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm">
                <popup.Logo size={16} />
              </div>
              <span className="text-white text-sm font-semibold tracking-wide">{popup.software}</span>
            </div>
            <motion.button
              className="text-white/60 hover:text-white text-xl leading-none w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                // 50% chance button works
                if (Math.random() > 0.4) {
                  setPopups(prev => prev.filter(p => p.id !== popup.id));
                }
              }}
            >
              ×
            </motion.button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <h4 className="text-gray-900 font-semibold text-sm mb-2">{popup.title}</h4>
            <p className="text-gray-600 text-xs mb-4 leading-relaxed">{popup.content}</p>
            <div className="flex gap-2">
              <motion.button
                className="flex-1 px-4 py-2 text-white text-xs rounded-lg font-medium"
                style={{ background: popup.ctaBg }}
                whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                {popup.cta}
              </motion.button>
              <motion.button
                className="px-3 py-2 text-gray-400 text-xs rounded-lg border border-gray-200 hover:border-gray-300"
                whileHover={{ scale: 1.02 }}
              >
                Later
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Clippy - appears after popups */}
      <AnimatePresence>
        {clippyVisible && (
          <motion.div
            className="fixed bottom-6 right-6 flex items-end gap-3 z-[400]"
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Speech bubble */}
            <motion.div 
              className="bg-[#FFFFD5] border-2 border-gray-800 rounded-xl p-4 shadow-xl max-w-[220px] relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs text-gray-800 leading-relaxed">
                It looks like you're trying to do something simple. Would you like me to make it complicated?
              </p>
              {/* Bubble tail */}
              <div 
                className="absolute -right-3 bottom-4 w-0 h-0"
                style={{
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderLeft: '12px solid #1f2937',
                }}
              />
              <div 
                className="absolute -right-2 bottom-4 w-0 h-0"
                style={{
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderLeft: '10px solid #FFFFD5',
                }}
              />
            </motion.div>
            
            {/* Clippy character */}
            <motion.div
              className="text-5xl select-none"
              animate={{ 
                rotate: [0, -8, 8, -8, 0],
                y: [0, -4, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              📎
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Strikethrough with animation
function StrikeThrough({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline">
      <span className="relative opacity-60">
        {children}
        <motion.span
          className="absolute left-0 right-0 top-1/2 h-[2px] bg-[#1a1a1a]"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          style={{ transformOrigin: "left" }}
        />
      </span>
    </span>
  );
}


// Real company logos as SVG components
const GoogleLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const MicrosoftLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 21 21" width={size} height={size}>
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
);

const SalesforceLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#00A1E0" d="M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.16 5.22c-.345 0-.69-.03-1.02-.105-.645 1.155-1.875 1.935-3.3 1.935-.585 0-1.155-.135-1.65-.39-.66 1.545-2.19 2.625-3.96 2.625-1.86 0-3.435-1.17-4.035-2.82a3.659 3.659 0 0 1-.825.09c-2.01 0-3.645-1.65-3.645-3.675 0-1.5.9-2.79 2.19-3.345-.24-.57-.375-1.2-.375-1.86C2.22 6.06 4.41 3.87 7.11 3.87c1.5 0 2.865.69 3.75 1.785l-.854-.24z"/>
  </svg>
);

const OracleLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#F80000" d="M16.412 4.412h-8.82a7.588 7.588 0 0 0-.008 15.176h8.828a7.588 7.588 0 0 0 0-15.176zm-.193 12.502H7.786a4.915 4.915 0 0 1 0-9.828h8.433a4.914 4.914 0 1 1 0 9.828z"/>
  </svg>
);

const SlackLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
    <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
    <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/>
    <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

const ZoomLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#2D8CFF" d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-5.2-3.5l-3.5 2.3V8.5c0-.55-.45-1-1-1H5.5c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1h8.8c.55 0 1-.45 1-1v-2.3l3.5 2.3V8.5z"/>
  </svg>
);

const AdobeLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#FF0000" d="M14.5 0H24v24L14.5 0zM9.5 0H0v24L9.5 0zM12 8.5l4.5 11.5h-3l-1.3-3.5H8.5L12 8.5z"/>
  </svg>
);

const AtlassianLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <defs>
      <linearGradient id="atlassian-grad" x1="99.99%" x2="24.24%" y1="30.85%" y2="74.42%">
        <stop offset="0%" stopColor="#0052CC"/>
        <stop offset="92.3%" stopColor="#2684FF"/>
      </linearGradient>
    </defs>
    <path fill="url(#atlassian-grad)" d="M7.127 11.167a.592.592 0 0 0-1.01.103L1.06 21.793a.593.593 0 0 0 .528.857h6.962a.593.593 0 0 0 .529-.322c1.585-3.123.612-7.848-1.952-11.161z"/>
    <path fill="#2684FF" d="M11.126 1.361a13.822 13.822 0 0 0-.792 13.79l3.592 7.098a.593.593 0 0 0 .528.322h6.963a.593.593 0 0 0 .528-.857L12.137 1.464a.592.592 0 0 0-1.011-.103z"/>
  </svg>
);

const NotionLogo = ({ size = 24, color = "#000000" }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill={color} d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.22.186c-.094-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.62c-.094-.42.14-1.026.793-1.073l3.454-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.513.28-.886.747-.933l3.224-.187zM2.877.466l13.542-.886c1.636-.14 2.055-.047 3.082.7l4.25 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.1C1.663 1.12 2.037.56 2.877.466z"/>
  </svg>
);

const AsanaLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#F06A6A" d="M18.78 12.653a5.11 5.11 0 1 0 0 10.22 5.11 5.11 0 0 0 0-10.22zm-13.56 0a5.11 5.11 0 1 0 0 10.22 5.11 5.11 0 0 0 0-10.22zm11.89-6.543a5.11 5.11 0 1 0-10.22 0 5.11 5.11 0 0 0 10.22 0z"/>
  </svg>
);

const JiraLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <defs>
      <linearGradient id="jira-grad-1" x1="98.03%" x2="58.89%" y1="0.22%" y2="40.77%">
        <stop offset="18%" stopColor="#0052CC"/>
        <stop offset="100%" stopColor="#2684FF"/>
      </linearGradient>
      <linearGradient id="jira-grad-2" x1="100.17%" x2="55.42%" y1="0.05%" y2="44.73%">
        <stop offset="18%" stopColor="#0052CC"/>
        <stop offset="100%" stopColor="#2684FF"/>
      </linearGradient>
    </defs>
    <path fill="#2684FF" d="M23.323 11.13L13.192 1 12 0 4.627 7.373.677 11.323a.918.918 0 0 0 0 1.296l7.069 7.069L12 24l7.373-7.373.07-.07 3.88-4.103a.918.918 0 0 0 0-1.324zM12 15.535L8.465 12 12 8.465 15.535 12 12 15.535z"/>
  </svg>
);

const FigmaLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#F24E1E" d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8z"/>
    <path fill="#A259FF" d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z"/>
    <path fill="#1ABCFE" d="M12 0v8h4a4 4 0 0 0 0-8h-4z"/>
    <path fill="#0ACF83" d="M4 4a4 4 0 0 0 4 4h4V0H8a4 4 0 0 0-4 4z"/>
    <path fill="#FF7262" d="M16 12a4 4 0 1 1-4-4 4 4 0 0 1 4 4z"/>
  </svg>
);

// Additional logos for Bloatware Hell
const HubSpotLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#FF7A59" d="M18.164 7.93V5.084a2.198 2.198 0 0 0 1.267-1.984v-.066A2.2 2.2 0 0 0 17.23.833h-.066a2.2 2.2 0 0 0-2.2 2.2v.067c0 .86.5 1.6 1.222 1.96v2.88a5.92 5.92 0 0 0-2.596 1.2L6.798 3.834a2.632 2.632 0 0 0 .083-.633 2.65 2.65 0 1 0-2.65 2.65c.43 0 .835-.106 1.197-.287l6.67 5.176a5.89 5.89 0 0 0-.53 2.45 5.93 5.93 0 0 0 .588 2.576l-2.095 2.095a2.188 2.188 0 0 0-1.307-.435 2.2 2.2 0 1 0 2.2 2.2c0-.487-.16-.935-.43-1.3l2.038-2.037a5.918 5.918 0 1 0 5.602-8.36zm-.967 8.742a2.88 2.88 0 1 1 0-5.76 2.88 2.88 0 0 1 0 5.76z"/>
  </svg>
);

const TeamsLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#5059C9" d="M20.625 8.127q-.55 0-1.025-.205-.475-.205-.832-.563-.358-.357-.563-.832Q18 6.053 18 5.502q0-.54.205-1.02t.563-.837q.357-.358.832-.563.474-.205 1.025-.205.54 0 1.02.205t.837.563q.358.357.563.837.205.48.205 1.02 0 .55-.205 1.025-.205.475-.563.832-.357.358-.837.563-.48.205-1.02.205zm0-3.75q-.469 0-.797.328-.328.328-.328.797 0 .469.328.797.328.328.797.328.469 0 .797-.328.328-.328.328-.797 0-.469-.328-.797-.328-.328-.797-.328zM24 10.002v5.578q0 .774-.293 1.46-.293.685-.803 1.194-.51.51-1.195.803-.686.293-1.459.293-.445 0-.908-.105-.463-.106-.85-.329-.293.95-.855 1.729-.563.78-1.319 1.336-.756.557-1.67.861-.914.305-1.898.305-1.148 0-2.162-.398-1.014-.399-1.805-1.102-.79-.703-1.312-1.664t-.674-2.086h-5.8q-.411 0-.704-.293T0 16.881V6.873q0-.41.293-.703t.703-.293h8.59q-.34-.715-.34-1.5 0-.727.275-1.365.276-.639.75-1.114.475-.474 1.114-.75.638-.275 1.365-.275t1.365.275q.639.276 1.114.75.474.475.75 1.114.275.638.275 1.365t-.275 1.365q-.276.639-.75 1.113-.475.475-1.114.75-.638.276-1.365.276-.188 0-.375-.024-.188-.023-.375-.058v1.078h10.875q.469 0 .797.328.328.328.328.797zM12.75 2.373q-.41 0-.78.158-.368.158-.638.434-.27.275-.428.639-.158.363-.158.773 0 .41.158.78.159.368.428.638.27.27.639.428.369.158.779.158.41 0 .773-.158.364-.159.64-.428.274-.27.433-.639.158-.369.158-.779 0-.41-.158-.773-.159-.364-.434-.64-.275-.275-.639-.433-.363-.158-.773-.158zM6.937 9.814h2.25V7.94H2.814v1.875h2.25v6h1.875zm10.313 7.313v-6.75H12v6.504q0 .41-.293.703t-.703.293H8.309q.152.809.556 1.5.405.691.985 1.19.58.497 1.318.779.738.281 1.582.281.926 0 1.746-.352.82-.351 1.436-.966.615-.616.966-1.43.352-.815.352-1.752zm5.25-1.547v-5.203h-3.75v6.855q.305.305.691.452.387.146.809.146.469 0 .879-.176.41-.175.715-.48.304-.305.48-.715t.176-.879Z"/>
  </svg>
);

const MondayLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#FF3D57" d="M3.783 14.38c-.973 0-1.783-.81-1.783-1.783V8.62c0-.973.81-1.783 1.783-1.783.973 0 1.783.81 1.783 1.783v3.977c0 .973-.81 1.783-1.783 1.783z"/>
    <path fill="#FFCB00" d="M9.087 17.163c-.973 0-1.783-.81-1.783-1.783V8.62c0-.973.81-1.783 1.783-1.783.973 0 1.783.81 1.783 1.783v6.76c0 .973-.81 1.783-1.783 1.783z"/>
    <path fill="#00D647" d="M14.391 14.38c-.973 0-1.783-.81-1.783-1.783V5.837c0-.973.81-1.783 1.783-1.783.973 0 1.783.81 1.783 1.783v6.76c0 .973-.81 1.783-1.783 1.783z"/>
    <circle fill="#FF3D57" cx="20.217" cy="12.597" r="1.783"/>
  </svg>
);

const ZendeskLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#03363D" d="M11.08 9.79V22H1l10.08-12.21zm0-7.79c0 2.79-2.26 5.04-5.04 5.04S1 4.79 1 2h10.08zm1.84 20V9.79L23 22H12.92zm0-14.96V2H23c0 2.79-2.26 5.04-5.04 5.04-2.79 0-5.04-2.25-5.04-5.04z"/>
  </svg>
);

// Corporate logos for enterprise stack - Real SVG paths from Simple Icons
const SageLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#00D639" d="M2.702 5.316C1.167 5.316 0 6.48 0 7.972c0 1.635 1.167 2.267 2.46 2.655 1.224.387 1.804.818 1.804 1.666 0 .86-.64 1.465-1.477 1.465-.84 0-1.566-.604-1.566-1.535 0-.516.242-.647.242-.934 0-.33-.227-.574-.599-.574-.423 0-.864.647-.864 1.566 0 1.48 1.266 2.57 2.787 2.57 1.535 0 2.701-1.163 2.701-2.656 0-1.623-1.166-2.267-2.472-2.655-1.209-.372-1.792-.818-1.792-1.666 0-.845.626-1.45 1.463-1.45.867 0 1.565.617 1.577 1.465.016.388.285.617.599.617a.592.592 0 0 0 .61-.647c-.027-1.48-1.263-2.543-2.771-2.543zm6.171 9.52c.683 0 1.21-.23 1.21-.69a.57.57 0 0 0-.557-.574c-.2 0-.341.085-.668.085-.882 0-1.577-.76-1.577-1.65 0-.962.71-1.725 1.608-1.725 1.009 0 1.65.775 1.65 1.895v2.054c0 .36.284.604.625.604.327 0 .61-.244.61-.604v-2.097c0-1.72-1.178-2.984-2.858-2.984-1.566 0-2.86 1.22-2.86 2.856 0 1.58 1.282 2.83 2.817 2.83zm6.257 3.848c1.535 0 2.701-1.163 2.701-2.656 0-1.635-1.166-2.267-2.472-2.655-1.209-.387-1.792-.818-1.792-1.666s.64-1.465 1.463-1.465c.84 0 1.577.604 1.577 1.535 0 .519-.241.647-.241.934 0 .33.226.574.583.574.441 0 .882-.647.882-1.566 0-1.48-1.278-2.57-2.801-2.57-1.535 0-2.687 1.163-2.687 2.656 0 1.623 1.152 2.267 2.46 2.655 1.224.372 1.804.818 1.804 1.666 0 .86-.64 1.45-1.462 1.45-.883 0-1.566-.601-1.578-1.465-.015-.388-.3-.604-.598-.604-.327 0-.626.216-.61.631.011 1.499 1.247 2.546 2.77 2.546zm6.171-3.849c.795 0 1.424-.229 1.862-.503.426-.272.595-.504.595-.76 0-.272-.2-.516-.568-.516-.441 0-.795.66-1.877.66-.952 0-1.707-.76-1.707-1.722 0-.95.725-1.724 1.635-1.724.982 0 1.508.647 1.508 1.062 0 .116-.085.174-.2.174h-1.194c-.326 0-.568.216-.568.503 0 .314.242.546.568.546h1.636c.625 0 1.009-.33 1.009-.89 0-1.408-1.194-2.512-2.774-2.512-1.566 0-2.83 1.263-2.83 2.84s1.312 2.842 2.905 2.842z"/>
  </svg>
);

const SAPLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#0FAAFF" d="M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z"/>
  </svg>
);

const IBMLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#052FAD" d="M23.544 15.993c.038 0 .06-.017.06-.053v-.036c0-.035-.022-.052-.06-.052h-.09v.14zm-.09.262h-.121v-.498h.225c.112 0 .169.066.169.157 0 .079-.036.129-.09.15l.111.19h-.133l-.092-.17h-.07zm.434-.222v-.062c0-.2-.157-.357-.363-.357a.355.355 0 00-.363.357v.062c0 .2.156.358.363.358a.355.355 0 00.363-.358zm-.838-.03c0-.28.212-.492.475-.492.264 0 .475.213.475.491 0 .279-.211.491-.475.491a.477.477 0 01-.475-.49zM16.21 8.13l-.216-.624h-3.56v.624zm.413 1.19l-.216-.623h-3.973v.624zm2.65 7.147h3.107v-.624h-3.108zm0-1.192h3.107v-.623h-3.108zm0-1.19h1.864v-.624h-1.865zm0-1.191h1.864v-.624h-1.865zm0-1.191h1.864v-.624h-3.555l-.175.504-.175-.504h-3.555v.624h1.865v-.574l.2.574h3.33l.2-.574zm1.864-1.815h-3.142l-.217.624h3.359zm-7.46 3.006h1.865v-.624h-1.865zm0 1.19h1.865v-.623h-1.865zm-1.243 1.191h3.108v-.623h-3.108zm0 1.192h3.108v-.624h-3.108zm6.386-8.961l-.216.624h3.776v-.624zm-.629 1.815h4.19v-.624h-3.974zm-4.514 1.19h3.359l-.216-.623h-3.143zm2.482 2.383h2.496l.218-.624h-2.932zm.417 1.19h1.662l.218-.623h-2.098zm.416 1.191h.83l.218-.623h-1.266zm.414 1.192l.217-.624h-.432zm-12.433-.006l4.578.006c.622 0 1.18-.237 1.602-.624h-6.18zm4.86-3v.624h2.092c0-.216-.03-.425-.083-.624zm-3.616.624h1.865v-.624H6.217zm3.617-3.573h2.008c.053-.199.083-.408.083-.624H9.834zm-3.617 0h1.865v-.624H6.217zM9.55 7.507H4.973v.624h6.18a2.36 2.36 0 00-1.602-.624zm2.056 1.191H4.973v.624h6.884a2.382 2.382 0 00-.25-.624zm-5.39 2.382v.624h4.87c.207-.176.382-.387.519-.624zm4.87 1.191h-4.87v.624h5.389a2.39 2.39 0 00-.519-.624zm-6.114 3.006h6.634c.11-.193.196-.402.25-.624H4.973zM0 8.13h4.352v-.624H0zm0 1.191h4.352v-.624H0zm1.243 1.191h1.865v-.624H1.243zm0 1.191h1.865v-.624H1.243zm0 1.19h1.865v-.623H1.243zm0 1.192h1.865v-.624H1.243zM0 15.276h4.352v-.623H0zm0 1.192h4.352v-.624H0Z"/>
  </svg>
);

const Dynamics365Logo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#002050" d="M15.805 11.322v4.889a2.536 2.536 0 0 1-1.643 2.374l-1.732.652a.507.507 0 0 1-.686-.475v-5.956l-3.392 1.239a1.015 1.015 0 0 0-.664.953v7.986c0 .705.7 1.195 1.363.953l10.161-3.713a2.535 2.535 0 0 0 1.666-2.382V7.696a2.537 2.537 0 0 1-1.666 2.381l-3.407 1.245Zm0-.532V9.323a2.537 2.537 0 0 0-1.645-2.375l-1.728-.65a.508.508 0 0 0-.686.475v4.59c0 .701-.695 1.191-1.355.956L3.795 9.963a1.015 1.015 0 0 1-.674-.956V1.015c0-.701.695-1.191 1.356-.955l14.718 5.256A2.538 2.538 0 0 1 20.83 7.21c-.136.861-1.05 2.128-1.79 2.398l-3.235 1.182Z"/>
  </svg>
);

// Software-specific popup styles with logo components (for BloatwareHell)
type LogoComponent = React.FC<{ size?: number }>;

interface SoftwarePopup {
  id: number;
  software: string;
  Logo: LogoComponent;
  title: string;
  content: string;
  cta: string;
  headerBg: string;
  ctaBg: string;
}

const SOFTWARE_POPUPS: SoftwarePopup[] = [
  { 
    id: 1, 
    software: "Salesforce",
    Logo: SalesforceLogo,
    title: "Upgrade to Enterprise Plus", 
    content: "Unlock AI Einstein+ for only $150/user/month",
    cta: "Talk to Sales",
    headerBg: "linear-gradient(135deg, #00A1E0 0%, #1798c1 100%)",
    ctaBg: "#00A1E0",
  },
  { 
    id: 2, 
    software: "Oracle",
    Logo: OracleLogo,
    title: "License Renewal Required", 
    content: "Your database license expires in 30 days. Contact sales.",
    cta: "Renew License",
    headerBg: "linear-gradient(135deg, #F80000 0%, #c00000 100%)",
    ctaBg: "#F80000",
  },
  { 
    id: 3, 
    software: "SAP",
    Logo: SAPLogo,
    title: "Module Access Restricted", 
    content: "S/4HANA Finance module requires additional licensing.",
    cta: "Request Access",
    headerBg: "linear-gradient(135deg, #0FAAFF 0%, #0077b6 100%)",
    ctaBg: "#0FAAFF",
  },
  { 
    id: 4, 
    software: "Microsoft Teams",
    Logo: TeamsLogo,
    title: "Storage Almost Full", 
    content: "Your OneDrive is 98% full. Buy more storage.",
    cta: "Get Storage",
    headerBg: "linear-gradient(135deg, #6264A7 0%, #464775 100%)",
    ctaBg: "#6264A7",
  },
  { 
    id: 5, 
    software: "Zoom",
    Logo: ZoomLogo,
    title: "Meeting Time Limit", 
    content: "Free meetings limited to 40 minutes. Upgrade for unlimited.",
    cta: "Go Pro",
    headerBg: "linear-gradient(135deg, #2D8CFF 0%, #0b5cff 100%)",
    ctaBg: "#2D8CFF",
  },
  { 
    id: 6, 
    software: "Sage",
    Logo: SageLogo,
    title: "Payroll Processing Locked", 
    content: "Your subscription tier doesn't include multi-entity payroll.",
    cta: "Upgrade Plan",
    headerBg: "linear-gradient(135deg, #00D639 0%, #00a82d 100%)",
    ctaBg: "#00D639",
  },
  { 
    id: 7, 
    software: "IBM Cloud",
    Logo: IBMLogo,
    title: "Consulting Required", 
    content: "Watson AI integration requires enterprise consulting package.",
    cta: "Contact Sales",
    headerBg: "linear-gradient(135deg, #052FAD 0%, #001d6c 100%)",
    ctaBg: "#052FAD",
  },
  { 
    id: 8, 
    software: "Dynamics 365",
    Logo: Dynamics365Logo,
    title: "Module License Expired", 
    content: "Finance & Operations module requires license renewal.",
    cta: "Renew Now",
    headerBg: "linear-gradient(135deg, #002050 0%, #001030 100%)",
    ctaBg: "#002050",
  },
  { 
    id: 9, 
    software: "HubSpot",
    Logo: HubSpotLogo,
    title: "Contact Limit Reached", 
    content: "You've hit 1,000 contacts. Upgrade to Marketing Hub Pro.",
    cta: "See Pricing",
    headerBg: "linear-gradient(135deg, #FF7A59 0%, #ff5c35 100%)",
    ctaBg: "#FF7A59",
  },
  { 
    id: 10, 
    software: "Zendesk",
    Logo: ZendeskLogo,
    title: "Ticket Routing Alert", 
    content: "847 tickets unassigned. Configure automation rules.",
    cta: "Configure",
    headerBg: "linear-gradient(135deg, #03363D 0%, #17494D 100%)",
    ctaBg: "#03363D",
  },
];

// Company logos configuration with snarky messages - Corporate stack
const COMPANY_LOGOS = [
  { name: "Microsoft", Logo: MicrosoftLogo, roast: "365 days of confusion." },
  { name: "Oracle", Logo: OracleLogo, roast: "Legacy since 1977." },
  { name: "Salesforce", Logo: SalesforceLogo, roast: "$300/user. 47 unused tabs." },
  { name: "SAP", Logo: SAPLogo, roast: "Implementation: 18 months." },
  { name: "Teams", Logo: TeamsLogo, roast: "Meetings about meetings." },
  { name: "Sage", Logo: SageLogo, roast: "Payroll still pending." },
  { name: "IBM", Logo: IBMLogo, roast: "Consulting fees: unlimited." },
  { name: "Dynamics 365", Logo: Dynamics365Logo, roast: "ERP complexity unlocked." },
  { name: "Zoom", Logo: ZoomLogo, roast: "\"Can you see my screen?\"" },
  { name: "Zendesk", Logo: ZendeskLogo, roast: "847 tickets unassigned." },
];

// Only show first 4 logos inline
const INLINE_LOGOS = COMPANY_LOGOS.slice(0, 4);

// Wabi-style random rotations - organic, not rigid
const WABI_ROTATIONS = [-8, 5, -6, 7, -4, 6, -7, 4, -5, 8];

// Wabi-style parallax speeds - different for each logo (depth effect)
// Higher = moves more = feels "closer"
const WABI_PARALLAX_SPEEDS = [120, 280, 180, 350, 220, 150, 300, 200, 250, 170];

// Wabi-style logo component
// Key visual features:
// - Random rotation (organic feel)
// - iOS-style app container (white bg, rounded, deep shadow)
// - Differentiated parallax speeds (depth)
// - Hover animation with movement
// - X button to dismiss
function ParallaxLogo({ 
  logo, 
  index, 
  position,
  scrollProgress,
  onDismiss,
}: { 
  logo: { name: string; Logo: React.FC<{ size?: number }>; roast: string }; 
  index: number; 
  position: { x: string; y: string };
  scrollProgress: MotionValue<number>;
  onDismiss?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Irregular stagger for scroll thresholds
  const staggerOffsets = [0, 0.006, 0.014, 0.022, 0.032, 0.004, 0.010, 0.018, 0.026, 0.036];
  const stagger = staggerOffsets[index] || 0;
  
  // Scroll-based visibility - appear LATER, disappear SOONER
  const scrollStart = 0.06 + stagger;
  const scrollPeak = 0.10 + stagger;
  const scrollFadeStart = 0.18 + stagger;
  const scrollEnd = 0.22 + stagger;
  
  // Opacity controlled by scroll
  const opacity = useTransform(
    scrollProgress,
    [scrollStart, scrollPeak, scrollFadeStart, scrollEnd],
    [0, 1, 1, 0]
  );
  
  // DIFFERENTIATED parallax
  const parallaxSpeed = WABI_PARALLAX_SPEEDS[index] || 200;
  const yParallax = useTransform(
    scrollProgress,
    [0, 1],
    [0, -parallaxSpeed]
  );
  
  // Random rotation for organic feel
  const baseRotation = WABI_ROTATIONS[index] || 0;
  // Hover adds extra rotation movement
  const hoverRotation = isHovered ? baseRotation + (index % 2 === 0 ? 4 : -4) : baseRotation;

  // Tooltip orientation
  const isLeftSide = parseFloat(position.x) < 50;
  
  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer group"
      style={{
        left: position.x,
        top: position.y,
        y: yParallax,
        opacity,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isHovered ? {
        scale: 1,
        rotate: [baseRotation - 1.5, baseRotation + 1.5, baseRotation - 1, baseRotation + 1, baseRotation],
        x: [-1, 1, -0.5, 0.5, 0],
        transition: {
          rotate: {
            repeat: Infinity,
            duration: 0.3,
            ease: "easeInOut",
          },
          x: {
            repeat: Infinity,
            duration: 0.3,
            ease: "easeInOut",
          },
          scale: { type: "spring", stiffness: 300, damping: 20 },
        }
      } : {
        scale: 1,
        rotate: baseRotation,
        x: 0,
      }}
      exit={{ 
        scale: 0, 
        opacity: 0,
        rotate: baseRotation + 20,
        transition: { duration: 0.3, ease: "easeIn" }
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* iOS-style app container - DEEPER shadow for 3D effect */}
      <div 
        className="relative flex items-center justify-center bg-white"
        style={{
          width: 72,
          height: 72,
          marginLeft: -36,
          marginTop: -36,
          borderRadius: '22%',
          // DEEPER shadow for more 3D effect
          boxShadow: isHovered 
            ? '0 32px 64px rgba(0,0,0,0.25), 0 16px 32px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)'
            : '0 24px 48px rgba(0,0,0,0.18), 0 12px 24px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
        }}
      >
        <logo.Logo size={48} />
        
        {/* X button to dismiss - appears on hover */}
        {isHovered && onDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-200"
            style={{ 
              zIndex: 100,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <span className="text-gray-800 text-sm font-bold leading-none">×</span>
          </button>
        )}
      </div>
        
      {/* Tooltip with name */}
      {isHovered && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            top: -12,
            ...(isLeftSide ? { left: 72 } : { right: 72 }),
          }}
        >
          <div className="bg-white rounded-lg px-3 py-2 shadow-xl border border-gray-100 whitespace-nowrap">
            <span className="text-xs font-medium text-gray-800">{logo.name}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Fixed positions for parallax logos - Wabi-style distribution
// CLOSER TO TEXT - grouped near the content
const LOGO_POSITIONS: Array<{ x: string; y: string }> = [
  // Left side (5 logos) - closer to center
  { x: '15%', y: '24%' },
  { x: '18%', y: '40%' },
  { x: '14%', y: '54%' },
  { x: '20%', y: '68%' },
  { x: '16%', y: '80%' },
  // Right side (5 logos) - closer to center
  { x: '85%', y: '28%' },
  { x: '82%', y: '44%' },
  { x: '86%', y: '58%' },
  { x: '80%', y: '72%' },
  { x: '84%', y: '84%' },
];

// Parallax logos container - rendered outside paragraph context
function ParallaxLogosContainer({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const [dismissedLogos, setDismissedLogos] = useState<Set<string>>(new Set());
  
  const handleDismiss = (logoName: string) => {
    setDismissedLogos(prev => new Set([...prev, logoName]));
  };
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {COMPANY_LOGOS.map((logo, i) => (
          !dismissedLogos.has(logo.name) && (
            <ParallaxLogo
              key={`parallax-${logo.name}`}
              logo={logo}
              index={i}
              position={LOGO_POSITIONS[i]}
              scrollProgress={scrollProgress}
              onDismiss={() => handleDismiss(logo.name)}
            />
          )
        ))}
      </AnimatePresence>
    </div>
  );
}

// Tech company logos inline - just the small icons in text with hover tooltips
function InlineTechLogos() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <span className="relative inline-flex items-center gap-2 mx-2">
      {/* Inline logos - always visible as contextual decoration */}
      {INLINE_LOGOS.map((logo, i) => (
        <span
          key={logo.name}
          className="relative inline-flex items-center justify-center w-6 h-6 rounded bg-gray-200/50 cursor-pointer transition-transform hover:scale-110"
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <logo.Logo size={16} />
          
          {/* Mini tooltip */}
          {hoveredIndex === i && (
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap z-50"
              style={{
                background: 'rgba(24,24,27,0.95)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {logo.roast}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
