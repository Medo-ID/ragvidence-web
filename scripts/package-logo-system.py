"""Bundle all three logo systems, editable source, guides, and browser proof."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "public/brand"
files = []
for path in sorted(BRAND.rglob("*")):
    if path.is_file() and path.suffix != ".zip":
        files.append((path, "ragvidence-logo-system/" + path.relative_to(BRAND).as_posix()))
for path in sorted((ROOT / "design/brand").glob("*")):
    if path.is_file():
        files.append((path, "ragvidence-logo-system/source/" + path.name))

with ZipFile(BRAND / "ragvidence-logo-system.zip", "w") as archive:
    for path, name in files:
        entry = ZipInfo(name, (2026, 10, 13, 0, 0, 0))
        entry.compress_type = ZIP_DEFLATED
        archive.writestr(entry, path.read_bytes(), compresslevel=9)

print(f"Packaged {len(files)} relative-name files, including editable source and guides.")
