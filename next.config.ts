import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/opengraph-image": ["./node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf"],
  },
  // Explicit --webpack verification uses the same CSS compiler as Turbopack.
  // This hook is ignored by the normal Turbopack build.
  webpack(config) {
    const addCompiler = (rules: typeof config.module.rules) => {
      for (const rule of rules) {
        if (!rule || typeof rule !== "object") continue;
        if (Array.isArray(rule.oneOf)) addCompiler(rule.oneOf);
        if (Array.isArray(rule.rules)) addCompiler(rule.rules);
        if (Array.isArray(rule.use) && rule.use.some((entry: { loader?: string } | string) =>
          typeof entry === "object" && entry.loader?.includes("/postcss-loader/"))) {
          rule.use.push({ loader: "@tailwindcss/turbopack" });
        }
      }
    };
    addCompiler(config.module.rules);
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      // Review HTML is public for sharing, but should not compete with product pages.
      ...["/brand/concepts.html", "/brand/brand-sheet.html", "/brand/:concept/tab-preview.html"].map(source => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      })),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
