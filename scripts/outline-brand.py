"""Export self-contained logo lockups from the master mark and installed Geist.

Authoring only: requires fonttools; not used by the website or production build.
"""

from pathlib import Path
import xml.etree.ElementTree as ET

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "public/brand"
FONT = ROOT / "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf"

font = TTFont(FONT)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
scale = 32 / font["head"].unitsPerEm
baseline = (40 + font["OS/2"].sCapHeight * scale) / 2
mark = ET.fromstring((BRAND / "ragvidence-mark.svg").read_text())
ET.register_namespace("", "http://www.w3.org/2000/svg")
mark_shapes = "".join(ET.tostring(child, encoding="unicode") for child in mark)

for variant, ink, accent in (
    ("", "#f2f6f5", "#8bd4db"),
    ("-light", "#17212b", "#063f47"),
):
    x = 52.0
    paths = []
    for index, character in enumerate("RAGvidence."):
        name = cmap[ord(character)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        color = accent if index < 3 or character == "." else ink
        paths.append(
            f'<path fill="{color}" transform="translate({x:.4f} {baseline:.4f}) '
            f'scale({scale:.6f} {-scale:.6f})" d="{pen.getCommands()}"/>'
        )
        x += font["hmtx"].metrics[name][0] * scale - 0.65
    width = round(x + 1)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="40" '
        f'viewBox="0 0 {width} 40" role="img" aria-labelledby="title">'
        '<title id="title">RAGvidence</title>'
        f'<g transform="scale(1.25)">{mark_shapes}</g>'
        + "".join(paths)
        + "</svg>\n"
    )
    (BRAND / f"ragvidence-logo{variant}.svg").write_text(svg)

font.close()
(BRAND / "GEIST-LICENSE.txt").write_bytes((ROOT / "node_modules/geist/LICENSE.txt").read_bytes())
