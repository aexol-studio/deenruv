// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "**/dist/**",
      "**/lib/**",
      "**/cli/**",
      "**/package/**",
      "**/node_modules/**",
      "**/zeus/**",
      "**/client/**",
      "**/generated-shop-types.ts",
      "**/generated-admin-types.ts",
      "**/generated-e2e-shop-types.ts",
      "**/generated-e2e-admin-types.ts",
      "**/*.Dockerfile",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "no-prototype-builtins": "warn",
      "no-case-declarations": "warn",
      "no-useless-catch": "warn",
      "no-async-promise-executor": "warn",
      "no-empty": "warn",
      "no-useless-escape": "warn",
      "no-constant-binary-expression": "warn",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-i18next",
              message:
                "Do not import from 'react-i18next'. Use 'useTranslation' from '@deenruv/react-ui-devkit' instead.",
            },
          ],
        },
      ],
    },
  },
);
