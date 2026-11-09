import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class HatchRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'hatch';

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
    ctx.lineCap = 'round';

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
      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

      // Box bounds with coverage
      const w = width * coverageFactor;
      const h = height * coverageFactor;
      const ox = x + (width - w) / 2;
      const oy = y + (height - h) / 2;

      // Stroke weight scales with luminance
      const strokeW = Math.max(1, Math.round(width * 0.15 * Math.max(0.3, luminance)));
      ctx.lineWidth = strokeW;

      ctx.beginPath();

      // Tiered cross-hatch levels:
      // Level 1 (luminance > 0.15): Primary diagonal /
      if (luminance > 0.15) {
        ctx.moveTo(ox, oy + h);
        ctx.lineTo(ox + w, oy);
      }

      // Level 2 (luminance > 0.45): Secondary diagonal \
      if (luminance > 0.45) {
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + w, oy + h);
      }

      // Level 3 (luminance > 0.75): Horizontal crossbar -
      if (luminance > 0.75) {
        ctx.moveTo(ox, oy + h / 2);
        ctx.lineTo(ox + w, oy + h / 2);
      }

      // Level 4 (luminance > 0.9): Vertical crossbar |
      if (luminance > 0.9) {
        ctx.moveTo(ox + w / 2, oy);
        ctx.lineTo(ox + w / 2, oy + h);
      }

      ctx.stroke();

      // Edge emphasis
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(ox, oy, w, h);
      }
    }

    ctx.restore();
  }
}
