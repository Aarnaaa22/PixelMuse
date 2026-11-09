import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class DiscoRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'disco';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void {
    const { renderParams, palette, motion } = config;
    const { cellSize, density, invert, edgeEmphasis, coverage } = renderParams;

    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const coverageFactor = clamp(coverage / 100, 0.1, 1.0);

    const speed = motion.isPlaying ? motion.speed : 0.8;
    const phase = time * speed * 2;

    ctx.save();

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      let { r, g, b, luminance, edge, x, y, width, height, col, row } = cell;

      if (invert) {
        luminance = 1 - luminance;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      const color = quantizer.quantizePixel({ r, g, b }, palette.colors);

      const drawW = width * coverageFactor;
      const drawH = height * coverageFactor;
      const ox = x + (width - drawW) / 2;
      const oy = y + (height - drawH) / 2;
      const cx = ox + drawW / 2;
      const cy = oy + drawH / 2;

      // 1. Faceted mirror tile base
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(ox, oy, drawW, drawH);

      // 2. Dynamic chromatic reflection wave across grid
      const waveAngle = Math.sin((col * 0.2) + (row * 0.15) + phase);
      const shimmerIntensity = Math.max(0, waveAngle);

      if (shimmerIntensity > 0.2) {
        const grad = ctx.createLinearGradient(ox, oy, ox + drawW, oy + drawH);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        grad.addColorStop(0.5, 'rgba(157, 78, 221, 0.35)'); // Electric violet
        grad.addColorStop(1, 'rgba(204, 255, 0, 0.45)');   // Acid lime

        ctx.fillStyle = grad;
        ctx.fillRect(ox, oy, drawW, drawH);
      }

      // 3. Mirror facet border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(ox, oy, drawW, drawH);

      // 4. Specular 4-point glint sparkle on bright highlights or peaks
      if (luminance > 0.82 && shimmerIntensity > 0.6) {
        const glintSize = Math.max(2, drawW * 0.45);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Horizontal ray
        ctx.moveTo(cx - glintSize, cy);
        ctx.lineTo(cx + glintSize, cy);
        // Vertical ray
        ctx.moveTo(cx, cy - glintSize);
        ctx.lineTo(cx, cy + glintSize);
        ctx.stroke();
      }

      // Edge emphasis
      if (edgeEmphasis > 0 && edge > 0.15) {
        ctx.strokeStyle = `rgba(204, 255, 0, ${edge * (edgeEmphasis / 100)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(ox, oy, drawW, drawH);
      }
    }

    ctx.restore();
  }
}

