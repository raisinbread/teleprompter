#!/usr/bin/env node

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, '..', 'src', 'index.ts');

// Use tsx to run the TypeScript file directly
const child = spawn('npx', ['tsx', indexPath], {
  stdio: 'inherit',
  cwd: dirname(__dirname)
});

child.on('exit', (code) => {
  process.exit(code || 0);
}); 