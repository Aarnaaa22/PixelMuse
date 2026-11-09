import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class DiamondsRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'diamonds';

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

      // Diamond half-dimensions scale with luminance & coverage
      const maxHalfW = (width / 2) * coverageFactor;
      const maxHalfH = (height / 2) * coverageFactor;
      const halfW = Math.max(1, luminance * maxHalfW);
      const halfH = Math.max(1, luminance * maxHalfH);

      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy - halfH);      // Top
      ctx.lineTo(cx + halfW, cy);      // Right
      ctx.lineTo(cx, cy + halfH);      // Bottom
      ctx.lineTo(cx - halfW, cy);      // Left
      ctx.closePath();
      ctx.fill();

      // Edge emphasis border
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

