import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { clamp } from '../utilities';

export type ProceduralFieldVariant = 'tunnel' | 'wake' | 'shimmer' | 'dither-orb' | 'polar-flower';

/**
 * Independent, reusable Procedural Field & Animated Background rendering module.
 * - 'tunnel-raymarch': Vanishing-point concentric glowing ASCII tunnel loops
 * - 'particle-wake': Monospace character field reactive to cursor movement and motion trail
 * - 'shimmer-bg': Ambient shimmering field of technical glyphs with breathing pulses
 * - 'dither-orb': Volumetric blue-noise oscillating sphere
 * - 'polar-flower': Polar coordinate rose curve r = cos(k*theta) modulated by brightness
 */
export class ProceduralFieldRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'tunnel-raymarch';
  private variant: ProceduralFieldVariant = 'tunnel';

  constructor(variant: ProceduralFieldVariant = 'tunnel') {
    super();
    this.variant = variant;
  }

  setVariant(variant: ProceduralFieldVariant): void {
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
    const tintHex = color.tintColor || '#CCFF00';

    ctx.save();
    ctx.font = `${Math.max(8, renderParams.cellSize)}px ${ascii.fontFamily || '"JetBrains Mono", monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    switch (this.variant) {
      case 'wake':
        this.renderWake(ctx, source, width, height, t, tintHex);
        break;
      case 'shimmer':
        this.renderShimmer(ctx, source, width, height, t, tintHex);
        break;
      case 'dither-orb':
        this.renderDitherOrb(ctx, width, height, t, tintHex);
        break;
      case 'polar-flower':
        this.renderPolarFlower(ctx, width, height, t, tintHex);
        break;
      case 'tunnel':
      default:
        this.renderTunnel(ctx, width, height, t, tintHex);
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

  // 1. Vanishing-point Tunnel Raymarch
  private renderTunnel(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, tint: string) {
    const cx = w / 2;
    const cy = h / 2;
    const ringCount = 14;
    const glyphs = '01#*+:=~-';

    for (let r = 0; r < ringCount; r++) {
      const progress = ((r / ringCount + t * 0.4) % 1);
      const radius = progress * (w * 0.65);
      if (radius < 5) continue;

      const alpha = Math.min(progress * 1.5, 1 - progress * 0.7);
      ctx.fillStyle = tint;
      ctx.globalAlpha = alpha;

      const numPoints = Math.max(8, Math.floor(progress * 38));
      for (let p = 0; p < numPoints; p++) {
        const angle = (p / numPoints) * Math.PI * 2 + t * 0.5;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        const char = glyphs[(r + p) % glyphs.length];
        ctx.fillText(char, px, py);
      }
    }
  }

  // 2. Interactive Monospace Particle Wake
  private renderWake(ctx: CanvasRenderingContext2D, source: ImageData, w: number, h: number, t: number, tint: string) {
    const cols = 26;
    const rows = 18;
    const cellW = w / cols;
    const cellH = h / rows;
    const mx = (Math.sin(t * 1.5) * 0.35 + 0.5) * w;
    const my = (Math.cos(t * 1.2) * 0.35 + 0.5) * h;
    const chars = '.:*+=#%@';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * cellW + cellW / 2;
        const py = r * cellH + cellH / 2;
        const dist = Math.hypot(px - mx, py - my);
        const luma = this.sampleLuma(source, px, py);
        const influence = Math.max(0, 1 - dist / (w * 0.38));
        const pulse = (Math.sin(c * 0.3 + r * 0.2 + t * 2) + 1) * 0.15;
        const brightness = Math.min(1, influence * 1.3 + pulse * (0.5 + luma * 0.8));

        if (brightness > 0.08) {
          const charIdx = Math.floor(brightness * (chars.length - 1));
          ctx.fillStyle = influence > 0.4 ? '#CCFF00' : tint;
          ctx.globalAlpha = Math.max(0.2, brightness);
          ctx.fillText(chars[charIdx] || '.', px, py);
        }
      }
    }
  }

  // 3. Shimmer Background
  private renderShimmer(ctx: CanvasRenderingContext2D, source: ImageData, w: number, h: number, t: number, tint: string) {
    const step = 16;
    const chars = ' .:-=+*#';
    for (let y = step / 2; y < h; y += step) {
      for (let x = step / 2; x < w; x += step) {
        const imgLuma = this.sampleLuma(source, x, y);
        const pulse = Math.sin((x * 0.05 + y * 0.05) + t * 2);
        const luma = ((pulse + 1) / 2) * (0.3 + imgLuma * 0.7);
        const charIdx = Math.floor(luma * (chars.length - 1));
        ctx.fillStyle = tint;
        ctx.globalAlpha = 0.2 + luma * 0.7;
        ctx.fillText(chars[charIdx] || '.', x, y);
      }
    }
  }

  // 4. Volumetric Dither Orb
  private renderDitherOrb(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, tint: string) {
    const cx = w / 2;
    const cy = h / 2;
    const baseR = Math.min(w, h) * 0.32;
    const pulse = Math.sin(t * 3) * (baseR * 0.08);
    const r = baseR + pulse;

    const step = 11;
    for (let y = cy - r; y <= cy + r; y += step) {
      for (let x = cx - r; x <= cx + r; x += step) {
        const dist = Math.hypot(x - cx, y - cy);
        if (dist <= r) {
          const normDist = dist / r;
          const shade = 1 - normDist;
          const noise = ((x * 12.9898 + y * 78.233) % 1) > (1 - shade);
          if (noise) {
            ctx.fillStyle = shade > 0.5 ? '#CCFF00' : tint;
            ctx.globalAlpha = Math.max(0.3, shade);
            ctx.fillText(shade > 0.7 ? '#' : '.', x, y);
          }
        }
      }
    }
  }

  // 5. Polar Flower Curves
  private renderPolarFlower(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, tint: string) {
    const cx = w / 2;
    const cy = h / 2;
    const k = 6;
    const maxR = Math.min(w, h) * 0.38;
    const rot = t * 0.5;

    for (let theta = 0; theta < Math.PI * 2; theta += 0.08) {
      const r = Math.cos(k * theta) * maxR;
      const angle = theta + rot;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const alpha = Math.abs(r / maxR);

      ctx.fillStyle = tint;
      ctx.globalAlpha = Math.max(0.2, alpha);
      ctx.fillText('*', x, y);
    }
  }
}
