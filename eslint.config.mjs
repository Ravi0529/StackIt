import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  js.configs.recommended,

  ...compat.extends("next/core-web-vitals"),

  ...compat.extends("plugin:@typescript-eslint/recommended"),

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "no-console": "warn",
      "react/prop-types": "off",
      "@typescript-eslint/no-implicit-any": "error"
    }
  }
];

export default eslintConfig;