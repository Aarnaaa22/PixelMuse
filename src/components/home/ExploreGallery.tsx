import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sparkles, SlidersHorizontal, Play } from 'lucide-react';
import { Button, Badge } from '../ui';
import { CURATED_PRESETS } from '../../presets/curatedPresets';
import { createSamplePhotoCanvas } from '../../utilities/samplePhotos';
import { useStudioStore } from '../../stores';
import { ArtPreset } from '../../types';

export const GALLERY_ITEMS = [
  {
    presetId: 'preset-digital-bloom',
    displayTitle: 'DIGITAL BLOOM',
    effectLabel: 'Dots / Bloom',
    description: 'Luminous circular dots modulating with luminance bloom and delicate violet spectrum.',
    sampleSubject: 'marble-sculpture' as const,
    motionType: 'bloom-pulse' as const,
    accentColor: '#9D4EDD',
  },
  {
    presetId: 'preset-cyber-terminal',
    displayTitle: 'CYBER TERMINAL',
    effectLabel: 'ASCII Matrix',
    description: 'Dense monospace glyph typography with phosphor CRT cathode scanlines.',
    sampleSubject: 'cyberpunk-neon' as const,
    motionType: 'crt-scramble' as const,
    accentColor: '#33E533',
  },
  {
    presetId: 'preset-neon-dream',
    displayTitle: 'NEON DREAM',
    effectLabel: 'Geometric Crosses',
    description: 'Electric violet and signal coral geometric crosses with deep synthwave glow.',
    sampleSubject: 'marble-sculpture' as const,
    motionType: 'cross-rotate' as const,
    accentColor: '#FF1493',
  },
  {
    presetId: 'preset-retro-pixels',
    displayTitle: 'RETRO PIXELS',
    effectLabel: 'Quantized Pixel',
    description: 'Sharp quantized 8-bit arcade blocks with phosphor edge clarity.',
    sampleSubject: 'cyberpunk-neon' as const,
    motionType: 'pixel-crush' as const,
    accentColor: '#CCFF00',
  },
  {
    presetId: 'preset-soft-dither',
    displayTitle: 'MONOCHROME STUDY',
    effectLabel: 'Atkinson Dither',
    description: '1984 MacPaint error diffusion with preserved highlight grain and noir tone.',
    sampleSubject: 'brutalist-facade' as const,
    motionType: 'dither-ferrofluid' as const,
    accentColor: '#FAFAFA',
  },
  {
    presetId: 'preset-acid-geometry',
    displayTitle: 'ACID GEOMETRY',
    effectLabel: 'Prismatic Hexagons',
    description: 'Stark interlocking hexagonal prisms soaked in high-voltage acid lime.',
    sampleSubject: 'marble-sculpture' as const,
    motionType: 'hex-kaleidoscope' as const,
    accentColor: '#CCFF00',
  },
  {
    presetId: 'preset-matrix-rain',
    displayTitle: 'MATRIX RAIN',
    effectLabel: 'Animated Code Rain',
    description: 'Cascading digital code streams with phosphor trails and 60 FPS animation.',
    sampleSubject: 'cyberpunk-neon' as const,
    motionType: 'matrix-hyperdrive' as const,
    accentColor: '#33E533',
  },
  {
    presetId: 'preset-chromatic-pulse',
    displayTitle: 'KINETIC RINGS',
    effectLabel: 'Animated Rings',
    description: 'Harmonic concentric rings oscillating with radial energy and chromatic flares.',
    sampleSubject: 'marble-sculpture' as const,
    motionType: 'rings-shockwave' as const,
    accentColor: '#CCFF00',
  },
];

const PREVIEW_WIDTH = 280;
const PREVIEW_HEIGHT = 280;

// -----------------------------------------------------------------------------
// 8 BESPOKE KINETIC GENERATIVE ENGINES (ONE FOR EACH ARTWORK)
// -----------------------------------------------------------------------------

// 1. DIGITAL BLOOM: Luminescent Radial Breathing & Bloom Wave Pulse
function renderDigitalBloom(ctx: CanvasRenderingContext2D, source: ImageData, elapsed: number, w: number, h: number) {
  ctx.fillStyle = '#08080C';
  ctx.fillRect(0, 0, w, h);

  const cellSize = 10;
  const cols = Math.floor(w / cellSize);
  const rows = Math.floor(h / cellSize);
  const cx = w / 2;
  const cy = h / 2;
  const data = source.data;

  // Luminous radial breathing bloom wave
  const bloomPulse = (Math.sin(elapsed * 4.0) + 1) / 2;

  // Ambient center bloom halo
  const radial = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140 + bloomPulse * 30);
  radial.addColorStop(0, `rgba(157, 78, 221, ${0.4 + bloomPulse * 0.3})`);
  radial.addColorStop(0.5, `rgba(204, 255, 0, ${0.15 + bloomPulse * 0.15})`);
  radial.addColorStop(1, 'transparent');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, w, h);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellSize + cellSize / 2;
      const y = r * cellSize + cellSize / 2;
      const srcIdx = (Math.floor(y) * source.width + Math.floor(x)) * 4;
      const red = data[srcIdx];
      const green = data[srcIdx + 1];
      const blue = data[srcIdx + 2];
      const lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

      const dist = Math.hypot(x - cx, y - cy);
      // Concentric wave ripple traveling outward
      const wave = Math.sin(elapsed * 5.0 - dist * 0.06);
      const maxRadius = (cellSize / 2) * 1.15;
      const radius = Math.max(0.6, lum * maxRadius * (1 + 0.5 * wave));

      if (radius > 0.8) {
        if (lum > 0.6) {
          ctx.fillStyle = wave > 0 ? '#CCFF00' : '#FFFFFF';
        } else if (lum > 0.3) {
          ctx.fillStyle = wave > 0 ? '#9D4EDD' : '#C77DFF';
        } else {
          ctx.fillStyle = '#3C1661';
        }
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// 2. CYBER TERMINAL: Rolling CRT Cathode Beam & Dynamic Monospace Scramble
const ASCII_CHARS = ' .:-=+*#%@$░▒▓█';
const GLITCH_CHARS = '01#*+:=~-█▓▒░ｦｱｳｴｵｶｷ';
function renderCyberTerminal(ctx: CanvasRenderingContext2D, source: ImageData, elapsed: number, w: number, h: number) {
  ctx.fillStyle = '#050805';
  ctx.fillRect(0, 0, w, h);

  const cellSize = 10;
  const cols = Math.floor(w / cellSize);
  const rows = Math.floor(h / cellSize);
  const data = source.data;

  // Rolling CRT cathode beam
  const beamY = (elapsed * 180) % h;
  const beamHeight = 40;

  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let r = 0; r < rows; r++) {
    const y = r * cellSize + cellSize / 2;
    const distToBeam = Math.abs(y - beamY);
    const isBeamActive = distToBeam < beamHeight;

    for (let c = 0; c < cols; c++) {
      const x = c * cellSize + cellSize / 2;
      const srcIdx = (Math.floor(y) * source.width + Math.floor(x)) * 4;
      const red = data[srcIdx];
      const green = data[srcIdx + 1];
      const blue = data[srcIdx + 2];
      const lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

      let char: string;
      if (isBeamActive && Math.random() < 0.5) {
        char = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        ctx.fillStyle = '#FFFFFF';
      } else {
        const charIdx = Math.min(ASCII_CHARS.length - 1, Math.floor(lum * ASCII_CHARS.length));
        char = ASCII_CHARS[charIdx];
        if (lum > 0.65) {
          ctx.fillStyle = '#33E533';
        } else if (lum > 0.3) {
          ctx.fillStyle = '#1EB01E';
        } else {
          ctx.fillStyle = '#0E550E';
        }
      }

      if (char && char !== ' ') {
        ctx.fillText(char, x, y);
      }
    }
  }

  // Draw glowing CRT beam scanline overlay
  const beamGrad = ctx.createLinearGradient(0, beamY - 15, 0, beamY + 15);
  beamGrad.addColorStop(0, 'rgba(51, 229, 51, 0)');
  beamGrad.addColorStop(0.5, 'rgba(51, 229, 51, 0.45)');
  beamGrad.addColorStop(1, 'rgba(51, 229, 51, 0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, beamY - 15, w, 30);

  // CRT scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  for (let y = 0; y < h; y += 3) {
    ctx.fillRect(0, y, w, 1);
  }
}

// 3. NEON DREAM: Gyroscopic Cross Rotation & Synthwave Prism Pulse
function renderNeonDream(ctx: CanvasRenderingContext2D, source: ImageData, elapsed: number, w: number, h: number) {
  ctx.fillStyle = '#0A0612';
  ctx.fillRect(0, 0, w, h);

  const cellSize = 14;
  const cols = Math.floor(w / cellSize);
  const rows = Math.floor(h / cellSize);
  const data = source.data;
  const waveTime = elapsed * 4.0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellSize + cellSize / 2;
      const y = r * cellSize + cellSize / 2;
      const srcIdx = (Math.floor(y) * source.width + Math.floor(x)) * 4;
      const red = data[srcIdx];
      const green = data[srcIdx + 1];
      const blue = data[srcIdx + 2];
      const lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

      if (lum < 0.1) continue;

      // Rotating spinning cross
      const angle = Math.sin(waveTime + (x + y) * 0.03) * Math.PI * 0.9;
      const crossSize = Math.max(2, (cellSize / 2) * lum * (1 + 0.35 * Math.sin(waveTime + (x - y) * 0.04)));

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Color spectrum wave
      const colorPhase = Math.sin(waveTime * 0.8 + (x - y) * 0.02);
      let strokeColor = '#FF1493';
      if (colorPhase > 0.4) strokeColor = '#CCFF00';
      else if (colorPhase > -0.2) strokeColor = '#9D4EDD';

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lum > 0.6 ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(-crossSize, 0);
      ctx.lineTo(crossSize, 0);
      ctx.moveTo(0, -crossSize);
      ctx.lineTo(0, crossSize);
      ctx.stroke();

      ctx.restore();
    }
  }
}

// 4. RETRO PIXELS: Dynamic Bit-Crush Quantization & Arcade Sync Glitch
function renderRetroPixels(ctx: CanvasRenderingContext2D, source: ImageData, elapsed: number, w: number, h: number) {
  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, w, h);

  // Dynamic bit-crush modulation between 8px and 22px
  const crushPulse = (Math.sin(elapsed * 3.5) + 1) / 2;
  const cellSize = Math.round(8 + crushPulse * 12);
  const cols = Math.ceil(w / cellSize);
  const rows = Math.ceil(h / cellSize);
  const data = source.data;

  // Glitch jitter row-shift
  const glitchRow = Math.floor(((elapsed * 12) % rows));
  const glitchShift = (Math.sin(elapsed * 15) > 0.7) ? 8 : 0;

  for (let r = 0; r < rows; r++) {
    const isGlitch = r === glitchRow || r === glitchRow + 1;
    const shiftX = isGlitch ? glitchShift : 0;

    for (let c = 0; c < cols; c++) {
      const x = c * cellSize + shiftX;
      const y = r * cellSize;
      const sampleX = Math.min(source.width - 1, Math.max(0, Math.floor(x)));
      const sampleY = Math.min(source.height - 1, Math.max(0, Math.floor(y)));
      const idx = (sampleY * source.width + sampleX) * 4;

      let red = data[idx];
      let green = data[idx + 1];
      let blue = data[idx + 2];

      // Quantize to 8-bit palette
      red = Math.round(red / 36) * 36;
      green = Math.round(green / 36) * 36;
      blue = Math.round(blue / 36) * 36;

      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
    }
  }

  // Retro scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 1.5);
  }
}

// 5. MONOCHROME STUDY: Ferrofluid Topological Wave & Dancing Film Grain
function renderMonochromeStudy(ctx: CanvasRenderingContext2D, source: ImageData, elapsed: number, w: number, h: number) {
  const cellSize = 5;
  const cols = Math.floor(w / cellSize);
  const rows = Math.floor(h / cellSize);
  const data = source.data;

  ctx.fillStyle = '#08080A';
  ctx.fillRect(0, 0, w, h);

  // Ferrofluid wave
  const waveTime = elapsed * 4.0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellSize;
      const y = r * cellSize;
      const idx = (Math.floor(y) * source.width + Math.floor(x)) * 4;
      const lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;

      const wave = Math.sin(waveTime + (x * 0.03 + y * 0.04));
      const threshold = 0.50 + 0.20 * wave;
      const grain = (Math.sin(x * 12.9898 + y * 78.233 + elapsed * 10) * 43758.5453) % 1;

      const dotActive = (lum + (grain - 0.5) * 0.38) > threshold;

      if (dotActive) {
        ctx.fillStyle = lum > 0.75 ? '#FAFAFA' : '#A0A0B0';
        ctx.fillRect(x + 1, y + 1, cellSize - 1.5, cellSize - 1.5);
      }
    }
  }
}

// 6. ACID GEOMETRY: Rotating Honeycomb Kaleidoscope & Prismatic Shimmer Wave
function renderAcidGeometry(ctx: CanvasRenderingContext2D, source: ImageData, elapsed: number, w: number, h: number) {
  ctx.fillStyle = '#060706';
  ctx.fillRect(0, 0, w, h);

  const hexRadius = 11;
  const horizDist = hexRadius * Math.sqrt(3);
  const vertDist = hexRadius * 1.5;
  const cols = Math.ceil(w / horizDist) + 2;
  const rows = Math.ceil(h / vertDist) + 2;
  const data = source.data;
  const waveTime = elapsed * 3.5;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * horizDist + (r % 2 === 1 ? horizDist / 2 : 0);
      const y = r * vertDist;
      if (x < -hexRadius || x > w + hexRadius || y < -hexRadius || y > h + hexRadius) continue;

      const sampleX = Math.min(source.width - 1, Math.max(0, Math.floor(x)));
      const sampleY = Math.min(source.height - 1, Math.max(0, Math.floor(y)));
      const idx = (sampleY * source.width + sampleX) * 4;
      const lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;

      const dist = Math.hypot(x - w / 2, y - h / 2);
      const hexAngle = Math.sin(waveTime - dist * 0.04) * 0.45;
      const sizeMod = Math.max(0.2, lum * (1 + 0.35 * Math.sin(waveTime + (x - y) * 0.02)));

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(hexAngle);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const rad = (Math.PI / 3) * i;
        const hx = (hexRadius * sizeMod) * Math.cos(rad);
        const hy = (hexRadius * sizeMod) * Math.sin(rad);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();

      const shimmer = (Math.sin(waveTime * 1.2 + (x + y) * 0.03) + 1) / 2;
      ctx.fillStyle = lum > 0.5 ? `rgba(204, 255, 0, ${0.4 + shimmer * 0.5})` : 'rgba(26, 42, 10, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#CCFF00';
      ctx.lineWidth = lum > 0.4 ? 1.5 : 0.8;
      ctx.stroke();

      ctx.restore();
    }
  }
}

// 7. MATRIX RAIN: Hyperdrive Cascading Katakana Rain with Glowing Heads
const MATRIX_CHARS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEF$#@*+=-:';
function renderMatrixRain(ctx: CanvasRenderingContext2D, source: ImageData, _elapsed: number, w: number, h: number, columnsState: number[], isHovered: boolean) {
  ctx.fillStyle = isHovered ? 'rgba(5, 8, 5, 0.25)' : 'rgba(5, 8, 5, 0.4)';
  ctx.fillRect(0, 0, w, h);

  const colWidth = 10;
  const numCols = Math.floor(w / colWidth);
  const data = source.data;
  const speed = isHovered ? 8.5 : 4.0;

  ctx.font = '10px monospace';
  ctx.textAlign = 'center';

  for (let c = 0; c < numCols; c++) {
    const x = c * colWidth + colWidth / 2;
    let y = columnsState[c];
    if (y === undefined) y = Math.random() * h;

    y += speed + (c % 5) * 1.5;
    if (y > h) {
      y = 0;
    }
    columnsState[c] = y;

    const sampleY = Math.min(source.height - 1, Math.max(0, Math.floor(y)));
    const sampleX = Math.min(source.width - 1, Math.max(0, Math.floor(x)));
    const idx = (sampleY * source.width + sampleX) * 4;
    const lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;

    const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(char, x, y);

    for (let t = 1; t <= 5; t++) {
      const trailY = y - t * 12;
      if (trailY > 0) {
        ctx.fillStyle = lum > 0.5 ? '#33E533' : `rgba(30, 176, 30, ${1 - t * 0.18})`;
        ctx.fillText(MATRIX_CHARS[(char.charCodeAt(0) + t) % MATRIX_CHARS.length], x, trailY);
      }
    }
  }
}

// 8. KINETIC RINGS: Multi-Harmonic Concentric Ring Shockwaves & Chromatic Orbit
function renderKineticRings(ctx: CanvasRenderingContext2D, source: ImageData, elapsed: number, w: number, h: number, isHovered: boolean) {
  ctx.fillStyle = '#08080C';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.hypot(cx, cy);
  const waveSpeed = isHovered ? 85 : 45;
  const numRings = 16;
  const data = source.data;

  for (let i = 0; i < numRings; i++) {
    const phase = (i / numRings) * maxRadius;
    const r = (phase + elapsed * waveSpeed) % maxRadius;

    const sampleX = Math.min(source.width - 1, Math.max(0, Math.floor(cx + r * 0.5)));
    const sampleY = Math.min(source.height - 1, Math.max(0, Math.floor(cy)));
    const idx = (sampleY * source.width + sampleX) * 4;
    const lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;

    const alpha = Math.max(0, 1 - r / maxRadius) * (0.4 + lum * 0.6);
    const ringWidth = Math.max(1, (1 + lum * 4) * (1 + 0.4 * Math.sin(elapsed * 6 + i)));

    ctx.lineWidth = ringWidth;

    // Ring 1: Lime / Cyan
    ctx.strokeStyle = `rgba(204, 255, 0, ${alpha})`;
    ctx.beginPath();
    ctx.arc(cx - 1.5, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Ring 2: Electric Violet / Magenta
    ctx.strokeStyle = `rgba(157, 78, 221, ${alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(cx + 1.5, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// -----------------------------------------------------------------------------
// COMPONENT: INTERACTIVE ARTWORK CARD
// -----------------------------------------------------------------------------
interface GalleryCardProps {
  item: typeof GALLERY_ITEMS[0];
  preset: ArtPreset;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onSelect: (preset: ArtPreset) => void;
}

export const InteractiveArtworkCard: React.FC<GalleryCardProps> = ({
  item,
  preset,
  isActive,
  onActivate,
  onDeactivate,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImageDataRef = useRef<ImageData | null>(null);
  const isIntersectingRef = useRef<boolean>(false);
  const columnsStateRef = useRef<number[]>([]);

  // Pre-render sample photo once and cache its ImageData
  useEffect(() => {
    const sampleCanvas = createSamplePhotoCanvas(item.sampleSubject);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = PREVIEW_WIDTH;
    tempCanvas.height = PREVIEW_HEIGHT;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(sampleCanvas, 0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
      sourceImageDataRef.current = tempCtx.getImageData(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
    }
  }, [item.sampleSubject]);

  // Viewport IntersectionObserver: pauses animations when scrolled off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        isIntersectingRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Main Live Render Loop (Runs distinct kinetic generative movement)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      // If outside viewport, suspend rendering loop
      if (!isIntersectingRef.current) {
        if (isActive) {
          rafId = requestAnimationFrame(render);
        }
        return;
      }

      const source = sourceImageDataRef.current;
      if (!source) {
        rafId = requestAnimationFrame(render);
        return;
      }

      // If active (hovered or tapped), drive at real live 60 FPS elapsed time.
      // If idle, use static presentation or gentle idle cadence for matrix/rings.
      const elapsed = isActive
        ? (now - startTime) / 1000
        : (item.motionType === 'matrix-hyperdrive' || item.motionType === 'rings-shockwave')
        ? (now - startTime) / 1000 * 0.4
        : 0;

      // Execute the unique generative movement engine for this card
      switch (item.motionType) {
        case 'bloom-pulse':
          renderDigitalBloom(ctx, source, elapsed, PREVIEW_WIDTH, PREVIEW_HEIGHT);
          break;
        case 'crt-scramble':
          renderCyberTerminal(ctx, source, elapsed, PREVIEW_WIDTH, PREVIEW_HEIGHT);
          break;
        case 'cross-rotate':
          renderNeonDream(ctx, source, elapsed, PREVIEW_WIDTH, PREVIEW_HEIGHT);
          break;
        case 'pixel-crush':
          renderRetroPixels(ctx, source, elapsed, PREVIEW_WIDTH, PREVIEW_HEIGHT);
          break;
        case 'dither-ferrofluid':
          renderMonochromeStudy(ctx, source, elapsed, PREVIEW_WIDTH, PREVIEW_HEIGHT);
          break;
        case 'hex-kaleidoscope':
          renderAcidGeometry(ctx, source, elapsed, PREVIEW_WIDTH, PREVIEW_HEIGHT);
          break;
        case 'matrix-hyperdrive':
          renderMatrixRain(ctx, source, elapsed, PREVIEW_WIDTH, PREVIEW_HEIGHT, columnsStateRef.current, isActive);
          break;
        case 'rings-shockwave':
          renderKineticRings(ctx, source, elapsed, PREVIEW_WIDTH, PREVIEW_HEIGHT, isActive);
          break;
      }

      // Keep loop running if active (hovered) or if kinetic style
      if (isActive || item.motionType === 'matrix-hyperdrive' || item.motionType === 'rings-shockwave') {
        rafId = requestAnimationFrame(render);
      }
    };

    render(performance.now());

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isActive, item.motionType]);

  return (
    <article
      ref={containerRef}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onClick={onActivate}
      className={`group relative bg-obsidian-surface border transition-all duration-300 rounded-xs flex flex-col justify-between overflow-hidden cursor-pointer ${
        isActive
          ? 'border-acid-lime shadow-[0_0_30px_rgba(204,255,0,0.22)] ring-1 ring-acid-lime/60 -translate-y-1'
          : 'border-obsidian-border hover:border-obsidian-border-hover'
      }`}
    >
      {/* Artwork Canvas Stage */}
      <div className="relative aspect-square w-full bg-obsidian-950 overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-102"
        />

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
          <Badge variant={isActive ? 'lime' : 'outline'} size="xs">
            {item.effectLabel}
          </Badge>
          {isActive && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-obsidian-950/90 border border-acid-lime text-acid-lime rounded-2xs flex items-center gap-1 backdrop-blur-xs animate-fade-in">
              <Play className="w-2 h-2 fill-current animate-pulse" />
              LIVE MOTION
            </span>
          )}
        </div>

        {/* Active Kinetic Status Indicator */}
        {isActive && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 bg-obsidian-950/90 border border-acid-lime font-mono text-[9px] text-acid-lime uppercase rounded-2xs shadow-active-lime animate-fade-in backdrop-blur-xs pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-ping" />
            <span>KINETIC FLUX</span>
          </div>
        )}
      </div>

      {/* Card Body & Info Area */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3 bg-obsidian-surface border-t border-obsidian-border/50">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm sm:text-base font-extrabold uppercase text-white tracking-wide group-hover:text-acid-lime transition-colors">
              {item.displayTitle}
            </h3>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-obsidian-border"
              style={{ backgroundColor: item.accentColor }}
            />
          </div>

          <p className="font-mono text-2xs text-obsidian-text leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Palette Bar */}
        <div className="flex h-1.5 w-full border border-obsidian-border rounded-2xs overflow-hidden">
          {preset.config.palette.colors.map((c, i) => (
            <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Action Button: Opens the exact preset in Studio */}
        <div className="pt-1">
          <Button
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            className="w-full justify-center font-mono text-xs font-bold"
            icon={isActive ? <Sparkles className="w-3.5 h-3.5 text-black" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            iconPosition="right"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(preset);
            }}
          >
            {isActive ? 'TRY THIS STYLE' : 'OPEN IN STUDIO'}
          </Button>
        </div>
      </div>
    </article>
  );
};

export const ExploreGallery: React.FC = () => {
  const navigate = useNavigate();
  const applyPreset = useStudioStore((s) => s.applyPreset);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'kinetic' | 'raster'>('all');

  const handleSelectPreset = useCallback(
    async (preset: ArtPreset) => {
      await applyPreset(preset, true);
      navigate('/studio');
    },
    [applyPreset, navigate]
  );

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (categoryFilter === 'kinetic') return item.motionType === 'matrix-hyperdrive' || item.motionType === 'rings-shockwave';
    if (categoryFilter === 'raster') return item.motionType !== 'matrix-hyperdrive' && item.motionType !== 'rings-shockwave';
    return true;
  });

  return (
    <section className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-obsidian-border studio-grain">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-obsidian-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="lime" dot>
              Interactive Art Gallery
            </Badge>
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              08 LIVE KINETIC GENERATIVE EXHIBITS
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-none">
            Explore Generative Transformations
          </h2>
          <p className="font-mono text-xs sm:text-sm text-obsidian-text max-w-2xl leading-relaxed">
            Hover over any artwork to experience its unique generative motion. Each style runs a bespoke Canvas 2D
            mathematical algorithm in real-time. Click <span className="text-acid-lime font-semibold">Try This Style</span> to load its exact formulas into Studio.
          </p>
        </div>

        {/* View Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-obsidian-surface border border-obsidian-border rounded-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 font-mono text-2xs uppercase rounded-2xs transition-colors ${
              categoryFilter === 'all'
                ? 'bg-acid-lime text-black font-bold'
                : 'text-obsidian-muted hover:text-white'
            }`}
          >
            All (8)
          </button>
          <button
            onClick={() => setCategoryFilter('kinetic')}
            className={`px-2.5 py-1 font-mono text-2xs uppercase rounded-2xs transition-colors flex items-center gap-1 ${
              categoryFilter === 'kinetic'
                ? 'bg-acid-lime text-black font-bold'
                : 'text-obsidian-muted hover:text-white'
            }`}
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            Kinetic
          </button>
          <button
            onClick={() => setCategoryFilter('raster')}
            className={`px-2.5 py-1 font-mono text-2xs uppercase rounded-2xs transition-colors flex items-center gap-1 ${
              categoryFilter === 'raster'
                ? 'bg-acid-lime text-black font-bold'
                : 'text-obsidian-muted hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-2.5 h-2.5" />
            Rasters
          </button>
        </div>
      </div>

      {/* 8-Piece Interactive Exhibition Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const matchedPreset =
            CURATED_PRESETS.find((p) => p.id === item.presetId) || CURATED_PRESETS[0];

          return (
            <InteractiveArtworkCard
              key={item.presetId}
              item={item}
              preset={matchedPreset}
              isActive={activeCardId === item.presetId}
              onActivate={() => setActiveCardId(item.presetId)}
              onDeactivate={() => setActiveCardId(null)}
              onSelect={handleSelectPreset}
            />
          );
        })}
      </div>
    </section>
  );
};
