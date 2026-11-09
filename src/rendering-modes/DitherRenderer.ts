import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { BAYER_4X4, BAYER_8X8, getLuminance, hexToRgb } from '../utilities';

export class DitherRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'dither';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { dither, palette } = config;
    const { width, height, data } = source;

    // Create target buffer
    const output = ctx.createImageData(width, height);
    const outData = output.data;

    const paletteColors = palette.colors.map(hexToRgb);
    const darkColor = paletteColors[0] || { r: 8, g: 8, b: 10 };
    const lightColor = paletteColors[paletteColors.length - 1] || { r: 204, g: 255, b: 0 };

    const isBayer8 = dither.algorithm === 'bayer-8x8';
    const matrix = isBayer8 ? BAYER_8X8 : BAYER_4X4;
    const matrixSize = isBayer8 ? 8 : 4;
    const scale = Math.max(1, Math.round(dither.scale));

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
}

