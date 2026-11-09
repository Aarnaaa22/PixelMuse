import React, { useEffect, useRef, useState } from 'react';
import { BAYER_8X8 } from '../../utilities';

type HeroMode = 'composite' | 'ascii' | 'dither' | 'geometry';

export const HeroArtworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMode, setActiveMode] = useState<HeroMode>('composite');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

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

      // Clear with obsidian background
      ctx.fillStyle = '#08080A';
      ctx.fillRect(0, 0, w, h);

      const mx = mousePos.x * w;
      const my = mousePos.y * h;

      // Base: Multi-tier atmospheric glow
      const ambientGlow = ctx.createRadialGradient(
        mx * 0.4 + w * 0.3,
        my * 0.4 + h * 0.3,
        20,
        w * 0.5,
        h * 0.5,
        w * 0.7
      );
      ambientGlow.addColorStop(0, 'rgba(157, 78, 221, 0.4)');
      ambientGlow.addColorStop(0.45, 'rgba(204, 255, 0, 0.15)');
      ambientGlow.addColorStop(0.75, 'rgba(255, 71, 58, 0.1)');
      ambientGlow.addColorStop(1, 'rgba(8, 8, 10, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, w, h);

      // Layer 1: Distorted Monumental Typographic Matrix ("PIXELMUSE")
      ctx.save();
      ctx.font = '900 120px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Ghost typographic displacement
      const shiftX = Math.sin(time * 1.5) * 8;
      const shiftY = Math.cos(time * 1.2) * 5;

      ctx.fillStyle = 'rgba(255, 71, 58, 0.25)';
      ctx.fillText('PIXELMUSE', w / 2 - 4 + shiftX, h / 2 + shiftY);

      ctx.fillStyle = 'rgba(204, 255, 0, 0.35)';
      ctx.fillText('PIXELMUSE', w / 2 + 4 - shiftX, h / 2 - shiftY);

      ctx.fillStyle = '#EDEDF2';
      ctx.fillText('PIXELMUSE', w / 2, h / 2);
      ctx.restore();

      // Layer 2: Geometric Monolith Forms (Asymmetrical Sculptural Diamond & Rings)
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.15 + (mousePos.x - 0.5) * 0.5);

      // Neon Acid Lime razor ring
      ctx.strokeStyle = '#CCFF00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 160 + Math.sin(time * 3) * 6, 0, Math.PI * 1.4);
      ctx.stroke();

      // Signal Coral counter-ring
      ctx.strokeStyle = '#FF473A';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 190, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();

      // Electric Violet inner polygon
      ctx.fillStyle = 'rgba(157, 78, 221, 0.18)';
      ctx.strokeStyle = '#9D4EDD';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(-70, -70, 140, 140);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Layer 3: Dynamic ASCII Glyph Overlay (Scanning Matrix)
      if (activeMode === 'composite' || activeMode === 'ascii') {
        const glyphs = ' .:+=*#%@░▒▓█';
        const fontSize = 11;
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

        const cols = Math.floor(w / fontSize);
        const rows = Math.floor(h / (fontSize * 1.2));

        for (let r = 0; r < rows; r += 2) {
          const y = r * fontSize * 1.2;
          const distY = Math.abs(y - cy) / (h * 0.5);

          for (let c = 0; c < cols; c += 2) {
            const x = c * fontSize;
            const distX = Math.abs(x - cx) / (w * 0.5);
            const dist = Math.sqrt(distX * distX + distY * distY);

            // Selective ASCII density band
            if (dist > 0.35 && dist < 0.95) {
              const wave = Math.sin(x * 0.03 + y * 0.03 + time * 3);
              if (wave > 0.1) {
                const charIdx = Math.floor(((wave + 1) / 2) * glyphs.length) % glyphs.length;
                const char = glyphs[charIdx];

                if (dist < 0.6) {
                  ctx.fillStyle = 'rgba(204, 255, 0, 0.7)';
                } else if (dist < 0.8) {
                  ctx.fillStyle = 'rgba(157, 78, 221, 0.8)';
                } else {
                  ctx.fillStyle = 'rgba(255, 71, 58, 0.6)';
                }

                ctx.fillText(char, x, y);
              }
            }
          }
        }
      }

      // Layer 4: 8x8 Bayer Dithering Diagonal Shard
      if (activeMode === 'composite' || activeMode === 'dither') {
        const shardW = Math.floor(w * 0.38);
        const shardH = Math.floor(h * 0.42);
        const shardX = Math.floor(w * 0.58);
        const shardY = Math.floor(h * 0.5);

        const ditherCanvas = document.createElement('canvas');
        ditherCanvas.width = shardW;
        ditherCanvas.height = shardH;
        const dctx = ditherCanvas.getContext('2d');

        if (dctx) {
          const imgData = dctx.createImageData(shardW, shardH);
          const data = imgData.data;
          const matrix = BAYER_8X8;

          for (let dy = 0; dy < shardH; dy++) {
            const my = Math.floor(dy / 2) % 8;
            for (let dx = 0; dx < shardW; dx++) {
              const mx = Math.floor(dx / 2) % 8;
              const threshold = matrix[my][mx];

              const lum = (dx / shardW) * 0.7 + (dy / shardH) * 0.3;
              const isDot = lum > threshold;

              const idx = (dy * shardW + dx) * 4;
              if (isDot) {
                data[idx] = 204;     // Acid lime dither dots
                data[idx + 1] = 255;
                data[idx + 2] = 0;
                data[idx + 3] = 180;
              }
            }
          }
          dctx.putImageData(imgData, 0, 0);
          ctx.drawImage(ditherCanvas, shardX, shardY);
        }
      }

      // Layer 5: Cathode Ray Tube Scanline Drift
      const scanY = (time * 120) % h;
      ctx.fillStyle = 'rgba(204, 255, 0, 0.08)';
      ctx.fillRect(0, scanY, w, 2);

      // Fine subpixel screen mesh lines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }

      // Precision technical HUD overlay marks
      ctx.save();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText(`LOC: [${Math.round(mx)}, ${Math.round(my)}]`, 20, 30);
      ctx.fillText(`MOD: ${activeMode.toUpperCase()}`, 20, 46);
      ctx.fillText(`FPS: 60.0`, w - 80, 30);

      // Crosshairs
      ctx.strokeStyle = 'rgba(204, 255, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mx - 8, my);
      ctx.lineTo(mx + 8, my);
      ctx.moveTo(mx, my - 8);
      ctx.lineTo(mx, my + 8);
      ctx.stroke();

      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [activeMode, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-obsidian-950 border border-obsidian-border overflow-hidden shadow-2xl group select-none"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full h-full object-cover block"
      />

      {/* Mode Switcher Interactive Badges */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-obsidian-950/80 border border-obsidian-border p-1 backdrop-blur-md rounded-xs">
        {(['composite', 'ascii', 'dither', 'geometry'] as HeroMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`font-mono text-2xs uppercase px-2 py-1 rounded-xs transition-colors border ${
              activeMode === mode
                ? 'border-acid-lime text-acid-lime bg-acid-lime/10'
                : 'border-transparent text-obsidian-muted hover:text-white'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Floating Art Diagnostic Pill */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-obsidian-950/80 border border-obsidian-border px-3 py-1.5 backdrop-blur-md rounded-xs font-mono text-2xs text-obsidian-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-pulse" />
        <span className="text-white">LIVE RASTER CORE</span>
        <span className="text-obsidian-border">/</span>
        <span>INTERACTIVE CANVAS 2D</span>
      </div>
    </div>
  );
};
