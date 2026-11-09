import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button, Badge } from '../ui';
import { EXHIBITION_PIECES, ExhibitionPieceMeta, drawExhibitionPiece } from '../../utilities/artworks';
import { useStudioStore, BUILTIN_PALETTES } from '../../stores';

interface GalleryCardProps {
  piece: ExhibitionPieceMeta;
  index: number;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ piece, index }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const updateConfig = useStudioStore((s) => s.updateConfig);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId: number;
    let startTime = performance.now();

    // Render static or dynamic canvas
    const render = (now: number) => {
      const time = (now - startTime) / 1000;
      drawExhibitionPiece(canvas, piece.id, time);

      // Only continue continuous loop for animated pieces or while hovered
      if (piece.id === 'matrix-kinetic' || piece.id === 'ascii-portrait' || isHovered) {
        rafId = requestAnimationFrame(render);
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [piece.id, isHovered]);

  const handleOpenStudio = () => {
    // Map exhibition piece to studio mode
    if (piece.id === 'ascii-portrait') {
      updateConfig({
        mode: 'ascii',
        ascii: {
          characters: ' .:-=+*#%@$░▒▓█',
          fontSize: 12,
          lineHeight: 12,
          fontFamily: '"JetBrains Mono", monospace',
          invert: false,
          colorMode: 'palette',
          monochromeColor: '#CCFF00',
          backgroundColor: '#08080A',
          contrast: 35,
          brightness: 0,
          glow: 6,
        },
        palette: BUILTIN_PALETTES[0],
      });
    } else if (piece.id === 'dither-brutalist') {
      updateConfig({
        mode: 'dither',
        dither: {
          algorithm: 'bayer-8x8',
          scale: 2,
          threshold: 0.5,
          colorDepth: 2,
          paletteId: 'noir-monochrome',
          serpentine: true,
        },
        palette: BUILTIN_PALETTES[1],
      });
    } else if (piece.id === 'pixel-landscape') {
      updateConfig({
        mode: 'pixel-mosaic',
        mosaic: {
          cellSize: 12,
          shape: 'square',
          gap: 1,
          jitter: 0,
          angle: 0,
          preserveEdges: true,
        },
        palette: BUILTIN_PALETTES[2],
      });
    } else if (piece.id === 'geometric-abstract') {
      updateConfig({
        mode: 'pixel-mosaic',
        mosaic: {
          cellSize: 16,
          shape: 'diamond',
          gap: 2,
          jitter: 0,
          angle: 45,
          preserveEdges: false,
        },
        palette: BUILTIN_PALETTES[0],
      });
    } else if (piece.id === 'matrix-kinetic') {
      updateConfig({
        mode: 'ascii',
        motion: {
          isPlaying: true,
          speed: 1.2,
          loop: true,
          type: 'scanline',
          intensity: 0.8,
          frequency: 1,
        },
        palette: BUILTIN_PALETTES[4],
      });
    }

    navigate('/studio');
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border border-obsidian-border bg-obsidian-surface flex flex-col group transition-all duration-300 hover:border-obsidian-border-hover relative"
    >
      {/* Canvas Viewport */}
      <div className="relative aspect-square w-full overflow-hidden bg-obsidian-950 border-b border-obsidian-border">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Category Tag */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="outline" size="xs">
            {piece.category}
          </Badge>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-obsidian-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-6 backdrop-blur-[2px]">
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowUpRight className="w-4 h-4 text-black" />}
            iconPosition="right"
            onClick={handleOpenStudio}
          >
            Open In Studio
          </Button>
        </div>
      </div>

      {/* Exhibition Piece Metadata Block */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-2xs font-mono text-obsidian-muted">
            <span>NO. 0{index + 1} // ARCHIVE</span>
            <span>{piece.year}</span>
          </div>

          <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white group-hover:text-acid-lime transition-colors">
            {piece.title}
          </h3>

          <p className="font-mono text-xs text-obsidian-text leading-relaxed line-clamp-2">
            {piece.description}
          </p>
        </div>

        {/* Tech Specifications and Color Swatches */}
        <div className="pt-4 border-t border-obsidian-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xs text-obsidian-muted uppercase">
              {piece.techSpec}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {/* Color Swatch */}
            <div className="flex h-2 w-24 border border-obsidian-border overflow-hidden">
              {piece.paletteColors.map((color, i) => (
                <div key={i} className="flex-1 h-full" style={{ backgroundColor: color }} />
              ))}
            </div>

            <button
              onClick={handleOpenStudio}
              className="font-mono text-2xs uppercase text-acid-lime flex items-center gap-1 hover:underline"
            >
              <span>Inspect Params</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export const ExhibitionGallery: React.FC = () => {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-obsidian-border">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-obsidian-border">
        <div className="space-y-3">
          <Badge variant="violet" dot>
            Exhibition Catalog
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-none">
            Transformations In Motion
          </h2>
          <p className="font-mono text-xs sm:text-sm text-obsidian-text max-w-xl">
            Real photographic inputs deconstructed into discrete typographic glyphs,
            Bayer error thresholds, and chromatic tile matrices.
          </p>
        </div>

        <div className="font-mono text-2xs text-obsidian-muted uppercase tracking-widest text-right">
          <div>TOTAL CATALOGED: 05 WORKS</div>
          <div className="text-acid-lime">LIVE HIGH DYNAMIC RASTER</div>
        </div>
      </div>

      {/* Asymmetric Exhibition Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXHIBITION_PIECES.map((piece, index) => (
          <GalleryCard key={piece.id} piece={piece} index={index} />
        ))}
      </div>
    </section>
  );
};
