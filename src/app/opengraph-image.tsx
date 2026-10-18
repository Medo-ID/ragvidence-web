import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "RAGvidence — Free Apache-2.0 retrieval diagnostics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
const font = await readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf"));

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#050809", color: "#f2f6f5", padding: "72px", fontFamily: "Geist", fontWeight: 600, border: "1px solid #174e56" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "32px" }}>
        <svg width="40" height="40" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g fill="#f2f6f5">
            <rect x="3" y="4" width="8" height="5" rx="1" />
            <rect x="3" y="13.5" width="8" height="5" rx="1" />
            <rect x="3" y="23" width="8" height="5" rx="1" />
            <path d="M11 6.5h3l6 6.5M11 16h8M11 25.5h3l6-6.5" fill="none" stroke="#f2f6f5" strokeWidth="2" strokeLinejoin="round" />
            <path fill="#8bd4db" fillRule="evenodd" d="M30 16a6 6 0 1 1-12 0 6 6 0 1 1 12 0Zm-10-.5 3 3 5-6-1.5-1.5L23 15.5 21.5 14 20 15.5Z" />
          </g>
        </svg>
        <span><span style={{ color: "#8bd4db" }}>RAG</span>vidence</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}><div style={{ color: "#8bd4db", fontSize: "18px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Free Apache-2.0 retrieval diagnostics</div><div style={{ marginTop: "22px", maxWidth: "980px", fontSize: "66px", lineHeight: 1.05, letterSpacing: "-0.04em" }}>Know whether your retriever found enough evidence.</div></div>
      <div style={{ display: "flex", gap: "28px", color: "#a4b0ae", fontSize: "18px" }}><span>Local-first</span><span>CLI-native</span><span>Reproducible reports</span></div>
    </div>,
    { ...size, fonts: [{ name: "Geist", data: font, weight: 600, style: "normal" }] },
  );
}
