# Moving the MVP to the club's accounts

The MVP runs on the developer's own accounts:

| Service    | MVP value                                                                          |
| ---------- | ---------------------------------------------------------------------------------- |
| Sanity     | project `kpixmnoz`, organisation `o077qorqw`, Studio `rem-pescadors.sanity.studio` |
| Cloudflare | Worker `web`, account subdomain `pescadors` → `https://web.pescadors.workers.dev`  |
| GitHub     | `BernatRubio/web-pescadors`                                                        |

Every ID lives in environment variables or repo settings, so moving it is configuration only, with no code changes.

**Do step 5 (the domain) before the address is shared publicly.** A workers.dev address belongs to the Cloudflare account, so moving accounts changes it to `web.<club-subdomain>.workers.dev`, and every link or QR code to the old one breaks. A domain stays the same whichever account hosts the site.

## 1. Club Google account

Create it first. It owns everything below. Add the developer as a second admin everywhere.

## 2. Sanity

1. In sanity.io/manage, invite the club account to the project as **Administrator**.
2. Under Project → Settings, **transfer the project** to an organisation owned by the club account. The project ID, dataset, content and assets stay the same.
3. Invite the club's editors with the **Editor** role.
4. Check the publish webhook (API → Webhooks) still points to the GitHub dispatch URL, with a token from the repo's new owner (see 4).
5. Before the join/school request form goes live, make the dataset private (`sanity dataset visibility set production private`) and give the build a read token.

No env var changes are needed, because the project ID doesn't change. The Studio keeps its address (`rem-pescadors.sanity.studio`), which belongs to the project.

## 3. Cloudflare

1. Create a Cloudflare account with the club Google account.
2. Create an API token there with the "Edit Cloudflare Workers" template.
3. In GitHub → repo → Settings, update:
   - variable `CLOUDFLARE_ACCOUNT_ID` → the club's account ID
   - secret `CLOUDFLARE_API_TOKEN` → the club's token
4. Run the workflow once (Actions → CI and deploy → Run workflow). The site deploys as Worker `web` to the club's `web.<club-subdomain>.workers.dev`.
5. Delete the old Worker `web` from the developer's account (`wrangler delete web`).

## 4. GitHub (optional)

Transfer the repo to a club-owned organisation (Settings → Transfer). GitHub redirects the old URL. Recreate the fine-grained token used by the Sanity webhook (Contents: read, Actions: write) under the new owner, and update it in the Sanity webhook headers.

## 5. Domain and going live

1. Register the domain (e.g. `clubrempescadors.cat`, unregistered as of 2026-11-24) under the club's Google account, and add it to Cloudflare.
2. Worker → Settings → Domains & Routes → add the custom domain.
3. Set the repo variables `PUBLIC_SITE_URL=https://<domain>` and `PUBLIC_NOINDEX=false`, then rerun the workflow. Search engines can now index the site.
4. Optional: set up free Cloudflare Email Routing for `info@`, `web@` and `escola@` on the domain, forwarding to board members.
