import { z } from 'zod';
import type { TeleprompterTool } from '../types/TeleprompterTool';
import PromptIndex, { Prompts } from '../PromptIndex.js';
import { MAX_PROMPT_PREVIEW_LENGTH } from '../TeleprompterConfig.js';

const createSearchPromptsTool = (
  promptIndex: Prompts = PromptIndex,
): TeleprompterTool => ({
  config: {
    description:
      'Fuzzy search the available Teleprompter prompts by text. Returns a list of matching prompt IDs and their content, so the user can discover prompts even if they do not know the exact tag or ID.',
    inputSchema: {
      query: z
        .string()
        .describe('The text to search for among available prompts.'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(20)
        .default(5)
        .optional()
        .describe('Maximum number of results to return (default: 5, max: 20).'),
    },
  },
  cb: async (input: { query: string; limit?: number }) => {
    const schema = z.object({
      query: z
        .string()
        .describe('The text to search for among available prompts.'),
      limit: z.number().int().min(1).max(20).default(5).optional(),
    });
    const { query, limit = 5 } = schema.parse(input);
    const results = promptIndex.search(query, limit);
    if (!results.length) {
      return {
        content: [{ type: 'text', text: 'No matching prompts found.' }],
      };
    }
    return {
      content: [
        {
          type: 'text',
          text: results
            .map(
              (r, i) =>
                `${i + 1}. ID: ${r.id}\n${r.prompt.length > MAX_PROMPT_PREVIEW_LENGTH ? r.prompt.slice(0, MAX_PROMPT_PREVIEW_LENGTH) + '...' : r.prompt}`,
            )
            .join('\n\n'),
        },
      ],
    };
  },
});

export { createSearchPromptsTool };
export default createSearchPromptsTool();
