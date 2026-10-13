/** Keep the existing overview alias usable, with /docs as its preferred URL. */
export function docPath(slug: string): string {
  return slug === "overview" ? "/docs" : `/docs/${slug}`;
}
