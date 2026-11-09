import { IRenderer, RenderConfig, RenderStats } from '../types';
import {
  MosaicRenderer,
  PixelRenderer,
  AsciiRenderer,
  DotsRenderer,
  DitherRenderer,
} from '../rendering-modes';
import { PostProcessingEngine } from '../image-processing/PostProcessingEngine';

export class CanvasPipeline {
  private targetCanvas: HTMLCanvasElement | null = null;
  private targetCtx: CanvasRenderingContext2D | null = null;

  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;

  private renderers: Map<string, IRenderer> = new Map();
  private lastStats: RenderStats = {
    fps: 60,
    renderTimeMs: 0,
    pixelCount: 0,
    elementCount: 0,
    canvasWidth: 0,
    canvasHeight: 0,
  };

  // Performance cache
  private cachedSource: CanvasImageSource | null = null;
  private cachedWidth = 0;
  private cachedHeight = 0;
  private cachedImageData: ImageData | null = null;

  constructor() {
    this.offscreenCanvas = document.createElement('canvas');
    const ctx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Failed to initialize offscreen canvas context');
    this.offscreenCtx = ctx;

    // Register all initial render modes
    const mosaic = new MosaicRenderer();
    const pixel = new PixelRenderer();
    const ascii = new AsciiRenderer();
    const dots = new DotsRenderer();
    const dither = new DitherRenderer();

    this.registerRenderer(mosaic);
    this.registerRenderer(pixel);
    this.registerRenderer(ascii);
    this.registerRenderer(dots);
    this.registerRenderer(dither);

    // Aliases for compatibility
    this.renderers.set('pixel-mosaic', mosaic);
    this.renderers.set('halftone', dots);
  }

  registerRenderer(renderer: IRenderer): void {
    this.renderers.set(renderer.mode, renderer);
  }

  attach(canvas: HTMLCanvasElement): void {
    this.targetCanvas = canvas;
    this.targetCtx = canvas.getContext('2d', { alpha: true });
  }

  detach(): void {
    this.targetCanvas = null;
    this.targetCtx = null;
    this.cachedImageData = null;
    this.cachedSource = null;
  }

  getStats(): RenderStats {
    return { ...this.lastStats };
  }

  /**
   * Primary pipeline execution method.
   * Runs the complete 7-step core rasterization and post-processing pipeline.
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

    // 1. Calculate target dimensions based on resolution scale
    const targetWidth = Math.max(32, Math.round(srcWidth * config.resolutionScale));
    const targetHeight = Math.max(32, Math.round(srcHeight * config.resolutionScale));

    if (this.targetCanvas.width !== targetWidth || this.targetCanvas.height !== targetHeight) {
      this.targetCanvas.width = targetWidth;
      this.targetCanvas.height = targetHeight;
    }

    if (this.offscreenCanvas.width !== targetWidth || this.offscreenCanvas.height !== targetHeight) {
      this.offscreenCanvas.width = targetWidth;
      this.offscreenCanvas.height = targetHeight;
      this.cachedImageData = null;
    }

    // 2. Render Background Layer based on backgroundMode, opacity, blur
    this.renderBackground(targetWidth, targetHeight, sourceImage, config);

    // 3. Obtain raw image data from source (with dimension cache check)
    if (
      !this.cachedImageData ||
      this.cachedSource !== sourceImage ||
      this.cachedWidth !== targetWidth ||
      this.cachedHeight !== targetHeight
    ) {
      this.offscreenCtx.clearRect(0, 0, targetWidth, targetHeight);
      this.offscreenCtx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);
      this.cachedImageData = this.offscreenCtx.getImageData(0, 0, targetWidth, targetHeight);
      this.cachedSource = sourceImage;
      this.cachedWidth = targetWidth;
      this.cachedHeight = targetHeight;
    }

    // 4. Create working copy of raw image data and apply pre-filters (brightness, contrast, saturation, grayscale, tint)
    const workingImageData = new ImageData(
      new Uint8ClampedArray(this.cachedImageData.data),
      targetWidth,
      targetHeight
    );
    PostProcessingEngine.applyPreFilters(workingImageData, config.color);

    // 5. Select and execute modular rendering mode
    const modeKey = config.mode as string;
    const renderer = this.renderers.get(modeKey) || this.renderers.get('mosaic');

    if (renderer) {
      renderer.render(this.targetCtx, workingImageData, config, time);
    } else {
      this.targetCtx.putImageData(workingImageData, 0, 0);
    }

    // 6. Apply post-raster effects (bloom, vignette, scanlines, grain, aberration, glitch)
    PostProcessingEngine.applyPostEffects(
      this.targetCtx,
      targetWidth,
      targetHeight,
      config.effects,
      time
    );

    const elapsed = performance.now() - startTime;
    const effectiveCellSize = Math.max(2, config.renderParams.cellSize);
    const elementCount = Math.round((targetWidth * targetHeight) / (effectiveCellSize * effectiveCellSize));

    this.lastStats = {
      fps: elapsed > 0 ? Math.min(60, Math.round(1000 / elapsed)) : 60,
      renderTimeMs: Math.round(elapsed * 10) / 10,
      pixelCount: targetWidth * targetHeight,
      elementCount,
      canvasWidth: targetWidth,
      canvasHeight: targetHeight,
    };

    return this.lastStats;
  }

  /**
   * Renders the background pass based on config.background settings:
   * solid, transparent, source-blur, or grid.
   */
  private renderBackground(
    width: number,
    height: number,
    sourceImage: CanvasImageSource,
    config: RenderConfig
  ): void {
    if (!this.targetCtx) return;
    const ctx = this.targetCtx;
    const { background } = config;

    ctx.save();

    if (background.mode === 'transparent') {
      ctx.clearRect(0, 0, width, height);
    } else if (background.mode === 'source-blur') {
      ctx.clearRect(0, 0, width, height);
      ctx.filter = `blur(${Math.max(0, background.blur)}px)`;
      ctx.globalAlpha = background.opacity;
      ctx.drawImage(sourceImage, 0, 0, width, height);
      ctx.filter = 'none';
      ctx.globalAlpha = 1.0;
    } else if (background.mode === 'grid') {
      ctx.fillStyle = background.color || '#08080A';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else {
      // Default solid
      ctx.fillStyle = background.color || '#08080A';
      ctx.globalAlpha = background.opacity;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1.0;
    }

    ctx.restore();
  }
}
