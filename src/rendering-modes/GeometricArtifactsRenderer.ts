import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export type GeometricVariant = 'cruciform' | 'cross-stitch' | 'linocut-rings' | 'constellation' | 'dither-flicker';

/**
 * Independent, reusable Geometric Artifacts & Dither Hybrid rendering module.
 * - 'cruciform': Scaled intersection anchors and cruciform matrix glyphs (Recipe 25)
 * - 'cross-stitch': Dual-axis 45-degree diagonal interlocking thread cross stitches (Recipe 45)
 * - 'linocut-rings': Concentric woodblock print rings with variable stroke width (Recipe 42)
 * - 'constellation': Four-pointed star halftones with diamond ray apertures (Recipe 48)
 * - 'dither-flicker': High-frequency chromatic flicker layered on dithered cells (Recipe 16)
 */
export class GeometricArtifactsRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'cruciform';
  private variant: GeometricVariant = 'cruciform';

  constructor(variant: GeometricVariant = 'cruciform') {
    super();
    this.variant = variant;
  }

  setVariant(variant: GeometricVariant): void {
    this.variant = variant;
  }

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void {
    const { renderParams, palette, color, motion } = config;
    const { cellSize, density, invert, edgeEmphasis, coverage } = renderParams;

    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const cov = clamp((coverage || 100) / 100, 0.1, 1.0);
    const speed = motion.isPlaying ? (motion.speed || 1) : 1;
    const t = time * speed;

    ctx.save();

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      let { r, g, b, luminance, x, y, width, height } = cell;

      if (invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      const cx = x + width / 2;
      const cy = y + height / 2;
      const q = quantizer.quantizePixel({ r, g, b }, palette.colors);
      const strokeColor = color.tintOpacity > 0 ? color.tintColor : `rgb(${q.r}, ${q.g}, ${q.b})`;

      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;

      switch (this.variant) {
        case 'cruciform': {
          // Cruciform intersection anchors with thick intersection squares
          const span = Math.max(1, luminance * (width / 2) * cov);
          const thickness = Math.max(1, Math.round(span * 0.4));
          ctx.lineWidth = thickness;
          ctx.beginPath();
          ctx.moveTo(cx - span, cy);
          ctx.lineTo(cx + span, cy);
          ctx.moveTo(cx, cy - span);
          ctx.lineTo(cx, cy + span);
          ctx.stroke();

          // Anchor center box
          if (luminance > 0.4) {
            ctx.fillRect(cx - thickness, cy - thickness, thickness * 2, thickness * 2);
          }
          break;
        }

        case 'cross-stitch': {
          // 45-degree diagonal thread crosses
          const arm = Math.max(1, luminance * (width / 2) * cov);
          ctx.lineWidth = Math.max(1, Math.round(arm * 0.3));
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx - arm, cy - arm);
          ctx.lineTo(cx + arm, cy + arm);
          ctx.moveTo(cx + arm, cy - arm);
          ctx.lineTo(cx - arm, cy + arm);
          ctx.stroke();
          break;
        }

        case 'linocut-rings': {
          // Concentric woodblock print rings with variable stroke width
          const radius = Math.max(1, luminance * (width / 2) * cov);
          ctx.lineWidth = Math.max(1, Math.round((1 - luminance) * 3 + 1));
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case 'constellation': {
          // Four-pointed star halftones with diamond ray apertures
          const ray = Math.max(1, luminance * (width / 2) * cov);
          ctx.beginPath();
          ctx.moveTo(cx, cy - ray);
          ctx.lineTo(cx + ray * 0.25, cy - ray * 0.25);
          ctx.lineTo(cx + ray, cy);
          ctx.lineTo(cx + ray * 0.25, cy + ray * 0.25);
          ctx.lineTo(cx, cy + ray);
          ctx.lineTo(cx - ray * 0.25, cy + ray * 0.25);
          ctx.lineTo(cx - ray, cy);
          ctx.lineTo(cx - ray * 0.25, cy - ray * 0.25);
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'dither-flicker': {
          // Dither block with high-frequency chromatic flicker
          const flicker = Math.sin(t * 25 + i * 3) > 0.8;
          const size = Math.max(2, Math.round(width * luminance * cov));
          if (flicker) {
            ctx.fillStyle = '#CCFF00';
          }
          ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
          break;
        }
      }
    }

    ctx.restore();
  }
}
