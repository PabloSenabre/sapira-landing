"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "./AwakeningExperience";

// ============================================
// AUDIO ENGINE
// Generative audio using Web Audio API
// Creates ambient drones and reactive sounds
// ============================================

interface AudioNodes {
  context: AudioContext | null;
  masterGain: GainNode | null;
  droneOscillators: OscillatorNode[];
  organicOscillators: OscillatorNode[];
  geometricOscillators: OscillatorNode[];
  droneGain: GainNode | null;
  organicGain: GainNode | null;
  geometricGain: GainNode | null;
  transitionGain: GainNode | null;
  reverb: ConvolverNode | null;
}

export default function AudioEngine() {
  const nodesRef = useRef<AudioNodes>({
    context: null,
    masterGain: null,
    droneOscillators: [],
    organicOscillators: [],
    geometricOscillators: [],
    droneGain: null,
    organicGain: null,
    geometricGain: null,
    transitionGain: null,
    reverb: null,
  });

  const { audioEnabled, phase, hoveredForm, selectedPath } = useExperience();

  // Create simple impulse response for reverb
  const createImpulseResponse = (context: AudioContext, duration = 2, decay = 2) => {
    const sampleRate = context.sampleRate;
    const length = sampleRate * duration;
    const impulse = context.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }

    return impulse;
  };

  // Initialize audio context and nodes
  useEffect(() => {
    if (!audioEnabled) return;

    const nodes = nodesRef.current;

    // Create audio context
    const context = new AudioContext();
    nodes.context = context;

    // Master gain
    const masterGain = context.createGain();
    masterGain.gain.value = 0.15; // Keep it subtle
    masterGain.connect(context.destination);
    nodes.masterGain = masterGain;

    // Reverb
    const reverb = context.createConvolver();
    reverb.buffer = createImpulseResponse(context);
    const reverbGain = context.createGain();
    reverbGain.gain.value = 0.3;
    reverb.connect(reverbGain);
    reverbGain.connect(masterGain);
    nodes.reverb = reverb;

    // Drone gain
    const droneGain = context.createGain();
    droneGain.gain.value = 0;
    droneGain.connect(masterGain);
    droneGain.connect(reverb);
    nodes.droneGain = droneGain;

    // Create drone oscillators (low frequency ambient)
    const droneFrequencies = [40, 60, 80, 120]; // Hz
    nodes.droneOscillators = droneFrequencies.map((freq, i) => {
      const osc = context.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      
      // Slight detuning for richness
      osc.detune.value = (Math.random() - 0.5) * 10;
      
      // Individual gain for layering
      const oscGain = context.createGain();
      oscGain.gain.value = 0.3 - i * 0.05;
      
      osc.connect(oscGain);
      oscGain.connect(droneGain);
      osc.start();
      
      return osc;
    });

    // Organic gain (warm tones)
    const organicGain = context.createGain();
    organicGain.gain.value = 0;
    organicGain.connect(masterGain);
    organicGain.connect(reverb);
    nodes.organicGain = organicGain;

    // Create organic oscillators (warm, string-like)
    const organicFrequencies = [220, 330, 440, 550]; // A3, E4, A4, C#5 - warm chord
    nodes.organicOscillators = organicFrequencies.map((freq, i) => {
      const osc = context.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 5;
      
      const oscGain = context.createGain();
      oscGain.gain.value = 0.15 - i * 0.02;
      
      osc.connect(oscGain);
      oscGain.connect(organicGain);
      osc.start();
      
      return osc;
    });

    // Geometric gain (crystalline tones)
    const geometricGain = context.createGain();
    geometricGain.gain.value = 0;
    geometricGain.connect(masterGain);
    geometricGain.connect(reverb);
    nodes.geometricGain = geometricGain;

    // Create geometric oscillators (crystalline, bell-like)
    const geometricFrequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6 - bright chord
    nodes.geometricOscillators = geometricFrequencies.map((freq, i) => {
      const osc = context.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "square";
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 3;
      
      // Filter for square waves to soften
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2000;
      
      const oscGain = context.createGain();
      oscGain.gain.value = 0.08 - i * 0.01;
      
      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(geometricGain);
      osc.start();
      
      return osc;
    });

    // Transition gain
    const transitionGain = context.createGain();
    transitionGain.gain.value = 0;
    transitionGain.connect(masterGain);
    nodes.transitionGain = transitionGain;

    return () => {
      // Cleanup
      nodes.droneOscillators.forEach(osc => osc.stop());
      nodes.organicOscillators.forEach(osc => osc.stop());
      nodes.geometricOscillators.forEach(osc => osc.stop());
      context.close();
    };
  }, [audioEnabled]);

  // Fade out all audio when disabled
  useEffect(() => {
    const nodes = nodesRef.current;
    if (!nodes.context) return;
    
    if (!audioEnabled) {
      const now = nodes.context.currentTime;
      const fadeOut = 0.3;
      
      // Fade out all gains quickly
      if (nodes.masterGain) {
        nodes.masterGain.gain.linearRampToValueAtTime(0, now + fadeOut);
      }
    }
  }, [audioEnabled]);

  // Update audio based on phase and interactions
  useEffect(() => {
    const nodes = nodesRef.current;
    if (!nodes.context || !audioEnabled) return;

    const now = nodes.context.currentTime;
    const fadeTime = 1.5;

    // Drone based on phase
    if (nodes.droneGain) {
      let targetDrone = 0;
      if (phase === "silence") {
        targetDrone = 0.3;
      } else if (phase === "revelation" || phase === "choice") {
        targetDrone = 0.2;
      } else if (phase === "crossing") {
        targetDrone = 0.1;
      }
      nodes.droneGain.gain.linearRampToValueAtTime(targetDrone, now + fadeTime);
    }

    // Organic sound on hover
    if (nodes.organicGain) {
      const targetOrganic = hoveredForm === "organic" ? 0.4 : 0;
      nodes.organicGain.gain.linearRampToValueAtTime(targetOrganic, now + 0.5);
    }

    // Geometric sound on hover
    if (nodes.geometricGain) {
      const targetGeometric = hoveredForm === "geometric" ? 0.3 : 0;
      nodes.geometricGain.gain.linearRampToValueAtTime(targetGeometric, now + 0.5);
    }

  }, [audioEnabled, phase, hoveredForm]);

  // Transition crescendo
  useEffect(() => {
    const nodes = nodesRef.current;
    if (!nodes.context || !audioEnabled || phase !== "crossing") return;

    const now = nodes.context.currentTime;

    // Fade out drone
    if (nodes.droneGain) {
      nodes.droneGain.gain.linearRampToValueAtTime(0, now + 1.5);
    }

    // Crescendo the selected path's sound
    if (selectedPath === "organic" && nodes.organicGain) {
      nodes.organicGain.gain.linearRampToValueAtTime(0.6, now + 0.8);
      nodes.organicGain.gain.linearRampToValueAtTime(0, now + 2);
    } else if (selectedPath === "geometric" && nodes.geometricGain) {
      nodes.geometricGain.gain.linearRampToValueAtTime(0.5, now + 0.8);
      nodes.geometricGain.gain.linearRampToValueAtTime(0, now + 2);
    }

  }, [audioEnabled, phase, selectedPath]);

  // LFO modulation for more organic sound
  useEffect(() => {
    const nodes = nodesRef.current;
    if (!nodes.context || !audioEnabled) return;

    let animationFrame: number;

    const modulate = () => {
      const now = nodes.context!.currentTime;
      const lfo = Math.sin(now * 0.5) * 0.1 + 1; // Slow oscillation

      // Modulate drone frequencies slightly
      nodes.droneOscillators.forEach((osc, i) => {
        const baseFreq = [40, 60, 80, 120][i];
        osc.frequency.value = baseFreq * (1 + Math.sin(now * 0.3 + i) * 0.02);
      });

      animationFrame = requestAnimationFrame(modulate);
    };

    modulate();

    return () => cancelAnimationFrame(animationFrame);
  }, [audioEnabled]);

  // This component doesn't render anything visible
  return null;
}

