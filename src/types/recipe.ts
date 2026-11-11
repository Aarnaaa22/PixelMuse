import { RenderConfig, AnimationStyle } from './engine';

export type RecipeCategory =
  | 'all'
  | 'ascii'
  | 'matrix-terminal'
  | 'geometric'
  | 'dithering'
  | 'mosaic-pixel'
  | 'abstract'
  | 'animated-bg';

export type RecipeType = 'photo' | 'background' | 'hybrid';

export type MotionFilter = 'all' | 'animated' | 'static';

export type ProceduralBackgroundType =
  | 'tunnel'
  | 'wake'
  | 'wave'
  | 'cube3d'
  | 'globe3d'
  | 'knot3d'
  | 'pyramid3d'
  | 'schlieren'
  | 'reaction-front'
  | 'matrix-stream'
  | 'dither-orb'
  | 'crt-barrel'
  | 'torus-wire'
  | 'flower-polar'
  | 'text-cascade'
  | 'hero-mesh';

export interface AnimationMetadata {
  isAnimated: boolean;
  type: AnimationStyle;
  defaultSpeed: number;
  loop: boolean;
  interactive?: boolean;
}

export interface PreviewConfig {
  samplePhotoId?: 'marble-sculpture' | 'cyberpunk-neon' | 'geometric-architecture';
  targetResolution: { width: number; height: number };
  thumbnailFps?: number;
}

export interface CentralRecipe {
  id: string;
  name: string;
  creator: string;
  creatorUrl?: string;
  description: string;
  category: RecipeCategory;
  tags: string[];
  type: RecipeType;
  renderingModule: string;
  supported: boolean;
  missingFeatureNote?: string;
  defaultConfig: Partial<RenderConfig>;
  supportedParameters: string[];
  animationMetadata: AnimationMetadata;
  previewConfig: PreviewConfig;

  // Compatibility aliases
  config: Partial<RenderConfig>;
  isAnimated: boolean;
  keyParameters: string[];
  proceduralType?: ProceduralBackgroundType;
}

export type CommunityRecipe = CentralRecipe;

export interface RecipeCategoryOption {
  id: RecipeCategory;
  label: string;
}
