// Camera and cursor post-production over captured, genuine CLI/report states.
// Frame timing is deterministic: 1,440 frames at 60fps, without audio or captions.
export async function prepareDemoRenderer(page, captures, points) {
  await page.setContent('<canvas width="1280" height="720"></canvas>');
  await page.evaluate(async ({ captures, points }) => {
    const images = {};
    for (const [name, encoded] of Object.entries(captures)) {
      const image = new Image();
      image.src = `data:image/png;base64,${encoded}`;
      await image.decode();
      images[name] = image;
    }
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const width = 1280, height = 720;
    const ease = t => t * t * (3 - 2 * t);
    const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
    const lerp = (a, b, t) => a + (b - a) * t;
    const camera = [[0,1,640,360],[0.9,1.34,450,190],[2.6,1.34,450,190],[3.4,1,640,360],[6.4,1.13,580,370],[7.7,1,640,360],[8,1,640,360],[8.8,1.32,330,260],[9.5,1.32,330,260],[10.1,1,640,360],[10.8,1.32,330,260],[11.5,1.32,330,260],[12.1,1,640,360],[13.2,1.22,580,330],[15.5,1,640,360],[16,1,640,360],[17.4,1.22,530,250],[18.1,1.22,530,250],[19.3,1.4,500,470],[22.4,1.4,500,470],[23.3,1,640,360],[24,1,640,360]];
    const cursor = [[0,450,400],[0.9,points.command.x,points.command.y],[3.7,points.command.x+230,points.command.y+24],[6.8,points.link.x,points.link.y],[7.8,points.link.x,points.link.y],[8.5,points.baseline.x,points.baseline.y],[10.5,points.candidate.x,points.candidate.y],[12.7,points.change.x,points.change.y],[15.8,points.change.x,points.change.y],[17.8,points.summary.x,points.summary.y],[18.3,points.summary.x,points.summary.y],[19.8,points.hit.x,points.hit.y],[22.5,points.hit.x,points.hit.y],[24,450,400]];
    function at(keys, time) {
      const upper = keys.findIndex(key => key[0] >= time);
      if (upper <= 0) return keys[0].slice(1);
      const a = keys[upper - 1], b = keys[upper];
      const progress = ease(clamp((time - a[0]) / (b[0] - a[0]), 0, 1));
      return a.slice(1).map((value, i) => lerp(value, b[i + 1], progress));
    }
    const transitions = [[2.8,0.16,"terminal","result"],[7.75,0.25,"result","baseline"],[9.8,0.25,"baseline","candidate"],[11.8,0.3,"candidate","change"],[15.7,0.3,"change","closed"],[18.15,0.15,"closed","opened"],[23.35,0.65,"opened","terminal"]];
    function scene(time) {
      let current = "terminal";
      for (const [start, duration, before, after] of transitions) {
        if (time < start) break;
        if (time < start + duration) return [before, after, ease((time - start) / duration)];
        current = after;
      }
      return [current, current, 0];
    }
    window.renderFrame = time => {
      const [scale, cx, cy] = at(camera, time);
      const dx = clamp(width / 2 - cx * scale, width - width * scale, 0);
      const dy = clamp(height / 2 - cy * scale, height - height * scale, 0);
      const [before, after, alpha] = scene(time);
      ctx.resetTransform(); ctx.globalAlpha = 1; ctx.fillStyle = "#141414"; ctx.fillRect(0,0,width,height);
      ctx.setTransform(scale,0,0,scale,dx,dy);
      ctx.drawImage(images[before],0,0,width,height);
      ctx.globalAlpha = alpha; ctx.drawImage(images[after],0,0,width,height); ctx.globalAlpha = 1;
      if (time < 2.96) {
        const text = "ragvi tutorial".slice(0, Math.floor(clamp((time - 1.1) / 0.105, 0, 14)));
        ctx.font = "24px monospace"; ctx.fillStyle = "#ededed"; ctx.textBaseline = "top";
        ctx.fillText(text, points.typed.x, points.typed.y);
        if (Math.floor(time * 2) % 2 === 0) ctx.fillRect(points.typed.x + ctx.measureText(text).width + 2, points.typed.y, 2, 27);
      }
      const [x,y] = at(cursor,time);
      for (const click of [0.95,7.2,18.15]) {
        const age = time - click;
        if (age >= 0 && age < 0.45) {
          ctx.beginPath(); ctx.arc(x,y,5 + age * 38,0,Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - age / 0.45)})`; ctx.lineWidth = 1.5; ctx.stroke();
        }
      }
      ctx.save(); ctx.translate(x,y); ctx.scale(1.25,1.25);
      ctx.shadowColor = "#00000088"; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,25); ctx.lineTo(6.5,19); ctx.lineTo(11.5,30); ctx.lineTo(16.5,27.5); ctx.lineTo(11.5,17); ctx.lineTo(22,16); ctx.closePath();
      ctx.fillStyle = "#161616"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.8; ctx.lineJoin = "round"; ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.resetTransform();
      return canvas.toDataURL("image/jpeg",0.92).split(",")[1];
    };
  }, { captures, points });
}
