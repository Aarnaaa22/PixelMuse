import { ColorConfig, EffectsConfig } from '../types';
import { clamp, hexToRgb } from '../utilities';
import { applyGrayscale, applySaturation, applyTint } from './Filters';

export class PostProcessingEngine {
  /**
   * Applies pre-raster photographic sensor adjustments:
   * Brightness, Contrast, Saturation, Grayscale, Chromatic Tint.
   */
  static applyPreFilters(imageData: ImageData, color: ColorConfig): ImageData {
    const { data } = imageData;
    const len = data.length;

    // Apply brightness and contrast
    if (color.brightness !== 0 || color.contrast !== 0) {
      const bOffset = color.brightness * 1.5;
      const contrastFactor =
        (259 * (color.contrast + 255)) / (255 * (259 - color.contrast) || 1);

      for (let i = 0; i < len; i += 4) {
        let r = data[i] + bOffset;
        let g = data[i + 1] + bOffset;
        let b = data[i + 2] + bOffset;

        data[i] = clamp(contrastFactor * (r - 128) + 128, 0, 255);
        data[i + 1] = clamp(contrastFactor * (g - 128) + 128, 0, 255);
        data[i + 2] = clamp(contrastFactor * (b - 128) + 128, 0, 255);
      }
    }

    // Apply saturation
    if (color.saturation !== 1.0) {
      applySaturation(imageData, color.saturation);
    }

    // Apply grayscale
    if (color.grayscale) {
      applyGrayscale(imageData);
    }

    // Apply tint
    if (color.tintOpacity > 0 && color.tintColor) {
      const tintRgb = hexToRgb(color.tintColor);
      applyTint(imageData, tintRgb, color.tintOpacity);
    }

    return imageData;
  }

  /**
   * Applies post-raster effects directly onto the target 2D canvas:
   * Bloom, Vignette, CRT Scanlines, Film Grain, Chromatic Aberration, Glitch.
   */
  static applyPostEffects(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    effects: EffectsConfig,
    _time = 0
  ): void {
    // 1. Chromatic Aberration & Glitch Displacements
    if (effects.chromaticAberration > 0 || effects.glitch > 0) {
      const shift = effects.chromaticAberration;
      if (shift > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(ctx.canvas, -shift, 0, width, height);
        ctx.restore();
      }

      if (effects.glitch > 0) {
        ctx.save();
        const numSlices = Math.floor(effects.glitch * 5);
        for (let i = 0; i < numSlices; i++) {
          const sliceY = Math.floor(Math.random() * height);
          const sliceH = Math.floor(Math.random() * 20 + 4);
          const sliceOffset = (Math.random() - 0.5) * effects.glitch * 30;
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
    }

    // 2. CRT Scanlines
    if (effects.scanlines > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${effects.scanlines * 0.4})`;
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }
      ctx.restore();
    }

    // 3. Vignette
    if (effects.vignette > 0) {
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
      vignette.addColorStop(1, `rgba(8, 8, 10, ${effects.vignette * 0.95})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // 4. Procedural Film Grain
    if (effects.filmGrain > 0) {
      ctx.save();
      const grainIntensity = effects.filmGrain * 0.12;
      const grainCanvas = document.createElement('canvas');
      const gSize = 120;
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

    // 5. Cathode Phosphor Bloom
    if (effects.bloom > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = `blur(${Math.round(effects.bloom)}px)`;
      ctx.globalAlpha = 0.3;
      ctx.drawImage(ctx.canvas, 0, 0, width, height);
      ctx.restore();
    }
  }
}
