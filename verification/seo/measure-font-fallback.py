"""Authoring-only font metrics; FontTools is not a product dependency."""

import argparse
import json
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
# Same Latin-frequency sample used by installed next/font/local's metric helper.
SAMPLE = "aaabcdeeeefghiijklmnnoopqrrssttuvwxyz      "


def metrics(path: Path) -> dict:
    with TTFont(path) as font:
        cmap = font.getBestCmap()
        widths = font["hmtx"].metrics
        return {
            "unitsPerEm": font["head"].unitsPerEm,
            "averageWidth": sum(widths[cmap[ord(char)]][0] for char in SAMPLE) / len(SAMPLE),
            "ascent": font["hhea"].ascent,
            "descent": font["hhea"].descent,
            "lineGap": font["hhea"].lineGap,
        }


parser = argparse.ArgumentParser()
parser.add_argument("--regular", type=Path, required=True)
parser.add_argument("--bold", type=Path, required=True)
args = parser.parse_args()
result = []
for weight, target, fallback in [(400, "Regular", args.regular), (600, "SemiBold", args.bold)]:
    source = ROOT / f"node_modules/geist/dist/fonts/geist-sans/Geist-{target}.ttf"
    primary, secondary = metrics(source), metrics(fallback)
    scale = (primary["averageWidth"] / primary["unitsPerEm"]) / (secondary["averageWidth"] / secondary["unitsPerEm"])
    overrides = {
        "sizeAdjust": f"{scale * 100:.2f}%",
        "ascentOverride": f'{primary["ascent"] / primary["unitsPerEm"] / scale * 100:.2f}%',
        "descentOverride": f'{abs(primary["descent"]) / primary["unitsPerEm"] / scale * 100:.2f}%',
        "lineGapOverride": f'{primary["lineGap"] / primary["unitsPerEm"] / scale * 100:.2f}%',
    }
    result.append({"weight": weight, "primary": str(source.relative_to(ROOT)), "fallback": str(fallback), "primaryMetrics": primary, "fallbackMetrics": secondary, "overrides": overrides})
destination = ROOT / "verification/seo/layout-shift/fallback-metrics.json"
destination.write_text(json.dumps({"sample": SAMPLE, "fonts": result}, indent=2) + "\n")
print(json.dumps(result, indent=2))
