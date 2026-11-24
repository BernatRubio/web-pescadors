import { defineArrayMember, defineField, defineType } from 'sanity';
import { caValue, requireCatalan } from '../../lib/i18n';

/** A league or circuit. Regattas (events) point to it. */
export const competition = defineType({
  name: 'competition',
  title: 'Competició',
  type: 'document',
  icon: () => '🏆',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      description: 'Ex.: Lliga Catalana de Llagut Català',
      type: 'internationalizedArrayString',
      validation: requireCatalan('El nom'),
    }),
    defineField({ name: 'organizer', title: 'Organitzador', type: 'string' }),
    defineField({ name: 'website', title: 'Web oficial', type: 'url' }),
    defineField({
      name: 'boatClasses',
      title: "Tipus d'embarcació",
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'boatClass' }] })],
    }),
    defineField({
      name: 'standings',
      title: 'Classificacions generals',
      description:
        "Opcional. Enganxa l'enllaç o el PDF oficial de la federació, o escriu la taula a mà.",
      type: 'array',
      of: [
        defineArrayMember({
          name: 'standing',
          title: 'Classificació',
          type: 'object',
          fields: [
            defineField({
              name: 'season',
              title: 'Temporada',
              type: 'reference',
              to: [{ type: 'season' }],
              validation: (r) => r.required(),
            }),
            defineField({ name: 'url', title: 'Enllaç oficial', type: 'url' }),
            defineField({ name: 'file', title: 'PDF oficial', type: 'file' }),
            defineField({
              name: 'rows',
              title: 'Taula',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'standingRow',
                  type: 'object',
                  fields: [
                    defineField({ name: 'position', title: 'Posició', type: 'number' }),
                    defineField({ name: 'club', title: 'Club', type: 'string' }),
                    defineField({ name: 'points', title: 'Punts', type: 'number' }),
                  ],
                  preview: {
                    select: { position: 'position', club: 'club', points: 'points' },
                    prepare: ({ position, club, points }) => ({
                      title: `${position ?? '–'}. ${club ?? ''}`,
                      subtitle: points != null ? `${points} punts` : undefined,
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'season.title' } },
        }),
      ],
    }),
  ],
  preview: { select: { name: 'name' }, prepare: ({ name }) => ({ title: caValue(name) }) },
});
