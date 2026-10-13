"""Authoring-only: outline the exact RAGvidence wordmark using local Geist."""

import json
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
fonts = {}
for weight in ("SemiBold", "Medium"):
    font = TTFont(ROOT / f"node_modules/geist/dist/fonts/geist-sans/Geist-{weight}.ttf")
    fonts[weight] = font

x = 52.0
paths = []
scale = 32 / fonts["SemiBold"]["head"].unitsPerEm
baseline = (40 + fonts["SemiBold"]["OS/2"].sCapHeight * scale) / 2
for index, character in enumerate("RAGvidence"):
    font = fonts["SemiBold" if index < 3 else "Medium"]
    glyphs = font.getGlyphSet()
    name = font.getBestCmap()[ord(character)]
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(pen)
    paths.append({"d": pen.getCommands(), "x": round(x, 4), "rag": index < 3})
    x += font["hmtx"].metrics[name][0] * scale - 0.65

output = {"width": round(x + 1), "baseline": baseline, "scale": scale, "paths": paths}
(ROOT / "design/brand/wordmark-paths.json").write_text(json.dumps(output, indent=2) + "\n")
for font in fonts.values():
    font.close()
