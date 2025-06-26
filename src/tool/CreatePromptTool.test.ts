import { describe, it, expect } from 'vitest';
import { createCreatePromptTool } from './CreatePromptTool.js';
import { Prompts } from '../PromptIndex.js';
import fs from 'fs';

// Helper to create a clean temp directory for each test
function createTempPrompts() {
  const tmpDir = `/tmp/prompts-test-${Math.random().toString(36).slice(2)}`;
  if (fs.existsSync(tmpDir))
    fs.rmSync(tmpDir, { recursive: true, force: true });
  return new Prompts(tmpDir);
}

describe('CreatePromptTool', () => {
  it('works successfully', async () => {
    const prompts = createTempPrompts();
    const tool = createCreatePromptTool(prompts);
    const result = await tool.cb({
      id: 'TestPrompt',
      contents: 'This is the prompt contents.',
    });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'Prompt successfully created.' }],
    });
  });
});
