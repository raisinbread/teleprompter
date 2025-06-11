import { z } from 'zod';
import type { TeleprompterTool } from './TeleprompterTool.d.ts';
import PromptIndex from '../PromptIndex.js';

const CreatePromptTool: TeleprompterTool = {
  config: {
    description: 'Create a new Teleprompter prompt.',
    inputSchema: {
      name: z.string().describe('The name, or "tag" for the new prompt.'),
      description: z.string().describe('A description of the prompt.'),
      contents: z.string().describe('The contents of the prompt.'),
    },
    outputSchema: {
      success: z
        .boolean()
        .describe('Whether the prompt was created successfully.'),
    },
  },
  cb: async ({
    name,
    description,
    contents,
  }: {
    name: string;
    description: string;
    contents: string;
  }) => {
    await PromptIndex.create(contents, { name, description });
    return {
      content: [{ type: 'text', text: 'Prompt successfully created!' }],
      success: true,
    };
  },
};

export default CreatePromptTool;
