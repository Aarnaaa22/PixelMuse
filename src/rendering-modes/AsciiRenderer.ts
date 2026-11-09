import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { MotionEcosystem } from '../animation-engine';
import { quantizer } from '../image-processing/ColorQuantizer';

export const ASCII_GLYPH_PRESETS = [
  { id: 'standard', name: 'Standard Density', chars: ' .:-=+*#%@' },
  { id: 'dense-blocks', name: 'Dense Shader Blocks', chars: ' ·:;░▒▓█' },
  { id: 'matrix-katakana', name: 'Matrix Katakana', chars: ' ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ' },
  { id: 'math-scientific', name: 'Math / Scientific', chars: ' ·°+×÷=≈≠≤≥∞' },
  { id: 'minimal-stipple', name: 'Minimal Stippling', chars: ' · : * #' },
  { id: 'binary', name: 'Binary Raw', chars: ' 01' },
];

export class AsciiRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'ascii';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void {
    const { renderParams, ascii, motion, palette } = config;
    const { cellSize, density, invert, edgeEmphasis, charSet } = renderParams;

    const chars = charSet || ascii.characters || ' .:-=+*#%@';
    const charLen = chars.length;

    // Sample cell grid
    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const fontSize = Math.max(6, Math.round(grid.cellHeight));

    ctx.save();
    ctx.font = `${fontSize}px ${ascii.fontFamily || '"JetBrains Mono", monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Optional glow
    if (ascii.glow > 0) {
      ctx.shadowBlur = ascii.glow;
      ctx.shadowColor = ascii.monochromeColor;
    }

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      let { r, g, b, luminance, edge, x, y, width, height } = cell;

      if (invert || ascii.invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      const motionOffset = MotionEcosystem.getOffset(x, y, time, motion);
      const charIdx = Math.min(charLen - 1, Math.max(0, Math.floor(luminance * charLen)));
      const char = chars[charIdx];

      if (char === ' ' || !char) continue;

      // Color selection
      if (ascii.colorMode === 'original') {
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else if (ascii.colorMode === 'palette') {
        const quantized = quantizer.quantizePixel({ r, g, b }, palette.colors);
        ctx.fillStyle = `rgb(${quantized.r}, ${quantized.g}, ${quantized.b})`;
      } else {
        ctx.fillStyle = ascii.monochromeColor;
      }

      // Edge emphasis brightness boost
      if (edgeEmphasis > 0 && edge > 0.25) {
        ctx.fillStyle = '#CCFF00';
      }

      ctx.globalAlpha = Math.min(1, Math.max(0.1, motionOffset.alphaMod));
      ctx.fillText(
        char,
        x + width / 2 + motionOffset.dx,
        y + height / 2 + motionOffset.dy
      );
    }

    ctx.restore();
  }

  static generateText(source: ImageData, config: RenderConfig): string {
    const { renderParams, ascii } = config;
    const chars = renderParams.charSet || ascii.characters || ' .:-=+*#%@';
    const charLen = chars.length;
    const grid = CellGridSampler.sample(source, renderParams.cellSize, renderParams.density, 0);

    const lines: string[] = [];
    let currentLine = '';
    let lastRow = 0;

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      if (cell.row !== lastRow) {
        lines.push(currentLine);
        currentLine = '';
        lastRow = cell.row;
      }

      let lum = cell.luminance;
      if (renderParams.invert || ascii.invert) lum = 1 - lum;

      const charIdx = Math.min(charLen - 1, Math.max(0, Math.floor(lum * charLen)));
      currentLine += chars[charIdx] || ' ';
    }
    if (currentLine) lines.push(currentLine);

    return lines.join('\n');
  }
}
