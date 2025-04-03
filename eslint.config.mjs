// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import * as importPlugin from 'eslint-plugin-import';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        files: ['**/*.json'],
        language: 'json/json',
        rules: {
            'json/no-duplicate-keys': 'error',
            'no-irregular-whitespace': 'off',
        },
    },
    {
        files: ['apps/server/**/*.ts', 'plugins/**/*.ts', 'packages/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        plugins: {
            import: importPlugin,
        },
    },
    tailwind.configs['flat/recommended'].map(config => ({
        ...config,
        files: [
            'apps/panel/**/*.{ts,tsx}',
            'packages/admin-dashboard/**/*.{ts,tsx}',
            'packages/react-ui-devkit/**/*.{ts,tsx}',
            'plugins/**/*.{ts,tsx}',
        ],
        settings: {
            tailwindcss: { config: './apps/panel/tailwind.config.js' },
        },
    })),
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
);
