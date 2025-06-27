import { z } from 'zod';
import type { TeleprompterTool } from '../types/TeleprompterTool';
import PromptIndex, { Prompts } from '../PromptIndex.js';

const createUsePromptTool = (
  promptIndex: Prompts = PromptIndex,
): TeleprompterTool => ({
  config: {
    description:
      'If the user has sent a message containing a prompt tag, use the this tool to fetch the prompt, and follow its instructions. For example, if the user sends ">> new-journal-entry", this tool will fetch the prompt with the ID "new-journal-entry", so you can use it to generate a new journal entry. Template variables may be included in the template, and are marked with double curly braces. For example, "Hello, {{name}}!". Based on your current session with the end user, fill in values for these variables. If a value cannot be determined, ask the user for it, then follow the instructions in the prompt.',
    inputSchema: {
      id: z.string().describe('The ID of the prompt to use.'),
    },
  },
  cb: async (input: { id: string }) => {
    const schema = z.object({
      id: z.string().describe('The ID of the prompt to use.'),
    });
    const { id } = schema.parse(input);
    const result = await promptIndex.queryById(id);
    const prompt = result?.prompt ?? 'Prompt not found.';
    return {
      content: [{ type: 'text', text: prompt }],
    };
  },
});

const UsePromptTool = createUsePromptTool();

export { createUsePromptTool };
export default UsePromptTool;
