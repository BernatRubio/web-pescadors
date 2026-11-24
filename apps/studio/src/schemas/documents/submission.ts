import { defineField, defineType } from 'sanity';

/**
 * Sign-up requests sent from the website form. Created only by the server function;
 * editors can only change the follow-up status and notes.
 * Retention: delete after 24 months (see the privacy policy).
 */
export const submission = defineType({
  name: 'submission',
  title: 'Sol·licitud',
  type: 'document',
  icon: () => '✉️',
  fields: [
    defineField({
      name: 'status',
      title: 'Estat',
      type: 'string',
      options: {
        list: [
          { title: 'Nova', value: 'nova' },
          { title: 'Contactada', value: 'contactada' },
          { title: 'Tancada', value: 'tancada' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'nova',
    }),
    defineField({ name: 'followUp', title: 'Notes de seguiment', type: 'text', rows: 3 }),
    defineField({
      name: 'kind',
      title: 'Tipus',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Fer-se soci', value: 'soci' },
          { title: 'Escola de rem', value: 'escola' },
        ],
      },
    }),
    defineField({ name: 'name', title: 'Nom', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Correu', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Telèfon', type: 'string', readOnly: true }),
    defineField({ name: 'birthYear', title: 'Any de naixement', type: 'number', readOnly: true }),
    defineField({
      name: 'guardianName',
      title: 'Pare, mare o tutor',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'course',
      title: 'Curs',
      type: 'reference',
      to: [{ type: 'course' }],
      readOnly: true,
    }),
    defineField({ name: 'message', title: 'Missatge', type: 'text', readOnly: true }),
    defineField({ name: 'language', title: 'Idioma', type: 'string', readOnly: true }),
    defineField({
      name: 'consent',
      title: 'Accepta la política de privacitat',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({ name: 'submittedAt', title: 'Enviada', type: 'datetime', readOnly: true }),
  ],
  orderings: [
    { title: 'Més recent', name: 'dateDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', kind: 'kind', status: 'status', date: 'submittedAt' },
    prepare: ({ title, kind, status, date }) => ({
      title: `${status === 'nova' ? '🔵 ' : ''}${title ?? 'Sense nom'}`,
      subtitle: [
        kind === 'escola' ? 'Escola' : 'Soci',
        date ? new Date(date).toLocaleDateString('ca-ES') : null,
      ]
        .filter(Boolean)
        .join(' – '),
    }),
  },
});
