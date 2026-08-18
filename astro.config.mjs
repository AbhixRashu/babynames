// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://babynames.salarypitcher.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/shortlist'),
      serialize: (item) => {
        if (item.url !== 'https://babynames.salarypitcher.com/') {
          item.url = item.url.replace(/\/$/, '');
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  compressHTML: true,
});
