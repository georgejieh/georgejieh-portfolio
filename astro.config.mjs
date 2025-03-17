import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";
import { defineConfig, squooshImageService } from 'astro/config';

export default defineConfig({
  site: 'https://georgejieh.dev', // Replace with your domain
  base: '/', // This should be '/' for a custom domain
  integrations: [tailwind(), mdx(), icon({
    include: {
      mdi: ["*"]
    }
  })],
  image: {
    service: squooshImageService()
  },
  outDir: './dist', // Where Astro will build to
  build: {
    assets: '_assets'
  }
});