import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPage } from "@/components/doc-page";
import { docs, getDoc } from "@/lib/docs";
import { docPath } from "@/lib/doc-path";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  if (doc.slug === "overview") return pageMetadata({ title: "Documentation", description: "Install RAGvidence, run controlled retrieval experiments, evaluate evidence, and interpret reports.", path: "/docs" });
  return pageMetadata({ title: doc.title, description: doc.description, path: docPath(doc.slug) });
}

export default async function DocumentationPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  return <DocPage doc={doc} />;
}
