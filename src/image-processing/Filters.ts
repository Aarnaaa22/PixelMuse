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

export function applyTint(imageData: ImageData, tintColor: { r: number; g: number; b: number }, intensity = 0.5): ImageData {
  const { data } = imageData;
  const factor = clamp(intensity, 0, 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * (1 - factor) + tintColor.r * factor);
    data[i + 1] = Math.round(data[i + 1] * (1 - factor) + tintColor.g * factor);
    data[i + 2] = Math.round(data[i + 2] * (1 - factor) + tintColor.b * factor);
  }
  return imageData;
}

