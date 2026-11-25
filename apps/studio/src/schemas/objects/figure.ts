import { defineField, defineType, type ValidationContext } from 'sanity';
import { hasCatalan } from '../../lib/i18n';

/**
 * Gallery photos are uploaded dozens at a time, so a missing description there is only a
 * warning (the site falls back to "Foto 3"). Everywhere else it blocks publishing.
 */
const inAlbum = (ctx: ValidationContext) =>
  ctx.document?._type === 'album' && ctx.path?.[0] === 'images';

const MISSING = 'La descripció és obligatòria en català.';

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
      validation: (rule) => [
        rule.custom((items, ctx) => (inAlbum(ctx) || hasCatalan(items) ? true : MISSING)),
        rule
          .custom((items, ctx) =>
            !inAlbum(ctx) || hasCatalan(items)
              ? true
              : 'Recomanat: descriu la foto per a qui no la pot veure.',
          )
          .warning(),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Peu de foto',
      type: 'internationalizedArrayString',
    }),
  ],
});
