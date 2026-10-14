# Tech Dollez — We Build the Digital World

Official website of **Tech Dollez**, a digital studio in Bhopal for website design, web & app development, custom software / ERP and website redesign.

Live: https://techdoodlez.com

## Pages

| URL | What's on it |
|---|---|
| `/` | 3D hero, live Playground teaser, services overview, featured projects, "Built different" bento, free-concept offer |
| `/services` | Services explorer (6 services, tabbed), process, plans, FAQ |
| `/work` | All projects with filters + case-study popups, interactive PrintX ERP demo, before/after slider |
| `/playground` | Live website builder (industry presets, style, colors, font, mode) + device showcase |
| `/audit` | Free website audit (real Google Lighthouse scores) |
| `/about` | Founder, story, tech stack |
| `/contact` | 3-step project planner → WhatsApp, call / WhatsApp links |

## Features

- **Light / dark theme** toggle and a **live customizer** (🎨 in the nav): visitors pick theme, color palette (Aurora, Ocean, Sunset, Forest, Royal, Mono), font, background graphics and effects (Full / Lite). Saved per visitor and applied on every page — the 3D hero follows the chosen colors.
- **English / हिंदी** for all page content
- 3D hero (Three.js, lazy-loaded), GSAP scroll animations, Lenis smooth scroll, cross-page view transitions
- Chat assistant, Ctrl+K command palette, cursor trail, particle bursts, text scramble
- Phones: compact 2-column grids and swipe rows so pages stay short
- Preloader only on the first page of a visit

## Editing the site

Pages are built from shared parts so the nav, footer and SEO stay identical everywhere:

```
_src/partials/   head (SEO + prefs script), nav, footer, overlays, customizer
_src/sections/   reusable page sections (hero, services, work grid, ...)
_src/pages/      one file per page: META json + {{> section}} includes
```

After editing anything in `_src/`, rebuild:

```bash
python3 _src/build.py
```

This writes `index.html`, `services.html`, … and `sitemap.xml` in the repo root. Commit those files — Vercel serves them as-is (no build step). `_src/` is excluded from the deploy via `.vercelignore`.

```
css/style.css     base design          js/main.js      shared: nav, scroll, links, animations
css/features.css  playground, bento    js/features.js  playground, planner, bento, FX
css/extras.css    work, ERP, chat ...  js/extras.js    portfolio, ERP, audit, chat, Hindi, Ctrl+K, services tabs
css/pages.css     multi-page layout    js/prefs.js     theme + live customizer
css/theme.css     themes, palettes     js/hero3d.js    Three.js hero (home only)
```

## SEO

- Per-page title, description, canonical (clean URLs via `vercel.json` → `/services`), Open Graph / Twitter cards, 1200×630 share image
- JSON-LD on every page: Organization / ProfessionalService (Bhopal), WebSite, WebPage / AboutPage / ContactPage, BreadcrumbList, founder, FAQPage on `/services`
- `robots.txt`, `sitemap.xml` (all 7 pages), `site.webmanifest`, app icons, custom `404.html`
- Lighthouse (local): SEO 100 · Accessibility 100 on every page

Submit `https://techdoodlez.com/sitemap.xml` in Google Search Console.

## Run locally

```bash
npx serve .        # clean URLs like /services work out of the box
```

## Contact

Arjun Ahirwar · WhatsApp / Call: +91 62609 93724

---

Made by Arjun Ahirwar
