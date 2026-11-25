/**
 * Seeds the dataset with the sports configuration and clearly-marked sample content.
 *   pnpm --filter @pescadors/studio seed
 * Safe to run again: every document has a fixed _id and is replaced, not duplicated.
 * Sample photos and sponsor logos are generated placeholders (no people, no real brands).
 * The crest is uploaded from docs/brand/logo.png if it exists (that folder is never committed).
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2026-11-01' });

type Lang = 'ca' | 'es' | 'en';
type Tr = Partial<Record<Lang, string>> & { ca: string };

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;

/** internationalizedArrayString/Text value. */
const i18n = (tr: Tr, type: 'String' | 'Text' = 'String') =>
  (Object.entries(tr) as [Lang, string][]).map(([language, value]) => ({
    _key: key(),
    _type: `internationalizedArray${type}Value`,
    language,
    value,
  }));

/** internationalizedArrayRichText value from plain paragraphs. */
const richText = (tr: Partial<Record<Lang, string[]>> & { ca: string[] }) =>
  (Object.entries(tr) as [Lang, string[]][]).map(([language, paragraphs]) => ({
    _key: key(),
    _type: 'internationalizedArrayRichTextValue',
    language,
    value: paragraphs.map((text) => ({
      _key: key(),
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _key: key(), _type: 'span', marks: [], text }],
    })),
  }));

const ref = (id: string) => ({ _type: 'reference', _ref: id });
const refItem = (id: string) => ({ _key: key(), ...ref(id) });

// ---------------------------------------------------------------- placeholder images

const placeholderPhoto = (
  n: number,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067" viewBox="0 0 1600 1067">
  <rect width="1600" height="1067" fill="${n % 2 ? '#545454' : '#333333'}"/>
  <rect y="${520 + (n % 3) * 60}" width="1600" height="6" fill="#EDEDED" opacity=".5"/>
  <path d="M${260 + n * 40} 640 h${900 - n * 30} l-80 90 h-${740 - n * 30} z" fill="#E93939"/>
  <text x="80" y="160" font-family="sans-serif" font-size="64" font-weight="700" fill="#FFFFFF">Foto d'exemple ${n}</text>
</svg>`;

const placeholderLogo = (
  name: string,
  color: string,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160" viewBox="0 0 480 160">
  <rect width="480" height="160" fill="#FFFFFF"/>
  <circle cx="80" cy="80" r="44" fill="${color}"/>
  <text x="150" y="98" font-family="sans-serif" font-size="44" font-weight="700" fill="#000000">${name}</text>
</svg>`;

async function uploadImage(content: string | Buffer, filename: string, alt: Tr) {
  const asset = await client.assets.upload('image', Buffer.from(content), { filename });
  return { _type: 'figure', asset: ref(asset._id), alt: i18n(alt) };
}

// ---------------------------------------------------------------- data

async function seed() {
  const tx = client.transaction();
  const put = (doc: { _id: string; _type: string; [k: string]: unknown }) =>
    tx.createOrReplace(doc);

  // Sports configuration (real, not samples).
  put({
    _id: 'season-2026-27',
    _type: 'season',
    title: '2026/27',
    startDate: '2026-09-01',
    endDate: '2027-08-31',
  });

  const boats = [
    {
      id: 'boat-llagut-catala',
      name: { ca: 'Llagut català', es: 'Llagut catalán', en: 'Llagut català' },
      crew: 8,
    },
    { id: 'boat-batel', name: { ca: 'Batel', es: 'Batel', en: 'Batel' }, crew: 4 },
    {
      id: 'boat-llagut-mediterrani',
      name: { ca: 'Llagut mediterrani', es: 'Llagut mediterráneo', en: 'Llagut mediterrani' },
      crew: 8,
    },
  ];
  for (const [order, b] of boats.entries()) {
    put({ _id: b.id, _type: 'boatClass', name: i18n(b.name), crewSize: b.crew, order });
  }

  const ages = [
    { id: 'infantil', ca: 'Infantil', es: 'Infantil', en: 'Under-14' },
    { id: 'cadet', ca: 'Cadet', es: 'Cadete', en: 'Under-16' },
    { id: 'juvenil', ca: 'Juvenil', es: 'Juvenil', en: 'Under-18' },
    { id: 'absolut', ca: 'Absolut', es: 'Absoluto', en: 'Senior' },
    { id: 'vetera', ca: 'Veterà', es: 'Veterano', en: 'Masters' },
  ];
  const crews = [
    { id: 'masculi', ca: 'masculí', es: 'masculino', en: "men's" },
    { id: 'femeni', ca: 'femení', es: 'femenino', en: "women's" },
    { id: 'mixt', ca: 'mixt', es: 'mixto', en: 'mixed' },
  ];
  let order = 0;
  for (const age of ages) {
    for (const crew of crews) {
      put({
        _id: `cat-${age.id}-${crew.id}`,
        _type: 'category',
        name: i18n({
          ca: `${age.ca} ${crew.ca}`,
          es: `${age.es} ${crew.es}`,
          en: crew.id === 'mixt' ? `${age.en} mixed` : `${age.en} ${crew.en}`,
        }),
        ageGroup: age.id === 'vetera' ? 'vetera' : age.id,
        crew: crew.id,
        order: order++,
      });
    }
  }

  put({
    _id: 'competition-lliga-sample',
    _type: 'competition',
    name: i18n({
      ca: 'Lliga de llagut català (exemple)',
      es: 'Liga de llagut catalán (ejemplo)',
      en: 'Llagut català league (sample)',
    }),
    boatClasses: [refItem('boat-llagut-catala')],
  });

  // Images.
  const photos = await Promise.all(
    [1, 2, 3, 4, 5, 6].map((n) =>
      uploadImage(placeholderPhoto(n), `exemple-${n}.svg`, {
        ca: `Foto d'exemple ${n}: un llagut vermell sobre el mar`,
        es: `Foto de ejemplo ${n}: un llagut rojo sobre el mar`,
        en: `Sample photo ${n}: a red llagut on the sea`,
      }),
    ),
  );
  const albumImages = photos.map((p) => ({ _key: key(), ...p }));

  // Events (samples).
  const events = [
    {
      id: 'event-blanes',
      title: 'Regata de Blanes',
      start: '2026-10-18T10:00:00+02:00',
      place: 'Port de Blanes',
      organised: false,
    },
    {
      id: 'event-lloret',
      title: 'Regata de Lloret de Mar',
      start: '2026-11-15T10:00:00+01:00',
      place: 'Platja de Lloret',
      organised: true,
    },
    {
      id: 'event-palamos',
      title: 'Regata de Palamós',
      start: '2027-03-14T10:00:00+01:00',
      place: 'Port de Palamós',
      organised: false,
    },
    {
      id: 'event-portes-obertes',
      title: 'Jornada de portes obertes',
      start: '2027-04-18T10:00:00+02:00',
      place: 'Club Rem Pescadors',
      organised: false,
      kind: 'portes-obertes',
    },
  ];
  for (const e of events) {
    const slug = e.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-');
    put({
      _id: e.id,
      _type: 'event',
      title: i18n({
        ca: `${e.title} (exemple)`,
        es: `${e.title} (ejemplo)`,
        en: `${e.title} (sample)`,
      }),
      slug: { _type: 'slug', current: `${slug}-exemple` },
      kind: e.kind ?? 'regata',
      competition: e.kind ? undefined : ref('competition-lliga-sample'),
      season: ref('season-2026-27'),
      start: e.start,
      location: { name: e.place },
      summary: i18n(
        {
          ca: 'Esdeveniment d’exemple per provar el web. Substitueix-lo per un de real.',
          es: 'Evento de ejemplo para probar la web. Sustitúyelo por uno real.',
          en: 'Sample event to try out the website. Replace it with a real one.',
        },
        'Text',
      ),
      organisedByClub: e.organised,
      participatingClubs: e.organised
        ? ['Club Rem Pescadors', 'Club d’exemple A', 'Club d’exemple B']
        : undefined,
    });
  }

  // Results for the past regattas (samples).
  const resultRows = (rows: [string, string, number, string][]) =>
    rows.map(([cat, boat, position, time]) => ({
      _key: key(),
      _type: 'resultRow',
      category: ref(cat),
      boatClass: ref(boat),
      position,
      time,
    }));
  put({
    _id: 'result-blanes',
    _type: 'result',
    event: ref('event-blanes'),
    rows: resultRows([
      ['cat-absolut-masculi', 'boat-llagut-catala', 1, '14:02.31'],
      ['cat-absolut-femeni', 'boat-llagut-catala', 2, '15:40.12'],
      ['cat-cadet-mixt', 'boat-batel', 3, '08:11.70'],
      ['cat-vetera-mixt', 'boat-llagut-catala', 5, '16:21.05'],
    ]),
  });
  put({
    _id: 'result-lloret',
    _type: 'result',
    event: ref('event-lloret'),
    rows: resultRows([
      ['cat-juvenil-femeni', 'boat-llagut-catala', 1, '13:58.44'],
      ['cat-absolut-mixt', 'boat-llagut-mediterrani', 2, '12:47.90'],
      ['cat-infantil-mixt', 'boat-batel', 4, '07:59.02'],
    ]),
  });

  // Album and news (samples).
  put({
    _id: 'album-lloret',
    _type: 'album',
    title: i18n({
      ca: 'Regata de Lloret (exemple)',
      es: 'Regata de Lloret (ejemplo)',
      en: 'Lloret regatta (sample)',
    }),
    slug: { _type: 'slug', current: 'regata-de-lloret-exemple' },
    date: '2026-11-15',
    event: ref('event-lloret'),
    images: albumImages,
  });

  const posts = [
    {
      id: 'post-lloret',
      ca: 'Bona jornada a la regata de Lloret',
      date: '2026-11-16T09:00:00+01:00',
      event: 'event-lloret',
      album: 'album-lloret',
      cover: 0,
    },
    {
      id: 'post-blanes',
      ca: 'Tres podis a Blanes',
      date: '2026-10-19T09:00:00+02:00',
      event: 'event-blanes',
      cover: 1,
    },
    {
      id: 'post-temporada',
      ca: 'Comença la temporada 2026/27',
      date: '2026-09-05T09:00:00+02:00',
      cover: 2,
    },
  ];
  for (const p of posts) {
    put({
      _id: p.id,
      _type: 'post',
      title: i18n({ ca: `${p.ca} (exemple)` }),
      slug: { _type: 'slug', current: `${p.id.replace('post-', '')}-exemple` },
      publishedAt: p.date,
      cover: photos[p.cover],
      excerpt: i18n(
        {
          ca: 'Notícia d’exemple per provar el web. Les traduccions es mostren en català fins que algú les escrigui.',
        },
        'Text',
      ),
      body: richText({
        ca: [
          'Aquest és un text d’exemple. Quan el club publiqui notícies reals, apareixeran aquí.',
          'Fixa’t que, en castellà i en anglès, aquesta notícia es mostra en català perquè encara no s’ha traduït.',
        ],
      }),
      event: p.event ? ref(p.event) : undefined,
      album: p.album ? ref(p.album) : undefined,
    });
  }

  // Sponsors (placeholders, never real brands without permission).
  const sponsors = [
    { id: 'sponsor-a', name: 'Patrocinador A', tier: 'principal', color: '#E93939' },
    { id: 'sponsor-b', name: 'Col·laborador B', tier: 'collaborador', color: '#545454' },
    { id: 'sponsor-c', name: 'Institució C', tier: 'institucional', color: '#231F20' },
  ];
  for (const [i, s] of sponsors.entries()) {
    const asset = await client.assets.upload(
      'image',
      Buffer.from(placeholderLogo(s.name, s.color)),
      {
        filename: `${s.id}.svg`,
      },
    );
    put({
      _id: s.id,
      _type: 'sponsor',
      name: s.name,
      tier: s.tier,
      logo: { _type: 'image', asset: ref(asset._id) },
      order: i,
    });
  }

  // Club page, home page and settings.
  put({
    _id: 'page-el-club',
    _type: 'page',
    title: i18n({ ca: 'El club', es: 'El club', en: 'The club' }),
    slug: { _type: 'slug', current: 'el-club' },
    body: richText({
      ca: ['Text d’exemple sobre la història del club. El club l’ha de substituir pel text real.'],
      es: ['Texto de ejemplo sobre la historia del club.'],
      en: ['Sample text about the club’s history.'],
    }),
  });

  const crestPath = resolve(process.cwd(), '../../docs/brand/logo.png');
  let logo: { _type: 'image'; asset: ReturnType<typeof ref> } | undefined;
  if (existsSync(crestPath)) {
    const asset = await client.assets.upload('image', readFileSync(crestPath), {
      filename: 'escut.png',
    });
    logo = { _type: 'image', asset: ref(asset._id) };
  } else {
    console.warn('docs/brand/logo.png not found: skipping the crest.');
  }

  put({
    _id: 'siteSettings',
    _type: 'siteSettings',
    clubName: 'Club Rem Pescadors',
    logo,
    address: 'Lloret de Mar',
  });
  put({
    _id: 'homePage',
    _type: 'homePage',
    heroImage: photos[3],
    heroBand: i18n({ ca: 'Pescadors Lloret' }),
    heroTitle: i18n({
      ca: 'Rem de banc fix a Lloret de Mar',
      es: 'Remo de banco fijo en Lloret de Mar',
      en: 'Fixed-seat rowing in Lloret de Mar',
    }),
  });

  await tx.commit();
  console.log('Seed complete.');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
