import { describe, expect, it } from 'vitest';
import { isPastEvent } from './dates';
import { pickLocale, pickLocaleWithLang } from './locales';
import { youtubeId } from './media';
import { alternatePaths, localizedPath } from './routes';

describe('localizedPath', () => {
  it('keeps Catalan at the root', () => {
    expect(localizedPath('home', 'ca')).toBe('/');
    expect(localizedPath('news', 'ca', 'regata-de-blanes')).toBe('/noticies/regata-de-blanes/');
  });

  it('prefixes Spanish and English with translated segments', () => {
    expect(localizedPath('home', 'es')).toBe('/es/');
    expect(localizedPath('school', 'es')).toBe('/es/escuela-de-remo/');
    expect(localizedPath('news', 'en', 'regata-de-blanes')).toBe('/en/news/regata-de-blanes/');
  });

  it('lists the same page in every language', () => {
    expect(alternatePaths('join')).toEqual({
      ca: '/fes-te-soci/',
      es: '/es/hazte-socio/',
      en: '/en/join/',
    });
  });
});

describe('pickLocale', () => {
  const title = [
    { language: 'ca', value: 'Regata de Blanes' },
    { language: 'es', value: 'Regata de Blanes (es)' },
  ];

  it('returns the requested language', () => {
    expect(pickLocale(title, 'es')).toBe('Regata de Blanes (es)');
  });

  it('falls back to Catalan when a translation is missing', () => {
    expect(pickLocale(title, 'en')).toBe('Regata de Blanes');
  });

  it('handles empty fields', () => {
    expect(pickLocale(undefined, 'ca')).toBeUndefined();
    expect(pickLocale([], 'ca')).toBeUndefined();
  });
});

describe('pickLocaleWithLang', () => {
  const title = [{ language: 'ca', value: 'Regata de Blanes' }];

  it('says when the value is a Catalan fallback', () => {
    expect(pickLocaleWithLang(title, 'en')).toEqual({ value: 'Regata de Blanes', lang: 'ca' });
  });

  it('returns the requested language when it exists', () => {
    expect(pickLocaleWithLang([...title, { language: 'en', value: 'Blanes' }], 'en')).toEqual({
      value: 'Blanes',
      lang: 'en',
    });
  });
});

describe('youtubeId', () => {
  it('reads every common URL shape', () => {
    for (const url of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://youtube.com/shorts/dQw4w9WgXcQ',
      'https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ',
    ]) {
      expect(youtubeId(url)).toBe('dQw4w9WgXcQ');
    }
  });

  it('rejects other links', () => {
    expect(youtubeId('https://vimeo.com/123456')).toBeNull();
    expect(youtubeId(undefined)).toBeNull();
  });
});

describe('isPastEvent', () => {
  // 2026-06-13 10:00 in Lloret (UTC+2 in summer).
  const raceDay = new Date('2026-06-13T08:00:00Z');

  it('keeps an all-day event upcoming on its own day', () => {
    expect(isPastEvent({ start: '2026-06-12T22:00:00Z' }, raceDay)).toBe(false);
  });

  it('keeps a morning event without an end upcoming until the day is over', () => {
    expect(isPastEvent({ start: '2026-06-13T07:00:00Z' }, raceDay)).toBe(false);
    expect(isPastEvent({ start: '2026-06-12T07:00:00Z' }, raceDay)).toBe(true);
  });

  it('uses the end time when there is one', () => {
    expect(
      isPastEvent({ start: '2026-06-13T06:00:00Z', end: '2026-06-13T07:30:00Z' }, raceDay),
    ).toBe(true);
  });
});
