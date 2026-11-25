/**
 * Build-time content access. Each query runs once per build and is shared by all pages,
 * so the number of Sanity API requests doesn't grow with the number of pages.
 */

import { isPastEvent } from '@pescadors/shared';
import type {
  AlbumsQueryResult,
  ClubPageQueryResult,
  EventsQueryResult,
  HomeQueryResult,
  PostsQueryResult,
  ResultsQueryResult,
  SettingsQueryResult,
  SponsorsQueryResult,
} from '@pescadors/shared/sanity';
import { todayIso } from './format';
import { sanityFetch } from './sanity/client';
import {
  albumsQuery,
  clubPageQuery,
  eventsQuery,
  homeQuery,
  postsQuery,
  resultsQuery,
  settingsQuery,
  sponsorsQuery,
} from './sanity/queries';

export type Post = PostsQueryResult[number];
export type ClubEvent = EventsQueryResult[number];
export type Result = ResultsQueryResult[number];
export type Album = AlbumsQueryResult[number];
export type Sponsor = SponsorsQueryResult[number];
export type Settings = SettingsQueryResult;

const cache = new Map<string, Promise<unknown>>();

function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, load());
  return cache.get(key) as Promise<T>;
}

export const getSettings = () =>
  once('settings', () => sanityFetch<SettingsQueryResult>(settingsQuery, {}, null));
export const getHome = () => once('home', () => sanityFetch<HomeQueryResult>(homeQuery, {}, null));
export const getPosts = () =>
  once('posts', () => sanityFetch<PostsQueryResult>(postsQuery, {}, []));
export const getEvents = () =>
  once('events', () => sanityFetch<EventsQueryResult>(eventsQuery, {}, []));
export const getResults = () =>
  once('results', () => sanityFetch<ResultsQueryResult>(resultsQuery, {}, []));
export const getAlbums = () =>
  once('albums', () => sanityFetch<AlbumsQueryResult>(albumsQuery, {}, []));
export const getSponsors = () =>
  once('sponsors', () =>
    sanityFetch<SponsorsQueryResult>(sponsorsQuery, { today: todayIso() }, []),
  );
export const getClubPage = () =>
  once('club', () => sanityFetch<ClubPageQueryResult>(clubPageQuery, {}, null));

/** Splits events into upcoming (soonest first) and past (most recent first). */
export function splitEvents(events: ClubEvent[], now = new Date()) {
  const isPast = (e: ClubEvent) => isPastEvent(e, now);
  return {
    upcoming: events.filter((e) => !isPast(e)),
    past: events.filter(isPast).reverse(),
  };
}

/** Result rows sorted the way a race sheet reads: by category, then position. */
export function sortedRows(result: Result) {
  return [...(result.rows ?? [])].sort(
    (a, b) =>
      (a.category?.order ?? 0) - (b.category?.order ?? 0) ||
      (a.position ?? 99) - (b.position ?? 99),
  );
}
