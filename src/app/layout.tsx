import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { ReactNode } from "react";
import { homeDescription, homeTitle, pageMetadata, serializeJsonLd, siteUrl, websiteIdentity } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({ title: homeTitle, description: homeDescription, path: "/" }),
  metadataBase: new URL(siteUrl),
  title: { default: homeTitle, template: "%s · RAGvidence" },
  applicationName: "RAGvidence",
  authors: [{ name: "Medo-ID", url: "https://medo-id.com" }],
  creator: "Medo-ID",
  keywords: ["RAG evaluation", "retrieval diagnostics", "BM25", "semantic search", "AI engineering"],
};

export const viewport: Viewport = { themeColor: "#ffbf00", colorScheme: "dark light" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: '(function(){var r=document.documentElement;r.dataset.js="true";try{var t=localStorage.getItem("ragvidence-theme");if(t==="light"||t==="dark")r.dataset.theme=t}catch(e){}})()' }} />
      </head>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteIdentity) }} />
        <a href="#main-content" className="fixed left-4 top-3 z-100 -translate-y-20 rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-canvas transition-transform focus:translate-y-0">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
