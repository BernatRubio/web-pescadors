import { caESLocale } from '@sanity/locale-ca-es';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { studioLanguages } from './src/lib/i18n';
import { SINGLETONS, schemaTypes } from './src/schemas';
import { structure } from './src/structure';

const singletons = new Set<string>(SINGLETONS);

export default defineConfig({
  name: 'default',
  title: 'Club Rem Pescadors',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'placeholder',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({ structure }),
    internationalizedArray({
      languages: studioLanguages,
      defaultLanguages: ['ca'],
      fieldTypes: ['string', 'text', 'richText'],
    }),
    caESLocale(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },

  document: {
    actions: (actions, { schemaType }) => {
      if (singletons.has(schemaType)) {
        return actions.filter(
          ({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action),
        );
      }
      if (schemaType === 'submission') {
        // Submissions come only from the website form.
        return actions.filter(({ action }) => action !== 'duplicate');
      }
      return actions;
    },
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== 'submission'),
  },
});
