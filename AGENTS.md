# AGENTS.md

## Project Snapshot

- This repository is a static personal website deployed through GitHub Pages. It has two pages: the full site and a stripped-down text version.
- There is no build, package, or test pipeline. Treat every edit as a production edit.
- Main implementation files:
  - [index.html](index.html) for the full page content, section structure, SEO tags, structured data, and external scripts.
  - [simple.html](simple.html) for the minimal text-only version reachable from the `Simple` control in the header.
  - [assets/css/ycsun.css](assets/css/ycsun.css) for all styling and responsive behavior of `index.html`.
  - [assets/css/simple.css](assets/css/simple.css) for `simple.html` only. It is self-contained and does not load `ycsun.css`.
  - [assets/js/theme.js](assets/js/theme.js) for the day/night toggle, shared by both pages.
  - [assets/js/simple.js](assets/js/simple.js) for view switching on `simple.html`.
  - [assets/js/scrollar.js](assets/js/scrollar.js) for research-section interaction and video modal behavior on `index.html`.

## Collaboration Style

- Work as a professional web engineer and an elegant visual designer.
- Preserve the site's current character: calm, academic, readable, and restrained rather than flashy.
- Prefer small, surgical edits over rewrites.
- Do not introduce frameworks, bundlers, or package-managed tooling unless explicitly requested.

## The Simple Page And The Theme

- The theme has exactly two states, Day and Night. There is no automatic or time-based mode.
- On a first visit the theme comes from the operating system's `prefers-color-scheme`. After that, the visitor's choice is stored under `ycsun-theme-mode` in `localStorage` and wins.
- Each page carries a small inline script in `<head>` that sets `data-theme` on `<html>` before the stylesheet loads. This prevents a flash of the wrong theme, so keep it inline and keep both copies in sync.
- `theme.js` drives the button through the ids `themeToggle`, `themeToggleIcon`, and `themeToggleText`. Any new page that wants the toggle needs those ids plus the inline bootstrap.
- `simple.html` has its own visual language and is not meant to match `index.html` pixel for pixel: monospace type at 0.9rem on 1.8 line-height, a 70ch text column beside a 280px sidebar with a 72px gap, 2px dotted rules, and a warm paper-and-ink palette. The navy from the full site survives as the link color. Changing colors in `ycsun.css` does not require touching `simple.css`.
- The theme control on `simple.html` renders as `[day]` / `[night]`. Its sun and moon glyph is hidden there because the monospace face renders it badly, so `theme.js` must keep writing to the icon span for `index.html`.
- `simple.html` shows one view at a time. `readme` and `papers` are `<section class="view">` blocks and `simple.js` renders whichever the hash names, defaulting to `readme`. It also swaps the `h1` text and the document title, marks the current nav link with `data-active`, and shows the sidebar only on `readme`. The sidebar holds the photo and the contact list, following the layout of the site this page is modelled on.
- Those sections carry `data-view`, not a matching `id`. An `id` equal to the hash makes the browser scroll the header off screen on load, and neither `scrollRestoration` nor a `scrollTo` on load reliably prevents it. Adding new views means adding a `data-view` section, a nav link, and an entry in the `VIEWS` map.
- A hash that names no view falls back to `readme`, so links to retired views such as `#elsewhere` still land somewhere sensible.
- Without JavaScript the page falls back to every section stacked on one page, which is why the view rules in `simple.css` are all scoped under `.js`. The inline head script adds that class.
- `simple.html` is a condensed restatement of `index.html`, so its canonical URL points at the site root and it stays out of `sitemap.xml`. If its content diverges into something substantial, revisit both.
- Keep the two pages factually consistent: supervisors, affiliation, contact details, and the selected papers listed on the simple page all come from `index.html`.

## Content And Design Rules

- Keep the page English-first while preserving the bilingual personal identity format `Yichong SUN (孙艺崇)`.
- Keep navigation links, section `id` values, and section order synchronized.
- On `index.html`, preserve the existing serif typography, dark blue navigation/header tone, generous whitespace, and simple academic presentation unless a redesign is explicitly requested. `simple.html` deliberately does not follow these; see the section above.
- When editing publications, patents, honors, teaching, or contact details, preserve the current content structure and link behavior.
- Keep external links opening in a new tab with a safe `rel` attribute.

## SEO And Identity Consistency

- `index.html` is the source of truth for visible content and SEO metadata.
- If name, title, affiliation, photo, URL, or contact details change, update all related surfaces together:
  - `<title>` and meta description/keywords/author/canonical tags
  - Open Graph and Twitter card tags
  - The JSON-LD `Person` block
  - Any matching visible content in the page body
- Keep absolute social preview URLs valid.
- Do not remove the Umami analytics script unless explicitly asked.
- If the public site URL changes, also review `CNAME`, `robots.txt`, and `sitemap.xml`.

## Frontend Constraints

- Keep this site dependency-free: plain HTML, CSS, and browser JavaScript only.
- Keep asset paths relative to the repository root layout already in use.
- The research section relies on the current HTML structure in `index.html` and behavior in `scrollar.js` for:
  - horizontal scrolling of research cards
  - click-to-open video modal playback
  - viewport-based video play/pause via `IntersectionObserver`
- `scrollar.js` also checks for optional `.scrollbar-thumb` and `.scrollbar-track` elements. If adding a custom scrollbar UI, add the matching HTML, CSS, and JS support together.
- When changing media assets, verify posters, videos, profile image, and CV download paths together.
- The two pages use different portraits: `index.html` uses `profile.jpg`, `simple.html` uses `profile1-web.jpg`. That file is a 900x1200 copy of `profile1.jpg`, which is a 3000x4000 original at 2.2MB and far too heavy to serve. Replacing the portrait means regenerating the web copy, not pointing the page at the original.

## Validation

- There is no automated validation in this repo.
- After making changes, do a manual check in a browser:
  - verify anchor navigation and section scrolling
  - verify desktop and mobile layout
  - verify research video modal open/close and playback behavior
  - verify changed links and asset paths
  - if factual identity content changed, re-check SEO/meta/schema consistency
