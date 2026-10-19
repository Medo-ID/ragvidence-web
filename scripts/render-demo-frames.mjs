// Replay genuine command transcripts and native report captures in one workspace.
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
    const clamp = n => Math.max(0, Math.min(1, n));
    const ease = n => { n = clamp(n); return n * n * (3 - 2 * n); };
    const mix = (a, b, n) => a + (b - a) * ease(n);
    function rows(value, width, size) {
      c.font = `${size}px 'Geist Mono', monospace`;
      const result = [];
      for (const paragraph of value.split("\n")) {
        let current = "";
        for (const word of paragraph.split(/(\s+)/)) {
          if (current && c.measureText(current + word).width > width) { result.push(current.trimEnd()); current = ""; }
          current += word;
        }
        result.push(current.trimEnd());
      }
      return result;
    }
    function text(value, x, y, width, size = 20, color = "#eceef2", line = size * 1.5) {
      const wrapped = rows(value, width, size); c.fillStyle = color;
      wrapped.forEach((row, i) => c.fillText(row, x, y + i * line));
      return y + wrapped.length * line;
    }
    function cursor(x, y, kind = "arrow", press = 0, scale = 1) {
      c.save(); c.translate(x, y); c.scale(scale * (1 - .07 * Math.sin(clamp(press) * Math.PI)), scale * (1 - .07 * Math.sin(clamp(press) * Math.PI)));
      c.lineJoin = "round"; c.lineCap = "round";
      if (kind === "hand") {
        c.translate(-4, 2);
        const hand = new Path2D("M0 18V2Q0 -2 4 -2Q8 -2 8 2V12Q8 8 12 8Q16 8 16 12V14Q16 10 20 10Q24 10 24 14V17Q24 14 28 14Q32 14 32 18V27Q32 31 28 37H7Q4 33 1 29L-7 20Q-10 16 -6 14Q-3 13 0 18Z");
        c.strokeStyle = "#080808"; c.lineWidth = 2; c.fillStyle = "#fff"; c.fill(hand); c.stroke(hand);
        c.beginPath(); c.moveTo(8, 18); c.lineTo(8, 27); c.moveTo(16, 18); c.lineTo(16, 28); c.moveTo(24, 21); c.lineTo(24, 28); c.lineWidth = 1.3; c.stroke();
      } else {
        const arrow = new Path2D("M0 0V32L8 24L14 38L20 35L14 22H27Z");
        c.fillStyle = "#080808"; c.strokeStyle = "#fff"; c.lineWidth = 2; c.fill(arrow); c.stroke(arrow);
      }
      c.restore();
    }
    function report(name, sy, width = 1920, zoom = 1, x = 0) {
      const img = images[name], factor = img.width / 1920;
      const sourceWidth = 1168 / zoom, sourceHeight = 976 * sourceWidth / width;
      const sourceX = Math.min((1920 - sourceWidth) / 2, 430);
      sy = Math.max(0, Math.min(sy, img.height / factor - sourceHeight));
      c.save(); c.beginPath(); c.rect(x, 64, width, 976); c.clip();
      c.drawImage(img, sourceX * factor, sy * factor, sourceWidth * factor, sourceHeight * factor, x, 64, width, 976); c.restore();
      return (px, py) => [x + (px - sourceX) * width / sourceWidth, 64 + (py - sy) * width / sourceWidth];
    }
    function terminal(time, compare = false) {
      c.fillStyle = "#101014"; c.fillRect(0, 64, 1920, 976);
      c.strokeStyle = "#28282e"; c.beginPath(); c.moveTo(330, 64); c.lineTo(330, 1040); c.stroke();
      text("YOUR LOCAL FILES", 30, 112, 272, 14, "#a7abb5");
      text("docs/manual.md\nquestions.txt\nreviewed.json", 30, 164, 272, 19, "#ffbf00", 38);
      text("Q1 / DEV", 30, 348, 272, 14, "#a7abb5");
      text(typing.inputs.reviewed.questions[0].question, 30, 392, 272, 20, "#eceef2", 31);
      text(compare ? "REVIEWED SPANS" : "FOR THE COMPARISON", 30, 610, 272, 14, "#a7abb5");
      text(typing.inputs.reviewed.evidence.slice(0, 2).map(e => e.evidence_id + "\n" + e.spans[0].text).join("\n\n"), 30, 654, 272, 18, "#eceef2", 29);
      const item = compare ? typing.compare : typing.inspect;
      const progress = clamp(time / (compare ? 3.1 : 1.8));
      const outputProgress = clamp((time - (compare ? 3.1 : 1.8)) / 1.1);
      const width = 1450, x = 380, baseY = 126, commandLine = 39, outputLine = 31;
      const commandRows = rows("> " + item.command, width, 26);
      const outputRows = rows(item.output, width, 21);
      const outputY = baseY + commandRows.length * commandLine + 30;
      const bottom = outputY + outputRows.length * outputLine;
      // Scroll the actual transcript; long export paths stay complete and readable.
      const offset = compare ? mix(0, Math.max(0, bottom - 970), (time - 6) / 1.2) : 0;
      c.save(); c.beginPath(); c.rect(348, 82, 1540, 934); c.clip(); c.translate(0, -offset);
      text("> " + item.command.slice(0, Math.floor(item.command.length * progress)) + (progress < 1 ? "▏" : ""), x, baseY, width, 26, "#ffbf00", commandLine);
      if (progress >= 1) text(outputRows.slice(0, Math.ceil(outputRows.length * outputProgress)).join("\n"), x, outputY, width, 21, "#eceef2", outputLine);
      const htmlIndex = outputRows.findIndex(row => row.startsWith("HTML report:"));
      const htmlY = outputY + htmlIndex * outputLine;
      if (compare && time >= 7) {
        c.strokeStyle = "#ffbf00"; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 14, htmlY - 23); c.lineTo(x - 14, htmlY + 37); c.stroke();
      }
      c.restore();
      const targetY = compare && time >= 6 ? Math.max(160, Math.min(940, htmlY - offset + 8)) : 850;
      cursor(mix(compare ? 1661 : 1730, compare && time >= 6 ? 570 : 1580, time / 9.5), mix(compare ? 855 : 860, targetY, time / 9.5));
    }
    window.renderFrame = time => {
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.fillStyle = "#010101"; c.fillRect(0, 0, 1920, 1080);
      c.strokeStyle = "#a7abb5"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(64, 26); c.lineTo(71, 26); c.moveTo(64, 36); c.lineTo(76, 36); c.moveTo(64, 46); c.lineTo(71, 46); c.stroke();
      c.strokeStyle = "#ffbf00"; c.beginPath(); c.moveTo(71, 26); c.lineTo(81, 36); c.lineTo(71, 46); c.moveTo(84, 46); c.lineTo(91, 46); c.stroke();
      c.font = "500 24px Geist, sans-serif"; c.fillStyle = "#eceef2"; c.fillText("RAGvidence", 108, 44);
      const label = time < 4.5 ? "01 / Ask a question" : time < 10.5 ? "02 / Compare with reviewed evidence" : time < 14 ? "03 / Export HTML · JSON · Markdown" : time < 21 ? "04 / Inspect the HTML report" : time < 27.5 ? "05 / Open original source evidence" : "06 / Themes · mobile · print";
      text(label, 1320, 42, 560, 15, "#a7abb5");
      if (time < 4.5) terminal(time);
      else if (time < 14) terminal(time - 4.5, true);
      else if (time < 18) {
        report("report", mix(points.summary - 70, points.resources - 40, (time - 14) / 1.4), 1920, mix(.85, 1.04, (time - 14) / 2));
        cursor(mix(570, 1320, (time - 14) / 4), mix(820, 450, (time - 14) / 4));
      } else if (time < 21) {
        report("report", mix(points.resources - 40, points.changes - 40, (time - 18) / 1.1));
        cursor(mix(1320, 1080, (time - 18) / 3), mix(450, 690, (time - 18) / 3));
      } else if (time < 22.2) {
        const map = report("report", mix(points.changes - 40, points.disclosure - 240, (time - 21) / .9));
        const target = map(points.disclosureX, points.disclosure + 18);
        cursor(mix(1080, target[0], (time - 21) / 1.1), mix(690, target[1], (time - 21) / 1.1), time > 22 ? "hand" : "arrow", (time - 22) / .2);
      } else if (time < 23.2) {
        const map = report("ranked", points.disclosure - 240);
        const from = map(points.disclosureX, points.disclosure + 18);
        const target = map(points.questionX, points.questionDisclosure + 18);
        cursor(mix(from[0], target[0], (time - 22.2) / .6), mix(from[1], target[1], (time - 22.2) / .6), "hand", (time - 23) / .2);
      } else if (time < 27.5) {
        const map = report("evidence", mix(points.disclosure - 240, points.evidence - 30, (time - 23.2) / .9), 1920, mix(1, 1.1, (time - 24) / 1.4));
        const from = [(points.questionX - 376) * 1920 / 1168, 64 + (points.questionDisclosure + 18 - points.disclosure + 240) * 1920 / 1168];
        const target = map(points.powerX, points.powerY);
        cursor(mix(from[0], target[0], (time - 23.2) / 4.3), mix(from[1], target[1], (time - 23.2) / 4.3), "arrow", 0, mix(1, 1.15, (time - 23.2) / 1.4));
      } else if (time < 29.5) {
        if (time < 27.9) {
          report("evidence", points.evidence - 30, 1920, 1.1);
          c.globalAlpha = ease((time - 27.5) / .4); report("evidence", 120); c.globalAlpha = 1;
        } else report(time < 28.15 ? "evidence" : "light", mix(120, points.resources - 50, (time - 28.7) / .8));
        const from = [(points.powerX - 430) * 1920 / (1168 / 1.1), 64 + (points.powerY - points.evidence + 30) * 1920 / (1168 / 1.1)];
        const target = [(points.themeX - 376) * 1920 / 1168, 64 + (points.themeY - 120) * 1920 / 1168];
        cursor(mix(from[0], target[0], (time - 27.5) / .5), mix(from[1], target[1], (time - 27.5) / .5), time >= 28 && time < 28.7 ? "hand" : "arrow", (time - 28) / .3);
      } else if (time < 32) {
        report("light", points.resources - 50, mix(1920, 1270, (time - 29.5) / .6));
        const x = mix(1940, 1430, (time - 29.5) / .6);
        c.save(); c.beginPath(); c.rect(x, 112, 390, 844); c.clip();
        if (time < 30.7) {
          const img = images.mobile, factor = img.width / 390;
          const sy = mix(0, Math.min(points.mobileNav - 20, img.height / factor - 844), (time - 29.8) / .8);
          c.drawImage(img, 0, sy * factor, 390 * factor, 844 * factor, x, 112, 390, 844);
        } else c.drawImage(time < 31.2 ? images.mobileNav : images.mobileEvidence, x, 112, 390, 844);
        c.restore(); cursor(mix((points.themeX - 376) * 1920 / 1168, 1600, (time - 29.5) / 2.5), mix(64 + (points.themeY - 120) * 1920 / 1168, 560, (time - 29.5) / 2.5));
      } else {
        report("light", points.evidence - 30, 1140); c.drawImage(images.print, 1230, 88, 650, 920);
        cursor(mix(1600, 1730, (time - 32) / 2), mix(560, 780, (time - 32) / 2));
      }
      c.fillStyle = "#101014"; c.fillRect(0, 1040, 1920, 40);
      text(time < 4.5 ? "Synthetic manual · Unscored retrieval inspection · Execution waits omitted" : "Synthetic manual · 4 reviewed dev questions · k=1 · Execution waits omitted · Not a benchmark", 32, 1068, 1860, 16, "#a7abb5");
      return canvas.toDataURL("image/jpeg", .97).split(",")[1];
    };
  }, { captures, points, typing });
}
