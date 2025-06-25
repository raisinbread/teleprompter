import { z } from 'zod';
import type { TeleprompterTool } from './TeleprompterTool.d.ts';
import PromptIndex, { Prompts } from '../PromptIndex.js';

const createUsePromptTool = (
  promptIndex: Prompts = PromptIndex,
): TeleprompterTool => ({
  config: {
    description:
      'If the user has sent a message containing a prompt tag, use the this tool to fetch the prompt, and follow it\'s instructions. For example, if the user sends ">> new-journal-entry", this tool will fetch the prompt with the ID "new-journal-entry", so you can use it to generate a new journal entry. Template variables may be included in the template, and are marked with double curly braces. For example, "Hello, {{name}}!". Based on your current session with the end user, fill in values for these variables. If a value cannot be determined, ask the user for it, then follow the instructions in the promopt.',
    inputSchema: {
      id: z.string().describe('The ID of the prompt to use.'),
    },
    outputSchema: {
      prompt: z.string().describe('The contents of the prompt.'),
    },
  },
  cb: async ({ id }: { id: string }) => {
    const prompt = await promptIndex.query(id);
    return {
      prompt,
    };
  },
});

const UsePromptTool = createUsePromptTool();

export { createUsePromptTool };
export default UsePromptTool;
