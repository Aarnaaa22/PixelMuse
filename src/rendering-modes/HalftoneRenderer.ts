import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { getLuminance } from '../utilities';

export class HalftoneRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'halftone';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { halftone, palette } = config;
    const { width, height, data } = source;

    this.clearCanvas(ctx, '#08080A');

    const dotSize = Math.max(4, halftone.dotSize);
    const maxRadius = (dotSize * 0.75);
    const cols = Math.ceil(width / dotSize);
    const rows = Math.ceil(height / dotSize);

    const primaryColor = palette.colors[palette.colors.length - 1] || '#CCFF00';

    ctx.save();
    ctx.fillStyle = primaryColor;

    for (let r = 0; r < rows; r++) {
      const y = r * dotSize;
      for (let c = 0; c < cols; c++) {
        const x = c * dotSize;
        const sampleX = Math.min(width - 1, Math.floor(x + dotSize / 2));
        const sampleY = Math.min(height - 1, Math.floor(y + dotSize / 2));
        const idx = (sampleY * width + sampleX) * 4;

        const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);
        const radius = (1 - lum) * maxRadius;

        if (radius > 0.5) {
          ctx.beginPath();
          ctx.arc(x + dotSize / 2, y + dotSize / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }
}

