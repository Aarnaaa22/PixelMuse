import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class DiagonalLinesRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'diagonal-lines';

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
    ctx.lineCap = 'butt';

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

      // Line thickness scales with luminance and coverage
      const maxThickness = Math.min(width, height) * 0.9 * coverageFactor;
      const thickness = Math.max(0.75, luminance * maxThickness);
      ctx.lineWidth = thickness;

      // Draw 45-degree diagonal line across cell
      ctx.beginPath();
      ctx.moveTo(x, y + height);
      ctx.lineTo(x + width, y);
      ctx.stroke();

      // Additional parallel accent line if high luminance and sufficiently large cell
      if (luminance > 0.65 && width > 12) {
        ctx.lineWidth = Math.max(0.5, thickness * 0.35);
        ctx.beginPath();
        ctx.moveTo(x + width * 0.5, y + height);
        ctx.lineTo(x + width, y + height * 0.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y + height * 0.5);
        ctx.lineTo(x + width * 0.5, y);
        ctx.stroke();
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

