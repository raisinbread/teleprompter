import { describe, expect, it, vi } from 'vitest';
import { Prompts } from './PromptIndex.js';
import fs from 'fs';

describe('PromptIndex', () => {
  it('successfully saves and queries prompts', async () => {
    const index = new Prompts('/tmp/prompts');
    await index.reset();

    await index.create('test-prompt-1', 'This is a test prompt');
    const result = await index.queryByText('This is a test prompt');

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

      const result = index.queryByText('nonexistent prompt');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Teleprompter] - No prompt found for text: nonexistent prompt',
      );
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it('throws error when creating with invalid ID', async () => {
    const index = new Prompts('/tmp/prompts');
    await index.reset();
    await expect(() => index.create('invalid/id', 'text')).toThrow(
      "Invalid prompt ID: 'invalid/id'. IDs must be alphanumeric, dashes, or underscores only.",
    );
  });

  it('throws error when creating a duplicate ID', async () => {
    const index = new Prompts('/tmp/prompts');
    await index.reset();
    await index.create('dupe', 'first');
    await expect(() => index.create('dupe', 'second')).toThrow(
      "Prompt with ID 'dupe' already exists.",
    );
  });

  it('queryById returns null and logs error if file does not exist', () => {
    const index = new Prompts('/tmp/prompts');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = index.queryById('notfound');
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Teleprompter] - No prompt found for ID notfound',
    );
    consoleSpy.mockRestore();
  });

  it('queryByText returns null and logs error if no results', () => {
    const index = new Prompts('/tmp/prompts');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = index.queryByText('no-such-content');
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Teleprompter] - No prompt found for text: no-such-content',
    );
    consoleSpy.mockRestore();
  });
});
