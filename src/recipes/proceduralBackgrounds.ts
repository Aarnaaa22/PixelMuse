import { ProceduralBackgroundType } from '../types/recipe';

/**
 * High-performance procedural Canvas 2D animation engines
 * for community background recipes that operate independently of photographic inputs.
 */

export class ProceduralBackgroundEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animId: number | null = null;
  private startTime = 0;
  private mouse = { x: 0.5, y: 0.5, active: false };

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.startTime = performance.now();
  }

  detach() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.canvas = null;
    this.ctx = null;
  }

  setMouse(normX: number, normY: number) {
    this.mouse.x = normX;
    this.mouse.y = normY;
    this.mouse.active = true;
  }

  render(type: ProceduralBackgroundType, interactive = false) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const canvas = this.canvas;
    const w = canvas.width;
    const h = canvas.height;

    const loop = (timestamp: number) => {
      const elapsed = (timestamp - this.startTime) / 1000;
      ctx.fillStyle = '#08080A';
      ctx.fillRect(0, 0, w, h);

      switch (type) {
        case 'tunnel':
          this.drawTunnel(ctx, w, h, elapsed);
          break;
        case 'wake':
          this.drawWake(ctx, w, h, elapsed);
          break;
        case 'wave':
          this.drawWave(ctx, w, h, elapsed);
          break;
        case 'cube3d':
          this.drawCube3D(ctx, w, h, elapsed);
          break;
        case 'globe3d':
          this.drawGlobe3D(ctx, w, h, elapsed);
          break;
        case 'knot3d':
          this.drawKnot3D(ctx, w, h, elapsed);
          break;
        case 'pyramid3d':
          this.drawPyramid3D(ctx, w, h, elapsed);
          break;
        case 'torus-wire':
          this.drawTorus(ctx, w, h, elapsed);
          break;
        case 'schlieren':
          this.drawSchlieren(ctx, w, h, elapsed);
          break;
        case 'reaction-front':
          this.drawReactionFront(ctx, w, h, elapsed);
          break;
        case 'matrix-stream':
          this.drawMatrixStream(ctx, w, h, elapsed);
          break;
        case 'dither-orb':
          this.drawDitherOrb(ctx, w, h, elapsed);
          break;
        case 'crt-barrel':
          this.drawCrtBarrel(ctx, w, h, elapsed);
          break;
        case 'flower-polar':
          this.drawFlowerPolar(ctx, w, h, elapsed);
          break;
        case 'text-cascade':
          this.drawTextCascade(ctx, w, h, elapsed);
          break;
        case 'hero-mesh':
        default:
          this.drawHeroMesh(ctx, w, h, elapsed);
          break;
      }

      if (interactive) {
        this.animId = requestAnimationFrame(loop);
      }
    };

    if (interactive) {
      if (this.animId !== null) cancelAnimationFrame(this.animId);
      this.animId = requestAnimationFrame(loop);
    } else {
      // Single frame render for static thumbnail preview
      loop(performance.now());
    }
  }

  // 1. Hero ASCII Tunnel: concentric glowing ASCII/matrix rings racing inward
  private drawTunnel(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cx = w * (this.mouse.active ? this.mouse.x : 0.5);
    const cy = h * (this.mouse.active ? this.mouse.y : 0.5);
    const ringCount = 12;
    const glyphs = '01#*+:=~-';

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let r = 0; r < ringCount; r++) {
      const progress = ((r / ringCount + t * 0.4) % 1);
      const radius = progress * (w * 0.7);
      if (radius < 4) continue;

      const alpha = Math.min(progress * 1.5, 1 - progress * 0.8);
      ctx.fillStyle = `rgba(204, 255, 0, ${alpha.toFixed(2)})`;

      const numPoints = Math.max(8, Math.floor(progress * 36));
      for (let p = 0; p < numPoints; p++) {
        const angle = (p / numPoints) * Math.PI * 2 + t * 0.5;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        const char = glyphs[(r + p) % glyphs.length];
        ctx.fillText(char, px, py);
      }
    }
  }

  // 2. Background ASCII Wake: character field reactive to cursor / motion trail
  private drawWake(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cols = 24;
    const rows = 16;
    const cellW = w / cols;
    const cellH = h / rows;
    const mx = this.mouse.active ? this.mouse.x * w : (Math.sin(t * 1.5) * 0.35 + 0.5) * w;
    const my = this.mouse.active ? this.mouse.y * h : (Math.cos(t * 1.2) * 0.35 + 0.5) * h;
    const chars = '.:*+=#%@';

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * cellW + cellW / 2;
        const py = r * cellH + cellH / 2;
        const dist = Math.hypot(px - mx, py - my);
        const influence = Math.max(0, 1 - dist / (w * 0.4));
        const pulse = (Math.sin(c * 0.3 + r * 0.2 + t * 2) + 1) * 0.15;
        const brightness = Math.min(1, influence * 1.2 + pulse);

        if (brightness > 0.08) {
          const charIdx = Math.floor(brightness * (chars.length - 1));
          if (influence > 0.4) {
            ctx.fillStyle = `rgba(204, 255, 0, ${(influence * 0.95).toFixed(2)})`;
          } else {
            ctx.fillStyle = `rgba(157, 78, 221, ${(brightness * 0.7).toFixed(2)})`;
          }
          ctx.fillText(chars[charIdx], px, py);
        }
      }
    }
  }

  // 3. Violet ASCII Wave: layered sinusoidal wave ribbons
  private drawWave(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const lines = 7;
    const chars = '~-+=*#';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    for (let l = 0; l < lines; l++) {
      const baseY = h * 0.25 + (l / lines) * (h * 0.55);
      const speed = 1.2 + l * 0.2;
      const freq = 0.02 + l * 0.005;
      const amp = 18 + l * 6;
      const alpha = 0.3 + (l / lines) * 0.6;
      ctx.fillStyle = `rgba(157, 78, 221, ${alpha.toFixed(2)})`;

      const step = 14;
      for (let x = 8; x < w; x += step) {
        const y = baseY + Math.sin(x * freq + t * speed) * amp + Math.cos(x * 0.015 - t * 0.8) * (amp * 0.4);
        const char = chars[(Math.floor(x / step) + l) % chars.length];
        ctx.fillText(char, x, y);
      }
    }
  }

  // 4. ASCII Cube: 3D rotating wireframe cube with character ramps
  private drawCube3D(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const size = Math.min(w, h) * 0.28;
    const cx = w / 2;
    const cy = h / 2;

    const ax = t * 0.8;
    const ay = t * 1.1;

    // 8 cube vertices
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];

    // 12 edges
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    const projected = vertices.map(([x, y, z]) => {
      // Rotate around X
      const y1 = y * Math.cos(ax) - z * Math.sin(ax);
      const z1 = y * Math.sin(ax) + z * Math.cos(ax);
      // Rotate around Y
      const x2 = x * Math.cos(ay) + z1 * Math.sin(ay);
      const z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);
      // Perspective projection
      const fov = 3.2;
      const scale = fov / (fov + z2);
      return {
        x: cx + x2 * size * scale,
        y: cy + y1 * size * scale,
        z: z2
      };
    });

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    edges.forEach(([i, j]) => {
      const p1 = projected[i];
      const p2 = projected[j];
      const steps = 7;
      for (let s = 0; s <= steps; s++) {
        const frac = s / steps;
        const x = p1.x + (p2.x - p1.x) * frac;
        const y = p1.y + (p2.y - p1.y) * frac;
        const avgZ = p1.z + (p2.z - p1.z) * frac;
        const brightness = Math.max(0.2, (avgZ + 1.5) / 3);
        ctx.fillStyle = `rgba(204, 255, 0, ${brightness.toFixed(2)})`;
        ctx.fillText('+', x, y);
      }
    });
  }

  // 5. ASCII Globe Spin: 3D wireframe sphere with latitude & longitude rings
  private drawGlobe3D(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.36;
    const rot = t * 0.7;

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Latitude rings
    for (let lat = -60; lat <= 60; lat += 25) {
      const phi = (lat * Math.PI) / 180;
      const ringR = Math.cos(phi) * r;
      const ringY = cy + Math.sin(phi) * r;

      for (let lon = 0; lon < 360; lon += 30) {
        const theta = (lon * Math.PI) / 180 + rot;
        const z = Math.sin(theta);
        if (z < -0.1) continue; // back-face culling
        const x = cx + Math.cos(theta) * ringR;
        const alpha = Math.max(0.2, z * 0.9);
        ctx.fillStyle = `rgba(74, 222, 128, ${alpha.toFixed(2)})`;
        ctx.fillText('o', x, ringY);
      }
    }
  }

  // 6. ASCII Trefoil Knot: rotating 3D space curve
  private drawKnot3D(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) * 0.18;
    const steps = 70;
    const glyphs = '*#@+';

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < steps; i++) {
      const u = (i / steps) * Math.PI * 2;
      // Trefoil equations:
      const x0 = Math.sin(u) + 2 * Math.sin(2 * u);
      const y0 = Math.cos(u) - 2 * Math.cos(2 * u);
      const z0 = -Math.sin(3 * u);

      // Rotate
      const angle = t * 0.9;
      const rx = x0 * Math.cos(angle) + z0 * Math.sin(angle);
      const rz = -x0 * Math.sin(angle) + z0 * Math.cos(angle);
      const ry = y0;

      const fov = 4;
      const proj = fov / (fov + rz);
      const px = cx + rx * scale * proj;
      const py = cy + ry * scale * proj;

      const alpha = Math.max(0.25, (rz + 3) / 6);
      ctx.fillStyle = `rgba(255, 71, 58, ${alpha.toFixed(2)})`;
      ctx.fillText(glyphs[i % glyphs.length], px, py);
    }
  }

  // 7. ASCII Pyramid: rotating 4-sided wireframe pyramid
  private drawPyramid3D(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) * 0.32;
    const ax = 0.4;
    const ay = t * 1.2;

    const vertices = [
      [0, -1, 0],    // apex
      [-1, 1, -1],   // base 1
      [1, 1, -1],    // base 2
      [1, 1, 1],     // base 3
      [-1, 1, 1],    // base 4
    ];

    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 2], [2, 3], [3, 4], [4, 1]
    ];

    const projected = vertices.map(([x, y, z]) => {
      const y1 = y * Math.cos(ax) - z * Math.sin(ax);
      const z1 = y * Math.sin(ax) + z * Math.cos(ax);
      const x2 = x * Math.cos(ay) + z1 * Math.sin(ay);
      const z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);
      const fov = 3.5;
      const p = fov / (fov + z2);
      return { x: cx + x2 * scale * p, y: cy + y1 * scale * p, z: z2 };
    });

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    edges.forEach(([i, j]) => {
      const p1 = projected[i];
      const p2 = projected[j];
      const steps = 6;
      for (let s = 0; s <= steps; s++) {
        const f = s / steps;
        const x = p1.x + (p2.x - p1.x) * f;
        const y = p1.y + (p2.y - p1.y) * f;
        ctx.fillStyle = '#CCFF00';
        ctx.fillText('^', x, y);
      }
    });
  }

  // 8. Torus Wireframe
  private drawTorus(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.28;
    const r = Math.min(w, h) * 0.1;
    const ax = t * 0.7;
    const ay = t * 1.0;

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let u = 0; u < Math.PI * 2; u += Math.PI / 8) {
      for (let v = 0; v < Math.PI * 2; v += Math.PI / 6) {
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);

        // Rotate
        const y1 = y * Math.cos(ax) - z * Math.sin(ax);
        const z1 = y * Math.sin(ax) + z * Math.cos(ax);
        const x2 = x * Math.cos(ay) + z1 * Math.sin(ay);
        const z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);

        if (z2 < 0) continue;
        const scale = 3.5 / (3.5 + z2 / 100);
        const px = cx + x2 * scale;
        const py = cy + y1 * scale;

        ctx.fillStyle = 'rgba(204, 255, 0, 0.75)';
        ctx.fillText('@', px, py);
      }
    }
  }

  // 9. Schlieren Optical Shockwaves
  private drawSchlieren(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cols = 22;
    const rows = 15;
    const cw = w / cols;
    const ch = h / rows;
    const chars = ' .:|/\\#';

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cw + cw / 2;
        const y = r * ch + ch / 2;
        const shock = Math.sin((x * 0.04 - t * 3) + Math.cos(y * 0.05 + t));
        const val = Math.abs(shock);
        const idx = Math.min(chars.length - 1, Math.floor(val * chars.length));

        ctx.fillStyle = val > 0.6 ? '#CCFF00' : 'rgba(157, 78, 221, 0.6)';
        ctx.fillText(chars[idx], x, y);
      }
    }
  }

  // 10. Reaction-Diffusion waves
  private drawReactionFront(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cols = 20;
    const rows = 14;
    const cw = w / cols;
    const ch = h / rows;
    const chars = ' -~=+%#@';

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cw + cw / 2;
        const y = r * ch + ch / 2;
        const wave1 = Math.sin(c * 0.4 + t * 1.5) * Math.cos(r * 0.4 - t);
        const wave2 = Math.cos((c + r) * 0.3 + t * 0.8);
        const comb = (wave1 + wave2 + 2) / 4;
        const idx = Math.min(chars.length - 1, Math.floor(comb * chars.length));

        ctx.fillStyle = comb > 0.6 ? '#CCFF00' : 'rgba(255, 71, 58, 0.7)';
        ctx.fillText(chars[idx], x, y);
      }
    }
  }

  // 11. Matrix Stream Falling Code
  private drawMatrixStream(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cols = 20;
    const cw = w / cols;
    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    for (let c = 0; c < cols; c++) {
      const speed = 15 + ((c * 7) % 25);
      const headY = ((t * speed + c * 23) % (h + 80)) - 20;

      for (let trail = 0; trail < 8; trail++) {
        const y = headY - trail * 14;
        if (y < 0 || y > h) continue;

        const charIdx = (Math.floor(t * 5) + c * 3 + trail) % chars.length;
        if (trail === 0) {
          ctx.fillStyle = '#FFFFFF';
        } else if (trail < 3) {
          ctx.fillStyle = '#CCFF00';
        } else {
          const alpha = 1 - trail / 8;
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha.toFixed(2)})`;
        }
        ctx.fillText(chars[charIdx], c * cw + cw / 2, y);
      }
    }
  }

  // 12. Dither Orb
  private drawDitherOrb(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cx = w / 2;
    const cy = h / 2;
    const baseR = Math.min(w, h) * 0.32;
    const pulse = Math.sin(t * 3) * (baseR * 0.08);
    const r = baseR + pulse;

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const step = 11;
    for (let y = cy - r; y <= cy + r; y += step) {
      for (let x = cx - r; x <= cx + r; x += step) {
        const dist = Math.hypot(x - cx, y - cy);
        if (dist <= r) {
          const normDist = dist / r;
          const shade = 1 - normDist;
          const noise = ((x * 12.9898 + y * 78.233) % 1) > (1 - shade);
          if (noise) {
            ctx.fillStyle = shade > 0.5 ? '#CCFF00' : '#9D4EDD';
            ctx.fillText(shade > 0.7 ? '#' : '.', x, y);
          }
        }
      }
    }
  }

  // 13. CRT Barrel Curvature
  private drawCrtBarrel(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    // Scanlines
    ctx.fillStyle = 'rgba(0, 255, 100, 0.08)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1);
    }

    // Glowing CRT prompt
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#33FF33';
    ctx.textAlign = 'left';
    ctx.fillText('> SYSTEM_READY', 20, 36);
    ctx.fillText('> MEMORY: 640K OK', 20, 54);
    ctx.fillText(`> REFRESH: ${(60 + Math.sin(t * 10)).toFixed(1)} Hz`, 20, 72);

    const flicker = Math.sin(t * 30) > 0.95;
    if (flicker) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, w, h);
    }
  }

  // 14. Polar Flower Curve
  private drawFlowerPolar(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cx = w / 2;
    const cy = h / 2;
    const k = 6;
    const maxR = Math.min(w, h) * 0.38;
    const rot = t * 0.5;

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let theta = 0; theta < Math.PI * 2; theta += 0.08) {
      const r = Math.cos(k * theta) * maxR;
      const angle = theta + rot;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const alpha = Math.abs(r / maxR);

      ctx.fillStyle = `rgba(255, 71, 58, ${alpha.toFixed(2)})`;
      ctx.fillText('*', x, y);
    }
  }

  // 15. Typographic Dissolve Cascade
  private drawTextCascade(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const text = 'PIXELMUSE';
    const glyphs = '#%*+=:-.';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const charW = w / (text.length + 2);
    for (let i = 0; i < text.length; i++) {
      const cx = (i + 1.5) * charW;
      const dissolve = (Math.sin(t * 2 + i * 0.8) + 1) / 2;
      const cy = h / 2 + Math.sin(t * 3 + i) * (dissolve * 25);

      if (dissolve > 0.6) {
        ctx.fillStyle = 'rgba(204, 255, 0, 0.9)';
        ctx.fillText(glyphs[Math.floor(dissolve * glyphs.length) % glyphs.length], cx, cy);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(text[i], cx, cy);
      }
    }
  }

  // 16. Hero Mesh
  private drawHeroMesh(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const cols = 14;
    const rows = 10;
    const spX = w / (cols + 1);
    const spY = h / (rows + 1);

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = (c + 1) * spX;
        const y0 = (r + 1) * spY;
        const offset = Math.sin((x0 + y0) * 0.02 + t * 2) * 8;
        ctx.fillStyle = 'rgba(204, 255, 0, 0.65)';
        ctx.fillText('+', x0, y0 + offset);
      }
    }
  }
}
