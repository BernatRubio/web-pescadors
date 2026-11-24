import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales';

/**
 * Translated URL segments for every section of the site.
 * Catalan lives at the root; Spanish and English are prefixed (/es, /en).
 */
export const ROUTES = {
  home: { ca: '', es: '', en: '' },
  news: { ca: 'noticies', es: 'noticias', en: 'news' },
  calendar: { ca: 'calendari', es: 'calendario', en: 'calendar' },
  results: { ca: 'resultats', es: 'resultados', en: 'results' },
  gallery: { ca: 'galeria', es: 'galeria', en: 'gallery' },
  club: { ca: 'el-club', es: 'el-club', en: 'the-club' },
  teams: { ca: 'equips', es: 'equipos', en: 'teams' },
  fleet: { ca: 'flota', es: 'flota', en: 'fleet' },
  school: { ca: 'escola-de-rem', es: 'escuela-de-remo', en: 'rowing-school' },
  sponsors: { ca: 'patrocinadors', es: 'patrocinadores', en: 'sponsors' },
  join: { ca: 'fes-te-soci', es: 'hazte-socio', en: 'join' },
  contact: { ca: 'contacte', es: 'contacto', en: 'contact' },
  legal: { ca: 'avis-legal', es: 'aviso-legal', en: 'legal-notice' },
  privacy: { ca: 'privacitat', es: 'privacidad', en: 'privacy' },
  cookies: { ca: 'cookies', es: 'cookies', en: 'cookies' },
  accessibility: { ca: 'accessibilitat', es: 'accesibilidad', en: 'accessibility' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTES;

/** Builds a site path, e.g. localizedPath('news', 'es', 'regata-de-blanes') → /es/noticias/regata-de-blanes/ */
export function localizedPath(route: RouteKey, locale: Locale, slug?: string): string {
  const parts = [locale === DEFAULT_LOCALE ? '' : locale, ROUTES[route][locale], slug ?? ''];
  const path = parts.filter(Boolean).join('/');
  return path ? `/${path}/` : '/';
}

/** Same page in every language, for hreflang links and the language switcher. */
export function alternatePaths(route: RouteKey, slug?: string): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, localizedPath(route, l, slug)])) as Record<
    Locale,
    string
  >;
}
