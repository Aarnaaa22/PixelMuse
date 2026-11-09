import { AnimationMotionConfig, AnimationStyle } from '../types';

export interface MotionOffsetResult {
  dx: number;
  dy: number;
  scaleMod: number;
  alphaMod: number;
}

/**
 * PixelMuse Motion & Kinetic Waveform Ecosystem.
 * Computes deterministic, high-performance spatial displacement and luminance modulation
 * for every cell or pixel across 5 kinetic animation styles:
 * 1. Wave
 * 2. Pulse
 * 3. Shimmer
 * 4. Ripple
 * 5. Flicker
 */
export class MotionEcosystem {
  /**
   * Calculates dynamic displacement, scale factor, and alpha modulation
   * for coordinate (x, y) at time t.
   */
  static getOffset(
    x: number,
    y: number,
    time: number,
    config: AnimationMotionConfig,
    centerX = 300,
    centerY = 300
  ): MotionOffsetResult {
    const isAnimated = config.animated || config.isPlaying;
    if (!isAnimated) {
      return { dx: 0, dy: 0, scaleMod: 1, alphaMod: 1 };
    }

    const style: AnimationStyle = config.animStyle || config.type || 'wave';
    const speed = config.animSpeed ?? config.speed ?? 1;
    const intensity = config.animIntensity ?? config.intensity ?? 0.5;
    const freq = config.frequency ?? 1;

    const t = time * speed;

    switch (style) {
      case 'wave':
      case 'sine-wave': {
        // Continuous spatial sinusoidal undulating waves
        const waveY = Math.sin(y * freq * 0.04 + t * 3.5) * intensity * 10;
        const waveX = Math.cos(x * freq * 0.03 + t * 2.5) * intensity * 5;
        const alpha = 1 + Math.sin(y * 0.02 + t * 3) * 0.25 * intensity;
        return {
          dx: waveX,
          dy: waveY,
          scaleMod: 1,
          alphaMod: Math.max(0.1, alpha),
        };
      }

      case 'pulse': {
        // Rhythmic breathing expansion and luminance inflation
        const pulse = Math.sin(t * freq * Math.PI * 2) * 0.5 + 0.5;
        const scaleMod = 1 + (pulse - 0.5) * 0.5 * intensity;
        const alphaMod = 1 + (pulse - 0.5) * 0.4 * intensity;
        return {
          dx: 0,
          dy: 0,
          scaleMod: Math.max(0.2, scaleMod),
          alphaMod: Math.max(0.1, alphaMod),
        };
      }

      case 'shimmer': {
        // High-frequency faceted glint and specular micro-phase shimmer
        const shimmerPhase = Math.sin((x * 0.15) + (y * 0.12) + t * 7.5);
        const alphaMod = 0.75 + (shimmerPhase * 0.5 + 0.5) * 0.5 * intensity;
        const dx = Math.cos(shimmerPhase * Math.PI) * intensity * 2.5;
        return {
          dx,
          dy: 0,
          scaleMod: 1 + shimmerPhase * 0.15 * intensity,
          alphaMod: Math.max(0.1, alphaMod),
        };
      }

      case 'ripple': {
        // Concentric circular outward waves emanating from the center
        const distX = x - centerX;
        const distY = y - centerY;
        const dist = Math.hypot(distX, distY);
        const angle = Math.atan2(distY, distX);

        // Circular wave propagation
        const ripplePhase = Math.sin(dist * 0.06 * freq - t * 6);
        const displacement = ripplePhase * intensity * 8;
        const dx = Math.cos(angle) * displacement;
        const dy = Math.sin(angle) * displacement;
        const alphaMod = 1 + ripplePhase * 0.35 * intensity;

        return {
          dx,
          dy,
          scaleMod: 1 + ripplePhase * 0.2 * intensity,
          alphaMod: Math.max(0.1, alphaMod),
        };
      }

      case 'flicker': {
        // Stochastic cathode ray / neon tube micro-dropout and power surges
        const noise1 = Math.sin(t * 19.3);
        const noise2 = Math.cos(t * 37.7);
        const combined = noise1 * noise2;

        let alphaMod = 1;
        let dx = 0;

        if (combined > 0.4) {
          // Luminous flare
          alphaMod = 1 + (combined - 0.4) * 1.8 * intensity;
        } else if (combined < -0.5) {
          // Phosphor blackout glitch
          alphaMod = Math.max(0.15, 1 - intensity * 0.85);
          dx = (Math.sin(t * 99) > 0 ? 1 : -1) * intensity * 4;
        }

        return {
          dx,
          dy: 0,
          scaleMod: 1,
          alphaMod,
        };
      }

      // Legacy styles
      case 'scanline': {
        const linePos = (t * 120) % 800;
        const dist = Math.abs(y - linePos);
        const glow = dist < 32 ? (1 - dist / 32) * intensity : 0;
        return { dx: 0, dy: 0, scaleMod: 1, alphaMod: 1 + glow };
      }

      case 'glitch': {
        const slice = Math.sin(Math.floor(y / 18) + Math.floor(t * 12));
        const jump = slice > 0.85 ? (Math.sin(t * 50) > 0 ? 1 : -1) * intensity * 24 : 0;
        return { dx: jump, dy: 0, scaleMod: 1, alphaMod: 1 };
      }

      case 'matrix-rain': {
        const rain = Math.sin(x * 0.1 + t * 5);
        return { dx: 0, dy: rain * intensity * 6, scaleMod: 1, alphaMod: 1 };
      }

      default:
        return { dx: 0, dy: 0, scaleMod: 1, alphaMod: 1 };
    }
  }
}
