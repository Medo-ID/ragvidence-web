"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "./brand";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#proof", label: "Proof" },
  { href: "/#plans", label: "Plans" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-50 px-4 pt-3">
      <nav aria-label="Primary navigation" className="mx-auto flex h-[3.65rem] max-w-[1180px] items-center justify-between rounded-2xl border border-line/85 bg-canvas/80 px-3 shadow-[0_14px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-4">
        <Brand />
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/[0.04] hover:text-ink ${pathname.startsWith("/docs") && link.href === "/docs" ? "text-ink" : "text-muted"}`}>
              {link.label}
            </Link>
          ))}
          <a href="https://test.pypi.org/project/ragvidence/" target="_blank" rel="noreferrer" className="ml-2 rounded-lg border border-signal/30 bg-signal/10 px-3.5 py-2 text-sm font-semibold text-signal transition-colors hover:bg-signal/15">v0.1.0</a>
        </div>
        <button type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-white/[0.05] hover:text-ink md:hidden">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div id="mobile-navigation" className="mx-auto mt-2 max-w-[1180px] rounded-2xl border border-line bg-panel/95 p-2 shadow-2xl backdrop-blur-xl md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-muted hover:bg-white/[0.04] hover:text-ink">{link.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
