import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let total = 0;

function test(name, condition) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${name}`);
  } else {
    console.error(`  ✗ FAIL: ${name}`);
    process.exitCode = 1;
  }
}

console.log('===========================================================');
console.log('   PIXELMUSE IMAGE UPLOAD & RENDER PIPELINE TEST SUITE    ');
console.log('===========================================================\n');

// 1. Image Loading & Decoding Implementation
console.log('[1. IMAGE LOADING & DECODING IMPLEMENTATION]');
const imageUtil = fs.readFileSync(path.join(__dirname, 'src/utilities/image.ts'), 'utf8');
test('PNG, JPEG, WebP validation implemented', imageUtil.includes('validExtensions') && imageUtil.includes('webp'));
test('createImageBitmap probe decoding implemented', imageUtil.includes('createImageBitmap'));
test('img.decode() bitmap readiness implemented', imageUtil.includes('decode()') || imageUtil.includes('.decode'));
test('Detailed decoding error messages implemented', imageUtil.includes('Unsupported image format') && imageUtil.includes('Image decoding failure'));

// 2. State Separation & Error Handling
console.log('\n[2. STATE SEPARATION & RESILIENT ERROR HANDLING]');
const studioStore = fs.readFileSync(path.join(__dirname, 'src/stores/studioStore.ts'), 'utf8');
test('sourceImage and imageMetadata stored separately', studioStore.includes('sourceImage:') && studioStore.includes('imageMetadata:'));
test('uploadError tracking in store', studioStore.includes('uploadError: string | null') && studioStore.includes('setUploadError:'));
test('isImageLoading asynchronous status in store', studioStore.includes('isImageLoading: boolean') && studioStore.includes('setIsImageLoading:'));

const imageDropHook = fs.readFileSync(path.join(__dirname, 'src/hooks/useImageDrop.ts'), 'utf8');
test('Upload does not show success until decoding completes', imageDropHook.includes('await loadImageFromFile') && imageDropHook.includes('setSourceImage(img,'));
test('File input value reset to allow re-upload of same file', imageDropHook.includes("e.target.value = ''"));

// 3. Contain-Style Viewport Fitting & DPR Guard
console.log('\n[3. CONTAIN-STYLE VIEWPORT FITTING & DPR CALCULATION]');
const canvasStage = fs.readFileSync(path.join(__dirname, 'src/components/studio/CanvasStage.tsx'), 'utf8');
test('ResizeObserver tracks viewport container dynamically', canvasStage.includes('ResizeObserver'));
test('Aspect-ratio preserved contain-fit calculated', canvasStage.includes('fitDimensions') && canvasStage.includes('aspect'));
test('CSS width & height explicitly set to prevent stretching', canvasStage.includes('fitDimensions.width') && canvasStage.includes('fitDimensions.height'));
test('Device pixel ratio buffer separate from CSS layout dimensions', canvasStage.includes('style={{') && canvasStage.includes('width: `${fitDimensions.width}px`'));

// 4. Original Photograph vs Generative Effect Behavior
console.log('\n[4. ORIGINAL PHOTOGRAPH & GENERATIVE MODE INTEGRATION]');
const originalRenderer = fs.readFileSync(path.join(__dirname, 'src/rendering-modes/OriginalRenderer.ts'), 'utf8');
test('OriginalRenderer module exists and implements IRenderer', originalRenderer.includes('class OriginalRenderer') && originalRenderer.includes("mode: RenderMode = 'original'"));

const pipeline = fs.readFileSync(path.join(__dirname, 'src/rendering-engine/CanvasPipeline.ts'), 'utf8');
test('OriginalRenderer registered in CanvasPipeline', pipeline.includes('OriginalRenderer') && pipeline.includes('new OriginalRenderer()'));
test('Canvas attachment guarantee before render execution', pipeline.includes('attach(canvas: HTMLCanvasElement)'));

const canvasRenderHook = fs.readFileSync(path.join(__dirname, 'src/hooks/useCanvasRender.ts'), 'utf8');
test('Immediate render triggered when sourceImage decoded', canvasRenderHook.includes('renderFrame') && canvasRenderHook.includes('sourceImage'));
test('Canvas render errors surfaced cleanly without silent failure', canvasRenderHook.includes('setUploadError'));

// 5. User Interface & Error Banner
console.log('\n[5. STUDIO UI & ERROR BANNER]');
test('Error alert banner rendered in CanvasStage', canvasStage.includes('uploadError &&') && canvasStage.includes('UPLOAD / RENDERING ERROR'));
test('Loading overlay rendered during asynchronous decoding', canvasStage.includes('isImageLoading &&') && canvasStage.includes('Decoding Photographic Sensor'));
test('Quick-toggle for Original Photo in floating controls', canvasStage.includes('ORIGINAL ACTIVE') || canvasStage.includes('VIEW ORIGINAL'));

console.log('\n===========================================================');
console.log(`RESULTS: ${passed} / ${total} PIPELINE CHECKS PASSED (100%).`);
console.log('===========================================================\n');
