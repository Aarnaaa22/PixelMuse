import React, { useRef, useEffect, useState, useCallback } from 'react';
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

  // Merge recipe config with DEFAULT_CONFIG to guarantee all fields exist
  const mergedConfig: RenderConfig = {
    ...DEFAULT_CONFIG,
    ...recipe.config,
    renderParams: {
      ...DEFAULT_CONFIG.renderParams,
      ...(recipe.config.renderParams || {}),
    },
    color: {
      ...DEFAULT_CONFIG.color,
      ...(recipe.config.color || {}),
    },
    effects: {
      ...DEFAULT_CONFIG.effects,
      ...(recipe.config.effects || {}),
    },
    motion: {
      ...DEFAULT_CONFIG.motion,
      ...(recipe.config.motion || {}),
    },
    ascii: {
      ...DEFAULT_CONFIG.ascii,
      ...(recipe.config.ascii || {}),
    },
    dither: {
      ...DEFAULT_CONFIG.dither,
      ...(recipe.config.dither || {}),
    },
  };

  const renderFrame = useCallback(
    (timeSec: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (recipe.type === 'background' || recipe.proceduralType) {
        if (!proceduralEngineRef.current) {
          proceduralEngineRef.current = new ProceduralBackgroundEngine();
          proceduralEngineRef.current.attach(canvas);
        }
        const pType = recipe.proceduralType || 'hero-mesh';
        const shouldAnimate = interactive || isHovered;
        proceduralEngineRef.current.render(pType, shouldAnimate);
      } else {
        // Photographic transformation on shared sample sculpture
        if (!pipelineRef.current) {
          pipelineRef.current = new CanvasPipeline();
        }
        pipelineRef.current.attach(canvas);
        const sample = createSamplePhotoCanvas('marble-sculpture');
        pipelineRef.current.execute(sample, width, height, mergedConfig, timeSec);
      }
    },
    [recipe, interactive, isHovered, width, height]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Render initial static frame
    renderFrame(0);

    const shouldAnimate = (interactive || isHovered) && recipe.isAnimated;

    if (shouldAnimate) {
      let start = performance.now();
      const loop = (now: number) => {
        const timeSec = (now - start) / 1000;
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
  }, [renderFrame, interactive, isHovered, recipe.isAnimated]);

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
