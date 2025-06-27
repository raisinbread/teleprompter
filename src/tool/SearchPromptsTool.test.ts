import { describe, expect, it, vi } from 'vitest';
import { createSearchPromptsTool } from './SearchPromptsTool.js';
import { Prompts } from '../PromptIndex.js';

describe('SearchPromptsTool', () => {
  it('returns matching prompts with IDs and content', async () => {
    const mockResults = [
      { id: 'prompt-1', prompt: 'First prompt content.' },
      { id: 'prompt-2', prompt: 'Second prompt content.' },
    ];
    const mockPromptIndex = {
      search: vi.fn().mockReturnValue(mockResults),
    } as unknown as Prompts;

    const tool = createSearchPromptsTool(mockPromptIndex);
    const result = await tool.cb({ query: 'prompt', limit: 2 });
    expect(result.content[0].text).toContain('1. ID: prompt-1');
    expect(result.content[0].text).toContain('2. ID: prompt-2');
    expect(mockPromptIndex.search).toHaveBeenCalledWith('prompt', 2);
  });

  it('returns a message when no prompts are found', async () => {
    const mockPromptIndex = {
      search: vi.fn().mockReturnValue([]),
    } as unknown as Prompts;
    const tool = createSearchPromptsTool(mockPromptIndex);
    const result = await tool.cb({ query: 'no-match' });
    expect(result.content[0].text).toBe('No matching prompts found.');
    expect(mockPromptIndex.search).toHaveBeenCalledWith('no-match', 5);
  });

  it('limits the number of results returned', async () => {
    const mockResults = Array.from({ length: 10 }, (_, i) => ({
      id: `prompt-${i + 1}`,
      prompt: `Prompt content ${i + 1}`,
    }));
    const mockPromptIndex = {
      search: vi.fn().mockReturnValue(mockResults.slice(0, 3)),
    } as unknown as Prompts;
    const tool = createSearchPromptsTool(mockPromptIndex);
    const result = await tool.cb({ query: 'prompt', limit: 3 });
    expect(result.content[0].text).toContain('1. ID: prompt-1');
    expect(result.content[0].text).toContain('3. ID: prompt-3');
    expect(mockPromptIndex.search).toHaveBeenCalledWith('prompt', 3);
  });
});
