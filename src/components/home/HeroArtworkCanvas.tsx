import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BAYER_8X8 } from '../../utilities';
import { createSamplePhotoCanvas } from '../../utilities/samplePhotos';

type HeroMode = 'transform' | 'ascii' | 'dots' | 'pixel' | 'dither';

export const HeroArtworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<HeroMode>('transform');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  // Cached sample photo canvas
  const photoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    photoCanvasRef.current = createSamplePhotoCanvas('marble-sculpture');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const time = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw Obsidian background base
      ctx.fillStyle = '#08080A';
      ctx.fillRect(0, 0, w, h);

      const photo = photoCanvasRef.current;
      const mx = mousePos.x * w;
      const my = mousePos.y * h;

      // 2. Draw procedural subject if available
      if (photo) {
        ctx.save();
        ctx.drawImage(photo, 0, 0, w, h);
        ctx.restore();
      }

      // Dynamic split progress: oscillates or follows cursor
      let splitX = isHovering ? mx : ((Math.sin(time * 0.8) + 1) / 2) * (w * 0.7) + w * 0.15;
      if (activeMode !== 'transform') {
        splitX = w; // Full coverage for specific mode
      }

      // 3. Render Generative Overlay based on mode
      const renderGenerativeLayer = () => {
        const effectiveMode = activeMode === 'transform' ? 'composite' : activeMode;

        // A. ASCII Glyph Matrix
        if (effectiveMode === 'composite' || effectiveMode === 'ascii') {
          const glyphs = ' .:-=+*#%@$░▒▓█';
          const cellSize = 12;
          const cols = Math.floor(w / cellSize);
          const rows = Math.floor(h / cellSize);

          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';

          // Render glyphs within transformed sector
          const startCol = activeMode === 'transform' ? Math.floor(splitX / cellSize) : 0;
          for (let r = 0; r < rows; r++) {
            const py = r * cellSize + cellSize / 2;
            for (let c = startCol; c < cols; c++) {
              const px = c * cellSize + cellSize / 2;

              // Distance from focal point
              const dx = (px - w * 0.5) / (w * 0.5);
              const dy = (py - h * 0.5) / (h * 0.5);
              const dist = Math.sqrt(dx * dx + dy * dy);

              // Harmonic luma wave
              const wave = Math.sin(px * 0.02 + py * 0.02 + time * 3);
              const luma = (wave + 1) * 0.5;
              const gIdx = Math.min(glyphs.length - 1, Math.max(0, Math.floor(luma * glyphs.length)));
              const char = glyphs[gIdx];

              if (dist < 0.45) {
                ctx.fillStyle = '#CCFF00'; // Acid lime core
              } else if (dist < 0.75) {
                ctx.fillStyle = '#9D4EDD'; // Electric violet
              } else {
                ctx.fillStyle = '#FF473A'; // Signal coral
              }

              ctx.fillText(char, px, py);
            }
          }
        }

        // B. Luminous Dots / Bloom
        if (effectiveMode === 'dots') {
          const cellSize = 14;
          const cols = Math.floor(w / cellSize);
          const rows = Math.floor(h / cellSize);

          for (let r = 0; r < rows; r++) {
            const py = r * cellSize + cellSize / 2;
            for (let c = 0; c < cols; c++) {
              const px = c * cellSize + cellSize / 2;
              const wave = Math.sin(px * 0.03 - py * 0.02 + time * 2);
              const radius = Math.max(1, ((wave + 1) / 2) * 6);

              ctx.fillStyle = wave > 0.3 ? '#CCFF00' : 'rgba(157, 78, 221, 0.7)';
              ctx.beginPath();
              ctx.arc(px, py, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // C. Quantized Pixel Blocks
        if (effectiveMode === 'pixel') {
          const size = 16;
          for (let y = 0; y < h; y += size) {
            for (let x = 0; x < w; x += size) {
              const wave = Math.sin((x + y) * 0.02 + time * 2.5);
              ctx.fillStyle = wave > 0.4 ? '#CCFF00' : wave > 0 ? '#1F1F28' : '#08080A';
              ctx.fillRect(x, y, size - 1, size - 1);
            }
          }
        }

        // D. 1-Bit Bayer 8x8 Dithering Shard
        if (effectiveMode === 'composite' || effectiveMode === 'dither') {
          const shardW = Math.floor(w * 0.4);
          const shardH = Math.floor(h * 0.45);
          const shardX = Math.floor(w * 0.55);
          const shardY = Math.floor(h * 0.45);

          const matrix = BAYER_8X8;
          ctx.fillStyle = '#CCFF00';

          for (let dy = 0; dy < shardH; dy += 3) {
            const bY = Math.floor(dy / 3) % 8;
            for (let dx = 0; dx < shardW; dx += 3) {
              const bX = Math.floor(dx / 3) % 8;
              const threshold = matrix[bY][bX];
              const grad = (dx / shardW) * 0.7 + (dy / shardH) * 0.3;

              if (grad > threshold) {
                ctx.fillRect(shardX + dx, shardY + dy, 2, 2);
              }
            }
          }
        }
      };

      // 4. Clip or draw generative layer
      if (activeMode === 'transform') {
        ctx.save();
        ctx.beginPath();
        ctx.rect(splitX, 0, w - splitX, h);
        ctx.clip();
        renderGenerativeLayer();
        ctx.restore();

        // High-contrast razor divider line with neon glow
        ctx.strokeStyle = '#CCFF00';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#CCFF00';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(splitX, 0);
        ctx.lineTo(splitX, h);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Split marker icon at center of divider
        ctx.fillStyle = '#CCFF00';
        ctx.fillRect(splitX - 3, h / 2 - 16, 6, 32);
      } else {
        renderGenerativeLayer();
      }

      // 5. Restrained Cathode Scanline Sweep
      const scanY = (time * 90) % h;
      ctx.fillStyle = 'rgba(204, 255, 0, 0.08)';
      ctx.fillRect(0, scanY, w, 2);

      // Fine subpixel screen mesh lines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }

      // 6. Technical HUD Diagnostic Overlay
      ctx.save();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText(`LOC: [${Math.round(mx)}, ${Math.round(my)}]`, 20, 28);
      ctx.fillText(`MODE: ${activeMode.toUpperCase()}`, 20, 44);
      ctx.fillText(`FPS: 60`, w - 75, 28);

      // Interactive crosshair cursor tracking
      if (isHovering) {
        ctx.strokeStyle = 'rgba(204, 255, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mx - 8, my);
        ctx.lineTo(mx + 8, my);
        ctx.moveTo(mx, my - 8);
        ctx.lineTo(mx, my + 8);
        ctx.stroke();
      }
      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [activeMode, mousePos, isHovering]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-obsidian-950 border border-obsidian-border rounded-xs overflow-hidden shadow-2xl group select-none max-w-full"
    >
      <canvas
        ref={canvasRef}
        width={720}
        height={480}
        className="w-full h-full object-cover block"
      />

      {/* Mode Switcher Interactive Badges */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-obsidian-950/85 border border-obsidian-border p-1 backdrop-blur-md rounded-xs">
        {(['transform', 'ascii', 'dots', 'pixel', 'dither'] as HeroMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-xs transition-colors border ${
              activeMode === mode
                ? 'border-acid-lime text-acid-lime bg-acid-lime/10 font-bold'
                : 'border-transparent text-obsidian-muted hover:text-white'
            }`}
          >
            {mode === 'transform' ? 'WAVE' : mode}
          </button>
        ))}
      </div>

      {/* Floating Status Diagnostics Pill */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-obsidian-950/85 border border-obsidian-border px-3 py-1 backdrop-blur-md rounded-xs font-mono text-2xs text-obsidian-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-pulse" />
        <span className="text-white font-medium">LIVE RASTER CORE</span>
        <span className="text-obsidian-border">/</span>
        <span>HTML CANVAS 2D</span>
      </div>
    </div>
  );
};
