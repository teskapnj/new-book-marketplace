import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript kuralları
      "@typescript-eslint/no-explicit-any": "warn", // error yerine warn
      "@typescript-eslint/no-unused-vars": "warn", // error yerine warn
      
      // React kuralları
      "react/no-unescaped-entities": "off", // apostrophe hataları kapat
      "react/jsx-no-comment-textnodes": "off", // comment hataları kapat
      "react-hooks/exhaustive-deps": "warn", // dependency uyarıları warn yap
      
      // Next.js kuralları
      "@next/next/no-img-element": "warn", // img element uyarıları warn yap
      "@next/next/no-html-link-for-pages": "warn", // html link uyarıları warn yap
      "@next/next/no-page-custom-font": "off", // custom font uyarıları kapat
    }
  }
];

export default eslintConfig;