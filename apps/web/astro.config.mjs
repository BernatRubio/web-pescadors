// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Final domain still to be confirmed (plan Q3).
const SITE = process.env.PUBLIC_SITE_URL ?? 'https://clubrempescadors.cat';

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: cloudflare(),
  i18n: {
    locales: ['ca', 'es', 'en'],
    defaultLocale: 'ca',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'ca',
        locales: { ca: 'ca-ES', es: 'es-ES', en: 'en' },
      },
    }),
  ],
});
