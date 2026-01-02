"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BiosRestartProps {
  onComplete: () => void;
}

export default function BiosRestart({ onComplete }: BiosRestartProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    // Initial POST sequence
    const sequence = [
      { text: "Award Modular BIOS v6.00PG, An Energy Star Ally", delay: 200 },
      { text: "Copyright (C) 1984-2003, Award Software, Inc.", delay: 400 },
      { text: "ASUS P4P800 ACPI BIOS Revision 1009", delay: 600 },
      { text: "Main Processor : Sapira AI Neural Engine 9000", delay: 800 },
      { text: "Memory Testing : 16777216K OK", delay: 1000 },
      { text: "", delay: 1200 },
      { text: "Detecting Legacy Debt...... Found", delay: 1400 },
      { text: "Analyzing Business Logic... Tangled", delay: 1600 },
      { text: "Efficiency Check........... FAILED", delay: 1800 },
      { text: "", delay: 2000 },
      { text: "CRITICAL ERROR: Manual Intervention Required", delay: 2200 },
      { text: "Press F1 to enter Setup", delay: 2400 },
      { text: "Entering Setup...", delay: 3000 },
    ];

    let timeouts: NodeJS.Timeout[] = [];

    sequence.forEach(({ text, delay }) => {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, text]);
      }, delay);
      timeouts.push(timeout);
    });

    // Switch to Blue Setup Screen
    const setupTimeout = setTimeout(() => {
      setShowSetup(true);
    }, 3500);

    const completionTimeout = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(setupTimeout);
      clearTimeout(completionTimeout);
    };
  }, [onComplete]);

  if (showSetup) {
    return (
      <motion.div 
        className="fixed inset-0 z-[600] bg-[#0000AA] font-mono text-white p-8 cursor-none flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full max-w-4xl border-2 border-white p-1">
          <div className="border border-white h-full relative">
            {/* Header */}
            <div className="bg-[#00AAAA] text-black text-center font-bold py-1 mb-4">
              Phoenix - AwardBIOS CMOS Setup Utility
            </div>

            <div className="grid grid-cols-2 gap-8 px-8 py-4">
              <div className="space-y-2">
                <div className="text-yellow-300">► Standard CMOS Features</div>
                <div className="text-yellow-300">► Advanced BIOS Features</div>
                <div className="text-yellow-300">► Integrated Peripherals</div>
                <div className="text-yellow-300">► Power Management Setup</div>
                <div className="text-yellow-300">► PnP/PCI Configurations</div>
                <div className="text-white mt-4 blink">
                  Warning: System Unstable
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-white opacity-50">Load Fail-Safe Defaults</div>
                <div className="text-white opacity-50">Load Optimized Defaults</div>
                <div className="text-white opacity-50">Set Supervisor Password</div>
                <div className="text-white opacity-50">Set User Password</div>
                <div className="text-red-500 bg-white/20 px-1 animate-pulse">
                   ► INJECT SAPIRA AI KERNEL
                </div>
                <div className="text-white opacity-50">Save & Exit Setup</div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="mt-8 border-t border-white pt-2 flex justify-between text-xs px-2 pb-2">
              <div>Esc : Quit</div>
              <div>↑ ↓ → ← : Select Item</div>
              <div className="text-red-500 font-bold">F10 : Save & Exit</div>
            </div>
            
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
               <div className="bg-[#AA0000] text-white p-4 border-2 border-white shadow-xl animate-bounce">
                  <div className="text-center font-bold mb-2">SYSTEM OVERRIDE</div>
                  <div className="text-sm">Sapira Protocol Initiated...</div>
               </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-[600] bg-black font-mono p-8 overflow-hidden cursor-none">
      <div className="flex flex-col text-[#C0C0C0] text-sm md:text-base leading-snug max-w-4xl mx-auto">
        <div className="absolute top-8 right-8 hidden md:block opacity-50">
          <div className="border-2 border-[#C0C0C0] p-2 w-32 text-[10px] text-center">
             energy
             <br/>
             <br/>
             EPA POLLUTION PREVENTER
          </div>
        </div>

        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div className="animate-pulse">_</div>
        
        <div className="fixed bottom-4 left-0 right-0 px-8 flex justify-between text-xs text-[#808080]">
           <span>10/16/2003-i865PE-P4P800</span>
           <span>Award Software, Inc.</span>
        </div>
      </div>
    </div>
  );
}
