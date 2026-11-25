/**
 * Page metadata (title, description, share image, structured data) for every route.
 * `[...path].astro` calls `pageMeta()` once; `Base.astro` renders the result.
 */
import {
  LOCALE_TAGS,
  LOCALES,
  type Locale,
  type LocalizedValue,
  localizedPath,
  pickLocaleWithLang,
  type RouteKey,
} from '@pescadors/shared';
import { pageDescriptions, pageTitles, t } from '../i18n/ui';
import {
  type Album,
  type ClubEvent,
  getHome,
  getSettings,
  type Post,
  type Result,
} from './content';
import { localizer } from './i18n';
import { imageUrl } from './sanity/image';

export type Detail =
  | { kind: 'post'; post: Post }
  | { kind: 'event'; event: ClubEvent }
  | { kind: 'result'; result: Result }
  | { kind: 'album'; album: Album };

export interface PageMeta {
  title: string;
  description?: string;
  ogImage?: string | null;
  ogType: 'website' | 'article';
  /** Languages the page's own content is written in. Others are Catalan fallbacks. */
  translatedIn: Locale[];
  jsonLd?: Record<string, unknown>;
}

/** Locales where an editor actually wrote the value (not a Catalan fallback). */
const writtenIn = (value: LocalizedValue<unknown> | null | undefined): Locale[] =>
  LOCALES.filter((locale) => pickLocaleWithLang(value, locale)?.lang === locale);

export async function pageMeta(
  locale: Locale,
  route: RouteKey,
  detail: Detail | undefined,
  site: URL | undefined,
): Promise<PageMeta> {
  const l = localizer(locale);
  const abs = (path: string) => (site ? new URL(path, site).href : path);
  const base = {
    title: route === 'home' ? t(locale, 'site.name') : pageTitles[route][locale],
    description: pageDescriptions[route]?.[locale],
    ogType: 'website' as const,
    translatedIn: [...LOCALES],
  };

  switch (detail?.kind) {
    case 'post': {
      const { post } = detail;
      const image = imageUrl(post.cover, 1200);
      return {
        ...base,
        title: l(post.title) ?? base.title,
        description: l(post.excerpt),
        ogImage: image,
        ogType: 'article',
        translatedIn: writtenIn(post.title),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: l(post.title),
          datePublished: post.publishedAt,
          image: image ? [image] : undefined,
          description: l(post.excerpt),
          inLanguage: LOCALE_TAGS[locale],
        },
      };
    }
    case 'event': {
      const { event } = detail;
      const image = imageUrl(event.poster, 1200);
      const place = event.location;
      return {
        ...base,
        title: l(event.title) ?? base.title,
        description: l(event.summary),
        ogImage: image,
        translatedIn: writtenIn(event.title),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': event.kind === 'regata' ? 'SportsEvent' : 'Event',
          name: l(event.title),
          startDate: event.start,
          endDate: event.end ?? undefined,
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: place?.name
            ? { '@type': 'Place', name: place.name, address: place.address ?? place.name }
            : undefined,
          image: image ? [image] : undefined,
          description: l(event.summary),
          url: abs(localizedPath('calendar', locale, event.slug)),
        },
      };
    }
    case 'result':
      return {
        ...base,
        title: `${pageTitles.results[locale]}: ${l(detail.result.event?.title) ?? ''}`,
      };
    case 'album':
      return {
        ...base,
        title: l(detail.album.title) ?? base.title,
        ogImage: imageUrl(detail.album.images?.[0], 1200),
      };
  }

  if (route !== 'home') return base;

  const [home, settings] = await Promise.all([getHome(), getSettings()]);
  const social = Object.values(settings?.social ?? {}).filter(
    (url): url is string => typeof url === 'string' && url.length > 0,
  );
  return {
    ...base,
    title: settings?.clubName ?? base.title,
    description: l(home?.intro) ?? base.description,
    ogImage: imageUrl(home?.heroImage, 1200),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SportsOrganization',
      name: settings?.clubName ?? t(locale, 'site.name'),
      sport: 'Rowing',
      url: abs(localizedPath('home', locale)),
      logo: imageUrl(settings?.logo, 512) ?? undefined,
      email: settings?.email ?? undefined,
      telephone: settings?.phone ?? undefined,
      address: settings?.address ?? undefined,
      sameAs: social.length > 0 ? social : undefined,
    },
  };
}
