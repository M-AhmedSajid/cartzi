import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  js.configs.recommended, // optional, adds base JS rules
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      "@next/next": nextPlugin,
    },
  },
];

export default eslintConfig;
