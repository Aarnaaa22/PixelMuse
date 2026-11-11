import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { CommunityRecipe } from '../../types/recipe';
import { CanvasPipeline } from '../../rendering-engine';
import { createSamplePhotoCanvas } from '../../utilities/samplePhotos';
import { ProceduralBackgroundEngine } from '../../recipes/proceduralBackgrounds';
import { DEFAULT_CONFIG } from '../../stores/studioStore';
import { RenderConfig } from '../../types';

interface RecipeCanvasPreviewProps {
  recipe: CommunityRecipe;
  interactive?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export const RecipeCanvasPreview: React.FC<RecipeCanvasPreviewProps> = ({
  recipe,
  interactive = false,
  className = '',
  width = 360,
  height = 240,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pipelineRef = useRef<CanvasPipeline | null>(null);
  const proceduralEngineRef = useRef<ProceduralBackgroundEngine | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Cached sample photo canvas
  const sampleCanvas = useMemo(() => {
    return createSamplePhotoCanvas('marble-sculpture');
  }, []);

  // Merge recipe config with DEFAULT_CONFIG to guarantee all fields exist
  const mergedConfig: RenderConfig = useMemo(() => {
    const rawConfig = recipe.defaultConfig || recipe.config || {};
    return {
      ...DEFAULT_CONFIG,
      ...rawConfig,
      renderParams: {
        ...DEFAULT_CONFIG.renderParams,
        ...(rawConfig.renderParams || {}),
      },
      color: {
        ...DEFAULT_CONFIG.color,
        ...(rawConfig.color || {}),
      },
      effects: {
        ...DEFAULT_CONFIG.effects,
        ...(rawConfig.effects || {}),
      },
      motion: {
        ...DEFAULT_CONFIG.motion,
        ...(rawConfig.motion || {}),
      },
      ascii: {
        ...DEFAULT_CONFIG.ascii,
        ...(rawConfig.ascii || {}),
      },
      dither: {
        ...DEFAULT_CONFIG.dither,
        ...(rawConfig.dither || {}),
      },
    };
  }, [recipe]);

  const renderFrame = useCallback(
    (timeSec: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!pipelineRef.current) {
        pipelineRef.current = new CanvasPipeline();
      }
      pipelineRef.current.attach(canvas);

      // Execute via CanvasPipeline with optimized thumbnail resolution
      pipelineRef.current.execute(sampleCanvas, width, height, mergedConfig, timeSec);
    },
    [sampleCanvas, mergedConfig, width, height]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Render initial static frame
    renderFrame(0);

    const isAnim = recipe.animationMetadata?.isAnimated ?? recipe.isAnimated;
    const shouldAnimate = (interactive || isHovered) && isAnim;

    if (shouldAnimate) {
      const startTime = performance.now();
      const loop = (now: number) => {
        const timeSec = (now - startTime) / 1000;
        renderFrame(timeSec);
        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      pipelineRef.current?.detach();
      proceduralEngineRef.current?.detach();
    };
  }, [renderFrame, interactive, isHovered, recipe]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!proceduralEngineRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    proceduralEngineRef.current.setMouse(nx, ny);
  };

  return (
    <div
      className={`relative w-full h-full bg-obsidian-950 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        className="w-full h-full object-cover block transition-transform duration-500 will-change-transform"
      />
    </div>
  );
};
