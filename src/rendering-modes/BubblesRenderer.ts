import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class BubblesRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'bubbles';

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

      const maxRadius = (Math.min(width, height) / 2) * coverageFactor;
      const radius = Math.max(1, maxRadius * (0.25 + 0.75 * luminance));

      // 1. Semi-translucent body
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.35 + 0.55 * luminance})`;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Gloss rim stroke
      ctx.strokeStyle = `rgba(${Math.min(255, color.r + 50)}, ${Math.min(255, color.g + 50)}, ${Math.min(255, color.b + 50)}, 0.8)`;
      ctx.lineWidth = Math.max(0.75, radius * 0.12);
      ctx.stroke();

      // 3. Specular highlight reflection (upper-left arc / dot)
      if (radius > 3) {
        const specX = cx - radius * 0.35;
        const specY = cy - radius * 0.35;
        const specR = Math.max(0.8, radius * 0.22);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(specX, specY, specR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Edge emphasis
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

