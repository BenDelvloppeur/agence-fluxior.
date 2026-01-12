// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://agence-fluxior.fr',
  output: 'server', // Mode SSR : nécessaire pour l'admin et les routes dynamiques
  adapter: vercel(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap()
  ],
  image: {
    domains: ["images.unsplash.com"],
  },
});