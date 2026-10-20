import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import tseslint from "typescript-eslint";
import navigation from "./scripts/lint/navigation.mjs";

export default defineConfig([
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { react, "react-hooks": reactHooks, import: importPlugin, "jsx-a11y": jsxA11y, navigation },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "import/no-anonymous-default-export": "warn",
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",
      "jsx-a11y/alt-text": ["warn", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      // Keep asset exceptions and location checks here; Oxlint supplies the
      // remaining Next.js core-web-vitals rules without fast-glob/braces.
      "navigation/no-html-link-for-pages": "error",
      "navigation/no-location-assign-relative-destination": "warn",
    },
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },
  globalIgnores([
    ".next/**", "out/**", "build/**", "next-env.d.ts",
    "playwright-report/**", "test-results/**", "verification/**",
    "workspaces/**", ".local-verification/**",
  ]),
]);
