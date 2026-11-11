import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { clamp } from '../utilities';

/**
 * Independent, reusable CRT & Phosphor rendering module.
 * Simulates physical cathode ray tube monitors:
 * - Non-linear optical barrel curvature (fisheye glass distortion)
 * - Horizontal electron beam scanlines
 * - Vertical RGB phosphor shadow mask / aperture grille
 * - Beam persistence bloom and high-voltage electrical flicker
 */
export class CrtPhosphorRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'crt-phosphor';

  private tempCanvas: HTMLCanvasElement | null = null;
  private tempCtx: CanvasRenderingContext2D | null = null;

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void {
    const { width, height } = source;
    const { renderParams, effects, motion, color } = config;
    const curvature = clamp(renderParams.edgeEmphasis || 0.25, 0.05, 0.6);
    const scanlineIntensity = clamp(effects.scanlines || 0.45, 0.1, 1.0);
    const flickerHz = motion.isPlaying ? (motion.speed || 1) * 30 : 0;
    const flickerAlpha = flickerHz > 0 ? (Math.sin(time * flickerHz) > 0.93 ? 0.08 : 0) : 0;

    // Ensure scratch buffer matches dimensions
    if (!this.tempCanvas || this.tempCanvas.width !== width || this.tempCanvas.height !== height) {
      this.tempCanvas = document.createElement('canvas');
      this.tempCanvas.width = width;
      this.tempCanvas.height = height;
      this.tempCtx = this.tempCanvas.getContext('2d');
    }

    if (!this.tempCtx) return;

    // 1. Process source data with non-linear barrel distortion
    const srcData = source.data;
    const outputImage = this.tempCtx.createImageData(width, height);
    const dstData = outputImage.data;

    const cx = width / 2;
    const cy = height / 2;

    const tintR = parseInt(color.tintColor.slice(1, 3) || '22', 16);
    const tintG = parseInt(color.tintColor.slice(3, 5) || 'c5', 16);
    const tintB = parseInt(color.tintColor.slice(5, 7) || '5e', 16);
    const tintOpacity = color.tintOpacity || 0;

    for (let y = 0; y < height; y++) {
      const ny = (y - cy) / cy;
      const rowOffset = y * width * 4;

      // Scanline beam intensity modulation (horizontal cathode raster)
      const scanlineFactor = 1 - (y % 3 === 0 ? scanlineIntensity * 0.75 : 0);

      for (let x = 0; x < width; x++) {
        const nx = (x - cx) / cx;
        const r2 = nx * nx + ny * ny;

        // Barrel distortion formula: r' = r * (1 + k * r^2)
        const distortion = 1 + curvature * r2;
        const srcX = Math.round(cx + (x - cx) * distortion);
        const srcY = Math.round(cy + (y - cy) * distortion);

        const dstIdx = rowOffset + x * 4;

        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          const srcIdx = (srcY * width + srcX) * 4;
          let r = srcData[srcIdx];
          let g = srcData[srcIdx + 1];
          let b = srcData[srcIdx + 2];

          // Phosphor triad shadow mask (RGB triad pattern across X)
          const maskX = x % 3;
          if (maskX === 0) {
            r = Math.min(255, r * 1.25);
            g = g * 0.75;
            b = b * 0.75;
          } else if (maskX === 1) {
            r = r * 0.75;
            g = Math.min(255, g * 1.25);
            b = b * 0.75;
          } else {
            r = r * 0.75;
            g = g * 0.75;
            b = Math.min(255, b * 1.3);
          }

          // Optional phosphor color tint (e.g. green phosphor terminal)
          if (tintOpacity > 0) {
            r = r * (1 - tintOpacity) + tintR * tintOpacity;
            g = g * (1 - tintOpacity) + tintG * tintOpacity;
            b = b * (1 - tintOpacity) + tintB * tintOpacity;
          }

          // Vignette falloff towards corners (cathode tube bezel shadow)
          const cornerVignette = Math.max(0, 1 - r2 * 0.45);

          dstData[dstIdx] = Math.round(r * scanlineFactor * cornerVignette);
          dstData[dstIdx + 1] = Math.round(g * scanlineFactor * cornerVignette);
          dstData[dstIdx + 2] = Math.round(b * scanlineFactor * cornerVignette);
          dstData[dstIdx + 3] = 255;
        } else {
          // Beyond curved bezel edge: solid dark bezel
          dstData[dstIdx] = 4;
          dstData[dstIdx + 1] = 4;
          dstData[dstIdx + 2] = 6;
          dstData[dstIdx + 3] = 255;
        }
      }
    }

    // 2. Put processed ImageData to scratch canvas
    this.tempCtx.putImageData(outputImage, 0, 0);

    // 3. Composite to target with phosphor glow and electrical flicker
    ctx.save();
    ctx.drawImage(this.tempCanvas, 0, 0);

    // Luminous phosphor bloom
    if (effects.bloom > 0) {
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = effects.bloom * 0.4;
      ctx.filter = `blur(${Math.round(curvature * 8 + 4)}px)`;
      ctx.drawImage(this.tempCanvas, 0, 0);
      ctx.filter = 'none';
    }

    // CRT electrical flicker pulse
    if (flickerAlpha > 0) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(255, 255, 255, ${flickerAlpha})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Curved screen bezel inner border
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#020203';
    ctx.lineWidth = Math.max(2, Math.round(width * 0.015));
    ctx.strokeRect(0, 0, width, height);

    ctx.restore();
  }
}
