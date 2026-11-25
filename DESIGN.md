---
version: alpha
name: Pescadors Hull
description: Design system for the Club Rem Pescadors Lloret website. Crest red, true black and marlin navy, with condensed hull lettering as the one bold device.
colors:
  primary: "#F60304"
  primary-ink: "#D11113"
  on-primary: "#FFFFFF"
  secondary: "#0A2861"
  secondary-light: "#16468F"
  on-secondary: "#FFFFFF"
  neutral: "#D6E4E7"
  surface: "#FFFFFF"
  on-surface: "#000000"
  muted: "#4A5258"
typography:
  hull-display:
    fontFamily: Archivo Variable
    fontSize: 7rem
    fontWeight: 900
    lineHeight: 0.85
    letterSpacing: -0.01em
    fontVariation: "'wdth' 62"
  headline-lg:
    fontFamily: Archivo Variable
    fontSize: 2.441rem
    fontWeight: 800
    lineHeight: 1.05
    fontVariation: "'wdth' 75"
  headline-md:
    fontFamily: Archivo Variable
    fontSize: 1.563rem
    fontWeight: 700
    lineHeight: 1.2
  body-lg:
    fontFamily: Archivo Variable
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Archivo Variable
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: Archivo Variable
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.3
  race-number:
    fontFamily: Archivo Variable
    fontSize: 1.953rem
    fontWeight: 900
    lineHeight: 1
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 75"
rounded:
  none: 0px
  sm: 2px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 2rem
  xl: 4rem
  section: 6rem
  measure: 70ch
  max-width: 80rem
motion:
  state-change:
    duration: 120ms
    delay: 0ms
    timingFunction: ease-out
  hull-enter:
    duration: 400ms
    delay: 100ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-enter:
    duration: 200ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
components:
  hull-band:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.hull-display}"
    rounded: "{rounded.none}"
  button-primary:
    backgroundColor: "{colors.primary-ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 0.75rem
  button-primary-hover:
    backgroundColor: "{colors.on-surface}"
  link:
    textColor: "{colors.primary-ink}"
  race-sheet-header:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-md}"
  race-sheet-position:
    textColor: "{colors.on-surface}"
    typography: "{typography.race-number}"
  footer:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
  footer-link-hover:
    backgroundColor: "{colors.secondary-light}"
    textColor: "{colors.on-secondary}"
  divider:
    backgroundColor: "{colors.neutral}"
    height: 1px
  meta-text:
    textColor: "{colors.muted}"
    typography: "{typography.label-md}"
---

# Pescadors Hull

## Overview

The website of **Club Rem Pescadors Lloret**, a fixed-seat sea-rowing club in Lloret de Mar (llagut català, batel, llagut mediterrani).

- **Audience:** athletes and families checking the calendar and results; locals discovering the club; sponsors.
- **Main job:** show that the club is alive (next regatta, latest results, latest news) and make it easy to get in touch.
- **Feel:** proud, outdoor, direct. Closer to a race programme and a painted boat than to a startup landing page.

Two things are unmistakably Pescadors: the **crest** (a red llagut and a navy marlin in a red-lettered roundel) and the **boats**, red hulls with the club's name painted along the side in big white capitals.

The design borrows that **hull lettering**, very condensed heavy capitals on a red band, as its one bold element. Everything else stays quiet. Real rowing photography carries the colour and energy.

## Colors

Taken from the crest and the racing kit. Red dominates, black and white carry the structure, navy is the secondary.

- **Crest red (`primary`, #F60304):** large type, the hull band, primary buttons with white bold text. It is only 4.2:1 on white, so **never use it for small text**.
- **Ink red (`primary-ink`, #D11113):** the red for text, links, hover and focus rings (≈5.5:1 on white).
- **Marlin navy (`secondary`, #0A2861):** the footer, race-sheet headers, anything "sea". `secondary-light` (#16468F) for accents on navy.
- **Spray (`neutral`, #D6E4E7):** the cool mist from the crest. Hairline dividers and quiet backgrounds.
- **True black (`on-surface`, #000000)** on **white (`surface`)**: text and the crest outline. Not a tinted near-black.
- **Muted (`muted`, #4A5258):** secondary text such as dates and locations (≥7:1 on white).

## Typography

One family, **Archivo** (variable: weight 100–900, width 62–125%), self-hosted through Fontsource (`@fontsource-variable/archivo/wdth.css`), so there are no third-party font requests. It covers Catalan's `ŀ`, `·`, `à`, `ç` etc. The **width axis is the design device**, so no second family is needed.

- **Hull display:** width 62%, weight 900, uppercase. Only in the hull band and big section titles. Size with `clamp()` from about 3rem on mobile to 7rem or more on desktop.
- **Headlines:** width 75–100%, weight 700–800, sentence case.
- **Body:** width 100%, weight 400, line height 1.6, measure ≤ 70ch.
- **Race numbers:** positions, times and dates in results and the calendar use tabular figures at width 75% and weight 900, like a race sheet.
- Scale ratio ≈1.25 (1 · 1.25 · 1.563 · 1.953 · 2.441 rem).

## Layout

- Left-aligned editorial layout on a 12-column grid, max width 80rem. Text is never centred except inside the hull band.
- Mobile first: one column under 48rem. On desktop, home sections split 7/5 (main/secondary), never into equal card grids.
- Sections are separated by whitespace (`section` spacing) and spray hairlines, not boxes.

Home page:

```text
┌──────────────────────────────────────────────┐
│ [crest] Pescadors       Calendari Resultats …│  header: white, spray hairline
├──────────────────────────────────────────────┤
│        full-bleed photo: crew on the water   │  first screen = photo + band only,
│██████ CLUB REM PESCADORS █████████████████████│  band on the bottom edge of the screen
├──────────────────────────────────────────────┤  ── scroll ──
│ Rem de banc fix a Lloret de Mar  (h1)        │
├──────────────────────────────────────────────┤
│ Pròxima regata           │ Últims resultats  │  race sheets, tabular figures
├──────────────────────────────────────────────┤
│ Notícies: 1 large + 2 small (varied sizes)   │
├──────────────────────────────────────────────┤
│ Galeria strip: 3–4 photos, edge to edge      │
├──────────────────────────────────────────────┤
│ navy footer: contact, sponsors by tier       │
└──────────────────────────────────────────────┘
```

### Home hero (the first screen)

The first screen shows **only the hero photo and the hull band**, with the band's bottom edge on the bottom of the viewport. Nothing else is visible until you scroll. Its height is `100svh` minus the header height (`--header-h`).

- **Desktop:** the band sits at its natural height and the photo fills all the space above it.
- **Phones:** the photo is a fixed **4:5** crop. The band fills the rest of the screen with its text centred, about 28% of a typical phone. Filling a tall screen with a wide photo would cut away most of the boat, and a full-height red block reads as too heavy.
- **Band size:** `clamp(3rem, min(20vw, 18svh), 11rem)`, so it's capped by the screen height as well as the width.
- **Crop focus:** CSS crops the photo around the editor's **hotspot** from Sanity, so editors control which part stays visible.
- **Band text:** an editor field (`homePage.heroBand`, translatable, max 24 characters). It falls back to "Pescadors Lloret". Short names stay on one line; two lines are fine on large screens.
- **Hero photos:** prefer a compact subject, like a crew launching or a bow close-up. A long boat seen side-on gets cut at bow and stern on phones. At least 2000 px wide, subject in the upper two-thirds.
- **Check hero changes at:** 1905×918, 1366×650 and 412×800.

### Other pages

- **List pages** (news, calendar, results, galleries): the title on a short hull band, then a plain list.
- **Results detail:** a race sheet with a navy header row, then rows led by a heavy condensed position number.
- **News detail:** cover image, title, date, a single text column, then the related regatta or album.

## Elevation & Depth

Flat. Hierarchy comes from scale, weight, the hull band and the navy surfaces. No drop shadows. The only overlap is the hull band laid over the bottom edge of the hero photo.

## Shapes

Square. Containers, images and bands have no radius (`rounded.none`). Buttons and inputs get a 2px radius (`rounded.sm`), just enough to read as controls. Never round photos.

## Motion & Micro-interaction

- **One orchestrated moment:** the home hull band slides in from the left once on load (`hull-enter`).
- Everything else moves only in response to the user: hover and focus (`state-change`), and the gallery lightbox opening and closing (`surface-enter` / `surface-exit`).
- No scroll-triggered fade-ins. Animate only `transform` and `opacity`. Under `prefers-reduced-motion`, everything appears instantly.

## Voice & Content Strategy

- **Tone:** plain, warm, sporty. No marketing hype and no exclamation marks in the interface.
- **Languages:** Catalan first. Spanish and English mirror the same tone. Club terms stay in Catalan in every language: _llagut català_, _batel_, _llagut mediterrani_.
- **Capitalization:** sentence case everywhere. Capitals appear only in the hull band, where they copy real hull lettering.
- **Actions:** verb phrases naming the outcome, e.g. "Veure tots els resultats", "Escriu-nos". The same action keeps the same name throughout a flow.
- **Empty states point somewhere:** "No hi ha regates programades ara mateix. Mira els últims resultats."
- **Dates and numbers:** written in full in prose ("dissabte 14 de març"), short in race sheets (14/03). Times are `mm:ss.cc`. Positions are plain numbers.

## Components

- **Hull band** (`hull-band`): a full-width crest-red band with white hull-display capitals. Use it at most once per page: the home hero or the page title. White on crest red is 4.26:1, which passes WCAG AA only as **large text**, so hull-band text must never drop below 24px (the linter's contrast warning for this component is expected).
- **Divider** (`divider`): a 1px spray hairline between sections.
- **Meta text** (`meta-text`): dates, places and captions in muted grey.
- **Race sheet** (`race-sheet-header`, `race-sheet-position`): a semantic `<table>` with a navy header row and spray row dividers, led by the position number. Used for results and the calendar.
- **Primary button** (`button-primary`): ink red with a white bold label, 2px radius, hover to black. It isn't crest red, because white on crest red is only 4.26:1, which fails AA for a small label. Use one per view.
- **Links** (`link`): ink red, underlined, with a visible 2px ink-red focus ring offset from the text.
- **Footer** (`footer`): marlin navy, with contact details and sponsor logos grouped by tier (main sponsors larger). Links hover to `secondary-light` (`footer-link-hover`).
- **Gallery lightbox:** full-screen, black backdrop, keyboard and swipe navigation, returns focus to the thumbnail on close.

## Do's and Don'ts

- Do keep crest red for large type, bands and buttons, and use `primary-ink` for any text-size red.
- Do let real photos carry the colour. No gradients, glows, blobs or decorative patterns.
- Do strip photo metadata (GPS) before upload, and don't publish photos where minors are identifiable without the club's image consent.
- Do use tables for tabular data (results, calendars), with tabular figures.
- Do keep WCAG AA contrast and visible keyboard focus everywhere.
- Don't use more than one hull band per page.
- Don't use ALL-CAPS eyebrow labels above headings, `A · B · C` meta strings or `→` appended to links.
- Don't use identical rounded cards with soft shadows to lay out lists.
- Don't add scroll-triggered animations or animate every section.
- Don't redraw or restyle the crest. Use the club's file as is.
