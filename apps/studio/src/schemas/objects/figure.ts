import { defineField, defineType } from 'sanity';
import { requireCatalan } from '../../lib/i18n';

/** Image with accessible alt text and an optional caption, both translatable. */
export const figure = defineType({
  name: 'figure',
  title: 'Imatge',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Descripció de la imatge',
      description:
        'Què es veu a la foto? La fan servir els lectors de pantalla i Google. Ex.: "Tripulació del llagut Sant Pere entrenant al port".',
      type: 'internationalizedArrayString',
      validation: requireCatalan('La descripció'),
    }),
    defineField({
      name: 'caption',
      title: 'Peu de foto',
      type: 'internationalizedArrayString',
    }),
  ],
});
