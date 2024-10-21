module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  settings: { react: { version: 'detect' } },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules', 'src/zeus'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    // '@typescript-eslint/no-unused-vars': [
    //   'error',
    //   {
    //     args: 'all',
    //     argsIgnorePattern: '^_',
    //     caughtErrors: 'all',
    //     caughtErrorsIgnorePattern: '^_',
    //     destructuredArrayIgnorePattern: '^_',
    //     varsIgnorePattern: '^_',
    //     ignoreRestSiblings: true,
    //   },
    // ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
