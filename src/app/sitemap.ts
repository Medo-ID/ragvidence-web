import type { MetadataRoute } from "next";
import { docs } from "@/lib/docs";

const base = "https://ragvidence.medo-id.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/docs", "/privacy", "/terms", "/security"];
  return [
    ...staticPages.map((path, index) => ({ url: `${base}${path}`, changeFrequency: "monthly" as const, priority: index === 0 ? 1 : 0.7 })),
    ...docs.map((doc) => ({ url: `${base}/docs/${doc.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
