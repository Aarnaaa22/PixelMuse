// Automated Verification Test Suite for PixelMuse Art Library Feature
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting PixelMuse Art Library Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

// 1. Check Recipe Registry File
const recipeFile = path.join(__dirname, 'src', 'recipes', 'communityRecipes.ts');
assert(fs.existsSync(recipeFile), 'communityRecipes.ts exists in src/recipes/');

const recipeContent = fs.readFileSync(recipeFile, 'utf8');

// Match recipe IDs
const idMatches = recipeContent.match(/id:\s*['"]([^'"]+)['"]/g) || [];
assert(idMatches.length === 48, `Exactly 48 recipes registered (found ${idMatches.length})`);

// 2. Check Required Categories in Types
const typesFile = path.join(__dirname, 'src', 'types', 'recipe.ts');
assert(fs.existsSync(typesFile), 'recipe.ts exists in src/types/');
const typesContent = fs.readFileSync(typesFile, 'utf8');

const requiredCategories = [
  'all',
  'ascii',
  'matrix-terminal',
  'geometric',
  'dithering',
  'mosaic-pixel',
  'abstract',
  'animated-bg',
];

requiredCategories.forEach((cat) => {
  assert(
    typesContent.includes(`'${cat}'`),
    `Category '${cat}' is defined in RecipeCategory union`
  );
});

// 3. Check Procedural Background Engine
const procEngineFile = path.join(__dirname, 'src', 'recipes', 'proceduralBackgrounds.ts');
assert(fs.existsSync(procEngineFile), 'proceduralBackgrounds.ts exists in src/recipes/');
const procContent = fs.readFileSync(procEngineFile, 'utf8');

const expectedBackgroundShaders = [
  'drawTunnel',
  'drawWake',
  'drawWave',
  'drawCube3D',
  'drawGlobe3D',
  'drawKnot3D',
  'drawPyramid3D',
  'drawSchlieren',
  'drawReactionFront',
  'drawMatrixStream',
  'drawDitherOrb',
  'drawCrtBarrel',
  'drawFlowerPolar',
  'drawTextCascade',
  'drawHeroMesh',
];

expectedBackgroundShaders.forEach((shader) => {
  assert(
    procContent.includes(shader),
    `Procedural shader '${shader}' implemented in ProceduralBackgroundEngine`
  );
});

// 4. Check Navigation Rail
const navFile = path.join(__dirname, 'src', 'components', 'common', 'NavigationRail.tsx');
const navContent = fs.readFileSync(navFile, 'utf8');
assert(navContent.includes('/library'), 'NavigationRail includes route "/library"');
assert(navContent.includes('Art Library'), 'NavigationRail includes label "Art Library"');

// 5. Check App.tsx Routing
const appFile = path.join(__dirname, 'src', 'App.tsx');
const appContent = fs.readFileSync(appFile, 'utf8');
assert(appContent.includes('ArtLibraryPage'), 'App.tsx imports ArtLibraryPage');
assert(appContent.includes('path="library"'), 'App.tsx declares <Route path="library" ... />');

// 6. Check ArtLibraryPage implementation
const pageFile = path.join(__dirname, 'src', 'pages', 'ArtLibraryPage.tsx');
assert(fs.existsSync(pageFile), 'ArtLibraryPage.tsx exists');
const pageContent = fs.readFileSync(pageFile, 'utf8');
assert(pageContent.includes('THE ART LIBRARY'), 'Page displays editorial header "THE ART LIBRARY"');
assert(pageContent.includes('Search'), 'Page includes search input');
assert(pageContent.includes('motionOptions'), 'Page includes motion filter controls');
assert(pageContent.includes('showFavoritesOnly'), 'Page includes favorites filter toggle');
assert(pageContent.includes('categories.map'), 'Page renders category filter strip');

// 7. Check Components (Card, Modal, Preview)
const cardFile = path.join(__dirname, 'src', 'components', 'library', 'RecipeCard.tsx');
assert(fs.existsSync(cardFile), 'RecipeCard.tsx exists');
const cardContent = fs.readFileSync(cardFile, 'utf8');
assert(cardContent.includes('Try This Style'), 'RecipeCard contains "Try This Style" CTA');
assert(cardContent.includes('toggleFavorite'), 'RecipeCard contains favorite toggle');

const modalFile = path.join(__dirname, 'src', 'components', 'library', 'RecipeModal.tsx');
assert(fs.existsSync(modalFile), 'RecipeModal.tsx exists');
const modalContent = fs.readFileSync(modalFile, 'utf8');
assert(modalContent.includes('Open In Studio'), 'RecipeModal contains "Open In Studio" CTA');
assert(modalContent.includes('missingFeatureNote'), 'RecipeModal displays architectural notes for unsupported modes');

// 8. Check Store
const storeFile = path.join(__dirname, 'src', 'stores', 'libraryStore.ts');
assert(fs.existsSync(storeFile), 'libraryStore.ts exists');
const storeContent = fs.readFileSync(storeFile, 'utf8');
assert(storeContent.includes('pixelmuse_art_library_favorites'), 'libraryStore persists favorites to localStorage');

console.log(`\n========================================`);
console.log(`Results: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  console.log('🎉 ALL ART LIBRARY VERIFICATION TESTS PASSED!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
}

