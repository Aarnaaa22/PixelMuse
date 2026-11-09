import { LightingConfig, LightPoint } from '../types';
import { clamp, hexToRgb } from '../utilities';

/**
 * PixelMuse Multi-Point 2D Lighting Engine.
 * Supports arbitrary configurable omni-directional light points with radial falloff,
 * normalized positional coordinates, radius, intensity, ambient illumination, and chromatic tint.
 */
export class LightingEngine {
  /**
   * Applies the lighting system onto the target canvas context.
   * Blends ambient baseline and point light accumulation onto the generative artwork.
   */
  static applyLighting(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config?: LightingConfig
  ): void {
    if (!config || !config.enabled || !config.lights || config.lights.length === 0) {
      return;
    }

    const { ambient = 0.35, lights } = config;

    // Create an offscreen lighting accumulation buffer
    const lightCanvas = document.createElement('canvas');
    lightCanvas.width = width;
    lightCanvas.height = height;
    const lCtx = lightCanvas.getContext('2d');
    if (!lCtx) return;

    // 1. Fill base with ambient light darkness (inverted for multiply or direct light map)
    const ambientVal = clamp(ambient, 0, 1);
    lCtx.fillStyle = `rgb(${Math.round(ambientVal * 255)}, ${Math.round(ambientVal * 255)}, ${Math.round(ambientVal * 255)})`;
    lCtx.fillRect(0, 0, width, height);

    // 2. Accumulate individual light points with additive blend ('lighter')
    lCtx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < lights.length; i++) {
      const light = lights[i];
      if (light.intensity <= 0) continue;

      const lx = light.x * width;
      const ly = light.y * height;
      const maxDim = Math.max(width, height);
      const lRadius = light.radius > 1 ? light.radius : Math.max(10, light.radius * maxDim);
      const intensity = clamp(light.intensity, 0, 1);

      const color = light.color ? hexToRgb(light.color) : { r: 255, g: 255, b: 255 };

      // Radial light falloff gradient
      const grad = lCtx.createRadialGradient(lx, ly, 0, lx, ly, lRadius);
      grad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity})`);
      grad.addColorStop(0.35, `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity * 0.65})`);
      grad.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity * 0.25})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      lCtx.fillStyle = grad;
      lCtx.beginPath();
      lCtx.arc(lx, ly, lRadius, 0, Math.PI * 2);
      lCtx.fill();

      // Specular highlight core
      const coreR = Math.max(2, lRadius * 0.08);
      const coreGrad = lCtx.createRadialGradient(lx, ly, 0, lx, ly, coreR);
      coreGrad.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.9})`);
      coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      lCtx.fillStyle = coreGrad;
      lCtx.beginPath();
      lCtx.arc(lx, ly, coreR, 0, Math.PI * 2);
      lCtx.fill();
    }

    // 3. Composite lighting map onto main canvas using 'multiply'
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(lightCanvas, 0, 0, width, height);
    ctx.restore();

    // 4. Subtle additive specular rim glow
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.25;
    ctx.drawImage(lightCanvas, 0, 0, width, height);
    ctx.restore();
  }

  /**
   * Helper to create a new default light point.
   */
  static createDefaultLight(index = 0): LightPoint {
    const palette = ['#FFFFFF', '#CCFF00', '#9D4EDD', '#FF473A', '#33E533'];
    const positions = [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.4 },
      { x: 0.5, y: 0.7 },
      { x: 0.2, y: 0.8 },
      { x: 0.8, y: 0.2 },
    ];
    const pos = positions[index % positions.length];
    return {
      id: `light-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      x: pos.x,
      y: pos.y,
      radius: 0.35,
      intensity: 0.8,
      color: palette[index % palette.length],
    };
  }
}

