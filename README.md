# Club Rem Pescadors: website

The website of Club Rem Pescadors Lloret, a fixed-seat sea-rowing club in Lloret de Mar, in Catalan (default), Spanish and English.

- **MVP (hidden from search engines):** https://web.pescadors.workers.dev
- **Editor (Sanity Studio):** https://rem-pescadors.sanity.studio

```
apps/web        Astro site (static + React islands), deployed to Cloudflare Workers
apps/studio     Sanity Studio, where the club's editors write content
packages/shared Languages, route map and generated Sanity types
DESIGN.md       Design system (tokens + rules), the source of the Tailwind theme
```

## Docs

- [docs/architecture.md](docs/architecture.md): why this stack, and what was rejected
- [DESIGN.md](DESIGN.md): colours, type, layout, components and voice
- [docs/moving-to-club-accounts.md](docs/moving-to-club-accounts.md): moving the MVP to the club's own accounts and domain
- [CLAUDE.md](CLAUDE.md): working notes for AI agents (also useful for humans)

## Requirements

- Node 24 (`.nvmrc`)
- pnpm 12

## Commands (from the root)

| Command                     | What it does                                  |
| --------------------------- | --------------------------------------------- |
| `pnpm install`              | Install everything                            |
| `pnpm dev`                  | Run the site and the Studio locally           |
| `pnpm build`                | Build the site and the Studio                 |
| `pnpm check`                | Type-check                                    |
| `pnpm test`                 | Unit tests                                    |
| `pnpm lint` / `pnpm format` | Biome lint, and lint + format                 |
| `pnpm design:lint`          | Validate DESIGN.md                            |
| `pnpm design:tokens`        | Regenerate the Tailwind tokens from DESIGN.md |

Per workspace:

| Command                                             | What it does                                                 |
| --------------------------------------------------- | ------------------------------------------------------------ |
| `pnpm --filter @pescadors/web test:e2e`             | Playwright + accessibility tests on the built site           |
| `pnpm --filter @pescadors/studio typegen`           | Regenerate TypeScript types from schemas and queries         |
| `pnpm --filter @pescadors/studio seed`              | Load sample content into Sanity (needs `sanity login`)       |
| `pnpm --filter @pescadors/studio deploy`            | Deploy the Studio                                            |
| `pnpm --filter @pescadors/web exec wrangler deploy` | Deploy the built site to Cloudflare (needs `wrangler login`) |

## Configuration

Copy the example env files and fill them in:

- `apps/studio/.env.example` → `apps/studio/.env` (`SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`)
- `apps/web/.env.example` → `apps/web/.env` (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SITE_URL`, `PUBLIC_NOINDEX`)

Without a Sanity project ID the site still builds, showing its empty states.

## Publishing content

Editors publish in the Studio. The site is static, so a publish goes live after a rebuild. Until the Sanity webhook is configured, rebuild and deploy by hand:

```sh
pnpm --filter @pescadors/web build && pnpm --filter @pescadors/web exec wrangler deploy
```

## License

The code is under the [MIT License](LICENSE). The club's name, crest, photos and other content are not covered by that licence. They belong to Club Rem Pescadors and live in Sanity, not in this repository.

Third-party agent skills in `.agents/skills/` keep their own licences.
