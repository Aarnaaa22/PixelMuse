import { ColorConfig, OverlayBlendMode } from '../types';
import { clamp, hexToRgb } from '../utilities';

/**
 * Color Processing Engine for PixelMuse.
 * Handles Brightness, Contrast, Saturation, Grayscale, Tint, and Overlay Blend Modes.
 * Never mutates the source image; operates on a dedicated working ImageData buffer.
 */
export class ColorPipeline {
  /**
   * Primary entry point executing all color adjustments in standard, deterministic order:
   * 1. Brightness & Contrast
   * 2. Saturation
   * 3. Grayscale
   * 4. Tint & Overlay Blend Mode
   */
  static process(imageData: ImageData, config: ColorConfig): ImageData {
    const { brightness, contrast, saturation, grayscale, tintColor, tintOpacity, blendMode = 'normal' } = config;

    // 1. Brightness and Contrast
    if (brightness !== 0 || contrast !== 0) {
      this.applyBrightnessContrast(imageData, brightness, contrast);
    }

    // 2. Saturation
    if (saturation !== 1.0) {
      this.applySaturation(imageData, saturation);
    }

    // 3. Grayscale
    if (grayscale) {
      this.applyGrayscale(imageData);
    }

    // 4. Tint and Blend Mode
    if (tintOpacity > 0 && tintColor) {
      const tintRgb = hexToRgb(tintColor);
      this.applyTintBlend(imageData, tintRgb, tintOpacity, blendMode);
    }

    return imageData;
  }

  /**
   * Applies Brightness and Contrast adjustments.
   * Contrast factor formula with center pivot at 128.
   */
  static applyBrightnessContrast(
    imageData: ImageData,
    brightness: number,
    contrast: number
  ): ImageData {
    const { data } = imageData;
    const len = data.length;
    const bOffset = brightness * 1.5;
    const contrastFactor =
      (259 * (contrast + 255)) / (255 * (259 - contrast) || 1);

    for (let i = 0; i < len; i += 4) {
      const r = data[i] + bOffset;
      const g = data[i + 1] + bOffset;
      const b = data[i + 2] + bOffset;

      data[i] = clamp(Math.round(contrastFactor * (r - 128) + 128), 0, 255);
      data[i + 1] = clamp(Math.round(contrastFactor * (g - 128) + 128), 0, 255);
      data[i + 2] = clamp(Math.round(contrastFactor * (b - 128) + 128), 0, 255);
    }

    return imageData;
  }

  /**
   * Applies Saturation using ITU-R BT.709 relative luminance.
   */
  static applySaturation(imageData: ImageData, saturation: number): ImageData {
    const { data } = imageData;
    const len = data.length;
    const sat = clamp(saturation, 0, 3);

    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      data[i] = clamp(Math.round(lum + (r - lum) * sat), 0, 255);
      data[i + 1] = clamp(Math.round(lum + (g - lum) * sat), 0, 255);
      data[i + 2] = clamp(Math.round(lum + (b - lum) * sat), 0, 255);
    }

    return imageData;
  }

  /**
   * Converts buffer to black and white using accurate Rec. 709 luminance.
   */
  static applyGrayscale(imageData: ImageData): ImageData {
    const { data } = imageData;
    const len = data.length;

    for (let i = 0; i < len; i += 4) {
      const lum = Math.round(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
      data[i] = lum;
      data[i + 1] = lum;
      data[i + 2] = lum;
    }

    return imageData;
  }

  /**
   * Applies chromatic tint with configurable blend equations:
   * Normal, Multiply, Screen, Overlay, Color-Dodge, Difference.
   */
  static applyTintBlend(
    imageData: ImageData,
    tintRgb: { r: number; g: number; b: number },
    opacity: number,
    blendMode: OverlayBlendMode = 'normal'
  ): ImageData {
    const { data } = imageData;
    const len = data.length;
    const alpha = clamp(opacity, 0, 1);
    const tr = tintRgb.r;
    const tg = tintRgb.g;
    const tb = tintRgb.b;

    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      let blendedR = r;
      let blendedG = g;
      let blendedB = b;

      switch (blendMode) {
        case 'multiply':
          blendedR = (r * tr) / 255;
          blendedG = (g * tg) / 255;
          blendedB = (b * tb) / 255;
          break;
        case 'screen':
          blendedR = 255 - ((255 - r) * (255 - tr)) / 255;
          blendedG = 255 - ((255 - g) * (255 - tg)) / 255;
          blendedB = 255 - ((255 - b) * (255 - tb)) / 255;
          break;
        case 'overlay':
          blendedR = r < 128 ? (2 * r * tr) / 255 : 255 - (2 * (255 - r) * (255 - tr)) / 255;
          blendedG = g < 128 ? (2 * g * tg) / 255 : 255 - (2 * (255 - g) * (255 - tg)) / 255;
          blendedB = b < 128 ? (2 * b * tb) / 255 : 255 - (2 * (255 - b) * (255 - tb)) / 255;
          break;
        case 'color-dodge':
          blendedR = tr === 255 ? 255 : Math.min(255, (r * 255) / (255 - tr));
          blendedG = tg === 255 ? 255 : Math.min(255, (g * 255) / (255 - tg));
          blendedB = tb === 255 ? 255 : Math.min(255, (b * 255) / (255 - tb));
          break;
        case 'difference':
          blendedR = Math.abs(r - tr);
          blendedG = Math.abs(g - tg);
          blendedB = Math.abs(b - tb);
          break;
        case 'normal':
        default:
          blendedR = tr;
          blendedG = tg;
          blendedB = tb;
          break;
      }

      // Linear interpolation based on tint opacity
      data[i] = clamp(Math.round(r * (1 - alpha) + blendedR * alpha), 0, 255);
      data[i + 1] = clamp(Math.round(g * (1 - alpha) + blendedG * alpha), 0, 255);
      data[i + 2] = clamp(Math.round(b * (1 - alpha) + blendedB * alpha), 0, 255);
    }

    return imageData;
  }
}
