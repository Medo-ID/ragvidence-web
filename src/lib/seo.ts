import type { Metadata } from "next";

export const siteUrl = "https://ragvidence.medo-id.com";
export const homeTitle = "RAGvidence — Free RAG retrieval diagnostics CLI";
export const homeDescription = "Diagnose and compare RAG retrieval techniques on your data with the free Apache-2.0 CLI. Inspect context and reviewed evidence in offline HTML, JSON and Markdown reports.";

/** Specify nested social fields explicitly: Next.js metadata merges shallowly. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = path === "/" ? title : `${title} · RAGvidence`;
  const url = new URL(path, siteUrl).href;
  const images = [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: "RAGvidence — Local RAG retrieval evaluation" }];
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: "RAGvidence", locale: "en_US", title: fullTitle, description, url, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}

/** JSON-LD is inert data; escaping < prevents content from ending the script tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const websiteIdentity = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "RAGvidence",
  url: `${siteUrl}/`,
  description: homeDescription,
  inLanguage: "en",
};
