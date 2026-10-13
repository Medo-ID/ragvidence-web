// Authoring only: use the existing Next.js Sharp dependency; no runtime generator.
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const mark = await readFile(resolve(root, "public/brand/ragvidence-mark.svg"));
await writeFile(resolve(root, "src/app/icon.svg"), mark);
await sharp(mark, { density: 1152 }).resize(512, 512).png().toFile(resolve(root, "public/brand/ragvidence-mark.png"));

// Apple applies its own mask; a full-bleed background avoids doubled corners.
const apple = Buffer.from(mark.toString().replace('rx="9"', 'rx="0"'));
await sharp(apple, { density: 405 }).resize(180, 180).png().toFile(resolve(root, "src/app/apple-icon.png"));

const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map(size => sharp(mark, { density: 72 * size / 32 }).resize(size, size).png().toBuffer()));
const directory = Buffer.alloc(6 + 16 * frames.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(frames.length, 4);
let offset = directory.length;
for (let i = 0; i < frames.length; i++) {
  const entry = 6 + 16 * i;
  directory[entry] = sizes[i];
  directory[entry + 1] = sizes[i];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frames[i].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frames[i].length;
}
await writeFile(resolve(root, "src/app/favicon.ico"), Buffer.concat([directory, ...frames]));

for (const variant of ["", "-light"]) {
  const path = resolve(root, `public/brand/ragvidence-logo${variant}`);
  const svg = await readFile(`${path}.svg`);
  await sharp(svg, { density: 288 }).png().toFile(`${path}.png`);
}
console.log("Generated SVG favicon, 16/32/48px ICO, 180px Apple icon, and transparent PNG exports.");
