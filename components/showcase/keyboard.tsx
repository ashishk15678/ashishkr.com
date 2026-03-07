"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════
// AUDIO ENGINE — Web Audio API for crispy key sounds
// ═══════════════════════════════════════════════════════

class KeySoundEngine {
  private ctx: AudioContext | null = null;
  private initialized = false;
  private compressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (this.initialized) return;
    try {
      this.ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      // Master compressor to prevent clipping and glue layers together
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 12;
      this.compressor.ratio.value = 6;
      this.compressor.attack.value = 0.001;
      this.compressor.release.value = 0.05;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch {
      // Audio not supported
    }
  }

  private get dest(): AudioNode {
    return this.compressor || this.ctx!.destination;
  }

  private makeNoise(duration: number): AudioBufferSourceNode {
    const ctx = this.ctx!;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    return src;
  }

  playKeyDown(frequency = 1800, type: "mechanical" | "mac" = "mechanical") {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Add micro-random offset so rapid presses don't phase-cancel
    const jitter = Math.random() * 0.002;
    const t = now + jitter;

    if (type === "mechanical") {
      // ═══════════════════════════════════════════════
      // MECHANICAL KEYBOARD — multi-layer realistic sound
      // Layers: bottom-out impact, spring ping, plate resonance, housing reverb
      // ═══════════════════════════════════════════════

      // ── Layer 1: Bottom-out impact (the initial "clack") ──
      // Short burst of shaped noise simulating plastic-on-plate impact
      const impact = this.makeNoise(0.025);
      const impactGain = this.ctx.createGain();
      const impactHP = this.ctx.createBiquadFilter();
      const impactLP = this.ctx.createBiquadFilter();

      impactHP.type = "highpass";
      impactHP.frequency.value = 1800 + Math.random() * 600;
      impactHP.Q.value = 0.7;

      impactLP.type = "lowpass";
      impactLP.frequency.setValueAtTime(8000, t);
      impactLP.frequency.exponentialRampToValueAtTime(2000, t + 0.02);
      impactLP.Q.value = 1.2;

      // Sharp attack, fast decay — the "click" character
      impactGain.gain.setValueAtTime(0, t);
      impactGain.gain.linearRampToValueAtTime(0.18, t + 0.001);
      impactGain.gain.exponentialRampToValueAtTime(0.01, t + 0.018);
      impactGain.gain.linearRampToValueAtTime(0, t + 0.025);

      impact.connect(impactHP);
      impactHP.connect(impactLP);
      impactLP.connect(impactGain);
      impactGain.connect(this.dest);
      impact.start(t);
      impact.stop(t + 0.03);

      // ── Layer 2: Spring resonance (metallic "ping" after bottom-out) ──
      // A rapidly decaying sine at a high frequency simulates the spring vibration
      const springFreq = 4200 + Math.random() * 1200;
      const spring = this.ctx.createOscillator();
      const springGain = this.ctx.createGain();
      const springBP = this.ctx.createBiquadFilter();

      spring.type = "sine";
      spring.frequency.setValueAtTime(springFreq, t);
      spring.frequency.exponentialRampToValueAtTime(springFreq * 0.6, t + 0.04);

      springBP.type = "bandpass";
      springBP.frequency.value = springFreq * 0.8;
      springBP.Q.value = 8;

      springGain.gain.setValueAtTime(0, t);
      springGain.gain.linearRampToValueAtTime(
        0.012 + Math.random() * 0.008,
        t + 0.001,
      );
      springGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      spring.connect(springBP);
      springBP.connect(springGain);
      springGain.connect(this.dest);
      spring.start(t);
      spring.stop(t + 0.05);

      // ── Layer 3: Plate resonance (the "thock" body of the sound) ──
      // Mid-frequency noise burst filtered to simulate aluminum/steel plate ringing
      const plate = this.makeNoise(0.06);
      const plateGain = this.ctx.createGain();
      const plateBP = this.ctx.createBiquadFilter();
      const platePeak = this.ctx.createBiquadFilter();

      plateBP.type = "bandpass";
      plateBP.frequency.value = 900 + Math.random() * 400;
      plateBP.Q.value = 2.5;

      // Resonant peak to add "character" — varies per keypress
      platePeak.type = "peaking";
      platePeak.frequency.value = 2200 + Math.random() * 800;
      platePeak.gain.value = 6;
      platePeak.Q.value = 4;

      plateGain.gain.setValueAtTime(0, t);
      plateGain.gain.linearRampToValueAtTime(0.09, t + 0.002);
      plateGain.gain.exponentialRampToValueAtTime(0.004, t + 0.035);
      plateGain.gain.linearRampToValueAtTime(0, t + 0.06);

      plate.connect(plateBP);
      plateBP.connect(platePeak);
      platePeak.connect(plateGain);
      plateGain.connect(this.dest);
      plate.start(t);
      plate.stop(t + 0.065);

      // ── Layer 4: Housing / case resonance (low "thud") ──
      // Low-frequency sine burst simulating the keyboard case vibrating
      const housing = this.ctx.createOscillator();
      const housingGain = this.ctx.createGain();
      const housingLP = this.ctx.createBiquadFilter();

      housing.type = "sine";
      housing.frequency.setValueAtTime(140 + Math.random() * 40, t);
      housing.frequency.exponentialRampToValueAtTime(70, t + 0.05);

      housingLP.type = "lowpass";
      housingLP.frequency.value = 300;
      housingLP.Q.value = 1;

      housingGain.gain.setValueAtTime(0, t);
      housingGain.gain.linearRampToValueAtTime(0.06, t + 0.002);
      housingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      housing.connect(housingLP);
      housingLP.connect(housingGain);
      housingGain.connect(this.dest);
      housing.start(t);
      housing.stop(t + 0.07);

      // ── Layer 5: High-frequency "tick" transient ──
      // Very short burst adding the crispy top-end presence
      const tick = this.ctx.createOscillator();
      const tickGain = this.ctx.createGain();

      tick.type = "square";
      tick.frequency.setValueAtTime(frequency + Math.random() * 500, t);
      tick.frequency.exponentialRampToValueAtTime(800, t + 0.008);

      tickGain.gain.setValueAtTime(0.03, t);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.01);

      tick.connect(tickGain);
      tickGain.connect(this.dest);
      tick.start(t);
      tick.stop(t + 0.012);
    } else {
      // ═══════════════════════════════════════════════
      // MAC KEYBOARD — dampened scissor/butterfly mechanism
      // Layers: rubber dome thock, dampened contact, muffled housing
      // ═══════════════════════════════════════════════

      // ── Layer 1: Rubber dome "thock" (the primary sound) ──
      const dome = this.makeNoise(0.04);
      const domeGain = this.ctx.createGain();
      const domeLP = this.ctx.createBiquadFilter();
      const domeBP = this.ctx.createBiquadFilter();

      domeLP.type = "lowpass";
      domeLP.frequency.setValueAtTime(2800 + Math.random() * 400, t);
      domeLP.frequency.exponentialRampToValueAtTime(600, t + 0.03);
      domeLP.Q.value = 0.5;

      domeBP.type = "bandpass";
      domeBP.frequency.value = 800 + Math.random() * 300;
      domeBP.Q.value = 1.5;

      domeGain.gain.setValueAtTime(0, t);
      domeGain.gain.linearRampToValueAtTime(0.1, t + 0.001);
      domeGain.gain.exponentialRampToValueAtTime(0.003, t + 0.025);
      domeGain.gain.linearRampToValueAtTime(0, t + 0.04);

      dome.connect(domeLP);
      domeLP.connect(domeBP);
      domeBP.connect(domeGain);
      domeGain.connect(this.dest);
      dome.start(t);
      dome.stop(t + 0.045);

      // ── Layer 2: Dampened contact (subtle plastic tap) ──
      const contact = this.makeNoise(0.015);
      const contactGain = this.ctx.createGain();
      const contactBP = this.ctx.createBiquadFilter();

      contactBP.type = "bandpass";
      contactBP.frequency.value = 3000 + Math.random() * 800;
      contactBP.Q.value = 3;

      contactGain.gain.setValueAtTime(0.02, t);
      contactGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

      contact.connect(contactBP);
      contactBP.connect(contactGain);
      contactGain.connect(this.dest);
      contact.start(t);
      contact.stop(t + 0.02);

      // ── Layer 3: Muffled low body ──
      const body = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      const bodyLP = this.ctx.createBiquadFilter();

      body.type = "sine";
      body.frequency.setValueAtTime(160 + Math.random() * 50, t);
      body.frequency.exponentialRampToValueAtTime(55, t + 0.035);

      bodyLP.type = "lowpass";
      bodyLP.frequency.value = 250;

      bodyGain.gain.setValueAtTime(0.04, t);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      body.connect(bodyLP);
      bodyLP.connect(bodyGain);
      bodyGain.connect(this.dest);
      body.start(t);
      body.stop(t + 0.045);
    }
  }

  playKeyUp(type: "mechanical" | "mac" = "mechanical") {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const t = now + Math.random() * 0.001;

    if (type === "mechanical") {
      // ── Mechanical upstroke: spring release + lighter impact ──

      // Spring release "tink"
      const spring = this.ctx.createOscillator();
      const springGain = this.ctx.createGain();
      const springBP = this.ctx.createBiquadFilter();

      spring.type = "sine";
      const freq = 5000 + Math.random() * 1500;
      spring.frequency.setValueAtTime(freq, t);
      spring.frequency.exponentialRampToValueAtTime(freq * 0.4, t + 0.02);

      springBP.type = "bandpass";
      springBP.frequency.value = freq * 0.7;
      springBP.Q.value = 6;

      springGain.gain.setValueAtTime(0.008, t);
      springGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      spring.connect(springBP);
      springBP.connect(springGain);
      springGain.connect(this.dest);
      spring.start(t);
      spring.stop(t + 0.03);

      // Lighter impact noise (keycap hitting the top housing)
      const upNoise = this.makeNoise(0.015);
      const upGain = this.ctx.createGain();
      const upHP = this.ctx.createBiquadFilter();

      upHP.type = "highpass";
      upHP.frequency.value = 2500 + Math.random() * 500;
      upHP.Q.value = 0.8;

      upGain.gain.setValueAtTime(0.04, t);
      upGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

      upNoise.connect(upHP);
      upHP.connect(upGain);
      upGain.connect(this.dest);
      upNoise.start(t);
      upNoise.stop(t + 0.018);
    } else {
      // ── Mac upstroke: very soft return snap ──
      const snap = this.makeNoise(0.012);
      const snapGain = this.ctx.createGain();
      const snapLP = this.ctx.createBiquadFilter();

      snapLP.type = "lowpass";
      snapLP.frequency.value = 1500 + Math.random() * 400;
      snapLP.Q.value = 0.5;

      snapGain.gain.setValueAtTime(0.02, t);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.01);

      snap.connect(snapLP);
      snapLP.connect(snapGain);
      snapGain.connect(this.dest);
      snap.start(t);
      snap.stop(t + 0.015);
    }
  }

  playSpace(type: "mechanical" | "mac" = "mechanical") {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const t = now + Math.random() * 0.001;

    if (type === "mechanical") {
      // ═══════════════════════════════════════════════
      // MECHANICAL SPACEBAR — deeper, longer, more resonant
      // The spacebar has a stabilizer wire that adds rattly character
      // ═══════════════════════════════════════════════

      // ── Stabilizer rattle (unique to spacebar) ──
      const rattle = this.makeNoise(0.06);
      const rattleGain = this.ctx.createGain();
      const rattleBP = this.ctx.createBiquadFilter();
      const rattleHP = this.ctx.createBiquadFilter();

      rattleBP.type = "bandpass";
      rattleBP.frequency.value = 1800 + Math.random() * 600;
      rattleBP.Q.value = 5;

      rattleHP.type = "highpass";
      rattleHP.frequency.value = 1200;

      rattleGain.gain.setValueAtTime(0, t);
      rattleGain.gain.linearRampToValueAtTime(0.06, t + 0.002);
      rattleGain.gain.setValueAtTime(0.04, t + 0.008);
      rattleGain.gain.linearRampToValueAtTime(0.05, t + 0.012);
      rattleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      rattle.connect(rattleBP);
      rattleBP.connect(rattleHP);
      rattleHP.connect(rattleGain);
      rattleGain.connect(this.dest);
      rattle.start(t);
      rattle.stop(t + 0.06);

      // ── Deep bottom-out impact ──
      const impact = this.makeNoise(0.05);
      const impactGain = this.ctx.createGain();
      const impactBP = this.ctx.createBiquadFilter();

      impactBP.type = "bandpass";
      impactBP.frequency.value = 500 + Math.random() * 200;
      impactBP.Q.value = 2;

      impactGain.gain.setValueAtTime(0, t);
      impactGain.gain.linearRampToValueAtTime(0.16, t + 0.002);
      impactGain.gain.exponentialRampToValueAtTime(0.005, t + 0.04);
      impactGain.gain.linearRampToValueAtTime(0, t + 0.055);

      impact.connect(impactBP);
      impactBP.connect(impactGain);
      impactGain.connect(this.dest);
      impact.start(t);
      impact.stop(t + 0.06);

      // ── Deep case thump (spacebar excites more case resonance) ──
      const thump = this.ctx.createOscillator();
      const thumpGain = this.ctx.createGain();
      const thumpLP = this.ctx.createBiquadFilter();

      thump.type = "sine";
      thump.frequency.setValueAtTime(95 + Math.random() * 20, t);
      thump.frequency.exponentialRampToValueAtTime(35, t + 0.08);

      thumpLP.type = "lowpass";
      thumpLP.frequency.value = 200;

      thumpGain.gain.setValueAtTime(0, t);
      thumpGain.gain.linearRampToValueAtTime(0.1, t + 0.003);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      thump.connect(thumpLP);
      thumpLP.connect(thumpGain);
      thumpGain.connect(this.dest);
      thump.start(t);
      thump.stop(t + 0.1);

      // ── Plate ring (longer for spacebar) ──
      const plate = this.makeNoise(0.08);
      const plateGain = this.ctx.createGain();
      const plateBP = this.ctx.createBiquadFilter();

      plateBP.type = "bandpass";
      plateBP.frequency.value = 700 + Math.random() * 200;
      plateBP.Q.value = 3;

      plateGain.gain.setValueAtTime(0.06, t + 0.002);
      plateGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      plate.connect(plateBP);
      plateBP.connect(plateGain);
      plateGain.connect(this.dest);
      plate.start(t);
      plate.stop(t + 0.085);
    } else {
      // ═══════════════════════════════════════════════
      // MAC SPACEBAR — deeper "thock" but still dampened
      // ═══════════════════════════════════════════════

      // Deeper dome thock
      const dome = this.makeNoise(0.06);
      const domeGain = this.ctx.createGain();
      const domeLP = this.ctx.createBiquadFilter();
      const domeBP = this.ctx.createBiquadFilter();

      domeLP.type = "lowpass";
      domeLP.frequency.setValueAtTime(2200, t);
      domeLP.frequency.exponentialRampToValueAtTime(400, t + 0.04);

      domeBP.type = "bandpass";
      domeBP.frequency.value = 500 + Math.random() * 200;
      domeBP.Q.value = 1.8;

      domeGain.gain.setValueAtTime(0, t);
      domeGain.gain.linearRampToValueAtTime(0.13, t + 0.002);
      domeGain.gain.exponentialRampToValueAtTime(0.003, t + 0.04);
      domeGain.gain.linearRampToValueAtTime(0, t + 0.06);

      dome.connect(domeLP);
      domeLP.connect(domeBP);
      domeBP.connect(domeGain);
      domeGain.connect(this.dest);
      dome.start(t);
      dome.stop(t + 0.065);

      // Low body thud
      const body = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();

      body.type = "sine";
      body.frequency.setValueAtTime(110 + Math.random() * 30, t);
      body.frequency.exponentialRampToValueAtTime(40, t + 0.06);

      bodyGain.gain.setValueAtTime(0.06, t);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      body.connect(bodyGain);
      bodyGain.connect(this.dest);
      body.start(t);
      body.stop(t + 0.08);

      // Subtle stabilizer noise
      const stabNoise = this.makeNoise(0.03);
      const stabGain = this.ctx.createGain();
      const stabBP = this.ctx.createBiquadFilter();

      stabBP.type = "bandpass";
      stabBP.frequency.value = 1500 + Math.random() * 500;
      stabBP.Q.value = 3;

      stabGain.gain.setValueAtTime(0.02, t + 0.001);
      stabGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      stabNoise.connect(stabBP);
      stabBP.connect(stabGain);
      stabGain.connect(this.dest);
      stabNoise.start(t);
      stabNoise.stop(t + 0.035);
    }
  }
}

// ═══════════════════════════════════════════════════════
// KEY LAYOUTS
// ═══════════════════════════════════════════════════════

interface KeyDef {
  id: string;
  label: string;
  shiftLabel?: string;
  code: string;
  width?: number; // in units (1 unit = standard key width)
  icon?:
    | "backspace"
    | "tab"
    | "caps"
    | "enter"
    | "shift"
    | "space"
    | "cmd"
    | "opt"
    | "ctrl"
    | "fn"
    | "globe"
    | "up"
    | "down"
    | "left"
    | "right";
}

const MECHANICAL_ROWS: KeyDef[][] = [
  // Row 0: Function/number row
  [
    { id: "esc", label: "Esc", code: "Escape", width: 1 },
    { id: "1", label: "1", shiftLabel: "!", code: "Digit1" },
    { id: "2", label: "2", shiftLabel: "@", code: "Digit2" },
    { id: "3", label: "3", shiftLabel: "#", code: "Digit3" },
    { id: "4", label: "4", shiftLabel: "$", code: "Digit4" },
    { id: "5", label: "5", shiftLabel: "%", code: "Digit5" },
    { id: "6", label: "6", shiftLabel: "^", code: "Digit6" },
    { id: "7", label: "7", shiftLabel: "&", code: "Digit7" },
    { id: "8", label: "8", shiftLabel: "*", code: "Digit8" },
    { id: "9", label: "9", shiftLabel: "(", code: "Digit9" },
    { id: "0", label: "0", shiftLabel: ")", code: "Digit0" },
    { id: "minus", label: "-", shiftLabel: "_", code: "Minus" },
    { id: "equal", label: "=", shiftLabel: "+", code: "Equal" },
    {
      id: "backspace",
      label: "Backspace",
      code: "Backspace",
      width: 2,
      icon: "backspace",
    },
  ],
  // Row 1: QWERTY
  [
    { id: "tab", label: "Tab", code: "Tab", width: 1.5, icon: "tab" },
    { id: "q", label: "Q", code: "KeyQ" },
    { id: "w", label: "W", code: "KeyW" },
    { id: "e", label: "E", code: "KeyE" },
    { id: "r", label: "R", code: "KeyR" },
    { id: "t", label: "T", code: "KeyT" },
    { id: "y", label: "Y", code: "KeyY" },
    { id: "u", label: "U", code: "KeyU" },
    { id: "i", label: "I", code: "KeyI" },
    { id: "o", label: "O", code: "KeyO" },
    { id: "p", label: "P", code: "KeyP" },
    { id: "bracketL", label: "[", shiftLabel: "{", code: "BracketLeft" },
    { id: "bracketR", label: "]", shiftLabel: "}", code: "BracketRight" },
    {
      id: "backslash",
      label: "\\",
      shiftLabel: "|",
      code: "Backslash",
      width: 1.5,
    },
  ],
  // Row 2: Home row
  [
    { id: "caps", label: "Caps", code: "CapsLock", width: 1.75, icon: "caps" },
    { id: "a", label: "A", code: "KeyA" },
    { id: "s", label: "S", code: "KeyS" },
    { id: "d", label: "D", code: "KeyD" },
    { id: "f", label: "F", code: "KeyF" },
    { id: "g", label: "G", code: "KeyG" },
    { id: "h", label: "H", code: "KeyH" },
    { id: "j", label: "J", code: "KeyJ" },
    { id: "k", label: "K", code: "KeyK" },
    { id: "l", label: "L", code: "KeyL" },
    { id: "semicolon", label: ";", shiftLabel: ":", code: "Semicolon" },
    { id: "quote", label: "'", shiftLabel: '"', code: "Quote" },
    { id: "enter", label: "Enter", code: "Enter", width: 2.25, icon: "enter" },
  ],
  // Row 3: Shift row
  [
    {
      id: "shiftL",
      label: "Shift",
      code: "ShiftLeft",
      width: 2.25,
      icon: "shift",
    },
    { id: "z", label: "Z", code: "KeyZ" },
    { id: "x", label: "X", code: "KeyX" },
    { id: "c", label: "C", code: "KeyC" },
    { id: "v", label: "V", code: "KeyV" },
    { id: "b", label: "B", code: "KeyB" },
    { id: "n", label: "N", code: "KeyN" },
    { id: "m", label: "M", code: "KeyM" },
    { id: "comma", label: ",", shiftLabel: "<", code: "Comma" },
    { id: "period", label: ".", shiftLabel: ">", code: "Period" },
    { id: "slash", label: "/", shiftLabel: "?", code: "Slash" },
    {
      id: "shiftR",
      label: "Shift",
      code: "ShiftRight",
      width: 2.75,
      icon: "shift",
    },
  ],
  // Row 4: Bottom row
  [
    {
      id: "ctrlL",
      label: "Ctrl",
      code: "ControlLeft",
      width: 1.25,
      icon: "ctrl",
    },
    { id: "super", label: "Win", code: "MetaLeft", width: 1.25, icon: "cmd" },
    { id: "altL", label: "Alt", code: "AltLeft", width: 1.25 },
    { id: "space", label: "", code: "Space", width: 6.25, icon: "space" },
    { id: "altR", label: "Alt", code: "AltRight", width: 1.25 },
    { id: "fn", label: "Fn", code: "Fn", width: 1.25, icon: "fn" },
    { id: "menu", label: "Menu", code: "ContextMenu", width: 1.25 },
    {
      id: "ctrlR",
      label: "Ctrl",
      code: "ControlRight",
      width: 1.25,
      icon: "ctrl",
    },
  ],
];

const MAC_ROWS: KeyDef[][] = [
  // Row 0: Number row
  [
    { id: "grave", label: "`", shiftLabel: "~", code: "Backquote" },
    { id: "1", label: "1", shiftLabel: "!", code: "Digit1" },
    { id: "2", label: "2", shiftLabel: "@", code: "Digit2" },
    { id: "3", label: "3", shiftLabel: "#", code: "Digit3" },
    { id: "4", label: "4", shiftLabel: "$", code: "Digit4" },
    { id: "5", label: "5", shiftLabel: "%", code: "Digit5" },
    { id: "6", label: "6", shiftLabel: "^", code: "Digit6" },
    { id: "7", label: "7", shiftLabel: "&", code: "Digit7" },
    { id: "8", label: "8", shiftLabel: "*", code: "Digit8" },
    { id: "9", label: "9", shiftLabel: "(", code: "Digit9" },
    { id: "0", label: "0", shiftLabel: ")", code: "Digit0" },
    { id: "minus", label: "-", shiftLabel: "_", code: "Minus" },
    { id: "equal", label: "=", shiftLabel: "+", code: "Equal" },
    {
      id: "backspace",
      label: "delete",
      code: "Backspace",
      width: 1.5,
      icon: "backspace",
    },
  ],
  // Row 1
  [
    { id: "tab", label: "tab", code: "Tab", width: 1.5, icon: "tab" },
    { id: "q", label: "Q", code: "KeyQ" },
    { id: "w", label: "W", code: "KeyW" },
    { id: "e", label: "E", code: "KeyE" },
    { id: "r", label: "R", code: "KeyR" },
    { id: "t", label: "T", code: "KeyT" },
    { id: "y", label: "Y", code: "KeyY" },
    { id: "u", label: "U", code: "KeyU" },
    { id: "i", label: "I", code: "KeyI" },
    { id: "o", label: "O", code: "KeyO" },
    { id: "p", label: "P", code: "KeyP" },
    { id: "bracketL", label: "[", shiftLabel: "{", code: "BracketLeft" },
    { id: "bracketR", label: "]", shiftLabel: "}", code: "BracketRight" },
    {
      id: "backslash",
      label: "\\",
      shiftLabel: "|",
      code: "Backslash",
      width: 1,
    },
  ],
  // Row 2
  [
    {
      id: "caps",
      label: "caps lock",
      code: "CapsLock",
      width: 1.8,
      icon: "caps",
    },
    { id: "a", label: "A", code: "KeyA" },
    { id: "s", label: "S", code: "KeyS" },
    { id: "d", label: "D", code: "KeyD" },
    { id: "f", label: "F", code: "KeyF" },
    { id: "g", label: "G", code: "KeyG" },
    { id: "h", label: "H", code: "KeyH" },
    { id: "j", label: "J", code: "KeyJ" },
    { id: "k", label: "K", code: "KeyK" },
    { id: "l", label: "L", code: "KeyL" },
    { id: "semicolon", label: ";", shiftLabel: ":", code: "Semicolon" },
    { id: "quote", label: "'", shiftLabel: '"', code: "Quote" },
    { id: "enter", label: "return", code: "Enter", width: 1.7, icon: "enter" },
  ],
  // Row 3
  [
    {
      id: "shiftL",
      label: "shift",
      code: "ShiftLeft",
      width: 2.3,
      icon: "shift",
    },
    { id: "z", label: "Z", code: "KeyZ" },
    { id: "x", label: "X", code: "KeyX" },
    { id: "c", label: "C", code: "KeyC" },
    { id: "v", label: "V", code: "KeyV" },
    { id: "b", label: "B", code: "KeyB" },
    { id: "n", label: "N", code: "KeyN" },
    { id: "m", label: "M", code: "KeyM" },
    { id: "comma", label: ",", shiftLabel: "<", code: "Comma" },
    { id: "period", label: ".", shiftLabel: ">", code: "Period" },
    { id: "slash", label: "/", shiftLabel: "?", code: "Slash" },
    {
      id: "shiftR",
      label: "shift",
      code: "ShiftRight",
      width: 2.2,
      icon: "shift",
    },
  ],
  // Row 4: Mac bottom row
  [
    { id: "fn", label: "fn", code: "Fn", width: 1, icon: "globe" },
    {
      id: "ctrlL",
      label: "control",
      code: "ControlLeft",
      width: 1.1,
      icon: "ctrl",
    },
    { id: "optL", label: "option", code: "AltLeft", width: 1.1, icon: "opt" },
    { id: "cmdL", label: "command", code: "MetaLeft", width: 1.3, icon: "cmd" },
    { id: "space", label: "", code: "Space", width: 5.2, icon: "space" },
    {
      id: "cmdR",
      label: "command",
      code: "MetaRight",
      width: 1.3,
      icon: "cmd",
    },
    { id: "optR", label: "option", code: "AltRight", width: 1.1, icon: "opt" },
    { id: "left", label: "◀", code: "ArrowLeft", width: 1, icon: "left" },
    { id: "updown", label: "▲▼", code: "ArrowUp", width: 1 },
    { id: "right", label: "▶", code: "ArrowRight", width: 1, icon: "right" },
  ],
];

// ═══════════════════════════════════════════════════════
// SINGLE KEY COMPONENT
// ═══════════════════════════════════════════════════════

interface KeyProps {
  keyDef: KeyDef;
  variant: "mechanical" | "mac";
  isPressed: boolean;
  isCapsActive: boolean;
  isShiftActive: boolean;
  onPressStart: (code: string) => void;
  onPressEnd: (code: string) => void;
  unitSize: number;
  gap: number;
}

function Key({
  keyDef,
  variant,
  isPressed,
  isCapsActive,
  isShiftActive,
  onPressStart,
  onPressEnd,
  unitSize,
  gap,
}: KeyProps) {
  const width =
    (keyDef.width || 1) * unitSize + ((keyDef.width || 1) - 1) * gap;
  const isModifier = [
    "CapsLock",
    "ShiftLeft",
    "ShiftRight",
    "ControlLeft",
    "ControlRight",
    "AltLeft",
    "AltRight",
    "MetaLeft",
    "MetaRight",
    "Fn",
  ].includes(keyDef.code);
  const isCapsKey = keyDef.code === "CapsLock";
  const isShiftKey =
    keyDef.code === "ShiftLeft" || keyDef.code === "ShiftRight";
  const isSpaceKey = keyDef.code === "Space";
  const isLetterKey = keyDef.code.startsWith("Key");
  const isArrowGroup = keyDef.id === "updown";

  // Decide displayed label
  let displayLabel = keyDef.label;
  if (isShiftActive && keyDef.shiftLabel) {
    displayLabel = keyDef.shiftLabel;
  } else if (isLetterKey) {
    displayLabel =
      isCapsActive !== isShiftActive
        ? keyDef.label.toUpperCase()
        : keyDef.label.toLowerCase();
  }

  // Capslock indicator
  const capsActive = isCapsKey && isCapsActive;
  // Shift hold indicator
  const shiftHeld = isShiftKey && isShiftActive;

  if (variant === "mechanical") {
    return (
      <motion.button
        onPointerDown={() => onPressStart(keyDef.code)}
        onPointerUp={() => onPressEnd(keyDef.code)}
        onPointerLeave={() => {
          if (isPressed) onPressEnd(keyDef.code);
        }}
        animate={{
          y: isPressed ? 3 : 0,
          scale: isPressed ? 0.97 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 20,
          mass: 0.3,
        }}
        style={{ width, height: isSpaceKey ? unitSize * 0.95 : unitSize }}
        className={cn(
          "relative rounded-[6px] flex items-center justify-center select-none touch-manipulation outline-none",
          "transition-colors duration-75",
          // Base styles
          "bg-gradient-to-b border",
          isPressed
            ? "from-zinc-700 to-zinc-800 border-zinc-900 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
            : "from-zinc-600 to-zinc-700 border-zinc-800 shadow-[0_3px_0_0_#27272a,0_3px_6px_rgba(0,0,0,0.4)]",
          capsActive && "ring-1 ring-emerald-400/60",
          shiftHeld && "ring-1 ring-sky-400/50",
        )}
      >
        {/* Keycap top surface shine */}
        <div
          className={cn(
            "absolute inset-[1px] rounded-[5px] pointer-events-none",
            isPressed
              ? "bg-gradient-to-b from-white/[0.02] to-transparent"
              : "bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent",
          )}
        />

        {/* Keycap label */}
        <span
          className={cn(
            "relative z-10 font-mono leading-none select-none",
            isModifier || isSpaceKey
              ? "text-[8px] tracking-wider text-zinc-400"
              : "text-[11px] font-medium text-zinc-200",
            isPressed && "text-zinc-400",
          )}
        >
          {isArrowGroup ? (
            <span className="flex flex-col items-center gap-0 text-[7px] leading-tight text-zinc-400">
              <span>▲</span>
              <span>▼</span>
            </span>
          ) : (
            displayLabel
          )}
        </span>

        {/* Capslock LED */}
        {isCapsKey && (
          <div
            className={cn(
              "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full transition-all duration-200",
              capsActive
                ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                : "bg-zinc-800 border border-zinc-700",
            )}
          />
        )}
      </motion.button>
    );
  }

  // ─── Mac variant ───
  return (
    <motion.button
      onPointerDown={() => onPressStart(keyDef.code)}
      onPointerUp={() => onPressEnd(keyDef.code)}
      onPointerLeave={() => {
        if (isPressed) onPressEnd(keyDef.code);
      }}
      animate={{
        y: isPressed ? 1.5 : 0,
        scale: isPressed ? 0.98 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 1000,
        damping: 30,
        mass: 0.2,
      }}
      style={{
        width,
        height: isSpaceKey
          ? unitSize * 0.9
          : isArrowGroup
            ? unitSize
            : unitSize,
      }}
      className={cn(
        "relative flex items-center justify-center select-none touch-manipulation outline-none",
        isSpaceKey ? "rounded-[7px]" : "rounded-[5px]",
        "transition-colors duration-50",
        isPressed
          ? "bg-zinc-300 dark:bg-zinc-600 shadow-[0_0.5px_0_0_rgba(0,0,0,0.1)]"
          : "bg-zinc-100 dark:bg-zinc-700 shadow-[0_1px_0_0.5px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)]",
        "border border-zinc-200/60 dark:border-zinc-600/60",
        capsActive && "ring-1 ring-emerald-500/50",
        shiftHeld && "ring-1 ring-blue-500/40",
      )}
    >
      {/* Subtle gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          isSpaceKey ? "rounded-[7px]" : "rounded-[5px]",
          isPressed
            ? "bg-gradient-to-b from-transparent to-transparent"
            : "bg-gradient-to-b from-white/40 dark:from-white/[0.04] to-transparent",
        )}
      />

      {/* Label */}
      {isArrowGroup ? (
        <span className="relative z-10 flex flex-col items-center text-zinc-500 dark:text-zinc-400 leading-none">
          <span className="text-[7px]">▲</span>
          <span className="text-[7px]">▼</span>
        </span>
      ) : (
        <span
          className={cn(
            "relative z-10 leading-none select-none",
            isModifier || isSpaceKey
              ? "text-[7px] tracking-wide text-zinc-400 dark:text-zinc-500 font-medium"
              : "text-[11px] font-medium text-zinc-700 dark:text-zinc-300",
            isPressed && "opacity-70",
          )}
        >
          {/* Mac uses SF-style symbols for modifiers */}
          {keyDef.icon === "cmd" ? (
            "⌘"
          ) : keyDef.icon === "opt" ? (
            "⌥"
          ) : keyDef.icon === "ctrl" ? (
            "⌃"
          ) : keyDef.icon === "globe" ? (
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3 opacity-60"
            >
              <path
                d="M8 0a8 8 0 110 16A8 8 0 018 0zm0 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM4.5 8a3.5 3.5 0 017 0h-1.25a2.25 2.25 0 00-4.5 0H4.5zm1.75 0a1.75 1.75 0 013.5 0H6.25zM8 3v1.5M8 11.5V13M3 8h1.5M11.5 8H13"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
              />
              <circle
                cx="8"
                cy="8"
                r="5.5"
                stroke="currentColor"
                strokeWidth="0.8"
                fill="none"
              />
              <line
                x1="2.5"
                y1="8"
                x2="13.5"
                y2="8"
                stroke="currentColor"
                strokeWidth="0.6"
              />
              <line
                x1="8"
                y1="2.5"
                x2="8"
                y2="13.5"
                stroke="currentColor"
                strokeWidth="0.6"
              />
              <ellipse
                cx="8"
                cy="8"
                rx="2.8"
                ry="5.5"
                stroke="currentColor"
                strokeWidth="0.6"
                fill="none"
              />
            </svg>
          ) : keyDef.icon === "shift" ? (
            "⇧"
          ) : keyDef.icon === "backspace" ? (
            "⌫"
          ) : keyDef.icon === "enter" ? (
            "⏎"
          ) : keyDef.icon === "tab" ? (
            "⇥"
          ) : (
            displayLabel
          )}
        </span>
      )}

      {/* Capslock LED (Mac style - on the key surface) */}
      {isCapsKey && (
        <div
          className={cn(
            "absolute top-1 left-2 w-1 h-1 rounded-full transition-all duration-200",
            capsActive
              ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)]"
              : "bg-zinc-300 dark:bg-zinc-600",
          )}
        />
      )}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════
// KEYBOARD COMPONENT
// ═══════════════════════════════════════════════════════

interface KeyboardProps {
  variant?: "mechanical" | "mac";
  className?: string;
  soundEnabled?: boolean;
  onKeyPress?: (key: string) => void;
}

export function Keyboard({
  variant = "mechanical",
  className,
  soundEnabled = true,
  onKeyPress,
}: KeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [capsLock, setCapsLock] = useState(false);
  const [shiftActive, setShiftActive] = useState(false);
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const [typedText, setTypedText] = useState("");
  const soundEngine = useRef<KeySoundEngine | null>(null);

  // Initialize sound engine lazily
  const getSound = useCallback(() => {
    if (!soundEngine.current) {
      soundEngine.current = new KeySoundEngine();
    }
    return soundEngine.current;
  }, []);

  const rows = variant === "mechanical" ? MECHANICAL_ROWS : MAC_ROWS;
  const unitSize = variant === "mechanical" ? 40 : 36;
  const gapSize = variant === "mechanical" ? 4 : 3;

  // Handle physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const code = e.code;
      if (pressedKeys.has(code)) return;

      setPressedKeys((prev) => new Set(prev).add(code));

      if (code === "CapsLock") {
        setCapsLock((prev) => !prev);
      }
      if (code === "ShiftLeft" || code === "ShiftRight") {
        setShiftActive(true);
      }

      if (soundOn) {
        if (code === "Space") {
          getSound().playSpace(variant);
        } else {
          getSound().playKeyDown(1800 + Math.random() * 600, variant);
        }
      }

      // Build typed text for the mini display
      handleTyping(code, true);

      onKeyPress?.(code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      const code = e.code;
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });

      if (code === "ShiftLeft" || code === "ShiftRight") {
        setShiftActive(false);
      }

      if (soundOn) {
        getSound().playKeyUp(variant);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    pressedKeys,
    soundOn,
    variant,
    capsLock,
    shiftActive,
    getSound,
    onKeyPress,
  ]);

  // Typing logic
  const handleTyping = useCallback(
    (code: string, fromKeyboard: boolean) => {
      setTypedText((prev) => {
        if (code === "Backspace") return prev.slice(0, -1);
        if (code === "Space") return prev + " ";
        if (code === "Enter") return prev + "\n";
        if (code === "Tab") return prev + "  ";

        // Letter keys
        if (code.startsWith("Key")) {
          const letter = code.replace("Key", "");
          const isUpper = capsLock !== shiftActive;
          return prev + (isUpper ? letter.toUpperCase() : letter.toLowerCase());
        }

        // Number/symbol keys
        const numMap: Record<string, [string, string]> = {
          Digit1: ["1", "!"],
          Digit2: ["2", "@"],
          Digit3: ["3", "#"],
          Digit4: ["4", "$"],
          Digit5: ["5", "%"],
          Digit6: ["6", "^"],
          Digit7: ["7", "&"],
          Digit8: ["8", "*"],
          Digit9: ["9", "("],
          Digit0: ["0", ")"],
          Minus: ["-", "_"],
          Equal: ["=", "+"],
          BracketLeft: ["[", "{"],
          BracketRight: ["]", "}"],
          Backslash: ["\\", "|"],
          Semicolon: [";", ":"],
          Quote: ["'", '"'],
          Comma: [",", "<"],
          Period: [".", ">"],
          Slash: ["/", "?"],
          Backquote: ["`", "~"],
        };
        if (numMap[code]) {
          return prev + (shiftActive ? numMap[code][1] : numMap[code][0]);
        }

        return prev;
      });
    },
    [capsLock, shiftActive],
  );

  // Virtual key press/release
  const handleVirtualPressStart = useCallback(
    (code: string) => {
      setPressedKeys((prev) => new Set(prev).add(code));

      if (code === "CapsLock") {
        setCapsLock((prev) => !prev);
      }
      if (code === "ShiftLeft" || code === "ShiftRight") {
        setShiftActive(true);
      }

      if (soundOn) {
        if (code === "Space") {
          getSound().playSpace(variant);
        } else {
          getSound().playKeyDown(1800 + Math.random() * 600, variant);
        }
      }

      handleTyping(code, false);
      onKeyPress?.(code);
    },
    [soundOn, variant, getSound, handleTyping, onKeyPress],
  );

  const handleVirtualPressEnd = useCallback(
    (code: string) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });

      if (code === "ShiftLeft" || code === "ShiftRight") {
        setShiftActive(false);
      }

      if (soundOn) {
        getSound().playKeyUp(variant);
      }
    },
    [soundOn, variant, getSound],
  );

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* ─── Text Display ─── */}
      <div
        className={cn(
          "w-full max-w-xl rounded-xl border px-4 py-3 min-h-[56px] font-mono text-sm leading-relaxed relative overflow-hidden",
          variant === "mechanical"
            ? "bg-zinc-900 border-zinc-700 text-emerald-400"
            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200",
        )}
      >
        {/* Scanline effect for mechanical */}
        {variant === "mechanical" && (
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.05)_2px,rgba(0,0,0,0.05)_4px)]" />
        )}
        <div className="relative z-10 min-h-[24px] whitespace-pre-wrap break-all">
          {typedText || (
            <span
              className={cn(
                "opacity-40",
                variant === "mechanical" ? "text-emerald-600" : "text-zinc-400",
              )}
            >
              {variant === "mechanical"
                ? "> type something..."
                : "Type something..."}
            </span>
          )}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className={cn(
              "inline-block w-[2px] h-4 ml-0.5 align-text-bottom",
              variant === "mechanical"
                ? "bg-emerald-400"
                : "bg-zinc-800 dark:bg-zinc-200",
            )}
          />
        </div>
      </div>

      {/* ─── Keyboard Body ─── */}
      <div
        className={cn(
          "relative p-3 sm:p-4 rounded-xl",
          variant === "mechanical"
            ? "bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/60 shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]"
            : "bg-zinc-200 dark:bg-zinc-800 border border-zinc-300/60 dark:border-zinc-700/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        )}
      >
        {/* Subtle aluminum texture for Mac */}
        {variant === "mac" && (
          <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-b from-white/30 dark:from-white/[0.02] to-transparent" />
        )}

        {/* Key rows */}
        <div className="relative z-10 flex flex-col" style={{ gap: gapSize }}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex" style={{ gap: gapSize }}>
              {row.map((keyDef) => (
                <Key
                  key={keyDef.id}
                  keyDef={keyDef}
                  variant={variant}
                  isPressed={pressedKeys.has(keyDef.code)}
                  isCapsActive={capsLock}
                  isShiftActive={shiftActive}
                  onPressStart={handleVirtualPressStart}
                  onPressEnd={handleVirtualPressEnd}
                  unitSize={unitSize}
                  gap={gapSize}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Controls ─── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSoundOn((p) => !p)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all border",
            soundOn
              ? variant === "mechanical"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted",
          )}
        >
          {soundOn ? (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" />
              <path d="M12.54 5.46a.75.75 0 011.06 0 7 7 0 010 9.9.75.75 0 01-1.06-1.061 5.5 5.5 0 000-7.778.75.75 0 010-1.06z" />
              <path d="M14.95 3.05a.75.75 0 011.06 0 11 11 0 010 15.56.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.44.75.75 0 010-1.06z" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" />
              <path
                fillRule="evenodd"
                d="M13.28 7.22a.75.75 0 10-1.06 1.06L13.94 10l-1.72 1.72a.75.75 0 101.06 1.06L15 11.06l1.72 1.72a.75.75 0 101.06-1.06L16.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L15 8.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
          )}
          Sound {soundOn ? "ON" : "OFF"}
        </button>

        <button
          onClick={() => setTypedText("")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted transition-all"
        >
          Clear
        </button>

        {/* Status indicators */}
        <div className="flex items-center gap-2 ml-2">
          <div
            className={cn(
              "flex items-center gap-1 text-[9px] font-mono tracking-wider transition-colors",
              capsLock
                ? variant === "mechanical"
                  ? "text-emerald-400"
                  : "text-blue-500"
                : "text-muted-foreground/40",
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                capsLock
                  ? variant === "mechanical"
                    ? "bg-emerald-400"
                    : "bg-blue-500"
                  : "bg-muted-foreground/20",
              )}
            />
            CAPS
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAC KEYBOARD WRAPPER (convenience)
// ═══════════════════════════════════════════════════════

export function MacKeyboard({
  className,
  soundEnabled = true,
  onKeyPress,
}: Omit<KeyboardProps, "variant">) {
  return (
    <Keyboard
      variant="mac"
      className={className}
      soundEnabled={soundEnabled}
      onKeyPress={onKeyPress}
    />
  );
}
