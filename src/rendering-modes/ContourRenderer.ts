import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class ContourRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'contour';

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

      const maxR = (Math.min(width, height) / 2) * coverageFactor;
      // Number of nested contour lines (1 to 4) proportional to luminance
      const rings = Math.max(1, Math.ceil(luminance * 4));

      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.lineWidth = Math.max(1, Math.round(width * 0.08));

      for (let ring = 1; ring <= rings; ring++) {
        const ringR = (ring / rings) * maxR;
        ctx.beginPath();
        // Slightly organic oval distortion based on edge
        const radiusX = ringR * (1 + edge * 0.2);
        const radiusY = ringR * (1 - edge * 0.2);
        ctx.ellipse(cx, cy, Math.max(0.5, radiusX), Math.max(0.5, radiusY), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Edge emphasis
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

