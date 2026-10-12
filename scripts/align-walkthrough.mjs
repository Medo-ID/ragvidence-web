// Derive caption boundaries from the encoded frames, whose clock can differ
// from recording wall time. Each chapter has a distinct, static heading.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export async function alignWalkthrough(browser, frameUrl, videoUrl, cues) {
  const encoded = (await readFile(fileURLToPath(videoUrl))).toString("base64");
  const page = await browser.newPage();
  try {
    await page.goto(frameUrl);
    await page.setContent('<video preload="auto"></video>');
    return await page.locator("video").evaluate(async (video, { encoded, cues }) => {
      const bytes = Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));
      video.src = URL.createObjectURL(new Blob([bytes], { type: "video/webm" }));
      await new Promise((resolve, reject) => {
        video.addEventListener("loadedmetadata", resolve, { once: true });
        video.addEventListener("error", () => reject(new Error("Recorded video could not decode")), { once: true });
      });
      const canvas = document.createElement("canvas");
      canvas.width = 1120;
      canvas.height = 40;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      async function pixelsAt(time) {
        const sought = new Promise((resolve) => video.addEventListener("seeked", resolve, { once: true }));
        video.currentTime = Math.max(0.001, Math.min(time, video.duration - 0.05));
        await sought;
        context.drawImage(video, 50, 116, 1120, 40, 0, 0, 1120, 40);
        return context.getImageData(0, 0, 1120, 40).data;
      }
      const ratio = video.duration / cues.at(-1).end;
      const templates = [];
      for (const cue of cues) templates.push(await pixelsAt((cue.start + cue.end) / 2 * ratio));
      async function chapterAt(time) {
        const pixels = await pixelsAt(time);
        const distances = templates.map((reference) => {
          let distance = 0;
          for (let i = 0; i < pixels.length; i += 16) {
            distance += Math.abs(pixels[i] - reference[i]) + Math.abs(pixels[i + 1] - reference[i + 1]) + Math.abs(pixels[i + 2] - reference[i + 2]);
          }
          return distance;
        });
        return distances.indexOf(Math.min(...distances));
      }
      const starts = [0];
      let current = 0;
      for (let time = 0.5; time < video.duration; time += 0.5) {
        const chapter = await chapterAt(time);
        if (chapter === current) continue;
        if (chapter !== current + 1) throw new Error("Video chapter sequence could not be aligned");
        let low = time - 0.5;
        let high = time;
        while (high - low > 0.04) {
          const mid = (low + high) / 2;
          if (await chapterAt(mid) === current) low = mid;
          else high = mid;
        }
        starts.push(high);
        current = chapter;
      }
      if (starts.length !== cues.length) throw new Error("Missing video chapter");
      return cues.map((cue, i) => ({ ...cue, start: starts[i], end: starts[i + 1] ?? video.duration }));
    }, { encoded, cues });
  } finally { await page.close(); }
}
