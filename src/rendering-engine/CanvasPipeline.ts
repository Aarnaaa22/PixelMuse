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
  // New Independent Modules
  CrtPhosphorRenderer,
  MetallicRenderer,
  Wireframe3DRenderer,
  WaveSurfacesRenderer,
  AdvancedAsciiRenderer,
  ProceduralFieldRenderer,
  GeometricArtifactsRenderer,
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

    // Primary Modular Render Modes
    const ascii = new AsciiRenderer();
    const mosaic = new MosaicRenderer();
    const dots = new DotsRenderer();
    const crosses = new CrossesRenderer();
    const diamonds = new DiamondsRenderer();
    const hexagons = new HexagonsRenderer();
    const triangles = new TrianglesRenderer();
    const rings = new RingsRenderer();
    const hearts = new HeartsRenderer();
    const stars = new StarsRenderer();
    const bubbles = new BubblesRenderer();
    const hatch = new HatchRenderer();
    const contour = new ContourRenderer();
    const pixel = new PixelRenderer();
    const halfblocks = new HalfblocksRenderer();
    const braille = new BrailleRenderer();
    const diagonalLines = new DiagonalLinesRenderer();
    const lines = new LinesRenderer();
    const mixedPatterns = new MixedPatternsRenderer();
    const voxels = new VoxelsRenderer();
    const lego = new LegoRenderer();
    const matrixRain = new MatrixRainRenderer();
    const hexdump = new HexdumpRenderer();
    const disco = new DiscoRenderer();
    const original = new OriginalRenderer();
    const dither = new DitherRenderer();

    this.registerRenderer(ascii);
    this.renderers.set('ascii', ascii);
    this.registerRenderer(mosaic);
    this.renderers.set('mosaic', mosaic);
    this.registerRenderer(dots);
    this.renderers.set('dots', dots);
    this.registerRenderer(crosses);
    this.renderers.set('crosses', crosses);
    this.registerRenderer(diamonds);
    this.renderers.set('diamonds', diamonds);
    this.registerRenderer(hexagons);
    this.renderers.set('hexagons', hexagons);
    this.registerRenderer(triangles);
    this.renderers.set('triangles', triangles);
    this.registerRenderer(rings);
    this.renderers.set('rings', rings);
    this.registerRenderer(hearts);
    this.renderers.set('hearts', hearts);
    this.registerRenderer(stars);
    this.renderers.set('stars', stars);
    this.registerRenderer(bubbles);
    this.renderers.set('bubbles', bubbles);
    this.registerRenderer(hatch);
    this.renderers.set('hatch', hatch);
    this.registerRenderer(contour);
    this.renderers.set('contour', contour);

    this.registerRenderer(pixel);
    this.renderers.set('pixel', pixel);
    this.registerRenderer(halfblocks);
    this.renderers.set('halfblocks', halfblocks);
    this.registerRenderer(braille);
    this.renderers.set('braille', braille);

    this.registerRenderer(diagonalLines);
    this.renderers.set('diagonal-lines', diagonalLines);
    this.registerRenderer(lines);
    this.renderers.set('lines', lines);
    this.registerRenderer(mixedPatterns);
    this.renderers.set('mixed-patterns', mixedPatterns);
    this.registerRenderer(voxels);
    this.renderers.set('voxels', voxels);
    this.registerRenderer(lego);
    this.renderers.set('lego', lego);

    this.registerRenderer(matrixRain);
    this.renderers.set('matrix-rain', matrixRain);
    this.registerRenderer(hexdump);
    this.renderers.set('hexdump', hexdump);
    this.registerRenderer(disco);
    this.renderers.set('disco', disco);
    this.registerRenderer(original);
    this.renderers.set('original', original);

    this.registerRenderer(dither);
    this.renderers.set('dither', dither);

    // CRT, Phosphor & Metallic Modules
    const crt = new CrtPhosphorRenderer();
    const metallic = new MetallicRenderer();
    this.registerRenderer(crt);
    this.renderers.set('crt-phosphor', crt);
    this.renderers.set('crt-scan', crt);
    this.registerRenderer(metallic);
    this.renderers.set('metallic', metallic);

    // 3D Perspective & Depth Modules
    const cube3d = new Wireframe3DRenderer('cube');
    const globe3d = new Wireframe3DRenderer('globe');
    const knot3d = new Wireframe3DRenderer('knot');
    const pyramid3d = new Wireframe3DRenderer('pyramid');
    const torus3d = new Wireframe3DRenderer('torus');
    const mesh3d = new Wireframe3DRenderer('mesh');
    this.registerRenderer(cube3d);
    this.renderers.set('wireframe-3d', cube3d);
    this.renderers.set('wireframe-cube', cube3d);
    this.renderers.set('wireframe-globe', globe3d);
    this.renderers.set('wireframe-knot', knot3d);
    this.renderers.set('wireframe-pyramid', pyramid3d);
    this.renderers.set('wireframe-torus', torus3d);
    this.renderers.set('hero-mesh', mesh3d);

    // Wave & Fluid Modules
    const waveSurfaces = new WaveSurfacesRenderer('sinusoidal');
    const schlieren = new WaveSurfacesRenderer('schlieren');
    const reactionDiff = new WaveSurfacesRenderer('reaction-diffusion');
    this.registerRenderer(waveSurfaces);
    this.renderers.set('wave-surfaces', waveSurfaces);
    this.renderers.set('schlieren', schlieren);
    this.renderers.set('reaction-diffusion', reactionDiff);

    // Advanced Typography & ASCII Variations
    const rippleAscii = new AdvancedAsciiRenderer('ripple');
    const virtAscii = new AdvancedAsciiRenderer('virt');
    const cityAscii = new AdvancedAsciiRenderer('city');
    const typoCascade = new AdvancedAsciiRenderer('cascade');
    this.registerRenderer(rippleAscii);
    this.renderers.set('ripple-ascii', rippleAscii);
    this.renderers.set('virt-ascii', virtAscii);
    this.renderers.set('city-ascii', cityAscii);
    this.renderers.set('typo-cascade', typoCascade);

    // Procedural Field & Background Modules
    const tunnelRaymarch = new ProceduralFieldRenderer('tunnel');
    const particleWake = new ProceduralFieldRenderer('wake');
    const shimmerBg = new ProceduralFieldRenderer('shimmer');
    const ditherOrb = new ProceduralFieldRenderer('dither-orb');
    const polarFlower = new ProceduralFieldRenderer('polar-flower');
    this.registerRenderer(tunnelRaymarch);
    this.renderers.set('tunnel-raymarch', tunnelRaymarch);
    this.renderers.set('particle-wake', particleWake);
    this.renderers.set('shimmer-bg', shimmerBg);
    this.renderers.set('dither-orb', ditherOrb);
    this.renderers.set('polar-flower', polarFlower);

    // Geometric Artifacts & Dither Hybrids
    const cruciform = new GeometricArtifactsRenderer('cruciform');
    const crossStitch = new GeometricArtifactsRenderer('cross-stitch');
    const linocutRings = new GeometricArtifactsRenderer('linocut-rings');
    const constellation = new GeometricArtifactsRenderer('constellation');
    const ditherFlicker = new GeometricArtifactsRenderer('dither-flicker');
    this.registerRenderer(cruciform);
    this.renderers.set('cruciform', cruciform);
    this.renderers.set('cross-stitch', crossStitch);
    this.renderers.set('linocut-rings', linocutRings);
    this.renderers.set('constellation', constellation);
    this.renderers.set('dither-flicker', ditherFlicker);

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
