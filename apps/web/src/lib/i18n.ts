import { type Locale, type LocalizedValue, pickLocale } from '@pescadors/shared';

/** Returns a picker bound to one locale: `const l = localizer(locale); l(post.title)`. */
export function localizer(locale: Locale) {
  return <T = string>(value: LocalizedValue<T> | null | undefined): T | undefined =>
    pickLocale(value, locale);
}
