// Generate 128x128 PNG icons for both extensions using only Node.js built-in modules
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPNG(width, height, pixelData) {
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR chunk
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8;  // bit depth
    ihdrData[9] = 6;  // color type: RGBA
    ihdrData[10] = 0; // compression
    ihdrData[11] = 0; // filter
    ihdrData[12] = 0; // interlace
    const ihdr = makeChunk('IHDR', ihdrData);

    // IDAT chunk - raw pixel rows with filter byte
    const rawRows = [];
    for (let y = 0; y < height; y++) {
        rawRows.push(Buffer.from([0])); // filter: none
        rawRows.push(pixelData.slice(y * width * 4, (y + 1) * width * 4));
    }
    const raw = Buffer.concat(rawRows);
    const compressed = zlib.deflateSync(raw);
    const idat = makeChunk('IDAT', compressed);

    // IEND chunk
    const iend = makeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeB = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeB, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcData) >>> 0, 0);
    return Buffer.concat([len, typeB, data, crc]);
}

// CRC-32 implementation
function crc32(buf) {
    let table = crc32.table;
    if (!table) {
        table = crc32.table = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            table[i] = c;
        }
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function setPixel(pixels, w, x, y, r, g, b, a) {
    if (x < 0 || x >= w || y < 0 || y >= w) return;
    const i = (y * w + x) * 4;
    // Alpha blend
    const srcA = a / 255;
    const dstA = pixels[i + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA > 0) {
        pixels[i] = Math.round((r * srcA + pixels[i] * dstA * (1 - srcA)) / outA);
        pixels[i + 1] = Math.round((g * srcA + pixels[i + 1] * dstA * (1 - srcA)) / outA);
        pixels[i + 2] = Math.round((b * srcA + pixels[i + 2] * dstA * (1 - srcA)) / outA);
        pixels[i + 3] = Math.round(outA * 255);
    }
}

function fillRect(pixels, w, x0, y0, rw, rh, r, g, b, a) {
    for (let dy = 0; dy < rh; dy++)
        for (let dx = 0; dx < rw; dx++)
            setPixel(pixels, w, x0 + dx, y0 + dy, r, g, b, a === undefined ? 255 : a);
}

function fillCircle(pixels, w, cx, cy, rad, r, g, b, a) {
    for (let dy = -rad; dy <= rad; dy++)
        for (let dx = -rad; dx <= rad; dx++)
            if (dx * dx + dy * dy <= rad * rad)
                setPixel(pixels, w, cx + dx, cy + dy, r, g, b, a === undefined ? 255 : a);
}

function fillRoundedRect(pixels, w, x0, y0, rw, rh, rad, r, g, b, a) {
    // Center rectangle
    fillRect(pixels, w, x0 + rad, y0, rw - 2 * rad, rh, r, g, b, a);
    // Left/right strips
    fillRect(pixels, w, x0, y0 + rad, rad, rh - 2 * rad, r, g, b, a);
    fillRect(pixels, w, x0 + rw - rad, y0 + rad, rad, rh - 2 * rad, r, g, b, a);
    // Corners
    for (let dy = 0; dy < rad; dy++)
        for (let dx = 0; dx < rad; dx++) {
            if (dx * dx + dy * dy <= rad * rad) {
                setPixel(pixels, w, x0 + rad - 1 - dx, y0 + rad - 1 - dy, r, g, b, a); // TL
                setPixel(pixels, w, x0 + rw - rad + dx, y0 + rad - 1 - dy, r, g, b, a); // TR
                setPixel(pixels, w, x0 + rad - 1 - dx, y0 + rh - rad + dy, r, g, b, a); // BL
                setPixel(pixels, w, x0 + rw - rad + dx, y0 + rh - rad + dy, r, g, b, a); // BR
            }
        }
}

// ─── Server Icon: Monitor/Dashboard with chart ───
function generateServerIcon() {
    const S = 128;
    const pixels = Buffer.alloc(S * S * 4);

    // Background: dark rounded rect (#1E293B slate-800)
    fillRoundedRect(pixels, S, 0, 0, S, S, 20, 30, 41, 59, 255);

    // Inner glow border
    fillRoundedRect(pixels, S, 2, 2, S - 4, S - 4, 18, 51, 65, 85, 255);
    fillRoundedRect(pixels, S, 4, 4, S - 8, S - 8, 16, 30, 41, 59, 255);

    // Monitor Screen (#0F172A)
    fillRoundedRect(pixels, S, 16, 18, 96, 62, 8, 15, 23, 42, 255);
    // Screen inner border
    fillRoundedRect(pixels, S, 18, 20, 92, 58, 6, 56, 189, 248, 40);
    fillRoundedRect(pixels, S, 20, 22, 88, 54, 5, 15, 23, 42, 255);

    // Chart bars inside screen
    const barColors = [
        [56, 189, 248],  // sky-400
        [34, 211, 238],  // cyan-400
        [99, 102, 241],  // indigo-400
        [168, 85, 247],  // purple-400
        [56, 189, 248],  // sky-400
        [34, 211, 238],  // cyan-400
    ];
    const barHeights = [28, 38, 22, 42, 32, 36];
    const barW = 10;
    const gap = 3;
    const startX = 26;
    const baseY = 72;
    for (let i = 0; i < 6; i++) {
        const x = startX + i * (barW + gap);
        const h = barHeights[i];
        const [cr, cg, cb] = barColors[i];
        fillRoundedRect(pixels, S, x, baseY - h, barW, h, 2, cr, cg, cb, 220);
    }

    // Grid lines on screen (subtle)
    for (let gy = 30; gy < 72; gy += 10) {
        for (let gx = 22; gx < 106; gx += 2) {
            setPixel(pixels, S, gx, gy, 56, 189, 248, 25);
        }
    }

    // Monitor stand
    fillRect(pixels, S, 54, 82, 20, 6, 100, 116, 139, 255);
    fillRect(pixels, S, 44, 88, 40, 4, 100, 116, 139, 255);

    // Pulse dot (top-right of screen)
    fillCircle(pixels, S, 98, 28, 4, 52, 211, 153, 255);   // emerald
    fillCircle(pixels, S, 98, 28, 2, 110, 231, 183, 255);  // lighter center

    // "S" letter badge bottom-right
    fillCircle(pixels, S, 106, 106, 14, 56, 189, 248, 255);
    fillCircle(pixels, S, 106, 106, 11, 30, 41, 59, 255);
    // Simple S shape using rectangles
    fillRect(pixels, S, 101, 99, 10, 3, 56, 189, 248, 255);
    fillRect(pixels, S, 99, 99, 4, 7, 56, 189, 248, 255);
    fillRect(pixels, S, 101, 104, 10, 3, 56, 189, 248, 255);
    fillRect(pixels, S, 109, 104, 4, 7, 56, 189, 248, 255);
    fillRect(pixels, S, 101, 109, 10, 3, 56, 189, 248, 255);

    return createPNG(S, S, pixels);
}

// ─── Client Icon: PC/User with sync arrows ───
function generateClientIcon() {
    const S = 128;
    const pixels = Buffer.alloc(S * S * 4);

    // Background: dark rounded rect (#1A2332 darker blue-gray)
    fillRoundedRect(pixels, S, 0, 0, S, S, 20, 26, 35, 50, 255);

    // Inner glow border
    fillRoundedRect(pixels, S, 2, 2, S - 4, S - 4, 18, 45, 55, 72, 255);
    fillRoundedRect(pixels, S, 4, 4, S - 8, S - 8, 16, 26, 35, 50, 255);

    // Laptop base (#0F172A)
    fillRoundedRect(pixels, S, 20, 28, 88, 54, 6, 15, 23, 42, 255);
    // Screen border
    fillRoundedRect(pixels, S, 22, 30, 84, 50, 5, 52, 211, 153, 40);
    fillRoundedRect(pixels, S, 24, 32, 80, 46, 4, 15, 23, 42, 255);

    // Laptop keyboard base
    fillRoundedRect(pixels, S, 14, 84, 100, 10, 4, 71, 85, 105, 255);
    fillRoundedRect(pixels, S, 16, 86, 96, 6, 3, 51, 65, 85, 255);

    // Sync arrows on screen (green)
    // Circular arrow 1 (top)
    const arrowColor = [52, 211, 153]; // emerald-400
    // Top arc
    for (let angle = -30; angle < 160; angle += 3) {
        const rad = angle * Math.PI / 180;
        const px = Math.round(64 + 18 * Math.cos(rad));
        const py = Math.round(54 + 18 * Math.sin(rad));
        fillCircle(pixels, S, px, py, 2, arrowColor[0], arrowColor[1], arrowColor[2], 200);
    }
    // Arrowhead at end of arc
    fillRect(pixels, S, 78, 46, 6, 3, arrowColor[0], arrowColor[1], arrowColor[2], 220);
    fillRect(pixels, S, 80, 43, 3, 6, arrowColor[0], arrowColor[1], arrowColor[2], 220);

    // Bottom arc
    for (let angle = 150; angle < 340; angle += 3) {
        const rad = angle * Math.PI / 180;
        const px = Math.round(64 + 18 * Math.cos(rad));
        const py = Math.round(54 + 18 * Math.sin(rad));
        fillCircle(pixels, S, px, py, 2, arrowColor[0], arrowColor[1], arrowColor[2], 200);
    }
    // Arrowhead at end of bottom arc
    fillRect(pixels, S, 44, 62, 6, 3, arrowColor[0], arrowColor[1], arrowColor[2], 220);
    fillRect(pixels, S, 46, 59, 3, 6, arrowColor[0], arrowColor[1], arrowColor[2], 220);

    // Center dot
    fillCircle(pixels, S, 64, 54, 4, 52, 211, 153, 255);
    fillCircle(pixels, S, 64, 54, 2, 110, 231, 183, 255);

    // "C" letter badge bottom-right
    fillCircle(pixels, S, 106, 106, 14, 52, 211, 153, 255);
    fillCircle(pixels, S, 106, 106, 11, 26, 35, 50, 255);
    // C shape
    fillRect(pixels, S, 100, 99, 3, 14, 52, 211, 153, 255);
    fillRect(pixels, S, 100, 99, 12, 3, 52, 211, 153, 255);
    fillRect(pixels, S, 100, 110, 12, 3, 52, 211, 153, 255);

    // WiFi/Signal bars top-right
    fillRect(pixels, S, 90, 42, 3, 6, 52, 211, 153, 180);
    fillRect(pixels, S, 95, 39, 3, 9, 52, 211, 153, 200);
    fillRect(pixels, S, 100, 36, 3, 12, 52, 211, 153, 220);

    return createPNG(S, S, pixels);
}

// Generate and save
const serverPng = generateServerIcon();
const serverPath = path.join(__dirname, 'server-extension', 'resources', 'icon.png');
fs.writeFileSync(serverPath, serverPng);
console.log(`Server icon: ${serverPath} (${serverPng.length} bytes)`);

const clientDir = path.join(__dirname, 'client-extension', 'resources');
if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir, { recursive: true });
const clientPath = path.join(clientDir, 'icon.png');
fs.writeFileSync(clientPath, generateClientIcon());
console.log(`Client icon: ${clientPath}`);
console.log('Done!');
