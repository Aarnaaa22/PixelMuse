import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Activity } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { SiteFooter } from '../components/common';
import { useMotionStore, useStudioStore } from '../stores';
import { AnimationMotionConfig } from '../types';

interface OscilloscopeCanvasProps {
  type: string;
  speed: number;
  frequency: number;
  intensity: number;
}

const OscilloscopeCanvas: React.FC<OscilloscopeCanvasProps> = ({
  type,
  speed,
  frequency,
  intensity,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const time = ((now - startTime) / 1000) * speed;
      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      // Dark background with technical grid
      ctx.fillStyle = '#08080A';
      ctx.fillRect(0, 0, w, h);

      // Center reference axis
      ctx.strokeStyle = '#1F1F28';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();

      // Waveform trace
      ctx.beginPath();
      ctx.strokeStyle = type === 'scanline' ? '#CCFF00' : type === 'glitch' ? '#FF473A' : '#9D4EDD';
      ctx.lineWidth = 2;

      const points = 100;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        let y = cy;

        if (type === 'sine-wave') {
          y = cy + Math.sin(x * 0.05 * frequency + time * 3) * (h * 0.35 * intensity);
        } else if (type === 'scanline') {
          const scan = (time * 80 + x * 0.2) % h;
          y = cy + (Math.sin(x * 0.08) * 4) + (Math.abs(y - scan) < 15 ? (15 - Math.abs(y - scan)) * intensity * 2 : 0);
        } else if (type === 'glitch') {
          const jump = Math.sin(Math.floor(x / 20) + Math.floor(time * 6)) > 0.8 ? (Math.random() - 0.5) * h * 0.5 * intensity : 0;
          y = cy + Math.sin(x * 0.03 + time) * 8 + jump;
        } else {
          y = cy + Math.sin(x * 0.04 + time * 2) * (h * 0.25 * intensity);
        }

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [type, speed, frequency, intensity]);

  return (
    <div className="w-full h-28 bg-obsidian-950 border border-obsidian-border overflow-hidden rounded-xs relative">
      <canvas ref={canvasRef} width={400} height={112} className="w-full h-full block" />
      <div className="absolute top-2 right-2 font-mono text-[9px] uppercase text-obsidian-muted bg-obsidian-950/80 px-1.5 py-0.5 border border-obsidian-border">
        OSCILLOGRAM // 60FPS
      </div>
    </div>
  );
};

export const MotionPage: React.FC = () => {
  const navigate = useNavigate();
  const { presets } = useMotionStore();
  const updateMotionConfig = useStudioStore((s) => s.updateMotionConfig);

  const handleApplyMotion = (motionConfig: Partial<AnimationMotionConfig>) => {
    updateMotionConfig({
      ...motionConfig,
      isPlaying: true,
    });
    navigate('/studio');
  };

  return (
    <div className="flex-1 flex flex-col bg-obsidian select-none">
      <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-obsidian-border">
        <div className="space-y-2">
          <Badge variant="lime" dot>
            Kinetic Laboratory
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            Kinetic Wave Dynamics
          </h1>
          <p className="font-mono text-xs text-obsidian-text max-w-xl">
            Drive continuous trigonometric displacements, cathode scanlines, and digital glitch
            slices through your generative art at 60 FPS.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Play className="w-3.5 h-3.5 text-black" />}
          onClick={() => {
            updateMotionConfig({ isPlaying: true, type: 'scanline' });
            navigate('/studio');
          }}
        >
          Open Live Studio
        </Button>
      </div>

      {/* Motion Oscillators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="border border-obsidian-border bg-obsidian-surface p-6 flex flex-col justify-between group hover:border-electric-violet transition-colors rounded-xs"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-electric-violet" />
                  <span>OSCILLATOR: {preset.config.type.toUpperCase()}</span>
                </span>
                <Badge variant="outline" size="xs">
                  {preset.config.speed}X VELOCITY
                </Badge>
              </div>

              <h2 className="font-display text-xl font-bold uppercase text-white group-hover:text-electric-violet-light transition-colors">
                {preset.name}
              </h2>

              <p className="font-mono text-xs text-obsidian-text leading-relaxed">
                {preset.description}
              </p>

              {/* Live Oscilloscope Trace */}
              <OscilloscopeCanvas
                type={preset.config.type}
                speed={preset.config.speed}
                frequency={preset.config.frequency}
                intensity={preset.config.intensity}
              />

              {/* Technical Mathematical Specifications */}
              <div className="border border-obsidian-border bg-obsidian-950 p-3 font-mono text-2xs space-y-1.5">
                <div className="flex justify-between text-obsidian-muted">
                  <span>BASE FREQUENCY:</span>
                  <span className="text-white font-semibold">{preset.config.frequency} Hz</span>
                </div>
                <div className="flex justify-between text-obsidian-muted">
                  <span>VELOCITY MULTIPLIER:</span>
                  <span className="text-acid-lime font-semibold">{preset.config.speed}x</span>
                </div>
                <div className="flex justify-between text-obsidian-muted">
                  <span>AMPLITUDE INTENSITY:</span>
                  <span className="text-signal-coral font-semibold">
                    {Math.round(preset.config.intensity * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-obsidian-border flex items-center justify-between">
              <span className="font-mono text-2xs text-obsidian-muted">
                CONTINUOUS RAF SYNCHRONIZED
              </span>
              <Button
                variant="secondary"
                size="xs"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
                onClick={() => handleApplyMotion(preset.config)}
              >
                Apply To Studio
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <SiteFooter />
  </div>
  );
};
