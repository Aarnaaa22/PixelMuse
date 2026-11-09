import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { HeroArtworkCanvas } from '../components/home/HeroArtworkCanvas';
import { ExhibitionGallery } from '../components/home/ExhibitionGallery';
import { HowItWorks } from '../components/home/HowItWorks';
import { CreativePossibilities } from '../components/home/CreativePossibilities';
import { FinalCTA } from '../components/home/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-obsidian text-obsidian-heading selection:bg-electric-violet selection:text-white">
      {/* SECTION 1: DRAMATIC FULL-SCREEN HERO */}
      <section className="relative px-6 pt-12 pb-20 md:pt-16 md:pb-28 max-w-7xl mx-auto w-full border-b border-obsidian-border studio-grain">
        {/* Subtle Ambient Background Lighting */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-electric-violet/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[400px] h-[300px] bg-acid-lime/5 blur-[120px] pointer-events-none" />

        {/* Top Meta Line: Wordmark & Architecture Status */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-obsidian-border">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm tracking-[0.3em] font-extrabold uppercase text-white">
              PIXELMUSE
            </span>
            <span className="text-obsidian-border">/</span>
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Digital Art Studio & Generative Laboratory
            </span>
          </div>

          <Badge variant="lime" dot>
            Engine v1.0 Online
          </Badge>
        </div>

        {/* Hero Grid: Asymmetrical Headline & Supporting Copy on Left, Living Artwork Centerpiece on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Monumental Editorial Typography */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="font-mono text-2xs uppercase tracking-widest text-acid-lime block">
                [ EXPERIMENTAL RASTER STUDIO ]
              </span>

              {/* Exact Requested Headline */}
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-[0.92]">
                MAKE THE <br />
                <span className="text-acid-lime font-serif italic lowercase font-normal">
                  ordinary
                </span>{' '}
                LOOK <br />
                EXTRAORDINARY.
              </h1>
            </div>

            {/* Supporting Description */}
            <p className="font-mono text-sm sm:text-base text-obsidian-text max-w-xl leading-relaxed">
              PixelMuse deconstructs photographs into expressive generative digital art.
              Harness luminance-mapped ASCII characters, 1-bit Bayer dithering, chromatic
              geometric mosaics, and 60 FPS kinetic oscillators.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/studio">
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowUpRight className="w-4 h-4 text-black" />}
                  iconPosition="right"
                  className="px-6 h-11"
                >
                  Enter the Studio
                </Button>
              </Link>

              <Link to="/explore">
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Compass className="w-4 h-4 text-electric-violet-light" />}
                  className="px-6 h-11"
                >
                  Explore Artworks
                </Button>
              </Link>
            </div>

            {/* Technical Specifications Strip */}
            <div className="pt-8 border-t border-obsidian-border grid grid-cols-3 gap-4 font-mono text-2xs text-obsidian-muted">
              <div>
                <span className="text-white block font-semibold">04 RASTER CORES</span>
                <span className="block mt-0.5 text-obsidian-text">ASCII / Dither / Tile / Print</span>
              </div>
              <div>
                <span className="text-acid-lime block font-semibold">&lt; 16MS LATENCY</span>
                <span className="block mt-0.5 text-obsidian-text">Direct HTML Canvas 2D</span>
              </div>
              <div>
                <span className="text-electric-violet-light block font-semibold">4K SUPERSAMPLING</span>
                <span className="block mt-0.5 text-obsidian-text">Lossless Master Export</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Centerpiece — Striking Animated Generative Artwork Composition */}
          <div className="lg:col-span-6 relative">
            <HeroArtworkCanvas />
          </div>
        </div>
      </section>

      {/* SECTION 2: IMMERSIVE ARTWORK SHOWCASE */}
      <ExhibitionGallery />

      {/* SECTION 3: HOW IT WORKS */}
      <HowItWorks />

      {/* SECTION 4: CREATIVE POSSIBILITIES */}
      <CreativePossibilities />

      {/* SECTION 5: FINAL CTA */}
      <FinalCTA />

      {/* SITE FOOTER & ARTIST CREDITS */}
      <footer className="border-t border-obsidian-border bg-obsidian-950 px-6 py-12 w-full mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-display text-xs tracking-[0.25em] font-extrabold uppercase text-white">
              PIXELMUSE
            </span>
            <span className="hidden sm:inline text-obsidian-border">/</span>
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Experimental Digital Art Studio & Generative Laboratory
            </span>
          </div>

          <div className="flex items-center gap-3 bg-obsidian-900/90 border border-obsidian-border px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(255,20,147,0.2)]">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              CREDITS:
            </span>
            <span className="font-mono text-sm sm:text-base font-black tracking-wider text-[#FF1493] drop-shadow-[0_0_14px_rgba(255,20,147,0.95)]">
              ★ Aarna Chopdekar
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
