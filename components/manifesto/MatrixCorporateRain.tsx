"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MatrixCorporateRainProps {
  isActive: boolean;
  onComplete: () => void;
}

// Katakana + Latin characters for authentic Matrix look
const MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

export default function MatrixCorporateRain({ isActive, onComplete }: MatrixCorporateRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const dropsRef = useRef<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'hidden' | 'entering' | 'matrix' | 'message' | 'wakeup' | 'sapira' | 'complete'>('hidden');
  const [messageText, setMessageText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const WAKE_UP_MESSAGE = "Wake up...";
  const SIMULATION_MESSAGE = "You've been living in a corporate simulation.";

  // Scroll into view and start animation when activated
  useEffect(() => {
    if (isActive && phase === 'hidden') {
      setPhase('entering');
      // Scroll the TV into view
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      // Start matrix rain after entering
      setTimeout(() => setPhase('matrix'), 1000);
    }
  }, [isActive, phase]);

  // Initialize and run the Matrix rain
  useEffect(() => {
    if (phase !== 'matrix' && phase !== 'message' && phase !== 'wakeup') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 14;
    
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      const columns = Math.floor(rect.width / fontSize);
      dropsRef.current = Array(columns).fill(0).map(() => Math.random() * -100);
    };

    resize();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.font = `bold ${fontSize}px "Courier New", monospace`;

      dropsRef.current.forEach((y, i) => {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;

        if (Math.random() > 0.98) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 20;
        } else {
          const brightness = Math.random() * 155 + 100;
          ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 2;
        }

        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        dropsRef.current[i] = y > rect.height && Math.random() > 0.975 
          ? 0 
          : y + fontSize;
      });

      if (phase === 'matrix' || phase === 'message' || phase === 'wakeup') {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase]);

  // Phase: matrix -> message
  useEffect(() => {
    if (phase !== 'matrix') return;
    const timer = setTimeout(() => setPhase('message'), 3500);
    return () => clearTimeout(timer);
  }, [phase]);

  // Typewriter: "Wake up..."
  useEffect(() => {
    if (phase !== 'message') return;

    let charIndex = 0;
    setMessageText('');

    const typeInterval = setInterval(() => {
      if (charIndex <= WAKE_UP_MESSAGE.length) {
        setMessageText(WAKE_UP_MESSAGE.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPhase('wakeup'), 1500);
      }
    }, 150);

    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 530);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, [phase]);

  // Typewriter: simulation message
  useEffect(() => {
    if (phase !== 'wakeup') return;

    let charIndex = 0;
    setMessageText('');

    const typeInterval = setInterval(() => {
      if (charIndex <= SIMULATION_MESSAGE.length) {
        setMessageText(SIMULATION_MESSAGE.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPhase('sapira'), 2500);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [phase]);

  // Sapira phase -> complete
  useEffect(() => {
    if (phase !== 'sapira') return;
    const timer = setTimeout(() => {
      setPhase('complete');
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  // Don't render anything if never activated
  if (!isActive && phase === 'hidden') return null;

  return (
    <motion.section
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center py-24 md:py-32"
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: 1, 
        height: 'auto',
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* The CRT Monitor - Inline in the manifesto */}
      <motion.div
        className="relative z-10"
        initial={{ 
          scale: 0.5, 
          opacity: 0,
          rotateX: 15,
          y: 50 
        }}
        animate={{ 
          scale: phase === 'complete' ? 0.9 : 1, 
          opacity: 1,
          rotateX: 0,
          y: 0 
        }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.8
        }}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Monitor outer frame */}
        <div
          className="relative"
          style={{
            background: 'linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            borderRadius: '20px',
            padding: '30px 30px 45px 30px',
            boxShadow: `
              0 40px 80px rgba(0,0,0,0.4),
              0 20px 40px rgba(0,0,0,0.3),
              inset 0 2px 0 rgba(255,255,255,0.1),
              inset 0 -2px 0 rgba(0,0,0,0.5)
            `,
          }}
        >
          {/* Monitor brand label */}
          <div 
            className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 text-xs font-mono tracking-widest"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            SAPIRA™
          </div>

          {/* Power LED */}
          <motion.div
            className="absolute bottom-3.5 right-7 w-2 h-2 rounded-full"
            style={{ backgroundColor: phase === 'complete' ? '#666' : '#00ff00' }}
            animate={phase !== 'complete' ? { 
              opacity: [1, 0.5, 1],
              boxShadow: ['0 0 5px #00ff00', '0 0 10px #00ff00', '0 0 5px #00ff00']
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Monitor bezel */}
          <div
            style={{
              background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
              borderRadius: '12px',
              padding: '6px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {/* Screen container */}
            <div
              className="relative overflow-hidden"
              style={{
                width: 'min(75vw, 800px)',
                height: 'min(45vh, 450px)',
                minHeight: '350px',
                borderRadius: '8px',
                background: '#000',
                boxShadow: phase !== 'complete' 
                  ? 'inset 0 0 80px rgba(0,255,0,0.1), inset 0 0 40px rgba(0,0,0,0.8)'
                  : 'inset 0 0 40px rgba(0,0,0,0.5)',
              }}
            >
              {/* Matrix Canvas - hidden when complete */}
              <AnimatePresence>
                {phase !== 'complete' && phase !== 'sapira' && (
                  <motion.canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                  />
                )}
              </AnimatePresence>

              {/* Fading canvas for sapira phase */}
              {phase === 'sapira' && (
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full opacity-15"
                />
              )}

              {/* Screen curvature */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.4) 100%)',
                  borderRadius: '8px',
                }}
              />

              {/* Scanlines - hidden when complete */}
              {phase !== 'complete' && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 3px)',
                    opacity: 0.6,
                  }}
                />
              )}

              {/* Screen reflection */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
                }}
              />

              {/* Messages */}
              <AnimatePresence>
                {(phase === 'message' || phase === 'wakeup') && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)',
                      }}
                    />
                    
                    <div className="relative z-10 text-center px-8 w-full max-w-[90%]">
                      <motion.p
                        className="font-mono text-base md:text-xl lg:text-2xl leading-relaxed text-center"
                        style={{
                          color: '#00ff00',
                          textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00',
                          letterSpacing: '0.02em',
                          wordBreak: 'break-word',
                        }}
                      >
                        {messageText}
                        <motion.span
                          animate={{ opacity: showCursor ? 1 : 0 }}
                          className="inline-block ml-1"
                          style={{
                            width: '0.5em',
                            height: '1.1em',
                            backgroundColor: '#00ff00',
                            verticalAlign: 'middle',
                            boxShadow: '0 0 15px #00ff00',
                          }}
                        />
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sapira Reveal - stays visible when complete */}
              <AnimatePresence>
                {(phase === 'sapira' || phase === 'complete') && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Background */}
                    <motion.div
                      className="absolute inset-0"
                      style={{ 
                        backgroundColor: phase === 'complete' ? '#fafafa' : '#000000',
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: phase === 'complete' ? 1 : 0.92 }}
                      transition={{ duration: 1.5 }}
                    />

                    <motion.div
                      className="relative z-10 text-center"
                      initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
                      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                      transition={{ 
                        delay: phase === 'complete' ? 0 : 0.5,
                        duration: 1.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {/* Glitch layers - only during sapira phase */}
                      <div className="relative">
                        {phase === 'sapira' && (
                          <>
                            <motion.h1
                              className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-light tracking-tight"
                              style={{
                                fontFamily: "'Times New Roman', Georgia, serif",
                                color: 'rgba(255,0,0,0.8)',
                                left: '2px',
                              }}
                              animate={{
                                x: [0, -3, 3, -2, 0],
                                opacity: [0, 0.5, 0, 0.3, 0],
                              }}
                              transition={{
                                duration: 0.15,
                                repeat: 3,
                                repeatDelay: 0.5,
                              }}
                            >
                              Sapira
                            </motion.h1>

                            <motion.h1
                              className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-light tracking-tight"
                              style={{
                                fontFamily: "'Times New Roman', Georgia, serif",
                                color: 'rgba(0,255,255,0.8)',
                                right: '2px',
                              }}
                              animate={{
                                x: [0, 3, -3, 2, 0],
                                opacity: [0, 0.5, 0, 0.3, 0],
                              }}
                              transition={{
                                duration: 0.15,
                                repeat: 3,
                                repeatDelay: 0.5,
                              }}
                            >
                              Sapira
                            </motion.h1>
                          </>
                        )}

                        {/* Main text */}
                        <motion.h1
                          className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight relative"
                          style={{
                            fontFamily: "'Times New Roman', Georgia, serif",
                            color: phase === 'complete' ? '#1a1a1a' : '#ffffff',
                            textShadow: phase === 'complete' 
                              ? 'none' 
                              : '0 0 60px rgba(255,255,255,0.5), 0 0 120px rgba(255,255,255,0.3)',
                          }}
                        >
                          Sapira
                        </motion.h1>
                      </div>

                      {/* Underline */}
                      <motion.div
                        className="h-[1px] mx-auto mt-3"
                        style={{
                          backgroundColor: phase === 'complete' ? '#1a1a1a' : '#ffffff',
                          boxShadow: phase === 'complete' ? 'none' : '0 0 20px rgba(255,255,255,0.8)',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ delay: phase === 'complete' ? 0.3 : 1.5, duration: 1, ease: 'easeOut' }}
                        style-={{ maxWidth: 180 }}
                      />

                      {/* Tagline */}
                      <motion.p
                        className="text-sm md:text-base lg:text-lg mt-5 font-light tracking-wide"
                        style={{
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          color: phase === 'complete' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
                          letterSpacing: '0.1em',
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: phase === 'complete' ? 0.5 : 2, duration: 1 }}
                      >
                        The first <em>AI-native</em> software factory.
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Flicker effect */}
              {phase !== 'complete' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none bg-white"
                  animate={{
                    opacity: [0, 0, 0.015, 0, 0, 0, 0.01, 0, 0, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    times: [0, 0.1, 0.11, 0.12, 0.4, 0.5, 0.51, 0.52, 0.7, 1],
                  }}
                />
              )}
            </div>
          </div>

          {/* Monitor stand neck */}
          <div 
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2"
            style={{
              width: '50px',
              height: '40px',
              background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
              borderRadius: '0 0 8px 8px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
            }}
          />

          {/* Monitor stand base */}
          <div 
            className="absolute -bottom-14 left-1/2 transform -translate-x-1/2"
            style={{
              width: '120px',
              height: '10px',
              background: 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%)',
              borderRadius: '4px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            }}
          />
        </div>
      </motion.div>

      {/* Extra spacing for the stand */}
      <div className="h-20" />
    </motion.section>
  );
}
