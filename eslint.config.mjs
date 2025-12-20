import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Import ordering and auto-organization
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
        },
      ],
      "import/no-unresolved": "error",
      "import/no-duplicates": "warn",

      // Prettier-aligned rules based on .prettierrc
      "semi": ["error", "never"],
      "quotes": ["error", "single", { avoidEscape: true }],
      "jsx-quotes": ["error", "prefer-single"],
      "comma-dangle": ["error", "none"],
      "arrow-parens": ["error", "always"],
      "object-curly-spacing": ["error", "always"],
      "no-multi-spaces": "error",
      "no-trailing-spaces": "error",
    },
  },
  prettierConfig,
];

export default eslintConfig;
