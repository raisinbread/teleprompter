// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import pluginImport from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['dist/', 'coverage/', 'coverage/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'always',
          jsx: 'always',
          ts: 'never',
          tsx: 'never',
        },
      ],
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
); 