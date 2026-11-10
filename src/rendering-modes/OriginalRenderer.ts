import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';

/**
 * OriginalRenderer
 * Displays the original, pristine source photograph without generative rasterization.
 * Supports all active color adjustments, pre-filters, lighting, masking, and post-processing.
 */
export class OriginalRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'original';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    _config: RenderConfig,
    _time: number
  ): void {
    ctx.putImageData(source, 0, 0);
  }
}

