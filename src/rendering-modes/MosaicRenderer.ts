import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class MosaicRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'mosaic';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { renderParams, palette } = config;
    const { cellSize, coverage, density, invert, edgeEmphasis } = renderParams;

    // Step 1: Sample grid cells with true average color, luminance and Sobel edge magnitude
    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);

    // Coverage multiplier (10% to 100%)
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

      // Quantize to active studio palette if not original
      const targetColor = quantizer.quantizePixel({ r, g, b }, palette.colors);

      // Coverage scaling from cell center
      const drawWidth = width * coverageFactor;
      const drawHeight = height * coverageFactor;
      const offsetX = x + (width - drawWidth) / 2;
      const offsetY = y + (height - drawHeight) / 2;

      ctx.fillStyle = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;
      ctx.fillRect(offsetX, offsetY, drawWidth, drawHeight);

      // Edge emphasis stroke
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = Math.max(1, Math.round(drawWidth * 0.1));
        ctx.strokeRect(offsetX, offsetY, drawWidth, drawHeight);
      }
    }

    ctx.restore();
  }
}
