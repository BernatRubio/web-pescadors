import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'placeholder',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Hosted at https://<studioHost>.sanity.studio once the club's Sanity project exists.
  studioHost: 'rem-pescadors',
  typegen: {
    path: '../web/src/**/*.{ts,tsx,astro}',
    schema: '../../packages/shared/sanity/schema.json',
    generates: '../../packages/shared/sanity/types.ts',
  },
});
