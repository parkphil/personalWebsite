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
      for (const fileName of ['hero_light.jpg', 'reel_framed.mp4']) {
        this.emitFile({ type: 'asset', fileName: `media/forma/${fileName}`, source: readFileSync(resolve(root, 'media/forma', fileName)) });
      }
    }
  }],
  build: {
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        craft: resolve(root, 'craft.html'),
        ocmaForma: resolve(root, 'ocma-forma.html')
      }
    }
  }
});
