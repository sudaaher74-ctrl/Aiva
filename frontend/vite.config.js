import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://aivaenterprises.com',
      dynamicRoutes: [
        '/products/aseptic',
        '/products/concentrates',
        '/products/iqf',
        '/products/alphonso-mango-pulp',
        '/products/totapuri-mango-pulp',
        '/products/kesar-mango-pulp',
        '/products/papaya-pulp',
        '/products/pink-white-guava-pulp',
        '/products/banana-pulp',
        '/products/tomato-paste',
        '/products/totapuri-mango-concentrate',
        '/products/white-guava-concentrate',
        '/products/banana-concentrate',
        '/products/totapuri-mango-dices',
        '/products/papaya-dices',
        '/products/banana-slices',
        '/products/guava-dices',
        '/products/strawberry',
        '/products/sweet-corn'
      ],
      exclude: ['/chatbot', '/chatbot/login']
    })
  ],
  build: {
    chunkSizeWarningLimit: 1000
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths, routes) {
      return [
        ...paths,
        '/products/aseptic',
        '/products/concentrates',
        '/products/iqf',
        '/products/alphonso-mango-pulp',
        '/products/totapuri-mango-pulp',
        '/products/kesar-mango-pulp',
        '/products/papaya-pulp',
        '/products/pink-white-guava-pulp',
        '/products/banana-pulp',
        '/products/tomato-paste',
        '/products/totapuri-mango-concentrate',
        '/products/white-guava-concentrate',
        '/products/banana-concentrate',
        '/products/totapuri-mango-dices',
        '/products/papaya-dices',
        '/products/banana-slices',
        '/products/guava-dices',
        '/products/strawberry',
        '/products/sweet-corn'
      ].filter(path => !path.includes('/chatbot'));
    }
  }
});
