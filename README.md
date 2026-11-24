# Club Rem Pescadors: website

The club's website in Catalan (default), Spanish and English. Architecture and reasoning are in [docs/architecture.md](docs/architecture.md).

```
apps/web        Astro site (static, deployed to Cloudflare)
apps/studio     Sanity Studio, where the club's editors write content
packages/shared Languages, route map and shared Sanity types
```

## Requirements

- Node 24 (`.nvmrc`)
- pnpm 12

## Commands (from the root)

| Command                     | What it does                        |
| --------------------------- | ----------------------------------- |
| `pnpm install`              | Install everything                  |
| `pnpm dev`                  | Run the site and the Studio locally |
| `pnpm build`                | Build the site and the Studio       |
| `pnpm check`                | Type-check                          |
| `pnpm test`                 | Unit tests                          |
| `pnpm lint` / `pnpm format` | Biome lint, and lint + format       |

## License

The code is under the [MIT License](LICENSE). The club's name, crest, photos and other content are not covered by that licence. They belong to Club Rem Pescadors and live in Sanity, not in this repository.

Third-party agent skills in `.agents/skills/` keep their own licences.

## Configuration

Copy `apps/studio/.env.example` to `apps/studio/.env` and fill in the Sanity project ID once the club's Sanity project exists.
