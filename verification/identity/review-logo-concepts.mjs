import { chromium, firefox, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const engine = process.argv[3] ?? "chromium";
if (!["chromium", "firefox"].includes(engine)) throw new Error("Invalid engine");
const directory = `verification/identity/logo-exploration/${engine}`;
await mkdir(directory, { recursive: true });
const origin = "http://127.0.0.1:3003";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3003"], { stdio: ["ignore", "pipe", "pipe"] });
let log = "", browser;
server.stdout.on("data", chunk => { log += chunk; }); server.stderr.on("data", chunk => { log += chunk; });
const { concepts } = JSON.parse(await readFile("public/brand/concepts.json", "utf8"));
const results = { engine, assets: [], viewports: [], errors: [], external: [], paletteContrast: {} };
const hash = buffer => createHash("sha256").update(buffer).digest("hex");
try {
  for (let i = 0; i < 120 && !log.includes("Ready in"); i++) {
    if (server.exitCode !== null) throw new Error(log);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!log.includes("Ready in")) throw new Error(log);
  const files = [];
  for (const concept of concepts) {
    for (const name of await readdir(`public/brand/${concept.id}`)) files.push(`${concept.id}/${name}`);
    files.push(`${concept.id}.zip`);
  }
  files.push("concepts.html", "brand-sheet.html", "GEIST-LICENSE.txt", "concepts.json");
  await Promise.all(files.map(async path => {
    const local = await readFile(`public/brand/${path}`), response = await fetch(`${origin}/brand/${path}`);
    const remote = Buffer.from(await response.arrayBuffer());
    if (!response.ok || hash(local) !== hash(remote)) throw new Error(`Asset mismatch: ${path}`);
    if (path.endsWith(".svg") && /<script|<image|<foreignObject|(?:src|href)=/i.test(local.toString())) throw new Error(`Non-vector/unsafe SVG: ${path}`);
    if (path.endsWith(".png")) {
      const metadata = await sharp(local).metadata();
      const match = path.match(/(?:favicon|app-icon)-(\d+)\.png$/);
      const expected = match ? Number(match[1]) : path.endsWith("apple-touch-icon.png") ? 180 : path.includes("/mark-") ? 512 : null;
      if (expected && (metadata.width !== expected || metadata.height !== expected)) throw new Error(`Wrong image dimensions: ${path}`);
      if (!expected && metadata.height !== 160) throw new Error(`Wrong logo dimensions: ${path}`);
      if (/\/(?:mark|logo)-/.test(path)) {
        const {data,info}=await sharp(local).ensureAlpha().raw().toBuffer({resolveWithObject:true});
        if (!data.some((value,index)=>index%info.channels===info.channels-1&&value===0)) throw new Error(`Missing transparent background: ${path}`);
      }
    }
    if (path.endsWith(".svg") && /-(?:black|white)\.svg$/.test(path)) {
      const expected=path.endsWith("-black.svg")?"#000000":"#ffffff";
      if ([...local.toString().matchAll(/#[a-f\d]{6}\b/gi)].some(match=>match[0].toLowerCase()!==expected)) throw new Error(`Non-monochrome artwork: ${path}`);
    }
    if (path.endsWith("favicon.ico")) {
      const count=local.readUInt16LE(4), sizes=[];
      for(let i=0;i<count;i++){
        const entry=6+16*i,size=local[entry],length=local.readUInt32LE(entry+8),offset=local.readUInt32LE(entry+12);
        const expected=await readFile(`public/brand/${path.replace("favicon.ico",`favicon-${size}.png`)}`);
        if (!local.subarray(offset,offset+length).equals(expected)) throw new Error(`ICO frame mismatch: ${path} ${size}`);
        sizes.push(size);
      }
      if (sizes.join(",")!=="16,32,48") throw new Error(`ICO size contract: ${path}`);
    }
    results.assets.push({ path, bytes: local.length, sha256: hash(local), type: response.headers.get("content-type") });
  }));
  results.assets.sort((a,b) => a.path.localeCompare(b.path));
  browser = await ({ chromium, firefox })[engine].launch({ env: { ...process.env, LD_LIBRARY_PATH: process.argv[2] ?? "" } });
  const page = await browser.newPage();
  page.on("pageerror", error => results.errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") results.errors.push(message.text()); });
  page.on("request", request => { if (!request.url().startsWith(origin) && !request.url().startsWith("data:")) results.external.push(request.url()); });
  for (const [width,height] of [[360,800],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]]) {
    await page.setViewportSize({ width,height });
    for (const name of ["concepts", "brand-sheet"]) {
      await page.goto(`${origin}/brand/${name}.html`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await expect.poll(() => page.locator("img").evaluateAll(elements => elements.every(el => el.complete && el.naturalWidth > 0))).toBe(true);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      if (overflow) throw new Error(`Overflow ${name} at ${width}`);
      await page.screenshot({ path: `${directory}/${name}-${width}.png`, fullPage: true });
      results.viewports.push({ width,height,name,overflow });
    }
  }
  await page.setViewportSize({ width:1440,height:1100 });
  await page.goto(`${origin}/brand/concepts.html`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path:engine === "chromium" ? "public/brand/concepts-preview.png" : `${directory}/concepts-preview.png`, fullPage:true });
  for (const concept of concepts) await page.locator(`#${concept.letter.toLowerCase()}`).screenshot({ path: `${directory}/concept-${concept.letter.toLowerCase()}.png` });
  await page.goto(`${origin}/brand/brand-sheet.html`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path:engine === "chromium" ? "public/brand/brand-sheet.png" : `${directory}/brand-sheet.png`, fullPage:true });
  if (engine === "chromium") await page.pdf({ path:"public/brand/brand-sheet.pdf", format:"A4", landscape:true, scale:.7, printBackground:true });
  await page.emulateMedia({media:"print"});
  const printText=await page.locator("p,h1,h2,h3,span,figcaption,strong").evaluateAll(elements=>{
    const rgb=value=>value.match(/[\d.]+/g)?.map(Number)??[0,0,0,0];
    const blend=(fg,bg)=>fg.slice(0,3).map((value,i)=>value*(fg[3]??1)+bg[i]*(1-(fg[3]??1)));
    const lum=color=>color.map(value=>{const n=value/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;}).reduce((sum,value,i)=>sum+value*[.2126,.7152,.0722][i],0);
    return elements.filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility==="visible").map(el=>{
      const chain=[];for(let parent=el;parent;parent=parent.parentElement)chain.unshift(parent);
      let bg=[255,255,255];for(const ancestor of chain)bg=blend(rgb(getComputedStyle(ancestor).backgroundColor),bg);
      const fg=blend(rgb(getComputedStyle(el).color),bg),a=lum(fg),b=lum(bg);
      return {text:el.textContent.slice(0,80),contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
    });
  });
  results.printTextContrast={samples:printText.length,minimum:Math.min(...printText.map(sample=>sample.contrast)),failures:printText.filter(sample=>sample.contrast<4.5)};
  if(results.printTextContrast.failures.length)throw new Error(JSON.stringify(results.printTextContrast));
  const luminance = hex => hex.match(/\w\w/g).map(value => parseInt(value,16)/255).map(value => value <= .04045 ? value/12.92 : ((value+.055)/1.055)**2.4).reduce((sum,value,i) => sum+value*[.2126,.7152,.0722][i],0);
  const contrast = (a,b) => { const x=luminance(a), y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
  results.paletteContrast = { primaryOnPaper:contrast("063f47","f2f6f5"), paleOnCanvas:contrast("8bd4db","050809"), interactiveOnCanvas:contrast("35b7c7","050809"), faviconInkOnTeal:contrast("f2f6f5","063f47") };
  if (results.errors.length || results.external.length || Object.values(results.paletteContrast).some(value=>value<4.5)) throw new Error(JSON.stringify(results));
} finally {
  await writeFile(`${directory}/observations.json`, JSON.stringify(results,null,2)+"\n");
  await browser?.close(); const closed=once(server,"close");server.kill("SIGTERM");await closed;
}
