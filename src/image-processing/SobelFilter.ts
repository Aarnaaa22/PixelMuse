import { clamp, getLuminance } from '../utilities';

export interface EdgeMapResult {
  magnitude: Float32Array; // 0 to 1 edge intensity
  width: number;
  height: number;
}

/**
 * High-performance 3x3 Sobel convolution filter
 * for edge detection and line preservation in generative art rendering.
 */
export class SobelFilter {
  static computeEdgeMap(imageData: ImageData, threshold = 0.15): EdgeMapResult {
    const { width, height, data } = imageData;
    const len = width * height;
    const lum = new Float32Array(len);
    const magnitude = new Float32Array(len);

    // Step 1: Precompute luminance array
    for (let i = 0, p = 0; i < len; i++, p += 4) {
      lum[i] = getLuminance(data[p], data[p + 1], data[p + 2]);
    }

    // Step 2: Convolve with Sobel X & Y kernels
    // Gx: [-1 0 1, -2 0 2, -1 0 1]
    // Gy: [-1 -2 -1, 0 0 0, 1 2 1]
    for (let y = 1; y < height - 1; y++) {
      const yPrev = (y - 1) * width;
      const yCurr = y * width;
      const yNext = (y + 1) * width;

      for (let x = 1; x < width - 1; x++) {
        const xPrev = x - 1;
        const xNext = x + 1;

        const gx =
          -1 * lum[yPrev + xPrev] + 1 * lum[yPrev + xNext] +
          -2 * lum[yCurr + xPrev] + 2 * lum[yCurr + xNext] +
          -1 * lum[yNext + xPrev] + 1 * lum[yNext + xNext];

        const gy =
          -1 * lum[yPrev + xPrev] - 2 * lum[yPrev + x] - 1 * lum[yPrev + xNext] +
           1 * lum[yNext + xPrev] + 2 * lum[yNext + x] + 1 * lum[yNext + xNext];

        const mag = Math.sqrt(gx * gx + gy * gy);
        const idx = yCurr + x;
        magnitude[idx] = mag >= threshold ? clamp(mag, 0, 1) : 0;
      }
    }

    return { magnitude, width, height };
  }
}

