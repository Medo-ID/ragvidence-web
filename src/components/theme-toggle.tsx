"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useState, useSyncExternalStore } from "react";

function applyTheme(theme: string) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.dataset.theme = theme;
  // Flush the new palette with transitions disabled before restoring hover effects.
  void document.body.offsetHeight;
  root.classList.remove("theme-switching");
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  function sync(event: StorageEvent) {
    if (event.key === "ragvidence-theme") applyTheme(event.newValue === "light" ? "light" : "dark");
  }
  window.addEventListener("storage", sync);
  return () => { observer.disconnect(); window.removeEventListener("storage", sync); };
}

export function ThemeToggle() {
  const light = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme === "light", () => false);
  const [message, setMessage] = useState("");
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem("ragvidence-theme");
      if (stored === "light" || stored === "dark") applyTheme(stored);
    } catch { /* The current document still supports theme switching. */ }
  }, []);
  function toggle() {
    const theme = light ? "dark" : "light";
    applyTheme(theme);
    try { localStorage.setItem("ragvidence-theme", theme); setMessage(""); }
    catch { setMessage("Theme changed for this visit. Browser storage is unavailable."); }
  }
  return <>
    <button type="button" onClick={toggle} aria-label="Light theme" aria-pressed={light} title="Switch color theme" className="theme-toggle grid size-11 shrink-0 place-items-center rounded-md border border-line bg-panel text-ink hover:bg-panel-raised">
      <Sun size={18} aria-hidden="true" className="theme-sun" /><Moon size={18} aria-hidden="true" className="theme-moon" />
    </button>
    <span role="status" className="sr-only">{message}</span>
  </>;
}
