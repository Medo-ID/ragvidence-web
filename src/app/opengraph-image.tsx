import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "RAGvidence — RAG retrieval diagnostics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
const font = await readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf"));

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#010101", color: "#f2f6f5", padding: "72px", fontFamily: "Geist", fontWeight: 600, border: "1px solid #28282e" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "32px" }}>
        <svg width="40" height="40" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#a7abb5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h7M3 16h12M3 26h7" />
            <path d="m10 6 10 10-10 10M23 26h7" stroke="#ffbf00" />
          </g>
        </svg>
        <span>RAGvidence</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}><div style={{ color: "#ffbf00", fontSize: "18px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Local retrieval diagnostics</div><div style={{ marginTop: "22px", maxWidth: "980px", fontSize: "66px", lineHeight: 1.05, letterSpacing: "-0.04em" }}>Know whether your retriever found enough evidence.</div></div>
      <div style={{ display: "flex", gap: "28px", color: "#a4b0ae", fontSize: "18px" }}><span>Local-first</span><span>CLI-native</span><span>Reproducible reports</span></div>
    </div>,
    { ...size, fonts: [{ name: "Geist", data: font, weight: 600, style: "normal" }] },
  );
}
