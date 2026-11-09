import { getLuminance, clamp } from '../utilities';
import { SobelFilter } from './SobelFilter';

export interface CellData {
  col: number;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
  r: number;
  g: number;
  b: number;
  luminance: number; // 0 to 1
  edge: number;      // 0 to 1
}

export interface GridSampleResult {
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  cells: CellData[];
  width: number;
  height: number;
}

/**
 * High-performance grid sampling engine.
 * Samples an image into discrete cells, computing true average RGB,
 * relative luminance, and Sobel edge magnitude for each cell.
 */
export class CellGridSampler {
  /**
   * Samples an ImageData buffer into an array of cell statistics.
   */
  static sample(
    sourceImageData: ImageData,
    cellSize: number,
    density = 1.0,
    edgeEmphasis = 0
  ): GridSampleResult {
    const { width, height, data } = sourceImageData;

    // Adjust effective cell width/height based on density
    const effectiveCellSize = Math.max(2, Math.round(cellSize / Math.max(0.2, density)));
    const cellWidth = effectiveCellSize;
    const cellHeight = effectiveCellSize;

    const cols = Math.ceil(width / cellWidth);
    const rows = Math.ceil(height / cellHeight);
    const totalCells = cols * rows;

    // Compute edge map if edge emphasis is active
    let edgeMap: Float32Array | null = null;
    if (edgeEmphasis > 0) {
      edgeMap = SobelFilter.computeEdgeMap(sourceImageData, 0.1).magnitude;
    }

    const cells: CellData[] = new Array(totalCells);
    let cellIndex = 0;

    for (let r = 0; r < rows; r++) {
      const y0 = r * cellHeight;
      const y1 = Math.min(height, y0 + cellHeight);
      const curHeight = y1 - y0;

      for (let c = 0; c < cols; c++) {
        const x0 = c * cellWidth;
        const x1 = Math.min(width, x0 + cellWidth);
        const curWidth = x1 - x0;

        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let sumEdge = 0;
        let sampleCount = 0;

        // Sampling stride: sample every 1 or 2 pixels for extreme speed
        const stride = curWidth > 16 ? 2 : 1;

        for (let py = y0; py < y1; py += stride) {
          const rowOffset = py * width;
          for (let px = x0; px < x1; px += stride) {
            const idx = (rowOffset + px) * 4;
            sumR += data[idx];
            sumG += data[idx + 1];
            sumB += data[idx + 2];

            if (edgeMap) {
              sumEdge += edgeMap[rowOffset + px];
            }

            sampleCount++;
          }
        }

        const count = sampleCount || 1;
        const avgR = Math.round(sumR / count);
        const avgG = Math.round(sumG / count);
        const avgB = Math.round(sumB / count);
        const lum = getLuminance(avgR, avgG, avgB);
        const edge = edgeMap ? clamp(sumEdge / count, 0, 1) : 0;

        cells[cellIndex++] = {
          col: c,
          row: r,
          x: x0,
          y: y0,
          width: curWidth,
          height: curHeight,
          r: avgR,
          g: avgG,
          b: avgB,
          luminance: lum,
          edge,
        };
      }
    }

    return {
      cols,
      rows,
      cellWidth,
      cellHeight,
      cells,
      width,
      height,
    };
  }
}

