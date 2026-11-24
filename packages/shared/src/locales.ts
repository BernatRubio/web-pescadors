/** Site languages. Catalan is the default and the fallback for missing translations. */
export const LOCALES = ['ca', 'es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ca';

export const LOCALE_LABELS: Record<Locale, string> = {
  ca: 'Català',
  es: 'Castellano',
  en: 'English',
};

/** BCP 47 tags for <html lang>, hreflang and Intl formatting. */
export const LOCALE_TAGS: Record<Locale, string> = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en',
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Shape stored by sanity-plugin-internationalized-array (v5). */
export type LocalizedValue<T> = { _key?: string; language: string; value?: T }[];

/** Picks the requested language, falling back to Catalan, then to any filled value. */
export function pickLocale<T>(
  values: LocalizedValue<T> | null | undefined,
  locale: Locale,
): T | undefined {
  if (!values?.length) return undefined;
  const find = (lang: string) => values.find((v) => v.language === lang && v.value != null)?.value;
  return find(locale) ?? find(DEFAULT_LOCALE) ?? values.find((v) => v.value != null)?.value;
}
