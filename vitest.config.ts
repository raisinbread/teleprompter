import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      PROMPT_STORAGE_PATH: '/tmp/test-prompts',
    },
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
