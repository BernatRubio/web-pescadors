import {
  type ConditionalPropertyCallbackContext,
  defineArrayMember,
  defineField,
  defineType,
} from 'sanity';
import { caValue, requireCatalan, slugFromCatalanTitle } from '../../lib/i18n';

const organisedOnly = ({ document }: ConditionalPropertyCallbackContext) =>
  !(document as { organisedByClub?: boolean } | undefined)?.organisedByClub;

export const event = defineType({
  name: 'event',
  title: 'Esdeveniment',
  type: 'document',
  icon: () => '📅',
  groups: [
    { name: 'main', title: 'Principal', default: true },
    { name: 'organised', title: 'Regata organitzada pel club' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Títol',
      type: 'internationalizedArrayString',
      group: 'main',
      validation: requireCatalan('El títol'),
    }),
    defineField({
      name: 'slug',
      title: 'Adreça web',
      description: 'Es genera a partir del títol en català.',
      type: 'slug',
      group: 'main',
      options: { source: slugFromCatalanTitle },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Tipus',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: 'Regata', value: 'regata' },
          { title: 'Jornada de portes obertes', value: 'portes-obertes' },
          { title: 'Activitat social', value: 'social' },
          { title: 'Altres', value: 'altres' },
        ],
      },
      initialValue: 'regata',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'competition',
      title: 'Competició',
      description: 'Deixa-ho buit si és una regata independent.',
      type: 'reference',
      to: [{ type: 'competition' }],
      group: 'main',
    }),
    defineField({
      name: 'season',
      title: 'Temporada',
      type: 'reference',
      to: [{ type: 'season' }],
      group: 'main',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'start',
      title: 'Inici',
      type: 'datetime',
      group: 'main',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'end',
      title: 'Final',
      type: 'datetime',
      group: 'main',
      validation: (r) =>
        r.custom((end, ctx) => {
          const start = (ctx.document as { start?: string } | undefined)?.start;
          return !end || !start || end >= start ? true : 'El final ha de ser després de l’inici.';
        }),
    }),
    defineField({
      name: 'location',
      title: 'Lloc',
      type: 'object',
      group: 'main',
      fields: [
        defineField({
          name: 'name',
          title: 'Nom',
          description: 'Ex.: Port de Blanes',
          type: 'string',
        }),
        defineField({ name: 'address', title: 'Adreça', type: 'string' }),
        defineField({ name: 'mapUrl', title: 'Enllaç al mapa', type: 'url' }),
      ],
    }),
    defineField({ name: 'poster', title: 'Cartell o foto', type: 'figure', group: 'main' }),
    defineField({
      name: 'summary',
      title: 'Resum',
      description: 'Una o dues frases. Es mostra al calendari.',
      type: 'internationalizedArrayText',
      group: 'main',
    }),
    defineField({
      name: 'body',
      title: 'Informació',
      type: 'internationalizedArrayRichText',
      group: 'main',
    }),
    defineField({
      name: 'registrationUrl',
      title: "Enllaç d'inscripció",
      type: 'url',
      group: 'main',
    }),
    defineField({
      name: 'organisedByClub',
      title: 'Organitzada pel club',
      description: 'Activa-ho per mostrar el programa, el recorregut i els clubs participants.',
      type: 'boolean',
      initialValue: false,
      group: 'organised',
    }),
    defineField({
      name: 'programme',
      title: 'Programa',
      type: 'internationalizedArrayRichText',
      group: 'organised',
      hidden: organisedOnly,
    }),
    defineField({
      name: 'courseMap',
      title: 'Mapa del recorregut',
      type: 'figure',
      group: 'organised',
      hidden: organisedOnly,
    }),
    defineField({
      name: 'participatingClubs',
      title: 'Clubs participants',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      group: 'organised',
      hidden: organisedOnly,
    }),
  ],
  orderings: [
    { title: 'Data (més recent)', name: 'startDesc', by: [{ field: 'start', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', start: 'start', media: 'poster' },
    prepare: ({ title, start, media }) => ({
      title: caValue(title),
      subtitle: start ? new Date(start).toLocaleDateString('ca-ES') : 'Sense data',
      media,
    }),
  },
});
