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
        const site = 'https://babynames.salarypitcher.com';
        const url = item.url === site ? site : item.url.replace(/\/$/, '');
        item.url = url;
        item.lastmod = '2026-08-18';

        const p = url.replace(site, '');
        let priority = 0.7;
        if (p === '') priority = 1.0;
        else if (p === '/boy-names' || p === '/girl-names' || p === '/unisex-names' || p === '/search') priority = 0.9;
        else if (p.startsWith('/names/') || p === '/trending-baby-names-2026') priority = 0.8;
        else if (p.startsWith('/blog')) priority = 0.6;
        item.priority = priority;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  compressHTML: true,
});
