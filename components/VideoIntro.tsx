"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoIntroProps {
  onComplete: () => void;
}

export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [portalPhase, setPortalPhase] = useState<"idle" | "opening" | "pulling" | "through" | "done">("idle");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle video load success
  const handleVideoCanPlay = useCallback(() => {
    setVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log("Autoplay blocked - user interaction required");
      });
    }
  }, []);

  // Handle video errors - show fallback
  const handleVideoError = useCallback(() => {
    console.log("Video failed to load - showing fallback");
    setVideoError(true);
    setVideoLoaded(true); // Still show content
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const showTimer = setTimeout(() => {
      setShowLogo(true);
    }, 500);

    // Fallback timeout - if video doesn't load in 5s, show content anyway
    const fallbackTimer = setTimeout(() => {
      if (!videoLoaded) {
        console.log("Video load timeout - showing fallback");
        setVideoLoaded(true);
      }
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fallbackTimer);
    };
  }, [mounted, videoLoaded]);

  const handleExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    setShowLogo(false);
    
    if (videoRef.current) {
      videoRef.current.pause();
    }

    // Portal opening sequence
    setPortalPhase("opening");
    
    setTimeout(() => {
      setPortalPhase("pulling");
    }, 300);
    
    setTimeout(() => {
      setPortalPhase("through");
    }, 800);
    
    setTimeout(() => {
      setPortalPhase("done");
      setIsVisible(false);
      onComplete();
    }, 1400);
  };

  if (!mounted) return null;
  if (!isVisible && portalPhase === "done") return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <>
          {/* Main Video Container */}
          <motion.div
            className="fixed inset-0 z-[100] overflow-hidden bg-black"
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: portalPhase === "through" || portalPhase === "done" ? 0 : 1,
            }}
            transition={{ 
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {/* Video with portal effect */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: portalPhase === "pulling" ? 1.5 : portalPhase === "through" ? 3 : 1,
                filter: portalPhase === "pulling" ? "blur(8px)" : portalPhase === "through" ? "blur(20px)" : "blur(0px)",
              }}
              transition={{
                duration: portalPhase === "through" ? 0.6 : 0.5,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {/* Video with cross-browser compatibility */}
              {!videoError ? (
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                  preload="auto"
                  loop={false}
                  onCanPlay={handleVideoCanPlay}
                  onError={handleVideoError}
                  onEnded={handleExit}
                >
                  {/* MP4 with H.264 - best browser support */}
                  <source src="/videos/intro.mp4" type="video/mp4" />
                  {/* Fallback message */}
                  Your browser does not support the video tag.
                </video>
              ) : (
                /* Animated gradient fallback when video fails */
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #0a0a0a 100%)",
                    backgroundSize: "400% 400%",
                    animation: "gradientShift 8s ease infinite"
                  }}
                />
              )}
            </motion.div>

            {/* Dark vignette overlay */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.8) 100%)"
              }}
            />

            {/* Portal ring effect */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: portalPhase === "opening" || portalPhase === "pulling" ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute rounded-full border border-white/20"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{
                  width: portalPhase !== "idle" ? "200vmax" : 0,
                  height: portalPhase !== "idle" ? "200vmax" : 0,
                  opacity: portalPhase === "opening" || portalPhase === "pulling" ? 0.5 : 0,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              
              {/* Inner rings - concentric circles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-white/10"
                  initial={{ width: 0, height: 0, opacity: 0 }}
                  animate={{
                    width: portalPhase !== "idle" ? `${150 - i * 25}vmax` : 0,
                    height: portalPhase !== "idle" ? `${150 - i * 25}vmax` : 0,
                    opacity: portalPhase === "opening" || portalPhase === "pulling" ? 0.3 - i * 0.05 : 0,
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                />
              ))}

              {/* Center glow */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
                }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{
                  width: portalPhase === "opening" ? "50vw" : portalPhase === "pulling" ? "100vw" : portalPhase === "through" ? "300vw" : 0,
                  height: portalPhase === "opening" ? "50vw" : portalPhase === "pulling" ? "100vw" : portalPhase === "through" ? "300vw" : 0,
                  opacity: portalPhase !== "idle" ? 1 : 0,
                }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />
            </motion.div>

            {/* Radial light rays */}
            <motion.div
              className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: portalPhase === "pulling" || portalPhase === "through" ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-[200vh] w-[2px] origin-center"
                  style={{
                    background: "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.1) 40%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 60%, transparent 100%)",
                    transform: `rotate(${i * 30}deg)`,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{
                    scaleY: portalPhase === "pulling" || portalPhase === "through" ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.02,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                />
              ))}
            </motion.div>

            {/* Logo Container */}
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <motion.div
                className="text-center px-4"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ 
                  opacity: showLogo && !isExiting ? 1 : 0,
                  y: showLogo && !isExiting ? 0 : (isExiting ? -100 : 30),
                  scale: showLogo && !isExiting ? 1 : (isExiting ? 0.8 : 0.95)
                }}
                transition={{ 
                  duration: isExiting ? 0.4 : 1.2, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <h1 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white select-none font-serif-display"
                  style={{
                    textShadow: "0 0 80px rgba(255, 255, 255, 0.3), 0 4px 40px rgba(0,0,0,0.9)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Sapira
                </h1>
                
                <motion.p
                  className="mt-4 md:mt-6 text-xs sm:text-sm md:text-base text-white/50 tracking-[0.4em] uppercase font-light select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showLogo && !isExiting ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: isExiting ? 0 : 0.4 }}
                >
                  Enterprise AI
                </motion.p>
              </motion.div>
            </div>

            {/* Enter button - Liquid Glass style (dark variant) */}
            <motion.div
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: showLogo && !isExiting ? 1 : 0,
                y: showLogo && !isExiting ? 0 : 20
              }}
              transition={{ delay: isExiting ? 0 : 1.5, duration: 0.6 }}
            >
              <div className="liquid-glass-wrap liquid-glass-wrap--dark">
                <button className="liquid-glass-button" onClick={handleExit}>
                  <span>Enter</span>
                </button>
                <div className="liquid-glass-shadow"></div>
              </div>
            </motion.div>

            {/* Corner accents */}
            <div className="absolute inset-0 z-25 pointer-events-none">
              {/* Top left */}
              <motion.div
                className="absolute top-8 left-8 w-16 h-[1px] bg-gradient-to-r from-white/30 to-transparent"
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: showLogo ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              <motion.div
                className="absolute top-8 left-8 w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent"
                initial={{ scaleY: 0, transformOrigin: "top" }}
                animate={{ scaleY: showLogo ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              
              {/* Top right */}
              <motion.div
                className="absolute top-8 right-8 w-16 h-[1px] bg-gradient-to-l from-white/30 to-transparent"
                initial={{ scaleX: 0, transformOrigin: "right" }}
                animate={{ scaleX: showLogo ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              <motion.div
                className="absolute top-8 right-8 w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent"
                initial={{ scaleY: 0, transformOrigin: "top" }}
                animate={{ scaleY: showLogo ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              
              {/* Bottom left */}
              <motion.div
                className="absolute bottom-8 left-8 w-16 h-[1px] bg-gradient-to-r from-white/30 to-transparent"
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: showLogo ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              <motion.div
                className="absolute bottom-8 left-8 w-[1px] h-16 bg-gradient-to-t from-white/30 to-transparent"
                initial={{ scaleY: 0, transformOrigin: "bottom" }}
                animate={{ scaleY: showLogo ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              
              {/* Bottom right */}
              <motion.div
                className="absolute bottom-8 right-8 w-16 h-[1px] bg-gradient-to-l from-white/30 to-transparent"
                initial={{ scaleX: 0, transformOrigin: "right" }}
                animate={{ scaleX: showLogo ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              <motion.div
                className="absolute bottom-8 right-8 w-[1px] h-16 bg-gradient-to-t from-white/30 to-transparent"
                initial={{ scaleY: 0, transformOrigin: "bottom" }}
                animate={{ scaleY: showLogo ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </div>

            {/* Progress bar at bottom */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 z-30 h-[1px] bg-white/10"
              animate={{ opacity: isExiting ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="h-full bg-white/40"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 12, ease: "linear" }}
              />
            </motion.div>
          </motion.div>

          {/* Flash overlay when entering portal */}
          <motion.div
            className="fixed inset-0 z-[101] pointer-events-none bg-white"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: portalPhase === "through" ? [0, 1, 0] : 0
            }}
            transition={{ 
              duration: 0.6,
              times: [0, 0.3, 1],
              ease: "easeOut"
            }}
          />

          {/* Particle effect during portal transition */}
          <motion.div
            className="fixed inset-0 z-[102] pointer-events-none flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: portalPhase === "opening" || portalPhase === "pulling" ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Particles moving toward center */}
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const distance = 100 + Math.random() * 50;
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/60 rounded-full"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * distance}vw)`,
                    top: `calc(50% + ${Math.sin(angle) * distance}vh)`,
                  }}
                  animate={{
                    x: portalPhase !== "idle" ? `${-Math.cos(angle) * distance}vw` : 0,
                    y: portalPhase !== "idle" ? `${-Math.sin(angle) * distance}vh` : 0,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.03,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                />
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
