import {
  LOCALE_TAGS,
  type Locale,
  type LocalizedValue,
  pickLocale,
  pickLocaleWithLang,
} from '@pescadors/shared';

type Value<T> = LocalizedValue<T> | null | undefined;

/**
 * Returns a picker bound to one locale: `const l = localizer(locale); l(post.title)`.
 * `l.lang(post.title)` gives the `lang` attribute to set when the value is a Catalan
 * fallback (undefined when it's in the page's own language), so screen readers switch voice.
 */
export function localizer(locale: Locale) {
  const l = <T = string>(value: Value<T>): T | undefined => pickLocale(value, locale);
  l.lang = (value: Value<unknown>): string | undefined => {
    const hit = pickLocaleWithLang(value, locale);
    return hit && hit.lang !== locale ? LOCALE_TAGS[hit.lang] : undefined;
  };
  return l;
}
