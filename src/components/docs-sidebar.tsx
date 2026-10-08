"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { docGroups, docs } from "@/lib/docs";

function Navigation({ query, close }: { query: string; close?: () => void }) {
  const pathname = usePathname();
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return docs;
    return docs.filter((doc) => `${doc.title} ${doc.description} ${doc.group}`.toLowerCase().includes(value));
  }, [query]);

  if (!matches.length) return <p className="px-3 py-5 text-sm text-muted">No documentation pages match “{query}”.</p>;

  return (
    <nav aria-label="Documentation">
      {docGroups.map((group) => {
        const pages = matches.filter((doc) => doc.group === group);
        if (!pages.length) return null;
        return (
          <div key={group} className="mb-6">
            <h2 className="px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{group}</h2>
            <ul className="mt-2 space-y-0.5">
              {pages.map((doc) => {
                const active = pathname === `/docs/${doc.slug}` || (pathname === "/docs" && doc.slug === "overview");
                return (
                  <li key={doc.slug}>
                    <Link href={`/docs/${doc.slug}`} onClick={close} aria-current={active ? "page" : undefined} className={`block rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-signal/10 font-medium text-signal" : "text-muted hover:bg-white/[0.035] hover:text-ink"}`}>
                      {doc.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export function DocsSidebar() {
  const [query, setQuery] = useState("");

  const search = (
    <label className="mb-6 flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2.5 focus-within:border-signal/40">
      <Search size={15} className="shrink-0 text-muted" />
      <span className="sr-only">Search documentation</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search docs" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/70" />
    </label>
  );

  return (
    <>
      <aside className="no-print sticky top-24 hidden h-[calc(100dvh-7rem)] w-64 shrink-0 overflow-y-auto border-r border-line/80 pr-5 lg:block">
        {search}<Navigation query={query} />
      </aside>
      <details className="no-print mb-8 rounded-xl border border-line bg-panel p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Browse documentation</summary>
        <div className="mt-5">{search}<Navigation query={query} /></div>
      </details>
    </>
  );
}
