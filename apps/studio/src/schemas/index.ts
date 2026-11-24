import { competition } from './documents/competition';
import {
  album,
  boat,
  clubDocument,
  course,
  page,
  person,
  post,
  sponsor,
  team,
} from './documents/content';
import { event } from './documents/event';
import { result } from './documents/result';
import { submission } from './documents/submission';
import { boatClass, category, season } from './documents/taxonomies';
import { figure } from './objects/figure';
import { richText } from './objects/richText';
import { homePage, siteSettings } from './singletons';

export const SINGLETONS = ['siteSettings', 'homePage'] as const;

export const schemaTypes = [
  // objects
  figure,
  richText,
  // singletons
  siteSettings,
  homePage,
  // documents
  post,
  event,
  result,
  competition,
  season,
  album,
  team,
  person,
  boat,
  sponsor,
  course,
  clubDocument,
  page,
  boatClass,
  category,
  submission,
];
