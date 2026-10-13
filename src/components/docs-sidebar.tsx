"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DocNavigation } from "@/lib/docs";
import { docPath } from "@/lib/doc-path";

type NavigationProps = { pages: DocNavigation[]; groups: string[] };

type SearchIndex = Record<string, string>;

function Navigation({ query, pages, groups, index, loading, close }: NavigationProps & { query: string; index?: SearchIndex; loading?: boolean; close?: () => void }) {
  const pathname = usePathname();
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return pages;
    const terms = value.split(/\s+/);
    return pages.filter((doc) => {
      const text = index?.[doc.slug] ?? `${doc.title} ${doc.description} ${doc.group}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [query, pages, index]);

  if (!matches.length && loading) return null;
  if (!matches.length) return <p role="status" className="px-3 py-5 text-sm text-muted">No documentation pages match “{query}”.</p>;

  return (
    <nav aria-label="Documentation" className="docs-navigation space-y-9">
      {groups.map((group) => {
        const pages = matches.filter((doc) => doc.group === group);
        if (!pages.length) return null;
        return (
          <div key={group}>
            <h2 className="px-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-muted">{group}</h2>
            <ul className="mt-2">
              {pages.map((doc) => {
                const active = pathname === `/docs/${doc.slug}` || (pathname === "/docs" && doc.slug === "overview");
                return (
                  <li key={doc.slug}>
                    <Link href={docPath(doc.slug)} onClick={close} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center rounded-md px-3 py-2 text-sm leading-5 transition-colors xl:min-h-9 xl:py-1.5 ${active ? "surface-selected font-medium text-ink" : "text-muted hover:bg-white/[0.035] hover:text-ink"}`}>
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
  const requestRef = useRef<AbortController | null>(null);
  const [index, setIndex] = useState<SearchIndex>();
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "ready" | "failed">("idle");

  useEffect(() => () => requestRef.current?.abort(), []);

  async function loadIndex() {
    if (index || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setSearchStatus("loading");
    try {
      const response = await fetch("/docs/search-index.json", { signal: controller.signal });
      if (!response.ok) throw new Error("Search index unavailable");
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || Array.isArray(data) ||
        !pages.every((doc) => typeof (data as Record<string, unknown>)[doc.slug] === "string")) {
        throw new Error("Invalid search index");
      }
      if (!controller.signal.aborted) {
        setIndex(data as SearchIndex);
        setSearchStatus("ready");
      }
    } catch {
      if (!controller.signal.aborted) setSearchStatus("failed");
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  }

  function updateQuery(value: string) {
    setQuery(value);
    if (value.trim() && searchStatus === "idle") void loadIndex();
  }

  function close() {
    if (mobileRef.current) {
      mobileRef.current.open = false;
      mobileRef.current.querySelector("summary")?.focus();
    }
  }

  const search = (
    <label className="search-field mb-6 flex items-center gap-2 rounded-md border border-line bg-canvas px-3 py-2.5 focus-within:border-signal-ink">
      <Search size={15} className="shrink-0 text-muted" />
      <span className="sr-only">Search documentation</span>
      <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search docs" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/70" />
    </label>
  );

  const feedback = query.trim() && (
    <p role="status" className="mb-5 px-3 text-xs leading-5 text-muted">
      {searchStatus === "loading" ? "Loading full-text search…" : searchStatus === "failed" ? (
        <>Article search is unavailable. Showing title and description matches. <button type="button" onClick={() => void loadIndex()} className="min-h-11 text-signal-ink underline">Retry search</button></>
      ) : searchStatus === "ready" ? "Searching titles, descriptions, and article text." : null}
    </p>
  );

  return (
    <>
      <aside className="no-print sticky top-24 hidden h-[calc(100dvh-7rem)] w-full shrink-0 overflow-y-auto border-r border-line bg-canvas py-4 pr-4 xl:block">
        {search}{feedback}<Navigation query={query} pages={pages} groups={groups} index={index} loading={searchStatus === "loading"} />
      </aside>
      <details ref={mobileRef} data-docs-browser className="surface no-print w-full border border-line p-4 xl:hidden">
        <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-ink">Browse documentation</summary>
        <div className="mt-5">{search}{feedback}<Navigation query={query} pages={pages} groups={groups} index={index} loading={searchStatus === "loading"} close={close} /></div>
      </details>
    </>
  );
}
