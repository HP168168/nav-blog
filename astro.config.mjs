import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), keystatic(), tailwind()],
  adapter: node({ mode: 'standalone' }),
  output: 'static',
  vite: {
    optimizeDeps: {
      exclude: ['@keystatic/astro', '@keystatic/core', 'astro:env/server'],
    },
    ssr: {
      external: ['astro:env/server'],
    },
  },
});
