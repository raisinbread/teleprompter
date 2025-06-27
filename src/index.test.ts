import { describe, it, expect } from 'vitest';

// Since index.ts does not export anything, we need to dynamically import it

describe('Server startup', () => {
  it('happens without error', async () => {
    let error: unknown = null;
    try {
      await import('./index.js');
    } catch (err) {
      error = err;
    }
    expect(error).toBeNull();
  });
});
