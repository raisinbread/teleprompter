import type {
  InputArgs,
  OutputArgs,
  ToolAnnotations,
  ToolCallback,
} from '@modelcontextprotocol/sdk/types.js';

export type TeleprompterTool = {
  config: {
    description?: string;
    inputSchema?: InputArgs;
    outputSchema?: OutputArgs;
    annotations?: ToolAnnotations;
  };
  cb: ToolCallback<InputArgs>;
};
