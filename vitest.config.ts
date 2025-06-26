import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      'bin/**',
      'dist/**',
      'node_modules/**',
      '*.config.mjs',
      '*.config.ts',
      '**/*.d.ts',
    ],
    coverage: {
      exclude: [
        'bin/**',
        'dist/**',
        'node_modules/**',
        '*.config.mjs',
        '*.config.ts',
        '**/*.d.ts',
      ],
    },
  },
});
