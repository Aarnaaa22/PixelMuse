import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button, Badge } from '../ui';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative px-6 py-28 md:py-36 max-w-7xl mx-auto w-full overflow-hidden studio-grid">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-electric-violet/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[200px] bg-acid-lime/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
        <Badge variant="lime" dot>
          Begin The Transformation
        </Badge>

        {/* Monumental Headline */}
        <h2 className="font-display text-4xl sm:text-6xl md:text-8xl font-black uppercase text-white tracking-tight leading-[0.9]">
          YOUR IMAGE.{' '}
          <span className="text-acid-lime font-serif italic lowercase font-normal block sm:inline">
            your rules.
          </span>
        </h2>

        <p className="font-mono text-sm sm:text-base text-obsidian-text max-w-xl leading-relaxed">
          Step inside the PixelMuse studio. Upload a raw photograph, tune typographic glyphs,
          error thresholds and color palettes, and craft masterwork generative art.
        </p>

        {/* Primary CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <Link to="/studio">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowUpRight className="w-5 h-5 text-black" />}
              iconPosition="right"
              className="text-sm px-8 h-12"
            >
              Start Creating
            </Button>
          </Link>

          <Link to="/explore">
            <Button variant="outline" size="lg" className="text-sm px-8 h-12">
              Browse Art Presets
            </Button>
          </Link>
        </div>

        {/* Technical Sub-line */}
        <div className="pt-8 flex items-center gap-6 font-mono text-2xs text-obsidian-muted">
          <span>ZERO REGISTRATION REQUIRED</span>
          <span className="text-obsidian-border">•</span>
          <span>100% CLIENT-SIDE CANVAS 2D</span>
          <span className="text-obsidian-border">•</span>
          <span>PRIVACY PRESERVED</span>
        </div>

        {/* Studio Credits */}
        <div className="pt-6 border-t border-obsidian-border/50 w-full flex items-center justify-center gap-2.5">
          <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
            STUDIO CREDITS:
          </span>
          <span className="font-mono text-sm sm:text-base font-black tracking-wider text-[#FF1493] drop-shadow-[0_0_14px_rgba(255,20,147,0.9)]">
            ★ Aarna Chopdekar
          </span>
        </div>
      </div>
    </section>
  );
};
