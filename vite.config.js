import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  assetsInclude: ['**/*.glb'],
  plugins: [{
    name: 'copy-classic-scripts',
    generateBundle() {
      for (const fileName of ['content.js', 'script.js']) {
        this.emitFile({ type: 'asset', fileName, source: readFileSync(resolve(root, fileName)) });
      }
      for (const fileName of ['media/curation/gallery-installation.jpg', 'media/forma/forma-card.mp4', 'media/forma/forma-card-poster.jpg']) {
        this.emitFile({ type: 'asset', fileName, source: readFileSync(resolve(root, fileName)) });
      }
    }
  }],
  build: {
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        craft: resolve(root, 'craft.html'),
        curation: resolve(root, 'curation.html'),
        forma: resolve(root, 'forma.html'),
        curationForma: resolve(root, 'curation-forma.html'),
        oldProjectRoute: resolve(root, 'ocma-forma.html')
      }
    }
  }
});
