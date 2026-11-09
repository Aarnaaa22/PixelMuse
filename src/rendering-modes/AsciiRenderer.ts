import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { ImageDataProcessor } from '../image-processing';
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
    const { ascii, motion, palette } = config;
    const { width, height, data } = source;
    
    // Clear background
    this.clearCanvas(ctx, ascii.backgroundColor);

    const chars = ascii.characters || ' .:-=+*#%@';
    const charLen = chars.length;
    const fontSize = Math.max(6, ascii.fontSize);
    const lineHeight = Math.max(6, ascii.lineHeight || fontSize);

    ctx.save();
    ctx.font = `${fontSize}px ${ascii.fontFamily || '"JetBrains Mono", monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Optional glow
    if (ascii.glow > 0) {
      ctx.shadowBlur = ascii.glow;
      ctx.shadowColor = ascii.monochromeColor;
    }

    // Step across the image based on cell size
    const stepX = fontSize * 0.6; // average mono aspect ratio
    const stepY = lineHeight;

    const cols = Math.floor(width / stepX);
    const rows = Math.floor(height / stepY);

    const lumMap = ImageDataProcessor.extractLuminanceMap(
      source,
      ascii.brightness,
      ascii.contrast
    );

    for (let r = 0; r < rows; r++) {
      const y = r * stepY;
      const sampleY = Math.min(height - 1, Math.floor(y + stepY * 0.5));

      for (let c = 0; c < cols; c++) {
        const x = c * stepX;
        const sampleX = Math.min(width - 1, Math.floor(x + stepX * 0.5));
        const pixelIdx = sampleY * width + sampleX;

        let lum = lumMap[pixelIdx];
        if (ascii.invert) {
          lum = 1 - lum;
        }

        // Apply motion modulation
        const motionOffset = MotionEcosystem.getOffset(x, y, time, motion);
        const charIdx = Math.min(
          charLen - 1,
          Math.max(0, Math.floor(lum * charLen))
        );
        const char = chars[charIdx];

        if (char === ' ' || !char) continue;

        // Determine glyph color
        if (ascii.colorMode === 'original') {
          const rawIdx = pixelIdx * 4;
          ctx.fillStyle = `rgb(${data[rawIdx]}, ${data[rawIdx + 1]}, ${data[rawIdx + 2]})`;
        } else if (ascii.colorMode === 'palette') {
          const rawIdx = pixelIdx * 4;
          const quantized = quantizer.quantizePixel(
            { r: data[rawIdx], g: data[rawIdx + 1], b: data[rawIdx + 2] },
            palette.colors
          );
          ctx.fillStyle = `rgb(${quantized.r}, ${quantized.g}, ${quantized.b})`;
        } else if (ascii.colorMode === 'gradient') {
          const t = r / Math.max(1, rows - 1);
          ctx.fillStyle = t > 0.5 ? '#CCFF00' : '#9D4EDD';
        } else {
          ctx.fillStyle = ascii.monochromeColor;
        }

        ctx.globalAlpha = Math.min(1, Math.max(0.1, motionOffset.alphaMod));
        ctx.fillText(char, x + motionOffset.dx + stepX * 0.5, y + motionOffset.dy + stepY * 0.5);
      }
    }

    ctx.restore();
  }

  /**
   * Generates pure UTF-8 monospace text representation of the image
   */
  static generateText(source: ImageData, config: RenderConfig): string {
    const { ascii } = config;
    const { width, height } = source;
    const chars = ascii.characters || ' .:-=+*#%@';
    const charLen = chars.length;
    const fontSize = Math.max(6, ascii.fontSize);
    const stepX = fontSize * 0.6;
    const stepY = fontSize;

    const cols = Math.floor(width / stepX);
    const rows = Math.floor(height / stepY);
    const lumMap = ImageDataProcessor.extractLuminanceMap(
      source,
      ascii.brightness,
      ascii.contrast
    );

    const lines: string[] = [];
    for (let r = 0; r < rows; r++) {
      let line = '';
      const sampleY = Math.min(height - 1, Math.floor(r * stepY + stepY * 0.5));

      for (let c = 0; c < cols; c++) {
        const sampleX = Math.min(width - 1, Math.floor(c * stepX + stepX * 0.5));
        const pixelIdx = sampleY * width + sampleX;
        let lum = lumMap[pixelIdx];
        if (ascii.invert) lum = 1 - lum;

        const charIdx = Math.min(charLen - 1, Math.max(0, Math.floor(lum * charLen)));
        line += chars[charIdx] || ' ';
      }
      lines.push(line);
    }

    return lines.join('\n');
  }
}
