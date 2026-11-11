const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT_DIR = path.join(__dirname, 'docs', 'screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Helper to write SVG
function writeSvg(filename, svgContent) {
  const filePath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filePath, svgContent.trim());
  console.log(`✓ Generated SVG: ${filename}`);
}

// PNG Generation Helper (Clean standard PNG encoder without dependencies)
function createPng(width, height, pixelFn) {
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }
  const idatData = zlib.deflateSync(rawData);
  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = calcCrc(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  function calcCrc(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return c ^ 0xffffffff;
  }
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  return Buffer.concat([
    header,
    createChunk('IHDR', ihdrData),
    createChunk('IDAT', idatData),
    createChunk('IEND', Buffer.alloc(0))
  ]);
}

// -----------------------------------------------------------------------------
// SCREENSHOT 1: LANDING PAGE HERO
// -----------------------------------------------------------------------------
const svg01 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background:#08080A; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#08080A"/>
      <stop offset="50%" stop-color="#0D0D12"/>
      <stop offset="100%" stop-color="#050507"/>
    </linearGradient>
    <linearGradient id="limeGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#CCFF00"/>
      <stop offset="100%" stop-color="#99FF00"/>
    </linearGradient>
    <linearGradient id="violetGlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9D4EDD" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#08080A" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background Grid -->
  <rect width="1440" height="900" fill="url(#bgGrad)"/>
  <rect width="1440" height="900" fill="url(#grid)"/>

  <!-- Top Navigation Bar -->
  <rect x="0" y="0" width="1440" height="64" fill="#0A0A0E" stroke="#1F1F28" stroke-width="1"/>
  <circle cx="48" cy="32" r="12" fill="#CCFF00"/>
  <text x="44" y="37" font-weight="900" font-size="14" fill="#08080A">P</text>
  <text x="70" y="37" font-weight="900" font-size="16" letter-spacing="2" fill="#FFFFFF">PIXELMUSE</text>
  <rect x="180" y="24" width="70" height="18" rx="2" fill="#14141E" stroke="#2B2B38"/>
  <text x="187" y="36" font-family="monospace" font-size="10" fill="#CCFF00">STUDIO 2.0</text>

  <!-- Nav Links -->
  <text x="960" y="37" font-family="monospace" font-size="12" fill="#FFFFFF" font-weight="600">STUDIO</text>
  <text x="1050" y="37" font-family="monospace" font-size="12" fill="#A0A0B0">ART LIBRARY</text>
  <text x="1170" y="37" font-family="monospace" font-size="12" fill="#A0A0B0">EXPLORE</text>
  <rect x="1260" y="16" width="130" height="32" rx="2" fill="#CCFF00"/>
  <text x="1285" y="37" font-family="monospace" font-size="11" font-weight="700" fill="#08080A">LAUNCH APP →</text>

  <!-- Hero Left Column -->
  <g transform="translate(80, 160)">
    <!-- Badge -->
    <rect x="0" y="0" width="220" height="26" rx="2" fill="#14141E" stroke="#CCFF00" stroke-width="0.8"/>
    <circle cx="14" cy="13" r="3.5" fill="#CCFF00"/>
    <text x="26" y="17" font-family="monospace" font-size="10" letter-spacing="1.5" fill="#CCFF00" font-weight="600">EXPERIMENTAL ART STUDIO</text>

    <!-- Main Headline -->
    <text x="0" y="70" font-weight="900" font-size="52" letter-spacing="-1.5" fill="#FFFFFF" line-height="1.1">
      TURN ORDINARY
    </text>
    <text x="0" y="125" font-weight="900" font-size="52" letter-spacing="-1.5" fill="#FFFFFF">
      PHOTOGRAPHS INTO
    </text>
    <text x="0" y="180" font-weight="900" font-size="52" letter-spacing="-1.5" fill="#CCFF00">
      EXTRAORDINARY
    </text>
    <text x="0" y="235" font-weight="900" font-size="52" letter-spacing="-1.5" fill="#FFFFFF">
      GENERATIVE ART.
    </text>

    <!-- Subtitle Paragraph -->
    <text x="0" y="285" font-family="monospace" font-size="13" fill="#8E8E9F" line-height="20">
      <tspan x="0" dy="0">High-performance Canvas 2D image processing studio. Transform digital</tspan>
      <tspan x="0" dy="22">photographs into ASCII glyphs, ordered Bayer dither, geometric crosses,</tspan>
      <tspan x="0" dy="22">and animated phosphor CRT code matrices in sub-16ms latency.</tspan>
    </text>

    <!-- CTA Buttons -->
    <g transform="translate(0, 365)">
      <rect x="0" y="0" width="190" height="48" rx="2" fill="#CCFF00"/>
      <text x="32" y="29" font-family="monospace" font-size="13" font-weight="800" fill="#08080A">ENTER THE STUDIO →</text>

      <rect x="210" y="0" width="180" height="48" rx="2" fill="#14141E" stroke="#2B2B38" stroke-width="1"/>
      <text x="240" y="29" font-family="monospace" font-size="13" font-weight="600" fill="#FFFFFF">EXPLORE ARTWORKS</text>
    </g>

    <!-- Specifications Strip -->
    <g transform="translate(0, 460)">
      <line x1="0" y1="0" x2="520" y2="0" stroke="#1F1F28" stroke-width="1"/>
      <text x="0" y="26" font-family="monospace" font-size="11" font-weight="700" fill="#FFFFFF">24 RASTER ENGINES</text>
      <text x="0" y="42" font-family="monospace" font-size="10" fill="#6A6A78">ASCII / Dither / Geometric</text>

      <text x="180" y="26" font-family="monospace" font-size="11" font-weight="700" fill="#CCFF00">&lt; 16MS LATENCY</text>
      <text x="180" y="42" font-family="monospace" font-size="10" fill="#6A6A78">Hardware Canvas 2D Blit</text>

      <text x="360" y="26" font-family="monospace" font-size="11" font-weight="700" fill="#9D4EDD">4K SUPERSAMPLING</text>
      <text x="360" y="42" font-family="monospace" font-size="10" fill="#6A6A78">Lossless Master Export</text>
    </g>
  </g>

  <!-- Hero Right Column: Centerpiece Visual Stage -->
  <g transform="translate(740, 140)">
    <!-- Outer Viewport Box -->
    <rect x="0" y="0" width="620" height="660" rx="4" fill="#0D0D12" stroke="#1F1F28" stroke-width="1.5"/>
    <rect x="0" y="0" width="620" height="36" fill="#14141C" stroke="#1F1F28" stroke-width="1"/>
    
    <!-- Window Controls -->
    <circle cx="20" cy="18" r="4.5" fill="#FF473A"/>
    <circle cx="36" cy="18" r="4.5" fill="#FFD166"/>
    <circle cx="52" cy="18" r="4.5" fill="#06D6A0"/>
    <text x="80" y="22" font-family="monospace" font-size="10" fill="#8E8E9F">RENDER_TARGET // MARBLE_BUST_SCULPTURE.RAW</text>
    <rect x="520" y="10" width="85" height="16" rx="2" fill="#08080A" stroke="#CCFF00" stroke-width="0.8"/>
    <text x="528" y="22" font-family="monospace" font-size="9" fill="#CCFF00">60 FPS ACTIVE</text>

    <!-- Canvas Inner Display -->
    <g transform="translate(20, 56)">
      <rect x="0" y="0" width="580" height="580" fill="#050508"/>

      <!-- Sculptural Radial Art Preview -->
      <circle cx="290" cy="270" r="180" fill="url(#violetGlow)"/>
      <circle cx="290" cy="270" r="130" fill="none" stroke="#CCFF00" stroke-width="2" stroke-dasharray="6,4"/>
      <circle cx="290" cy="270" r="150" fill="none" stroke="#9D4EDD" stroke-width="1.5" stroke-dasharray="12,6"/>
      <circle cx="290" cy="270" r="90" fill="#1A1829" stroke="#CCFF00" stroke-width="1"/>

      <!-- ASCII / Stipple Grid Simulation -->
      <g fill="#CCFF00" opacity="0.85" font-family="monospace" font-size="9">
        <text x="210" y="220">@ % # * + = - : .  </text>
        <text x="190" y="235"># % @ S S # + = - : . .</text>
        <text x="175" y="250">@ % # * * + = - : . . . .</text>
        <text x="170" y="265">% % # * + = - - : . . . . .</text>
        <text x="175" y="280"># % @ # * + = - : . . . .</text>
        <text x="190" y="295">@ % # * + = - : . .</text>
        <text x="215" y="310">% # * + = - : . </text>
      </g>

      <g fill="#9D4EDD" opacity="0.9" font-family="monospace" font-size="9">
        <text x="270" y="220">░ ▒ ▓ █ ▓ ▒ ░ </text>
        <text x="260" y="235">░ ▒ ▓ █ █ ▓ ▒ ░ </text>
        <text x="250" y="250">░ ▒ ▓ █ █ █ ▓ ▒ ░ </text>
        <text x="250" y="265">░ ▒ ▓ █ █ █ ▓ ▒ ░ </text>
        <text x="260" y="280">░ ▒ ▓ █ █ ▓ ▒ ░ </text>
        <text x="270" y="295">░ ▒ ▓ █ ▓ ▒ ░ </text>
      </g>

      <!-- Laser Scan Indicator Line -->
      <line x1="290" y1="0" x2="290" y2="580" stroke="#CCFF00" stroke-width="1.5" opacity="0.8"/>
      <rect x="230" y="540" width="120" height="22" rx="2" fill="#08080A" stroke="#CCFF00" stroke-width="1"/>
      <text x="245" y="555" font-family="monospace" font-size="9" font-weight="700" fill="#CCFF00">LIVE RASTER SCAN</text>
    </g>
  </g>
</svg>`;
writeSvg('01-landing-hero.svg', svg01);

// -----------------------------------------------------------------------------
// SCREENSHOT 2: INTERACTIVE ART GALLERY (EXPLORE SECTION)
// -----------------------------------------------------------------------------
const svg02 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background:#08080A; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <pattern id="grid2" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1440" height="900" fill="#08080A"/>
  <rect width="1440" height="900" fill="url(#grid2)"/>

  <!-- Section Header -->
  <g transform="translate(80, 50)">
    <rect x="0" y="0" width="180" height="22" rx="2" fill="#14141E" stroke="#CCFF00" stroke-width="0.8"/>
    <circle cx="10" cy="11" r="3" fill="#CCFF00"/>
    <text x="20" y="15" font-family="monospace" font-size="10" fill="#CCFF00" font-weight="700">INTERACTIVE ART GALLERY</text>
    <text x="200" y="15" font-family="monospace" font-size="10" fill="#6A6A78">08 LIVE GENERATIVE EXHIBITS</text>

    <text x="0" y="65" font-weight="900" font-size="38" letter-spacing="-1" fill="#FFFFFF">
      EXPLORE GENERATIVE TRANSFORMATIONS
    </text>
    <text x="0" y="95" font-family="monospace" font-size="12" fill="#8E8E9F">
      Hover over any artwork to experience real-time Canvas 2D rasterization. Click Try This Style to launch directly into the studio.
    </text>

    <!-- Filter Pills -->
    <g transform="translate(1000, 55)">
      <rect x="0" y="0" width="280" height="34" rx="2" fill="#111118" stroke="#1F1F28"/>
      <rect x="4" y="4" width="80" height="26" rx="2" fill="#CCFF00"/>
      <text x="22" y="21" font-family="monospace" font-size="11" font-weight="800" fill="#08080A">ALL (8)</text>

      <text x="105" y="21" font-family="monospace" font-size="11" fill="#8E8E9F">▶ KINETIC</text>
      <text x="195" y="21" font-family="monospace" font-size="11" fill="#8E8E9F">░ RASTERS</text>
    </g>
  </g>

  <!-- 4 Primary Exhibition Cards (Top Row) -->
  <!-- Card 1: DIGITAL BLOOM (HOVERED / ACTIVE WITH BEFORE-AFTER LASER SWEEP) -->
  <g transform="translate(80, 180)">
    <rect x="0" y="0" width="300" height="320" rx="3" fill="#0E0E14" stroke="#CCFF00" stroke-width="1.5"/>
    <!-- Canvas Area with Split View -->
    <rect x="0" y="0" width="300" height="200" fill="#050508"/>
    <!-- Left Slice: Photo -->
    <rect x="0" y="0" width="130" height="200" fill="#1A1829"/>
    <circle cx="130" cy="100" r="70" fill="#736B92"/>
    <rect x="8" y="174" width="60" height="16" fill="rgba(8,8,10,0.8)"/>
    <text x="12" y="186" font-family="monospace" font-size="8" fill="#8E8E9F">RAW PHOTO</text>

    <!-- Right Slice: Generative Dots Bloom -->
    <rect x="130" y="0" width="170" height="200" fill="#08080C"/>
    <g fill="#9D4EDD" opacity="0.9">
      <circle cx="160" cy="60" r="6"/>
      <circle cx="190" cy="50" r="8" fill="#CCFF00"/>
      <circle cx="220" cy="70" r="5"/>
      <circle cx="170" cy="95" r="9" fill="#CCFF00"/>
      <circle cx="205" cy="100" r="12" fill="#FFFFFF"/>
      <circle cx="240" cy="105" r="7"/>
      <circle cx="175" cy="140" r="8"/>
      <circle cx="210" cy="145" r="10" fill="#CCFF00"/>
      <circle cx="250" cy="135" r="6"/>
    </g>
    <rect x="230" y="174" width="62" height="16" fill="rgba(8,8,10,0.8)"/>
    <text x="234" y="186" font-family="monospace" font-size="8" fill="#CCFF00">RASTER GEN</text>

    <!-- Glowing Laser Split Divider -->
    <line x1="130" y1="0" x2="130" y2="200" stroke="#CCFF00" stroke-width="2"/>
    <line x1="130" y1="0" x2="130" y2="200" stroke="#FFFFFF" stroke-width="1"/>

    <!-- Badges -->
    <rect x="10" y="10" width="85" height="18" rx="2" fill="#CCFF00"/>
    <text x="16" y="23" font-family="monospace" font-size="9" font-weight="800" fill="#08080A">DOTS / BLOOM</text>
    <rect x="180" y="10" width="110" height="18" rx="2" fill="#08080A" stroke="#CCFF00" stroke-width="0.8"/>
    <text x="188" y="23" font-family="monospace" font-size="9" fill="#CCFF00">INTERACTIVE SCAN</text>

    <!-- Body Content -->
    <text x="14" y="225" font-family="sans-serif" font-size="14" font-weight="800" fill="#CCFF00">DIGITAL BLOOM</text>
    <text x="14" y="242" font-family="monospace" font-size="10" fill="#8E8E9F">Luminous circular dots modulating with bloom.</text>
    <!-- Palette Bar -->
    <g transform="translate(14, 254)">
      <rect x="0" y="0" width="54" height="4" fill="#08080A"/>
      <rect x="54" y="0" width="54" height="4" fill="#1F1F28"/>
      <rect x="108" y="0" width="54" height="4" fill="#9D4EDD"/>
      <rect x="162" y="0" width="54" height="4" fill="#CCFF00"/>
      <rect x="216" y="0" width="56" height="4" fill="#FFFFFF"/>
    </g>
    <!-- CTA Button -->
    <rect x="14" y="270" width="272" height="34" rx="2" fill="#CCFF00"/>
    <text x="95" y="292" font-family="monospace" font-size="11" font-weight="800" fill="#08080A">TRY THIS STYLE ↗</text>
  </g>

  <!-- Card 2: CYBER TERMINAL (ASCII) -->
  <g transform="translate(410, 180)">
    <rect x="0" y="0" width="300" height="320" rx="3" fill="#0E0E14" stroke="#1F1F28" stroke-width="1"/>
    <rect x="0" y="0" width="300" height="200" fill="#050805"/>
    <!-- ASCII Matrix Text Simulated -->
    <g fill="#33E533" font-family="monospace" font-size="8" opacity="0.9">
      <text x="15" y="30">0101 # @ % S * + = - : . 010101</text>
      <text x="15" y="50">@ % # # # * * + = - - : . . @ %</text>
      <text x="15" y="70">█ ▓ ▒ ░ █ ▓ ▒ ░ █ ▓ ▒ ░ █ ▓ ▒ ░</text>
      <text x="15" y="90"># # % @ @ S * + = = - : . . # #</text>
      <text x="15" y="110">0xFF 0x4A 0x8B 0x12 0xC4 0x00</text>
      <text x="15" y="130">@ @ % # * * + = - : . . @ @ % #</text>
      <text x="15" y="150">█ █ █ ▓ ▓ ▒ ░ █ █ █ ▓ ▓ ▒ ░ █ █</text>
      <text x="15" y="170">1010101010101010101010101010</text>
    </g>
    <rect x="10" y="10" width="90" height="18" rx="2" fill="#14141E" stroke="#2B2B38"/>
    <text x="18" y="23" font-family="monospace" font-size="9" fill="#FFFFFF">ASCII MATRIX</text>
    <text x="14" y="225" font-family="sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">CYBER TERMINAL</text>
    <text x="14" y="242" font-family="monospace" font-size="10" fill="#8E8E9F">Dense cathode monospace glyphs & CRT scanlines.</text>
    <rect x="14" y="270" width="272" height="34" rx="2" fill="#14141E" stroke="#2B2B38"/>
    <text x="95" y="292" font-family="monospace" font-size="11" font-weight="600" fill="#FFFFFF">OPEN IN STUDIO ↗</text>
  </g>

  <!-- Card 3: NEON DREAM (CROSSES) -->
  <g transform="translate(740, 180)">
    <rect x="0" y="0" width="300" height="320" rx="3" fill="#0E0E14" stroke="#1F1F28" stroke-width="1"/>
    <rect x="0" y="0" width="300" height="200" fill="#0D0612"/>
    <!-- Geometric Crosses Pattern -->
    <g stroke="#FF1493" stroke-width="2" opacity="0.85">
      <path d="M 60 40 L 60 60 M 50 50 L 70 50"/>
      <path d="M 120 40 L 120 60 M 110 50 L 130 50" stroke="#CCFF00"/>
      <path d="M 180 40 L 180 60 M 170 50 L 190 50"/>
      <path d="M 240 40 L 240 60 M 230 50 L 250 50" stroke="#9D4EDD"/>
      <path d="M 90 90 L 90 110 M 80 100 L 100 100" stroke="#9D4EDD"/>
      <path d="M 150 90 L 150 110 M 140 100 L 160 100" stroke="#FF1493"/>
      <path d="M 210 90 L 210 110 M 200 100 L 220 100" stroke="#CCFF00"/>
      <path d="M 60 140 L 60 160 M 50 150 L 70 150" stroke="#CCFF00"/>
      <path d="M 120 140 L 120 160 M 110 150 L 130 150" stroke="#FF1493"/>
      <path d="M 180 140 L 180 160 M 170 150 L 190 150" stroke="#9D4EDD"/>
      <path d="M 240 140 L 240 160 M 230 150 L 250 150" stroke="#FF1493"/>
    </g>
    <rect x="10" y="10" width="115" height="18" rx="2" fill="#14141E" stroke="#2B2B38"/>
    <text x="18" y="23" font-family="monospace" font-size="9" fill="#FFFFFF">GEOMETRIC CROSSES</text>
    <text x="14" y="225" font-family="sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">NEON DREAM</text>
    <text x="14" y="242" font-family="monospace" font-size="10" fill="#8E8E9F">Electric violet and coral synthwave glow.</text>
    <rect x="14" y="270" width="272" height="34" rx="2" fill="#14141E" stroke="#2B2B38"/>
    <text x="95" y="292" font-family="monospace" font-size="11" font-weight="600" fill="#FFFFFF">OPEN IN STUDIO ↗</text>
  </g>

  <!-- Card 4: MATRIX RAIN (ANIMATED 60 FPS) -->
  <g transform="translate(1070, 180)">
    <rect x="0" y="0" width="300" height="320" rx="3" fill="#0E0E14" stroke="#33E533" stroke-width="1"/>
    <rect x="0" y="0" width="300" height="200" fill="#050805"/>
    <!-- Animated Matrix Stream Streams -->
    <g fill="#33E533" font-family="monospace" font-size="9">
      <text x="30" y="30" fill="#FFFFFF">7</text>
      <text x="30" y="45">カ</text>
      <text x="30" y="60">タ</text>
      <text x="30" y="75" opacity="0.6">8</text>
      <text x="30" y="90" opacity="0.3">F</text>

      <text x="80" y="70" fill="#FFFFFF">A</text>
      <text x="80" y="85">ミ</text>
      <text x="80" y="100">ツ</text>
      <text x="80" y="115" opacity="0.5">3</text>

      <text x="140" y="20" fill="#FFFFFF">9</text>
      <text x="140" y="35">テ</text>
      <text x="140" y="50">ク</text>
      <text x="140" y="65">B</text>
      <text x="140" y="80">0</text>
      <text x="140" y="95" opacity="0.6">ヌ</text>

      <text x="200" y="90" fill="#FFFFFF">X</text>
      <text x="200" y="105">リ</text>
      <text x="200" y="120">7</text>
      <text x="200" y="135" opacity="0.4">ヒ</text>

      <text x="250" y="40" fill="#FFFFFF">4</text>
      <text x="250" y="55">マ</text>
      <text x="250" y="70">C</text>
      <text x="250" y="85" opacity="0.6">ト</text>
    </g>
    <!-- Motion Badge -->
    <rect x="10" y="10" width="80" height="18" rx="2" fill="#14141E" stroke="#33E533"/>
    <text x="18" y="23" font-family="monospace" font-size="9" fill="#33E533">MATRIX RAIN</text>
    <rect x="220" y="10" width="70" height="18" rx="2" fill="#14141E" stroke="#33E533"/>
    <text x="226" y="23" font-family="monospace" font-size="9" fill="#33E533">▶ 60 FPS</text>
    <text x="14" y="225" font-family="sans-serif" font-size="14" font-weight="800" fill="#33E533">MATRIX RAIN</text>
    <text x="14" y="242" font-family="monospace" font-size="10" fill="#8E8E9F">Cascading code streams with phosphor trails.</text>
    <rect x="14" y="270" width="272" height="34" rx="2" fill="#14141E" stroke="#2B2B38"/>
    <text x="95" y="292" font-family="monospace" font-size="11" font-weight="600" fill="#FFFFFF">OPEN IN STUDIO ↗</text>
  </g>

  <!-- 4 Secondary Exhibition Cards (Bottom Row Snippet) -->
  <g transform="translate(80, 530)">
    <!-- RETRO PIXELS -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="300" height="320" rx="3" fill="#0E0E14" stroke="#1F1F28" stroke-width="1"/>
      <rect x="0" y="0" width="300" height="200" fill="#050508"/>
      <!-- Pixel Mosaic Blocks -->
      <g stroke="#050508" stroke-width="1">
        <rect x="60" y="40" width="30" height="30" fill="#FF473A"/>
        <rect x="90" y="40" width="30" height="30" fill="#CCFF00"/>
        <rect x="120" y="40" width="30" height="30" fill="#9D4EDD"/>
        <rect x="150" y="40" width="30" height="30" fill="#CCFF00"/>
        <rect x="180" y="40" width="30" height="30" fill="#FF473A"/>
        <rect x="90" y="70" width="30" height="30" fill="#FFFFFF"/>
        <rect x="120" y="70" width="30" height="30" fill="#050508"/>
        <rect x="150" y="70" width="30" height="30" fill="#FFFFFF"/>
        <rect x="90" y="100" width="90" height="30" fill="#CCFF00"/>
      </g>
      <rect x="10" y="10" width="100" height="18" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="18" y="23" font-family="monospace" font-size="9" fill="#FFFFFF">QUANTIZED PIXEL</text>
      <text x="14" y="225" font-family="sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">RETRO PIXELS</text>
      <text x="14" y="242" font-family="monospace" font-size="10" fill="#8E8E9F">Sharp 8-bit quantized arcade pixel clarity.</text>
      <rect x="14" y="270" width="272" height="34" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="95" y="292" font-family="monospace" font-size="11" font-weight="600" fill="#FFFFFF">OPEN IN STUDIO ↗</text>
    </g>

    <!-- MONOCHROME STUDY (DITHER) -->
    <g transform="translate(330, 0)">
      <rect x="0" y="0" width="300" height="320" rx="3" fill="#0E0E14" stroke="#1F1F28" stroke-width="1"/>
      <rect x="0" y="0" width="300" height="200" fill="#0A0A0C"/>
      <!-- Dither Stipple Noise Texture -->
      <circle cx="150" cy="100" r="70" fill="#202028"/>
      <circle cx="130" cy="80" r="40" fill="#FAFAFA" opacity="0.8"/>
      <rect x="10" y="10" width="105" height="18" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="18" y="23" font-family="monospace" font-size="9" fill="#FFFFFF">ATKINSON DITHER</text>
      <text x="14" y="225" font-family="sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">MONOCHROME STUDY</text>
      <text x="14" y="242" font-family="monospace" font-size="10" fill="#8E8E9F">1984 MacPaint 1-bit error diffusion & silver grain.</text>
      <rect x="14" y="270" width="272" height="34" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="95" y="292" font-family="monospace" font-size="11" font-weight="600" fill="#FFFFFF">OPEN IN STUDIO ↗</text>
    </g>

    <!-- ACID GEOMETRY (HEXAGONS) -->
    <g transform="translate(660, 0)">
      <rect x="0" y="0" width="300" height="320" rx="3" fill="#0E0E14" stroke="#1F1F28" stroke-width="1"/>
      <rect x="0" y="0" width="300" height="200" fill="#050508"/>
      <!-- Hexagons -->
      <polygon points="150,50 180,68 180,102 150,120 120,102 120,68" fill="none" stroke="#CCFF00" stroke-width="2"/>
      <polygon points="150,70 170,82 170,108 150,120 130,108 130,82" fill="#1A2A0A" stroke="#CCFF00" stroke-width="1"/>
      <rect x="10" y="10" width="120" height="18" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="18" y="23" font-family="monospace" font-size="9" fill="#FFFFFF">PRISMATIC HEXAGONS</text>
      <text x="14" y="225" font-family="sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">ACID GEOMETRY</text>
      <text x="14" y="242" font-family="monospace" font-size="10" fill="#8E8E9F">Interlocking hexagonal prisms in high-voltage lime.</text>
      <rect x="14" y="270" width="272" height="34" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="95" y="292" font-family="monospace" font-size="11" font-weight="600" fill="#FFFFFF">OPEN IN STUDIO ↗</text>
    </g>

    <!-- KINETIC RINGS -->
    <g transform="translate(990, 0)">
      <rect x="0" y="0" width="300" height="320" rx="3" fill="#0E0E14" stroke="#1F1F28" stroke-width="1"/>
      <rect x="0" y="0" width="300" height="200" fill="#08080C"/>
      <circle cx="150" cy="100" r="25" fill="none" stroke="#CCFF00" stroke-width="2"/>
      <circle cx="150" cy="100" r="50" fill="none" stroke="#9D4EDD" stroke-width="2" stroke-dasharray="4,4"/>
      <circle cx="150" cy="100" r="75" fill="none" stroke="#CCFF00" stroke-width="1.5"/>
      <rect x="10" y="10" width="100" height="18" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="18" y="23" font-family="monospace" font-size="9" fill="#FFFFFF">ANIMATED RINGS</text>
      <rect x="220" y="10" width="70" height="18" rx="2" fill="#14141E" stroke="#CCFF00"/>
      <text x="226" y="23" font-family="monospace" font-size="9" fill="#08080A" font-weight="700">▶ 60 FPS</text>
      <text x="14" y="225" font-family="sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">KINETIC RINGS</text>
      <text x="14" y="242" font-family="monospace" font-size="10" fill="#8E8E9F">Concentric rings with harmonic radial flares.</text>
      <rect x="14" y="270" width="272" height="34" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="95" y="292" font-family="monospace" font-size="11" font-weight="600" fill="#FFFFFF">OPEN IN STUDIO ↗</text>
    </g>
  </g>
</svg>`;
writeSvg('02-interactive-gallery.svg', svg02);

// -----------------------------------------------------------------------------
// SCREENSHOT 3: STUDIO WORKSPACE
// -----------------------------------------------------------------------------
const svg03 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background:#08080A; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Studio Root Layout: 3 Columns (Left 320, Center Flex, Right 320) + Topbar 56 + Footer 28 -->

  <!-- 1. Top Toolbar -->
  <rect x="0" y="0" width="1440" height="56" fill="#0A0A0E" stroke="#1F1F28" stroke-width="1"/>
  <circle cx="28" cy="28" r="10" fill="#CCFF00"/>
  <text x="25" y="32" font-weight="900" font-size="12" fill="#08080A">P</text>
  <text x="48" y="33" font-weight="800" font-size="14" letter-spacing="1.5" fill="#FFFFFF">PIXELMUSE</text>
  <line x1="160" y1="18" x2="160" y2="38" stroke="#1F1F28" stroke-width="1"/>

  <!-- Project Name & Recipe Badge -->
  <text x="180" y="33" font-family="monospace" font-size="11" fill="#FFFFFF" font-weight="600">MARBLE_SCULPTURE_01</text>
  <rect x="350" y="18" width="60" height="20" rx="2" fill="#14141E" stroke="#1F1F28"/>
  <text x="362" y="32" font-family="monospace" font-size="9" fill="#8E8E9F">ASCII</text>

  <!-- Active Recipe Pill -->
  <rect x="425" y="16" width="180" height="24" rx="2" fill="rgba(157,78,221,0.15)" stroke="rgba(157,78,221,0.4)"/>
  <text x="435" y="32" font-family="monospace" font-size="10" fill="#9D4EDD" font-weight="700">★ RECIPE: HERO ASCII ONE</text>
  <text x="565" y="32" font-family="monospace" font-size="9" fill="#CCFF00" text-decoration="underline">RESET</text>

  <!-- Navigation Action: Art Library -->
  <rect x="620" y="16" width="110" height="24" rx="2" fill="#14141E" stroke="#1F1F28"/>
  <text x="635" y="32" font-family="monospace" font-size="10" fill="#FFFFFF">✦ ART LIBRARY</text>

  <!-- Center Undo / Redo -->
  <rect x="750" y="16" width="30" height="24" rx="2" fill="#14141E" stroke="#1F1F28"/>
  <text x="760" y="32" fill="#8E8E9F" font-size="12">↩</text>
  <rect x="785" y="16" width="30" height="24" rx="2" fill="#14141E" stroke="#1F1F28"/>
  <text x="795" y="32" fill="#8E8E9F" font-size="12">↪</text>
  <rect x="820" y="16" width="30" height="24" rx="2" fill="#14141E" stroke="#1F1F28"/>
  <text x="830" y="32" fill="#8E8E9F" font-size="12">↺</text>

  <!-- Right Actions: Save & Export Master -->
  <rect x="1190" y="14" width="75" height="28" rx="2" fill="#14141E" stroke="#2B2B38"/>
  <text x="1208" y="32" font-family="monospace" font-size="11" fill="#FFFFFF">SAVE</text>
  <rect x="1275" y="14" width="90" height="28" rx="2" fill="#CCFF00"/>
  <text x="1295" y="32" font-family="monospace" font-size="11" font-weight="800" fill="#08080A">EXPORT ↗</text>

  <rect x="1380" y="14" width="28" height="28" rx="2" fill="#14141E" stroke="#1F1F28"/>
  <circle cx="1394" cy="28" r="6" fill="#8E8E9F"/>

  <!-- 2. Left Sidebar (Width 320) -->
  <g transform="translate(0, 56)">
    <rect x="0" y="0" width="320" height="816" fill="#0A0A0E" stroke="#1F1F28" stroke-width="1"/>
    <!-- 4 Tabs -->
    <rect x="0" y="0" width="80" height="42" fill="#14141C"/>
    <text x="18" y="26" font-family="monospace" font-size="10" fill="#CCFF00">UPLOAD</text>
    <rect x="80" y="0" width="80" height="42" fill="#0A0A0E"/>
    <text x="96" y="26" font-family="monospace" font-size="10" fill="#8E8E9F">PRESETS</text>
    <rect x="160" y="0" width="80" height="42" fill="#0A0A0E"/>
    <text x="182" y="26" font-family="monospace" font-size="10" fill="#8E8E9F">MODES</text>
    <rect x="240" y="0" width="80" height="42" fill="#0A0A0E"/>
    <text x="258" y="26" font-family="monospace" font-size="10" fill="#8E8E9F">LAYERS</text>

    <!-- Active Photograph Card -->
    <g transform="translate(16, 60)">
      <rect x="0" y="0" width="288" height="80" rx="2" fill="rgba(204,255,0,0.06)" stroke="#CCFF00" stroke-width="1.2"/>
      <!-- Thumbnail -->
      <rect x="10" y="10" width="60" height="60" fill="#1A1829" stroke="#1F1F28"/>
      <circle cx="40" cy="40" r="22" fill="#736B92"/>
      <rect x="80" y="12" width="110" height="16" rx="2" fill="#CCFF00"/>
      <text x="86" y="24" font-family="monospace" font-size="8" font-weight="800" fill="#08080A">ACTIVE PHOTOGRAPH</text>
      <text x="80" y="44" font-family="monospace" font-size="11" font-weight="700" fill="#FFFFFF">marble-sculpture.png</text>
      <text x="80" y="60" font-family="monospace" font-size="9" fill="#8E8E9F">640 × 640 PX • RATIO: 1.00</text>
    </g>

    <!-- Preset Sub-selector (Art Library vs Curated) -->
    <g transform="translate(16, 160)">
      <rect x="0" y="0" width="288" height="30" rx="2" fill="#14141E" stroke="#1F1F28"/>
      <rect x="2" y="2" width="140" height="26" rx="2" fill="rgba(157,78,221,0.2)" stroke="rgba(157,78,221,0.5)"/>
      <text x="18" y="19" font-family="monospace" font-size="9" font-weight="700" fill="#9D4EDD">✦ ART LIBRARY (48)</text>
      <text x="160" y="19" font-family="monospace" font-size="9" fill="#8E8E9F">★ CURATED (8)</text>

      <!-- Search bar inside sidebar -->
      <rect x="0" y="42" width="288" height="28" rx="2" fill="#0E0E14" stroke="#1F1F28"/>
      <text x="12" y="60" font-family="monospace" font-size="9" fill="#5A5A68">Search 48 recipes...</text>

      <!-- Sidebar Recipe List Item 1 -->
      <g transform="translate(0, 80)">
        <rect x="0" y="0" width="288" height="66" rx="2" fill="#12121A" stroke="#9D4EDD" stroke-width="1"/>
        <text x="12" y="20" font-family="monospace" font-size="10" font-weight="700" fill="#FFFFFF">HERO ASCII ONE</text>
        <rect x="220" y="8" width="56" height="15" rx="2" fill="#14141E" stroke="#1F1F28"/>
        <text x="226" y="19" font-family="monospace" font-size="8" fill="#9D4EDD">ANIMATED</text>
        <text x="12" y="36" font-family="monospace" font-size="8" fill="#8E8E9F">Rotating 3D character mesh with vanishing point.</text>
        <rect x="200" y="42" width="76" height="18" rx="2" fill="#14141E" stroke="#CCFF00"/>
        <text x="210" y="55" font-family="monospace" font-size="8" font-weight="700" fill="#CCFF00">APPLIED ✓</text>
      </g>

      <!-- Sidebar Recipe List Item 2 -->
      <g transform="translate(0, 156)">
        <rect x="0" y="0" width="288" height="66" rx="2" fill="#0E0E14" stroke="#1F1F28"/>
        <text x="12" y="20" font-family="monospace" font-size="10" font-weight="700" fill="#FFFFFF">MATRIX CASCADE</text>
        <rect x="225" y="8" width="50" height="15" rx="2" fill="#14141E" stroke="#1F1F28"/>
        <text x="232" y="19" font-family="monospace" font-size="8" fill="#33E533">MATRIX</text>
        <text x="12" y="36" font-family="monospace" font-size="8" fill="#8E8E9F">Phosphor code drops modulated by luminance.</text>
        <rect x="200" y="42" width="76" height="18" rx="2" fill="#14141E" stroke="#2B2B38"/>
        <text x="212" y="55" font-family="monospace" font-size="8" fill="#FFFFFF">APPLY STYLE</text>
      </g>
    </g>
  </g>

  <!-- 3. Central Canvas Workspace Stage (X: 320 to 1120) -->
  <g transform="translate(320, 56)">
    <!-- Stage Background & Grid -->
    <rect x="0" y="0" width="800" height="760" fill="#050507"/>
    
    <!-- Stage Toolbar Controls Overlay -->
    <g transform="translate(20, 15)">
      <rect x="0" y="0" width="220" height="28" rx="2" fill="rgba(10,10,14,0.85)" stroke="#1F1F28"/>
      <text x="14" y="18" font-family="monospace" font-size="10" fill="#8E8E9F">ZOOM: 100%</text>
      <text x="95" y="18" font-family="monospace" font-size="10" fill="#8E8E9F">FIT</text>
      <text x="135" y="18" font-family="monospace" font-size="10" fill="#CCFF00">1:1 NATIVE</text>
      <text x="195" y="18" font-family="monospace" font-size="10" fill="#8E8E9F">SPLIT</text>
    </g>

    <!-- Canvas Viewport Mat & Artwork -->
    <g transform="translate(120, 80)">
      <rect x="0" y="0" width="560" height="560" fill="#08080C" stroke="#1F1F28" stroke-width="1.5"/>

      <!-- Real Transformed Canvas Artwork Simulated -->
      <circle cx="280" cy="280" r="220" fill="url(#violetGlow)"/>
      <circle cx="280" cy="280" r="170" fill="#1A1829" stroke="#CCFF00" stroke-width="1.5"/>

      <!-- Dense Monospace Glyphs in Contours -->
      <g fill="#CCFF00" opacity="0.9" font-family="monospace" font-size="10">
        <text x="180" y="210">@ % # * + = - : .  0 1 0 1</text>
        <text x="160" y="230"># % @ S S # + = - : . . @ % #</text>
        <text x="140" y="250">@ % # * * + = - : . . . . @ % #</text>
        <text x="135" y="270">% % # * + = - - : . . . . . % % #</text>
        <text x="130" y="290"># % @ # * + = - : . . . . . # % @</text>
        <text x="140" y="310">@ % # * + = - : . . . . @ % # *</text>
        <text x="160" y="330">% # * + = - : . . . % # * + =</text>
        <text x="180" y="350">* + = - : . . . * + = - : .</text>
      </g>

      <!-- Viewport HUD Overlays -->
      <rect x="15" y="15" width="130" height="20" rx="2" fill="rgba(8,8,10,0.85)" stroke="#1F1F28"/>
      <text x="24" y="29" font-family="monospace" font-size="9" fill="#8E8E9F">640×640 @ 1.0 DPR</text>

      <rect x="420" y="15" width="125" height="20" rx="2" fill="rgba(8,8,10,0.85)" stroke="#CCFF00"/>
      <circle cx="430" cy="25" r="3" fill="#CCFF00"/>
      <text x="438" y="29" font-family="monospace" font-size="9" fill="#CCFF00">ACTIVE RASTER</text>
    </g>

    <!-- Bottom Timeline Bar (Oscillator & Frames) -->
    <g transform="translate(0, 760)">
      <rect x="0" y="0" width="800" height="56" fill="#0A0A0E" stroke="#1F1F28" stroke-width="1"/>
      <rect x="20" y="16" width="32" height="26" rx="2" fill="#CCFF00"/>
      <text x="32" y="33" fill="#08080A" font-weight="900" font-size="12">▶</text>
      <text x="65" y="33" font-family="monospace" font-size="11" fill="#FFFFFF">00:03.24</text>
      <text x="130" y="33" font-family="monospace" font-size="10" fill="#8E8E9F">SPEED: 1.2X</text>

      <!-- Oscillator Waveform track -->
      <rect x="230" y="26" width="450" height="6" rx="3" fill="#14141E"/>
      <rect x="230" y="26" width="220" height="6" rx="3" fill="#CCFF00"/>
      <circle cx="450" cy="29" r="6" fill="#FFFFFF" stroke="#CCFF00" stroke-width="2"/>
      <text x="700" y="33" font-family="monospace" font-size="10" fill="#8E8E9F">LOOP: ON</text>
    </g>
  </g>

  <!-- 4. Right Inspector Panel (Width 320) -->
  <g transform="translate(1120, 56)">
    <rect x="0" y="0" width="320" height="816" fill="#0A0A0E" stroke="#1F1F28" stroke-width="1"/>
    <!-- Header -->
    <rect x="0" y="0" width="320" height="42" fill="#0E0E14" stroke="#1F1F28" stroke-width="1"/>
    <text x="20" y="26" font-family="monospace" font-size="11" font-weight="700" fill="#FFFFFF">INSPECTOR PARAMETERS</text>
    <rect x="240" y="12" width="65" height="18" rx="2" fill="#14141E" stroke="#2B2B38"/>
    <text x="248" y="24" font-family="monospace" font-size="9" fill="#CCFF00">RESET ALL</text>

    <!-- Slider 1: Cell Size -->
    <g transform="translate(20, 60)">
      <text x="0" y="0" font-family="monospace" font-size="10" fill="#FFFFFF">CELL SIZE (GLYPH PITCH)</text>
      <text x="240" y="0" font-family="monospace" font-size="10" fill="#CCFF00">10 PX</text>
      <rect x="0" y="10" width="280" height="6" rx="3" fill="#14141E"/>
      <rect x="0" y="10" width="110" height="6" rx="3" fill="#CCFF00"/>
      <circle cx="110" cy="13" r="6" fill="#FFFFFF"/>
    </g>

    <!-- Slider 2: Glyph Density -->
    <g transform="translate(20, 110)">
      <text x="0" y="0" font-family="monospace" font-size="10" fill="#FFFFFF">GLYPH DENSITY RATIO</text>
      <text x="240" y="0" font-family="monospace" font-size="10" fill="#CCFF00">1.20×</text>
      <rect x="0" y="10" width="280" height="6" rx="3" fill="#14141E"/>
      <rect x="0" y="10" width="160" height="6" rx="3" fill="#CCFF00"/>
      <circle cx="160" cy="13" r="6" fill="#FFFFFF"/>
    </g>

    <!-- Slider 3: Raster Coverage -->
    <g transform="translate(20, 160)">
      <text x="0" y="0" font-family="monospace" font-size="10" fill="#FFFFFF">COVERAGE THRESHOLD</text>
      <text x="240" y="0" font-family="monospace" font-size="10" fill="#CCFF00">95%</text>
      <rect x="0" y="10" width="280" height="6" rx="3" fill="#14141E"/>
      <rect x="0" y="10" width="240" height="6" rx="3" fill="#CCFF00"/>
      <circle cx="240" cy="13" r="6" fill="#FFFFFF"/>
    </g>

    <!-- Slider 4: Edge Emphasis -->
    <g transform="translate(20, 210)">
      <text x="0" y="0" font-family="monospace" font-size="10" fill="#FFFFFF">SOBEL EDGE EMPHASIS</text>
      <text x="240" y="0" font-family="monospace" font-size="10" fill="#CCFF00">+30%</text>
      <rect x="0" y="10" width="280" height="6" rx="3" fill="#14141E"/>
      <rect x="0" y="10" width="90" height="6" rx="3" fill="#CCFF00"/>
      <circle cx="90" cy="13" r="6" fill="#FFFFFF"/>
    </g>

    <!-- Color Palette Section -->
    <g transform="translate(20, 275)">
      <text x="0" y="0" font-family="monospace" font-size="10" fill="#8E8E9F">ACTIVE COLOR SPECTRUM</text>
      <rect x="0" y="12" width="280" height="24" rx="2" stroke="#1F1F28" fill="#14141E"/>
      <rect x="2" y="14" width="54" height="20" fill="#08080A"/>
      <rect x="56" y="14" width="54" height="20" fill="#1F1F28"/>
      <rect x="110" y="14" width="54" height="20" fill="#9D4EDD"/>
      <rect x="164" y="14" width="54" height="20" fill="#CCFF00"/>
      <rect x="218" y="14" width="60" height="20" fill="#F4F4F6"/>
    </g>

    <!-- Effects Sliders -->
    <g transform="translate(20, 345)">
      <text x="0" y="0" font-family="monospace" font-size="10" fill="#FFFFFF">BLOOM RADIANCE</text>
      <text x="240" y="0" font-family="monospace" font-size="10" fill="#9D4EDD">45%</text>
      <rect x="0" y="10" width="280" height="6" rx="3" fill="#14141E"/>
      <rect x="0" y="10" width="130" height="6" rx="3" fill="#9D4EDD"/>
      <circle cx="130" cy="13" r="6" fill="#FFFFFF"/>
    </g>

    <g transform="translate(20, 395)">
      <text x="0" y="0" font-family="monospace" font-size="10" fill="#FFFFFF">CRT CATHODE SCANLINES</text>
      <text x="240" y="0" font-family="monospace" font-size="10" fill="#9D4EDD">55%</text>
      <rect x="0" y="10" width="280" height="6" rx="3" fill="#14141E"/>
      <rect x="0" y="10" width="150" height="6" rx="3" fill="#9D4EDD"/>
      <circle cx="150" cy="13" r="6" fill="#FFFFFF"/>
    </g>
  </g>

  <!-- 5. Status Diagnostics Footer -->
  <rect x="0" y="872" width="1440" height="28" fill="#060608" stroke="#1F1F28" stroke-width="1"/>
  <circle cx="20" cy="886" r="3" fill="#CCFF00"/>
  <text x="32" y="890" font-family="monospace" font-size="9" fill="#8E8E9F">CANVAS 2D HARDWARE ACCELERATED // 60.0 FPS // FRAME LATENCY: 0.84MS // MEMORY BUFFER: 1.2MB</text>
  <text x="1250" y="890" font-family="monospace" font-size="9" fill="#CCFF00">PIXELMUSE ENGINE OK</text>
</svg>`;
writeSvg('03-studio-workspace.svg', svg03);

// -----------------------------------------------------------------------------
// SCREENSHOT 4: ART LIBRARY GALLERY
// -----------------------------------------------------------------------------
const svg04 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background:#08080A; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <rect width="1440" height="900" fill="#08080A"/>
  
  <!-- Top Nav -->
  <rect x="0" y="0" width="1440" height="64" fill="#0A0A0E" stroke="#1F1F28" stroke-width="1"/>
  <circle cx="48" cy="32" r="12" fill="#CCFF00"/>
  <text x="44" y="37" font-weight="900" font-size="14" fill="#08080A">P</text>
  <text x="70" y="37" font-weight="900" font-size="16" letter-spacing="2" fill="#FFFFFF">PIXELMUSE</text>
  <text x="960" y="37" font-family="monospace" font-size="12" fill="#8E8E9F">STUDIO</text>
  <text x="1050" y="37" font-family="monospace" font-size="12" fill="#CCFF00" font-weight="700">ART LIBRARY</text>
  <text x="1170" y="37" font-family="monospace" font-size="12" fill="#8E8E9F">EXPLORE</text>

  <!-- Editorial Header -->
  <g transform="translate(80, 80)">
    <rect x="0" y="0" width="165" height="22" rx="2" fill="#14141E" stroke="#9D4EDD" stroke-width="0.8"/>
    <circle cx="10" cy="11" r="3" fill="#9D4EDD"/>
    <text x="20" y="15" font-family="monospace" font-size="10" fill="#9D4EDD" font-weight="700">COMMUNITY CATALOG</text>
    <text x="180" y="15" font-family="monospace" font-size="10" fill="#6A6A78">48 REGISTERED GENERATIVE RECIPES</text>

    <text x="0" y="65" font-weight="900" font-size="44" letter-spacing="-1.5" fill="#FFFFFF">
      THE ART LIBRARY
    </text>
    <text x="0" y="95" font-family="monospace" font-size="12" fill="#8E8E9F">
      Curated mathematical recipes from the community. One-click load directly into Studio.
    </text>

    <!-- Search Bar -->
    <g transform="translate(860, 45)">
      <rect x="0" y="0" width="420" height="42" rx="2" fill="#0E0E14" stroke="#1F1F28"/>
      <text x="16" y="25" font-family="monospace" font-size="12" fill="#5A5A68">🔍 Search 48 recipes by creator, tag, or formula...</text>
    </g>

    <!-- Category Pills -->
    <g transform="translate(0, 125)">
      <rect x="0" y="0" width="60" height="28" rx="2" fill="#CCFF00"/>
      <text x="16" y="18" font-family="monospace" font-size="11" font-weight="800" fill="#08080A">ALL (48)</text>

      <rect x="70" y="0" width="70" height="28" rx="2" fill="#14141E" stroke="#1F1F28"/>
      <text x="82" y="18" font-family="monospace" font-size="11" fill="#FFFFFF">ASCII (18)</text>

      <rect x="150" y="0" width="80" height="28" rx="2" fill="#14141E" stroke="#1F1F28"/>
      <text x="160" y="18" font-family="monospace" font-size="11" fill="#8E8E9F">MATRIX (6)</text>

      <rect x="240" y="0" width="105" height="28" rx="2" fill="#14141E" stroke="#1F1F28"/>
      <text x="250" y="18" font-family="monospace" font-size="11" fill="#8E8E9F">GEOMETRIC (8)</text>

      <rect x="355" y="0" width="100" height="28" rx="2" fill="#14141E" stroke="#1F1F28"/>
      <text x="365" y="18" font-family="monospace" font-size="11" fill="#8E8E9F">DITHERING (5)</text>

      <rect x="465" y="0" width="95" height="28" rx="2" fill="#14141E" stroke="#1F1F28"/>
      <text x="475" y="18" font-family="monospace" font-size="11" fill="#8E8E9F">MOSAIC (4)</text>

      <rect x="570" y="0" width="125" height="28" rx="2" fill="#14141E" stroke="#1F1F28"/>
      <text x="580" y="18" font-family="monospace" font-size="11" fill="#8E8E9F">ANIMATED BG (7)</text>
    </g>
  </g>

  <!-- Recipe Cards Grid (3 Columns) -->
  <g transform="translate(80, 260)">
    <!-- Recipe 1 -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="405" height="270" rx="3" fill="#0E0E14" stroke="#1F1F28"/>
      <!-- Canvas Preview Area -->
      <rect x="0" y="0" width="405" height="150" fill="#050508"/>
      <circle cx="200" cy="75" r="50" fill="url(#violetGlow)"/>
      <circle cx="200" cy="75" r="35" fill="none" stroke="#CCFF00" stroke-width="2"/>
      <text x="16" y="24" font-family="monospace" font-size="9" fill="#CCFF00">HERO MESH</text>
      <rect x="325" y="12" width="65" height="16" rx="2" fill="#14141E" stroke="#9D4EDD"/>
      <text x="332" y="23" font-family="monospace" font-size="8" fill="#9D4EDD">▶ ANIMATED</text>

      <text x="16" y="180" font-family="sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">Hero ASCII One</text>
      <text x="310" y="180" font-family="monospace" font-size="10" fill="#8E8E9F">by @larsen66</text>
      <text x="16" y="202" font-family="monospace" font-size="10" fill="#8E8E9F">Rotating 3D character mesh with vanishing point perspective.</text>
      
      <rect x="16" y="225" width="373" height="32" rx="2" fill="#CCFF00"/>
      <text x="150" y="246" font-family="monospace" font-size="11" font-weight="800" fill="#08080A">TRY THIS STYLE ↗</text>
    </g>

    <!-- Recipe 2 -->
    <g transform="translate(435, 0)">
      <rect x="0" y="0" width="405" height="270" rx="3" fill="#0E0E14" stroke="#1F1F28"/>
      <rect x="0" y="0" width="405" height="150" fill="#050805"/>
      <text x="170" y="80" font-family="monospace" font-size="12" fill="#33E533">01#*+:=~-</text>
      <circle cx="202" cy="75" r="45" fill="none" stroke="#33E533" stroke-width="1.5" stroke-dasharray="4,4"/>
      <text x="16" y="24" font-family="monospace" font-size="9" fill="#33E533">RAYMARCH</text>
      <rect x="325" y="12" width="65" height="16" rx="2" fill="#14141E" stroke="#33E533"/>
      <text x="332" y="23" font-family="monospace" font-size="8" fill="#33E533">▶ ANIMATED</text>

      <text x="16" y="180" font-family="sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">Hero ASCII Tunnel</text>
      <text x="290" y="180" font-family="monospace" font-size="10" fill="#8E8E9F">by @nikolas-sapa</text>
      <text x="16" y="202" font-family="monospace" font-size="10" fill="#8E8E9F">Concentric glowing ASCII ring loops racing toward viewer.</text>

      <rect x="16" y="225" width="373" height="32" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="145" y="246" font-family="monospace" font-size="11" font-weight="600" fill="#FFFFFF">TRY THIS STYLE ↗</text>
    </g>

    <!-- Recipe 3 -->
    <g transform="translate(870, 0)">
      <rect x="0" y="0" width="405" height="270" rx="3" fill="#0E0E14" stroke="#1F1F28"/>
      <rect x="0" y="0" width="405" height="150" fill="#08080C"/>
      <polygon points="202,35 240,75 202,115 164,75" fill="none" stroke="#CCFF00" stroke-width="2"/>
      <polygon points="202,50 225,75 202,100 179,75" fill="none" stroke="#9D4EDD" stroke-width="1.5"/>
      <text x="16" y="24" font-family="monospace" font-size="9" fill="#CCFF00">WIREFRAME</text>

      <text x="16" y="180" font-family="sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">ASCII Cube</text>
      <text x="310" y="180" font-family="monospace" font-size="10" fill="#8E8E9F">by @yacineMTB</text>
      <text x="16" y="202" font-family="monospace" font-size="10" fill="#8E8E9F">Rotating isometric 3D wireframe cube with Euler matrices.</text>

      <rect x="16" y="225" width="373" height="32" rx="2" fill="#14141E" stroke="#2B2B38"/>
      <text x="145" y="246" font-family="monospace" font-size="11" font-weight="600" fill="#FFFFFF">TRY THIS STYLE ↗</text>
    </g>
  </g>

  <!-- Bottom Pagination / Status Indicator -->
  <g transform="translate(80, 560)">
    <rect x="0" y="0" width="1280" height="40" rx="2" fill="#0A0A0E" stroke="#1F1F28"/>
    <text x="24" y="24" font-family="monospace" font-size="10" fill="#8E8E9F">SHOWING 3 OF 48 COMMUNITY RECIPES // FILTER: ALL // HARDWARE ACCELERATED RASTER ENGINE</text>
    <text x="1170" y="24" font-family="monospace" font-size="10" fill="#CCFF00">PAGE 1 OF 16 ↗</text>
  </g>
</svg>`;
writeSvg('04-art-library.svg', svg04);

// -----------------------------------------------------------------------------
// PNG VERSIONS GENERATION (Lightweight, crisp 720x450 bitmaps)
// -----------------------------------------------------------------------------
console.log('Generating crisp PNG counterparts...');

function makeGradientBackgroundPng(filename, primaryR, primaryG, primaryB) {
  const pngBuf = createPng(720, 450, (x, y) => {
    // Top bar
    if (y < 28) return [10, 10, 14, 255];
    // Border line
    if (y === 28 || y === 440 || x === 0 || x === 719) return [31, 31, 40, 255];
    // Center glow
    const dx = x - 360;
    const dy = y - 225;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const factor = (120 - dist) / 120;
      return [
        Math.min(255, Math.round(8 + primaryR * factor * 0.7)),
        Math.min(255, Math.round(8 + primaryG * factor * 0.7)),
        Math.min(255, Math.round(10 + primaryB * factor * 0.7)),
        255
      ];
    }
    // Background gradient
    const v = Math.round(8 + (y / 450) * 8);
    return [v, v, v + 2, 255];
  });
  fs.writeFileSync(path.join(OUT_DIR, filename), pngBuf);
  console.log(`✓ Generated PNG: ${filename} (${pngBuf.length} bytes)`);
}

makeGradientBackgroundPng('01-landing-hero.png', 204, 255, 0); // Acid Lime accent
makeGradientBackgroundPng('02-interactive-gallery.png', 157, 78, 221); // Violet accent
makeGradientBackgroundPng('03-studio-workspace.png', 204, 255, 0); // Studio lime accent
makeGradientBackgroundPng('04-art-library.png', 51, 229, 51); // Green terminal accent

console.log('All screenshot assets successfully created!');

