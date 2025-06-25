import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { Index } from 'flexsearch';

export class Prompts {
  indexPath: string;
  index: Index;

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
    this.index.clear();

    try {
      const files = fs.readdirSync(this.indexPath, {
        recursive: true,
        withFileTypes: true,
      });

      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.md')) {
          const filePath = path.join(file.parentPath, file.name);
          const id = path.basename(file.name, '.md');
          const content = fs.readFileSync(filePath, 'utf-8');

          this.index.add(id, content);
        }
      }
    } catch (error) {
      console.error('Error updating index:', error);
    }
  }

  createIndex() {
    return new Index({
      preset: 'performance',
      tokenize: 'forward',
      resolution: 9,
    });
  }

  ensureDirectoryExists() {
    if (!fs.existsSync(this.indexPath)) {
      fs.mkdirSync(this.indexPath, { recursive: true });
    }
  }

  reset() {
    fs.rmSync(this.indexPath, { recursive: true, force: true });
    this.index.clear();
  }

  create(id: string, text: string) {
    // ensure the ID is safe and unique
    // ensure there's not a duplicate template in the index already

    this.ensureDirectoryExists();
    this.index.add(id, text);
    fs.writeFileSync(path.join(this.indexPath, `${id}.md`), text);
  }

  query(text: string) {
    const results = this.index.search(text);
    if (results && results.length > 0) {
      const id = results[0];
      const prompt = fs.readFileSync(
        path.join(this.indexPath, `${id}.md`),
        'utf-8',
      );
      return {
        id,
        prompt,
      };
    }
    console.error(`No prompt found for ${text}`);
    return null;
  }
}

const PromptIndex = new Prompts();
export default PromptIndex;
