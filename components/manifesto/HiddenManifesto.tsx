"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// THE HIDDEN MANIFESTO
// Secret words subtly different in color.
// Find them all to reveal the founder's secret message.
// ============================================

// The hidden words that form the secret message
// Order matters - they spell out "VISION BECOMES REALITY WHEN YOU DARE TO BUILD"
const HIDDEN_WORDS_CONFIG = [
  { id: "vision", word: "vision", messageWord: "VISION" },
  { id: "becomes", word: "becomes", messageWord: "BECOMES" },
  { id: "reality", word: "reality", messageWord: "REALITY" },
  { id: "when", word: "when", messageWord: "WHEN" },
  { id: "you", word: "you", messageWord: "YOU" },
  { id: "dare", word: "dare", messageWord: "DARE" },
  { id: "to", word: "to", messageWord: "TO" },
  { id: "build", word: "build", messageWord: "BUILD" },
];

// Context for managing hidden words state
interface HiddenManifestoContextType {
  discoveredWords: Set<string>;
  discoverWord: (id: string) => void;
  totalWords: number;
  allDiscovered: boolean;
  showReveal: boolean;
  setShowReveal: (show: boolean) => void;
}

const HiddenManifestoContext = createContext<HiddenManifestoContextType | null>(null);

export function HiddenManifestoProvider({ children }: { children: React.ReactNode }) {
  const [discoveredWords, setDiscoveredWords] = useState<Set<string>>(new Set());
  const [showReveal, setShowReveal] = useState(false);
  const [hasTriggeredReveal, setHasTriggeredReveal] = useState(false);

  const allDiscovered = discoveredWords.size === HIDDEN_WORDS_CONFIG.length;

  // Trigger reveal when all words are discovered
  useEffect(() => {
    if (allDiscovered && !hasTriggeredReveal) {
      setHasTriggeredReveal(true);
      // Small delay for dramatic effect
      setTimeout(() => {
        setShowReveal(true);
      }, 800);
    }
  }, [allDiscovered, hasTriggeredReveal]);

  // Debug/Testing: Type "hidden" to toggle hidden manifesto reveal
  useEffect(() => {
    let buffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add letter to buffer
      buffer += e.key.toLowerCase();
      // Keep only last 6 characters
      if (buffer.length > 6) buffer = buffer.slice(-6);
      // Check if buffer spells "hidden"
      if (buffer === 'hidden') {
        e.preventDefault();
        buffer = '';
        // Discover all words and show reveal
        setDiscoveredWords(new Set(HIDDEN_WORDS_CONFIG.map(w => w.id)));
        setShowReveal(true);
        console.log('%c🔮 Hidden Manifesto revealed!', 'font-size: 14px; color: gold;');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const discoverWord = useCallback((id: string) => {
    setDiscoveredWords(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  return (
    <HiddenManifestoContext.Provider
      value={{
        discoveredWords,
        discoverWord,
        totalWords: HIDDEN_WORDS_CONFIG.length,
        allDiscovered,
        showReveal,
        setShowReveal,
      }}
    >
      {children}
    </HiddenManifestoContext.Provider>
  );
}

export function useHiddenManifesto() {
  const context = useContext(HiddenManifestoContext);
  if (!context) {
    throw new Error("useHiddenManifesto must be used within HiddenManifestoProvider");
  }
  return context;
}

// ============================================
// HIDDEN WORD COMPONENT
// A word that's subtly different in color
// ============================================

interface HiddenWordProps {
  id: string;
  children: React.ReactNode;
  konamiMode?: boolean;
}

export function HiddenWord({ id, children, konamiMode = false }: HiddenWordProps) {
  const { discoveredWords, discoverWord } = useHiddenManifesto();
  const isDiscovered = discoveredWords.has(id);
  const [isHovered, setIsHovered] = useState(false);
  const [justDiscovered, setJustDiscovered] = useState(false);

  const handleClick = () => {
    if (!isDiscovered) {
      discoverWord(id);
      setJustDiscovered(true);
      
      // Play a subtle sound
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19telecom...'); // Short click sound
        audio.volume = 0.1;
        audio.play().catch(() => {});
      } catch {
        // Silently fail if audio doesn't work
      }
      
      setTimeout(() => setJustDiscovered(false), 600);
    }
  };

  // Subtle color difference - barely noticeable gray shift
  // In light mode: #555 vs #1a1a1a (normal text)
  // In konami mode: #888 vs #e5e5e5 (normal text)
  const hiddenColor = konamiMode ? "#a0a0a0" : "#555555";
  const normalColor = konamiMode ? "#e5e5e5" : "#1a1a1a";
  const discoveredColor = konamiMode ? "#fbbf24" : "#d4a012"; // Golden when discovered

  return (
    <motion.span
      className="relative inline cursor-pointer select-none"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: isDiscovered ? discoveredColor : hiddenColor,
        transition: "color 0.3s ease",
      }}
      animate={{
        scale: justDiscovered ? [1, 1.15, 1] : 1,
        textShadow: isDiscovered 
          ? `0 0 12px ${discoveredColor}40` 
          : isHovered 
            ? `0 0 8px ${hiddenColor}30`
            : "none",
      }}
      transition={{ duration: 0.3 }}
      title={isDiscovered ? "✓ Discovered!" : "Something feels different..."}
    >
      {children}
      
      {/* Subtle underline hint on hover (only if not discovered) */}
      {!isDiscovered && isHovered && (
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: `${hiddenColor}40` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Sparkle effect when just discovered */}
      <AnimatePresence>
        {justDiscovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute pointer-events-none"
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: discoveredColor,
                  left: "50%",
                  top: "50%",
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0
                }}
                animate={{ 
                  x: Math.cos(i * Math.PI / 3) * 25,
                  y: Math.sin(i * Math.PI / 3) * 25,
                  opacity: 0,
                  scale: 1.5
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

// ============================================
// DISCOVERY PROGRESS INDICATOR
// Compact Liquid Glass style - Expands on hover to show words
// ============================================

export function DiscoveryProgress({ konamiMode = false }: { konamiMode?: boolean }) {
  const { discoveredWords, totalWords, allDiscovered, setShowReveal } = useHiddenManifesto();
  const [isHovered, setIsHovered] = useState(false);
  
  // Only show after at least one word is discovered
  if (discoveredWords.size === 0) return null;

  return (
    <motion.div
      className="fixed top-4 right-4 z-[100]"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Liquid Glass Container */}
      <div className="liquid-glass-wrap" style={{ fontSize: '0.75rem' }}>
        <motion.div 
          className="liquid-glass-button"
          style={{ 
            cursor: allDiscovered ? 'pointer' : 'default',
            padding: 0,
          }}
          onClick={() => allDiscovered && setShowReveal(true)}
          whileTap={allDiscovered ? { scale: 0.98 } : {}}
        >
          <motion.div 
            className="relative"
            style={{ 
              padding: '10px 14px',
            }}
            layout
          >
            {/* Header row - always visible */}
            <div className="flex items-center justify-between gap-4">
              {/* Progress indicator dots */}
              <div className="flex items-center gap-[4px]">
                {HIDDEN_WORDS_CONFIG.map((config) => {
                  const isFound = discoveredWords.has(config.id);
                  return (
                    <motion.span
                      key={config.id}
                      className="rounded-full"
                      style={{
                        width: 5,
                        height: 5,
                        background: isFound 
                          ? '#a38b1a'
                          : konamiMode 
                            ? 'rgba(255,255,255,0.15)' 
                            : 'rgba(0,0,0,0.1)',
                      }}
                      initial={false}
                      animate={{
                        scale: isFound ? [1, 1.4, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  );
                })}
              </div>
              
              {/* Counter */}
              <span 
                className="text-[10px] font-medium tabular-nums"
                style={{ 
                  color: allDiscovered 
                    ? '#a38b1a' 
                    : konamiMode 
                      ? 'rgba(255,255,255,0.5)' 
                      : 'rgba(50, 50, 50, 0.5)',
                }}
              >
                {discoveredWords.size}/{totalWords}
              </span>
            </div>
            
            {/* Expanded content - words list */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div 
                    className="pt-3 mt-3 flex flex-wrap gap-[6px]"
                    style={{ 
                      borderTop: konamiMode 
                        ? '1px solid rgba(255,255,255,0.08)' 
                        : '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    {HIDDEN_WORDS_CONFIG.map((config) => {
                      const isFound = discoveredWords.has(config.id);
                      return (
                        <span
                          key={config.id}
                          className="text-[9px] px-2 py-0.5 rounded-full"
                          style={{
                            background: isFound 
                              ? 'rgba(163, 139, 26, 0.15)' 
                              : konamiMode 
                                ? 'rgba(255,255,255,0.05)' 
                                : 'rgba(0,0,0,0.03)',
                            color: isFound 
                              ? '#a38b1a' 
                              : konamiMode 
                                ? 'rgba(255,255,255,0.2)' 
                                : 'rgba(0,0,0,0.2)',
                            letterSpacing: '0.03em',
                          }}
                        >
                          {isFound ? config.messageWord.toLowerCase() : '···'}
                        </span>
                      );
                    })}
                  </div>
                  
                  {/* Completion hint */}
                  {allDiscovered && (
                    <p 
                      className="text-[9px] mt-3 text-center"
                      style={{ 
                        color: '#a38b1a',
                        opacity: 0.7,
                      }}
                    >
                      click to reveal
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
        <div className="liquid-glass-shadow"></div>
      </div>
    </motion.div>
  );
}

// ============================================
// SECRET MANIFESTO REVEAL MODAL
// Liquid Glass style - Pure typography, no icons
// ============================================

export function SecretManifestoReveal({ konamiMode = false }: { konamiMode?: boolean }) {
  const { showReveal, setShowReveal, allDiscovered } = useHiddenManifesto();

  const handleClose = useCallback(() => {
    setShowReveal(false);
  }, [setShowReveal]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showReveal) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showReveal, handleClose]);

  if (!showReveal || !allDiscovered) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] flex items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop - more transparency to show content behind */}
        <motion.div 
          className="absolute inset-0 cursor-pointer"
          style={{
            background: konamiMode 
              ? 'rgba(0, 0, 0, 0.5)' 
              : 'rgba(200, 200, 195, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
        />
        
        {/* Content Card - Enhanced Liquid Glass Effect */}
        <motion.div
          className="relative max-w-xl w-full"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
        >
          {/* Outer glow effect */}
          <div 
            className="absolute -inset-1 rounded-[36px] pointer-events-none"
            style={{
              background: konamiMode
                ? 'linear-gradient(145deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(139,92,246,0.08) 100%)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 50%, rgba(240,240,240,0.4) 100%)',
              filter: 'blur(8px)',
            }}
          />
          
          {/* Liquid Glass Card - with prominent glass effects */}
          <div 
            className="relative rounded-[32px] overflow-hidden"
            style={{
              background: konamiMode
                ? 'linear-gradient(-75deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.03) 100%)'
                : 'linear-gradient(-75deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.65) 100%)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
              boxShadow: konamiMode
                ? `
                  inset 0 2px 4px rgba(255,255,255,0.08),
                  inset 0 -1px 2px rgba(0,0,0,0.3),
                  inset 0 0 0 1px rgba(255,255,255,0.1),
                  0 32px 64px -16px rgba(0,0,0,0.5),
                  0 16px 32px -8px rgba(0,0,0,0.3),
                  0 0 0 1px rgba(255,255,255,0.05)
                `
                : `
                  inset 0 2px 8px rgba(255,255,255,1),
                  inset 0 -2px 6px rgba(0,0,0,0.03),
                  inset 0 0 0 1.5px rgba(255,255,255,0.9),
                  0 40px 80px -20px rgba(0,0,0,0.18),
                  0 20px 40px -10px rgba(0,0,0,0.1),
                  0 0 0 1px rgba(180,180,175,0.2)
                `,
            }}
          >
            {/* Top shine gradient - prominent */}
            <div 
              className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
              style={{
                background: konamiMode
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)',
                borderRadius: '32px 32px 0 0',
              }}
            />
            
            {/* Diagonal shine sweep */}
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: konamiMode
                  ? 'linear-gradient(105deg, transparent 0%, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%, transparent 100%)'
                  : 'linear-gradient(105deg, transparent 0%, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 55%, transparent 60%, transparent 100%)',
                borderRadius: '32px',
              }}
              animate={{
                backgroundPosition: ['200% 0%', '-100% 0%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
            />
            
            {/* Inner border highlight */}
            <div 
              className="absolute inset-[1px] rounded-[31px] pointer-events-none"
              style={{
                border: konamiMode
                  ? '1px solid rgba(255,255,255,0.08)'
                  : '1px solid rgba(255,255,255,0.6)',
              }}
            />
            
            {/* Close X button - top right corner */}
            <motion.button
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300"
              style={{ 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              whileHover={{ 
                background: konamiMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                scale: 1.1,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 14 14" 
                fill="none"
                style={{ color: konamiMode ? 'rgba(255,255,255,0.5)' : 'rgba(80,80,80,0.5)' }}
              >
                <path 
                  d="M1 1L13 13M1 13L13 1" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
              </svg>
            </motion.button>
            
            {/* Content */}
            <div 
              className="relative text-center"
              style={{ padding: '48px 48px 40px' }}
            >
              {/* Label */}
              <motion.p 
                className="uppercase mb-6"
                style={{ 
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  color: konamiMode ? 'rgba(167, 139, 250, 0.6)' : 'rgba(100, 100, 100, 0.5)',
                  fontWeight: 500,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                The Hidden Manifesto
              </motion.p>
              
              {/* The Secret Message - Main quote */}
              <motion.blockquote
                className="mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <p 
                  style={{ 
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: konamiMode ? 'rgba(255,255,255,0.95)' : '#1a1a1a',
                    lineHeight: 1.5,
                  }}
                >
                  "Vision becomes reality
                  <br />
                  when you dare to build."
                </p>
              </motion.blockquote>
              
              {/* Divider */}
              <motion.div 
                className="flex justify-center mb-10"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.35 }}
              >
                <div 
                  className="w-16" 
                  style={{ 
                    height: '1px',
                    background: konamiMode 
                      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' 
                      : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.12), transparent)',
                  }} 
                />
              </motion.div>
              
              {/* Founder's Note */}
              <motion.div 
                className="text-left space-y-5 max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <p 
                  style={{ 
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: '14px',
                    lineHeight: 1.7,
                    color: konamiMode ? 'rgba(255,255,255,0.75)' : 'rgba(40, 40, 40, 0.8)',
                    fontWeight: 400,
                  }}
                >
                  You noticed the subtle differences. The words that felt just 
                  slightly off. That's exactly the kind of attention to detail 
                  we value.
                </p>
                <p 
                  style={{ 
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: '14px',
                    lineHeight: 1.7,
                    color: konamiMode ? 'rgba(255,255,255,0.75)' : 'rgba(40, 40, 40, 0.8)',
                    fontWeight: 400,
                  }}
                >
                  The best software doesn't come from following templates. 
                  It comes from those who look closer, question the default, 
                  and dare to build something truly their own.
                </p>
              </motion.div>
              
              {/* Divider before signatories */}
              <motion.div 
                className="flex justify-center my-8"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div 
                  className="w-12" 
                  style={{ 
                    height: '1px',
                    background: konamiMode 
                      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' 
                      : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)',
                  }} 
                />
              </motion.div>
              
              {/* Signatories Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <p 
                  className="uppercase mb-4"
                  style={{ 
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    color: konamiMode ? 'rgba(255,255,255,0.35)' : 'rgba(100, 100, 100, 0.4)',
                    fontWeight: 500,
                  }}
                >
                  Signatories
                </p>
                
                {/* Signatory names in a elegant grid */}
                <div 
                  className="flex flex-wrap justify-center gap-x-6 gap-y-2"
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: '12px',
                    color: konamiMode ? 'rgba(255,255,255,0.5)' : 'rgba(60, 60, 60, 0.6)',
                    fontWeight: 400,
                  }}
                >
                  {[
                    'Pablo S.',
                    'María L.',
                    'Carlos R.',
                    'Ana G.',
                    'Diego M.',
                    'Laura P.',
                    'Javier T.',
                    'Elena V.',
                  ].map((name, i) => (
                    <motion.span
                      key={name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      style={{ fontStyle: 'italic' }}
                    >
                      {name}
                    </motion.span>
                  ))}
                </div>
                
                {/* Counter */}
                <motion.p
                  className="mt-4"
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: '10px',
                    color: konamiMode ? 'rgba(255,255,255,0.25)' : 'rgba(100, 100, 100, 0.35)',
                    fontWeight: 400,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  and 47 others who noticed
                </motion.p>
              </motion.div>
            </div>
          </div>
          
          {/* Enhanced shadow beneath the card */}
          <div 
            className="absolute -inset-4 -z-10 rounded-[40px] pointer-events-none"
            style={{
              background: konamiMode
                ? 'radial-gradient(ellipse at center, rgba(100,80,200,0.15) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Export config for use in ManifestoSection
export { HIDDEN_WORDS_CONFIG };

