import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class CrossesRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'crosses';

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
    ctx.lineCap = 'square';

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

      // Span and thickness scale with luminance and coverage
      const maxSpan = (Math.min(width, height) / 2) * coverageFactor;
      const span = Math.max(1, luminance * maxSpan);
      const thickness = Math.max(1, Math.round(span * 0.35));

      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.lineWidth = thickness;

      ctx.beginPath();
      // Horizontal bar
      ctx.moveTo(cx - span, cy);
      ctx.lineTo(cx + span, cy);
      // Vertical bar
      ctx.moveTo(cx, cy - span);
      ctx.lineTo(cx, cy + span);
      ctx.stroke();

      // Edge emphasis accent
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - span, cy - span, span * 2, span * 2);
      }
    }

    ctx.restore();
  }
}
