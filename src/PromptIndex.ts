import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import MiniSearch from 'minisearch';
import logError from './log/LogError';

export class Prompts {
  indexPath: string;
  index: MiniSearch<{ id: string; content: string }>;

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

  create(id: string, text: string) {
    // ensure the ID is safe and unique
    // ensure there's not a duplicate template in the index already

    this.ensureDirectoryExists();
    this.index.add({ id, content: text });
    fs.writeFileSync(path.join(this.indexPath, `${id}.md`), text);
  }

  query(text: string) {
    const results = this.index.search(text);
    if (results && results.length > 0) {
      const { id, content } = results[0];
      return {
        id,
        prompt: content,
      };
    }
    logError(`No prompt found for ${text}`);
    return null;
  }
}

const PromptIndex = new Prompts();
export default PromptIndex;
