import { defineArrayMember, defineField, defineType } from 'sanity';
import { requireCatalan } from '../../lib/i18n';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Dades del club',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'clubName',
      title: 'Nom del club',
      type: 'string',
      initialValue: 'Club Rem Pescadors',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'tagline', title: 'Lema', type: 'internationalizedArrayString' }),
    defineField({ name: 'logo', title: 'Escut', type: 'image' }),
    defineField({ name: 'email', title: 'Correu de contacte', type: 'email' }),
    defineField({
      name: 'notificationEmail',
      title: 'Correu on arriben les sol·licituds',
      description: 'No es mostra al web.',
      type: 'email',
    }),
    defineField({ name: 'phone', title: 'Telèfon', type: 'string' }),
    defineField({ name: 'address', title: 'Adreça', type: 'text', rows: 2 }),
    defineField({ name: 'mapUrl', title: 'Enllaç al mapa', type: 'url' }),
    defineField({
      name: 'social',
      title: 'Xarxes socials',
      type: 'object',
      fields: ['instagram', 'facebook', 'youtube', 'tiktok', 'x'].map((name) =>
        defineField({ name, title: name.charAt(0).toUpperCase() + name.slice(1), type: 'url' }),
      ),
    }),
    defineField({
      name: 'seoImage',
      title: 'Imatge per compartir',
      description: 'Es mostra quan algú comparteix el web.',
      type: 'image',
    }),
  ],
  preview: { prepare: () => ({ title: 'Dades del club' }) },
});

export const homePage = defineType({
  name: 'homePage',
  title: "Pàgina d'inici",
  type: 'document',
  icon: () => '🏠',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Foto principal',
      type: 'figure',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroBand',
      title: 'Text de la franja vermella',
      description:
        'Les lletres grans sobre la foto principal. Curt i en majúscules automàticament (ex.: "Pescadors Lloret"). Si es deixa buit, es mostra "Pescadors Lloret".',
      type: 'internationalizedArrayString',
      validation: (rule) =>
        rule.custom<{ value?: string }[]>((items) => {
          const tooLong = items?.some((i) => (i.value?.length ?? 0) > 24);
          return tooLong ? 'Màxim 24 caràcters: és un text molt gran.' : true;
        }),
    }),
    defineField({
      name: 'heroVideo',
      title: 'Vídeo principal (opcional)',
      description:
        'Vídeo curt sense so (MP4, màxim 10 MB). Substitueix la foto quan es pot reproduir.',
      type: 'file',
      options: { accept: 'video/mp4' },
    }),
    defineField({
      name: 'heroTitle',
      title: 'Títol',
      type: 'internationalizedArrayString',
      validation: requireCatalan('El títol'),
    }),
    defineField({ name: 'intro', title: 'Presentació', type: 'internationalizedArrayText' }),
    defineField({
      name: 'featured',
      title: 'Notícies destacades',
      description: 'Opcional. Si està buit, es mostren les últimes.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
      validation: (r) => r.max(3),
    }),
  ],
  preview: { prepare: () => ({ title: "Pàgina d'inici" }) },
});
