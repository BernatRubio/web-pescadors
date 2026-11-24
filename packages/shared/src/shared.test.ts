import { describe, expect, it } from 'vitest';
import { pickLocale } from './locales';
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
