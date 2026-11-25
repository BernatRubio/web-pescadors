# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The website of Club Rem Pescadors, a Catalan fixed-seat sea-rowing club (llagut català, batel, llagut mediterrani). It's in Catalan (the default), Spanish and English.

After launch, the site is handed off to **non-technical volunteer editors**:

- Prefer static, zero-maintenance solutions.
- Never add servers, databases or services the club would have to run.
- Editors only ever touch Sanity Studio.

The reasoning is in `docs/architecture.md`. Development happens on Linux, so don't add macOS-specific files.

## Commands

Run from the root (pnpm 12, Node 24; Turborepo runs each workspace's script):

```sh
pnpm install
pnpm dev              # site + Studio
pnpm build            # astro build + sanity build
pnpm check            # astro check (web) + tsc (studio)
pnpm test             # vitest (packages/shared)
pnpm lint             # biome check
pnpm format           # biome check --write
pnpm design:lint      # validate DESIGN.md (@google/design.md)
pnpm design:tokens    # regenerate apps/web/src/styles/tokens.css from DESIGN.md
```

To run a task in one workspace or a single test:

```sh
pnpm --filter @pescadors/web build
pnpm --filter @pescadors/shared exec vitest run -t "falls back to Catalan"
pnpm --filter @pescadors/studio exec sanity schema validate
pnpm --filter @pescadors/studio typegen   # extract schema + scan defineQuery → packages/shared/sanity/types.ts
pnpm --filter @pescadors/studio seed      # idempotent sample content (needs `sanity login`)
pnpm --filter @pescadors/web test:e2e     # Playwright + axe against `astro preview`
SCREENSHOTS=1 pnpm --filter @pescadors/web test:e2e screenshots   # design-review screenshots → test-results/screenshots/
```

- Env vars live in `apps/web/.env` and `apps/studio/.env` (see the `.env.example` files). Without `PUBLIC_SANITY_PROJECT_ID` the site still builds, with empty states, which is what CI does until the project is configured.
- Astro 7 auto-backgrounds `astro preview` when it detects an AI agent. Playwright's webServer uses `--ignore-lock` to force a foreground server. If a stray server holds port 4321, run `pnpm --filter @pescadors/web exec astro preview stop`. Don't `pkill -f "astro preview …"` from a shell whose own command line contains that text: it kills the shell itself.
- `astro.config.mjs` loads `.env` explicitly with Vite's `loadEnv`, because Astro doesn't put `.env` into `process.env` while reading the config. Real environment variables (CI) win over `.env`.
- Commands run with `!` in Claude Code aren't interactive. CLI logins need explicit flags, e.g. `sanity login --provider github`.

- `apps/web` pins **TypeScript 6** because `astro check` doesn't support TS 7 yet. The other workspaces use TS 7.
- New packages with install scripts must be approved with `pnpm approve-builds <pkg>`, which writes `allowBuilds` in `pnpm-workspace.yaml`.

## Architecture

```
apps/web         Astro, static output + React islands, Cloudflare adapter (wrangler.jsonc)
apps/studio      Sanity Studio (schemas, Catalan desk structure)
packages/shared  Locales, route map, translation helpers. Imported as TS source by both apps.
```

### i18n spans all three packages

- **Content:** Sanity fields use `sanity-plugin-internationalized-array` (`internationalizedArrayString | Text | RichText`). They're stored as `[{language, value}]`.
  - Catalan is required. Validate with `requireCatalan()` from `apps/studio/src/lib/i18n.ts`.
  - es/en are optional. Read values with `pickLocale()` from `packages/shared/src/locales.ts`, which falls back to Catalan.
  - Studio previews and slugs use `caValue()` / `slugFromCatalanTitle`. Document slugs come from the Catalan title only.
- **URLs:** `packages/shared/src/routes.ts` (`ROUTES`) is the single source of translated path segments.
  - Catalan has no prefix. es and en are prefixed (`/noticies/`, `/es/noticias/`, `/en/news/`).
  - Always build links with `localizedPath()`, and hreflang/switcher links with `alternatePaths()`. Never hardcode paths.
- **Fixed UI text** (menus, labels) lives in `apps/web/src/i18n/ui.ts`. Content written by editors never goes there.

### Web routing and data

- Every page in every language comes from one catch-all, `apps/web/src/pages/[...path].astro`.
  - Its `getStaticPaths` builds section pages from `mvpSections` (`src/i18n/ui.ts`) × `LOCALES`, and detail pages (news, calendar, results, gallery) from Sanity content. It dispatches to `src/views/*View.astro`.
  - `getStaticPaths` runs in isolation, so helpers it uses must be defined inside it or imported.
- **Data:** GROQ queries live in `src/lib/sanity/queries.ts` (`defineQuery`). Their result types are generated into `packages/shared/sanity/types.ts` (`@pescadors/shared/sanity`), so run the Studio's `typegen` after changing a query or a schema.
  - Views read through `src/lib/content.ts`, which caches each query once per build.
  - Pick a language with `localizer(locale)` (`src/lib/i18n.ts`). When a value is a Catalan fallback on an es/en page, set `lang={l.lang(value)}` on its element (WCAG 3.1.2). `RichText.astro` does this itself.
  - Counted UI text goes in `plurals` and is read with `tn(locale, key, n)` (`Intl.PluralRules`), never `'{n} fotos'`.
  - Titles, descriptions, OG tags, JSON-LD and canonical/hreflang come from `pageMeta()` in `src/lib/seo.ts`. Untranslated posts and events point their canonical at the Catalan URL and print no hreflang alternates.
  - Event "past/upcoming" uses `isPastEvent()` (`packages/shared/src/dates.ts`): an event without an end lasts its whole day in Europe/Madrid.
  - Images go through `Picture.astro` / `responsiveImage()` (Sanity CDN `srcset` + LQIP). Rich text goes through `RichText.astro`.
- **Interactive islands** are React (`Lightbox.tsx` on the native `<dialog>`, `VideoFacade.tsx` click-to-load YouTube). Everything else is static HTML.
  - The gallery grid is static `<a data-photo>` links rendered by `AlbumView.astro`. The Lightbox island reads its photo data from those links' data attributes, so keep island props small (labels only).
- `src/pages/404.astro` is the single trilingual 404. `wrangler.jsonc` serves it with `assets.not_found_handling: "404-page"`.
- `layouts/Base.astro` sets `<html lang>`, canonical, hreflang (+ `x-default` → Catalan), OG tags, the header (crest, mobile menu, language links) and the footer (sponsors by tier).
- The header menu collapses below `lg` (64rem): between 48 and 64rem the seven Catalan labels wrap and break `--header-h`.
- `PUBLIC_NOINDEX=true` (the MVP on workers.dev) adds a robots meta tag, a `robots.txt` `Disallow` and an `X-Robots-Tag` header (`astro.config.mjs`).

### Studio

- Register new types in `apps/studio/src/schemas/index.ts`, then add them to the sidebar in `src/structure.ts`.
- Singletons (`siteSettings`, `homePage`) are listed in `SINGLETONS`. `sanity.config.ts` hides them from the "create" menu and limits their actions.
- `submission` documents are created only by the website form. They're hidden from "new document", and their fields are read-only apart from `status` and `followUp`.
- All Studio-facing titles, descriptions and validation messages are written in **Catalan** for non-technical editors. Use the `figure` type for images: it requires translatable alt text.
- **Privacy rule:** minors never get `person` documents or profiles. Results store crews as plain text.
- **The `production` dataset is public** (the site reads it at build time without a token). **Before any `submission` document is created**, make it private (`sanity dataset visibility set production private`) and give the build a read token (`SANITY_API_READ_TOKEN`, a CI secret, never `PUBLIC_`). Otherwise people's request details would be readable through the API.
- Sanity project `kpixmnoz` (MVP, organisation `o077qorqw` on the developer's account), Studio at https://rem-pescadors.sanity.studio (`deployment.appId` pinned in `sanity.cli.ts`). CORS origins: `http://localhost:3333`, `http://localhost:4321`. The site doesn't need its own origin, because it only reads Sanity at build time.
- Sample content comes from `apps/studio/scripts/seed.ts` (idempotent: fixed `_id`s + `createOrReplace`). Everything it creates is marked "(exemple)". Re-running it **replaces** the real photos added later with placeholders.
- Documents edited by people may have a `drafts.<id>` version. Data migrations must patch both `<id>` and `drafts.<id>`, otherwise publishing the draft undoes the change.
- Every document type needs a `preview`. Without one, the Studio shows raw field values as the title (it happened with the singletons).

## Conventions

- **Biome style:** 2-space indent, single quotes, line width 100. `noUnusedImports` and `noUnusedVariables` are off for `.astro` files, because Biome doesn't see usage inside templates.
- **Design:** `DESIGN.md` (Google's DESIGN.md format) is the source of truth for tokens and visual rules. Read it before UI work, and also follow `.claude/skills/frontend-design`.
  - **Styling is Tailwind CSS v4.** Tokens come from `tokens.css`, which is generated, so never edit it by hand: change DESIGN.md, then run `pnpm design:tokens`.
  - Properties the exporter doesn't cover (font width axis, line height, tabular figures) are `@utility` classes in `src/styles/global.css`: `hull`, `headline-lg`, `headline-md`, `race-number`, `meta`, `wrap`.
  - Don't combine `meta` with a colour utility. On coloured backgrounds use `text-label-md font-semibold`.
  - Coral red (`primary`) is for large text and backgrounds only. Text-size red is `primary-ink`. The hull band is used at most once per page.
- **Brand assets:** the crest and team photos live in `docs/brand/`, which is gitignored. They're club-owned and the repo is public. They reach the site only through Sanity.
  - Originals go in `docs/brand/photos/`, and web copies in `docs/brand/photos-web/`, made with `magick in.jpg -auto-orient -resize '2400x2400>' -strip -quality 82 out.jpg`. **`-strip` removes metadata including GPS**, which matters because Sanity serves the original file.
  - Photos where minors may be identifiable are not uploaded without the club's image consent. Two of the current test photos are held back for that reason.
  - Alt text is written in ca/es/en.
- **Home hero** (`views/HomeView.astro`): the first screen shows only the photo and the hull band, with the band on the bottom edge of the viewport.
  - Height is `100svh - var(--header-h)`; `--header-h` is a token in `global.css`.
  - **Desktop:** the photo fills the space above the band.
  - **Phones:** the photo is a fixed 4:5 crop and the red band fills the rest, with its text centred.
  - CSS does the crop, centred on the editor's Sanity **hotspot** (`objectPosition` on `Picture.astro`).
  - The band text comes from `homePage.heroBand` (max 24 characters). Its size is `clamp(3rem, min(20vw, 18svh), 11rem)`, so it's capped by screen height too.
  - Verify hero changes at 1905×918, 1366×650 and 412×800.
- **Deploy:** the MVP is the Worker **`web`** at **https://web.pescadors.workers.dev**, on the developer's Cloudflare account (account subdomain `pescadors`). `PUBLIC_NOINDEX=true` keeps it out of search engines.
  - Manual deploy: `pnpm --filter @pescadors/web build && pnpm --filter @pescadors/web exec wrangler deploy`.
  - Until the Sanity webhook exists, published content only goes live after a manual rebuild.
- **CI/CD:** `.github/workflows/ci.yml` runs lint, design:lint, check, test, build and e2e. It deploys with `wrangler deploy` on `main` (on the `sanity-publish` repository_dispatch, and on a daily 04:00 UTC cron that keeps build-time dates fresh), but only when the `CLOUDFLARE_ACCOUNT_ID` variable is set.
  - Until `PUBLIC_SANITY_PROJECT_ID` is set as a repo variable, CI's e2e and axe tests only see empty states. Run them locally with `apps/web/.env` to cover real content.
  - Not set up yet: the repo settings (`CLOUDFLARE_API_TOKEN` secret, `CLOUDFLARE_ACCOUNT_ID` and `PUBLIC_SANITY_PROJECT_ID` variables) and the Sanity → GitHub webhook.
  - Planned: content-only runs (`repository_dispatch`) skip the code checks and just build + deploy (about 1–1.5 min instead of 4–6).
- **`.agents/` and `.claude/` are excluded from Biome**: they hold vendored skills (`skills-lock.json`), and `pnpm format` would rewrite their Markdown front matter.
- **DESIGN.md is excluded from Biome**, because Biome's Markdown formatter flattens YAML front matter. Validate it with `pnpm design:lint`; the two expected warnings are the hull band's large-text contrast and `motion`, which CLI 0.4 doesn't know yet.
- **Open questions for the club:**
  - **The name:** the crest says "Club Rem Pescadors Lloret", the Instagram is `@clubrempescadors_`, and the press calls it "Es Pescadors".
  - **A domain:** `clubrempescadors.cat` was unregistered on 2026-11-24. Buy it before the address is used anywhere public, because a workers.dev address changes when the site moves accounts.
  - **Image consent** for minors.
- **MVP scope:** home, news, calendar, results, gallery, sponsors, club, contact. Not built yet:
  - school pages
  - the join/school request form (an Astro Action + Turnstile, saved as a `submission` + a Resend email; visitors never get accounts)
  - teams, fleet, legal pages
  - Cloudflare Web Analytics
