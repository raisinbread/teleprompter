import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import CreatePromptTool from './tool/CreatePromptTool.js';
import type { TeleprompterTool } from './types/TeleprompterTool.js';
import UsePromptTool from './tool/UsePromptTool.js';
import SearchPromptsTool from './tool/SearchPromptsTool.js';
import ListPromptsTool from './tool/ListPromptsTool.js';

export const server = new McpServer({
  name: 'Teleprompter',
  version: '1.0.0',
});

const register = (name: string, tool: TeleprompterTool) => {
  server.registerTool(name, tool.config, tool.cb);
};

register('createPrompt', CreatePromptTool);
register('usePrompt', UsePromptTool);
register('searchPrompts', SearchPromptsTool);
register('listPrompts', ListPromptsTool);

const transport = new StdioServerTransport();
await server.connect(transport);
