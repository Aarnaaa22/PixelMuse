import { create } from 'zustand';
import { AnimationMotionConfig } from '../types';

export interface MotionPreset {
  id: string;
  name: string;
  description: string;
  config: AnimationMotionConfig;
}

export const MOTION_PRESETS: MotionPreset[] = [
  {
    id: 'scanline-drift',
    name: 'Cathode Scanline Drift',
    description: 'Horizontal luminous phosphor pulse sweeping vertically',
    config: {
      isPlaying: true,
      speed: 1.2,
      loop: true,
      type: 'scanline',
      intensity: 0.8,
      frequency: 1,
    },
  },
  {
    id: 'harmonic-sine',
    name: 'Harmonic Sine Displacement',
    description: 'Fluid wave perturbation rippling across rows',
    config: {
      isPlaying: true,
      speed: 0.8,
      loop: true,
      type: 'sine-wave',
      intensity: 0.6,
      frequency: 2.5,
    },
  },
  {
    id: 'digital-glitch',
    name: 'Signal Rupture Glitch',
    description: 'Sporadic horizontal scanline jumps with high tension',
    config: {
      isPlaying: true,
      speed: 1.5,
      loop: true,
      type: 'glitch',
      intensity: 0.7,
      frequency: 1,
    },
  },
  {
    id: 'matrix-cascade',
    name: 'Matrix Glyph Cascade',
    description: 'Vertical falling column offset simulation',
    config: {
      isPlaying: true,
      speed: 1.0,
      loop: true,
      type: 'matrix-rain',
      intensity: 0.5,
      frequency: 1.2,
    },
  },
];

interface MotionState {
  presets: MotionPreset[];
  activeMotionPresetId: string | null;
  setActivePreset: (id: string) => void;
}

export const useMotionStore = create<MotionState>((set) => ({
  presets: MOTION_PRESETS,
  activeMotionPresetId: 'scanline-drift',
  setActivePreset: (activeMotionPresetId) => set({ activeMotionPresetId }),
}));

