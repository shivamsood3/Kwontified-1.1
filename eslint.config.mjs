// Next.js 16 ships its ESLint rules as flat configs; wrapping them in FlatCompat (the
// Next.js 14/15 setup) made ESLint fail on a circular config. `next lint` was removed in 16,
// so `npm run lint` calls ESLint directly.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // CommonJS utility scripts load modules with require()
  { files: ["**/*.cjs"], rules: { "@typescript-eslint/no-require-imports": "off" } },
  // build output and generated files
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "public/**"]),
]);
