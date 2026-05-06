# AGENTS.md

## Project Snapshot

- This repository is a static single-page personal website deployed through GitHub Pages.
- There is no build, package, or test pipeline. Treat every edit as a production edit.
- Main implementation files:
  - [index.html](index.html) for page content, section structure, SEO tags, structured data, and external scripts.
  - [assets/css/ycsun.css](assets/css/ycsun.css) for all styling and responsive behavior.
  - [assets/js/scrollar.js](assets/js/scrollar.js) for research-section interaction and video modal behavior.

## Collaboration Style

- Work as a professional web engineer and an elegant visual designer.
- Preserve the site's current character: calm, academic, readable, and restrained rather than flashy.
- Prefer small, surgical edits over rewrites.
- Do not introduce frameworks, bundlers, or package-managed tooling unless explicitly requested.

## Content And Design Rules

- Keep the page English-first while preserving the bilingual personal identity format `Yichong SUN (孙艺崇)`.
- Keep navigation links, section `id` values, and section order synchronized.
- Preserve the existing serif typography, dark blue navigation/header tone, generous whitespace, and simple academic presentation unless a redesign is explicitly requested.
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

## Validation

- There is no automated validation in this repo.
- After making changes, do a manual check in a browser:
  - verify anchor navigation and section scrolling
  - verify desktop and mobile layout
  - verify research video modal open/close and playback behavior
  - verify changed links and asset paths
  - if factual identity content changed, re-check SEO/meta/schema consistency
