import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class HeartsRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'hearts';

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

      // Heart scale determined by cell size, luminance and coverage
      const baseSize = (Math.min(width, height) / 2) * coverageFactor;
      const size = Math.max(1, baseSize * (0.2 + 0.8 * luminance));

      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.beginPath();
      // Draw smooth parametric heart shape
      const topY = cy - size * 0.4;
      ctx.moveTo(cx, topY);
      // Top right cusp and curve
      ctx.bezierCurveTo(cx + size * 0.7, topY - size * 0.8, cx + size * 1.2, cy + size * 0.2, cx, cy + size * 0.9);
      // Top left cusp and curve
      ctx.bezierCurveTo(cx - size * 1.2, cy + size * 0.2, cx - size * 0.7, topY - size * 0.8, cx, topY);
      ctx.closePath();
      ctx.fill();

      // Edge emphasis
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

