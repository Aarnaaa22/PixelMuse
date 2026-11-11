import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  UploadCloud,
  SplitSquareVertical,
  RotateCcw,
  ArrowRight,
  AlertCircle,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { IconButton, Button, Badge } from '../ui';
import { useCanvasRender, useImageDrop } from '../../hooks';
import { useStudioStore } from '../../stores';
import { RenderMode } from '../../types';
import { cn } from '../../utilities';
import { SAMPLE_PHOTOS, createSamplePhotoImage } from '../../utilities/samplePhotos';

export const CanvasStage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [showGuideBar, setShowGuideBar] = useState(true);

  useCanvasRender(canvasRef);
  const { isDragging, onDragOver, onDragLeave, onDrop, onFileInputChange } = useImageDrop();

  const {
    sourceImage,
    imageMetadata,
    setSourceImage,
    config,
    setMode,
    uploadError,
    setUploadError,
    isImageLoading,
    setIsImageLoading,
    zoom,
    setZoom,
    panX,
    panY,
    setPan,
    resetViewport,
    fitToScreen,
    isSplitView,
    toggleSplitView,
    splitPosition,
    setSplitPosition,
  } = useStudioStore();

  // Track viewport container dimensions to maintain contain-style scaling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setViewportSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateSize();
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewportSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Calculate contain-style fitting dimensions:
  // Preserves aspect ratio, fits within viewport, never stretched, never cropped, remains centered.
  // Prominently scales up photographs to fill 94% width and 90% height so the image is BIG, clear, and prominent!
  const fitDimensions = useMemo(() => {
    const stageW = viewportSize.width > 0 ? viewportSize.width : (typeof window !== 'undefined' ? window.innerWidth - 640 : 1000);
    const stageH = viewportSize.height > 0 ? viewportSize.height : (typeof window !== 'undefined' ? window.innerHeight - 140 : 800);

    const srcW =
      (sourceImage && 'naturalWidth' in sourceImage ? sourceImage.naturalWidth : (sourceImage as any)?.width) ||
      imageMetadata?.width ||
      640;
    const srcH =
      (sourceImage && 'naturalHeight' in sourceImage ? sourceImage.naturalHeight : (sourceImage as any)?.height) ||
      imageMetadata?.height ||
      640;

    if (srcW <= 0 || srcH <= 0) return { width: 700, height: 700 };

    const aspect = srcW / srcH;
    // Scale image up to fill 94% of stage width and 90% of stage height
    const maxW = Math.max(500, stageW * 0.94);
    const maxH = Math.max(480, stageH * 0.90);

    let w = maxW;
    let h = maxW / aspect;

    if (h > maxH) {
      h = maxH;
      w = maxH * aspect;
    }

    return {
      width: Math.round(w),
      height: Math.round(h),
    };
  }, [sourceImage, imageMetadata, viewportSize]);

  const originalImageSrc = useMemo(() => {
    if (!sourceImage) return '';
    return 'src' in sourceImage ? sourceImage.src : (sourceImage as HTMLCanvasElement).toDataURL();
  }, [sourceImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // CRITICAL: Do NOT start canvas panning if clicking any button, input, select, or toolbar!
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, input, select, textarea, a, [role="button"], .pointer-events-auto')) {
      return;
    }

    if (e.button === 0 || e.button === 1 || e.altKey) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan(e.clientX - dragStart.x, e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Wheel zoom centered on viewport
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom(zoom * zoomFactor);
  };

  const handleSelectSample = async (sampleId: string) => {
    try {
      setIsImageLoading(true);
      const sample = SAMPLE_PHOTOS.find((s) => s.id === sampleId) || SAMPLE_PHOTOS[0];
      const img = await createSamplePhotoImage(sampleId);
      setSourceImage(img, {
        name: `${sample.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        width: sample.width,
        height: sample.height,
        sizeBytes: 256 * 1024,
        aspectRatio: sample.width / sample.height,
      });
    } catch (err: any) {
      setUploadError(`Failed to load sample photograph: ${err?.message || 'Decoding error'}`);
    } finally {
      setIsImageLoading(false);
    }
  };

  const QUICK_STYLES: { id: RenderMode; name: string; hint: string }[] = [
    { id: 'original', name: 'Original', hint: 'Default unmodified view: see your raw uploaded photo as it is' },
    { id: 'ascii', name: 'ASCII', hint: 'Monospace typographic glyphs mapped by luminance' },
    { id: 'pixel', name: 'Pixel', hint: 'Quantized 8-bit arcade pixel grid' },
    { id: 'dither', name: 'Dither', hint: 'Bayer ordered dithering & vintage halftone matrix' },
    { id: 'dots', name: 'Dots', hint: 'Luminous circular halftone screening dots' },
    { id: 'matrix-rain', name: 'Matrix', hint: 'Cascading digital code streams with phosphor trails' },
    { id: 'crosses', name: 'Crosses', hint: 'Neon geometric crosses with synthwave aura' },
    { id: 'rings', name: 'Rings', hint: 'Concentric pulsating rings with radial energy' },
  ];

  return (
    <div
      ref={containerRef}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="relative flex-1 min-h-0 w-full h-full bg-obsidian-950 overflow-hidden select-none flex items-center justify-center studio-checker cursor-grab active:cursor-grabbing"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* ERROR ALERT BANNER */}
      {uploadError && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full mx-4 p-4 bg-obsidian-surface border-2 border-signal-coral shadow-2xl flex items-start gap-3 backdrop-blur-md rounded-xs">
          <AlertCircle className="w-5 h-5 text-signal-coral flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-mono text-2xs uppercase tracking-wider text-signal-coral font-bold flex items-center justify-between">
              <span>UPLOAD / RENDERING ERROR</span>
            </div>
            <p className="font-mono text-xs text-white leading-relaxed">
              {uploadError}
            </p>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-obsidian-muted hover:text-white text-xs font-mono px-2 py-1 border border-obsidian-border bg-obsidian-950 transition-colors"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* ASYNCHRONOUS DECODING LOADING OVERLAY */}
      {isImageLoading && (
        <div className="absolute inset-0 z-50 bg-obsidian-950/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-2 border-acid-lime border-t-transparent rounded-full animate-spin" />
          <div className="text-center space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-acid-lime font-bold block">
              Decoding Photographic Sensor...
            </span>
            <span className="font-mono text-2xs text-obsidian-muted block">
              Parsing bitstream & calculating contain viewport matrix
            </span>
          </div>
        </div>
      )}

      {/* 1. EMPTY UPLOAD STATE */}
      {!sourceImage && (
        <div className="z-10 max-w-lg w-full mx-6 p-8 bg-obsidian-surface/95 border border-obsidian-border text-center shadow-2xl space-y-6 backdrop-blur-md">
          <div className="w-14 h-14 mx-auto bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-acid-lime">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <Badge variant="lime" dot>
              Awaiting Photographic Sensor
            </Badge>
            <h2 className="font-display text-2xl font-bold uppercase text-white tracking-wide">
              Your Canvas Is Waiting.
            </h2>
            <p className="font-mono text-xs text-obsidian-text leading-relaxed">
              Drag and drop any photograph onto the canvas, browse your computer, or test
              with sample gallery photography.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<UploadCloud className="w-4 h-4 text-black" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
          </div>

          {/* Quick-pick Sample Photography */}
          <div className="pt-6 border-t border-obsidian-border space-y-3">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted block">
              Or Instant Experiment With:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PHOTOS.slice(0, 2).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.id)}
                  className="p-2.5 border border-obsidian-border hover:border-acid-lime bg-obsidian-950 text-left rounded-xs transition-colors group flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs uppercase text-white group-hover:text-acid-lime transition-colors block">
                      {sample.name}
                    </span>
                    <span className="font-mono text-[9px] text-obsidian-muted block">
                      640×640 PX
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-obsidian-muted group-hover:text-acid-lime transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STUDIO ASSISTANT & QUICK WORKFLOW DIRECTION BAR */}
      {sourceImage && imageMetadata && (
        <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Left: Active Photo Metadata Pill + Quick Replace */}
          <div className="pointer-events-auto flex items-center gap-2 bg-obsidian-surface/95 border border-obsidian-border px-3 py-1.5 rounded-xs backdrop-blur-md shadow-xl select-none">
            <div className="w-2 h-2 rounded-full bg-acid-lime animate-pulse" />
            <span
              className="font-mono text-2xs font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]"
              title={`Uploaded File: ${imageMetadata.name}`}
            >
              {imageMetadata.name}
            </span>
            <span className="text-obsidian-border font-mono text-2xs">/</span>
            <span
              className="font-mono text-2xs text-obsidian-muted"
              title="Native Sensor Dimensions"
            >
              {imageMetadata.width}×{imageMetadata.height}px
            </span>
            <span className="text-obsidian-border font-mono text-2xs">/</span>
            <span
              className="font-mono text-2xs text-acid-lime font-bold"
              title="Display Viewport Scale"
            >
              {Math.round(zoom * 100)}%
            </span>
            <div className="h-3 w-px bg-obsidian-border mx-0.5" />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload and replace with a different photograph"
              className="font-mono text-[9px] uppercase tracking-wider text-obsidian-muted hover:text-white hover:border-acid-lime/50 border border-obsidian-border px-1.5 py-0.5 rounded-xs bg-obsidian-950 transition-colors"
            >
              Replace
            </button>
          </div>

          {/* Center: Interactive Workflow & Style Quick-Switcher */}
          {showGuideBar ? (
            <div className="pointer-events-auto flex items-center gap-1.5 bg-obsidian-surface/95 border border-obsidian-border px-2.5 py-1 rounded-xs backdrop-blur-md shadow-xl select-none overflow-x-auto max-w-[65vw]">
              <span
                className="font-mono text-[9px] uppercase tracking-widest text-obsidian-muted pr-1 flex items-center gap-1 shrink-0"
                title="Workflow Step 2: Choose your desired raster transformation"
              >
                <Sparkles className="w-2.5 h-2.5 text-acid-lime" />
                <span>STYLE:</span>
              </span>

              {QUICK_STYLES.map((st) => {
                const isActive = config.mode === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMode(st.id);
                    }}
                    title={st.hint}
                    className={cn(
                      'px-2 py-0.5 font-mono text-2xs uppercase tracking-wider rounded-xs border transition-all shrink-0 cursor-pointer',
                      isActive
                        ? 'border-acid-lime bg-acid-lime/20 text-acid-lime font-bold shadow-[0_0_8px_rgba(204,255,0,0.25)]'
                        : 'border-obsidian-border text-obsidian-muted hover:text-white hover:border-obsidian-border-hover bg-obsidian-950'
                    )}
                  >
                    {st.name}
                  </button>
                );
              })}

              <div className="h-3 w-px bg-obsidian-border mx-1 shrink-0" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGuideBar(false);
                }}
                title="Collapse Assistant Bar"
                className="p-1 text-obsidian-muted hover:text-white shrink-0 cursor-pointer"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGuideBar(true);
              }}
              title="Show Quick Style Assistant"
              className="pointer-events-auto px-2 py-1 bg-obsidian-surface/90 border border-obsidian-border text-obsidian-muted hover:text-white font-mono text-2xs uppercase rounded-xs backdrop-blur-md flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-acid-lime" />
              <span>Quick Styles</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          )}

          {/* Right: Quick Direction Indicator */}
          <div className="pointer-events-auto hidden xl:flex items-center gap-2 bg-obsidian-surface/95 border border-obsidian-border px-3 py-1.5 rounded-xs backdrop-blur-md shadow-xl select-none text-obsidian-muted font-mono text-2xs">
            <span className="text-acid-lime font-bold">DIRECTION:</span>
            <span>Tweak sliders in Inspector on right ▸</span>
          </div>
        </div>
      )}

      {/* FLOATING GUIDANCE NOTIFICATION WHEN IN DEFAULT ORIGINAL PHOTOGRAPH MODE */}
      {sourceImage && config.mode === 'original' && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 bg-obsidian-950/95 border border-acid-lime/70 text-white rounded-xs shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-in fade-in select-none">
          <div className="w-2 h-2 rounded-full bg-acid-lime animate-pulse" />
          <span className="font-mono text-2xs uppercase tracking-wider text-acid-lime font-bold">
            RAW PHOTOGRAPH LOADED
          </span>
          <span className="text-obsidian-muted font-mono text-2xs hidden sm:inline">
            ▸ Select any style above or in the left sidebar to transform into generative art
          </span>
        </div>
      )}

      {/* 2. IMAGE PREVIEW & CANVAS VIEWPORT */}
      <div
        className={cn(
          "relative transition-transform duration-75 shadow-2xl flex-shrink-0",
          !sourceImage && "hidden"
        )}
        style={{
          width: `${fitDimensions.width}px`,
          height: `${fitDimensions.height}px`,
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Main Rendering Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: `${fitDimensions.width}px`,
            height: `${fitDimensions.height}px`,
            imageRendering: config.mode === 'pixel' || config.mode === 'dither' ? 'pixelated' : 'auto',
          }}
          className="border border-obsidian-border bg-obsidian block max-w-none shadow-crisp-border"
        />

        {/* Before/After Split Comparison View */}
        {isSplitView && sourceImage && (
          <div
            className="absolute inset-0 overflow-hidden border-r-2 border-acid-lime pointer-events-none"
            style={{ width: `${splitPosition}%` }}
          >
            <img
              src={originalImageSrc}
              alt="Original Raw Sensor"
              className="w-full h-full object-cover max-w-none"
              style={{
                width: `${fitDimensions.width}px`,
                height: `${fitDimensions.height}px`,
              }}
            />

            {/* Tag Overlays */}
            <div className="absolute top-3 left-3 bg-obsidian-950/80 border border-obsidian-border px-2 py-0.5 font-mono text-2xs text-white">
              ORIGINAL PHOTO
            </div>
          </div>
        )}

        {isSplitView && sourceImage && (
          <div className="absolute top-3 right-3 bg-obsidian-950/80 border border-acid-lime/50 px-2 py-0.5 font-mono text-2xs text-acid-lime pointer-events-none">
            GENERATIVE MATRIX
          </div>
        )}
      </div>

      {/* Split Comparison Slider Controller (When Split View Active) */}
      {isSplitView && sourceImage && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-obsidian-surface/95 border border-obsidian-border px-4 py-2 flex items-center gap-3 rounded-xs backdrop-blur-md shadow-2xl">
          <span className="font-mono text-2xs uppercase text-obsidian-muted">Compare</span>
          <input
            type="range"
            min={0}
            max={100}
            value={splitPosition}
            onChange={(e) => setSplitPosition(parseFloat(e.target.value))}
            className="w-36 h-1 bg-obsidian-border accent-acid-lime cursor-pointer"
          />
          <span className="font-mono text-2xs text-acid-lime font-semibold w-8 text-right">
            {splitPosition}%
          </span>
        </div>
      )}

      {/* Floating Viewport Controls (Bottom Right) */}
      {sourceImage && (
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-obsidian-surface/95 border border-obsidian-border p-1 rounded-xs backdrop-blur-sm shadow-xl">
          <button
            onClick={() => {
              if (config.mode === 'original') {
                setMode('mosaic');
              } else {
                setMode('original');
              }
            }}
            title={config.mode === 'original' ? 'Switch to Generative Effect' : 'View Pristine Original Photograph'}
            className={cn(
              "px-2 py-1 font-mono text-2xs uppercase tracking-wider border rounded-xs transition-colors flex items-center gap-1.5",
              config.mode === 'original'
                ? "border-acid-lime bg-acid-lime/20 text-acid-lime font-bold shadow-[0_0_8px_rgba(204,255,0,0.3)]"
                : "border-obsidian-border bg-obsidian-subtle hover:text-white text-obsidian-muted"
            )}
          >
            <Eye className="w-3 h-3" />
            <span>{config.mode === 'original' ? 'ORIGINAL ACTIVE' : 'ORIGINAL'}</span>
          </button>

          <div className="h-4 w-px bg-obsidian-border mx-0.5" />

          <IconButton
            size="xs"
            title="Toggle Split Comparison (S) — Drag slider to compare raw photo against generative output"
            active={isSplitView}
            onClick={toggleSplitView}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
          </IconButton>

          <div className="h-4 w-px bg-obsidian-border mx-0.5" />

          <IconButton
            size="xs"
            title="Zoom Out (-) — Decrease magnification"
            onClick={() => setZoom(zoom - 0.2)}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </IconButton>

          <button
            onClick={() => setZoom(1)}
            title="Reset Zoom to 100% (Actual Pixel Resolution)"
            className="font-mono text-2xs px-1.5 text-obsidian-text hover:text-white w-12 text-center"
          >
            {Math.round(zoom * 100)}%
          </button>

          <IconButton
            size="xs"
            title="Zoom In (+) — Increase magnification"
            onClick={() => setZoom(zoom + 0.2)}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </IconButton>

          <div className="h-4 w-px bg-obsidian-border mx-0.5" />

          <IconButton
            size="xs"
            title="Fit to Screen (F) — Prominently scale image to fill available viewport"
            onClick={fitToScreen}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </IconButton>

          <IconButton
            size="xs"
            title="Reset Canvas Position — Recenter canvas and clear pan offset"
            onClick={resetViewport}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </IconButton>
        </div>
      )}

      {/* Drag & Drop Visual Target Overlay */}
      {isDragging && (
        <div className="absolute inset-4 z-50 border-2 border-dashed border-acid-lime bg-obsidian/95 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none">
          <UploadCloud className="w-12 h-12 text-acid-lime animate-bounce mb-3" />
          <p className="font-display text-lg uppercase tracking-widest text-white">
            Release Photograph To Load
          </p>
          <p className="font-mono text-xs text-obsidian-muted mt-1">
            Processing Rec.709 Luminance Buffer...
          </p>
        </div>
      )}
    </div>
  );
};
