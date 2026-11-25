import { createClient, type QueryParams } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';

/** True once a Sanity project is configured. Without one, pages render their empty states. */
export const sanityConfigured = Boolean(projectId);

export const sanityClient = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2026-11-01',
      // The site is rebuilt on every publish, so read fresh data rather than the CDN cache.
      useCdn: false,
      perspective: 'published',
    })
  : null;

let warned = false;

/** Runs a GROQ query, or returns `fallback` when no Sanity project is configured. */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  fallback: T,
): Promise<T> {
  if (!sanityClient) {
    if (!warned) {
      console.warn('[sanity] PUBLIC_SANITY_PROJECT_ID is not set: building with empty content.');
      warned = true;
    }
    return fallback;
  }
  return (await sanityClient.fetch<T>(query, params)) ?? fallback;
}

export const sanityProject = { projectId: projectId ?? 'unconfigured', dataset };
