// @ts-check

import { appendFileSync } from 'node:fs';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Final domain still to be confirmed (plan Q3).
// Astro doesn't load .env into process.env while reading this file, so load it explicitly.
// Real environment variables (CI) take precedence over .env.
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };
const SITE = env.PUBLIC_SITE_URL || 'https://clubrempescadors.cat';
const NOINDEX = env.PUBLIC_NOINDEX === 'true';

/** Adds `X-Robots-Tag: noindex` to every response while the MVP must stay out of search engines. */
/** @type {import('astro').AstroIntegration} */
const noindexHeader = {
  name: 'noindex-header',
  hooks: {
    'astro:build:done': ({ dir }) => {
      if (!NOINDEX) return;
      appendFileSync(new URL('_headers', dir), '\n/*\n  X-Robots-Tag: noindex, nofollow\n');
    },
  },
};

export default defineConfig({
  site: SITE,
  output: 'static',
  vite: { plugins: [tailwindcss()] },
  adapter: cloudflare(),
  i18n: {
    locales: ['ca', 'es', 'en'],
    defaultLocale: 'ca',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    noindexHeader,
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'ca',
        locales: { ca: 'ca-ES', es: 'es-ES', en: 'en' },
      },
    }),
  ],
});
