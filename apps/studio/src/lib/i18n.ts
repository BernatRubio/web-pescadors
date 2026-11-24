import { DEFAULT_LOCALE, LOCALE_LABELS, LOCALES } from '@pescadors/shared';
import type { Rule, SlugSourceFn } from 'sanity';

export const studioLanguages = LOCALES.map((id) => ({ id, title: LOCALE_LABELS[id] }));

type LocalizedItem = { _key: string; language?: string; value?: unknown };

function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Validation for internationalized fields: Catalan is required, es/en are optional. */
export const requireCatalan =
  (label = 'Aquest camp') =>
  (rule: Rule) =>
    rule.custom((items) => {
      const ca = (items as LocalizedItem[] | undefined)?.find((i) => i.language === DEFAULT_LOCALE);
      return ca && !isEmpty(ca.value) ? true : `${label} és obligatori en català.`;
    });

/** Catalan value of an internationalized field (used for previews and slugs). */
export function caValue(field: unknown): string | undefined {
  const items = field as LocalizedItem[] | undefined;
  const value = items?.find((i) => i.language === DEFAULT_LOCALE)?.value;
  return typeof value === 'string' ? value : undefined;
}

/** Slug generated from the Catalan title. */
export const slugFromCatalanTitle: SlugSourceFn = (doc) => caValue(doc.title) ?? '';
