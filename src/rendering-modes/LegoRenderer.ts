import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class LegoRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'lego';

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

      const drawW = width * coverageFactor;
      const drawH = height * coverageFactor;
      const ox = x + (width - drawW) / 2;
      const oy = y + (height - drawH) / 2;
      const cx = ox + drawW / 2;
      const cy = oy + drawH / 2;

      // 1. Brick Base Rectangle
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(ox, oy, drawW, drawH);

      // 2. Subtle top/left bevel highlight and bottom/right shadow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fillRect(ox, oy, drawW, Math.max(1, drawH * 0.08));
      ctx.fillRect(ox, oy, Math.max(1, drawW * 0.08), drawH);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(ox, oy + drawH - Math.max(1, drawH * 0.08), drawW, Math.max(1, drawH * 0.08));
      ctx.fillRect(ox + drawW - Math.max(1, drawW * 0.08), oy, Math.max(1, drawW * 0.08), drawH);

      // 3. Raised Center Stud
      const studR = Math.max(1.5, Math.min(drawW, drawH) * 0.26);

      // Stud bottom shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.arc(cx, cy + studR * 0.2, studR, 0, Math.PI * 2);
      ctx.fill();

      // Stud body (matching quantized color)
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.beginPath();
      ctx.arc(cx, cy, studR, 0, Math.PI * 2);
      ctx.fill();

      // Stud top specular crescent / highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = Math.max(0.75, studR * 0.2);
      ctx.beginPath();
      ctx.arc(cx, cy, studR * 0.8, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Edge emphasis
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(ox, oy, drawW, drawH);
      }
    }

    ctx.restore();
  }
}
