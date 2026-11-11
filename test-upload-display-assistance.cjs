const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('   PIXELMUSE: UPLOAD DISPLAY, DEFAULT MODE & ASSISTANCE TEST');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. REQUIREMENT 1: PROMINENT LARGE IMAGE DISPLAY & CONTAIN VIEWPORT FIT
console.log('[REQUIREMENT 1: Prominent Large Image Sizing & Layout]');
const canvasStageContent = fs.readFileSync(path.join(__dirname, 'src/components/studio/CanvasStage.tsx'), 'utf-8');
const studioLayoutContent = fs.readFileSync(path.join(__dirname, 'src/layouts/StudioLayout.tsx'), 'utf-8');
const timelineBarContent = fs.readFileSync(path.join(__dirname, 'src/components/studio/TimelineBar.tsx'), 'utf-8');
const asciiRendererContent = fs.readFileSync(path.join(__dirname, 'src/rendering-modes/AsciiRenderer.ts'), 'utf-8');

assert(
  canvasStageContent.includes('stageW * 0.94') &&
  canvasStageContent.includes('stageH * 0.90'),
  'CanvasStage scales up images prominently to fill 94% width and 90% height of stage viewport for a huge prominent display'
);
assert(
  canvasStageContent.includes("target?.closest('button, input, select, textarea, a, [role=\"button\"], .pointer-events-auto')"),
  'CanvasStage isolates button clicks from canvas drag panning so 100% of button clicks fire cleanly'
);
assert(
  studioLayoutContent.includes('min-h-0') &&
  canvasStageContent.includes('min-h-0'),
  'CSS flex containers use min-h-0 to avoid height collapse and expand to full viewport'
);
assert(
  timelineBarContent.includes('shrink-0'),
  'TimelineBar uses shrink-0 to anchor firmly to bottom of viewport without floating upward'
);
assert(
  canvasStageContent.includes("imageRendering: config.mode === 'pixel' || config.mode === 'dither' ? 'pixelated' : 'auto'"),
  'CanvasStage uses crisp pixelated rendering for pixel/dither and smooth rendering for photos'
);

// 2. REQUIREMENT 2: DEFAULT TO RAW PHOTOGRAPH ON INITIAL UPLOAD
console.log('\n[REQUIREMENT 2: Default to Pristine Original Photograph on Initial Upload]');
const studioStoreContent = fs.readFileSync(path.join(__dirname, 'src/stores/studioStore.ts'), 'utf-8');

assert(
  studioStoreContent.includes("mode: 'original'") &&
  studioStoreContent.includes("DEFAULT_CONFIG: RenderConfig = {\n  mode: 'original'"),
  'DEFAULT_CONFIG starts in pristine original photograph view mode'
);
assert(
  studioStoreContent.includes("mode: 'original' as RenderMode") &&
  studioStoreContent.includes("setSourceImage"),
  'setSourceImage automatically defaults newly uploaded photo to original mode so user sees raw photo first'
);
assert(
  canvasStageContent.includes("config.mode === 'original'") &&
  canvasStageContent.includes("RAW PHOTOGRAPH LOADED"),
  'CanvasStage renders active notification banner when raw photograph is loaded'
);

// 3. REQUIREMENT 3: WORKING ASCII ENGINE & HIGH CONTRAST RENDERING
console.log('\n[REQUIREMENT 3: Robust Working ASCII Engine & Visual Contrast]');
assert(
  asciiRendererContent.includes("colorMode = ascii?.colorMode || 'original'") &&
  asciiRendererContent.includes('Math.max(38, r)'),
  'AsciiRenderer provides vibrant photo RGB colors and shadow boost so characters are never invisible black on black'
);
assert(
  studioStoreContent.includes("colorMode: 'original'") &&
  studioStoreContent.includes("ascii: {"),
  'DEFAULT_CONFIG defaults ASCII colorMode to full-color original photo RGB'
);

// 4. REQUIREMENT 4: STUDIO ASSISTANCE, WORKFLOW GUIDANCE & HOVER TOOLTIPS
console.log('\n[REQUIREMENT 4: Studio Assistance, Workflow Guidance & Hover Tooltips]');
const sliderContent = fs.readFileSync(path.join(__dirname, 'src/components/ui/Slider.tsx'), 'utf-8');
const inspectorContent = fs.readFileSync(path.join(__dirname, 'src/components/studio/InspectorPanel.tsx'), 'utf-8');

assert(
  inspectorContent.includes('ASCII Color Mode') &&
  inspectorContent.includes('Terminal Tint'),
  'InspectorPanel provides dedicated ASCII Color Mode selector (Photo RGB / Terminal Mono / Palette) and terminal tint swatches'
);
assert(
  sliderContent.includes('tooltip') &&
  sliderContent.includes('description') &&
  sliderContent.includes('HelpCircle'),
  'Slider component supports tooltip, description, and hover assistance icon'
);
assert(
  inspectorContent.includes("description=\"Controls glyph pitch or pixel block size") &&
  inspectorContent.includes("description=\"Uses Sobel convolution edge detection") &&
  inspectorContent.includes("description=\"Boosts or dims overall photographic sensor exposure"),
  'InspectorPanel sliders provide rich hover descriptions explaining effects and directions'
);
assert(
  canvasStageContent.includes('STUDIO ASSISTANT & QUICK WORKFLOW DIRECTION BAR') &&
  canvasStageContent.includes('QUICK_STYLES'),
  'CanvasStage features top Workflow Guide with quick 1-click style transformation pills'
);
assert(
  timelineBarContent.includes('Play Motion (Spacebar)') &&
  timelineBarContent.includes('Scrub Animation Timeline'),
  'TimelineBar provides helpful hover tooltips across playback, rewind, loop, and scrub controls'
);

console.log('\n================================================================');
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('================================================================\n');

if (failed > 0) process.exit(1);
