import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';

export class DotsRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'dots';

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
      let { r, g, b, luminance, edge, x, y, width, height } = cell;

      if (invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      // Dot maximum radius based on cell size
      const maxRadius = (Math.min(width, height) / 2) * coverageFactor;
      // Dot radius scales with cell brightness/luminance
      const radius = Math.max(0.5, luminance * maxRadius);

      const color = quantizer.quantizePixel({ r, g, b }, palette.colors);
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Edge emphasis halo
      if (edgeEmphasis > 0 && edge > 0.18) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(maxRadius, radius + 1), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

