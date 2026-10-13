// Native 1080p captures; two purposeful zooms, fixed-size cursor, clean cuts.
export async function prepareDemoRenderer(page, captures, points, fontCSS, typing) {
  await page.setContent(`<style>${fontCSS}</style><canvas width="1920" height="1080"></canvas>`);
  await page.evaluate(async ({ captures, points, typing }) => {
    await document.fonts.load('28px "Geist Mono"');
    const images = {};
    for (const [name, encoded] of Object.entries(captures)) {
      const img = new Image(); img.src = `data:image/png;base64,${encoded}`; await img.decode(); images[name] = img;
    }
    const canvas = document.querySelector("canvas"), ctx = canvas.getContext("2d");
    const ease = t => t * t * (3 - 2 * t), clamp = t => Math.max(0, Math.min(1, t));
    function cursorAt(time) {
      const keys = [[0, 280, 148], [3, 280, 148], [3.4, 1700, 940], [20.7, 1700, 940], [21.6, points.link.x, points.link.y], [22, points.link.x, points.link.y], [22.3, 1660, 440], [26, 1660, 440], [26.9, points.improvementsLink.x, points.improvementsLink.y], [27, points.improvementsLink.x, points.improvementsLink.y], [27.7, points.question.x, points.question.y], [28.2, points.question.x, points.question.y], [28.6, 1700, 230], [36, 1700, 230]];
      const index = keys.findIndex(key => key[0] >= time);
      if (index <= 0) return keys[0].slice(1);
      const a = keys[index - 1], b = keys[index], t = ease(clamp((time - a[0]) / (b[0] - a[0])));
      return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    }
    window.renderFrame = time => {
      const scene = time < 1.6 ? "initTyping" : time < 3 ? "initDone" : time < 9 ? "dataset" : time < 10.7 ? "benchmarkTyping" : time < 14 ? "benchmarkDone" : time < 15.3 ? "evaluateTyping" : time < 18 ? "evaluateDone" : time < 20.8 ? "reportTyping" : time < 22 ? "reportDone" : time < 27 ? "summary" : time < 28.2 ? "closed" : "opened";
      const zoom = time >= 9 && time < 14 ? 1 + 0.18 * ease(clamp((time - 9.1) / 0.4)) : time >= 28.2 ? 1 + 0.18 * ease(clamp((time - 29.2) / 0.4)) : 1;
      const dx = (1920 - 1920 * zoom) / 2;
      ctx.resetTransform(); ctx.fillStyle = "#050809"; ctx.fillRect(0, 0, 1920, 1080);
      ctx.setTransform(zoom, 0, 0, zoom, dx, 0); ctx.drawImage(images[scene], 0, 0);
      const entry = scene === "initTyping" ? [typing.init, 0.2, 1.15] : scene === "benchmarkTyping" ? [typing.benchmark, 9.1, 1.4] : scene === "evaluateTyping" ? [typing.evaluate, 14.1, 1.05] : scene === "reportTyping" ? [typing.report, 18.1, 2.4] : null;
      if (entry) {
        const typed = entry[0].slice(0, Math.floor(clamp((time - entry[1]) / entry[2]) * entry[0].length));
        ctx.font = '28px "Geist Mono", monospace'; ctx.fillStyle = "#f2f6f5"; ctx.textBaseline = "top";
        const lines = typed.split("\n"), position = points[scene];
        for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], i ? 240 : position.x, position.y + i * 44);
        if (Math.floor(time * 2) % 2 === 0) ctx.fillRect((lines.length > 1 ? 240 : position.x) + ctx.measureText(lines.at(-1)).width + 3, position.y + (lines.length - 1) * 44, 2, 30);
      }
      // Cursor size stays fixed in screen pixels throughout both camera moves.
      const [x, y] = cursorAt(time); ctx.resetTransform(); ctx.save(); ctx.translate(x * zoom + dx, y * zoom);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,25); ctx.lineTo(6,19); ctx.lineTo(11,30); ctx.lineTo(16,27); ctx.lineTo(11,17); ctx.lineTo(22,16); ctx.closePath();
      ctx.fillStyle = "#063f47"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.8; ctx.lineJoin = "round"; ctx.fill(); ctx.stroke(); ctx.restore();
      return canvas.toDataURL("image/jpeg", 0.98).split(",")[1];
    };
  }, { captures, points, typing });
}
