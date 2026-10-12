import { ImageResponse } from "next/og";

export const alt = "RAGvidence — Evidence-first RAG diagnostics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#141414", color: "#ededed", padding: "72px", fontFamily: "sans-serif", border: "1px solid #3b3b3b" }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: "28px", fontWeight: 700 }}><span><span style={{ color: "#dedede" }}>RAG</span>vidence<span style={{ color: "#dedede" }}>.</span></span></div>
      <div style={{ display: "flex", flexDirection: "column" }}><div style={{ color: "#dedede", fontSize: "18px", letterSpacing: "0.16em", textTransform: "uppercase" }}>Evidence-first RAG diagnostics</div><div style={{ marginTop: "22px", maxWidth: "920px", fontSize: "66px", lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 700 }}>Know whether your retriever found enough evidence.</div></div>
      <div style={{ display: "flex", gap: "28px", color: "#adadad", fontSize: "18px" }}><span>Local-first</span><span>CLI-native</span><span>Reproducible reports</span></div>
    </div>,
    size,
  );
}
