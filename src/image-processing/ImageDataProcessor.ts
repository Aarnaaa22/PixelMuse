import { getLuminance, clamp } from '../utilities';

export class ImageDataProcessor {
  /**
   * Generates a 1D Float32Array of normalized luminance values (0..1)
   * with brightness and contrast adjustments applied.
   */
  static extractLuminanceMap(
    imageData: ImageData,
    brightness = 0, // -100 to 100
    contrast = 0 // -100 to 100
  ): Float32Array {
    const { data, width, height } = imageData;
    const len = width * height;
    const lumMap = new Float32Array(len);

    // Contrast factor: F = (259 * (C + 255)) / (255 * (259 - C))
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast) || 1);
    const bOffset = brightness * 1.5;

    for (let i = 0, p = 0; i < len; i++, p += 4) {
      let r = data[p];
      let g = data[p + 1];
      let b = data[p + 2];

      // Apply brightness
      r = clamp(r + bOffset, 0, 255);
      g = clamp(g + bOffset, 0, 255);
      b = clamp(b + bOffset, 0, 255);

      // Apply contrast
      r = clamp(contrastFactor * (r - 128) + 128, 0, 255);
      g = clamp(contrastFactor * (g - 128) + 128, 0, 255);
      b = clamp(contrastFactor * (b - 128) + 128, 0, 255);

      lumMap[i] = getLuminance(r, g, b);
    }

    return lumMap;
  }

  /**
   * Resizes image data to target width/height using an offscreen canvas
   */
  static sampleDown(
    sourceCanvas: CanvasImageSource,
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number
  ): ImageData {
    const offscreen = document.createElement('canvas');
    offscreen.width = targetWidth;
    offscreen.height = targetHeight;
    const ctx = offscreen.getContext('2d');
    if (!ctx) throw new Error('Could not create offscreen context');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(sourceCanvas, 0, 0, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
    return ctx.getImageData(0, 0, targetWidth, targetHeight);
  }
}

