# Tech Dollez — We Build the Digital World

Official website of **Tech Dollez**, a digital studio for website design, web & app development, custom software and website redesign.

## Features

- 3D animated hero (Three.js iridescent orb, particles, mouse + scroll reactive)
- Cinematic scroll animations (GSAP ScrollTrigger + Lenis smooth scroll)
- Apple-style device reveal showcase, horizontal-scroll process section
- 3D tilt + cursor-glow cards, magnetic buttons, custom cursor
- **Live Website Playground** — visitors pick style, color, font, mode, corners and their business name; the preview site transforms live and "Build this for me" sends the design on WhatsApp
- **Spotlight reveal** headline that follows the cursor
- **Bento grid** — live code typing, Lighthouse score rings, live IST clock with online status, responsive screen morph, security scanner, counters
- **3-step Project Planner** that sends a full brief on WhatsApp
- Cursor sparkle trail, particle bursts on clicks, text-scramble effects, rotating hero words
- Shine-sweep hovers, dual marquees, scroll progress bar, back-to-top ring, interactive footer letters
- **Portfolio** — 9 real projects + 5 clearly-labelled concept designs, with filters, 3D hover cards and case-study popups
- **PrintX ERP interactive demo** — Sales, Production, Logistics, Finance & Admin tabs
- **Before / After redesign slider**
- **Free Website Audit** — real Google PageSpeed (Lighthouse) scores for any URL
- **Playground industry presets** — Salon, Restaurant, Clinic, College, Shop, Startup
- **Chat assistant** with instant answers that hands off to WhatsApp
- **English / हिंदी toggle**, **Ctrl+K command palette**, founder section, free-concept offer, hidden easter egg
- Floating WhatsApp button, fully responsive, reduced-motion support

## Performance

- Scripts are `defer`red and web fonts load asynchronously, so the page paints immediately
- Three.js (~600 KB) is lazy-loaded after the page is interactive; a gradient placeholder shows meanwhile
- Lighter 3D mesh on phones / low-power devices, no heavy blur filters on background orbs

## SEO

- Title, meta description, canonical (`https://techdollez.com/`), Open Graph & Twitter cards with a 1200×630 share image
- JSON-LD structured data: Organization / ProfessionalService (Bhopal), founder, WebSite, WebPage, FAQPage
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, app icons and a custom `404.html`
- Lighthouse (local): SEO 100 · Accessibility 100

After going live: verify the site in Google Search Console and submit `https://techdollez.com/sitemap.xml`.

## Structure

```
index.html
css/style.css
js/hero3d.js    # Three.js hero scene
js/main.js      # preloader, scroll animations, core interactions
js/features.js  # playground, planner, bento widgets, FX, scramble
css/features.css
js/extras.js    # portfolio, ERP demo, audit, chat, Hindi, Ctrl+K
css/extras.css
assets/favicon.svg
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

Static site — deploy the repo root on Netlify, Vercel or GitHub Pages (no build step).

## Contact

Arjun Ahirwar · WhatsApp / Call: +91 62609 93724

---

Made by Arjun Ahirwar
