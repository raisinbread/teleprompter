# Teleprompter

An MCP server that manages and exposes tools to allow prompt re-use with LLMs.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Examples](#examples)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [MCP Configuration Example](#mcp-configuration-example)

---

## Features
- **Prompt Storage & Reuse:** Store, search, and retrieve prompt templates for LLMs.
- **MCP Server:** Exposes prompt tools via the [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/spec).
- **Prompt Variables:** Supports template variables (e.g., `{{name}}`) for dynamic prompt generation.
- **Search:** Fast full-text search over stored prompts using [MiniSearch](https://github.com/lucaong/minisearch).
- **TypeScript:** Modern, type-safe codebase.
- **Extensive Testing:** Includes unit and integration tests with [Vitest](https://vitest.dev/).

---

## Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd teleprompter
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Build the project:**
   ```sh
   npm run build
   ```

---

## Usage

### 1. Set up environment variables
Create a `.env` file in the project root with the following:
```env
PROMPT_STORAGE_PATH=./prompts
```
- `PROMPT_STORAGE_PATH` is required. It specifies the directory where prompt files are stored.

### 2. Start the server
```sh
npm run build
npx teleprompter
```
Or, if installed globally:
```sh
teleprompter
```

The server will start and expose MCP tools for prompt management.

---

## Environment Variables
| Variable              | Required | Description                                      |
|-----------------------|----------|--------------------------------------------------|
| `PROMPT_STORAGE_PATH` | Yes      | Directory path for storing prompt `.md` files.    |

If not set, the server will throw an error on startup.

---

## Examples

### Creating a Prompt
You can use the `createPrompt` tool to add a new prompt:
```json
{
  "id": "new-journal-entry",
  "contents": "Today I feel {{mood}} because {{reason}}."
}
```
- IDs must be alphanumeric, dashes, or underscores only.
- Template variables are wrapped in double curly braces.

### Using a Prompt
You can use the `usePrompt` tool to fetch and fill a prompt by ID:
```json
{
  "id": "new-journal-entry"
}
```
If the prompt contains variables, fill them in based on your session or ask the user for values.

---

## Testing

Run all tests:
```sh
npm test
```

Run tests with coverage:
```sh
npm run test:coverage
```

Tests are written with [Vitest](https://vitest.dev/). Coverage reports are generated in the `coverage/` directory.

---

## Contributing

Contributions are welcome! Please:
- Follow the existing code style (see `.prettierrc.json` and `.eslintrc.mjs`).
- Add tests for new features or bug fixes.
- Document public classes and methods with JSDoc.
- See `todo.md` for ideas and areas for improvement.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgements
- [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/spec)
- [MiniSearch](https://github.com/lucaong/minisearch)
- [Vitest](https://vitest.dev/)
- [Zod](https://zod.dev/)
- [dotenv](https://github.com/motdotla/dotenv)

---

## MCP Configuration Example

To use Teleprompter as an MCP tool, add a configuration similar to the following in your MCP client or orchestrator:

```json
"teleprompter": {
  "command": "/path/to/node",
  "cwd": "/path/to/teleprompter",
  "args": [
    "/path/to/teleprompter/dist/src/index.js"
  ],
  "env": {
    "PROMPT_STORAGE_PATH": "/path/to/prompts-directory"
  }
}
```

- Replace `/path/to/node` with the path to your Node.js executable (e.g., `/usr/bin/node` or output of `which node`).
- Replace `/path/to/teleprompter` with the root directory of your Teleprompter project.
- Replace `/path/to/prompts-directory` with the directory where you want prompts to be stored.

---

*Made with ❤️ by John Anderson* 