import { defineField, defineType } from 'sanity';
import { caValue, requireCatalan } from '../../lib/i18n';

export const season = defineType({
  name: 'season',
  title: 'Temporada',
  type: 'document',
  icon: () => '🗓️',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom',
      description: 'Ex.: 2026/27',
      type: 'string',
      validation: (rule) => rule.required().regex(/^\d{4}\/\d{2}$/, { name: 'AAAA/AA' }),
    }),
    defineField({
      name: 'startDate',
      title: 'Inici',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'endDate', title: 'Final', type: 'date', validation: (r) => r.required() }),
  ],
  orderings: [
    { title: 'Més recent', name: 'startDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
});

export const boatClass = defineType({
  name: 'boatClass',
  title: "Tipus d'embarcació",
  type: 'document',
  icon: () => '🚣',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      description: 'Ex.: Llagut català, Batel, Llagut mediterrani',
      type: 'internationalizedArrayString',
      validation: requireCatalan('El nom'),
    }),
    defineField({ name: 'crewSize', title: 'Remers per tripulació', type: 'number' }),
    defineField({ name: 'description', title: 'Descripció', type: 'internationalizedArrayText' }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { name: 'name' }, prepare: ({ name }) => ({ title: caValue(name) }) },
});

export const category = defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
  icon: () => '🏷️',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      description: 'Ex.: Cadet femení, Veterà mixt',
      type: 'internationalizedArrayString',
      validation: requireCatalan('El nom'),
    }),
    defineField({
      name: 'ageGroup',
      title: "Grup d'edat",
      type: 'string',
      options: {
        list: [
          { title: 'Aleví', value: 'alevi' },
          { title: 'Infantil', value: 'infantil' },
          { title: 'Cadet', value: 'cadet' },
          { title: 'Juvenil', value: 'juvenil' },
          { title: 'Absolut', value: 'absolut' },
          { title: 'Veterà', value: 'vetera' },
          { title: 'Altres', value: 'altres' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'crew',
      title: 'Tripulació',
      type: 'string',
      options: {
        list: [
          { title: 'Masculí', value: 'masculi' },
          { title: 'Femení', value: 'femeni' },
          { title: 'Mixt', value: 'mixt' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { name: 'name' }, prepare: ({ name }) => ({ title: caValue(name) }) },
});
