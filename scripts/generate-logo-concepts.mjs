// Static design exports only. No app code, favicon adoption, or build settings change.
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const destination = resolve(root, "public/brand");
const wordmark = JSON.parse(await readFile(resolve(root, "design/brand/wordmark-paths.json"), "utf8"));
export const concepts = [
  { id: "a-evidence-convergence", letter: "A", title: "Evidence convergence", meaning: "Three evidence fragments converge on one verified match.", construction: "Three horizontal fragments, three traceable paths, one result node with a check cut into its negative space.", small: "At 16px, two fragments replace three and the result node is enlarged; the check remains a transparent cutout.", strength: "The most direct explanation of evidence-level retrieval and verification. The asymmetric fragments-to-result silhouette stands on its own.", tradeoff: "The 16px version needs its dedicated optical drawing; shrinking the full mark loses the check." },
  { id: "b-evidence-search", letter: "B", title: "Evidence search", meaning: "Retrieval reveals the verified fragment among document chunks.", construction: "Two document fragments enter a circular search aperture; a visible check occupies the lens and the diagonal handle completes the retrieval silhouette.", small: "The lens, handle, and check are snapped to a dedicated 16px drawing with shorter fragment tabs.", strength: "The clearest search metaphor. Immediately understandable to a new user beside a terminal or documentation page.", tradeoff: "The magnifier is more familiar and less distinctive; the lens and check compete at the smallest size." },
  { id: "c-connected-v", letter: "C", title: "Connected V", meaning: "Retrieved chunks connect into a verification path.", construction: "Two separate chunks form the descending arm; a short joining path and continuous ascending arm resolve into a V.", small: "The hairline connection is removed at 16px, retaining the separated chunk and bold V silhouette.", strength: "The strongest letter-like silhouette and the simplest small-size drawing. V suggests validation without forcing an R monogram.", tradeoff: "Its retrieval meaning is more abstract; without context it can read as a general verification mark." },
];

const bodyOf = svg => svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>"));
const svg = (body, size = 32, width = size, title = "RAGvidence") => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${size}" viewBox="0 0 ${width} ${size}" role="img" aria-labelledby="title"><title id="title">${title}</title>${body}</svg>\n`;
const variants = [
  { name: "dark", ink: "#f2f6f5", accent: "#8bd4db" },
  { name: "light", ink: "#063f47", accent: "#063f47" },
  { name: "black", ink: "#000000", accent: "#000000" },
  { name: "white", ink: "#ffffff", accent: "#ffffff" },
];
const paint = (body, ink, accent = ink) => body.replaceAll("#063f47", ink).replace(/<path data-accent="true"([^>]*)(>)/g, (match, attrs, close) => {
  if (attrs.includes('fill="none"')) return `<path data-accent="true"${attrs.replace(`stroke="${ink}"`, `stroke="${accent}"`)}${close}`;
  return `<path data-accent="true" fill="${accent}"${attrs}${close}`;
});

function makeIco(frames) {
  const header = Buffer.alloc(6 + 16 * frames.length);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  for (let i = 0; i < frames.length; i++) {
    const entry = 6 + 16 * i, { size, buffer } = frames[i];
    header[entry] = size; header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(buffer.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
    offset += buffer.length;
  }
  return Buffer.concat([header, ...frames.map(frame => frame.buffer)]);
}

await mkdir(destination, { recursive: true });
for (const concept of concepts) {
  const directory = resolve(destination, concept.id);
  await mkdir(directory, { recursive: true });
  const master = await readFile(resolve(root, `design/brand/${concept.id}.svg`), "utf8");
  const body = bodyOf(master);
  for (const variant of variants) {
    const mark = svg(paint(body, variant.ink, variant.accent));
    await writeFile(resolve(directory, `mark-${variant.name}.svg`), mark);
    await sharp(Buffer.from(mark), { density: 1152 }).png().toFile(resolve(directory, `mark-${variant.name}.png`));
    const letters = wordmark.paths.map(path => `<path fill="${path.rag ? variant.accent : variant.ink}" transform="translate(${path.x} ${wordmark.baseline}) scale(${wordmark.scale} ${-wordmark.scale})" d="${path.d}"/>`).join("");
    const logo = svg(`<g transform="scale(1.25)">${paint(body, variant.ink, variant.accent)}</g>${letters}`, 40, wordmark.width);
    await writeFile(resolve(directory, `logo-${variant.name}.svg`), logo);
    await sharp(Buffer.from(logo), { density: 288 }).png().toFile(resolve(directory, `logo-${variant.name}.png`));
  }
  const small = await readFile(resolve(root, `design/brand/${concept.letter.toLowerCase()}-favicon-16.svg`));
  const frames = [];
  for (const size of [16, 32, 48]) {
    // Three independent optical grids: dedicated 16px; full 32px; more space at 48px.
    const source = size === 16 ? small : Buffer.from(svg(`<rect width="${size}" height="${size}" rx="${size === 32 ? 6 : 9}" fill="#063f47"/><g${size === 48 ? ' transform="translate(4 4) scale(1.25)"' : ""}>${paint(body, "#f2f6f5")}</g>`, size));
    await writeFile(resolve(directory, `favicon-${size}.svg`), source);
    const png = await sharp(source).png().toBuffer();
    await writeFile(resolve(directory, `favicon-${size}.png`), png);
    frames.push({ size, buffer: png });
  }
  await writeFile(resolve(directory, "favicon.svg"), small);
  await writeFile(resolve(directory, "favicon.ico"), makeIco(frames));
  for (const size of [180, 192, 512]) {
    const source = svg(`<rect width="32" height="32"${size === 180 ? "" : ' rx="5"'} fill="#063f47"/><g transform="translate(3.2 3.2) scale(.8)">${paint(body, "#f2f6f5")}</g>`);
    await sharp(Buffer.from(source), { density: 72 * size / 32 }).png().toFile(resolve(directory, size === 180 ? "apple-touch-icon.png" : `app-icon-${size}.png`));
  }
  const tab = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${concept.letter} · ${concept.title} — RAGvidence</title><link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#050809;color:#f2f6f5;font:18px/1.7 system-ui}main{max-width:760px;margin:80px auto;padding:32px}img{width:350px;max-width:100%;height:auto}h1{font-size:24px}p{color:#a4b0ae}a{color:#8bd4db}</style></head><body><main><img src="logo-dark.svg" alt="RAGvidence"><h1>${concept.letter}. ${concept.title}</h1><p>${concept.meaning}</p><p>This browser tab uses the actual dedicated 16×16 PNG favicon.</p><a href="../concepts.html">Compare all three concepts</a></main></body></html>`;
  await writeFile(resolve(directory, "tab-preview.html"), tab);
  await writeFile(resolve(directory, "README.txt"), `${concept.letter}. ${concept.title}\n${concept.meaning}\n\nConstruction: ${concept.construction}\n16px adaptation: ${concept.small}\n\nUse logo-dark/mark-dark on dark surfaces; light variants on off-white. Black and white variants are one-color transparent artwork. SVGs have editable vector paths and outlined Geist lettering. PNG logo/mark exports are transparent. Favicon and app exports intentionally have a solid Abyssal Teal field.\n\nRAGvidence is the exact wordmark capitalization. See ../brand-sheet.html for use guidance.\n`);
}
await writeFile(resolve(destination, "GEIST-LICENSE.txt"), await readFile(resolve(root, "node_modules/geist/LICENSE.txt")));
await writeFile(resolve(destination, "concepts.json"), JSON.stringify({ concepts, colors: { primary: "#063f47", accent: "#8bd4db", interactive: "#35b7c7", canvas: "#050809", paper: "#f2f6f5" }, adopted: null }, null, 2) + "\n");
console.log("Exported three complete vector/PNG/ICO families. Website branding remains restored.");
