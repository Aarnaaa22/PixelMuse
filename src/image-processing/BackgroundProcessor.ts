import { BackgroundConfig, BlurType } from '../types';
import { BlurEngine } from './BlurEngine';

/**
 * Background Compositor for PixelMuse Studio.
 * Supports:
 * - 'original': Crisp original photograph with opacity control
 * - 'blurred': Source photograph filtered with Gaussian, Box, Radial, or Motion blur
 * - 'solid': Solid background color with opacity
 * - 'none': Fully transparent canvas
 */
export class BackgroundProcessor {
  static render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    sourceImage: CanvasImageSource | null,
    config: BackgroundConfig
  ): void {
    const { mode, opacity, blur, blurType = 'gaussian', color = '#08080A' } = config;

    ctx.save();

    if (mode === 'none' || mode === 'transparent') {
      ctx.clearRect(0, 0, width, height);
      ctx.restore();
      return;
    }

    if (mode === 'solid') {
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      return;
    }

    if (mode === 'original' && sourceImage) {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacity;
      ctx.drawImage(sourceImage, 0, 0, width, height);
      ctx.restore();
      return;
    }

    if ((mode === 'blurred' || mode === 'source-blur') && sourceImage) {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacity;
      const bType: BlurType = blurType === 'off' ? 'gaussian' : blurType;
      BlurEngine.applyBlur(ctx, sourceImage, width, height, bType, blur);
      ctx.restore();
      return;
    }

    if (mode === 'grid') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    // Default fallback: solid color fill
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }
}
