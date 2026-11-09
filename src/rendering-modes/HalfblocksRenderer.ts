import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { CellGridSampler } from '../image-processing/CellGridSampler';
import { quantizer } from '../image-processing/ColorQuantizer';
import { clamp } from '../utilities';

export class HalfblocksRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'halfblocks';

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    _time: number
  ): void {
    const { renderParams, palette } = config;
    const { cellSize, density, invert, edgeEmphasis, coverage } = renderParams;

    const grid = CellGridSampler.sample(source, cellSize, density, edgeEmphasis);
    const coverageFactor = clamp(coverage / 100, 0.1, 1.0);
    const { data, width: srcW, height: srcH } = source;

    ctx.save();

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      const { x, y, width, height, edge } = cell;

      const drawW = width * coverageFactor;
      const drawH = height * coverageFactor;
      const ox = x + (width - drawW) / 2;
      const oy = y + (height - drawH) / 2;
      const halfH = drawH / 2;

      // Sample top half average color
      const topSampleY = Math.min(srcH - 1, Math.floor(y + height * 0.25));
      const topSampleX = Math.min(srcW - 1, Math.floor(x + width * 0.5));
      const topIdx = (topSampleY * srcW + topSampleX) * 4;

      let rTop = data[topIdx];
      let gTop = data[topIdx + 1];
      let bTop = data[topIdx + 2];

      // Sample bottom half average color
      const btmSampleY = Math.min(srcH - 1, Math.floor(y + height * 0.75));
      const btmSampleX = Math.min(srcW - 1, Math.floor(x + width * 0.5));
      const btmIdx = (btmSampleY * srcW + btmSampleX) * 4;

      let rBtm = data[btmIdx];
      let gBtm = data[btmIdx + 1];
      let bBtm = data[btmIdx + 2];

      if (invert) {
        rTop = 255 - rTop;
        gTop = 255 - gTop;
        bTop = 255 - bTop;
        rBtm = 255 - rBtm;
        gBtm = 255 - gBtm;
        bBtm = 255 - bBtm;
      }

      const qTop = quantizer.quantizePixel({ r: rTop, g: gTop, b: bTop }, palette.colors);
      const qBtm = quantizer.quantizePixel({ r: rBtm, g: gBtm, b: bBtm }, palette.colors);

      // Top half block
      ctx.fillStyle = `rgb(${qTop.r}, ${qTop.g}, ${qTop.b})`;
      ctx.fillRect(ox, oy, drawW, halfH);

      // Bottom half block
      ctx.fillStyle = `rgb(${qBtm.r}, ${qBtm.g}, ${qBtm.b})`;
      ctx.fillRect(ox, oy + halfH, drawW, halfH);

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
