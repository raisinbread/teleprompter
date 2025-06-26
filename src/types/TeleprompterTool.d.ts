import type {
  InputArgs,
  OutputArgs,
  ToolAnnotations,
  ToolCallback,
} from '@modelcontextprotocol/sdk/types.js';

export type TeleprompterTool = {
  readonly config: {
    readonly description?: string;
    readonly inputSchema?: InputArgs;
    readonly outputSchema?: OutputArgs;
    readonly annotations?: ToolAnnotations;
  };
  readonly cb: ToolCallback<InputArgs>;
};
