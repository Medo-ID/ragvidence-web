import { defineConfig } from "@playwright/test";
import base from "../../playwright.config";

// Focused second-engine verification; the normal production gate stays unchanged.
export default defineConfig(base, {
  testDir: "../../tests/browser",
  workers: 1,
  projects: [{ name: "firefox", use: { browserName: "firefox" } }],
});
