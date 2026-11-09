import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class MixedPatternsRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'mixed-patterns';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { renderParams, palette } = config;
    const { cellSize, density, invert, edgeEmphasis, coverage } = renderParams;

    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const coverageFactor = clamp(coverage / 100, 0.1, 1.0);

    ctx.save();

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      let { r, g, b, luminance, edge, x, y, width, height } = cell;

      if (invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      const color = quantizer.quantizePixel({ r, g, b }, palette.colors);
      const cx = x + width / 2;
      const cy = y + height / 2;
      const maxR = (Math.min(width, height) / 2) * coverageFactor;

      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

      if (luminance < 0.2) {
        // Tier 1: Stipple micro-dot
        const dotR = Math.max(0.5, maxR * 0.25);
        ctx.beginPath();
        ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
        ctx.fill();
      } else if (luminance < 0.45) {
        // Tier 2: Diagonal slash
        ctx.lineWidth = Math.max(1, Math.round(width * 0.15));
        ctx.beginPath();
        ctx.moveTo(cx - maxR * 0.7, cy + maxR * 0.7);
        ctx.lineTo(cx + maxR * 0.7, cy - maxR * 0.7);
        ctx.stroke();
      } else if (luminance < 0.7) {
        // Tier 3: Geometric diamond
        ctx.lineWidth = Math.max(1, Math.round(width * 0.1));
        ctx.beginPath();
        ctx.moveTo(cx, cy - maxR);
        ctx.lineTo(cx + maxR, cy);
        ctx.lineTo(cx, cy + maxR);
        ctx.lineTo(cx - maxR, cy);
        ctx.closePath();
        ctx.stroke();
      } else if (luminance < 0.9) {
        // Tier 4: Cross grid
        ctx.lineWidth = Math.max(1, Math.round(width * 0.15));
        ctx.beginPath();
        ctx.moveTo(cx - maxR, cy);
        ctx.lineTo(cx + maxR, cy);
        ctx.moveTo(cx, cy - maxR);
        ctx.lineTo(cx, cy + maxR);
        ctx.stroke();
      } else {
        // Tier 5: Concentric double ring + center core
        ctx.lineWidth = Math.max(1, Math.round(width * 0.1));
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Edge emphasis
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
      }
    }

    ctx.restore();
  }
}

