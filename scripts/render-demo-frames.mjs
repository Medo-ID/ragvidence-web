// Native 1920×1080 captures. Two purposeful zooms; fixed-size cursor, clean cuts.
export async function prepareDemoRenderer(page, captures, points, fontCSS) {
  await page.setContent(`<style>${fontCSS}</style><canvas width="1920" height="1080"></canvas>`);
  await page.evaluate(async ({ captures, points }) => {
    await document.fonts.load('28px "Geist Mono"');
    const images = {};
    for (const [name, encoded] of Object.entries(captures)) {
      const img = new Image(); img.src = `data:image/png;base64,${encoded}`; await img.decode(); images[name] = img;
    }
    const canvas = document.querySelector("canvas"), ctx = canvas.getContext("2d");
    const ease = t => t * t * (3 - 2 * t), clamp = t => Math.max(0, Math.min(1, t));
    function cursorAt(time) {
      const keys = [[0, points.command.x, points.command.y], [5.8, points.command.x, points.command.y], [7.2, points.link.x, points.link.y], [8, points.link.x, points.link.y], [8.4, 1630, 480], [18.6, 1630, 480], [19.7, points.changeLink.x, points.changeLink.y], [20, points.changeLink.x, points.changeLink.y], [20.3, 1650, 390], [27.4, 1650, 390], [28, points.summary.x, points.summary.y], [30.2, points.summary.x, points.summary.y], [30.6, 1640, 220], [42, 1640, 220], [48, 1640, 220]];
      const index = keys.findIndex(key => key[0] >= time);
      if (index <= 0) return keys[0].slice(1);
      const a = keys[index - 1], b = keys[index], t = ease(clamp((time - a[0]) / (b[0] - a[0])));
      return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    }
    window.renderFrame = time => {
      const scene = time < 2.6 ? "terminal" : time < 8 ? "result" : time < 20 ? "summary" : time < 28 ? "changes" : time < 30.3 ? "closed" : time < 42 ? "opened" : "install";
      const zoom = time < 8 ? 1 + 0.18 * ease(clamp((time - 0.7) / 0.4)) : time >= 30.3 && time < 42 ? 1 + 0.18 * ease(clamp((time - 31.8) / 0.4)) : 1;
      const dx = (1920 - 1920 * zoom) / 2;
      ctx.resetTransform(); ctx.globalAlpha = 1; ctx.fillStyle = "#050809"; ctx.fillRect(0, 0, 1920, 1080);
      ctx.setTransform(zoom, 0, 0, zoom, dx, 0); ctx.drawImage(images[scene], 0, 0);
      if (scene === "terminal") {
        const typed = "ragvi tutorial".slice(0, Math.floor(clamp((time - 0.95) / 1.5) * 14));
        ctx.font = '28px "Geist Mono", monospace'; ctx.fillStyle = "#f2f6f5"; ctx.textBaseline = "top";
        ctx.fillText(typed, points.typed.x, points.typed.y);
        if (Math.floor(time * 2) % 2 === 0) ctx.fillRect(points.typed.x + ctx.measureText(typed).width + 3, points.typed.y, 2, 30);
      }
      // Cursor size stays constant in screen pixels during both camera moves.
      const [x, y] = cursorAt(time); ctx.resetTransform(); ctx.save(); ctx.translate(x * zoom + dx, y * zoom);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,25); ctx.lineTo(6,19); ctx.lineTo(11,30); ctx.lineTo(16,27); ctx.lineTo(11,17); ctx.lineTo(22,16); ctx.closePath();
      ctx.fillStyle = "#063f47"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.8; ctx.lineJoin = "round"; ctx.fill(); ctx.stroke(); ctx.restore();
      return canvas.toDataURL("image/jpeg", 0.98).split(",")[1];
    };
  }, { captures, points });
}
