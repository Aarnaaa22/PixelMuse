import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { getLuminance } from '../utilities';

// Unicode Braille dot bit positions:
// Dot 1: col 0, row 0 -> 0x01
// Dot 2: col 0, row 1 -> 0x02
// Dot 3: col 0, row 2 -> 0x04
// Dot 4: col 1, row 0 -> 0x08
// Dot 5: col 1, row 1 -> 0x10
// Dot 6: col 1, row 2 -> 0x20
// Dot 7: col 0, row 3 -> 0x40
// Dot 8: col 1, row 3 -> 0x80
const BRAILLE_DOT_MAP = [
  // col 0
  [
    { dx: 0.25, dy: 0.125, bit: 0x01 },
    { dx: 0.25, dy: 0.375, bit: 0x02 },
    { dx: 0.25, dy: 0.625, bit: 0x04 },
    { dx: 0.25, dy: 0.875, bit: 0x40 },
  ],
  // col 1
  [
    { dx: 0.75, dy: 0.125, bit: 0x08 },
    { dx: 0.75, dy: 0.375, bit: 0x10 },
    { dx: 0.75, dy: 0.625, bit: 0x20 },
    { dx: 0.75, dy: 0.875, bit: 0x80 },
  ],
];

export class BrailleRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'braille';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { renderParams, palette, ascii } = config;
    const { cellSize, density, invert, edgeEmphasis } = renderParams;

    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const { data, width: srcW, height: srcH } = source;

    const fontSize = Math.max(8, Math.round(grid.cellHeight * 1.1));

    ctx.save();
    ctx.font = `${fontSize}px ${ascii.fontFamily || '"JetBrains Mono", monospace'}`;
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

      // Compute 8-dot Braille mask from 2x4 sub-sampling
      let mask = 0;
      const threshold = 0.45;

      for (let c = 0; c < 2; c++) {
        for (let rIdx = 0; rIdx < 4; rIdx++) {
          const dot = BRAILLE_DOT_MAP[c][rIdx];
          const px = Math.min(srcW - 1, Math.floor(x + width * dot.dx));
          const py = Math.min(srcH - 1, Math.floor(y + height * dot.dy));
          const idx = (py * srcW + px) * 4;

          let dotLum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);
          if (invert) dotLum = 1 - dotLum;

          if (dotLum >= threshold) {
            mask |= dot.bit;
          }
        }
      }

      // If all dots empty but luminance is noticeably high, ensure at least 1 dot
      if (mask === 0 && luminance > 0.3) {
        mask = 0x01 | 0x08; // top dots
      }

      const brailleChar = String.fromCharCode(0x2800 + mask);
      const color = quantizer.quantizePixel({ r, g, b }, palette.colors);
      const cx = x + width / 2;
      const cy = y + height / 2;

      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillText(brailleChar, cx, cy);

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
