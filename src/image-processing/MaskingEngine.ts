import { MaskConfig } from '../types';
import { clamp } from '../utilities';

/**
 * PixelMuse Alpha & Luminance Masking Engine.
 * Composites the original source photograph over the generative raster artwork
 * based on an optional user-supplied mask image with support for invert and edge feathering.
 */
export class MaskingEngine {
  /**
   * Applies the mask to selectively reveal portions of the original photograph.
   */
  static applyMask(
    targetCtx: CanvasRenderingContext2D,
    width: number,
    height: number,
    originalImage: CanvasImageSource | null,
    maskConfig?: MaskConfig
  ): void {
    if (!maskConfig || !maskConfig.enabled || !maskConfig.maskCanvas || !originalImage) {
      return;
    }

    const { maskCanvas, invert, feather, opacity = 1.0 } = maskConfig;

    // 1. Prepare offscreen canvas for the mask
    const maskBuffer = document.createElement('canvas');
    maskBuffer.width = width;
    maskBuffer.height = height;
    const mCtx = maskBuffer.getContext('2d');
    if (!mCtx) return;

    if (feather > 0) {
      mCtx.filter = `blur(${Math.max(1, Math.round(feather))}px)`;
    }
    mCtx.drawImage(maskCanvas, 0, 0, width, height);
    mCtx.filter = 'none';

    const maskData = mCtx.getImageData(0, 0, width, height);
    const mPixels = maskData.data;

    // 2. Prepare offscreen buffer for the original photograph
    const photoBuffer = document.createElement('canvas');
    photoBuffer.width = width;
    photoBuffer.height = height;
    const pCtx = photoBuffer.getContext('2d');
    if (!pCtx) return;

    pCtx.drawImage(originalImage, 0, 0, width, height);
    const photoData = pCtx.getImageData(0, 0, width, height);
    const pPixels = photoData.data;

    // 3. Read current generative raster canvas pixels
    const targetData = targetCtx.getImageData(0, 0, width, height);
    const tPixels = targetData.data;

    const len = tPixels.length;
    const effOpacity = clamp(opacity, 0, 1);

    for (let i = 0; i < len; i += 4) {
      // Compute mask reveal coefficient from luminance and alpha
      let maskVal = (0.2126 * mPixels[i] + 0.7152 * mPixels[i + 1] + 0.0722 * mPixels[i + 2]) / 255;
      maskVal *= mPixels[i + 3] / 255;

      if (invert) {
        maskVal = 1 - maskVal;
      }

      const reveal = maskVal * effOpacity;

      if (reveal > 0) {
        // Blend original photograph over the generative raster
        tPixels[i] = Math.round(tPixels[i] * (1 - reveal) + pPixels[i] * reveal);
        tPixels[i + 1] = Math.round(tPixels[i + 1] * (1 - reveal) + pPixels[i + 1] * reveal);
        tPixels[i + 2] = Math.round(tPixels[i + 2] * (1 - reveal) + pPixels[i + 2] * reveal);
      }
    }

    targetCtx.putImageData(targetData, 0, 0);
  }
}

