import { docs, getDoc } from "@/lib/docs";
import { docPath } from "@/lib/doc-path";
import { docMarkdown } from "@/lib/docs-markdown";
import { siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return docs.map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  const headers = { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex" };
  if (!doc) return new Response("Documentation page not found.\n", { status: 404, headers });
  return new Response(docMarkdown(doc, new URL(docPath(doc.slug), siteUrl).href), {
    headers: { ...headers, "Content-Disposition": `attachment; filename="ragvidence-${doc.slug}.md"` },
  });
}
