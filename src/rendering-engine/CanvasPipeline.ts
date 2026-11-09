import { IRenderer, RenderConfig, RenderMode, RenderStats } from '../types';
import { AsciiRenderer, DitherRenderer, PixelMosaicRenderer, HalftoneRenderer } from '../rendering-modes';

export class CanvasPipeline {
  private targetCanvas: HTMLCanvasElement | null = null;
  private targetCtx: CanvasRenderingContext2D | null = null;
  
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;

  private renderers: Map<RenderMode, IRenderer> = new Map();
  private lastStats: RenderStats = {
    fps: 60,
    renderTimeMs: 0,
    pixelCount: 0,
    elementCount: 0,
    canvasWidth: 0,
    canvasHeight: 0,
  };

  constructor() {
    this.offscreenCanvas = document.createElement('canvas');
    const ctx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Failed to initialize offscreen canvas context');
    this.offscreenCtx = ctx;

    // Register built-in rendering engines
    this.registerRenderer(new AsciiRenderer());
    this.registerRenderer(new DitherRenderer());
    this.registerRenderer(new PixelMosaicRenderer());
    this.registerRenderer(new HalftoneRenderer());
  }

  registerRenderer(renderer: IRenderer): void {
    this.renderers.set(renderer.mode, renderer);
  }

  attach(canvas: HTMLCanvasElement): void {
    this.targetCanvas = canvas;
    this.targetCtx = canvas.getContext('2d', { alpha: false });
  }

  detach(): void {
    this.targetCanvas = null;
    this.targetCtx = null;
  }

  getStats(): RenderStats {
    return { ...this.lastStats };
  }

  /**
   * Primary pipeline execution method.
   * Completely decoupled from React lifecycles.
   */
  execute(
    sourceImage: CanvasImageSource,
    srcWidth: number,
    srcHeight: number,
    config: RenderConfig,
    time = 0
  ): RenderStats {
    if (!this.targetCanvas || !this.targetCtx) {
      return this.lastStats;
    }

    const startTime = performance.now();

    // Scale canvas buffer matching source
    const targetWidth = Math.round(srcWidth * config.resolutionScale);
    const targetHeight = Math.round(srcHeight * config.resolutionScale);

    if (this.targetCanvas.width !== targetWidth || this.targetCanvas.height !== targetHeight) {
      this.targetCanvas.width = targetWidth;
      this.targetCanvas.height = targetHeight;
    }

    if (this.offscreenCanvas.width !== targetWidth || this.offscreenCanvas.height !== targetHeight) {
      this.offscreenCanvas.width = targetWidth;
      this.offscreenCanvas.height = targetHeight;
    }

    // Step 1: Draw source image to offscreen canvas to obtain raw ImageData
    this.offscreenCtx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);
    const sourceImageData = this.offscreenCtx.getImageData(0, 0, targetWidth, targetHeight);

    // Step 2: Select rendering mode implementation
    const renderer = this.renderers.get(config.mode);
    if (!renderer) {
      // Fallback: direct blit
      this.targetCtx.putImageData(sourceImageData, 0, 0);
    } else {
      renderer.render(this.targetCtx, sourceImageData, config, time);
    }

    const elapsed = performance.now() - startTime;

    this.lastStats = {
      fps: elapsed > 0 ? Math.min(60, Math.round(1000 / elapsed)) : 60,
      renderTimeMs: Math.round(elapsed * 10) / 10,
      pixelCount: targetWidth * targetHeight,
      elementCount: Math.round((targetWidth * targetHeight) / 64),
      canvasWidth: targetWidth,
      canvasHeight: targetHeight,
    };

    return this.lastStats;
  }
}

