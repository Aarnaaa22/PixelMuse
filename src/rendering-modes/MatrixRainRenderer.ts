import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';

const MATRIX_GLYPHS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789';

export class MatrixRainRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'matrix-rain';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void {
    const { renderParams, palette, ascii, motion } = config;
    const { cellSize, density, invert, edgeEmphasis } = renderParams;

    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const fontSize = Math.max(8, Math.round(grid.cellHeight * 0.95));

    ctx.save();
    ctx.font = `bold ${fontSize}px ${ascii.fontFamily || '"JetBrains Mono", monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const glyphsCount = MATRIX_GLYPHS.length;
    const speed = motion.isPlaying ? motion.speed : 1;
    const effectiveTime = time * speed * 2;

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      let { r, g, b, luminance, edge, x, y, width, height, col, row } = cell;

      if (invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      // Column drop cycle based on column index and time
      const colPhase = (col * 3.7 + effectiveTime) % (grid.rows + 15);
      const distFromDropHead = colPhase - row;

      // Only draw if within trailing rain stream or if image has luminance
      if (distFromDropHead < 0 || distFromDropHead > 18) {
        if (luminance < 0.25) continue;
      }

      // Pseudo-random deterministic glyph
      const glyphSeed = Math.floor((col * 17 + row * 23 + Math.floor(effectiveTime * 0.5)) % glyphsCount);
      const glyph = MATRIX_GLYPHS[Math.abs(glyphSeed)];

      const color = quantizer.quantizePixel({ r, g, b }, palette.colors);
      const cx = x + width / 2;
      const cy = y + height / 2;

      // If at drop head, draw bright white/lime leader
      if (Math.abs(distFromDropHead) < 1.2) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#CCFF00';
        ctx.shadowBlur = 8;
        ctx.fillText(glyph, cx, cy);
        ctx.shadowBlur = 0;
      } else {
        // Trailing phosphor fade modulated by luminance
        const trailFade = Math.max(0.2, 1 - distFromDropHead / 18);
        const alpha = Math.min(1.0, (0.3 + 0.7 * luminance) * trailFade);

        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.fillText(glyph, cx, cy);
      }

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

