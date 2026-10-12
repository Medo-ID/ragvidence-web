"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { DocNavigation } from "@/lib/docs";

type NavigationProps = { pages: DocNavigation[]; groups: string[] };

function Navigation({ query, pages, groups, close }: NavigationProps & { query: string; close?: () => void }) {
  const pathname = usePathname();
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return pages;
    return pages.filter((doc) => `${doc.title} ${doc.description} ${doc.group}`.toLowerCase().includes(value));
  }, [query, pages]);

  if (!matches.length) return <p role="status" className="px-3 py-5 text-sm text-muted">No documentation pages match “{query}”.</p>;

  return (
    <nav aria-label="Documentation">
      {groups.map((group) => {
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
                    <Link href={`/docs/${doc.slug}`} onClick={close} aria-current={active ? "page" : undefined} className={`block rounded-none px-3 py-2 text-sm transition-colors ${active ? "bg-signal/10 font-medium text-signal" : "text-muted hover:bg-white/[0.035] hover:text-ink"}`}>
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

export function DocsSidebar({ pages, groups }: NavigationProps) {
  const [query, setQuery] = useState("");
  const mobileRef = useRef<HTMLDetailsElement>(null);

  function close() {
    if (mobileRef.current) {
      mobileRef.current.open = false;
      mobileRef.current.querySelector("summary")?.focus();
    }
  }

  const search = (
    <label className="mb-6 flex items-center gap-2 rounded-none border border-line bg-canvas px-3 py-2.5 focus-within:border-signal/40">
      <Search size={15} className="shrink-0 text-muted" />
      <span className="sr-only">Search documentation</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search docs" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/70" />
    </label>
  );

  return (
    <>
      <aside className="no-print sticky top-24 hidden h-[calc(100dvh-7rem)] w-64 shrink-0 overflow-y-auto border-r border-line/80 pr-5 lg:block">
        {search}<Navigation query={query} pages={pages} groups={groups} />
      </aside>
      <details ref={mobileRef} className="glass-panel no-print w-full border border-line p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Browse documentation</summary>
        <div className="mt-5">{search}<Navigation query={query} pages={pages} groups={groups} close={close} /></div>
      </details>
    </>
  );
}
