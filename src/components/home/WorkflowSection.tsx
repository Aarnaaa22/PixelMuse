import React, { useEffect, useRef } from 'react';
import { Badge } from '../ui';
import { createSamplePhotoCanvas } from '../../utilities/samplePhotos';
import { BAYER_8X8 } from '../../utilities';

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  canvasDrawer: (canvas: HTMLCanvasElement) => () => void;
}

// 1. Step 1 Visual: Photo entering processing with pixel sampling and visible raster grid
const drawStep1 = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let rafId: number;
  let startTime = performance.now();
  const photo = createSamplePhotoCanvas('marble-sculpture');

  const render = (now: number) => {
    const time = (now - startTime) / 1000;
    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = '#08080A';
    ctx.fillRect(0, 0, w, h);

    // Source photo subject
    ctx.drawImage(photo, 0, 0, w, h);

    // Raster Grid Lines (animated grid appearance)
    const gridSize = 20;
    const gridAlpha = 0.25 + Math.sin(time * 2) * 0.1;
    ctx.strokeStyle = `rgba(204, 255, 0, ${gridAlpha})`;
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = 0; x < w; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Scanning sweep line
    const scanY = (time * 80) % h;
    ctx.fillStyle = 'rgba(204, 255, 0, 0.2)';
    ctx.fillRect(0, scanY, w, 3);

    // Sampling crosshair target
    const targetX = (w * 0.5) + Math.sin(time * 1.5) * 60;
    const targetY = (h * 0.5) + Math.cos(time * 1.2) * 40;

    ctx.strokeStyle = '#CCFF00';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(targetX - 12, targetY - 12, 24, 24);

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#CCFF00';
    ctx.fillText(`SAMPLE [${Math.round(targetX)}, ${Math.round(targetY)}]`, targetX + 16, targetY + 4);

    rafId = requestAnimationFrame(render);
  };

  rafId = requestAnimationFrame(render);
  return () => cancelAnimationFrame(rafId);
};

// 2. Step 2 Visual: Splitting simultaneously into ASCII, dots, geometric and pixels
const drawStep2 = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let rafId: number;
  let startTime = performance.now();

  const render = (now: number) => {
    const time = (now - startTime) / 1000;
    const w = canvas.width;
    const h = canvas.height;
    const halfW = w / 2;
    const halfH = h / 2;

    ctx.fillStyle = '#08080A';
    ctx.fillRect(0, 0, w, h);

    // Quadrant 1 (Top-Left): ASCII Glyphs
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, halfW, halfH);
    ctx.clip();
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const glyphs = ' .:-=+*#%@$░▒▓█';
    for (let y = 8; y < halfH; y += 12) {
      for (let x = 8; x < halfW; x += 12) {
        const wave = (Math.sin(x * 0.05 + y * 0.05 + time * 3) + 1) / 2;
        const g = glyphs[Math.floor(wave * glyphs.length) % glyphs.length];
        ctx.fillStyle = wave > 0.5 ? '#CCFF00' : '#EDEDF2';
        ctx.fillText(g, x, y);
      }
    }
    ctx.restore();

    // Quadrant 2 (Top-Right): Halftone Dots
    ctx.save();
    ctx.beginPath();
    ctx.rect(halfW, 0, halfW, halfH);
    ctx.clip();
    for (let y = 8; y < halfH; y += 14) {
      for (let x = halfW + 8; x < w; x += 14) {
        const wave = (Math.sin((x - halfW) * 0.04 + y * 0.04 + time * 2) + 1) / 2;
        const radius = Math.max(1, wave * 6);
        ctx.fillStyle = '#9D4EDD';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Quadrant 3 (Bottom-Left): Hexagonal Geometry
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, halfH, halfW, halfH);
    ctx.clip();
    const hexR = 12;
    for (let y = halfH + 8; y < h; y += hexR * 1.5) {
      for (let x = 8; x < halfW; x += hexR * 1.8) {
        ctx.strokeStyle = '#CCFF00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const px = x + hexR * Math.cos(a);
          const py = y + hexR * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();

    // Quadrant 4 (Bottom-Right): Quantized Pixels
    ctx.save();
    ctx.beginPath();
    ctx.rect(halfW, halfH, halfW, halfH);
    ctx.clip();
    const size = 14;
    for (let y = halfH; y < h; y += size) {
      for (let x = halfW; x < w; x += size) {
        const wave = Math.sin((x + y) * 0.03 + time * 3);
        ctx.fillStyle = wave > 0.3 ? '#FF473A' : wave > 0 ? '#1F1F28' : '#08080A';
        ctx.fillRect(x, y, size - 1, size - 1);
      }
    }
    ctx.restore();

    // Dividing crosshairs separating the 4 engines
    ctx.strokeStyle = '#1F1F28';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(halfW, 0);
    ctx.lineTo(halfW, h);
    ctx.moveTo(0, halfH);
    ctx.lineTo(w, halfH);
    ctx.stroke();

    // Engine labels
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('01: ASCII', 8, 14);
    ctx.fillText('02: DOTS', halfW + 8, 14);
    ctx.fillText('03: HEX', 8, halfH + 14);
    ctx.fillText('04: PIXEL', halfW + 8, halfH + 14);

    rafId = requestAnimationFrame(render);
  };

  rafId = requestAnimationFrame(render);
  return () => cancelAnimationFrame(rafId);
};

// 3. Step 3 Visual: Color remapping, neon lighting, grain, glitch and visual distortion
const drawStep3 = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let rafId: number;
  let startTime = performance.now();

  const render = (now: number) => {
    const time = (now - startTime) / 1000;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#08080A';
    ctx.fillRect(0, 0, w, h);

    // Dynamic neon radial spotlights
    const light1X = (w * 0.4) + Math.sin(time * 2) * 50;
    const light1Y = (h * 0.5) + Math.cos(time * 1.5) * 30;
    const g1 = ctx.createRadialGradient(light1X, light1Y, 10, light1X, light1Y, 120);
    g1.addColorStop(0, 'rgba(157, 78, 221, 0.6)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const light2X = (w * 0.65) + Math.cos(time * 2.2) * 40;
    const light2Y = (h * 0.4) + Math.sin(time * 1.8) * 35;
    const g2 = ctx.createRadialGradient(light2X, light2Y, 10, light2X, light2Y, 100);
    g2.addColorStop(0, 'rgba(204, 255, 0, 0.5)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    // Chromatic Aberration RGB displacement waves
    ctx.save();
    ctx.font = '900 36px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const glitchOffset = Math.sin(time * 8) > 0.7 ? (Math.random() - 0.5) * 16 : 0;

    // Cyan / Blue channel shift
    ctx.fillStyle = 'rgba(78, 175, 255, 0.7)';
    ctx.fillText('COLOR MATRIX', w / 2 - 4 + glitchOffset, h / 2);

    // Red / Coral channel shift
    ctx.fillStyle = 'rgba(255, 71, 58, 0.7)';
    ctx.fillText('COLOR MATRIX', w / 2 + 4 - glitchOffset, h / 2);

    // White core
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('COLOR MATRIX', w / 2, h / 2);
    ctx.restore();

    // Glitch horizontal slices
    if (Math.sin(time * 6) > 0.6) {
      const sliceY = (Math.sin(time * 15) * 0.5 + 0.5) * h;
      const sliceH = 8;
      ctx.fillStyle = '#CCFF00';
      ctx.fillRect(0, sliceY, w, 1);
      ctx.fillStyle = 'rgba(255, 71, 58, 0.2)';
      ctx.fillRect(20, sliceY, w - 40, sliceH);
    }

    // Stochastic grain overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    for (let i = 0; i < 180; i++) {
      const gx = Math.random() * w;
      const gy = Math.random() * h;
      ctx.fillRect(gx, gy, 1, 1);
    }

    rafId = requestAnimationFrame(render);
  };

  rafId = requestAnimationFrame(render);
  return () => cancelAnimationFrame(rafId);
};

// 4. Step 4 Visual: Master artwork export with camera registration reticles and subtle file badges
const drawStep4 = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let rafId: number;
  let startTime = performance.now();

  const render = (now: number) => {
    const time = (now - startTime) / 1000;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#08080A';
    ctx.fillRect(0, 0, w, h);

    // Center framed master artwork preview
    const pad = 24;
    const artW = w - pad * 2;
    const artH = h - pad * 2;

    // Bayer dithered interior pattern
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad, pad, artW, artH);
    ctx.clip();

    ctx.fillStyle = '#121218';
    ctx.fillRect(pad, pad, artW, artH);

    const matrix = BAYER_8X8;
    ctx.fillStyle = '#CCFF00';
    for (let dy = 0; dy < artH; dy += 4) {
      const my = Math.floor(dy / 4) % 8;
      for (let dx = 0; dx < artW; dx += 4) {
        const mx = Math.floor(dx / 4) % 8;
        const thr = matrix[my][mx];
        const rad = Math.sqrt(Math.pow(dx - artW / 2, 2) + Math.pow(dy - artH / 2, 2)) / (artW * 0.5);
        if (rad < 0.8 && (1 - rad) > thr) {
          ctx.fillRect(pad + dx, pad + dy, 2.5, 2.5);
        }
      }
    }
    ctx.restore();

    // Precision boundary frame with subtle breathing glow
    const frameGlow = 0.6 + Math.sin(time * 2) * 0.3;
    ctx.strokeStyle = `rgba(204, 255, 0, ${frameGlow})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, pad, artW, artH);

    // Corner registration crop marks (┌ ┐ └ ┘)
    const mLen = 8;
    ctx.strokeStyle = '#EDEDF2';
    ctx.lineWidth = 1.5;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(pad - 6, pad);
    ctx.lineTo(pad - 6 - mLen, pad);
    ctx.moveTo(pad, pad - 6);
    ctx.lineTo(pad, pad - 6 - mLen);
    // Top-right
    ctx.moveTo(w - pad + 6, pad);
    ctx.lineTo(w - pad + 6 + mLen, pad);
    ctx.moveTo(w - pad, pad - 6);
    ctx.lineTo(w - pad, pad - 6 - mLen);
    // Bottom-left
    ctx.moveTo(pad - 6, h - pad);
    ctx.lineTo(pad - 6 - mLen, h - pad);
    ctx.moveTo(pad, h - pad + 6);
    ctx.lineTo(pad, h - pad + 6 + mLen);
    // Bottom-right
    ctx.moveTo(w - pad + 6, h - pad);
    ctx.lineTo(w - pad + 6 + mLen, h - pad);
    ctx.moveTo(w - pad, h - pad + 6);
    ctx.lineTo(w - pad, h - pad + 6 + mLen);
    ctx.stroke();

    // Floating file format pills
    const badgeW = 60;
    const badgeH = 18;
    const by = h - pad - badgeH - 8;

    // Format 1: PNG 4K
    ctx.fillStyle = 'rgba(8, 8, 10, 0.9)';
    ctx.fillRect(pad + 8, by, badgeW, badgeH);
    ctx.strokeStyle = '#CCFF00';
    ctx.strokeRect(pad + 8, by, badgeW, badgeH);
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#CCFF00';
    ctx.fillText('PNG 4K', pad + 14, by + 12);

    // Format 2: WEBP
    ctx.fillStyle = 'rgba(8, 8, 10, 0.9)';
    ctx.fillRect(pad + 8 + badgeW + 6, by, 48, badgeH);
    ctx.strokeStyle = '#9D4EDD';
    ctx.strokeRect(pad + 8 + badgeW + 6, by, 48, badgeH);
    ctx.fillStyle = '#9D4EDD';
    ctx.fillText('WEBP', pad + 8 + badgeW + 12, by + 12);

    // Format 3: TXT
    ctx.fillStyle = 'rgba(8, 8, 10, 0.9)';
    ctx.fillRect(pad + 8 + badgeW + 6 + 48 + 6, by, 42, badgeH);
    ctx.strokeStyle = '#EDEDF2';
    ctx.strokeRect(pad + 8 + badgeW + 6 + 48 + 6, by, 42, badgeH);
    ctx.fillStyle = '#EDEDF2';
    ctx.fillText('TXT', pad + 8 + badgeW + 6 + 48 + 12, by + 12);

    rafId = requestAnimationFrame(render);
  };

  rafId = requestAnimationFrame(render);
  return () => cancelAnimationFrame(rafId);
};

const ProcessStepCard: React.FC<StepCardProps> = ({
  step,
  title,
  description,
  canvasDrawer,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = canvasDrawer(canvas);
    return cleanup;
  }, [canvasDrawer]);

  return (
    <div className="border border-obsidian-border bg-obsidian-surface rounded-xs overflow-hidden flex flex-col group hover:border-obsidian-border-hover transition-colors">
      {/* Prominent Visual Illustration Canvas */}
      <div className="relative aspect-[16/10] w-full bg-obsidian-950 border-b border-obsidian-border overflow-hidden">
        <canvas
          ref={canvasRef}
          width={320}
          height={200}
          className="w-full h-full object-cover block"
        />

        {/* Floating Step Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-obsidian-950/85 border border-obsidian-border text-acid-lime rounded-2xs">
            STEP {step}
          </span>
        </div>
      </div>

      {/* Step Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          <h3 className="font-display text-base font-extrabold uppercase text-white tracking-wide group-hover:text-acid-lime transition-colors">
            {title}
          </h3>
          <p className="font-mono text-xs text-obsidian-text leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const WorkflowSection: React.FC = () => {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-obsidian-border">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-obsidian-border">
        <div className="space-y-3">
          <Badge variant="lime" dot>
            Studio Workflow
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-none">
            How PixelMuse Works
          </h2>
          <p className="font-mono text-xs sm:text-sm text-obsidian-text max-w-xl">
            A linear, high-precision transformation pipeline engineered for maximum creative control
            and instant visual feedback.
          </p>
        </div>

        <div className="font-mono text-2xs text-obsidian-muted uppercase tracking-widest text-right">
          <div>PIPELINE ARCHITECTURE</div>
          <div className="text-acid-lime">HARDWARE CANVAS 2D</div>
        </div>
      </div>

      {/* 4 Rich Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProcessStepCard
          step="01"
          title="Upload Your Image"
          description="Import a photograph and let PixelMuse prepare it for transformation."
          canvasDrawer={drawStep1}
        />

        <ProcessStepCard
          step="02"
          title="Experiment With Visual Styles"
          description="Explore different rendering engines and discover unexpected visual styles."
          canvasDrawer={drawStep2}
        />

        <ProcessStepCard
          step="03"
          title="Customize Colors & Effects"
          description="Adjust colors, textures, lighting and effects to develop your own visual identity."
          canvasDrawer={drawStep3}
        />

        <ProcessStepCard
          step="04"
          title="Export Your Creation"
          description="Export your artwork in supported formats and resolutions."
          canvasDrawer={drawStep4}
        />
      </div>
    </section>
  );
};
