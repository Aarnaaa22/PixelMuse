import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Terminal, Grid3X3, Waves } from 'lucide-react';
import { Button, Badge } from '../ui';

export const CreativePossibilities: React.FC = () => {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-obsidian-border space-y-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-obsidian-border">
        <div className="space-y-3">
          <Badge variant="coral" dot>
            Creative Possibilities
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-none">
            An Instrument For Digital Expression
          </h2>
          <p className="font-mono text-xs sm:text-sm text-obsidian-text max-w-xl">
            Each raster tool is an independent mathematical system, designed to reveal the
            computational beauty latent within ordinary photographs.
          </p>
        </div>

        <div className="font-mono text-2xs text-obsidian-muted uppercase tracking-widest text-right">
          <div>TOOL SUITE v1.0</div>
          <div className="text-acid-lime">MODULAR & EXTENSIBLE</div>
        </div>
      </div>

      {/* Feature 01: ASCII Typography Engine (Asymmetrical Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-acid-lime" />
            <span className="font-mono text-2xs uppercase tracking-widest text-acid-lime">
              01 // LINGUISTIC RASTERIZATION
            </span>
          </div>

          <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white leading-tight">
            The ASCII Matrix: Typography As Pixels
          </h3>

          <p className="font-mono text-xs sm:text-sm text-obsidian-text leading-relaxed">
            Deconstruct light into language. Replace raw RGB pixels with ordered ramps of
            typographic characters mapped to exact optical density. From subtle dot stippling to
            dense Cyrillic and Katakana matrices, typography becomes the brush.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-obsidian-border font-mono text-2xs">
            <div>
              <div className="text-obsidian-muted uppercase">GLYPH RAMPS</div>
              <div className="text-white mt-1">Standard / Matrix / Dense Blocks</div>
            </div>
            <div>
              <div className="text-obsidian-muted uppercase">LIGHTING EFFECT</div>
              <div className="text-acid-lime mt-1">Dynamic Phosphor Glow</div>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/studio">
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Launch ASCII Engine
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual Showcase Block */}
        <div className="lg:col-span-7 border border-obsidian-border bg-obsidian-surface p-8 relative overflow-hidden">
          <div className="font-mono text-xs text-acid-lime/80 leading-tight select-none overflow-hidden space-y-1 opacity-90">
            <div className="tracking-[0.25em] text-electric-violet-light font-bold">
              ░░▒▒▓▓██ PIXELMUSE LINGUISTIC MATRIX ██▓▓▒▒░░
            </div>
            <div className="text-2xs text-obsidian-muted">
              $$$$$@@@@%%%%####****++++====----::::....    
            </div>
            <div className="tracking-widest text-acid-lime">
              :::...---+===***###%%%@@@$$$$$
            </div>
            <div className="text-white/60">
              ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ 010101
            </div>
            <div className="text-signal-coral/80">
              [LUMINANCE THRESHOLD: REC.709 DENSITY MAPPING PASS]
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-obsidian-border flex items-center justify-between font-mono text-2xs text-obsidian-muted">
            <span>FONT: JETBRAINS MONO 12PX</span>
            <span className="text-acid-lime">60 FPS VECTOR RASTER</span>
          </div>
        </div>
      </div>

      {/* Feature 02: 1-Bit Dither Heritage (Inverted Asymmetrical Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Showcase Block on Left */}
        <div className="lg:col-span-7 order-2 lg:order-1 border border-obsidian-border bg-obsidian-surface p-8 relative overflow-hidden">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-obsidian-border p-4 bg-obsidian-950 font-mono text-2xs space-y-3">
              <div className="flex justify-between border-b border-obsidian-border pb-1 text-obsidian-muted">
                <span>BAYER 4×4</span>
                <span className="text-white">CROSS-HATCH</span>
              </div>
              <div className="text-acid-lime text-xs tracking-widest font-mono">
                ░▒▓█░▒▓█░▒▓█<br />
                █▓▒░█▓▒░█▓▒░<br />
                ░▒▓█░▒▓█░▒▓█
              </div>
              <p className="text-obsidian-muted text-2xs leading-relaxed">
                Structured mechanical grid for industrial and brutalist aesthetic.
              </p>
            </div>

            <div className="border border-obsidian-border p-4 bg-obsidian-950 font-mono text-2xs space-y-3">
              <div className="flex justify-between border-b border-obsidian-border pb-1 text-obsidian-muted">
                <span>ATKINSON / FLOYD</span>
                <span className="text-electric-violet-light">DIFFUSION</span>
              </div>
              <div className="text-electric-violet-light text-xs tracking-widest font-mono">
                :·.·:·.·:·.·<br />
                ·:·.·:·.·:·.<br />
                .·:·.·:·.·:·
              </div>
              <p className="text-obsidian-muted text-2xs leading-relaxed">
                Classic 1984 Macintosh error distribution preserving 75% error for crisp edges.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-obsidian-border flex items-center justify-between font-mono text-2xs text-obsidian-muted">
            <span>BIT DEPTH: 1-BIT OR 4-TONE DISCRETE</span>
            <span className="text-white">HARDWARE ACCELERATED</span>
          </div>
        </div>

        {/* Text on Right */}
        <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-electric-violet-light" />
            <span className="font-mono text-2xs uppercase tracking-widest text-electric-violet-light">
              02 // ORDERED DITHERING
            </span>
          </div>

          <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white leading-tight">
            1-Bit Dither: The Heritage Of Early Computing
          </h3>

          <p className="font-mono text-xs sm:text-sm text-obsidian-text leading-relaxed">
            Dithering was invented to create the illusion of smooth continuous tones with a strictly
            limited color palette. PixelMuse gives you direct mathematical control over Bayer 4×4 and
            8×8 threshold matrices, serpentine error diffusion, and custom palette quantization.
          </p>

          <div className="pt-2">
            <Link to="/studio">
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Launch Dither Engine
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature 03: Kinetic Oscillators & Wave Motion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-signal-coral" />
            <span className="font-mono text-2xs uppercase tracking-widest text-signal-coral">
              03 // MOTION ECOSYSTEM
            </span>
          </div>

          <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white leading-tight">
            Kinetic Dynamics: Art In Constant Flux
          </h3>

          <p className="font-mono text-xs sm:text-sm text-obsidian-text leading-relaxed">
            Static imagery is merely the starting point. Drive continuous mathematical waves
            through your artwork at 60 FPS: horizontal cathode scanlines, harmonic sine wave
            row displacements, high-voltage glitch ruptures, and pulsating luminescence.
          </p>

          <div className="pt-2">
            <Link to="/motion">
              <Button
                variant="coral"
                size="sm"
                icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Explore Motion Oscillators
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual Showcase Block */}
        <div className="lg:col-span-7 border border-obsidian-border bg-obsidian-surface p-8 relative overflow-hidden">
          <div className="space-y-4 font-mono text-2xs">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-2 text-obsidian-muted">
              <span>OSCILLATOR FREQUENCY ENGINE</span>
              <span className="text-signal-coral">REAL-TIME TIER</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-obsidian-border p-3 bg-obsidian-950 space-y-1">
                <span className="text-white block font-semibold">SINE WAVE</span>
                <span className="text-obsidian-muted block">Fluid harmonic row shift</span>
                <span className="text-acid-lime block">f = 2.5 Hz</span>
              </div>
              <div className="border border-obsidian-border p-3 bg-obsidian-950 space-y-1">
                <span className="text-white block font-semibold">SCANLINE</span>
                <span className="text-obsidian-muted block">Cathode ray vertical sweep</span>
                <span className="text-electric-violet-light block">f = 60 Hz</span>
              </div>
              <div className="border border-obsidian-border p-3 bg-obsidian-950 space-y-1">
                <span className="text-white block font-semibold">GLITCH</span>
                <span className="text-obsidian-muted block">High-tension random jumps</span>
                <span className="text-signal-coral block">f = 12 Hz</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-obsidian-border flex items-center justify-between font-mono text-2xs text-obsidian-muted">
            <span>DELTA-TIME SYNCHRONIZED</span>
            <span className="text-white">RAF CLOCK LOOP</span>
          </div>
        </div>
      </div>
    </section>
  );
};
