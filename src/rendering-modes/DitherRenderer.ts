import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode, ColorRGB } from '../types';
import { BAYER_4X4, BAYER_8X8, getLuminance, hexToRgb, findNearestColor } from '../utilities';

export class DitherRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'dither';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { dither, palette } = config;

    const paletteColors = palette.colors.map(hexToRgb);
    if (paletteColors.length === 0) {
      paletteColors.push({ r: 8, g: 8, b: 10 }, { r: 204, g: 255, b: 0 });
    }

    if (dither.algorithm === 'atkinson') {
      this.renderAtkinson(ctx, source, paletteColors, dither.scale);
    } else if (dither.algorithm === 'floyd-steinberg') {
      this.renderFloydSteinberg(ctx, source, paletteColors, dither.scale, dither.serpentine);
    } else {
      // Ordered Bayer
      this.renderBayer(
        ctx,
        source,
        paletteColors,
        dither.algorithm === 'bayer-8x8' ? 8 : 4,
        dither.scale
      );
    }
  }

  /**
   * Ordered Bayer Dithering
   */
  private renderBayer(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    paletteColors: ColorRGB[],
    matrixSize: 4 | 8,
    rawScale: number
  ): void {
    const { width, height, data } = source;
    const output = ctx.createImageData(width, height);
    const outData = output.data;

    const matrix = matrixSize === 8 ? BAYER_8X8 : BAYER_4X4;
    const scale = Math.max(1, Math.round(rawScale));
    const darkColor = paletteColors[0];
    const lightColor = paletteColors[paletteColors.length - 1];

    for (let y = 0; y < height; y++) {
      const my = Math.floor(y / scale) % matrixSize;
      for (let x = 0; x < width; x++) {
        const mx = Math.floor(x / scale) % matrixSize;
        const threshold = matrix[my][mx];

        const idx = (y * width + x) * 4;
        const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);

        const chosen = lum > threshold ? lightColor : darkColor;

        outData[idx] = chosen.r;
        outData[idx + 1] = chosen.g;
        outData[idx + 2] = chosen.b;
        outData[idx + 3] = 255;
      }
    }

    ctx.putImageData(output, 0, 0);
  }

  /**
   * Atkinson Dithering (Apple MacPaint 1984, preserves 75% error for clean, crisp grain)
   * Pattern:
   *        *   1/8  1/8
   *  1/8  1/8  1/8
   *       1/8
   */
  private renderAtkinson(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    paletteColors: ColorRGB[],
    rawScale: number
  ): void {
    const { width, height, data } = source;
    const scale = Math.max(1, Math.round(rawScale));
    const sw = Math.floor(width / scale);
    const sh = Math.floor(height / scale);

    // Working float buffer for error diffusion
    const bufR = new Float32Array(sw * sh);
    const bufG = new Float32Array(sw * sh);
    const bufB = new Float32Array(sw * sh);

    // Downsample/sample into work buffer
    for (let y = 0; y < sh; y++) {
      const sy = Math.min(height - 1, y * scale);
      for (let x = 0; x < sw; x++) {
        const sx = Math.min(width - 1, x * scale);
        const sIdx = (sy * width + sx) * 4;
        const bIdx = y * sw + x;
        bufR[bIdx] = data[sIdx];
        bufG[bIdx] = data[sIdx + 1];
        bufB[bIdx] = data[sIdx + 2];
      }
    }

    const output = ctx.createImageData(width, height);
    const outData = output.data;

    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const bIdx = y * sw + x;
        const oldR = Math.max(0, Math.min(255, bufR[bIdx]));
        const oldG = Math.max(0, Math.min(255, bufG[bIdx]));
        const oldB = Math.max(0, Math.min(255, bufB[bIdx]));

        const nearest = findNearestColor({ r: oldR, g: oldG, b: oldB }, paletteColors);

        // Blit back scaled cell to output
        for (let dy = 0; dy < scale; dy++) {
          const py = y * scale + dy;
          if (py >= height) break;
          for (let dx = 0; dx < scale; dx++) {
            const px = x * scale + dx;
            if (px >= width) break;
            const oIdx = (py * width + px) * 4;
            outData[oIdx] = nearest.r;
            outData[oIdx + 1] = nearest.g;
            outData[oIdx + 2] = nearest.b;
            outData[oIdx + 3] = 255;
          }
        }

        // Atkinson error (divided by 8)
        const errR = (oldR - nearest.r) / 8;
        const errG = (oldG - nearest.g) / 8;
        const errB = (oldB - nearest.b) / 8;

        const diffuse = (tx: number, ty: number) => {
          if (tx >= 0 && tx < sw && ty >= 0 && ty < sh) {
            const idx = ty * sw + tx;
            bufR[idx] += errR;
            bufG[idx] += errG;
            bufB[idx] += errB;
          }
        };

        // Atkinson neighbors (6 neighbors each receive 1/8)
        diffuse(x + 1, y);
        diffuse(x + 2, y);
        diffuse(x - 1, y + 1);
        diffuse(x, y + 1);
        diffuse(x + 1, y + 1);
        diffuse(x, y + 2);
      }
    }

    ctx.putImageData(output, 0, 0);
  }

  /**
   * Floyd-Steinberg Dithering with Serpentine Scan
   * Pattern:
   *       *   7/16
   * 3/16 5/16 1/16
   */
  private renderFloydSteinberg(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    paletteColors: ColorRGB[],
    rawScale: number,
    serpentine: boolean
  ): void {
    const { width, height, data } = source;
    const scale = Math.max(1, Math.round(rawScale));
    const sw = Math.floor(width / scale);
    const sh = Math.floor(height / scale);

    const bufR = new Float32Array(sw * sh);
    const bufG = new Float32Array(sw * sh);
    const bufB = new Float32Array(sw * sh);

    for (let y = 0; y < sh; y++) {
      const sy = Math.min(height - 1, y * scale);
      for (let x = 0; x < sw; x++) {
        const sx = Math.min(width - 1, x * scale);
        const sIdx = (sy * width + sx) * 4;
        const bIdx = y * sw + x;
        bufR[bIdx] = data[sIdx];
        bufG[bIdx] = data[sIdx + 1];
        bufB[bIdx] = data[sIdx + 2];
      }
    }

    const output = ctx.createImageData(width, height);
    const outData = output.data;

    for (let y = 0; y < sh; y++) {
      const isReverse = serpentine && y % 2 === 1;
      const startX = isReverse ? sw - 1 : 0;
      const endX = isReverse ? -1 : sw;
      const step = isReverse ? -1 : 1;

      for (let x = startX; x !== endX; x += step) {
        const bIdx = y * sw + x;
        const oldR = Math.max(0, Math.min(255, bufR[bIdx]));
        const oldG = Math.max(0, Math.min(255, bufG[bIdx]));
        const oldB = Math.max(0, Math.min(255, bufB[bIdx]));

        const nearest = findNearestColor({ r: oldR, g: oldG, b: oldB }, paletteColors);

        for (let dy = 0; dy < scale; dy++) {
          const py = y * scale + dy;
          if (py >= height) break;
          for (let dx = 0; dx < scale; dx++) {
            const px = x * scale + dx;
            if (px >= width) break;
            const oIdx = (py * width + px) * 4;
            outData[oIdx] = nearest.r;
            outData[oIdx + 1] = nearest.g;
            outData[oIdx + 2] = nearest.b;
            outData[oIdx + 3] = 255;
          }
        }

        const errR = oldR - nearest.r;
        const errG = oldG - nearest.g;
        const errB = oldB - nearest.b;

        const diffuse = (tx: number, ty: number, weight: number) => {
          if (tx >= 0 && tx < sw && ty >= 0 && ty < sh) {
            const idx = ty * sw + tx;
            bufR[idx] += errR * weight;
            bufG[idx] += errG * weight;
            bufB[idx] += errB * weight;
          }
        };

        if (!isReverse) {
          diffuse(x + 1, y, 7 / 16);
          diffuse(x - 1, y + 1, 3 / 16);
          diffuse(x, y + 1, 5 / 16);
          diffuse(x + 1, y + 1, 1 / 16);
        } else {
          diffuse(x - 1, y, 7 / 16);
          diffuse(x + 1, y + 1, 3 / 16);
          diffuse(x, y + 1, 5 / 16);
          diffuse(x - 1, y + 1, 1 / 16);
        }
      }
    }

    ctx.putImageData(output, 0, 0);
  }
}
