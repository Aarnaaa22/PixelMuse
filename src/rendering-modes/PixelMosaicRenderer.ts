import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { quantizer } from '../image-processing/ColorQuantizer';

export class PixelMosaicRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'pixel-mosaic';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { mosaic, palette } = config;
    const { width, height, data } = source;

    this.clearCanvas(ctx, '#08080A');

    const cellSize = Math.max(4, mosaic.cellSize);
    const gap = Math.max(0, mosaic.gap);
    const renderSize = Math.max(1, cellSize - gap);

    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    ctx.save();

    for (let r = 0; r < rows; r++) {
      const y = r * cellSize;
      for (let c = 0; c < cols; c++) {
        const x = c * cellSize;

        // Sample center of cell
        const sampleX = Math.min(width - 1, Math.floor(x + cellSize / 2));
        const sampleY = Math.min(height - 1, Math.floor(y + cellSize / 2));
        const idx = (sampleY * width + sampleX) * 4;

        const originalRgb = {
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2],
        };

        const targetColor = mosaic.preserveEdges
          ? originalRgb
          : quantizer.quantizePixel(originalRgb, palette.colors);

        ctx.fillStyle = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;

        if (mosaic.shape === 'circle') {
          const radius = renderSize / 2;
          ctx.beginPath();
          ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (mosaic.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(x + renderSize / 2, y);
          ctx.lineTo(x + renderSize, y + renderSize / 2);
          ctx.lineTo(x + renderSize / 2, y + renderSize);
          ctx.lineTo(x, y + renderSize / 2);
          ctx.closePath();
          ctx.fill();
        } else {
          // Default square
          ctx.fillRect(x, y, renderSize, renderSize);
        }
      }
    }

    ctx.restore();
  }
}

