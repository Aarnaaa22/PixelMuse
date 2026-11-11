import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { MotionEcosystem } from '../animation-engine';

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
    const { cellSize = 12, density = 1.0, invert = false, edgeEmphasis = 0, charSet } = renderParams || {};

    const rawChars = charSet || ascii?.characters || ' .:-=+*#%@';
    // Ensure we always have non-empty character string
    const chars = rawChars && rawChars.length > 0 ? rawChars : ' .:-=+*#%@';
    const charLen = chars.length;

    // Sample cell grid
    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const fontSize = Math.max(8, Math.round(grid.cellHeight * 1.05));

    ctx.save();
    ctx.font = `bold ${fontSize}px ${ascii?.fontFamily || '"JetBrains Mono", monospace, sans-serif'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Optional glow
    if (ascii?.glow && ascii.glow > 0) {
      ctx.shadowBlur = ascii.glow;
      ctx.shadowColor = ascii.monochromeColor || '#CCFF00';
    }

    const colorMode = ascii?.colorMode || 'original';
    const monoColor = ascii?.monochromeColor || '#CCFF00';

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      let { r, g, b, luminance, edge, x, y, width, height } = cell;

      if (invert || ascii?.invert) {
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
      if (colorMode === 'original') {
        // Boost shadow levels so dark areas (hair, eyes, dark clothing) are clearly legible as colored glyphs
        const boostR = Math.max(38, r);
        const boostG = Math.max(38, g);
        const boostB = Math.max(38, b);
        ctx.fillStyle = `rgb(${boostR}, ${boostG}, ${boostB})`;
      } else if (colorMode === 'palette' && palette?.colors && palette.colors.length > 0) {
        // Filter out pitch-black colors to avoid invisible text on black background
        const activeColors = palette.colors.filter(c => c !== '#000000' && c !== '#08080A' && c !== '#050505');
        const usableColors = activeColors.length > 0 ? activeColors : palette.colors;
        const palIdx = Math.min(usableColors.length - 1, Math.floor(luminance * usableColors.length));
        ctx.fillStyle = usableColors[palIdx];
      } else {
        // Monochrome terminal (Acid Lime / Amber / Cyan / White) with luminance-weighted brightness
        ctx.fillStyle = monoColor;
      }

      // Edge emphasis brightness boost
      if (edgeEmphasis > 0 && edge > 0.25) {
        ctx.fillStyle = '#CCFF00';
      }

      const alphaMod = motionOffset?.alphaMod ?? 1;
      // Guarantee clear minimum visibility so glyphs are bold and legible
      ctx.globalAlpha = Math.min(1, Math.max(0.45, (luminance * 0.65 + 0.35) * alphaMod));
      ctx.fillText(
        char,
        x + width / 2 + (motionOffset?.dx || 0),
        y + height / 2 + (motionOffset?.dy || 0)
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
