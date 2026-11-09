import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';

export class HexdumpRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'hexdump';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { renderParams, palette, ascii } = config;
    const { cellSize, density, invert, edgeEmphasis } = renderParams;

    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const fontSize = Math.max(7, Math.round(grid.cellHeight * 0.72));

    ctx.save();
    ctx.font = `600 ${fontSize}px ${ascii.fontFamily || '"JetBrains Mono", monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      let { r, g, b, luminance, edge, x, y, width, height } = cell;

      if (invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      // Convert brightness to 2-digit uppercase hex byte: "00".."FF"
      const byteVal = Math.min(255, Math.max(0, Math.round(luminance * 255)));
      const hexString = byteVal.toString(16).padStart(2, '0').toUpperCase();

      const color = quantizer.quantizePixel({ r, g, b }, palette.colors);
      const cx = x + width / 2;
      const cy = y + height / 2;

      // Dim zero/dark values, glow bright values
      const alpha = byteVal === 0 ? 0.2 : Math.min(1.0, 0.4 + 0.6 * luminance);

      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      ctx.fillText(hexString, cx, cy);

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
