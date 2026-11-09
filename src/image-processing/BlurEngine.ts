import { clamp } from '../utilities';
import { BlurType } from '../types';

/**
 * High-performance Canvas & ImageData Blur Engine.
 * Supports Gaussian, Box, Radial, and Motion blur variations.
 */
export class BlurEngine {
  /**
   * Applies selected blur type to an ImageData buffer or Canvas context.
   */
  static applyBlur(
    ctx: CanvasRenderingContext2D,
    source: CanvasImageSource,
    width: number,
    height: number,
    type: BlurType,
    radius: number,
    angle = 0
  ): void {
    if (type === 'off' || radius <= 0) {
      ctx.drawImage(source, 0, 0, width, height);
      return;
    }

    switch (type) {
      case 'gaussian':
        this.applyGaussianBlur(ctx, source, width, height, radius);
        break;
      case 'box':
        this.applyBoxBlur(ctx, source, width, height, radius);
        break;
      case 'radial':
        this.applyRadialBlur(ctx, source, width, height, radius);
        break;
      case 'motion':
        this.applyMotionBlur(ctx, source, width, height, radius, angle);
        break;
      default:
        ctx.drawImage(source, 0, 0, width, height);
        break;
    }
  }

  /**
   * Hardware-accelerated Gaussian Blur using Canvas filter with fallback.
   */
  static applyGaussianBlur(
    ctx: CanvasRenderingContext2D,
    source: CanvasImageSource,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.save();
    ctx.filter = `blur(${Math.max(0.5, radius)}px)`;
    ctx.drawImage(source, 0, 0, width, height);
    ctx.filter = 'none';
    ctx.restore();
  }

  /**
   * Multi-pass Box Blur for soft, diffused photographic depth.
   */
  static applyBoxBlur(
    ctx: CanvasRenderingContext2D,
    source: CanvasImageSource,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.save();
    const passes = Math.min(3, Math.max(1, Math.round(radius / 4)));
    const step = Math.max(1, radius / passes);

    // Composite overlapping offset samples
    ctx.globalAlpha = 1.0 / (passes * 4 + 1);
    ctx.drawImage(source, 0, 0, width, height);

    for (let p = 1; p <= passes; p++) {
      const offset = p * step;
      ctx.drawImage(source, -offset, 0, width, height);
      ctx.drawImage(source, offset, 0, width, height);
      ctx.drawImage(source, 0, -offset, width, height);
      ctx.drawImage(source, 0, offset, width, height);
    }

    ctx.restore();
  }

  /**
   * Radial (Zoom) Blur emanating outwards from the frame center.
   */
  static applyRadialBlur(
    ctx: CanvasRenderingContext2D,
    source: CanvasImageSource,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.save();
    const steps = Math.min(10, Math.max(3, Math.round(radius / 3)));
    const scaleStep = (radius * 0.008) / steps;
    const cx = width / 2;
    const cy = height / 2;

    ctx.globalAlpha = 1.0 / steps;

    for (let i = 0; i < steps; i++) {
      const s = 1 + i * scaleStep;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(s, s);
      ctx.translate(-cx, -cy);
      ctx.drawImage(source, 0, 0, width, height);
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Directional Motion Blur along a specific angular orientation.
   */
  static applyMotionBlur(
    ctx: CanvasRenderingContext2D,
    source: CanvasImageSource,
    width: number,
    height: number,
    radius: number,
    angleDeg = 0
  ): void {
    ctx.save();
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const steps = Math.min(12, Math.max(4, Math.round(radius / 2)));
    ctx.globalAlpha = 1.0 / (steps * 2 + 1);

    ctx.drawImage(source, 0, 0, width, height);

    for (let i = 1; i <= steps; i++) {
      const dist = (i / steps) * radius;
      const dx = dist * cos;
      const dy = dist * sin;

      ctx.drawImage(source, dx, dy, width, height);
      ctx.drawImage(source, -dx, -dy, width, height);
    }

    ctx.restore();
  }

  /**
   * Fast in-place Box Blur on raw ImageData buffers.
   */
  static applyImageDataBoxBlur(imageData: ImageData, radius: number): ImageData {
    if (radius <= 0) return imageData;
    const { width, height, data } = imageData;
    const r = Math.min(20, Math.max(1, Math.round(radius)));

    // Fast horizontal blur pass
    const temp = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let k = -r; k <= r; k += 2) {
          const px = clamp(x + k, 0, width - 1);
          const idx = (y * width + px) * 4;
          rSum += temp[idx];
          gSum += temp[idx + 1];
          bSum += temp[idx + 2];
          count++;
        }
        const outIdx = (y * width + x) * 4;
        data[outIdx] = Math.round(rSum / count);
        data[outIdx + 1] = Math.round(gSum / count);
        data[outIdx + 2] = Math.round(bSum / count);
      }
    }

    return imageData;
  }
}

