import { clamp } from '../utilities';

export function applyInvert(imageData: ImageData): ImageData {
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return imageData;
}

export function applyGrayscale(imageData: ImageData): ImageData {
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    const avg = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
  return imageData;
}

export function applyTint(
  imageData: ImageData,
  tintColor: { r: number; g: number; b: number },
  intensity = 0.5
): ImageData {
  const { data } = imageData;
  const factor = clamp(intensity, 0, 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * (1 - factor) + tintColor.r * factor);
    data[i + 1] = Math.round(data[i + 1] * (1 - factor) + tintColor.g * factor);
    data[i + 2] = Math.round(data[i + 2] * (1 - factor) + tintColor.b * factor);
  }
  return imageData;
}

export function applyPosterize(imageData: ImageData, levels = 4): ImageData {
  const { data } = imageData;
  const numLevels = Math.max(2, Math.min(16, levels));
  const step = 255 / (numLevels - 1);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(Math.round(data[i] / step) * step);
    data[i + 1] = Math.round(Math.round(data[i] / step) * step);
    data[i + 2] = Math.round(Math.round(data[i] / step) * step);
  }
  return imageData;
}

export function applyGamma(imageData: ImageData, gamma = 1.0): ImageData {
  const { data } = imageData;
  const invGamma = 1 / Math.max(0.1, gamma);
  const lookup = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    lookup[i] = clamp(Math.round(Math.pow(i / 255, invGamma) * 255), 0, 255);
  }

  for (let i = 0; i < data.length; i += 4) {
    data[i] = lookup[data[i]];
    data[i + 1] = lookup[data[i + 1]];
    data[i + 2] = lookup[data[i + 2]];
  }
  return imageData;
}

export function applySaturation(imageData: ImageData, saturation = 1.0): ImageData {
  const { data } = imageData;
  const sat = clamp(saturation, 0, 3);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    data[i] = clamp(Math.round(gray + (r - gray) * sat), 0, 255);
    data[i + 1] = clamp(Math.round(gray + (g - gray) * sat), 0, 255);
    data[i + 2] = clamp(Math.round(gray + (b - gray) * sat), 0, 255);
  }
  return imageData;
}
