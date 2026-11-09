import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class TrianglesRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'triangles';

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
      let { r, g, b, luminance, edge, x, y, width, height, col, row } = cell;

      if (invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      const color = quantizer.quantizePixel({ r, g, b }, palette.colors);
      const cx = x + width / 2;
      const cy = y + height / 2;

      // Scale triangle dimensions by luminance and coverage
      const drawW = (width / 2) * coverageFactor * Math.max(0.2, luminance);
      const drawH = (height / 2) * coverageFactor * Math.max(0.2, luminance);

      // Alternating up/down pointing triangles
      const pointUp = (col + row) % 2 === 0;

      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.beginPath();
      if (pointUp) {
        ctx.moveTo(cx, cy - drawH);
        ctx.lineTo(cx + drawW, cy + drawH);
        ctx.lineTo(cx - drawW, cy + drawH);
      } else {
        ctx.moveTo(cx - drawW, cy - drawH);
        ctx.lineTo(cx + drawW, cy - drawH);
        ctx.lineTo(cx, cy + drawH);
      }
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
