import { IRenderer, RenderConfig, RenderMode } from '../types';

export abstract class BaseRenderer implements IRenderer {
  abstract readonly mode: RenderMode;

  abstract render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void;

  protected clearCanvas(ctx: CanvasRenderingContext2D, color = '#08080A'): void {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }
}

