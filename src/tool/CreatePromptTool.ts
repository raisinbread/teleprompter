import { z } from 'zod';
import type { TeleprompterTool } from './TeleprompterTool.d.ts';
import PromptIndex, { Prompts } from '../PromptIndex.js';

const createCreatePromptTool = (
  promptIndex: Prompts = PromptIndex,
): TeleprompterTool => ({
  config: {
    description:
      'Create a new Teleprompter prompt. Wrap template variables in double curly braces. For example, "Hello, {{name}}!"',
    inputSchema: {
      id: z
        .string()
        .describe(
          'The ID, or "tag" for the new prompt. This will be used by the user later on to apply prompt usage with an LLM they are chatting with. For example, ">> new-journal-entry". IDs must be suitable for use as a file name.',
        ),
      contents: z
        .string()
        .describe(
          'The contents of the prompt, with variables placeholders marked with double curly braces. For example, "Hello, {{name}}!"',
        ),
    },
  },
  cb: async ({ id, contents }: { id: string; contents: string }) => {
    await promptIndex.create(id, contents);
    return {
      content: [{ type: 'text', text: 'Prompt successfully created.' }],
    };
  },
});

export { createCreatePromptTool };
export default createCreatePromptTool();
