import { describe, expect, it } from 'vitest';
import { Prompts } from './PromptIndex';

describe('PromptIndex', () => {
  it('successfully saves and queries prompts', async () => {
    const index = new Prompts('/tmp/prompts');
    await index.reset();

    await index.create('test-prompt-1', 'This is a test prompt');
    const result = await index.query('This is a test prompt');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('test-prompt-1');
  });
});
