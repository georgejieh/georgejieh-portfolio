import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://georgejieh.dev',
  base: '/',
  integrations: [tailwind(), mdx()],
  outDir: './dist',
  build: {
    assets: '_assets'
  }
});