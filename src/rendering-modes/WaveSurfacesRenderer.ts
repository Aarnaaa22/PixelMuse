import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { clamp } from '../utilities';

export type WaveVariant = 'sinusoidal' | 'schlieren' | 'reaction-diffusion';

/**
 * Independent, reusable Wave-Based Visual Effects rendering module.
 * - Sinusoidal multi-layer ribbon wave surfaces
 * - Optical density Schlieren supersonic shockwave bands
 * - Reaction-diffusion Gray-Scott wave propagation
 * - Wave displacement and contour amplitude modulated by image luminance
 */
export class WaveSurfacesRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'wave-surfaces';
  private variant: WaveVariant = 'sinusoidal';

  constructor(variant: WaveVariant = 'sinusoidal') {
    super();
    this.variant = variant;
  }

  setVariant(variant: WaveVariant): void {
    this.variant = variant;
  }

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void {
    const { width, height } = source;
    const { renderParams, ascii, motion, color } = config;
    const speed = motion.isPlaying ? (motion.speed || 1) : 0.8;
    const t = time * speed;
    const chars = renderParams.charSet || ascii.characters || '~-+=*#';

    ctx.save();
    ctx.font = `${Math.max(8, renderParams.cellSize)}px ${ascii.fontFamily || '"JetBrains Mono", monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tintHex = color.tintColor || '#9D4EDD';

    switch (this.variant) {
      case 'schlieren':
        this.renderSchlieren(ctx, source, width, height, t, chars, tintHex, renderParams.cellSize);
        break;
      case 'reaction-diffusion':
        this.renderReactionDiffusion(ctx, source, width, height, t, chars, tintHex, renderParams.cellSize);
        break;
      case 'sinusoidal':
      default:
        this.renderSinusoidal(ctx, source, width, height, t, chars, tintHex);
        break;
    }

    ctx.restore();
  }

  private sampleLuma(source: ImageData, x: number, y: number): number {
    const px = Math.floor(clamp(x, 0, source.width - 1));
    const py = Math.floor(clamp(y, 0, source.height - 1));
    const idx = (py * source.width + px) * 4;
    return (source.data[idx] * 0.299 + source.data[idx + 1] * 0.587 + source.data[idx + 2] * 0.114) / 255;
  }

  // 1. Sinusoidal Ribbon Waves (Violet ASCII Wave)
  private renderSinusoidal(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    w: number,
    h: number,
    t: number,
    chars: string,
    tint: string
  ) {
    const lines = 10;
    const step = 12;

    for (let l = 0; l < lines; l++) {
      const baseY = h * 0.15 + (l / lines) * (h * 0.7);
      const waveSpeed = 1.2 + l * 0.15;
      const freq = 0.015 + l * 0.004;
      const amp = 16 + l * 5;

      ctx.fillStyle = tint;

      for (let x = 8; x < w; x += step) {
        const luma = this.sampleLuma(source, x, baseY);
        // Image luminance modulates frequency and amplitude
        const y = baseY + Math.sin(x * freq + t * waveSpeed + luma * 4) * (amp * (1 + luma * 0.5));
        const charIdx = Math.floor(luma * (chars.length - 1));
        const alpha = Math.max(0.2, (0.3 + (l / lines) * 0.6) * (0.4 + luma * 0.8));

        ctx.globalAlpha = alpha;
        ctx.fillText(chars[charIdx] || '~', x, y);
      }
    }
  }

  // 2. Schlieren Supersonic Shockwaves
  private renderSchlieren(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    w: number,
    h: number,
    t: number,
    chars: string,
    tint: string,
    cellSize: number
  ) {
    const step = Math.max(8, cellSize);
    const cols = Math.floor(w / step);
    const rows = Math.floor(h / step);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * step + step / 2;
        const y = r * step + step / 2;
        const luma = this.sampleLuma(source, x, y);

        // Supersonic optical density gradient shockwave calculation
        const shock = Math.sin((x * 0.035 - t * 2.5) + Math.cos(y * 0.04 + t) + luma * 5);
        const val = Math.abs(shock);
        const charIdx = Math.min(chars.length - 1, Math.floor(val * chars.length));

        ctx.fillStyle = val > 0.65 ? '#CCFF00' : tint;
        ctx.globalAlpha = Math.max(0.25, val * (0.5 + luma * 0.8));
        ctx.fillText(chars[charIdx] || '.', x, y);
      }
    }
  }

  // 3. Reaction-Diffusion Waves (Gray-Scott simulation pattern)
  private renderReactionDiffusion(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    w: number,
    h: number,
    t: number,
    chars: string,
    tint: string,
    cellSize: number
  ) {
    const step = Math.max(9, cellSize);
    const cols = Math.floor(w / step);
    const rows = Math.floor(h / step);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * step + step / 2;
        const y = r * step + step / 2;
        const luma = this.sampleLuma(source, x, y);

        // Gray-Scott dual chemical diffusion wave combination
        const waveU = Math.sin(c * 0.35 + t * 1.4) * Math.cos(r * 0.35 - t);
        const waveV = Math.cos((c + r) * 0.28 + t * 0.9 + luma * 3);
        const comb = (waveU + waveV + 2) / 4;

        const charIdx = Math.min(chars.length - 1, Math.floor(comb * chars.length));
        ctx.fillStyle = comb > 0.6 ? '#CCFF00' : tint;
        ctx.globalAlpha = Math.max(0.3, comb * (0.4 + luma * 0.9));
        ctx.fillText(chars[charIdx] || '#', x, y);
      }
    }
  }
}
