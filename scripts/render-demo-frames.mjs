// Continuous presentation of genuine report captures and verbatim CLI transcripts.
export async function prepareDemoRenderer(page, captures, points, fontCSS, typing) {
  await page.setContent(`<style>${fontCSS}html,body{margin:0;background:#010101}canvas{display:block}</style><canvas width="1920" height="1080"></canvas>`);
  await page.evaluate(async ({ captures, points, typing }) => {
    const images = {};
    for (const [name, encoded] of Object.entries(captures)) {
      const img = new Image(); img.src = `data:image/png;base64,${encoded}`; await img.decode(); images[name] = img;
    }
    await Promise.all([document.fonts.load("16px Geist"), document.fonts.load("16px 'Geist Mono'")]);
    await document.fonts.ready;
    const canvas = document.querySelector("canvas"), c = canvas.getContext("2d");
    const ease = n => { n = Math.max(0, Math.min(1, n)); return n * n * (3 - 2 * n); };
    const mix = (a, b, n) => a + (b - a) * ease(n);
    function text(value, x, y, width, size = 17, color = "#eceef2", line = size * 1.6) {
      c.font = `${size}px 'Geist Mono', monospace`; c.fillStyle = color;
      let row = y;
      for (const paragraph of value.split("\n")) {
        let current = "";
        for (const word of paragraph.split(/(\s+)/)) {
          if (current && c.measureText(current + word).width > width) { c.fillText(current.trimEnd(), x, row); row += line; current = ""; }
          current += word;
        }
        c.fillText(current, x, row); row += line;
      }
      return row;
    }
    function cursor(x, y, click = 0) {
      c.save(); c.translate(x, y); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 25); c.lineTo(7, 19); c.lineTo(13, 31); c.lineTo(18, 28); c.lineTo(12, 17); c.lineTo(23, 16); c.closePath(); c.fillStyle = "#fafafa"; c.strokeStyle = "#101014"; c.lineWidth = 2; c.fill(); c.stroke();
      if (click > 0) { c.beginPath(); c.arc(1, 1, 12 + click * 18, 0, Math.PI * 2); c.strokeStyle = `rgba(255,191,0,${1 - click})`; c.lineWidth = 2; c.stroke(); } c.restore();
    }
    function panel(x = 0, y = 64, w = 1920, h = 976, light = false) {
      c.beginPath(); c.rect(x, y, w, h); c.fillStyle = light ? "#f3f4f6" : "#101014"; c.fill(); c.strokeStyle = light ? "#c6cbd3" : "#28282e"; c.lineWidth = 1; c.stroke();
    }
    function report(name, sy, width = 1920, zoom = 1, x = 0) {
      const img = images[name];
      const sourceWidth = 1168 / zoom, sourceHeight = 976 * sourceWidth / width;
      // Keep both edges of the original evidence column visible during the focus zoom.
      const sourceX = Math.min((1920 - sourceWidth) / 2, 430);
      sy = Math.max(0, Math.min(sy, img.height / (img.width / 1920) - sourceHeight));
      c.save(); c.beginPath(); c.rect(x, 64, width, 976); c.clip();
      const factor = img.width / 1920;
      c.drawImage(img, sourceX * factor, sy * factor, sourceWidth * factor, sourceHeight * factor, x, 64, width, 976); c.restore();
    }
    function terminal(progress, outputProgress) {
      panel();
      c.strokeStyle = "#28282e"; c.beginPath(); c.moveTo(380, 64); c.lineTo(380, 1040); c.stroke();
      text("LOCAL INPUTS", 32, 106, 310, 13, "#a7abb5");
      text("docs/manual.md\nquestions.txt\nreviewed.json", 32, 152, 310, 16, "#ffbf00", 34);
      text("Q1 / dev", 32, 310, 310, 13, "#a7abb5");
      text(typing.inputs.reviewed.questions[0].question, 32, 350, 310, 17, "#eceef2", 29);
      text("REQUIRED ORIGINAL SPANS", 32, 540, 310, 12, "#a7abb5");
      text(typing.inputs.reviewed.evidence.slice(0, 2).map(e => e.evidence_id + "\n" + e.spans[0].text).join("\n\n"), 32, 580, 310, 16, "#eceef2", 27);
      c.save(); c.beginPath(); c.rect(412, 84, 1476, 936); c.clip();
      const item = typing.compare;
      const command = item.command.slice(0, Math.floor(item.command.length * Math.min(1, progress)));
      let y = text("> " + command + (progress < 1 ? "▏" : ""), 420, 116, 1430, 20, "#ffbf00", 34);
      if (progress >= 1) {
        const lines = item.output.split("\n");
        text(lines.slice(0, Math.ceil(lines.length * Math.min(1, outputProgress))).join("\n"), 420, y + 22, 1430, 16, "#eceef2", 24);
      }
      c.restore(); cursor(mix(1540, 1770, progress), mix(860, 820, progress));
    }
    window.renderFrame = time => {
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.fillStyle = "#010101"; c.fillRect(0, 0, 1920, 1080);
      // The refined evidence/CLI mark uses the same thin geometry as the website.
      c.strokeStyle = "#a7abb5"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(64, 26); c.lineTo(71, 26); c.moveTo(64, 36); c.lineTo(76, 36); c.moveTo(64, 46); c.lineTo(71, 46); c.stroke();
      c.strokeStyle = "#ffbf00"; c.beginPath(); c.moveTo(71, 26); c.lineTo(81, 36); c.lineTo(71, 46); c.moveTo(84, 46); c.lineTo(91, 46); c.stroke();
      c.font = "500 24px Geist, sans-serif"; c.fillStyle = "#eceef2"; c.fillText("RAGvidence", 108, 44);
      text("Local terminal  →  report.html", 1350, 42, 530, 13, "#a7abb5");
      // One continuous workspace; native report states replace the terminal content.
      if (time < 4) {
        terminal(time / 1.9, (time - 1.9) / 1.1);
      } else if (time < 8) {
        report("report", mix(points.summary - 70, points.resources - 40, (time - 4) / 1.3), 1920, mix(.9, 1.04, (time - 4) / 2));
        cursor(mix(1770, 1320, (time - 4) / 4), mix(820, 450, (time - 4) / 4));
      } else if (time < 11) {
        report("report", mix(points.resources - 40, points.changes - 40, (time - 8) / .9));
        cursor(mix(1320, 1080, (time - 8) / 3), mix(450, 690, (time - 8) / 3));
      } else if (time < 12) {
        report("report", mix(points.changes - 40, points.disclosure - 240, (time - 11) / .7));
        const y = Math.min(990, 64 + 258 * 1920 / 1168);
        cursor(mix(1080, 360, (time - 11) / 1.1), mix(690, y, (time - 11) / 1.1), time > 11.85 ? (time - 11.85) / .15 : 0);
      } else if (time < 12.8) {
        report("ranked", points.disclosure - 240);
        cursor(360, 64 + (points.questionDisclosure - points.disclosure + 258) * 1920 / 1168, time > 12.6 ? (time - 12.6) / .2 : 0);
      } else if (time < 16) {
        report("evidence", mix(points.disclosure - 240, points.evidence - 30, (time - 12.8) / .7), 1920, mix(1, 1.1, (time - 13.5) / 1.3));
        cursor(mix(360, 1140, (time - 12.8) / 3.2), mix(770, 490, (time - 12.8) / 3.2));
      } else if (time < 18) {
        report(time < 16.5 ? "evidence" : "light", mix(120, points.resources - 50, (time - 17) / .8));
        cursor((points.themeX - 376) * 1920 / 1168, 64 + (points.themeY - 120) * 1920 / 1168, time >= 16.35 && time < 16.8 ? (time - 16.35) / .45 : 0);
      } else if (time < 20.5) {
        report("light", points.resources - 50, mix(1920, 1270, (time - 18) / .5));
        const x = mix(1940, 1430, (time - 18) / .5);
        c.save(); c.beginPath(); c.rect(x, 112, 390, 844); c.clip();
        if (time < 19.2) {
          const img = images.mobile; const sy = mix(0, Math.min(points.mobileNav - 20, img.height / (img.width / 390) - 844), (time - 18.3) / .8);
          const factor = img.width / 390;
          c.drawImage(img, 0, sy * factor, 390 * factor, 844 * factor, x, 112, 390, 844);
        } else c.drawImage(time < 19.7 ? images.mobileNav : images.mobileEvidence, x, 112, 390, 844);
        c.restore(); cursor(mix(1400, 1600, (time - 18) / 2.5), mix(350, 560, (time - 18) / 2.5));
      } else {
        report("light", points.evidence - 30, 1140);
        c.drawImage(images.print, 1230, 88, 650, 920);
        cursor(mix(1600, 1730, (time - 20.5) / 1.5), mix(560, 780, (time - 20.5) / 1.5));
      }
      c.fillStyle = "#101014"; c.fillRect(0, 1040, 1920, 40);
      text("Synthetic manual · 4 reviewed dev questions · k=1 · Execution waits omitted · Not a benchmark", 32, 1066, 1860, 13, "#a7abb5");
      return canvas.toDataURL("image/jpeg", 0.95).split(",")[1];
    };
  }, { captures, points, typing });
}
