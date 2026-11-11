import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { SobelFilter } from '../image-processing/SobelFilter';
import { clamp } from '../utilities';

/**
 * Independent, reusable Metallic & Specular Chrome rendering module.
 * - Sobel gradient filter extracts normal vectors (Nx, Ny, Nz)
 * - Simulates liquid mercury and specular chrome reflection bands
 * - High-contrast metallic reflection curves modulated by surface angle atan2(Ny, Nx)
 * - Dynamic light angle animation phi(t) producing flowing reflections
 */
export class MetallicRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'metallic';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void {
    const { width, height } = source;
    const { renderParams, color, motion } = config;
    const specularBoost = clamp((renderParams.edgeEmphasis || 0.8) * 1.5, 0.4, 3.0);
    const speed = motion.isPlaying ? (motion.speed || 1) : 0;
    const lightAngle = time * speed * 1.2;

    // 1. Compute surface edge magnitude using Sobel
    const edgeMap = SobelFilter.computeEdgeMap(source);
    const edgeData = edgeMap.magnitude;
    const srcData = source.data;

    const output = ctx.createImageData(width, height);
    const dst = output.data;

    // Tint colors for colored metals (gold, copper, chrome, acid lime)
    const tintR = parseInt(color.tintColor.slice(1, 3) || 'fa', 16);
    const tintG = parseInt(color.tintColor.slice(3, 5) || 'fa', 16);
    const tintB = parseInt(color.tintColor.slice(5, 7) || 'fa', 16);
    const tintOpacity = clamp(color.tintOpacity, 0, 1);

    const cosLight = Math.cos(lightAngle);
    const sinLight = Math.sin(lightAngle);

    for (let y = 1; y < height - 1; y++) {
      const row = y * width;
      for (let x = 1; x < width - 1; x++) {
        const idx = (row + x) * 4;

        // Sobel horizontal/vertical differences for surface normal
        const lumaL = (srcData[idx - 4] * 0.299 + srcData[idx - 3] * 0.587 + srcData[idx - 2] * 0.114);
        const lumaR = (srcData[idx + 4] * 0.299 + srcData[idx + 3] * 0.587 + srcData[idx + 2] * 0.114);
        const lumaU = (srcData[idx - width * 4] * 0.299 + srcData[idx - width * 4 + 1] * 0.587 + srcData[idx - width * 4 + 2] * 0.114);
        const lumaD = (srcData[idx + width * 4] * 0.299 + srcData[idx + width * 4 + 1] * 0.587 + srcData[idx + width * 4 + 2] * 0.114);

        const nx = (lumaR - lumaL) / 255;
        const ny = (lumaD - lumaU) / 255;
        const mag = edgeData[row + x];

        // Perceived base luminance
        const baseLuma = (srcData[idx] * 0.299 + srcData[idx + 1] * 0.587 + srcData[idx + 2] * 0.114) / 255;

        // Reflection angle relative to rotating light source
        const angle = Math.atan2(ny, nx) + lightAngle;
        
        // Multi-frequency chrome reflection curve (creates distinct alternating horizon bands)
        const chromeBands = Math.sin(angle * 2 + baseLuma * 4);
        const specularity = Math.pow(Math.max(0, nx * cosLight + ny * sinLight + 0.3), 3) * specularBoost;

        let val = Math.max(0, Math.min(1, 0.2 + (chromeBands * 0.35 + 0.35) * baseLuma + specularity + mag * 0.4));

        let r = Math.round(val * 255);
        let g = Math.round(val * 255);
        let b = Math.round(val * 255);

        // Apply metallic color tint if specified
        if (tintOpacity > 0) {
          r = Math.round(r * (1 - tintOpacity) + (val * tintR) * tintOpacity);
          g = Math.round(g * (1 - tintOpacity) + (val * tintG) * tintOpacity);
          b = Math.round(b * (1 - tintOpacity) + (val * tintB) * tintOpacity);
        }

        dst[idx] = Math.min(255, r);
        dst[idx + 1] = Math.min(255, g);
        dst[idx + 2] = Math.min(255, b);
        dst[idx + 3] = 255;
      }
    }

    ctx.save();
    ctx.putImageData(output, 0, 0);

    // Specular highlight blooming
    if (renderParams.edgeEmphasis > 0.5) {
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(${tintR}, ${tintG}, ${tintB}, 0.25)`;
      ctx.filter = 'blur(4px)';
      ctx.drawImage(ctx.canvas, 0, 0);
      ctx.filter = 'none';
    }

    ctx.restore();
  }
}
