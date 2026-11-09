import { EffectsConfig } from '../types';
import { clamp } from '../utilities';

/**
 * Modular Post-Processing Effects Pipeline.
 * Houses separate, independently toggleable processing functions for:
 * 1. Pixelation
 * 2. Halftone overlay
 * 3. Chromatic aberration
 * 4. Glitch artifacts
 * 5. Cathode bloom
 * 6. CRT scanlines
 * 7. Film grain
 * 8. Film dust & scratches
 * 9. Optical vignette
 */
export class PostEffectsPipeline {
  /**
   * Executes the post-effects stack in a disciplined, composable order.
   */
  static apply(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    effects: EffectsConfig,
    _time = 0
  ): void {
    // 1. Post-raster Pixelation
    if (effects.pixelation > 1) {
      this.applyPixelation(ctx, width, height, effects.pixelation);
    }

    // 2. Halftone Overlay
    if (effects.halftone > 0) {
      this.applyHalftoneOverlay(ctx, width, height, effects.halftone);
    }

    // 3. Chromatic Aberration
    if (effects.chromaticAberration > 0) {
      this.applyChromaticAberration(ctx, width, height, effects.chromaticAberration);
    }

    // 4. Glitch
    if (effects.glitch > 0) {
      this.applyGlitch(ctx, width, height, effects.glitch);
    }

    // 5. Bloom
    if (effects.bloom > 0) {
      this.applyBloom(ctx, width, height, effects.bloom);
    }

    // 6. CRT Scanlines
    if (effects.scanlines > 0) {
      this.applyScanlines(ctx, width, height, effects.scanlines);
    }

    // 7. Film Grain
    if (effects.filmGrain > 0) {
      this.applyFilmGrain(ctx, width, height, effects.filmGrain);
    }

    // 8. Film Dust & Scratches
    if (effects.filmDust > 0) {
      this.applyFilmDust(ctx, width, height, effects.filmDust);
    }

    // 9. Vignette
    if (effects.vignette > 0) {
      this.applyVignette(ctx, width, height, effects.vignette);
    }
  }

  /**
   * Post-raster Pixelation: Downsamples and upsamples with nearest-neighbor interpolation.
   */
  static applyPixelation(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    blockSize: number
  ): void {
    const size = Math.max(2, Math.round(blockSize));
    const smallW = Math.max(1, Math.floor(width / size));
    const smallH = Math.max(1, Math.floor(height / size));

    const offscreen = document.createElement('canvas');
    offscreen.width = smallW;
    offscreen.height = smallH;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    offCtx.imageSmoothingEnabled = false;
    offCtx.drawImage(ctx.canvas, 0, 0, smallW, smallH);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offscreen, 0, 0, width, height);
    ctx.restore();
  }

  /**
   * Halftone Dot Screen Overlay: Projects an angled circular halftone raster over the composition.
   */
  static applyHalftoneOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ): void {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = clamp(intensity, 0, 1) * 0.75;

    const dotSpacing = 8;
    const maxRadius = dotSpacing * 0.45;
    const cols = Math.ceil(width / dotSpacing);
    const rows = Math.ceil(height / dotSpacing);

    ctx.fillStyle = '#08080A';

    for (let r = 0; r < rows; r++) {
      const y = r * dotSpacing;
      for (let c = 0; c < cols; c++) {
        const x = c * dotSpacing + ((r % 2) * dotSpacing) / 2;
        ctx.beginPath();
        ctx.arc(x, y, maxRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /**
   * Chromatic Aberration: Shifts RGB color planes horizontally with screen composite.
   */
  static applyChromaticAberration(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    offset: number
  ): void {
    const shift = Math.max(1, Math.round(offset));
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.85;

    // Red shift to left
    ctx.drawImage(ctx.canvas, -shift, 0, width, height);
    // Cyan/Blue shift to right
    ctx.drawImage(ctx.canvas, shift, 0, width, height);

    ctx.restore();
  }

  /**
   * Glitch Artifacts: Slices horizontal scanlines, introduces channel offset, and horizontal shearing.
   */
  static applyGlitch(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ): void {
    ctx.save();
    const factor = clamp(intensity, 0, 1);
    const numSlices = Math.floor(factor * 6) + 1;

    for (let i = 0; i < numSlices; i++) {
      const sliceY = Math.floor(Math.random() * height);
      const sliceH = Math.floor(Math.random() * 24 + 4);
      const sliceOffset = (Math.random() - 0.5) * factor * 40;

      ctx.drawImage(
        ctx.canvas,
        0,
        sliceY,
        width,
        sliceH,
        sliceOffset,
        sliceY,
        width,
        sliceH
      );
    }

    ctx.restore();
  }

  /**
   * Cathode Phosphor Bloom: Diffuses luminous highlights across surrounding dark pixels.
   */
  static applyBloom(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bloomRadius: number
  ): void {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = `blur(${Math.max(1, Math.round(bloomRadius))}px)`;
    ctx.globalAlpha = 0.35;
    ctx.drawImage(ctx.canvas, 0, 0, width, height);
    ctx.filter = 'none';
    ctx.restore();
  }

  /**
   * CRT Scanlines: Authentic horizontal cathoderay scanlines.
   */
  static applyScanlines(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ): void {
    ctx.save();
    const alpha = clamp(intensity * 0.45, 0, 0.9);
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;

    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }

    ctx.restore();
  }

  /**
   * Stochastic Film Grain: Renders micro-scale noise distribution using overlay composite.
   */
  static applyFilmGrain(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ): void {
    ctx.save();
    const grainIntensity = clamp(intensity, 0, 1) * 0.15;
    const gSize = 128;

    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = gSize;
    grainCanvas.height = gSize;
    const gctx = grainCanvas.getContext('2d');

    if (gctx) {
      const gImg = gctx.createImageData(gSize, gSize);
      const gData = gImg.data;
      for (let i = 0; i < gData.length; i += 4) {
        const noise = (Math.random() - 0.5) * 255 * grainIntensity;
        gData[i] = clamp(128 + noise, 0, 255);
        gData[i + 1] = clamp(128 + noise, 0, 255);
        gData[i + 2] = clamp(128 + noise, 0, 255);
        gData[i + 3] = Math.floor(grainIntensity * 255);
      }
      gctx.putImageData(gImg, 0, 0);

      ctx.globalCompositeOperation = 'overlay';
      const pattern = ctx.createPattern(grainCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
    }

    ctx.restore();
  }

  /**
   * Film Dust & Microscopic Scratches: Procedural archival negative specks and hair fibers.
   */
  static applyFilmDust(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ): void {
    ctx.save();
    const factor = clamp(intensity, 0, 1);
    const count = Math.round(factor * 35);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 0.75;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;

      if (i % 4 === 0) {
        // Linear hairline scratch fiber
        const length = Math.random() * 14 + 4;
        const angle = Math.random() * Math.PI;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        ctx.stroke();
      } else {
        // Microscopic circular dust speck
        const r = Math.random() * 1.2 + 0.4;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /**
   * Optical Vignette: Radial luminance falloff simulating vintage prime lenses.
   */
  static applyVignette(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ): void {
    ctx.save();
    const radius = Math.hypot(width, height) / 2;
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      radius * 0.45,
      width / 2,
      height / 2,
      radius
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, `rgba(8, 8, 10, ${clamp(intensity, 0, 1) * 0.95})`);

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}

