"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "./brand";

const links = [
  { href: "/#walkthrough", label: "Walkthrough" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#proof", label: "Proof" },
  { href: "/#open-source", label: "Open source" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  return (
    <header className="site-nav no-print sticky top-0 z-50 border-b border-line/80">
      <nav aria-label="Primary navigation" className="shell flex h-17 items-center justify-between gap-6">
        <Brand onClick={() => setOpen(false)} />
        <div className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname.startsWith("/docs") && link.href === "/docs" ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-md px-3 text-sm text-ink transition-colors hover:bg-canvas/20 ${pathname.startsWith("/docs") && link.href === "/docs" ? "font-semibold" : "font-normal"}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/docs/installation" className="ml-3 inline-flex min-h-10 items-center rounded-sm button-primary px-4 text-sm font-semibold transition-colors">Install CLI</Link>
        </div>
        <button ref={toggleRef} type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center border border-line text-ink hover:bg-canvas/20 xl:hidden">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <div id="mobile-navigation" hidden={!open} className="surface border-t border-line xl:hidden">
        <div className="shell py-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm text-muted hover:bg-white/4 hover:text-ink">{link.label}</Link>
          ))}
          <Link href="/docs/installation" onClick={() => setOpen(false)} className="mt-2 block rounded-sm button-primary px-3 py-3 text-sm font-semibold ">Install CLI</Link>
        </div>
      </div>
      <noscript>
        <div className="shell flex flex-wrap gap-6 border-t border-line py-3 text-sm text-ink xl:hidden">
          <Link href="/docs/installation">Install CLI</Link>
          <Link href="/docs">Documentation</Link>
          <a href="/sample-report.html">Sample report</a>
        </div>
      </noscript>
    </header>
  );
}
