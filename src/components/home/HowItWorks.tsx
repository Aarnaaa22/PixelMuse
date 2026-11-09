import React from 'react';
import { Upload, Sliders, Palette, Download } from 'lucide-react';
import { Badge } from '../ui';

interface StepItem {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
}

const STEPS: StepItem[] = [
  {
    step: '01',
    title: 'UPLOAD YOUR IMAGE',
    subtitle: 'Photographic Ingest & Luminance Matrix',
    description:
      'Drop any high dynamic range portrait, landscape, or architectural photograph. PixelMuse automatically computes the 2D Rec.709 luminance topology and calibrates gamma curves.',
    icon: <Upload className="w-5 h-5 text-acid-lime" />,
    specs: ['PNG, JPEG, WebP', 'Automatic Aspect Preservation', 'Offscreen Buffer Downsampling'],
  },
  {
    step: '02',
    title: 'EXPERIMENT WITH VISUAL STYLES',
    subtitle: 'Modular Generative Engines',
    description:
      'Switch instantaneously between four independent raster pipelines: Luminance-mapped ASCII text, 1-bit Bayer/Atkinson dithering, geometric diamond/hex mosaic tiling, or rotary halftone print screening.',
    icon: <Sliders className="w-5 h-5 text-electric-violet-light" />,
    specs: ['Sub-16ms Mode Switching', 'Zero React UI Rerenders', 'Direct HTML Canvas 2D Blit'],
  },
  {
    step: '03',
    title: 'CUSTOMIZE COLORS & EFFECTS',
    subtitle: 'Curated Palettes & Motion Waves',
    description:
      'Remap monochrome pixels into obsidian, acid lime, and signal coral color spaces. Trigger 60FPS harmonic sine wave perturbation, CRT cathode scanline sweep, and digital glitch slices.',
    icon: <Palette className="w-5 h-5 text-signal-coral" />,
    specs: ['Nearest-Neighbor Quantization', 'Parametric Sine & Glitch', 'Phosphor Glow Diffusion'],
  },
  {
    step: '04',
    title: 'EXPORT YOUR CREATION',
    subtitle: 'Master Resolution Delivery',
    description:
      'Render high-resolution raster masters with up to 4x supersampling, generate pure UTF-8 ASCII files for terminal and code display, or export resolution-independent vector SVGs.',
    icon: <Download className="w-5 h-5 text-white" />,
    specs: ['4K Supersampled PNG', 'Raw ASCII Monospace Text', 'Vector SVG Output'],
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-obsidian-border">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-obsidian-border">
        <div className="space-y-3">
          <Badge variant="lime" dot>
            Studio Workflow
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-none">
            From Sensor To Generative Matrix
          </h2>
          <p className="font-mono text-xs sm:text-sm text-obsidian-text max-w-xl">
            A linear, high-precision transformation pipeline engineered for maximum creative control
            and instant visual feedback.
          </p>
        </div>

        <div className="font-mono text-2xs text-obsidian-muted uppercase tracking-widest text-right">
          <div>PIPELINE ARCHITECTURE</div>
          <div className="text-electric-violet-light">HIGH PERFORMANCE CANVAS 2D</div>
        </div>
      </div>

      {/* Asymmetric Technical Blueprint Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {STEPS.map((item) => (
          <div
            key={item.step}
            className="border border-obsidian-border bg-obsidian-surface p-6 flex flex-col justify-between group hover:border-obsidian-border-hover transition-colors relative"
          >
            <div>
              {/* Header Step Number & Icon */}
              <div className="flex items-center justify-between pb-4 border-b border-obsidian-border mb-6">
                <span className="font-display text-3xl font-extrabold text-obsidian-border group-hover:text-acid-lime transition-colors">
                  {item.step}
                </span>
                <div className="w-9 h-9 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center">
                  {item.icon}
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-mono text-sm font-semibold uppercase text-white tracking-wider mb-1">
                {item.title}
              </h3>
              <p className="font-mono text-2xs text-obsidian-muted uppercase tracking-wider mb-4">
                {item.subtitle}
              </p>

              {/* Description */}
              <p className="font-mono text-xs text-obsidian-text leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Technical Specs List */}
            <div className="mt-8 pt-4 border-t border-obsidian-border space-y-1.5">
              {item.specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 font-mono text-2xs text-obsidian-muted"
                >
                  <span className="w-1 h-1 bg-acid-lime/70" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
