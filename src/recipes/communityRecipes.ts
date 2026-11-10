import { CommunityRecipe } from '../types/recipe';

/**
 * Complete inventory of 48 community generative ASCII & canvas recipes
 * curated from https://21st.dev/community/ascii.
 */

export const COMMUNITY_RECIPES: CommunityRecipe[] = [
  // 01: Hero ASCII One
  {
    id: 'recipe-01-hero-ascii-one',
    name: 'Hero ASCII One',
    creator: '@larsen66',
    description: 'Rotating 3D character mesh with mouse parallax and perspective distortion matrix.',
    category: 'animated-bg',
    tags: ['3D', 'Wireframe', 'Hero', 'Perspective'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires a real-time 3D rotation projection matrix and Euler vertex transform pipeline (Feature Set A).',
    keyParameters: ['fov', 'speed', 'glyphSet', 'colorMode', 'dpr'],
    proceduralType: 'hero-mesh',
    config: {
      mode: 'matrix-rain',
      renderParams: { cellSize: 10, density: 1.2, coverage: 90, invert: false, edgeEmphasis: 0, charSet: ' .:-=+*#%@' },
      motion: { isPlaying: true, animated: true, speed: 1.2, animSpeed: 1.2, type: 'wave', animStyle: 'wave', intensity: 0.8, animIntensity: 0.8, loop: true, frequency: 1 },
    },
  },

  // 02: Hero ASCII Tunnel
  {
    id: 'recipe-02-hero-ascii-tunnel',
    name: 'Hero ASCII Tunnel',
    creator: '@nikolas-sapa',
    description: 'Concentric glowing ASCII ring loops racing toward viewer with camera pitch tracking.',
    category: 'animated-bg',
    tags: ['Tunnel', 'Raymarch', 'Vector', 'Interactive'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires vanishing-point perspective raymarched tunnel solver and camera pitch tracking (Feature Set B).',
    keyParameters: ['speed', 'ringCount', 'tiltSensitivity', 'glyphDensity'],
    proceduralType: 'tunnel',
    config: {
      mode: 'rings',
      renderParams: { cellSize: 12, density: 1.4, coverage: 100, invert: false, edgeEmphasis: 0.3, charSet: '01#*+:=~-' },
      motion: { isPlaying: true, animated: true, speed: 1.5, animSpeed: 1.5, type: 'pulse', animStyle: 'pulse', intensity: 0.9, animIntensity: 0.9, loop: true, frequency: 2 },
    },
  },

  // 03: Background ASCII Wake
  {
    id: 'recipe-03-bg-ascii-wake',
    name: 'Background ASCII Wake',
    creator: '@nikolas-sapa',
    description: 'Ambient grid of monospace glyphs that energize and scramble near cursor with decay trail.',
    category: 'animated-bg',
    tags: ['Particles', 'Wake', 'Interactive', 'Trail'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires dynamic mouse coordinate particle buffer with exponential decay trail calculation (Feature Set B).',
    keyParameters: ['decayRate', 'radius', 'scrambleEntropy', 'baseOpacity'],
    proceduralType: 'wake',
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 12, density: 1.0, coverage: 85, invert: false, edgeEmphasis: 0, charSet: '.:*+=#%@' },
      motion: { isPlaying: true, animated: true, speed: 1.0, animSpeed: 1.0, type: 'shimmer', animStyle: 'shimmer', intensity: 0.7, animIntensity: 0.7, loop: true, frequency: 1.5 },
    },
  },

  // 04: Hero ASCII Schlieren
  {
    id: 'recipe-04-hero-ascii-schlieren',
    name: 'Hero ASCII Schlieren',
    creator: '@nikolas-sapa',
    description: 'Simulates optical air density gradients and supersonic shockwaves rendered via density characters.',
    category: 'animated-bg',
    tags: ['Physics', 'Shockwave', 'Fluid', 'Optical'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires fluid-dynamics Navier-Stokes velocity vector grid solver (Feature Set C).',
    keyParameters: ['flowVelocity', 'shockIntensity', 'refractionIndex', 'gridStep'],
    proceduralType: 'schlieren',
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 10, density: 1.5, coverage: 95, invert: false, edgeEmphasis: 0.8, charSet: ' .:|/\\#' },
      motion: { isPlaying: true, animated: true, speed: 1.8, animSpeed: 1.8, type: 'wave', animStyle: 'wave', intensity: 0.85, animIntensity: 0.85, loop: true, frequency: 2 },
    },
  },

  // 05: Hero ASCII Reaction Front
  {
    id: 'recipe-05-hero-ascii-reaction-front',
    name: 'Hero ASCII Reaction Front',
    creator: '@nikolas-sapa',
    description: 'Gray-Scott chemical reaction-diffusion waves morphing into organic character bands.',
    category: 'animated-bg',
    tags: ['Reaction-Diffusion', 'Gray-Scott', 'Generative', 'Organic'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires Gray-Scott partial differential equation (PDE) 2-buffer simulation texture solver (Feature Set C).',
    keyParameters: ['feedRate', 'killRate', 'diffusionU', 'diffusionV', 'palette'],
    proceduralType: 'reaction-front',
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 10, density: 1.3, coverage: 90, invert: false, edgeEmphasis: 0.4, charSet: ' -~=+%#@' },
      motion: { isPlaying: true, animated: true, speed: 1.0, animSpeed: 1.0, type: 'ripple', animStyle: 'ripple', intensity: 0.9, animIntensity: 0.9, loop: true, frequency: 1 },
    },
  },

  // 06: ASCII Background
  {
    id: 'recipe-06-ascii-background',
    name: 'ASCII Background',
    creator: '@olaniyanpaul012',
    description: 'Ambient shimmering field of technical glyphs with subtle breathing luminance pulses.',
    category: 'animated-bg',
    tags: ['Ambient', 'Pulse', 'Monospace', 'Minimal'],
    type: 'background',
    isAnimated: true,
    supported: true,
    keyParameters: ['pulseSpeed', 'luminanceAmplitude', 'cellSize', 'invert'],
    proceduralType: 'wake',
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 14, density: 1.0, coverage: 80, invert: false, edgeEmphasis: 0, charSet: ' .:-=+*#' },
      motion: { isPlaying: true, animated: true, speed: 0.8, animSpeed: 0.8, type: 'pulse', animStyle: 'pulse', intensity: 0.6, animIntensity: 0.6, loop: true, frequency: 1.2 },
    },
  },

  // 07: Violet ASCII Wave
  {
    id: 'recipe-07-violet-ascii-wave',
    name: 'Violet ASCII Wave',
    creator: '@violet-lab',
    description: 'Multi-layered 3D sine wave ribbons rolling across viewport in electric purple and violet tones.',
    category: 'animated-bg',
    tags: ['Sinusoidal', 'Violet', 'Ribbons', '3D Wave'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires continuous 3D sine ribbon parametric surface generator (Feature Set A/C).',
    keyParameters: ['frequency', 'waveCount', 'amplitude', 'colorGradient'],
    proceduralType: 'wave',
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 12, density: 1.1, coverage: 85, invert: false, edgeEmphasis: 0.2, charSet: '~-+=*#' },
      color: { brightness: 10, contrast: 25, saturation: 1.4, grayscale: false, tintColor: '#9D4EDD', tintOpacity: 0.8, blendMode: 'screen' },
      motion: { isPlaying: true, animated: true, speed: 1.2, animSpeed: 1.2, type: 'wave', animStyle: 'wave', intensity: 0.9, animIntensity: 0.9, loop: true, frequency: 1.8 },
    },
  },

  // 08: ASCII Globe Spin
  {
    id: 'recipe-08-ascii-globe-spin',
    name: 'ASCII Globe Spin',
    creator: '@nikolas-sapa',
    description: '3D wireframe globe with latitude and longitude rings, day/night terminator line, and drag inertia.',
    category: 'animated-bg',
    tags: ['3D', 'Globe', 'Sphere', 'Orthographic'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires 3D spherical trigonometry projection pipeline with orthographic back-face culling (Feature Set A).',
    keyParameters: ['radius', 'rotationSpeed', 'tiltAngle', 'dragInertia', 'lineDensity'],
    proceduralType: 'globe3d',
    config: {
      mode: 'rings',
      renderParams: { cellSize: 10, density: 1.5, coverage: 95, invert: false, edgeEmphasis: 0.5, charSet: 'o.+*' },
      motion: { isPlaying: true, animated: true, speed: 1.0, animSpeed: 1.0, type: 'pulse', animStyle: 'pulse', intensity: 0.7, animIntensity: 0.7, loop: true, frequency: 1 },
    },
  },

  // 09: ASCII Cube
  {
    id: 'recipe-09-ascii-cube',
    name: 'ASCII Cube',
    creator: '@montekkundan',
    description: 'Rotating 3D wireframe cube with perspective depth and shaded faces composed of character ramps.',
    category: 'geometric',
    tags: ['3D', 'Polyhedral', 'Cube', 'Wireframe'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires 3D vertex transform and polyhedral face rasterization pipeline (Feature Set A).',
    keyParameters: ['size', 'rotSpeedX', 'rotSpeedY', 'perspective', 'edgeGlyphs'],
    proceduralType: 'cube3d',
    config: {
      mode: 'voxels',
      renderParams: { cellSize: 12, density: 1.2, coverage: 100, invert: false, edgeEmphasis: 0.6, charSet: '+-|' },
      motion: { isPlaying: true, animated: true, speed: 1.1, animSpeed: 1.1, type: 'wave', animStyle: 'wave', intensity: 0.75, animIntensity: 0.75, loop: true, frequency: 1.4 },
    },
  },

  // 10: ASCII Knot
  {
    id: 'recipe-10-ascii-knot',
    name: 'ASCII Knot',
    creator: '@montekkundan',
    description: 'Self-intersecting trefoil knot rotating smoothly in space with depth-based character brightness.',
    category: 'geometric',
    tags: ['3D', 'Trefoil', 'Parametric', 'Mathematical'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires parametric space-curve equation generator: x=sin(u)+2sin(2u), y=cos(u)-2cos(2u), z=-sin(3u) (Feature Set A).',
    keyParameters: ['tubeRadius', 'knotScale', 'segments', 'depthShade'],
    proceduralType: 'knot3d',
    config: {
      mode: 'contour',
      renderParams: { cellSize: 10, density: 1.3, coverage: 90, invert: false, edgeEmphasis: 0.7, charSet: '*#@+' },
      motion: { isPlaying: true, animated: true, speed: 1.0, animSpeed: 1.0, type: 'ripple', animStyle: 'ripple', intensity: 0.8, animIntensity: 0.8, loop: true, frequency: 1.2 },
    },
  },

  // 11: ASCII Pyramid
  {
    id: 'recipe-11-ascii-pyramid',
    name: 'ASCII Pyramid',
    creator: '@montekkundan',
    description: 'Four-sided rotating wireframe pyramid with vertex apex tracking and raster scanline fill.',
    category: 'geometric',
    tags: ['3D', 'Pyramid', 'Apex', 'Wireframe'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires 3D wireframe rasterizer with perspective apex projection (Feature Set A).',
    keyParameters: ['height', 'baseWidth', 'rotationSpeed', 'fillDensity'],
    proceduralType: 'pyramid3d',
    config: {
      mode: 'triangles',
      renderParams: { cellSize: 12, density: 1.2, coverage: 95, invert: false, edgeEmphasis: 0.5, charSet: '^/\\' },
      motion: { isPlaying: true, animated: true, speed: 1.2, animSpeed: 1.2, type: 'wave', animStyle: 'wave', intensity: 0.7, animIntensity: 0.7, loop: true, frequency: 1.5 },
    },
  },

  // 12: ASCII Renderer (Torus)
  {
    id: 'recipe-12-ascii-renderer-torus',
    name: 'ASCII Renderer (Torus)',
    creator: '@uicapsule',
    description: 'Three.js WebGL torus knot rasterized directly to a 2D character canvas buffer.',
    category: 'geometric',
    tags: ['WebGL', 'Torus', '3D Mesh', 'Canvas'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires offscreen WebGL-to-Canvas character luminance sampling pipeline (Feature Set A).',
    keyParameters: ['geometry', 'lightingAmbient', 'charRamp', 'renderScale'],
    proceduralType: 'torus-wire',
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 10, density: 1.4, coverage: 95, invert: false, edgeEmphasis: 0.6, charSet: ' .:-=+*#%@' },
      motion: { isPlaying: true, animated: true, speed: 1.0, animSpeed: 1.0, type: 'wave', animStyle: 'wave', intensity: 0.8, animIntensity: 0.8, loop: true, frequency: 1 },
    },
  },

  // 13: ASCII Flower
  {
    id: 'recipe-13-ascii-flower',
    name: 'ASCII Flower',
    creator: 'Chinmoy Das',
    description: 'Polar coordinate floral rose curves r = cos(kθ) modulated by brightness and hue.',
    category: 'abstract',
    tags: ['Polar', 'Floral', 'Mathematical', 'Rose Curve'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires polar coordinate mathematical curve rasterizer: r = cos(k*theta) (Feature Set A).',
    keyParameters: ['petals', 'polarResolution', 'spinSpeed', 'colorTint'],
    proceduralType: 'flower-polar',
    config: {
      mode: 'stars',
      renderParams: { cellSize: 12, density: 1.3, coverage: 85, invert: false, edgeEmphasis: 0.4, charSet: '*~.' },
      color: { brightness: 0, contrast: 20, saturation: 1.3, grayscale: false, tintColor: '#FF473A', tintOpacity: 0.7, blendMode: 'screen' },
      motion: { isPlaying: true, animated: true, speed: 0.7, animSpeed: 0.7, type: 'pulse', animStyle: 'pulse', intensity: 0.65, animIntensity: 0.65, loop: true, frequency: 1 },
    },
  },

  // 14: Text ASCII Cascade
  {
    id: 'recipe-14-text-ascii-cascade',
    name: 'Text ASCII Cascade',
    creator: '@cascade-dev',
    description: 'Editorial headline typography that dissolves into fluttering ASCII noise on hover and snaps back.',
    category: 'ascii',
    tags: ['Typography', 'Dissolve', 'Editorial', 'Interactive'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires DOM text-splitting glyph physics canvas dissipation engine (Feature Set B).',
    keyParameters: ['dissolveDuration', 'glyphEntropy', 'triggerThreshold'],
    proceduralType: 'text-cascade',
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 12, density: 1.2, coverage: 90, invert: false, edgeEmphasis: 0.5, charSet: '#%*+=:-.' },
      motion: { isPlaying: true, animated: true, speed: 1.4, animSpeed: 1.4, type: 'flicker', animStyle: 'flicker', intensity: 0.8, animIntensity: 0.8, loop: true, frequency: 2 },
    },
  },

  // 15: dither
  {
    id: 'recipe-15-dither',
    name: 'dither',
    creator: '@dborg741',
    description: 'Classic retro Mac 1-bit dithering paired with sparse character accents in shadowed regions.',
    category: 'dithering',
    tags: ['1-Bit', 'Macintosh', 'Error Diffusion', 'Retro'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['algorithm', 'threshold', 'cellSize', 'contrastBoost'],
    config: {
      mode: 'dither',
      renderParams: { cellSize: 6, density: 1.2, coverage: 100, invert: false, edgeEmphasis: 0.4, charSet: ' .:-=+*#%@' },
      dither: { algorithm: 'atkinson', scale: 2, threshold: 0.5, colorDepth: 2, paletteId: 'noir-monochrome', serpentine: true },
      color: { brightness: 0, contrast: 35, saturation: 0, grayscale: true, tintColor: '#FFFFFF', tintOpacity: 0, blendMode: 'normal' },
    },
  },

  // 16: 11
  {
    id: 'recipe-16-11-flicker',
    name: '11',
    creator: '@darkapoparka1',
    description: 'High-frequency chromatic flicker layered on top of ordered dithered character cells.',
    category: 'dithering',
    tags: ['Flicker', 'Chroma', 'Kinetic', 'Dither Hybrid'],
    type: 'photo',
    isAnimated: true,
    supported: true,
    keyParameters: ['flickerHz', 'noiseThreshold', 'animIntensity', 'ditherAlgo'],
    config: {
      mode: 'dither',
      renderParams: { cellSize: 8, density: 1.1, coverage: 95, invert: false, edgeEmphasis: 0.3, charSet: '01' },
      dither: { algorithm: 'bayer-8x8', scale: 2, threshold: 0.45, colorDepth: 4, paletteId: 'cyberpunk-editorial', serpentine: true },
      motion: { isPlaying: true, animated: true, speed: 2.2, animSpeed: 2.2, type: 'flicker', animStyle: 'flicker', intensity: 0.9, animIntensity: 0.9, loop: true, frequency: 3 },
      effects: { glitch: 0.35, chromaticAberration: 0.4, bloom: 0.2, vignette: 0.3, scanlines: 0.4, filmGrain: 0.2, halftone: 0, pixelation: 0, filmDust: 0 },
    },
  },

  // 17: ı ASCII
  {
    id: 'recipe-17-dotless-i-ascii',
    name: 'ı ASCII',
    creator: 'Poyraz Şahin',
    description: 'Concentric circular displacement ripples distorting an underlying photographic ASCII field.',
    category: 'ascii',
    tags: ['Ripple', 'Displacement', 'Kinetic', 'Linguistic'],
    type: 'photo',
    isAnimated: true,
    supported: true,
    keyParameters: ['rippleSpeed', 'wavelength', 'waveAmplitude', 'charSet'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 10, density: 1.2, coverage: 90, invert: false, edgeEmphasis: 0.2, charSet: ' ı.:|!#' },
      motion: { isPlaying: true, animated: true, speed: 1.3, animSpeed: 1.3, type: 'ripple', animStyle: 'ripple', intensity: 0.85, animIntensity: 0.85, loop: true, frequency: 1.8 },
    },
  },

  // 18: AURA
  {
    id: 'recipe-18-aura',
    name: 'AURA',
    creator: 'Nacho',
    description: 'Luminous Gaussian glow around subject contours with high-contrast character fill in shadows.',
    category: 'abstract',
    tags: ['Bloom', 'Aura', 'Ethereal', 'Glow'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['bloomRadius', 'glowColor', 'lumaThreshold', 'edgeSoftness'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 12, density: 1.3, coverage: 95, invert: false, edgeEmphasis: 0.7, charSet: ' .·+*#@' },
      effects: { bloom: 0.75, vignette: 0.45, scanlines: 0, filmGrain: 0.15, chromaticAberration: 0.3, glitch: 0, halftone: 0, pixelation: 0, filmDust: 0 },
      color: { brightness: 15, contrast: 25, saturation: 1.3, grayscale: false, tintColor: '#CCFF00', tintOpacity: 0.45, blendMode: 'screen' },
    },
  },

  // 19: earth
  {
    id: 'recipe-19-earth',
    name: 'earth',
    creator: 'Camille Pelisson',
    description: 'Earthy sepia and moss-green palettes mapped to dense linguistic characters with zero background fill.',
    category: 'ascii',
    tags: ['Earthy', 'Organic', 'Moss', 'Botanical'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['palette', 'density', 'invert', 'saturation'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 10, density: 1.4, coverage: 100, invert: false, edgeEmphasis: 0.3, charSet: ' .~+oO#@' },
      color: { brightness: -5, contrast: 30, saturation: 1.2, grayscale: false, tintColor: '#4ADE80', tintOpacity: 0.6, blendMode: 'color-dodge' },
    },
  },

  // 20: HandArt
  {
    id: 'recipe-20-handart',
    name: 'HandArt',
    creator: 'Camille Pelisson',
    description: 'High-pass Sobel edge extraction with delicate cross-hatch stippling emphasizing hand and gesture lines.',
    category: 'geometric',
    tags: ['Edge', 'Sobel', 'Hatch', 'Minimalist'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['edgeEmphasis', 'charSet', 'invert', 'contrast'],
    config: {
      mode: 'hatch',
      renderParams: { cellSize: 10, density: 1.3, coverage: 95, invert: true, edgeEmphasis: 0.9, charSet: '/\\|X' },
      color: { brightness: 10, contrast: 40, saturation: 0, grayscale: true, tintColor: '#FAFAFA', tintOpacity: 0, blendMode: 'normal' },
    },
  },

  // 21: virt
  {
    id: 'recipe-21-virt',
    name: 'virt',
    creator: 'Rah',
    description: 'Sparse character selection with wide letter spacing and high shadow cutoffs for a sleek obsidian look.',
    category: 'matrix-terminal',
    tags: ['Obsidian', 'Minimal', 'Terminal', 'Monolith'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['cellSize', 'coverage', 'charSet', 'contrast'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 16, density: 0.8, coverage: 65, invert: false, edgeEmphasis: 0.1, charSet: ' .:-=+*#%@' },
      color: { brightness: -10, contrast: 45, saturation: 0, grayscale: true, tintColor: '#FFFFFF', tintOpacity: 0, blendMode: 'normal' },
    },
  },

  // 22: virt (Raw Inverted)
  {
    id: 'recipe-22-virt-raw',
    name: 'virt (Raw Inverted)',
    creator: 'OC',
    description: 'High-brightness inverted mapping using dense brackets []{}() on solid obsidian backgrounds.',
    category: 'matrix-terminal',
    tags: ['Brackets', 'Code', 'Raw', 'Inverted'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['invert', 'density', 'charSet', 'contrast'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 11, density: 1.4, coverage: 95, invert: true, edgeEmphasis: 0.4, charSet: '[]{}/\\|()' },
      color: { brightness: 15, contrast: 35, saturation: 0, grayscale: true, tintColor: '#CCFF00', tintOpacity: 0.5, blendMode: 'screen' },
    },
  },

  // 23: Hehe
  {
    id: 'recipe-23-hehe',
    name: 'Hehe',
    creator: 'Rah',
    description: 'Micro-typography with sudden horizontal scanline slice shifts and chromatic aberration glitches.',
    category: 'abstract',
    tags: ['Glitch', 'Aberration', 'Slice', 'Kinetic'],
    type: 'photo',
    isAnimated: true,
    supported: true,
    keyParameters: ['glitchIntensity', 'sliceHeight', 'colorShift', 'animSpeed'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 8, density: 1.3, coverage: 90, invert: false, edgeEmphasis: 0.5, charSet: ' .:~=!*#' },
      effects: { glitch: 0.65, chromaticAberration: 0.6, scanlines: 0.5, filmGrain: 0.3, bloom: 0.2, vignette: 0.3, halftone: 0, pixelation: 0, filmDust: 0 },
      motion: { isPlaying: true, animated: true, speed: 1.8, animSpeed: 1.8, type: 'flicker', animStyle: 'flicker', intensity: 0.9, animIntensity: 0.9, loop: true, frequency: 2.5 },
    },
  },

  // 24: ORAN G
  {
    id: 'recipe-24-oran-g',
    name: 'ORAN G',
    creator: 'Marcelo Luzetti (@mluzetti11)',
    description: 'Intense signal orange and coral duotone with thresholded block glyphs and sharp black shadows.',
    category: 'abstract',
    tags: ['Coral', 'Duotone', 'High-Contrast', 'Brutalist'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['tintColor', 'tintOpacity', 'contrast', 'coverage'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 10, density: 1.5, coverage: 100, invert: false, edgeEmphasis: 0.6, charSet: ' ._:=+*#%@' },
      color: { brightness: 5, contrast: 45, saturation: 1.6, grayscale: false, tintColor: '#FF473A', tintOpacity: 0.85, blendMode: 'normal' },
      background: { mode: 'solid', opacity: 1, blur: 0, blurType: 'gaussian', color: '#08080A' },
    },
  },

  // 25: ASCII Cruex
  {
    id: 'recipe-25-ascii-cruex',
    name: 'ASCII Cruex',
    creator: '@cruex-dev',
    description: 'Replaces luminance values with geometric crosses and intersection anchors scaled by brightness.',
    category: 'geometric',
    tags: ['Crosses', 'Cruciform', 'Grid', 'Anchors'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['cellSize', 'coverage', 'thickness', 'invert'],
    config: {
      mode: 'crosses',
      renderParams: { cellSize: 14, density: 1.2, coverage: 100, invert: false, edgeEmphasis: 0.3, charSet: '+' },
      color: { brightness: 0, contrast: 25, saturation: 1.2, grayscale: false, tintColor: '#CCFF00', tintOpacity: 0.7, blendMode: 'normal' },
    },
  },

  // 26: City
  {
    id: 'recipe-26-city',
    name: 'City',
    creator: '@urban-coder',
    description: 'Slices luminance into distinct atmospheric elevation bands, mimicking city skyline elevation.',
    category: 'ascii',
    tags: ['Skyline', 'Elevation', 'Atmospheric', 'Urban'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['contrast', 'bandCount', 'charRamp', 'vignette'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 10, density: 1.3, coverage: 95, invert: false, edgeEmphasis: 0.4, charSet: ' _-+=#|[]' },
      effects: { vignette: 0.6, filmGrain: 0.25, scanlines: 0.2, bloom: 0.1, chromaticAberration: 0, glitch: 0, halftone: 0, pixelation: 0, filmDust: 0 },
      color: { brightness: -5, contrast: 30, saturation: 0.8, grayscale: false, tintColor: '#38BDF8', tintOpacity: 0.5, blendMode: 'screen' },
    },
  },

  // 27: Matrix
  {
    id: 'recipe-27-matrix',
    name: 'Matrix',
    creator: '@neotokyo',
    description: 'Streaming green Katakana and alphanumeric columns falling down canvas modulated by image luminance.',
    category: 'matrix-terminal',
    tags: ['Cyber', 'Digital Rain', 'Katakana', 'Phosphor'],
    type: 'photo',
    isAnimated: true,
    supported: true,
    keyParameters: ['animSpeed', 'columnDensity', 'fadeTail', 'charSet'],
    config: {
      mode: 'matrix-rain',
      renderParams: { cellSize: 12, density: 1.3, coverage: 90, invert: false, edgeEmphasis: 0.3, charSet: '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻ' },
      color: { brightness: 10, contrast: 30, saturation: 1.5, grayscale: false, tintColor: '#22C55E', tintOpacity: 0.9, blendMode: 'screen' },
      motion: { isPlaying: true, animated: true, speed: 1.4, animSpeed: 1.4, type: 'wave', animStyle: 'wave', intensity: 0.8, animIntensity: 0.8, loop: true, frequency: 1.5 },
    },
  },

  // 28: Metallic
  {
    id: 'recipe-28-metallic',
    name: 'Metallic',
    creator: '@chroma-lab',
    description: 'Metallic chrome reflection gradient applied to high-contrast edges and specular highlights.',
    category: 'abstract',
    tags: ['Chrome', 'Specular', 'Metallic', 'Liquid Silver'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['edgeEmphasis', 'specularBoost', 'palette', 'contrast'],
    config: {
      mode: 'contour',
      renderParams: { cellSize: 8, density: 1.4, coverage: 100, invert: false, edgeEmphasis: 0.95, charSet: ' -=+*#' },
      effects: { bloom: 0.55, chromaticAberration: 0.3, filmGrain: 0.2, vignette: 0.3, scanlines: 0, glitch: 0, halftone: 0, pixelation: 0, filmDust: 0 },
      color: { brightness: 10, contrast: 45, saturation: 0, grayscale: true, tintColor: '#FFFFFF', tintOpacity: 0, blendMode: 'normal' },
    },
  },

  // 29: oVONE
  {
    id: 'recipe-29-ovone',
    name: 'oVONE',
    creator: '@ovone-art',
    description: 'Concentric dot grid halftones with radius modulated by Rec.709 perceived brightness.',
    category: 'mosaic-pixel',
    tags: ['Dots', 'Halftone', 'Rec.709', 'Perceptual'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['cellSize', 'coverage', 'density', 'invert'],
    config: {
      mode: 'dots',
      renderParams: { cellSize: 12, density: 1.3, coverage: 95, invert: false, edgeEmphasis: 0.2, charSet: '·' },
      color: { brightness: 0, contrast: 25, saturation: 1.2, grayscale: false, tintColor: '#CCFF00', tintOpacity: 0.8, blendMode: 'normal' },
    },
  },

  // 30: r ASCII
  {
    id: 'recipe-30-r-ascii',
    name: 'r ASCII',
    creator: '@silver95',
    description: 'Ultra-fine 4px micro-cells with high-density characters creating near-photorealistic halftone illusion.',
    category: 'ascii',
    tags: ['Micro', 'Ultra-Fine', 'High-Density', 'Photoreal'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['cellSize=4', 'density=1.8', 'contrast=1.2'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 5, density: 1.6, coverage: 100, invert: false, edgeEmphasis: 0.4, charSet: ' .:-=+*#%@' },
      color: { brightness: 5, contrast: 30, saturation: 1.1, grayscale: false, tintColor: '#FAFAFA', tintOpacity: 0.2, blendMode: 'normal' },
    },
  },

  // 31: a ASCII
  {
    id: 'recipe-31-a-ascii',
    name: 'a ASCII',
    creator: '@duuuk',
    description: 'Restricts character set strictly to punctuation marks (. : * + #), producing airy open compositions.',
    category: 'ascii',
    tags: ['Punctuation', 'Airy', 'Minimalist', 'Open Grid'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['charSet', 'coverage', 'cellSize'],
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 14, density: 0.9, coverage: 65, invert: false, edgeEmphasis: 0, charSet: ' .:+*#' },
      color: { brightness: 0, contrast: 20, saturation: 0.9, grayscale: false, tintColor: '#E2E8F0', tintOpacity: 0.4, blendMode: 'normal' },
    },
  },

  // 32: Dither Image / Portrait
  {
    id: 'recipe-32-dither-portrait',
    name: 'Dither Image / Portrait',
    creator: '@pixel-foundry',
    description: 'Classic Floyd-Steinberg spatial error diffusion preserving fine photographic portrait gradients.',
    category: 'dithering',
    tags: ['Floyd-Steinberg', 'Portrait', 'Error Diffusion', 'Gradients'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['algorithm', 'diffusionWeight', 'contrast'],
    config: {
      mode: 'dither',
      renderParams: { cellSize: 4, density: 1.0, coverage: 100, invert: false, edgeEmphasis: 0, charSet: '01' },
      dither: { algorithm: 'floyd-steinberg', scale: 2, threshold: 0.5, colorDepth: 4, paletteId: 'noir-monochrome', serpentine: true },
      color: { brightness: 0, contrast: 30, saturation: 0, grayscale: true, tintColor: '#FFFFFF', tintOpacity: 0, blendMode: 'normal' },
    },
  },

  // 33: Dither Orb
  {
    id: 'recipe-33-dither-orb',
    name: 'Dither Orb',
    creator: '@audio-visual',
    description: 'Volumetric voice orb oscillating with Perlin noise, shaded with blue noise ordered dithering.',
    category: 'dithering',
    tags: ['Blue Noise', 'Perlin', 'Orb', 'Volumetric'],
    type: 'background',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires 3D procedural sphere noise deformation mesh with blue noise texture sampling (Feature Set A).',
    keyParameters: ['noiseScale', 'pulseSpeed', 'ditherMatrix', 'radius'],
    proceduralType: 'dither-orb',
    config: {
      mode: 'dither',
      renderParams: { cellSize: 8, density: 1.2, coverage: 90, invert: false, edgeEmphasis: 0.4, charSet: '#.' },
      motion: { isPlaying: true, animated: true, speed: 1.2, animSpeed: 1.2, type: 'pulse', animStyle: 'pulse', intensity: 0.8, animIntensity: 0.8, loop: true, frequency: 1.6 },
    },
  },

  // 34: Ordered Dither Shader
  {
    id: 'recipe-34-ordered-dither-shader',
    name: 'Ordered Dither Shader',
    creator: '@framecn',
    description: 'Matrix-based cross-hatch dithering with zero error bleed, creating sharp arcade-cabinet rasterization.',
    category: 'dithering',
    tags: ['Bayer 8x8', 'Arcade', 'Matrix', 'Retro Shading'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['algorithm', 'thresholdScale', 'palette'],
    config: {
      mode: 'dither',
      renderParams: { cellSize: 6, density: 1.2, coverage: 100, invert: false, edgeEmphasis: 0.3, charSet: '01' },
      dither: { algorithm: 'bayer-8x8', scale: 2, threshold: 0.5, colorDepth: 4, paletteId: 'cyberpunk-editorial', serpentine: true },
      color: { brightness: 5, contrast: 25, saturation: 1.2, grayscale: false, tintColor: '#CCFF00', tintOpacity: 0.5, blendMode: 'normal' },
    },
  },

  // 35: Retro CRT 404
  {
    id: 'recipe-35-retro-crt-404',
    name: 'Retro CRT 404',
    creator: '@crt-lab',
    description: 'Curved screen distortion, phosphor trails, horizontal scanlines, and RGB shadow mask rasterization.',
    category: 'matrix-terminal',
    tags: ['CRT', 'Phosphor', 'Scanlines', 'Curvature'],
    type: 'hybrid',
    isAnimated: true,
    supported: false,
    missingFeatureNote: 'Requires non-linear screen barrel distortion [x\', y\'] = f(x,y) fisheye warp (Feature Set D).',
    keyParameters: ['scanlineIntensity', 'curvature', 'chromaShift', 'flicker'],
    proceduralType: 'crt-barrel',
    config: {
      mode: 'ascii',
      renderParams: { cellSize: 10, density: 1.1, coverage: 90, invert: false, edgeEmphasis: 0.4, charSet: '01.:#@' },
      effects: { scanlines: 0.85, chromaticAberration: 0.7, filmGrain: 0.4, bloom: 0.5, vignette: 0.7, glitch: 0.2, halftone: 0, pixelation: 0, filmDust: 0 },
      color: { brightness: 10, contrast: 35, saturation: 1.4, grayscale: false, tintColor: '#22C55E', tintOpacity: 0.85, blendMode: 'screen' },
      motion: { isPlaying: true, animated: true, speed: 1.5, animSpeed: 1.5, type: 'flicker', animStyle: 'flicker', intensity: 0.6, animIntensity: 0.6, loop: true, frequency: 2 },
    },
  },

  // 36: Vaporwave Portrait
  {
    id: 'recipe-36-vaporwave-portrait',
    name: 'Vaporwave Portrait',
    creator: '@aesthetics90',
    description: 'Electric pink and neon cyan gradient mapping over ordered halftone raster.',
    category: 'dithering',
    tags: ['Vaporwave', 'Neon Pink', 'Cyan', 'Halftone'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['palette', 'halftone', 'vignette'],
    config: {
      mode: 'halftone',
      renderParams: { cellSize: 10, density: 1.2, coverage: 95, invert: false, edgeEmphasis: 0.2, charSet: '·' },
      color: { brightness: 10, contrast: 30, saturation: 1.8, grayscale: false, tintColor: '#EC4899', tintOpacity: 0.75, blendMode: 'screen' },
      effects: { bloom: 0.4, vignette: 0.4, filmGrain: 0.2, scanlines: 0.2, chromaticAberration: 0.3, glitch: 0, halftone: 0, pixelation: 0, filmDust: 0 },
    },
  },

  // 37: hi
  {
    id: 'recipe-37-hi-microgrid',
    name: 'hi',
    creator: '@dots-lab',
    description: 'Alternates between tiny dots and crosshair glyphs depending on local gradient orientation.',
    category: 'geometric',
    tags: ['Micro-Grid', 'Crosshair', 'Gradient', 'Orientation'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['cellSize', 'density', 'orientationSens', 'invert'],
    config: {
      mode: 'mixed-patterns',
      renderParams: { cellSize: 10, density: 1.3, coverage: 95, invert: false, edgeEmphasis: 0.5, charSet: '+·' },
      color: { brightness: 0, contrast: 25, saturation: 1.0, grayscale: false, tintColor: '#CCFF00', tintOpacity: 0.6, blendMode: 'normal' },
    },
  },

  // 38: Braille Micro-Art
  {
    id: 'recipe-38-braille-micro-art',
    name: 'Braille Micro-Art',
    creator: '@unicode-art',
    description: 'Uses 8-dot Unicode Braille characters (U+2800..U+28FF) as high-density sub-pixel binary cells.',
    category: 'mosaic-pixel',
    tags: ['Braille', 'Unicode', 'Sub-Pixel', 'Binary Matrix'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['threshold', 'invert', 'cellSize'],
    config: {
      mode: 'braille',
      renderParams: { cellSize: 8, density: 1.4, coverage: 100, invert: false, edgeEmphasis: 0.3, charSet: '⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏' },
      color: { brightness: 0, contrast: 30, saturation: 1.1, grayscale: false, tintColor: '#F4F4F6', tintOpacity: 0.3, blendMode: 'normal' },
    },
  },

  // 39: Halfblock Chunky
  {
    id: 'recipe-39-halfblock-chunky',
    name: 'Halfblock Chunky',
    creator: '@retro-blocks',
    description: 'Uses upper and lower half block glyphs (▀, ▄, █) with independent foreground/background colors.',
    category: 'mosaic-pixel',
    tags: ['Halfblock', 'ANSI', 'BBS', 'Chunky Pixel'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['cellSize', 'density', 'colorMode'],
    config: {
      mode: 'halfblocks',
      renderParams: { cellSize: 12, density: 1.2, coverage: 100, invert: false, edgeEmphasis: 0.2, charSet: '▀▄█' },
      color: { brightness: 5, contrast: 25, saturation: 1.3, grayscale: false, tintColor: '#CCFF00', tintOpacity: 0.5, blendMode: 'normal' },
    },
  },

  // 40: Hexadecimal Byte Dump
  {
    id: 'recipe-40-hex-byte-dump',
    name: 'Hexadecimal Byte Dump',
    creator: '@binary-craft',
    description: 'Formats sampled luminance into two-digit hexadecimal byte stream (00 to FF) with offset gutters.',
    category: 'matrix-terminal',
    tags: ['Hex', 'Byte Dump', 'Memory Inspector', 'Binary'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['cellSize', 'columnCount', 'showOffsets', 'colorTint'],
    config: {
      mode: 'hexdump',
      renderParams: { cellSize: 14, density: 1.1, coverage: 100, invert: false, edgeEmphasis: 0, charSet: '0123456789ABCDEF' },
      color: { brightness: 0, contrast: 20, saturation: 0, grayscale: true, tintColor: '#22C55E', tintOpacity: 0.7, blendMode: 'screen' },
    },
  },

  // 41: Iso-Contour Topography
  {
    id: 'recipe-41-iso-contour-topography',
    name: 'Iso-Contour Topography',
    creator: '@geodetic',
    description: 'Draws marching-squares contour elevation bands based on image gradient levels.',
    category: 'geometric',
    tags: ['Contour', 'Topography', 'Marching Squares', 'Cartographic'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['bandInterval', 'lineThickness', 'edgeSmoothness'],
    config: {
      mode: 'contour',
      renderParams: { cellSize: 10, density: 1.4, coverage: 95, invert: false, edgeEmphasis: 0.85, charSet: ' -=' },
      color: { brightness: 0, contrast: 35, saturation: 1.2, grayscale: false, tintColor: '#F59E0B', tintOpacity: 0.65, blendMode: 'screen' },
    },
  },

  // 42: Linocut Rings
  {
    id: 'recipe-42-linocut-rings',
    name: 'Linocut Rings',
    creator: '@print-press',
    description: 'Concentric woodblock print rings with variable stroke width modulated by local density.',
    category: 'geometric',
    tags: ['Linocut', 'Printmaking', 'Rings', 'Woodblock'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['ringSpacing', 'strokeScale', 'coverage'],
    config: {
      mode: 'rings',
      renderParams: { cellSize: 14, density: 1.3, coverage: 90, invert: false, edgeEmphasis: 0.4, charSet: 'oO' },
      color: { brightness: 0, contrast: 40, saturation: 0, grayscale: true, tintColor: '#FAFAFA', tintOpacity: 0, blendMode: 'normal' },
    },
  },

  // 43: Plastic Stud Bricks
  {
    id: 'recipe-43-plastic-stud-bricks',
    name: 'Plastic Stud Bricks',
    creator: '@toy-box',
    description: 'Rasterizes photo into modular plastic construction bricks with top cylindrical studs and bevel shadows.',
    category: 'mosaic-pixel',
    tags: ['Lego', 'Bricks', 'Modular', 'Toy Plastic'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['studRadius', 'blockBevel', 'dropShadow', 'palette'],
    config: {
      mode: 'lego',
      renderParams: { cellSize: 16, density: 1.0, coverage: 100, invert: false, edgeEmphasis: 0.2, charSet: 'o' },
      color: { brightness: 10, contrast: 30, saturation: 1.5, grayscale: false, tintColor: '#EF4444', tintOpacity: 0.4, blendMode: 'normal' },
    },
  },

  // 44: Isometric Voxels
  {
    id: 'recipe-44-isometric-voxels',
    name: 'Isometric Voxels',
    creator: '@3d-voxel',
    description: 'Slices image into isometric voxel blocks with highlighted top face and directional shadow walls.',
    category: 'mosaic-pixel',
    tags: ['Voxels', 'Isometric', '3D Blocks', 'Cast Shadows'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['voxelSize', 'lightAngle', 'shadowDepth'],
    config: {
      mode: 'voxels',
      renderParams: { cellSize: 16, density: 1.1, coverage: 100, invert: false, edgeEmphasis: 0.5, charSet: '[]' },
      color: { brightness: 5, contrast: 25, saturation: 1.3, grayscale: false, tintColor: '#9D4EDD', tintOpacity: 0.5, blendMode: 'normal' },
    },
  },

  // 45: Cross-Stitch Hatch
  {
    id: 'recipe-45-cross-stitch-hatch',
    name: 'Cross-Stitch Hatch',
    creator: '@needlecraft',
    description: 'Interlocking 45-degree diagonal hatched pencil lines with stroke thickness governed by darkness.',
    category: 'geometric',
    tags: ['Hatch', 'Pencil', 'Cross-Stitch', 'Crosshatch'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['hatchAngle', 'lineSpacing', 'density'],
    config: {
      mode: 'hatch',
      renderParams: { cellSize: 10, density: 1.4, coverage: 100, invert: false, edgeEmphasis: 0.6, charSet: '/\\' },
      color: { brightness: 0, contrast: 30, saturation: 0, grayscale: true, tintColor: '#FAFAFA', tintOpacity: 0, blendMode: 'normal' },
    },
  },

  // 46: Disco Dancefloor
  {
    id: 'recipe-46-disco-dancefloor',
    name: 'Disco Dancefloor',
    creator: '@club-synth',
    description: 'Modulated disco grid tiles with pulsing geometric centers and cycling neon RGB hues.',
    category: 'mosaic-pixel',
    tags: ['Disco', 'Audio', 'RGB Cycle', 'Dancefloor'],
    type: 'photo',
    isAnimated: true,
    supported: true,
    keyParameters: ['animSpeed', 'pulseIntensity', 'glowRadius'],
    config: {
      mode: 'disco',
      renderParams: { cellSize: 16, density: 1.2, coverage: 100, invert: false, edgeEmphasis: 0.3, charSet: '■' },
      motion: { isPlaying: true, animated: true, speed: 1.6, animSpeed: 1.6, type: 'pulse', animStyle: 'pulse', intensity: 0.9, animIntensity: 0.9, loop: true, frequency: 2 },
      effects: { bloom: 0.45, scanlines: 0.25, chromaticAberration: 0.4, glitch: 0.1, vignette: 0.3, filmGrain: 0.1, halftone: 0, pixelation: 0, filmDust: 0 },
    },
  },

  // 47: Heart Pixel Stipple
  {
    id: 'recipe-47-heart-pixel-stipple',
    name: 'Heart Pixel Stipple',
    creator: '@kawaii-art',
    description: 'Maps local brightness to proportional heart vector polygons with coverage scaling.',
    category: 'geometric',
    tags: ['Hearts', 'Romance', 'Polygons', 'Vector Stipple'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['coverage', 'cellSize', 'invert'],
    config: {
      mode: 'hearts',
      renderParams: { cellSize: 14, density: 1.2, coverage: 95, invert: false, edgeEmphasis: 0.2, charSet: '♥' },
      color: { brightness: 10, contrast: 30, saturation: 1.5, grayscale: false, tintColor: '#F43F5E', tintOpacity: 0.75, blendMode: 'normal' },
    },
  },

  // 48: Star Halftone Constellation
  {
    id: 'recipe-48-star-halftone-constellation',
    name: 'Star Halftone Constellation',
    creator: '@astral-mesh',
    description: 'Four-pointed star polygons with luminance-modulated aperture and diamond ray extensions.',
    category: 'geometric',
    tags: ['Stars', 'Constellation', 'Halftone', 'Astral'],
    type: 'photo',
    isAnimated: false,
    supported: true,
    keyParameters: ['rayCount', 'coverage', 'density', 'invert'],
    config: {
      mode: 'stars',
      renderParams: { cellSize: 14, density: 1.3, coverage: 95, invert: false, edgeEmphasis: 0.4, charSet: '✦' },
      color: { brightness: 10, contrast: 35, saturation: 1.3, grayscale: false, tintColor: '#CCFF00', tintOpacity: 0.8, blendMode: 'screen' },
      effects: { bloom: 0.5, vignette: 0.4, filmGrain: 0.2, scanlines: 0, chromaticAberration: 0.2, glitch: 0, halftone: 0, pixelation: 0, filmDust: 0 },
    },
  },
];
