import { AnimationMotionConfig } from '../types';

export class MotionEcosystem {
  /**
   * Calculates a dynamic displacement or phase offset based on current animation time
   */
  static getOffset(
    x: number,
    y: number,
    time: number,
    config: AnimationMotionConfig
  ): { dx: number; dy: number; alphaMod: number } {
    if (!config.isPlaying || config.type === 'none') {
      return { dx: 0, dy: 0, alphaMod: 1 };
    }

    const { type, speed, intensity, frequency } = config;
    const t = time * speed;

    switch (type) {
      case 'sine-wave': {
        const wave = Math.sin(y * frequency * 0.05 + t * 3) * intensity * 8;
        return { dx: wave, dy: 0, alphaMod: 1 };
      }
      case 'scanline': {
        const linePos = (t * 80) % 600;
        const dist = Math.abs(y - linePos);
        const glow = dist < 24 ? (1 - dist / 24) * intensity : 0;
        return { dx: 0, dy: 0, alphaMod: 1 + glow * 0.8 };
      }
      case 'pulse': {
        const pulse = Math.sin(t * frequency * 2) * 0.5 + 0.5;
        return { dx: 0, dy: 0, alphaMod: 1 + (pulse - 0.5) * intensity };
      }
      case 'glitch': {
        const slice = Math.sin(Math.floor(y / 16) + Math.floor(t * 8));
        const jump = slice > 0.88 ? (Math.random() - 0.5) * intensity * 24 : 0;
        return { dx: jump, dy: 0, alphaMod: 1 };
      }
      case 'matrix-rain': {
        const rain = Math.sin(x * 0.1 + t * 4);
        return { dx: 0, dy: rain * intensity * 4, alphaMod: 1 };
      }
      default:
        return { dx: 0, dy: 0, alphaMod: 1 };
    }
  }
}

