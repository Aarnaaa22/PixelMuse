export type RenderMode = 
  // Character Based
  | 'ascii'
  | 'ripple-ascii'
  | 'virt-ascii'
  | 'city-ascii'
  | 'typo-cascade'
  // Geometric
  | 'mosaic'
  | 'dots'
  | 'crosses'
  | 'cruciform'
  | 'cross-stitch'
  | 'diamonds'
  | 'hexagons'
  | 'triangles'
  | 'rings'
  | 'linocut-rings'
  | 'hearts'
  | 'stars'
  | 'constellation'
  | 'bubbles'
  | 'hatch'
  | 'contour'
  | 'metallic'
  // Pixel Based
  | 'pixel'
  | 'halfblocks'
  | 'braille'
  // Pattern Based
  | 'diagonal-lines'
  | 'lines'
  | 'mixed-patterns'
  | 'voxels'
  | 'lego'
  // CRT & Retro
  | 'crt-phosphor'
  | 'crt-scan'
  | 'dither-flicker'
  // 3D Perspective & Depth
  | 'wireframe-3d'
  | 'wireframe-cube'
  | 'wireframe-globe'
  | 'wireframe-knot'
  | 'wireframe-pyramid'
  | 'wireframe-torus'
  | 'hero-mesh'
  // Wave & Fluids
  | 'wave-surfaces'
  | 'schlieren'
  | 'reaction-diffusion'
  // Procedural Backgrounds & Particles
  | 'tunnel-raymarch'
  | 'particle-wake'
  | 'shimmer-bg'
  | 'dither-orb'
  | 'polar-flower'
  // Special
  | 'matrix-rain'
  | 'hexdump'
  | 'disco'
  | 'original'
  | 'none'
  // Classic / Aliases
  | 'dither'
  | 'pixel-mosaic'
  | 'halftone'
  | 'matrix'
  | 'raw'
  | 'passthrough';

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
  colorDepth: number;
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

export type OverlayBlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'color-dodge'
  | 'difference';

export type BlurType = 'off' | 'gaussian' | 'box' | 'radial' | 'motion';

export interface BlurConfig {
  type: BlurType;
  radius: number;      // 0 to 40 px
  angle: number;       // 0 to 360 deg (for motion blur)
}

export interface ColorConfig {
  brightness: number;   // -50 to 50
  contrast: number;     // -50 to 80
  saturation: number;   // 0 to 3
  grayscale: boolean;
  tintColor: string;
  tintOpacity: number;  // 0 to 1
  blendMode?: OverlayBlendMode;
}

export type BackgroundMode =
  | 'original'
  | 'blurred'
  | 'solid'
  | 'none'
  | 'source-blur'
  | 'transparent'
  | 'grid';

export interface BackgroundConfig {
  mode: BackgroundMode;
  opacity: number;      // 0 to 1
  blur: number;         // 0 to 40 px
  blurType?: BlurType;
  color: string;
}

export interface EffectsConfig {
  bloom: number;                // 0 to 30 px
  vignette: number;             // 0 to 1
  scanlines: number;            // 0 to 1
  filmGrain: number;            // 0 to 1
  chromaticAberration: number;  // 0 to 16 px
  glitch: number;               // 0 to 1
  halftone: number;             // 0 to 1
  pixelation: number;           // 0 to 32 px
  filmDust: number;             // 0 to 1
}

export interface GeneralRenderParams {
  cellSize: number;     // 4 to 64 px
  density: number;      // 0.2 to 2.0
  coverage: number;     // 10 to 100 %
  invert: boolean;
  edgeEmphasis: number; // 0 to 100 %
  charSet: string;      // custom ASCII glyph ramp
}

export type AnimationStyle =
  | 'wave'
  | 'pulse'
  | 'shimmer'
  | 'ripple'
  | 'flicker'
  // Legacy aliases
  | 'none'
  | 'scanline'
  | 'sine-wave'
  | 'glitch'
  | 'matrix-rain';

export interface AnimationMotionConfig {
  animated?: boolean;            // Master animation toggle
  isPlaying: boolean;            // Backward-compatible alias
  animSpeed?: number;            // Speed factor (0.1 to 3)
  speed: number;                 // Backward-compatible alias
  animStyle?: AnimationStyle;    // wave, pulse, shimmer, ripple, flicker
  type: AnimationStyle;          // Backward-compatible alias
  animIntensity?: number;        // Intensity (0 to 1)
  intensity: number;             // Backward-compatible alias
  loop: boolean;
  frequency: number;
  currentTime?: number;          // seconds
  duration?: number;             // seconds
}

export interface LightPoint {
  id: string;
  x: number;          // Normalized 0 to 1
  y: number;          // Normalized 0 to 1
  radius: number;     // Normalized 0 to 1 (or px)
  intensity: number;  // 0 to 1
  color?: string;     // Hex color (e.g. #FFFFFF, #CCFF00)
}

export interface LightingConfig {
  enabled: boolean;
  ambient: number;    // Ambient base illumination (0 to 1)
  lights: LightPoint[];
}

export interface MaskConfig {
  enabled: boolean;
  maskCanvas: HTMLCanvasElement | null;
  maskMetadata?: {
    name: string;
    width: number;
    height: number;
  } | null;
  invert: boolean;
  feather: number;    // Feather blur radius (0 to 40 px)
  opacity: number;    // Reveal opacity (0 to 1)
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
  blur?: BlurConfig;
  background: BackgroundConfig;
  effects: EffectsConfig;
  ascii: AsciiConfig;
  dither: DitherConfig;
  mosaic: MosaicConfig;
  halftone: HalftoneConfig;
  motion: AnimationMotionConfig;
  lighting?: LightingConfig;
  mask?: MaskConfig;
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
