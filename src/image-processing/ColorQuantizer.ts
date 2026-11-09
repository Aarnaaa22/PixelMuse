import { ColorRGB } from '../types';
import { hexToRgb, findNearestColor } from '../utilities';

export class ColorQuantizer {
  private paletteCache: Map<string, ColorRGB[]> = new Map();

  getParsedPalette(hexColors: string[]): ColorRGB[] {
    const key = hexColors.join(',');
    if (!this.paletteCache.has(key)) {
      this.paletteCache.set(key, hexColors.map(hexToRgb));
    }
    return this.paletteCache.get(key)!;
  }

  quantizePixel(target: ColorRGB, paletteHex: string[]): ColorRGB {
    const parsed = this.getParsedPalette(paletteHex);
    return findNearestColor(target, parsed);
  }
}

export const quantizer = new ColorQuantizer();

