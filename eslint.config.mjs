import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // TinaCMS auto-generated output — not ours to lint.
    "tina/__generated__/**",
    // Built static assets (incl. the compiled TinaCMS admin bundle in public/admin).
    "public/**",
  ]),
]);

export default eslintConfig;
