/** The club's time zone: dates are shown and compared as they are in Lloret de Mar. */
export const CLUB_TIME_ZONE = 'Europe/Madrid';

/** YYYY-MM-DD of an instant in the club's time zone. */
export function clubDay(date: Date | string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: CLUB_TIME_ZONE }).format(new Date(date));
}

/**
 * Whether an event is over. With an end time it ends then; without one it lasts the
 * whole day of its start, so a regatta stays "upcoming" on race day.
 */
export function isPastEvent(
  event: { start?: string | null; end?: string | null },
  now = new Date(),
): boolean {
  if (event.end) return new Date(event.end) < now;
  if (!event.start) return false;
  return clubDay(event.start) < clubDay(now);
}
