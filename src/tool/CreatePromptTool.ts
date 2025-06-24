import { z } from 'zod';
import type { TeleprompterTool } from './TeleprompterTool.d.ts';
import PromptIndex from '../PromptIndex.js';

const CreatePromptTool: TeleprompterTool = {
  config: {
    description: 'Create a new Teleprompter prompt.',
    inputSchema: {
      id: z
        .string()
        .describe(
          'The ID, or "tag" for the new prompt. This will be used by the user later on to apply prompt usage with an LLM they are chatting with. For example, ">> new-journal-entry"',
        ),
      contents: z
        .string()
        .describe(
          'The contents of the prompt, with variables placeholders marked with double curly braces. For example, "Hello, {{name}}!"',
        ),
    },
    outputSchema: {
      success: z
        .boolean()
        .describe('Whether the prompt was created successfully.'),
    },
  },
  cb: async ({ id, contents }: { id: string; contents: string }) => {
    await PromptIndex.create(id, contents);
    return {
      content: [{ type: 'text', text: 'Prompt successfully created!' }],
      success: true,
    };
  },
};

export default CreatePromptTool;
