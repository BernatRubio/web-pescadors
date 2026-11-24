import type { Locale, RouteKey } from '@pescadors/shared';

/** Fixed interface text. Content written by editors lives in Sanity, not here. */
export const ui = {
  ca: {
    'site.name': 'Club Rem Pescadors',
    'nav.label': 'Navegació principal',
    'lang.label': 'Idioma',
    'skip.link': 'Ves al contingut',
    pending: 'Aquesta secció és en construcció.',
  },
  es: {
    'site.name': 'Club Rem Pescadors',
    'nav.label': 'Navegación principal',
    'lang.label': 'Idioma',
    'skip.link': 'Ir al contenido',
    pending: 'Esta sección está en construcción.',
  },
  en: {
    'site.name': 'Club Rem Pescadors',
    'nav.label': 'Main navigation',
    'lang.label': 'Language',
    'skip.link': 'Skip to content',
    pending: 'This section is under construction.',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['ca'];

export const pageTitles: Record<RouteKey, Record<Locale, string>> = {
  home: { ca: 'Inici', es: 'Inicio', en: 'Home' },
  news: { ca: 'Notícies', es: 'Noticias', en: 'News' },
  calendar: { ca: 'Calendari', es: 'Calendario', en: 'Calendar' },
  results: { ca: 'Resultats', es: 'Resultados', en: 'Results' },
  gallery: { ca: 'Galeria', es: 'Galería', en: 'Gallery' },
  club: { ca: 'El club', es: 'El club', en: 'The club' },
  teams: { ca: 'Equips', es: 'Equipos', en: 'Teams' },
  fleet: { ca: 'Flota', es: 'Flota', en: 'Fleet' },
  school: { ca: 'Escola de rem', es: 'Escuela de remo', en: 'Rowing school' },
  sponsors: { ca: 'Patrocinadors', es: 'Patrocinadores', en: 'Sponsors' },
  join: { ca: "Fes-te'n soci", es: 'Hazte socio', en: 'Join the club' },
  contact: { ca: 'Contacte', es: 'Contacto', en: 'Contact' },
  legal: { ca: 'Avís legal', es: 'Aviso legal', en: 'Legal notice' },
  privacy: { ca: 'Política de privacitat', es: 'Política de privacidad', en: 'Privacy policy' },
  cookies: { ca: 'Política de cookies', es: 'Política de cookies', en: 'Cookie policy' },
  accessibility: {
    ca: "Declaració d'accessibilitat",
    es: 'Declaración de accesibilidad',
    en: 'Accessibility statement',
  },
};

/** Main menu, in order. */
export const mainNav: RouteKey[] = [
  'club',
  'teams',
  'school',
  'calendar',
  'results',
  'news',
  'gallery',
  'contact',
];

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key];
}
