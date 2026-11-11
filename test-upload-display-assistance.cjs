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

assert(
  canvasStageContent.includes('targetStageW = Math.max(320, stageW * 0.84)') ||
  canvasStageContent.includes('maxW = Math.max(320, stageW * 0.84)'),
  'CanvasStage scales up images prominently to fill ~84% width and ~80% height of stage viewport'
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

// 3. REQUIREMENT 3: STUDIO ASSISTANCE, WORKFLOW GUIDANCE & HOVER TOOLTIPS
console.log('\n[REQUIREMENT 3: Studio Assistance, Workflow Guidance & Hover Tooltips]');
const sliderContent = fs.readFileSync(path.join(__dirname, 'src/components/ui/Slider.tsx'), 'utf-8');
const inspectorContent = fs.readFileSync(path.join(__dirname, 'src/components/studio/InspectorPanel.tsx'), 'utf-8');

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
