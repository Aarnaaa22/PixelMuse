import { RenderConfig } from './engine';

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

export interface CommunityRecipe {
  id: string;
  name: string;
  creator: string;
  creatorUrl?: string;
  description: string;
  category: RecipeCategory;
  tags: string[];
  type: RecipeType;
  isAnimated: boolean;
  supported: boolean;
  missingFeatureNote?: string;
  keyParameters: string[];
  config: Partial<RenderConfig>;
  proceduralType?: ProceduralBackgroundType;
}

export interface RecipeCategoryOption {
  id: RecipeCategory;
  label: string;
}
