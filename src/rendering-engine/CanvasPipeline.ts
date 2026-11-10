import { IRenderer, RenderConfig, RenderStats } from '../types';
import {
  // Character Based
  AsciiRenderer,
  // Geometric
  MosaicRenderer,
  DotsRenderer,
  CrossesRenderer,
  DiamondsRenderer,
  HexagonsRenderer,
  TrianglesRenderer,
  RingsRenderer,
  HeartsRenderer,
  StarsRenderer,
  BubblesRenderer,
  HatchRenderer,
  ContourRenderer,
  // Pixel Based
  PixelRenderer,
  HalfblocksRenderer,
  BrailleRenderer,
  // Pattern Based
  DiagonalLinesRenderer,
  LinesRenderer,
  MixedPatternsRenderer,
  VoxelsRenderer,
  LegoRenderer,
  // Special
  MatrixRainRenderer,
  HexdumpRenderer,
  DiscoRenderer,
  OriginalRenderer,
  // Retro / Dither
  DitherRenderer,
} from '../rendering-modes';
import { PostProcessingEngine } from '../image-processing/PostProcessingEngine';
import { BackgroundProcessor } from '../image-processing/BackgroundProcessor';
import { MaskingEngine } from '../image-processing/MaskingEngine';
import { LightingEngine } from '../lighting-engine/LightingEngine';

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

    // Register all 24 modular render modes
    // Character Based
    this.registerRenderer(new AsciiRenderer());

    // Geometric
    const mosaic = new MosaicRenderer();
    const dots = new DotsRenderer();
    this.registerRenderer(mosaic);
    this.registerRenderer(dots);
    this.registerRenderer(new CrossesRenderer());
    this.registerRenderer(new DiamondsRenderer());
    this.registerRenderer(new HexagonsRenderer());
    this.registerRenderer(new TrianglesRenderer());
    this.registerRenderer(new RingsRenderer());
    this.registerRenderer(new HeartsRenderer());
    this.registerRenderer(new StarsRenderer());
    this.registerRenderer(new BubblesRenderer());
    this.registerRenderer(new HatchRenderer());
    this.registerRenderer(new ContourRenderer());

    // Pixel Based
    this.registerRenderer(new PixelRenderer());
    this.registerRenderer(new HalfblocksRenderer());
    this.registerRenderer(new BrailleRenderer());

    // Pattern Based
    this.registerRenderer(new DiagonalLinesRenderer());
    this.registerRenderer(new LinesRenderer());
    this.registerRenderer(new MixedPatternsRenderer());
    this.registerRenderer(new VoxelsRenderer());
    this.registerRenderer(new LegoRenderer());

    // Special
    this.registerRenderer(new MatrixRainRenderer());
    this.registerRenderer(new HexdumpRenderer());
    this.registerRenderer(new DiscoRenderer());
    this.registerRenderer(new OriginalRenderer());

    // Dither & Retro
    this.registerRenderer(new DitherRenderer());

    // Aliases for compatibility
    this.renderers.set('pixel-mosaic', mosaic);
    this.renderers.set('halftone', dots);
    this.renderers.set('matrix', this.renderers.get('matrix-rain')!);
    this.renderers.set('none', this.renderers.get('original')!);
    this.renderers.set('raw', this.renderers.get('original')!);
    this.renderers.set('passthrough', this.renderers.get('original')!);
  }

  registerRenderer(renderer: IRenderer): void {
    this.renderers.set(renderer.mode, renderer);
  }

  attach(canvas: HTMLCanvasElement): void {
    if (this.targetCanvas === canvas && this.targetCtx) return;
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

    // 2. Render Background Layer based on background mode (original, blurred, solid, none)
    BackgroundProcessor.render(
      this.targetCtx,
      targetWidth,
      targetHeight,
      sourceImage,
      config.background
    );

    // 3. Obtain raw image data from source (with dimension cache check to avoid full re-extraction)
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

    // 4. Create working copy of raw image data and apply pre-filters (Pre-Blur, Brightness, Contrast, Saturation, Grayscale, Tint & Blend)
    // Avoids permanently modifying the source image
    const workingImageData = new ImageData(
      new Uint8ClampedArray(this.cachedImageData.data),
      targetWidth,
      targetHeight
    );
    PostProcessingEngine.applyPreFilters(workingImageData, config.color, config.blur);

    // 5. Select and execute modular rendering mode with graceful fallback
    const modeKey = config.mode as string;
    let renderer = this.renderers.get(modeKey);
    if (!renderer) {
      console.warn(`[PixelMuse Engine] Unsupported or unregistered render mode '${modeKey}', gracefully falling back to 'mosaic'.`);
      renderer = this.renderers.get('mosaic');
    }

    if (renderer) {
      renderer.render(this.targetCtx, workingImageData, config, time);
    } else {
      this.targetCtx.putImageData(workingImageData, 0, 0);
    }

    // 6. Apply Selective Alpha/Luma Masking (revealing original photograph)
    if (config.mask && config.mask.enabled) {
      MaskingEngine.applyMask(
        this.targetCtx,
        targetWidth,
        targetHeight,
        sourceImage,
        config.mask
      );
    }

    // 7. Apply Multi-Point Lighting Engine
    if (config.lighting && config.lighting.enabled) {
      LightingEngine.applyLighting(
        this.targetCtx,
        targetWidth,
        targetHeight,
        config.lighting
      );
    }

    // 8. Apply post-raster effects (bloom, vignette, scanlines, grain, aberration, glitch, dust, halftone, pixelation)
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
}
