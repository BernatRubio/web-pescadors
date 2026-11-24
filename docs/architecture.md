# ADR 001: Architecture

- **Status:** accepted
- **Date:** 2026-11-24

## Context

Club Rem Pescadors needs a website in Catalan, Spanish and English. Non-technical club editors must keep news, the calendar, results, galleries, sponsors and documents up to date for years.

After launch, the site is looked after by **non-technical volunteers**, on a small non-profit budget, so running costs should stay close to zero.

## Decision

| Layer     | Choice                                                                          | Why                                                                                                          |
| --------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Front end | Astro (static output) + React islands, TypeScript                               | Content site. Pre-rendered HTML needs no patching and keeps working even if dependencies are never updated.  |
| CMS       | Sanity, hosted Studio (`rem-pescadors.sanity.studio`)                           | Typed schemas and an editor UI in Catalan (`@sanity/locale-ca-es`). Nothing for the club to host. Free plan. |
| i18n      | `sanity-plugin-internationalized-array` (field level) + translated URL segments | Catalan is required. es/en are optional and fall back to Catalan.                                            |
| Hosting   | Cloudflare Workers with static assets                                           | Free. The only server code is the sign-up form.                                                              |
| Tooling   | pnpm workspaces, Turborepo, Biome, Vitest, Playwright                           | One `pnpm build` / `pnpm check` / `pnpm test` from the root.                                                 |

### Rejected

- **WordPress:** needs constant core and plugin updates and is a frequent attack target, so it rots without a maintainer.
- **Git-based CMS:** photo galleries would bloat the repo, and editors would have to deal with git concepts.
- **Site builders:** recurring fees, generic look, and localisation is a paid add-on.
- **Self-hosted Payload / Strapi:** a server and a database for the club to look after.

## Consequences

- Content changes reach the live site through a rebuild: a Sanity webhook triggers CI and a deploy, which takes about 1–2 minutes.
- Code changes need a developer. Content changes never do.
- The site depends on Sanity's free plan. If that plan changes, `sanity dataset export` gives a full JSON and assets export.
- `astro check` doesn't support TypeScript 7 yet, so `apps/web` pins TypeScript 6. Revisit when `@astrojs/ts-content-mapper` is stable.
- Document slugs are generated from the Catalan title. URL section segments are translated (`/noticies`, `/es/noticias`, `/en/news`).
