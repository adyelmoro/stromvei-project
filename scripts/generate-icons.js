/**
 * Generates PWA icons from public/favicon.svg using sharp.
 * Run once: node scripts/generate-icons.js
 * Output: public/icons/icon-{192,512}.png + maskable variants
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SVG_PATH = path.join(__dirname, "../public/favicon.svg");
const OUT_DIR = path.join(__dirname, "../public/icons");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const svgBuffer = fs.readFileSync(SVG_PATH);

async function generate() {
  // Standard icons — tight crop, icon fills the frame
  for (const size of [192, 512]) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(OUT_DIR, `icon-${size}.png`));
    console.log(`✓ icon-${size}.png`);
  }

  // Maskable icons — 20% safe-zone padding on all sides so the bolt
  // is never clipped by circular/squircle masks on Android launchers.
  for (const size of [192, 512]) {
    const pad = Math.round(size * 0.12); // 12% padding each side
    const inner = size - pad * 2;

    const iconBuffer = await sharp(svgBuffer)
      .resize(inner, inner)
      .png()
      .toBuffer();

    // Dark background matching brand-dark (#0A0E1A)
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 10, g: 14, b: 26, alpha: 1 },
      },
    })
      .composite([{ input: iconBuffer, top: pad, left: pad }])
      .png()
      .toFile(path.join(OUT_DIR, `maskable-${size}.png`));
    console.log(`✓ maskable-${size}.png`);
  }

  console.log("\nAll icons written to public/icons/");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
