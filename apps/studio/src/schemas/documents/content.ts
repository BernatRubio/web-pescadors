import { youtubeId } from '@pescadors/shared';
import { defineArrayMember, defineField, defineType, type PreviewValue } from 'sanity';
import { caValue, requireCatalan, slugFromCatalanTitle } from '../../lib/i18n';

const titleField = defineField({
  name: 'title',
  title: 'Títol',
  type: 'internationalizedArrayString',
  validation: requireCatalan('El títol'),
});

const slugField = defineField({
  name: 'slug',
  title: 'Adreça web',
  description: 'Es genera a partir del títol en català.',
  type: 'slug',
  options: { source: slugFromCatalanTitle },
  validation: (r) => r.required(),
});

/** List preview using the Catalan title; `subtitle` is an optional field path. */
const titlePreview = (media: string, subtitle?: string) => ({
  select: { title: 'title', media, ...(subtitle ? { subtitle } : {}) },
  prepare: ({ title, media, subtitle }: Record<string, unknown>): PreviewValue => ({
    title: caValue(title),
    subtitle: subtitle as string | undefined,
    media: media as PreviewValue['media'],
  }),
});

export const post = defineType({
  name: 'post',
  title: 'Notícia',
  type: 'document',
  icon: () => '📰',
  fields: [
    titleField,
    slugField,
    defineField({
      name: 'publishedAt',
      title: 'Data de publicació',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Imatge principal',
      type: 'figure',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Entradeta',
      description:
        'Una o dues frases que resumeixen la notícia. Es mostra a les llistes i a Google.',
      type: 'internationalizedArrayText',
      validation: requireCatalan("L'entradeta"),
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'internationalizedArrayRichText',
      validation: requireCatalan('El text'),
    }),
    defineField({
      name: 'event',
      title: 'Regata relacionada',
      type: 'reference',
      to: [{ type: 'event' }],
    }),
    defineField({
      name: 'team',
      title: 'Equip relacionat',
      type: 'reference',
      to: [{ type: 'team' }],
    }),
    defineField({
      name: 'album',
      title: 'Galeria relacionada',
      type: 'reference',
      to: [{ type: 'album' }],
    }),
  ],
  orderings: [
    { title: 'Més recent', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: titlePreview('cover', 'publishedAt'),
});

export const album = defineType({
  name: 'album',
  title: 'Galeria',
  type: 'document',
  icon: () => '📷',
  fields: [
    titleField,
    slugField,
    defineField({ name: 'date', title: 'Data', type: 'date', validation: (r) => r.required() }),
    defineField({
      name: 'event',
      title: 'Regata relacionada',
      type: 'reference',
      to: [{ type: 'event' }],
    }),
    defineField({
      name: 'images',
      title: 'Fotos',
      description: 'Pots arrossegar moltes fotos alhora. La primera serà la portada.',
      type: 'array',
      of: [defineArrayMember({ type: 'figure' })],
      options: { layout: 'grid' },
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'videos',
      title: 'Vídeos',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'video',
          type: 'object',
          fields: [
            defineField({
              name: 'url',
              title: 'Enllaç de YouTube',
              description: 'Ex.: https://www.youtube.com/watch?v=… o https://youtu.be/…',
              type: 'url',
              validation: (r) =>
                r
                  .required()
                  .custom((url) =>
                    !url || youtubeId(url) ? true : 'Ha de ser un enllaç a un vídeo de YouTube.',
                  ),
            }),
            defineField({ name: 'title', title: 'Títol', type: 'internationalizedArrayString' }),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    { title: 'Més recent', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: titlePreview('images.0', 'date'),
});

export const team = defineType({
  name: 'team',
  title: 'Equip',
  type: 'document',
  icon: () => '👥',
  fields: [
    titleField,
    slugField,
    defineField({ name: 'photo', title: 'Foto', type: 'figure' }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
    }),
    defineField({
      name: 'description',
      title: 'Descripció',
      type: 'internationalizedArrayRichText',
    }),
    defineField({
      name: 'schedule',
      title: "Horari d'entrenament",
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'coaches',
      title: 'Entrenadors',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'person' }] })],
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 0 }),
  ],
  preview: titlePreview('photo'),
});

export const person = defineType({
  name: 'person',
  title: 'Persona',
  type: 'document',
  icon: () => '🧑',
  description: 'Només adults: entrenadors, junta, personal i esportistes majors d’edat.',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom i cognoms',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      type: 'string',
      options: {
        list: [
          { title: 'Junta directiva', value: 'junta' },
          { title: 'Entrenador/a', value: 'entrenador' },
          { title: 'Personal', value: 'personal' },
          { title: 'Esportista', value: 'esportista' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'position',
      title: 'Càrrec',
      description: 'Ex.: Presidenta, Tresorer',
      type: 'internationalizedArrayString',
    }),
    defineField({ name: 'photo', title: 'Foto', type: 'figure' }),
    defineField({ name: 'bio', title: 'Presentació', type: 'internationalizedArrayText' }),
    defineField({
      name: 'consent',
      title: 'Té consentiment per aparèixer al web',
      description:
        'Confirma que la persona és major d’edat i ha autoritzat publicar el seu nom i foto.',
      type: 'boolean',
      initialValue: false,
      validation: (r) => r.custom((v) => (v === true ? true : 'Cal el consentiment per publicar.')),
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});

export const boat = defineType({
  name: 'boat',
  title: 'Embarcació del club',
  type: 'document',
  icon: () => '⛵',
  fields: [
    defineField({ name: 'name', title: 'Nom', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'boatClass',
      title: 'Tipus',
      type: 'reference',
      to: [{ type: 'boatClass' }],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'photo', title: 'Foto', type: 'figure' }),
    defineField({ name: 'year', title: 'Any de construcció', type: 'number' }),
    defineField({ name: 'builder', title: 'Constructor / drassana', type: 'string' }),
    defineField({ name: 'story', title: 'Història', type: 'internationalizedArrayRichText' }),
  ],
  preview: { select: { title: 'name', subtitle: 'builder', media: 'photo' } },
});

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Patrocinador',
  type: 'document',
  icon: () => '🤝',
  fields: [
    defineField({ name: 'name', title: 'Nom', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'logo',
      title: 'Logotip',
      description: 'Preferiblement SVG o PNG amb fons transparent.',
      type: 'image',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'url', title: 'Web', type: 'url' }),
    defineField({
      name: 'tier',
      title: 'Nivell',
      type: 'string',
      options: {
        list: [
          { title: 'Principal', value: 'principal' },
          { title: 'Col·laborador', value: 'collaborador' },
          { title: 'Institucional', value: 'institucional' },
        ],
        layout: 'radio',
      },
      initialValue: 'collaborador',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'activeFrom', title: 'Actiu des de', type: 'date' }),
    defineField({
      name: 'activeTo',
      title: 'Actiu fins a',
      description: 'Deixa-ho buit si no té final.',
      type: 'date',
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'name', subtitle: 'tier', media: 'logo' } },
});

export const course = defineType({
  name: 'course',
  title: "Curs de l'escola",
  type: 'document',
  icon: () => '🎓',
  fields: [
    titleField,
    slugField,
    defineField({ name: 'image', title: 'Imatge', type: 'figure' }),
    defineField({
      name: 'ages',
      title: 'Edats',
      description: 'Ex.: De 8 a 12 anys',
      type: 'internationalizedArrayString',
    }),
    defineField({ name: 'schedule', title: 'Horari', type: 'internationalizedArrayText' }),
    defineField({
      name: 'price',
      title: 'Preu',
      description: 'Ex.: 120 € per trimestre',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'description',
      title: 'Descripció',
      type: 'internationalizedArrayRichText',
    }),
    defineField({
      name: 'signupOpen',
      title: 'Inscripcions obertes',
      description: 'Si està desactivat, el formulari no mostra aquest curs.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 0 }),
  ],
  preview: titlePreview('image'),
});

export const clubDocument = defineType({
  name: 'clubDocument',
  title: 'Document',
  type: 'document',
  icon: () => '📄',
  fields: [
    titleField,
    defineField({ name: 'file', title: 'Fitxer', type: 'file', validation: (r) => r.required() }),
    defineField({
      name: 'kind',
      title: 'Tipus',
      type: 'string',
      options: {
        list: [
          { title: 'Estatuts', value: 'estatuts' },
          { title: 'Inscripcions', value: 'inscripcions' },
          { title: 'Reglaments', value: 'reglaments' },
          { title: 'Altres', value: 'altres' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'year', title: 'Any', type: 'number' }),
  ],
  preview: titlePreview('file', 'kind'),
});

/** The web reads the club page by this slug (`clubPageQuery`), so it must not change. */
const CLUB_PAGE_SLUG = 'el-club';

export const page = defineType({
  name: 'page',
  title: 'Pàgina',
  type: 'document',
  icon: () => '📃',
  fields: [
    titleField,
    defineField({
      ...slugField,
      description: `Es genera a partir del títol en català. La pàgina del club ha de tenir l’adreça "${CLUB_PAGE_SLUG}" i no es pot canviar.`,
      readOnly: ({ document }) =>
        (document as { slug?: { current?: string } } | undefined)?.slug?.current === CLUB_PAGE_SLUG,
    }),
    defineField({ name: 'image', title: 'Imatge', type: 'figure' }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'internationalizedArrayRichText',
      validation: requireCatalan('El text'),
    }),
  ],
  preview: titlePreview('image'),
});
