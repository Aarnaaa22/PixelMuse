import { ColorConfig, EffectsConfig, BlurConfig } from '../types';
import { ColorPipeline } from './ColorPipeline';
import { PostEffectsPipeline } from './PostEffectsPipeline';
import { BlurEngine } from './BlurEngine';

/**
 * Unified Post-Processing & Pre-Filtering Engine.
 * Coordinates Color Adjustments, Blur passes, and Post-Raster Effects in strict, composable order.
 */
export class PostProcessingEngine {
  /**
   * Applies pre-raster photographic sensor adjustments:
   * Optional Pre-Blur -> Brightness & Contrast -> Saturation -> Grayscale -> Chromatic Tint & Blend.
   */
  static applyPreFilters(
    imageData: ImageData,
    color: ColorConfig,
    blur?: BlurConfig
  ): ImageData {
    // 1. Optional Pre-Blur on Image Buffer
    if (blur && blur.type !== 'off' && blur.radius > 0) {
      BlurEngine.applyImageDataBoxBlur(imageData, blur.radius);
    }

    // 2. Color Processing Pipeline
    return ColorPipeline.process(imageData, color);
  }

  /**
   * Applies post-raster effects directly onto the target 2D canvas:
   * Pixelation -> Halftone -> Chromatic Aberration -> Glitch -> Bloom -> Scanlines -> Grain -> Film Dust -> Vignette.
   */
  static applyPostEffects(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    effects: EffectsConfig,
    time = 0
  ): void {
    PostEffectsPipeline.apply(ctx, width, height, effects, time);
  }
}
