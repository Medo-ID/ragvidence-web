import type { MetadataRoute } from "next";
import { docs } from "@/lib/docs";
import { siteUrl } from "@/lib/seo";
import { docPath } from "@/lib/doc-path";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set(["/", "/docs", "/releases", "/privacy", "/terms", "/security", ...docs.map(doc => docPath(doc.slug))]);
  return [...paths].map(path => ({ url: new URL(path, siteUrl).href }));
}
