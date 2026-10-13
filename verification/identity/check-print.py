"""Verify complete closed-disclosure printing and rasterize actual PDF pages."""
from collections import Counter
import json
from pathlib import Path
import sys

from pypdf import PdfReader
import pypdfium2 as pdfium

directory = Path(sys.argv[1])
workspace = Path(sys.argv[2])
pdf_path = directory / "report.pdf"
pages = [page.extract_text() for page in PdfReader(pdf_path).pages]
text = "".join("".join(pages).split())
expected = Counter()
questions = set()
for filename in ["bm25-body.json", "bm25-heading_context.json"]:
    evaluation = json.loads((workspace / "evaluations" / filename).read_text())
    for question in evaluation["questions"]:
        questions.add(question["question_id"])
        expected.update(hit["source_unit_id"] for hit in question["hits"])
for question in questions:
    assert question in text, f"Missing printed question {question}"
for source, count in expected.items():
    assert text.count(source) >= count, f"Missing printed evidence {source}"
assert "eightseconds" in text, "Recovered preview absent"
pdf = pdfium.PdfDocument(pdf_path)
indices = sorted({0, next(i for i, page in enumerate(pages) if "DEV-01" in page)})
for index in indices:
    pdf[index].render(scale=1.5).to_pil().save(directory / f"print-page-{index + 1}.png")
result = {"pages": len(pages), "questions": len(questions), "rankedEvidenceItemsVerified": sum(expected.values()), "rasterizedPages": [i + 1 for i in indices]}
(directory / "print-check.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result))
