import { FlatCompat } from "@eslint/eslintrc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Accessibility rules were not enforced at all before; several of the
  // defects fixed in this pass (unlabelled selects, non-descriptive alt text)
  // are ones these rules catch automatically.
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "jsx-a11y": jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // Radix renders its own semantics through `asChild`, so the static
      // analysis for these two produces false positives on our Select/Sheet.
      "jsx-a11y/label-has-associated-control": [
        "error",
        { assert: "either" },
      ],
      "jsx-a11y/no-autofocus": "warn",
    },
  },

  // shadcn/ui primitives are generic wrappers — their heading/anchor content
  // is supplied by the call site, so the static "must have content" checks
  // can only ever report false positives here.
  {
    files: ["components/ui/**/*.tsx"],
    rules: {
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/anchor-has-content": "off",
    },
  },

  {
    ignores: [".next/**", "node_modules/**", "convex/_generated/**"],
  },
];

export default eslintConfig;
