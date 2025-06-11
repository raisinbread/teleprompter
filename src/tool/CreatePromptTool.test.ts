import { describe, it, expect } from 'vitest';
import CreatePromptTool from './CreatePromptTool.js';

describe('CreatePromptTool', () => {
  it('works successfully', async () => {
    const result = await CreatePromptTool.cb({
      name: 'TestPrompt',
      description: 'A test prompt',
      contents: 'This is the prompt contents.',
    });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'Prompt successfully created!' }],
      success: true,
    });
  });
});
