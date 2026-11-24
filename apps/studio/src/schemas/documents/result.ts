import { defineArrayMember, defineField, defineType } from 'sanity';
import { caValue } from '../../lib/i18n';

/** All results of one regatta, entered as a single sheet. */
export const result = defineType({
  name: 'result',
  title: 'Resultats',
  type: 'document',
  icon: () => '🥇',
  fields: [
    defineField({
      name: 'event',
      title: 'Regata',
      type: 'reference',
      to: [{ type: 'event' }],
      options: { filter: 'kind == "regata"' },
      validation: (r) =>
        r.required().custom(async (ref, ctx) => {
          if (!ref?._ref) return true;
          const id = ctx.document?._id.replace(/^drafts\./, '');
          const others = await ctx
            .getClient({ apiVersion: '2026-11-01' })
            .fetch<number>(
              'count(*[_type == "result" && event._ref == $ref && !(_id in [$id, "drafts." + $id])])',
              { ref: ref._ref, id },
            );
          return others === 0 ? true : 'Aquesta regata ja té una fitxa de resultats.';
        }),
    }),
    defineField({
      name: 'rows',
      title: 'Resultats del club',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'resultRow',
          title: 'Resultat',
          type: 'object',
          fields: [
            defineField({
              name: 'category',
              title: 'Categoria',
              type: 'reference',
              to: [{ type: 'category' }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'boatClass',
              title: 'Embarcació',
              type: 'reference',
              to: [{ type: 'boatClass' }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'crew',
              title: 'Tripulació',
              description:
                'Opcional. Per als menors d’edat, escriu només el nom i la inicial del cognom.',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'position',
              title: 'Posició',
              type: 'number',
              validation: (r) => r.required().integer().min(1),
            }),
            defineField({
              name: 'time',
              title: 'Temps',
              description: 'Ex.: 12:34.56',
              type: 'string',
            }),
            defineField({ name: 'notes', title: 'Notes', type: 'internationalizedArrayString' }),
          ],
          preview: {
            select: { position: 'position', category: 'category.name', boat: 'boatClass.name' },
            prepare: ({ position, category, boat }) => ({
              title: `${position ?? '–'}a posició · ${caValue(category) ?? ''}`,
              subtitle: caValue(boat),
            }),
          },
        }),
      ],
    }),
    defineField({ name: 'officialFile', title: 'Resultats oficials (PDF)', type: 'file' }),
    defineField({ name: 'officialUrl', title: 'Resultats oficials (enllaç)', type: 'url' }),
  ],
  preview: {
    select: { title: 'event.title', start: 'event.start', rows: 'rows' },
    prepare: ({ title, start, rows }) => ({
      title: caValue(title) ?? 'Regata sense títol',
      subtitle: [
        start ? new Date(start).toLocaleDateString('ca-ES') : null,
        `${rows?.length ?? 0} resultats`,
      ]
        .filter(Boolean)
        .join(' – '),
    }),
  },
});
