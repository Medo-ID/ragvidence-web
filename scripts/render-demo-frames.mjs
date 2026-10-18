// Fixed native screenshots with simple cuts: no invented terminal output or scores.
export async function prepareDemoRenderer(page, captures, _points, fontCSS) {
  await page.setContent(`<style>${fontCSS}</style><canvas width="1920" height="1080"></canvas>`);
  await page.evaluate(async captures => {
    const images = {};
    for (const [name, encoded] of Object.entries(captures)) { const image = new Image(); image.src = `data:image/png;base64,${encoded}`; await image.decode(); images[name] = image; }
    const canvas = document.querySelector("canvas"), context = canvas.getContext("2d");
    window.renderFrame = time => {
      const scene = time < 6 ? "files" : time < 12 ? "inspect" : time < 18 ? "review" : time < 24 ? "compare" : time < 30 ? "summary" : "evidence";
      context.drawImage(images[scene], 0, 0);
      return canvas.toDataURL("image/jpeg", 0.98).split(",")[1];
    };
  }, captures);
}
