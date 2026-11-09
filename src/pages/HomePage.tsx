import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Terminal, Layers, PlayCircle } from 'lucide-react';
import { Button, Badge } from '../components/ui';

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-obsidian text-obsidian-heading">
      {/* Editorial Hero Section */}
      <section className="relative px-6 py-20 md:py-28 max-w-7xl mx-auto w-full border-b border-obsidian-border studio-grain">
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="lime" dot>
            Engine v1.0 Active
          </Badge>
          <span className="font-mono text-2xs text-obsidian-muted uppercase tracking-widest">
            Canvas 2D / Parametric Raster Studio
          </span>
        </div>

        <div className="max-w-4xl space-y-6">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] text-white">
            Transform raw photography into{' '}
            <span className="text-acid-lime italic font-serif lowercase font-normal">
              generative
            </span>{' '}
            matrix art.
          </h1>

          <p className="font-mono text-sm sm:text-base text-obsidian-text max-w-2xl leading-relaxed">
            PixelMuse deconstructs images into luminance-weighted ASCII typography,
            ordered Bayer dithering, chromatic mosaic tessellations, and rotary print halftones.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link to="/studio">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowUpRight className="w-4 h-4 text-black" />}
                iconPosition="right"
              >
                Launch Studio
              </Button>
            </Link>

            <Link to="/explore">
              <Button variant="secondary" size="md">
                Browse Curated Presets
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient Corner Technical Data Block */}
        <div className="hidden lg:block absolute right-6 top-24 border border-obsidian-border p-4 bg-obsidian-surface/60 max-w-xs font-mono text-2xs text-obsidian-muted space-y-2">
          <div className="flex justify-between border-b border-obsidian-border pb-1">
            <span className="text-white">SPEC:</span>
            <span>PIXELMUSE_CORE</span>
          </div>
          <div className="flex justify-between">
            <span>RASTER MODES:</span>
            <span className="text-acid-lime">04 ENGINES</span>
          </div>
          <div className="flex justify-between">
            <span>LATENCY:</span>
            <span className="text-electric-violet-light">&lt; 16ms / 60FPS</span>
          </div>
          <div className="flex justify-between">
            <span>OUTPUT:</span>
            <span>RAW / SVG / PNG</span>
          </div>
        </div>
      </section>

      {/* Featured Architecture Showcase Grid */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-obsidian-border">
          <h2 className="font-mono text-xs uppercase tracking-widest text-obsidian-muted">
            Core Rendering Pipelines
          </h2>
          <span className="font-mono text-2xs text-acid-lime">MODULAR ARCHITECTURE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: ASCII */}
          <div className="border border-obsidian-border bg-obsidian-surface p-6 flex flex-col justify-between group hover:border-acid-lime transition-colors">
            <div className="space-y-3">
              <div className="w-8 h-8 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-acid-lime">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-sm font-semibold uppercase text-white group-hover:text-acid-lime transition-colors">
                ASCII Raster
              </h3>
              <p className="font-mono text-2xs text-obsidian-text leading-relaxed">
                Dynamic glyph density mapping with customizable character ramps and bloom glow.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-obsidian-border flex items-center justify-between text-2xs font-mono text-obsidian-muted">
              <span>01 / GLYPH</span>
              <span className="text-acid-lime">READY</span>
            </div>
          </div>

          {/* Card 2: Dither */}
          <div className="border border-obsidian-border bg-obsidian-surface p-6 flex flex-col justify-between group hover:border-electric-violet transition-colors">
            <div className="space-y-3">
              <div className="w-8 h-8 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-electric-violet-light">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-sm font-semibold uppercase text-white group-hover:text-electric-violet-light transition-colors">
                Ordered Dither
              </h3>
              <p className="font-mono text-2xs text-obsidian-text leading-relaxed">
                Bayer 4x4 & 8x8 matrices, retro 1-bit quantization and serpentine error diffusion.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-obsidian-border flex items-center justify-between text-2xs font-mono text-obsidian-muted">
              <span>02 / BIT</span>
              <span className="text-electric-violet-light">READY</span>
            </div>
          </div>

          {/* Card 3: Pixel Mosaic */}
          <div className="border border-obsidian-border bg-obsidian-surface p-6 flex flex-col justify-between group hover:border-signal-coral transition-colors">
            <div className="space-y-3">
              <div className="w-8 h-8 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-signal-coral">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-sm font-semibold uppercase text-white group-hover:text-signal-coral transition-colors">
                Pixel Mosaic
              </h3>
              <p className="font-mono text-2xs text-obsidian-text leading-relaxed">
                Parametric geometric tessellations: square, diamond, circle with gap modulation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-obsidian-border flex items-center justify-between text-2xs font-mono text-obsidian-muted">
              <span>03 / TILE</span>
              <span className="text-signal-coral">READY</span>
            </div>
          </div>

          {/* Card 4: Motion */}
          <div className="border border-obsidian-border bg-obsidian-surface p-6 flex flex-col justify-between group hover:border-white transition-colors">
            <div className="space-y-3">
              <div className="w-8 h-8 bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-white">
                <PlayCircle className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-sm font-semibold uppercase text-white group-hover:text-white transition-colors">
                Motion Ecosystem
              </h3>
              <p className="font-mono text-2xs text-obsidian-text leading-relaxed">
                60FPS parametric sine waves, cathode ray scanline pulses, and glitch displacements.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-obsidian-border flex items-center justify-between text-2xs font-mono text-obsidian-muted">
              <span>04 / LIVE</span>
              <span className="text-white">READY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Manifesto Quote */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full border-t border-obsidian-border">
        <div className="border-l-2 border-acid-lime pl-6 max-w-3xl">
          <blockquote className="font-serif italic text-2xl sm:text-3xl text-obsidian-heading leading-snug">
            “The digital canvas should not imitate analog photographs—it should celebrate the
            transistor, the pixel, and the discrete character of calculation.”
          </blockquote>
          <p className="font-mono text-xs uppercase tracking-widest text-obsidian-muted mt-4">
            — PixelMuse Technical Architecture Manifesto
          </p>
        </div>
      </section>
    </div>
  );
};
