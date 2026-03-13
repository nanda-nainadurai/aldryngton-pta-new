// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nanda-nainadurai.github.io',
  base: '/aldryngton-pta-new',
  vite: {
    plugins: [tailwindcss()],
  },
});
