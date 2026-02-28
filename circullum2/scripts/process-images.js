const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const archiver = require('archiver');

const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'images');
const outDir = path.join(imagesDir, 'optimized');
const required = [
    'hero-campus.jpg',
    'students-learning.jpg',
    'lab-activity.jpg',
    'capstone-project.jpg',
    'campus-life.jpg',
    'dormitory.jpg'
];

if (!fs.existsSync(imagesDir)) {
    console.error('images/ directory not found. Please add your photos into images/.');
    process.exit(1);
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function processFile(filename) {
    const src = path.join(imagesDir, filename);
    if (!fs.existsSync(src)) {
        console.warn(`Missing: ${filename} — skipping.`);
        return null;
    }

    const img = sharp(src);
    const meta = await img.metadata();

    // Warn if orientation or size issues
    if (meta.width && meta.width < 1600) console.warn(`${filename}: width ${meta.width}px — less than recommended 1600px`);
    if (meta.orientation && meta.orientation !== 1) console.log(`${filename}: orientation ${meta.orientation}`);

    // Basic enhancement: normalize, slight brighten, increase saturation, sharpen
    let pipeline = img.ensureAlpha().rotate().resize({ width: 1600, withoutEnlargement: true })
        .normalize()
        .modulate({ brightness: 1.03, saturation: 1.08 })
        .sharpen();

    // Optional: read overlay config (images/overlays.json) to apply white rectangles
    const overlaysPath = path.join(imagesDir, 'overlays.json');
    if (fs.existsSync(overlaysPath)) {
        try {
            const overlays = JSON.parse(fs.readFileSync(overlaysPath, 'utf8')) || {};
            const cfg = overlays[filename];
            if (cfg && Array.isArray(cfg.rects)) {
                // create an SVG overlay with white rects in percent coordinates
                const svgRects = cfg.rects.map(r => {
                    // r: {xPct, yPct, wPct, hPct, opacity}
                    const opacity = r.opacity != null ? r.opacity : 1;
                    return `<rect x="${r.xPct}%" y="${r.yPct}%" width="${r.wPct}%" height="${r.hPct}%" fill="white" fill-opacity="${opacity}" />`;
                }).join('\n');
                const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${meta.width} ${meta.height}">${svgRects}</svg>`;
                pipeline = pipeline.composite([{ input: Buffer.from(svg), blend: 'over' }]);
            }
        } catch (e) {
            console.warn('Could not parse overlays.json — skipping overlays.');
        }
    }

    const outPath = path.join(outDir, filename.replace(/\.jpg$|\.jpeg$/i, '.jpg'));
    await pipeline.jpeg({ quality: 80, chromaSubsampling: '4:2:0' }).toFile(outPath);
    const { size } = fs.statSync(outPath);
    console.log(`Processed ${filename} -> ${path.relative(root,outPath)} (${(size/1024).toFixed(0)} KB)`);
    return outPath;
}

async function run() {
    const processed = [];
    for (const f of required) {
        try {
            const out = await processFile(f);
            if (out) processed.push(out);
        } catch (err) {
            console.error(`Error processing ${f}:`, err.message);
        }
    }

    if (processed.length === 0) {
        console.warn('No images processed. Add photos to images/ and re-run.');
        return;
    }

    // create zip for upload
    const zipPath = path.join(imagesDir, 'optimized-images.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => console.log(`Created ${path.relative(root,zipPath)} (${(archive.pointer()/1024).toFixed(0)} KB)`));
    archive.on('error', err => { throw err; });
    archive.pipe(output);
    processed.forEach(p => archive.file(p, { name: path.basename(p) }));
    await archive.finalize();
}

run().catch(err => { console.error(err);
    process.exit(1) });