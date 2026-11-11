import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';

export type AdvancedAsciiVariant = 'ripple' | 'virt' | 'city' | 'cascade';

/**
 * Independent, reusable Advanced ASCII & Linguistic Typography rendering module.
 * - 'ripple-ascii': Concentric circular displacement ripples over photo ASCII
 * - 'virt-ascii': High-key code/syntax bracket glyphs with obsidian contrast
 * - 'city-ascii': Luminance depth-slicing mimicking urban skyline elevation bands
 * - 'typo-cascade': Typographic headline dissolve with fluttering ASCII entropy
 */
export class AdvancedAsciiRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'ripple-ascii';
  private variant: AdvancedAsciiVariant = 'ripple';

  constructor(variant: AdvancedAsciiVariant = 'ripple') {
    super();
    this.variant = variant;
  }

  setVariant(variant: AdvancedAsciiVariant): void {
    this.variant = variant;
  }

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void {
    const { renderParams, ascii, motion, palette, color } = config;
    const { cellSize, density, invert, edgeEmphasis, charSet } = renderParams;

    const chars = charSet || ascii.characters || ' .:-=+*#%@';
    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const fontSize = Math.max(7, Math.round(grid.cellHeight * 0.95));

    ctx.save();
    ctx.font = `${fontSize}px ${ascii.fontFamily || '"JetBrains Mono", monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cx = source.width / 2;
    const cy = source.height / 2;
    const speed = motion.isPlaying ? (motion.speed || 1) : 1;
    const t = time * speed;

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      let { r, g, b, luminance, x, y, width, height, col } = cell;

      if (invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      let drawX = x + width / 2;
      let drawY = y + height / 2;
      let glyph = chars[Math.min(chars.length - 1, Math.floor(luminance * chars.length))];

      switch (this.variant) {
        case 'ripple': {
          // Concentric circular displacement ripples distorting underlying coordinate field
          const dist = Math.hypot(drawX - cx, drawY - cy);
          const wavelength = 35;
          const wavePhase = (dist / wavelength) - t * 3;
          const displacement = Math.sin(wavePhase) * (width * 0.4);
          drawX += (drawX - cx) / (dist || 1) * displacement * 0.2;
          drawY += (drawY - cy) / (dist || 1) * displacement * 0.2;
          break;
        }

        case 'virt': {
          // High-contrast bracket syntax glyphs with wide letter spacing
          const virtChars = '[]{}/\\|()';
          glyph = virtChars[Math.floor(luminance * virtChars.length)] || '[';
          break;
        }

        case 'city': {
          // Monospace skyline elevation bands (quantizes luminance into 5 discrete elevation shelves)
          const bandCount = 5;
          const band = Math.floor(luminance * bandCount);
          const cityGlyphs = ' _-=#|[]';
          glyph = cityGlyphs[Math.min(cityGlyphs.length - 1, band * 2)];
          break;
        }

        case 'cascade': {
          // Headline dissolve with fluttering noise
          const dissolve = (Math.sin(t * 2 + col * 0.3) + 1) / 2;
          if (dissolve > 0.6) {
            const noiseChars = '#%*+=:-.';
            glyph = noiseChars[Math.floor(dissolve * noiseChars.length) % noiseChars.length];
            drawY += Math.sin(t * 3 + col) * (dissolve * 8);
          }
          break;
        }
      }

      if (!glyph || glyph === ' ') continue;

      // Color computation
      if (ascii.colorMode === 'original') {
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else if (ascii.colorMode === 'palette') {
        const q = quantizer.quantizePixel({ r, g, b }, palette.colors);
        ctx.fillStyle = `rgb(${q.r}, ${q.g}, ${q.b})`;
      } else {
        ctx.fillStyle = color.tintColor || ascii.monochromeColor || '#CCFF00';
      }

      ctx.fillText(glyph, drawX, drawY);
    }

    ctx.restore();
  }
}
