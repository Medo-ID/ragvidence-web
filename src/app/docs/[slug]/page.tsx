import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPage } from "@/components/doc-page";
import { docs, getDoc } from "@/lib/docs";

export const instant = false;

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.description, alternates: { canonical: `/docs/${doc.slug}` } };
}

export default async function DocumentationPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  return <DocPage doc={doc} />;
}
