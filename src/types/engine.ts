export type RenderMode = 
  | 'ascii'
  | 'dither'
  | 'pixel-mosaic'
  | 'halftone'
  | 'matrix'
  | 'crt-scan';

export type DitherAlgorithm = 
  | 'floyd-steinberg'
  | 'bayer-4x4'
  | 'bayer-8x8'
  | 'atkinson'
  | 'ordered-cross';

export type MosaicShape = 'square' | 'circle' | 'diamond' | 'hexagon';

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorRGBA extends ColorRGB {
  a: number;
}

export interface PalettePreset {
  id: string;
  name: string;
  category: 'monochrome' | 'cyberpunk' | 'editorial' | 'retro';
  colors: string[]; // hex codes
}

export interface AsciiConfig {
  characters: string;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  invert: boolean;
  colorMode: 'monochrome' | 'original' | 'palette' | 'gradient';
  monochromeColor: string;
  backgroundColor: string;
  contrast: number;
  brightness: number;
  glow: number;
}

export interface DitherConfig {
  algorithm: DitherAlgorithm;
  scale: number;
  threshold: number;
  colorDepth: number; // 2, 4, 8, 16 colors
  paletteId: string;
  serpentine: boolean;
}

export interface MosaicConfig {
  cellSize: number;
  shape: MosaicShape;
  gap: number;
  jitter: number;
  angle: number;
  preserveEdges: boolean;
}

export interface HalftoneConfig {
  dotSize: number;
  angle: number;
  cmykSeparation: boolean;
  sharpness: number;
}

export interface AnimationMotionConfig {
  isPlaying: boolean;
  speed: number;
  loop: boolean;
  type: 'none' | 'scanline' | 'sine-wave' | 'glitch' | 'matrix-rain' | 'pulse';
  intensity: number;
  frequency: number;
}

export interface RenderConfig {
  mode: RenderMode;
  resolutionScale: number; // 0.25 to 2
  ascii: AsciiConfig;
  dither: DitherConfig;
  mosaic: MosaicConfig;
  halftone: HalftoneConfig;
  motion: AnimationMotionConfig;
  palette: PalettePreset;
}

export interface RenderStats {
  fps: number;
  renderTimeMs: number;
  pixelCount: number;
  elementCount: number;
  canvasWidth: number;
  canvasHeight: number;
}

export interface IRenderer {
  readonly mode: RenderMode;
  render(
    ctx: CanvasRenderingContext2D,
    source: ImageData,
    config: RenderConfig,
    time: number
  ): void;
}

