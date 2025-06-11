import 'dotenv/config';
import path from 'path';
import { LocalIndex } from 'vectra';
import ollama from 'ollama';
import OpenAI from 'openai';
import fs from 'fs';
import { testVectors } from './PromptIndex.test';

export class Prompts {
  index: LocalIndex;
  indexPath: string;
  openai?: OpenAI;
  mode?: 'openai' | 'ollama';

  constructor(mode?: 'openai' | 'ollama', indexPath?: string) {
    if (!process.env.PROMPT_STORAGE_PATH) {
      throw new Error(
        'The PROMPT_STORAGE_PATH environment variable is not set. Please set it using an .env file or via MCP environment settings for your client.',
      );
    }
    this.indexPath = indexPath ?? process.env.PROMPT_STORAGE_PATH;
    this.index =
      process.env.NODE_ENV === 'test'
        ? new LocalIndex(path.join('/tmp/prompts', 'prompts'))
        : new LocalIndex(path.join(this.indexPath, 'prompts'));
    this.mode = mode;
  }

  async reset() {
    fs.rmSync(this.indexPath, { recursive: true, force: true });
    this.index = new LocalIndex(path.join(this.indexPath, 'prompts'));
    await this.index.createIndex();
  }

  async ensureIndex() {
    if (!(await this.index.isIndexCreated())) {
      await this.index.createIndex();
    }
  }

  async generateVectors(text: string) {
    if (this.mode === 'ollama' || process.env.OLLAMA_EMBEDDING_MODEL_NAME) {
      if (!process.env.OLLAMA_EMBEDDING_MODEL_NAME) {
        throw new Error(
          'The OLLAMA_EMBEDDING_MODEL_NAME environment variable is not set. Please set it using an .env file or via MCP environment settings for your client.',
        );
      }
      const vectors = await ollama.embed({
        model: process.env.OLLAMA_EMBEDDING_MODEL_NAME,
        input: text,
      });
      return vectors.embeddings[0];
    } else if (this.mode === 'openai' || process.env.OPENAI_API_KEY) {
      if (!this.openai) {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
      }
      const vectors = await this.openai.embeddings.create({
        input: text,
        model:
          process.env.OPENAI_EMBEDDING_MODEL_NAME ?? 'text-embedding-3-small',
      });
      return vectors.data[0].embedding;
    }
    throw new Error(
      'No embedding model specified. Please set either the OLLAMA_EMBEDDING_MODEL_NAME or OPENAI_API_KEY environment variable using an .env file or via MCP environment settings for your client.',
    );
  }

  async create(text: string, metadata: { name: string; description: string }) {
    await this.ensureIndex();
    await this.index.insertItem({
      vector:
        process.env.NODE_ENV === 'test'
          ? testVectors
          : await this.generateVectors(
              `${metadata.name} ${metadata.description} ${text}`,
            ),
      metadata,
    });
  }

  async query(text: string) {
    await this.ensureIndex();
    const queryVectors =
      process.env.NODE_ENV === 'test'
        ? testVectors
        : await this.generateVectors(text);
    return await this.index.queryItems(queryVectors, text, 3);
  }
}

const PromptIndex = new Prompts();
export default PromptIndex;
