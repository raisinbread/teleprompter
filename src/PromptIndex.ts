import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import MiniSearch from 'minisearch';
import logError from './log/LogError.js';

export class Prompts {
  readonly indexPath: string;
  readonly index: MiniSearch<{ id: string; content: string }>;

  constructor(indexPath?: string) {
    if (!process.env.PROMPT_STORAGE_PATH) {
      throw new Error(
        'The PROMPT_STORAGE_PATH environment variable is not set. Please set it using an .env file or via MCP environment settings for your client.',
      );
    }
    this.indexPath = indexPath ?? process.env.PROMPT_STORAGE_PATH;
    this.ensureDirectoryExists();
    this.index = this.createIndex();
    this.updateIndex();
  }

  updateIndex() {
    this.ensureDirectoryExists();
    this.index.removeAll();

    try {
      const files = fs.readdirSync(this.indexPath, {
        recursive: true,
        withFileTypes: true,
      });

      const docs = [];
      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.md')) {
          const filePath = path.join(file.parentPath, file.name);
          const id = path.basename(file.name, '.md');
          const content = fs.readFileSync(filePath, 'utf-8');
          docs.push({ id, content });
        }
      }
      if (docs.length > 0) {
        this.index.addAll(docs);
      }
    } catch (error) {
      logError(`Error updating index: ${error}`);
    }
  }

  createIndex() {
    return new MiniSearch<{ id: string; content: string }>({
      fields: ['content'],
      storeFields: ['id', 'content'],
      idField: 'id',
    });
  }

  ensureDirectoryExists() {
    if (!fs.existsSync(this.indexPath)) {
      fs.mkdirSync(this.indexPath, { recursive: true });
    }
  }

  reset() {
    fs.rmSync(this.indexPath, { recursive: true, force: true });
    this.index.removeAll();
  }

  private validateId(id: string) {
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      throw new Error(
        `Invalid prompt ID: '${id}'. IDs must be alphanumeric, dashes, or underscores only.`,
      );
    }
  }

  create(id: string, text: string) {
    this.validateId(id);
    this.ensureDirectoryExists();
    // Check for duplicate
    const filePath = path.join(this.indexPath, `${id}.md`);
    if (fs.existsSync(filePath)) {
      throw new Error(`Prompt with ID '${id}' already exists.`);
    }
    this.index.add({ id, content: text });
    fs.writeFileSync(filePath, text);
  }

  queryById(id: string) {
    this.validateId(id);
    const filePath = path.join(this.indexPath, `${id}.md`);
    if (!fs.existsSync(filePath)) {
      logError(`No prompt found for ID ${id}`);
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return { id, prompt: content };
  }

  queryByText(text: string) {
    const results = this.index.search(text);
    if (results && results.length > 0) {
      const { id, content } = results[0];
      return {
        id,
        prompt: content,
      };
    }
    logError(`No prompt found for text: ${text}`);
    return null;
  }

  search(text: string, limit = 5) {
    const results = this.index.search(text);
    return results
      .slice(0, limit)
      .map(({ id, content }) => ({ id, prompt: content }));
  }

  listAll() {
    this.ensureDirectoryExists();
    try {
      const files = fs.readdirSync(this.indexPath, {
        recursive: true,
        withFileTypes: true,
      });
      const prompts = [];
      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.md')) {
          const filePath = path.join(file.parentPath, file.name);
          const id = path.basename(file.name, '.md');
          const content = fs.readFileSync(filePath, 'utf-8');
          prompts.push({ id, prompt: content });
        }
      }
      return prompts;
    } catch (error) {
      logError(`Error listing prompts: ${error}`);
      return [];
    }
  }
}

const PromptIndex = new Prompts();
export default PromptIndex;
