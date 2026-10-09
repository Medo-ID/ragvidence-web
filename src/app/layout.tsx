import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://ragvidence.medo-id.com"),
  title: { default: "RAGvidence — Evidence-first RAG diagnostics", template: "%s · RAGvidence" },
  description: "A local, evidence-first CLI for testing RAG retrieval changes, finding regressions, and sharing reproducible HTML reports.",
  applicationName: "RAGvidence",
  authors: [{ name: "Medo-ID", url: "https://medo-id.com" }],
  creator: "Medo-ID",
  keywords: ["RAG evaluation", "retrieval diagnostics", "BM25", "semantic search", "AI engineering"],
  openGraph: {
    type: "website",
    siteName: "RAGvidence",
    title: "RAGvidence — See whether your retriever found enough evidence",
    description: "Compare retrieval changes locally, catch regressions, and share the evidence behind every result.",
    url: "https://ragvidence.medo-id.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAGvidence — Evidence-first RAG diagnostics",
    description: "A local CLI for evidence-level RAG evaluation and reproducible reports.",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#07090d", colorScheme: "dark" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a href="#main-content" className="fixed left-4 top-3 z-100 -translate-y-20 rounded-none bg-signal px-4 py-2 text-sm font-semibold text-canvas transition-transform focus:translate-y-0">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
