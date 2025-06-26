#!/usr/bin/env node

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, '..', 'dist', 'src', 'index.js');

// Run the compiled JavaScript file with Node
const child = spawn(process.execPath, [indexPath], {
  stdio: 'inherit',
  cwd: dirname(__dirname)
});

child.on('exit', (code) => {
  process.exit(code || 0);
}); 