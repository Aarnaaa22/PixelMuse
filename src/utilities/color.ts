import { ColorRGB } from '../types';

export function hexToRgb(hex: string): ColorRGB {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return '#' + [clamp(r), clamp(g), clamp(b)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Standard Rec. 709 relative luminance formula
 */
export function getLuminance(r: number, g: number, b: number): number {
  return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
}

/**
 * Euclidean distance in RGB color space
 */
export function colorDistance(c1: ColorRGB, c2: ColorRGB): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Find closest matching color from a discrete palette
 */
export function findNearestColor(target: ColorRGB, paletteRgb: ColorRGB[]): ColorRGB {
  let minDistance = Infinity;
  let closest = paletteRgb[0] || { r: 0, g: 0, b: 0 };

  for (let i = 0; i < paletteRgb.length; i++) {
    const candidate = paletteRgb[i];
    const dist = colorDistance(target, candidate);
    if (dist < minDistance) {
      minDistance = dist;
      closest = candidate;
    }
  }

  return closest;
}

