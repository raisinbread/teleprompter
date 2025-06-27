import type { TeleprompterTool } from '../types/TeleprompterTool';
import PromptIndex, { Prompts } from '../PromptIndex.js';
import { MAX_PROMPT_PREVIEW_LENGTH } from '../TeleprompterConfig.js';

const createListPromptsTool = (
  promptIndex: Prompts = PromptIndex,
): TeleprompterTool => ({
  config: {
    description:
      'List all available Teleprompter prompts. Returns a list of all prompt IDs and their content.',
    inputSchema: {},
  },
  cb: async () => {
    const results = promptIndex.listAll();
    if (!results.length) {
      return {
        content: [{ type: 'text', text: 'No prompts found.' }],
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

export { createListPromptsTool };
export default createListPromptsTool();
