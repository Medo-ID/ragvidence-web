"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; type: "h2" | "h3" };

export function OnThisPage({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0]?.id;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 130) current = heading.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  if (!headings.length) return null;
  const links = (
    <ul className="space-y-1">
      {headings.map(heading => <li key={heading.id}><a href={`#${heading.id}`} aria-current={active === heading.id ? "location" : undefined} className={`block min-h-11 rounded-md border-l-2 py-2 text-sm leading-6 ${heading.type === "h3" ? "pl-5" : "pl-3"} ${active === heading.id ? "border-signal-ink bg-signal-soft font-medium text-ink" : "border-transparent text-muted hover:text-ink"}`}>{heading.text}</a></li>)}
    </ul>
  );
  return (
    <div className="on-this-page no-print">
      <details className="surface p-4 xl:hidden">
        <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-ink">On this page</summary>
        <nav aria-label="On this page" className="mt-3">{links}</nav>
      </details>
      <nav aria-label="On this page" className="hidden xl:block">
        <p className="mb-3 text-sm font-semibold text-ink">On this page</p>
        {links}
      </nav>
    </div>
  );
}
