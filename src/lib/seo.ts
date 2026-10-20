import type { Metadata } from "next";

export const ownerName = "Medo-ID";
export const ownerUrl = "https://medo-id.com";
export const ownerGitHubUrl = "https://github.com/Medo-ID";
export const cliRepositoryUrl = `${ownerGitHubUrl}/ragvidence`;
export const cliIssuesUrl = `${cliRepositoryUrl}/issues`;
export const cliPackageUrl = "https://pypi.org/project/ragvidence/0.2.1/";

export const siteUrl = "https://ragvidence.medo-id.com";
export const homeTitle = "RAGvidence — RAG retrieval diagnostics CLI";
export const homeDescription = "Diagnose and compare RAG retrieval techniques on your data with a local CLI. Inspect context and reviewed evidence in offline HTML, JSON and Markdown reports.";

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

export const ownerIdentity = {
  "@type": "Person",
  "@id": `${ownerUrl}/#person`,
  name: ownerName,
  url: ownerUrl,
  sameAs: [ownerGitHubUrl],
};

export const websiteIdentity = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "RAGvidence",
  url: `${siteUrl}/`,
  description: homeDescription,
  inLanguage: "en",
  publisher: ownerIdentity,
  copyrightHolder: { "@id": ownerIdentity["@id"] },
  about: { "@id": `${siteUrl}/#software` },
};

export const softwareIdentity = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/#software`,
  name: "RAGvidence",
  url: `${siteUrl}/`,
  description: homeDescription,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Linux, Windows, macOS",
  softwareVersion: "0.2.1",
  softwareRequirements: "Python 3.12",
  isAccessibleForFree: true,
  license: `${siteUrl}/ragvidence-0.2.1-license.txt`,
  installUrl: `${siteUrl}/docs/installation`,
  sameAs: [cliRepositoryUrl, cliPackageUrl],
  author: ownerIdentity,
  subjectOf: { "@type": "CollectionPage", "@id": `${siteUrl}/docs#documentation`, url: `${siteUrl}/docs`, name: "RAGvidence documentation" },
};
