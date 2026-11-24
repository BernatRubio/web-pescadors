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
```

To run a task in one workspace or a single test:

```sh
pnpm --filter @pescadors/web build
pnpm --filter @pescadors/shared exec vitest run -t "falls back to Catalan"
pnpm --filter @pescadors/studio exec sanity schema validate
pnpm --filter @pescadors/studio typegen   # extract schema → packages/shared/sanity/, generate types
```

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

### Web routing

- Every section page in every language comes from one catch-all, `apps/web/src/pages/[...path].astro`, which generates its `getStaticPaths` from `ROUTES` × `LOCALES`.
- `layouts/Base.astro` sets `<html lang>`, the canonical URL, hreflang alternates (+ `x-default` → Catalan) and the navigation.
- Sections are still placeholders. Detail routes (`news/[slug]` etc.) and the Sanity data layer are not built yet.

### Studio

- Register new types in `apps/studio/src/schemas/index.ts`, then add them to the sidebar in `src/structure.ts`.
- Singletons (`siteSettings`, `homePage`) are listed in `SINGLETONS`. `sanity.config.ts` hides them from the "create" menu and limits their actions.
- `submission` documents are created only by the website form. They're hidden from "new document", and their fields are read-only apart from `status` and `followUp`.
- All Studio-facing titles, descriptions and validation messages are written in **Catalan** for non-technical editors. Use the `figure` type for images: it requires translatable alt text.
- **Privacy rule:** minors never get `person` documents or profiles. Results store crews as plain text.

## Conventions

- **Biome style:** 2-space indent, single quotes, line width 100. `noUnusedImports` and `noUnusedVariables` are off for `.astro` files, because Biome doesn't see usage inside templates.
- **Design:** follow `.claude/skills/frontend-design` for UI work.
  - Keep the club's existing colour palette. Typography is open.
  - Styling (Tailwind v4 vs vanilla CSS tokens) is deliberately undecided until the design tokens exist.
- **Planned, not yet built:**
  - the sign-up form (an Astro Action in a Worker + Turnstile, saved as a `submission` + a Resend email)
  - Playwright/axe/Lighthouse checks
  - deploys from a Sanity webhook
  - cookie-free Cloudflare Web Analytics
