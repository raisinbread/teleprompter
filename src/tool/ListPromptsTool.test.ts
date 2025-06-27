import { describe, expect, it, vi } from 'vitest';
import { createListPromptsTool } from './ListPromptsTool.js';
import { Prompts } from '../PromptIndex.js';

describe('ListPromptsTool', () => {
  it('returns all prompts with IDs and content', async () => {
    const mockResults = [
      { id: 'prompt-1', prompt: 'First prompt content.' },
      { id: 'prompt-2', prompt: 'Second prompt content.' },
    ];
    const mockPromptIndex = {
      listAll: vi.fn().mockReturnValue(mockResults),
    } as unknown as Prompts;

    const tool = createListPromptsTool(mockPromptIndex);
    const result = await tool.cb({});
    expect(result.content[0].text).toContain('1. ID: prompt-1');
    expect(result.content[0].text).toContain('2. ID: prompt-2');
    expect(mockPromptIndex.listAll).toHaveBeenCalled();
  });

  it('returns a message when no prompts are found', async () => {
    const mockPromptIndex = {
      listAll: vi.fn().mockReturnValue([]),
    } as unknown as Prompts;
    const tool = createListPromptsTool(mockPromptIndex);
    const result = await tool.cb({});
    expect(result.content[0].text).toBe('No prompts found.');
    expect(mockPromptIndex.listAll).toHaveBeenCalled();
  });
});
