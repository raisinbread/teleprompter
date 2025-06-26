import { describe, expect, it, vi } from 'vitest';
import { createUsePromptTool } from './UsePromptTool.js';
import { Prompts } from '../PromptIndex.js';

describe('UsePromptTool', () => {
  it('should use the injected PromptIndex to fetch prompts', async () => {
    const mockPromptIndex = {
      queryById: vi.fn().mockResolvedValue({
        id: 'test-prompt',
        prompt: 'This is a test prompt with {{variable}}',
      }),
    } as unknown as Prompts;

    const usePromptTool = createUsePromptTool(mockPromptIndex);
    const result = await usePromptTool.cb({ id: 'test-prompt' });

    expect(result).toEqual({
      content: [
        { type: 'text', text: 'This is a test prompt with {{variable}}' },
      ],
    });
    expect(mockPromptIndex.queryById).toHaveBeenCalledWith('test-prompt');
  });

  it('returns "Prompt not found." when the prompt does not exist', async () => {
    const mockPromptIndex = {
      queryById: vi.fn().mockResolvedValue(null),
    } as unknown as Prompts;

    const usePromptTool = createUsePromptTool(mockPromptIndex);
    const result = await usePromptTool.cb({ id: 'missing-prompt' });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'Prompt not found.' }],
    });
    expect(mockPromptIndex.queryById).toHaveBeenCalledWith('missing-prompt');
  });
});
