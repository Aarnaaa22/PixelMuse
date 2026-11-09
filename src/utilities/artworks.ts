import { BAYER_8X8 } from './math';

export type ExhibitionPieceId =
  | 'ascii-portrait'
  | 'pixel-landscape'
  | 'dither-brutalist'
  | 'geometric-abstract'
  | 'matrix-kinetic';

export interface ExhibitionPieceMeta {
  id: ExhibitionPieceId;
  title: string;
  category: string;
  year: string;
  description: string;
  dimensions: string;
  paletteColors: string[];
  techSpec: string;
}

export const EXHIBITION_PIECES: ExhibitionPieceMeta[] = [
  {
    id: 'ascii-portrait',
    title: 'CYBERNETIC MONOLITH 01',
    category: 'ASCII Glyph Rasterization',
    year: '2026.01',
    description: 'Fine density typography matrix with electric violet bloom, transforming high-contrast sculptural portraiture into discrete linguistic units.',
    dimensions: '2400 × 3000 PX',
    paletteColors: ['#08080A', '#1F1F28', '#9D4EDD', '#CCFF00', '#F4F4F6'],
    techSpec: 'Rec.709 Luminance / 12px JetBrains Mono / Phosphor Glow',
  },
  {
    id: 'pixel-landscape',
    title: 'ACID DUSK HORIZON',
    category: 'Chromatic Pixel Mosaic',
    year: '2026.02',
    description: 'Layered landscape photography re-quantized into stepped geometric blocks, fusing signal coral neon glows with deep obsidian terrain.',
    dimensions: '3840 × 2160 PX',
    paletteColors: ['#08080A', '#2E1515', '#FF473A', '#CCFF00', '#FFFFFF'],
    techSpec: 'Hexagonal Binning / Edge Preservation / 14px Cell Pitch',
  },
  {
    id: 'dither-brutalist',
    title: 'FACADE IN BAYER 8×8',
    category: '1-Bit Ordered Dither',
    year: '2026.03',
    description: 'Architectural concrete geometry broken down into Bill Atkinson & Bayer cross-hatch stippling. Stark, timeless, and tactile.',
    dimensions: '3000 × 3000 PX',
    paletteColors: ['#050505', '#242426', '#686870', '#B0B0BA', '#FAFAFA'],
    techSpec: 'Bayer 8x8 Threshold Matrix / Monochromatic Contrast / Zero Loss',
  },
  {
    id: 'geometric-abstract',
    title: 'KINETIC TESSELLATION IV',
    category: 'Rotated Diamond Cells',
    year: '2026.04',
    description: 'A 45-degree angled diamond grid modulating aperture gaps according to local photon density, evoking precision modernist prints.',
    dimensions: '2560 × 2560 PX',
    paletteColors: ['#08080A', '#1A0B2E', '#9D4EDD', '#FF473A', '#CCFF00'],
    techSpec: 'Diamond Aperture / Gap Vector Modulation / Spectral Split',
  },
  {
    id: 'matrix-kinetic',
    title: 'PHOSPHOR CASCADE OSCILLATION',
    category: 'Matrix & CRT Motion',
    year: '2026.05',
    description: 'Vertical falling katakana glyphs and horizontal cathode scanline drift simulating high-voltage ray tube displays.',
    dimensions: '1920 × 1080 PX',
    paletteColors: ['#020A02', '#0A2E0A', '#1A7A1A', '#33E533', '#CCFF00'],
    techSpec: 'Harmonic 60Hz Sine Shift / Cathode Luminescence / Glitch Vector',
  },
];

/**
 * Procedurally draws an exhibition piece onto a canvas with stunning, authentic digital art quality.
 */
export function drawExhibitionPiece(
  canvas: HTMLCanvasElement,
  pieceId: ExhibitionPieceId,
  time = 0
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear canvas
  ctx.fillStyle = '#08080A';
  ctx.fillRect(0, 0, w, h);

  switch (pieceId) {
    case 'ascii-portrait':
      drawAsciiPortrait(ctx, w, h, time);
      break;
    case 'pixel-landscape':
      drawPixelLandscape(ctx, w, h, time);
      break;
    case 'dither-brutalist':
      drawDitherBrutalist(ctx, w, h);
      break;
    case 'geometric-abstract':
      drawGeometricAbstract(ctx, w, h, time);
      break;
    case 'matrix-kinetic':
      drawMatrixKinetic(ctx, w, h, time);
      break;
  }

  // Draw subtle fine studio border line
  ctx.strokeStyle = '#1F1F28';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
}

/* 01: ASCII Sculptural Portrait */
function drawAsciiPortrait(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const cx = w * 0.5;
  const cy = h * 0.5;

  // Background atmospheric gradient
  const bg = ctx.createRadialGradient(cx, cy - 20, 30, cx, cy, w * 0.7);
  bg.addColorStop(0, '#1E1528');
  bg.addColorStop(0.6, '#0E0E14');
  bg.addColorStop(1, '#08080A');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const fontSize = Math.max(9, Math.round(w / 45));
  const stepX = fontSize * 0.65;
  const stepY = fontSize * 1.1;
  const glyphs = ' .:-=+*#%@$░▒▓█';
  const glyphCount = glyphs.length;

  ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const rows = Math.floor(h / stepY);
  const cols = Math.floor(w / stepX);

  for (let r = 0; r < rows; r++) {
    const y = r * stepY;
    const dy = (y - cy) / (h * 0.45);

    for (let c = 0; c < cols; c++) {
      const x = c * stepX;
      const dx = (x - cx) / (w * 0.45);

      // Procedural sculptural head / bust formula
      const dist = Math.sqrt(dx * dx * 1.2 + dy * dy);
      
      // Face plane shading with dynamic rim lighting
      let lum = 0;
      if (dist < 1.0) {
        const angle = Math.atan2(dy, dx);
        const facialFeature = Math.cos(angle * 3 + dy * 4) * 0.2;
        const rimLight = Math.max(0, -dx * 0.8 + 0.2);
        lum = Math.max(0, Math.min(1, 1 - dist * 0.8 + facialFeature + rimLight * 0.5));
      }

      // Sine wave perturbation
      const wave = Math.sin(y * 0.05 + time * 2) * 0.05;
      lum = Math.max(0, Math.min(1, lum + wave));

      if (lum < 0.1) continue;

      const gIdx = Math.min(glyphCount - 1, Math.floor(lum * glyphCount));
      const char = glyphs[gIdx];

      // Electric violet to acid lime spectral highlights
      if (lum > 0.8) {
        ctx.fillStyle = '#CCFF00';
      } else if (lum > 0.55) {
        ctx.fillStyle = '#EDEDF2';
      } else if (lum > 0.3) {
        ctx.fillStyle = '#B367FF';
      } else {
        ctx.fillStyle = '#7B2CBF';
      }

      ctx.fillText(char, x + stepX * 0.5, y + stepY * 0.5);
    }
  }
}

/* 02: Chromatic Pixel Mosaic Landscape */
function drawPixelLandscape(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const cellSize = Math.max(10, Math.round(w / 36));
  const cols = Math.ceil(w / cellSize);
  const rows = Math.ceil(h / cellSize);

  const colors = [
    '#08080A', '#180E1C', '#3B1736', '#7B1E38', '#C92A2A',
    '#FF473A', '#FF7A00', '#FFB800', '#CCFF00', '#F8F9FA'
  ];

  for (let r = 0; r < rows; r++) {
    const y = r * cellSize;
    const ny = y / h; // 0 (top) to 1 (bottom)

    for (let c = 0; c < cols; c++) {
      const x = c * cellSize;
      const nx = x / w;

      // Sun disc
      const dx = nx - 0.5;
      const dy = ny - 0.42;
      const sunDist = Math.sqrt(dx * dx * 1.5 + dy * dy * 1.5);

      // Mountains silhouette
      const mountainHeight = 0.58 + Math.sin(nx * 8 + 1) * 0.12 + Math.sin(nx * 18) * 0.04;
      const isMountain = ny > mountainHeight;

      let colorIdx = 0;
      if (isMountain) {
        // Dark obsidian with jagged ridge highlights
        const ridgeHighlight = Math.abs(ny - mountainHeight) < 0.04;
        colorIdx = ridgeHighlight ? 5 : (r % 2 === 0 ? 0 : 1);
      } else if (sunDist < 0.22) {
        // Neon Sun core
        colorIdx = sunDist < 0.1 ? 9 : 8;
      } else {
        // Sky gradient bands with motion pulse
        const band = Math.sin(ny * 7 + time) * 0.5 + ny * 6;
        colorIdx = Math.max(0, Math.min(colors.length - 1, Math.floor(band)));
      }

      ctx.fillStyle = colors[colorIdx];
      ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
    }
  }
}

/* 03: Brutalist Facade in Bayer 8x8 Dithering */
function drawDitherBrutalist(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const scale = 2;
  const matrix = BAYER_8X8;
  const mSize = 8;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    const my = Math.floor(y / scale) % mSize;
    const ny = y / h;

    for (let x = 0; x < w; x++) {
      const mx = Math.floor(x / scale) % mSize;
      const threshold = matrix[my][mx];
      const nx = x / w;

      // Concrete architectural perspective columns
      const column = Math.sin(nx * 24);
      const diagonalShadow = Math.sin(nx * 3 - ny * 4);
      let lum = (column * 0.35 + 0.5) * 0.7 + (diagonalShadow * 0.25 + 0.25);
      lum = Math.max(0, Math.min(1, lum));

      const isLight = lum > threshold;
      const idx = (y * w + x) * 4;

      if (isLight) {
        data[idx] = 230;     // White/Sand concrete
        data[idx + 1] = 230;
        data[idx + 2] = 235;
      } else {
        data[idx] = 10;      // Deep obsidian shadow
        data[idx + 1] = 10;
        data[idx + 2] = 14;
      }
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/* 04: Geometric Abstract Diamond Tessellation */
function drawGeometricAbstract(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const cellSize = Math.max(16, Math.round(w / 20));
  const cols = Math.ceil(w / cellSize) + 1;
  const rows = Math.ceil(h / cellSize) + 1;

  for (let r = 0; r < rows; r++) {
    const y = r * cellSize;
    for (let c = 0; c < cols; c++) {
      const x = c * cellSize;
      const cx = x + cellSize / 2;
      const cy = y + cellSize / 2;

      const dist = Math.hypot(cx - w / 2, cy - h / 2) / (w * 0.6);
      const angle = Math.atan2(cy - h / 2, cx - w / 2) + time * 0.5;
      const radius = (cellSize / 2) * (1 - dist * 0.6) * (Math.sin(angle * 4) * 0.3 + 0.7);

      if (radius < 2) continue;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4 + time * 0.2);

      // Color based on polar coordinates
      if (dist < 0.3) {
        ctx.fillStyle = '#CCFF00';
      } else if (dist < 0.6) {
        ctx.fillStyle = '#9D4EDD';
      } else {
        ctx.fillStyle = '#FF473A';
      }

      ctx.beginPath();
      ctx.rect(-radius, -radius, radius * 2, radius * 2);
      ctx.fill();

      // Precision razor stroke
      ctx.strokeStyle = '#08080A';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }
  }
}

/* 05: Matrix Phosphor Kinetic Stream */
function drawMatrixKinetic(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  ctx.fillStyle = 'rgba(8, 8, 10, 0.25)';
  ctx.fillRect(0, 0, w, h);

  const fontSize = 14;
  ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
  const chars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇ0123456789X%#*+';
  const cols = Math.floor(w / fontSize);

  for (let c = 0; c < cols; c++) {
    const x = c * fontSize;
    const speed = 1 + (c % 5) * 0.4;
    const yOffset = (time * 80 * speed + c * 37) % (h + 80);

    for (let row = 0; row < 12; row++) {
      const y = yOffset - row * fontSize;
      if (y < 0 || y > h) continue;

      const charIdx = (c * 7 + row + Math.floor(time * 5)) % chars.length;
      const char = chars[charIdx];

      if (row === 0) {
        ctx.fillStyle = '#FFFFFF'; // Head of rain
      } else if (row < 3) {
        ctx.fillStyle = '#CCFF00'; // Acid neon trail
      } else {
        ctx.fillStyle = '#1A7A1A'; // Fading green phosphor
      }

      ctx.fillText(char, x, y);
    }
  }

  // Scanline overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  for (let y = 0; y < h; y += 3) {
    ctx.fillRect(0, y, w, 1);
  }
}
