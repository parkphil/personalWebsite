import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const root = fileURLToPath(new URL('.', import.meta.url));
const pages = ['index', 'about', 'hero-lab', 'atlas', 'nobel', 'workninja', 'curation', 'forma', 'curation-forma', 'ocma-forma'];

export default defineConfig({
  plugins: [{
    name: 'copy-classic-scripts',
    generateBundle() {
      for (const fileName of ['content.js', 'script.js', 'hero-wave.js', 'hero-lab.js']) {
        this.emitFile({ type: 'asset', fileName, source: readFileSync(resolve(root, fileName)) });
      }
    }
  }],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map(page => [page, resolve(root, `${page}.html`)]))
    }
  }
});
