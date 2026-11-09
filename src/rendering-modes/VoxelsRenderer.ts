import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class VoxelsRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'voxels';

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

      const baseColor = quantizer.quantizePixel({ r, g, b }, palette.colors);
      const cx = x + width / 2;
      const cy = y + height / 2;

      const blockW = width * 0.48 * coverageFactor;
      const blockH = height * 0.28 * coverageFactor;
      // Extrusion height scales with luminance
      const extrusion = Math.max(2, Math.round(height * 0.5 * luminance));

      // 3 Face Shading:
      // Top face (highlight)
      const topR = Math.min(255, Math.round(baseColor.r * 1.25));
      const topG = Math.min(255, Math.round(baseColor.g * 1.25));
      const topB = Math.min(255, Math.round(baseColor.b * 1.25));

      // Left face (ambient)
      const leftR = Math.round(baseColor.r * 0.85);
      const leftG = Math.round(baseColor.g * 0.85);
      const leftB = Math.round(baseColor.b * 0.85);

      // Right face (shadow)
      const rightR = Math.round(baseColor.r * 0.6);
      const rightG = Math.round(baseColor.g * 0.6);
      const rightB = Math.round(baseColor.b * 0.6);

      const topY = cy - extrusion;

      // 1. Left Face (from cx - blockW to cx, and down extrusion)
      ctx.fillStyle = `rgb(${leftR}, ${leftG}, ${leftB})`;
      ctx.beginPath();
      ctx.moveTo(cx - blockW, topY);
      ctx.lineTo(cx, topY + blockH);
      ctx.lineTo(cx, topY + blockH + extrusion);
      ctx.lineTo(cx - blockW, topY + extrusion);
      ctx.closePath();
      ctx.fill();

      // 2. Right Face (from cx to cx + blockW, and down extrusion)
      ctx.fillStyle = `rgb(${rightR}, ${rightG}, ${rightB})`;
      ctx.beginPath();
      ctx.moveTo(cx, topY + blockH);
      ctx.lineTo(cx + blockW, topY);
      ctx.lineTo(cx + blockW, topY + extrusion);
      ctx.lineTo(cx, topY + blockH + extrusion);
      ctx.closePath();
      ctx.fill();

      // 3. Top Face (isometric diamond)
      ctx.fillStyle = `rgb(${topR}, ${topG}, ${topB})`;
      ctx.beginPath();
      ctx.moveTo(cx, topY - blockH);
      ctx.lineTo(cx + blockW, topY);
      ctx.lineTo(cx, topY + blockH);
      ctx.lineTo(cx - blockW, topY);
      ctx.closePath();
      ctx.fill();

      // Edge outline
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
