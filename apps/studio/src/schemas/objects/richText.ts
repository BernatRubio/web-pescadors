import { defineArrayMember, defineType } from 'sanity';

/** Body text. Registered as an alias so it can be translated with internationalizedArrayRichText. */
export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Títol', value: 'h2' },
        { title: 'Subtítol', value: 'h3' },
        { title: 'Cita', value: 'blockquote' },
      ],
      lists: [
        { title: 'Llista', value: 'bullet' },
        { title: 'Llista numerada', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negreta', value: 'strong' },
          { title: 'Cursiva', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Enllaç',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'Adreça',
                type: 'url',
                validation: (rule) => rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'figure' }),
  ],
});
