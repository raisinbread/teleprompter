import { describe, expect, it, vi } from 'vitest';
import { Prompts } from './PromptIndex';
import fs from 'fs';

describe('PromptIndex', () => {
  it('successfully saves and queries prompts', async () => {
    const index = new Prompts('/tmp/prompts');
    await index.reset();

    await index.create('test-prompt-1', 'This is a test prompt');
    const result = await index.query('This is a test prompt');

    expect(result).toEqual({
      id: 'test-prompt-1',
      prompt: 'This is a test prompt',
    });
  });

  it('throws error when PROMPT_STORAGE_PATH environment variable is missing', () => {
    const originalValue = process.env.PROMPT_STORAGE_PATH;
    delete process.env.PROMPT_STORAGE_PATH;

    try {
      expect(() => new Prompts()).toThrow(
        'The PROMPT_STORAGE_PATH environment variable is not set. Please set it using an .env file or via MCP environment settings for your client.',
      );
    } finally {
      if (originalValue !== undefined) {
        process.env.PROMPT_STORAGE_PATH = originalValue;
      }
    }
  });

  it('handles errors during index update', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const readDirSpy = vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('Permission denied');
    });

    try {
      const index = new Prompts('/tmp/prompts');
      index.updateIndex();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Teleprompter] - Error updating index: Error: Permission denied',
      );
    } finally {
      consoleSpy.mockRestore();
      readDirSpy.mockRestore();
    }
  });

  it('returns null and logs error when no prompt is found in query', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const index = new Prompts('/tmp/prompts');
      index.reset();

      const result = index.query('nonexistent prompt');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Teleprompter] - No prompt found for nonexistent prompt',
      );
    } finally {
      consoleSpy.mockRestore();
    }
  });
});
