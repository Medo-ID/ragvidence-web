// Render the maintained vector mark into native favicon and touch-icon assets.
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const svg = await readFile("src/app/icon.svg", "utf8");
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const images = [];
  for (const size of [16, 32, 48, 180]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;background:transparent}svg{display:block;width:100%;height:100%}</style>${svg}`);
    const png = await page.screenshot({ omitBackground: true });
    if (size === 180) await writeFile("src/app/apple-icon.png", png);
    else images.push({ size, png });
  }
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, index) => {
    const entry = 6 + index * 16;
    header[entry] = size; header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  await writeFile("src/app/favicon.ico", Buffer.concat([header, ...images.map(image => image.png)]));
  console.log("Generated 16/32/48px favicon and 180px touch icon from the evidence/CLI vector.");
} finally { await browser.close(); }
