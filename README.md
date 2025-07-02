# Teleprompter

<div align="center">
  <img src="assets/logo.png" alt="Teleprompter Logo" width="200"/>
</div>

An MCP server that manages and exposes tools to allow prompt re-use with LLMs.

---

## Table of Contents
- [Features](#features)
- [MCP Configuration](#mcp-configuration)
- [Usage Examples](#usage-examples)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features
- **Prompt Storage & Reuse:** Store, search, and retrieve prompt templates for LLMs.
- **MCP Server:** Exposes prompt tools via the [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/spec).
- **Prompt Variables:** Supports template variables (e.g., `{{name}}`) for dynamic prompt generation.
- **Search:** Fast full-text search over stored prompts using [MiniSearch](https://github.com/lucaong/minisearch).
- **TypeScript:** Modern, type-safe codebase.
- **Extensive Testing:** Includes unit and integration tests with [Vitest](https://vitest.dev/).

## MCP Configuration

To use Teleprompter with your LLM client, add this configuration:

```json
{
  "mcpServers": {
    "teleprompter": {
      "command": "npx",
      "args": ["-y", "mcp-teleprompter"],
      "env": {
        "PROMPT_STORAGE_PATH": "/path/to/your/prompts-directory"
      }
    }
  }
}
```


**Note:** Replace `/path/to/your/prompts-directory` with the absolute path where you want prompts stored.

---

## Usage Examples

Once configured, you can use Teleprompter with your LLM by using prompt tags in your conversations. Here's a detailed example that shows how it solves the problem of repeating complex instructions:

### 🎵 Music Discovery on Spotify

**The Problem:** Every time you want music recommendations, you have to remind your LLM of all your preferences and constraints:
- "Don't suggest songs I already have in my playlists"
- "Avoid explicit lyrics"
- "Add songs to my queue for review, not directly to playlists"
- "Focus on discovering new artists, not just popular hits"
- "Consider my current activity and mood"
- "Provide brief explanations for why each song fits"

**The Solution:** Create a prompt that captures all these instructions once.

**Creating the prompt:**
Ask your LLM: "Create a prompt called 'spotify-discover' that helps me find new music with all my specific preferences and workflow requirements."

This creates a comprehensive template like:
```markdown
I'm looking for music recommendations for Spotify based on:

**Current mood:** {{mood}}
**Activity/setting:** {{activity}}
**Preferred genres:** {{genres}}
**Recent artists I've enjoyed:** {{recent_artists}}

**Important constraints:**
- DO NOT suggest songs I already have in my existing playlists
- Avoid explicit lyrics (clean versions only)
- Focus on discovering new/lesser-known artists, not just popular hits
- Provide 5-7 song recommendations maximum

**Workflow:**
- Add recommendations to my Spotify queue (not directly to playlists)
- I'll review and save the ones I like to appropriate playlists later

**For each recommendation, include:**
- Artist and song name
- Brief explanation (1-2 sentences) of why it fits my current mood/activity
- Similar artists I might also enjoy

Please help me discover music that matches this vibe while following these preferences.
```

**Using it:**
```
>> spotify-discover
```
Now you just fill in your current mood and activity, and get perfectly tailored recommendations that follow all your rules—no need to repeat your constraints every time.

### 🔄 Other Common Use Cases

**📋 Work Ticket Management**
- Create prompts for JIRA/Linear ticket formatting with your team's specific requirements
- Include standard fields, priority levels, acceptance criteria templates
- Avoid repeating your company's ticket standards every time

**📧 Email Templates**
- Customer support responses with your company's tone and required disclaimers
- Follow-up sequences that match your communication style
- Automated inclusion of signatures, links, and standard information

**📝 Code Review Guidelines**
- Technical review checklists with your team's specific standards
- Security considerations and performance criteria
- Documentation requirements and testing expectations

The common thread: **stop repeating yourself**. If you find yourself giving the same detailed instructions to your LLM repeatedly, create a prompt for it.

### 🔍 Discovering Existing Prompts

You can search your prompt library:
```
Can you search my prompts for "productivity" or "task management"?
```

Or list all available prompts:
```
What prompts do I have available?
```

### ✏️ Manual Editing

Prompts are stored as simple markdown files in your `PROMPT_STORAGE_PATH` directory. You can also create and edit them directly with your favorite text editor:

- Each prompt is saved as `{id}.md` in your prompts directory
- Use `{{variable_name}}` syntax for template variables
- Standard markdown formatting is supported
- File changes are automatically picked up by the server

### 💡 Best Practices

1. **Use descriptive IDs:** Choose prompt IDs that clearly indicate their purpose (e.g., `meeting-notes`, `code-review-checklist`)

2. **Include helpful variables:** Use `{{variable_name}}` for dynamic content that changes each time you use the prompt

3. **Organize by category:** Consider using prefixes like `task-`, `content-`, `analysis-` to group related prompts

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

*Made with ❤️ by John Anderson* 