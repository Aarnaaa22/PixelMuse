import { BaseRenderer } from './BaseRenderer';
import { RenderConfig, RenderMode } from '../types';
import { clamp } from '../utilities';

export type WireframeShape = 'cube' | 'globe' | 'knot' | 'pyramid' | 'torus' | 'mesh';

/**
 * Independent, reusable 3D Wireframe & Polygonal Projection rendering module.
 * Projects 3D mathematical space curves and polyhedra onto a 2D character/vector grid:
 * - 3D Euler matrix rotation (ax, ay, az)
 * - Camera perspective projection with field of view (FOV) and vanishing point
 * - Modulates vertex brightness, color, and character glyphs with image luminance
 */
export class Wireframe3DRenderer extends BaseRenderer {
  readonly mode: RenderMode = 'wireframe-3d';
  private shape: WireframeShape = 'cube';

  constructor(shape: WireframeShape = 'cube') {
    super();
    this.shape = shape;
  }

  setShape(shape: WireframeShape): void {
    this.shape = shape;
  }

  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void {
    const { width, height } = source;
    const { renderParams, ascii, motion, color } = config;
    const chars = renderParams.charSet || ascii.characters || ' .:-=+*#%@';
    const speed = motion.isPlaying ? (motion.speed || 1) : 0.8;
    const t = time * speed;

    const cx = width / 2;
    const cy = height / 2;
    const baseScale = Math.min(width, height) * 0.35 * (config.resolutionScale || 1);

    ctx.save();
    ctx.font = `${Math.max(8, renderParams.cellSize)}px ${ascii.fontFamily || '"JetBrains Mono", monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tintHex = color.tintColor || '#CCFF00';

    switch (this.shape) {
      case 'globe':
        this.renderGlobe(ctx, source, cx, cy, baseScale, t, chars, tintHex);
        break;
      case 'knot':
        this.renderKnot(ctx, source, cx, cy, baseScale * 0.65, t, chars, tintHex);
        break;
      case 'pyramid':
        this.renderPyramid(ctx, source, cx, cy, baseScale * 0.9, t, chars, tintHex);
        break;
      case 'torus':
        this.renderTorus(ctx, source, cx, cy, baseScale * 0.85, t, chars, tintHex);
        break;
      case 'mesh':
        this.renderMesh(ctx, source, width, height, t, chars, tintHex);
        break;
      case 'cube':
      default:
        this.renderCube(ctx, source, cx, cy, baseScale * 0.85, t, chars, tintHex);
        break;
    }

    ctx.restore();
  }

  // Sample image luminance at normalized coordinates
  private sampleSourceLuminance(source: ImageData, normX: number, normY: number): number {
    const x = Math.floor(clamp(normX, 0, 0.999) * source.width);
    const y = Math.floor(clamp(normY, 0, 0.999) * source.height);
    const idx = (y * source.width + x) * 4;
    return (source.data[idx] * 0.299 + source.data[idx + 1] * 0.587 + source.data[idx + 2] * 0.114) / 255;
  }

  // 1. 3D Wireframe Cube
  private renderCube(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    cx: number,
    cy: number,
    scale: number,
    t: number,
    chars: string,
    tint: string
  ) {
    const ax = t * 0.8;
    const ay = t * 1.1;

    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    const projected = vertices.map(([x, y, z]) => {
      const y1 = y * Math.cos(ax) - z * Math.sin(ax);
      const z1 = y * Math.sin(ax) + z * Math.cos(ax);
      const x2 = x * Math.cos(ay) + z1 * Math.sin(ay);
      const z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);
      const fov = 3.2;
      const p = fov / (fov + z2);
      return { x: cx + x2 * scale * p, y: cy + y1 * scale * p, z: z2 };
    });

    edges.forEach(([i, j]) => {
      const p1 = projected[i];
      const p2 = projected[j];
      const steps = 8;
      for (let s = 0; s <= steps; s++) {
        const frac = s / steps;
        const px = p1.x + (p2.x - p1.x) * frac;
        const py = p1.y + (p2.y - p1.y) * frac;
        const luma = this.sampleSourceLuminance(source, px / source.width, py / source.height);
        const charIdx = Math.floor(luma * (chars.length - 1));
        const alpha = Math.max(0.3, Math.min(1, luma * 1.2 + 0.2));
        ctx.fillStyle = tint;
        ctx.globalAlpha = alpha;
        ctx.fillText(chars[charIdx] || '+', px, py);
      }
    });
  }

  // 2. 3D Globe Sphere
  private renderGlobe(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    cx: number,
    cy: number,
    r: number,
    t: number,
    chars: string,
    tint: string
  ) {
    const rot = t * 0.7;
    for (let lat = -60; lat <= 60; lat += 20) {
      const phi = (lat * Math.PI) / 180;
      const ringR = Math.cos(phi) * r;
      const ringY = cy + Math.sin(phi) * r;

      for (let lon = 0; lon < 360; lon += 24) {
        const theta = (lon * Math.PI) / 180 + rot;
        const z = Math.sin(theta);
        if (z < -0.15) continue; // back-face culling
        const px = cx + Math.cos(theta) * ringR;
        const luma = this.sampleSourceLuminance(source, px / source.width, ringY / source.height);
        const charIdx = Math.floor(luma * (chars.length - 1));
        ctx.fillStyle = tint;
        ctx.globalAlpha = Math.max(0.25, z * luma * 1.2);
        ctx.fillText(chars[charIdx] || 'o', px, ringY);
      }
    }
  }

  // 3. 3D Trefoil Knot
  private renderKnot(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    cx: number,
    cy: number,
    scale: number,
    t: number,
    chars: string,
    tint: string
  ) {
    const steps = 75;
    for (let i = 0; i < steps; i++) {
      const u = (i / steps) * Math.PI * 2;
      const x0 = Math.sin(u) + 2 * Math.sin(2 * u);
      const y0 = Math.cos(u) - 2 * Math.cos(2 * u);
      const z0 = -Math.sin(3 * u);

      const angle = t * 0.9;
      const rx = x0 * Math.cos(angle) + z0 * Math.sin(angle);
      const rz = -x0 * Math.sin(angle) + z0 * Math.cos(angle);
      const ry = y0;

      const fov = 4;
      const proj = fov / (fov + rz);
      const px = cx + rx * scale * proj;
      const py = cy + ry * scale * proj;

      const luma = this.sampleSourceLuminance(source, px / source.width, py / source.height);
      const charIdx = Math.floor(luma * (chars.length - 1));
      ctx.fillStyle = tint;
      ctx.globalAlpha = Math.max(0.3, (rz + 3) / 6);
      ctx.fillText(chars[charIdx] || '*', px, py);
    }
  }

  // 4. 3D Pyramid
  private renderPyramid(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    cx: number,
    cy: number,
    scale: number,
    t: number,
    chars: string,
    tint: string
  ) {
    const ax = 0.4;
    const ay = t * 1.2;

    const vertices = [
      [0, -1, 0],
      [-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1],
    ];

    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ];

    const projected = vertices.map(([x, y, z]) => {
      const y1 = y * Math.cos(ax) - z * Math.sin(ax);
      const z1 = y * Math.sin(ax) + z * Math.cos(ax);
      const x2 = x * Math.cos(ay) + z1 * Math.sin(ay);
      const z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);
      const fov = 3.5;
      const p = fov / (fov + z2);
      return { x: cx + x2 * scale * p, y: cy + y1 * scale * p };
    });

    edges.forEach(([i, j]) => {
      const p1 = projected[i];
      const p2 = projected[j];
      const steps = 7;
      for (let s = 0; s <= steps; s++) {
        const frac = s / steps;
        const px = p1.x + (p2.x - p1.x) * frac;
        const py = p1.y + (p2.y - p1.y) * frac;
        const luma = this.sampleSourceLuminance(source, px / source.width, py / source.height);
        const charIdx = Math.floor(luma * (chars.length - 1));
        ctx.fillStyle = tint;
        ctx.globalAlpha = Math.max(0.35, luma);
        ctx.fillText(chars[charIdx] || '^', px, py);
      }
    });
  }

  // 5. 3D Torus Knot
  private renderTorus(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    cx: number,
    cy: number,
    scale: number,
    t: number,
    chars: string,
    tint: string
  ) {
    const R = scale * 0.65;
    const r = scale * 0.25;
    const ax = t * 0.7;
    const ay = t * 1.0;

    for (let u = 0; u < Math.PI * 2; u += Math.PI / 8) {
      for (let v = 0; v < Math.PI * 2; v += Math.PI / 6) {
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);

        const y1 = y * Math.cos(ax) - z * Math.sin(ax);
        const z1 = y * Math.sin(ax) + z * Math.cos(ax);
        const x2 = x * Math.cos(ay) + z1 * Math.sin(ay);
        const z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);

        if (z2 < 0) continue;
        const fov = 3.5;
        const p = fov / (fov + z2 / 100);
        const px = cx + x2 * p;
        const py = cy + y1 * p;

        const luma = this.sampleSourceLuminance(source, px / source.width, py / source.height);
        const charIdx = Math.floor(luma * (chars.length - 1));
        ctx.fillStyle = tint;
        ctx.globalAlpha = Math.max(0.3, luma);
        ctx.fillText(chars[charIdx] || '@', px, py);
      }
    }
  }

  // 6. 3D Hero Mesh
  private renderMesh(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    w: number,
    h: number,
    t: number,
    chars: string,
    tint: string
  ) {
    const cols = 20;
    const rows = 14;
    const spX = w / (cols + 1);
    const spY = h / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = (c + 1) * spX;
        const y0 = (r + 1) * spY;
        const luma = this.sampleSourceLuminance(source, x0 / w, y0 / h);
        const offset = Math.sin((x0 + y0) * 0.02 + t * 2 + luma * 3) * 12;
        const charIdx = Math.floor(luma * (chars.length - 1));
        ctx.fillStyle = tint;
        ctx.globalAlpha = Math.max(0.25, luma);
        ctx.fillText(chars[charIdx] || '+', x0, y0 + offset);
      }
    }
  }
}
