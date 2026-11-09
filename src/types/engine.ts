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

export interface ColorConfig {
  brightness: number;   // -50 to 50
  contrast: number;     // -50 to 80
  saturation: number;   // 0 to 3
  grayscale: boolean;
  tintColor: string;
  tintOpacity: number;  // 0 to 1
}

export interface BackgroundConfig {
  mode: 'solid' | 'transparent' | 'source-blur' | 'grid';
  opacity: number;      // 0 to 1
  blur: number;         // 0 to 40 px
  color: string;
}

export interface EffectsConfig {
  bloom: number;                // 0 to 30 px
  vignette: number;             // 0 to 1
  scanlines: number;            // 0 to 1
  filmGrain: number;            // 0 to 1
  chromaticAberration: number;  // 0 to 16 px
  glitch: number;               // 0 to 1
}

export interface GeneralRenderParams {
  cellSize: number;     // 4 to 48 px
  density: number;      // 0.2 to 2.0
  coverage: number;     // 0 to 100 %
  invert: boolean;
  edgeEmphasis: number; // 0 to 100 %
}

export interface AnimationMotionConfig {
  isPlaying: boolean;
  speed: number;
  loop: boolean;
  type: 'none' | 'scanline' | 'sine-wave' | 'glitch' | 'matrix-rain' | 'pulse';
  intensity: number;
  frequency: number;
  currentTime?: number; // seconds
  duration?: number;    // seconds (default 10)
}

export interface StudioLayer {
  id: string;
  name: string;
  type: 'base-photo' | 'raster-core' | 'color-map' | 'post-fx';
  visible: boolean;
  opacity: number;
  locked: boolean;
  blendMode: 'normal' | 'screen' | 'multiply' | 'overlay' | 'color-dodge';
}

export interface RenderConfig {
  mode: RenderMode;
  resolutionScale: number; // 0.25 to 2
  renderParams: GeneralRenderParams;
  color: ColorConfig;
  background: BackgroundConfig;
  effects: EffectsConfig;
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
