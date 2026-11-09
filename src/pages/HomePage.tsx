import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { SiteFooter } from '../components/common';
import { HeroArtworkCanvas } from '../components/home/HeroArtworkCanvas';
import { ExploreGallery } from '../components/home/ExploreGallery';
import { WorkflowSection } from '../components/home/WorkflowSection';
import { FinalCTA } from '../components/home/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-obsidian text-obsidian-heading selection:bg-electric-violet selection:text-white">
      {/* =========================================================================
          SECTION 1 — HERO
          Responsive Two-Column Layout: Left Column = Editorial Typography & CTAs,
          Right Column = Interactive Generative Artwork Preview. Zero Overlap.
         ========================================================================= */}
      <section className="relative px-6 pt-10 pb-20 md:pt-14 md:pb-24 max-w-7xl mx-auto w-full border-b border-obsidian-border studio-grain">
        {/* Ambient atmospheric glow behind artwork */}
        <div className="absolute top-10 left-1/4 w-[450px] h-[300px] bg-electric-violet/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[350px] h-[280px] bg-acid-lime/5 blur-[100px] pointer-events-none" />

        {/* Top Meta Line: Wordmark & Architecture Status */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-obsidian-border">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm tracking-[0.3em] font-extrabold uppercase text-white">
              PIXELMUSE
            </span>
            <span className="text-obsidian-border">/</span>
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted hidden sm:inline">
              Experimental Digital Art Studio & Generative Laboratory
            </span>
          </div>

          <Badge variant="lime" dot>
            Engine v1.0 Ready
          </Badge>
        </div>

        {/* Two-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Monumental Editorial Typography & CTAs */}
          <div className="lg:col-span-6 space-y-7 z-10">
            <div className="space-y-3">
              <span className="font-mono text-2xs uppercase tracking-widest text-acid-lime block">
                [ GENERATIVE RASTER STUDIO ]
              </span>

              {/* Exact Requested Headline: Fluid typography with clamp(), zero truncation */}
              <h1 className="font-display text-[clamp(2.5rem,5.2vw,4.5rem)] font-black uppercase tracking-tight text-white leading-[0.95] max-w-xl">
                MAKE THE <br />
                <span className="text-acid-lime font-editorial italic lowercase font-normal">
                  ordinary
                </span>{' '}
                LOOK <br />
                <span className="text-white block mt-1 tracking-tight">
                  EXTRAORDINARY.
                </span>
              </h1>
            </div>

            {/* Concise Supporting Description */}
            <p className="font-mono text-xs sm:text-sm text-obsidian-text max-w-lg leading-relaxed">
              Transform ordinary photographs into expressive generative digital art.
              Harness luminance-mapped ASCII characters, 1-bit Bayer dithering, chromatic
              geometric mosaics, and 60 FPS kinetic oscillators.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/studio">
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowUpRight className="w-4 h-4 text-black" />}
                  iconPosition="right"
                  className="px-7 h-11 font-bold"
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

            {/* Quick Engine Specifications Strip */}
            <div className="pt-6 border-t border-obsidian-border grid grid-cols-3 gap-4 font-mono text-2xs text-obsidian-muted">
              <div>
                <span className="text-white block font-semibold">24 RASTER MODES</span>
                <span className="block mt-0.5 text-obsidian-text">ASCII / Dither / Geometric</span>
              </div>
              <div>
                <span className="text-acid-lime block font-semibold">&lt; 16MS LATENCY</span>
                <span className="block mt-0.5 text-obsidian-text">Hardware Canvas 2D</span>
              </div>
              <div>
                <span className="text-electric-violet-light block font-semibold">4K SUPERSAMPLING</span>
                <span className="block mt-0.5 text-obsidian-text">Lossless Master Export</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Centerpiece — Interactive Generative Artwork Canvas */}
          <div className="lg:col-span-6 w-full relative">
            <HeroArtworkCanvas />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — EXPLORE THE ART (INTERACTIVE ART GALLERY)
          8 Live Preview Experiences with hover/tap transformations and 1-click Studio launch.
         ========================================================================= */}
      <ExploreGallery />

      {/* =========================================================================
          SECTION 3 — HOW IT WORKS (STUDIO WORKFLOW)
          4 Process Steps with dedicated Canvas 2D illustrations.
         ========================================================================= */}
      <WorkflowSection />

      {/* =========================================================================
          SECTION 4 — FINAL CTA
         ========================================================================= */}
      <FinalCTA />

      {/* SITE FOOTER & ARTIST CREDITS */}
      <SiteFooter />
    </div>
  );
};
