# ADR 001: Architecture

- **Status:** accepted
- **Date:** 2026-11-24 (updated 2026-11-25 with the MVP decisions)

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
| Styling   | Tailwind CSS v4, themed from `DESIGN.md` (Google's DESIGN.md format)            | One design source for humans and AI agents. `@google/design.md` validates it and exports the Tailwind theme. |
| Tooling   | pnpm workspaces, Turborepo, Biome, Vitest, Playwright + axe                     | One `pnpm build` / `pnpm check` / `pnpm test` from the root.                                                 |

### Rejected

- **WordPress:** needs constant core and plugin updates and is a frequent attack target, so it rots without a maintainer.
- **Git-based CMS:** photo galleries would bloat the repo, and editors would have to deal with git concepts.
- **Site builders:** recurring fees, generic look, and localisation is a paid add-on.
- **Self-hosted Payload / Strapi:** a server and a database for the club to look after.

## MVP (2026-11-25)

- Built on the developer's own accounts, so it doesn't wait for the club's:
  - Sanity project `kpixmnoz`, Studio `rem-pescadors.sanity.studio`
  - Cloudflare Worker `web` at `web.pescadors.workers.dev`
- Every ID lives in env vars or repo settings, so moving it is configuration only (see `docs/moving-to-club-accounts.md`).
- Kept out of search engines while on workers.dev: `PUBLIC_NOINDEX=true` adds a robots meta tag, a `robots.txt` `Disallow` and an `X-Robots-Tag` header.
- **Scope:** home, news, calendar, results, galleries, sponsors, club page, contact.
- **Later:**
  - school pages
  - the join/school request form (a request only; visitors never get accounts)
  - teams, fleet, legal pages, analytics
- **Brand:** palette taken from the crest (red `#F60304`, black, marlin navy `#0A2861`). Typography: Archivo, using its width axis.

## Consequences

- Content changes reach the live site through a rebuild. Once the Sanity webhook is set up, a publish triggers a content-only build and deploy: about 1–1.5 minutes. Code pushes run the full checks first: about 5 minutes. Until then, rebuilds are manual.
- Code changes need a developer. Content changes never do.
- The site depends on Sanity's free plan. If that plan changes, `sanity dataset export` gives a full JSON and assets export.
- `astro check` doesn't support TypeScript 7 yet, so `apps/web` pins TypeScript 6. Revisit when `@astrojs/ts-content-mapper` is stable.
- Document slugs are generated from the Catalan title. URL section segments are translated (`/noticies`, `/es/noticias`, `/en/news`).
- **A workers.dev address belongs to a Cloudflare account** (`<worker>.<account-subdomain>.workers.dev`), so it changes when the site moves to the club's account. The club needs its own domain (e.g. `clubrempescadors.cat`, about 15–25 €/yr) before the address appears anywhere public.
- **The Sanity dataset is public**, so the build reads it without a token. It must become private, with a build-time read token, before the request form stores anyone's personal data.
