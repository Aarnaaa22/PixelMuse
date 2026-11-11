import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { MotionEcosystem } from '../animation-engine';
import { clamp, hexToRgb } from '../utilities';

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
    const { renderParams, ascii, motion, palette, color } = config;
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

    // Helper to apply chromatic tint & overlay blend equation to any RGB color
    const applyTintToRgb = (baseR: number, baseG: number, baseB: number): string => {
      if (!color?.tintOpacity || color.tintOpacity <= 0 || !color.tintColor) {
        return `rgb(${baseR}, ${baseG}, ${baseB})`;
      }
      const tint = hexToRgb(color.tintColor);
      const alpha = clamp(color.tintOpacity, 0, 1);
      const tr = tint.r;
      const tg = tint.g;
      const tb = tint.b;

      let bR = baseR;
      let bG = baseG;
      let bB = baseB;

      switch (color.blendMode) {
        case 'multiply':
          bR = (baseR * tr) / 255;
          bG = (baseG * tg) / 255;
          bB = (baseB * tb) / 255;
          break;
        case 'screen':
          bR = 255 - ((255 - baseR) * (255 - tr)) / 255;
          bG = 255 - ((255 - baseG) * (255 - tg)) / 255;
          bB = 255 - ((255 - baseB) * (255 - tb)) / 255;
          break;
        case 'overlay':
          bR = baseR < 128 ? (2 * baseR * tr) / 255 : 255 - (2 * (255 - baseR) * (255 - tr)) / 255;
          bG = baseG < 128 ? (2 * baseG * tg) / 255 : 255 - (2 * (255 - baseG) * (255 - tg)) / 255;
          bB = baseB < 128 ? (2 * baseB * tb) / 255 : 255 - (2 * (255 - baseB) * (255 - tb)) / 255;
          break;
        case 'color-dodge':
          bR = tr === 255 ? 255 : Math.min(255, (baseR * 255) / (255 - tr));
          bG = tg === 255 ? 255 : Math.min(255, (baseG * 255) / (255 - tg));
          bB = tb === 255 ? 255 : Math.min(255, (baseB * 255) / (255 - tb));
          break;
        case 'difference':
          bR = Math.abs(baseR - tr);
          bG = Math.abs(baseG - tg);
          bB = Math.abs(baseB - tb);
          break;
        case 'normal':
        default:
          bR = tr;
          bG = tg;
          bB = tb;
          break;
      }

      const finalR = clamp(Math.round(baseR * (1 - alpha) + bR * alpha), 0, 255);
      const finalG = clamp(Math.round(baseG * (1 - alpha) + bG * alpha), 0, 255);
      const finalB = clamp(Math.round(baseB * (1 - alpha) + bB * alpha), 0, 255);
      return `rgb(${finalR}, ${finalG}, ${finalB})`;
    };

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
        ctx.fillStyle = applyTintToRgb(boostR, boostG, boostB);
      } else if (colorMode === 'palette' && palette?.colors && palette.colors.length > 0) {
        // Filter out absolute blacks (total brightness < 20) to ensure text legibility on obsidian canvas
        const activeColors = palette.colors.filter(c => {
          const rgb = hexToRgb(c);
          return (rgb.r + rgb.g + rgb.b) > 20;
        });
        const usableColors = activeColors.length > 0 ? activeColors : palette.colors;
        const palIdx = Math.min(usableColors.length - 1, Math.max(0, Math.floor(luminance * usableColors.length)));
        const palRgb = hexToRgb(usableColors[palIdx]);
        // Shadow boost for dark palette swatches so text is always legible
        const boostR = Math.max(35, palRgb.r);
        const boostG = Math.max(35, palRgb.g);
        const boostB = Math.max(35, palRgb.b);
        ctx.fillStyle = applyTintToRgb(boostR, boostG, boostB);
      } else {
        // Monochrome terminal (Acid Lime / Amber / Cyan / White) with luminance-weighted brightness
        const monoRgb = hexToRgb(monoColor);
        ctx.fillStyle = applyTintToRgb(monoRgb.r, monoRgb.g, monoRgb.b);
      }

      // Edge emphasis brightness boost
      if (edgeEmphasis > 0 && edge > 0.25) {
        ctx.fillStyle = colorMode === 'palette' && palette?.colors ? palette.colors[palette.colors.length - 1] : '#CCFF00';
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
