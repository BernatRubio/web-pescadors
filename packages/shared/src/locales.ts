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
export type LocalizedValue<T> = { _key?: string; language?: string; value?: T }[];

/** Picks the requested language, falling back to Catalan, then to any filled value. */
export function pickLocale<T>(
  values: LocalizedValue<T> | null | undefined,
  locale: Locale,
): T | undefined {
  return pickLocaleWithLang(values, locale)?.value;
}

/**
 * Like `pickLocale`, but also says which language the value is in, so a fallback
 * can be marked up with its own `lang` (WCAG 3.1.2).
 */
export function pickLocaleWithLang<T>(
  values: LocalizedValue<T> | null | undefined,
  locale: Locale,
): { value: T; lang: Locale } | undefined {
  if (!values?.length) return undefined;
  const filled = values.filter(
    (v): v is { language: Locale; value: T } => v.value != null && isLocale(v.language),
  );
  const hit =
    filled.find((v) => v.language === locale) ??
    filled.find((v) => v.language === DEFAULT_LOCALE) ??
    filled[0];
  return hit ? { value: hit.value, lang: hit.language } : undefined;
}
