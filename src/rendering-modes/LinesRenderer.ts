import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class LinesRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'lines';

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
      let { r, g, b, luminance, edge, x, y, width, height, col, row } = cell;

      if (invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      const color = quantizer.quantizePixel({ r, g, b }, palette.colors);
      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

      const maxThickness = Math.min(width, height) * coverageFactor;
      const thickness = Math.max(0.75, luminance * maxThickness);
      ctx.lineWidth = thickness;

      const cy = y + height / 2;
      const cx = x + width / 2;

      // Primary horizontal line
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x + width, cy);
      ctx.stroke();

      // Interlocking vertical line for dense areas or alternating cells
      if (luminance > 0.5 || (col + row) % 2 === 0) {
        ctx.lineWidth = Math.max(0.5, thickness * 0.6);
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.lineTo(cx, y + height);
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

