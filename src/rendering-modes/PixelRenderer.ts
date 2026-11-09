import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';

export class PixelRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'pixel';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { renderParams, palette } = config;
    const { cellSize, density, invert, edgeEmphasis, coverage } = renderParams;

    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const coverageFactor = Math.max(0.1, Math.min(1.0, coverage / 100));

    ctx.save();

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      let { r, g, b, edge, x, y, width, height } = cell;

      if (invert) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      const color = quantizer.quantizePixel({ r, g, b }, palette.colors);

      const drawW = width * coverageFactor;
      const drawH = height * coverageFactor;
      const drawX = x + (width - drawW) / 2;
      const drawY = y + (height - drawH) / 2;

      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(drawX, drawY, drawW, drawH);

      // Edge emphasis line
      if (edgeEmphasis > 0 && edge > 0.2) {
        ctx.fillStyle = `rgba(255, 255, 255, ${edge * (edgeEmphasis / 100)})`;
        ctx.fillRect(drawX, drawY, drawW, Math.max(1, drawH * 0.15));
      }
    }

    ctx.restore();
  }
}
