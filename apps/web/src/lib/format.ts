import { clubDay, LOCALE_TAGS, type Locale, CLUB_TIME_ZONE as TIME_ZONE } from '@pescadors/shared';

/** "dissabte, 14 de març de 2026" style dates, for prose. */
export function longDate(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

/** "14/03" style dates, for race sheets and compact lists. */
export function shortDate(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    day: '2-digit',
    month: '2-digit',
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

/** "10:30", or an empty string for all-day events stored at midnight. */
export function timeOfDay(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return '';
  const formatted = new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
  return formatted === '00:00' ? '' : formatted;
}

/** Today's date (YYYY-MM-DD) in the club's time zone, for build-time filters. */
export function todayIso(): string {
  return clubDay(new Date());
}

/** Value for a `<time datetime>` attribute: the day for all-day dates, else the instant. */
export function machineDate(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  return iso.length <= 10 ? iso : new Date(iso).toISOString();
}
