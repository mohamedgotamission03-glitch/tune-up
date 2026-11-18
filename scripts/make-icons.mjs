// Generates Android launcher icons (legacy + adaptive) and a 512px Play Store icon from public/icon.svg.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RES = "android/app/src/main/res";
const svg = fs.readFileSync("public/icon.svg", "utf8");

// Foreground for adaptive icons: same artwork without the background tile, kept inside the 66% safe zone.
const inner = svg
  .replace(/<svg[^>]*>/, "")
  .replace("</svg>", "")
  .replace(/<rect[^>]*\/>/, "");
const foregroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g transform="translate(87 87) scale(0.66)">${inner}</g></svg>`;

const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

for (const [name, scale] of Object.entries(densities)) {
  const dir = path.join(RES, `mipmap-${name}`);
  fs.mkdirSync(dir, { recursive: true });
  const legacy = Math.round(48 * scale);
  const adaptive = Math.round(108 * scale);
  await sharp(Buffer.from(svg)).resize(legacy, legacy).png().toFile(path.join(dir, "ic_launcher.png"));
  await sharp(Buffer.from(svg)).resize(legacy, legacy).png().toFile(path.join(dir, "ic_launcher_round.png"));
  await sharp(Buffer.from(foregroundSvg)).resize(adaptive, adaptive).png().toFile(path.join(dir, "ic_launcher_foreground.png"));
}

const valuesDir = path.join(RES, "values");
fs.mkdirSync(valuesDir, { recursive: true });
fs.writeFileSync(
  path.join(valuesDir, "ic_launcher_background.xml"),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#2563EB</color>\n</resources>\n`,
);

fs.mkdirSync("store-artifacts", { recursive: true });
await sharp(Buffer.from(svg)).resize(512, 512).png().toFile("store-artifacts/play-store-icon-512.png");
