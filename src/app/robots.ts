import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://ragvidence.medo-id.com/sitemap.xml", host: "https://ragvidence.medo-id.com" };
}
