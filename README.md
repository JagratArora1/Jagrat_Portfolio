# Jagrat Arora – Portfolio

Personal portfolio of **Jagrat Arora**, software developer and cybersecurity enthusiast.

**Live site: [www.jagratarora.com](https://www.jagratarora.com/)**

Built with React 19, Vite, Tailwind CSS 4, three.js (react-three-fiber + drei) and Motion. The contact form sends through EmailJS. Hosted on Vercel.

## Development

```bash
npm install
npm run dev      # local dev server
npm run lint     # oxlint
npm run build    # production build into dist/ (includes prerendering, see below)
npm run preview  # serve the production build locally
```

Requires Node.js 20.19+ or 22.12+.

## How the build works

`npm run build` does three steps:

1. `vite build` builds the site into `dist/`.
2. `vite build --ssr src/entry-server.jsx` builds a Node version of the app into `dist-server/`.
3. `scripts/prerender.js` renders the app to HTML and writes it into `dist/index.html`, then removes `dist-server/`.

The deployed page therefore contains its full text up front, so search engines and link previews see it without running JavaScript. In the browser, `src/main.jsx` hydrates that HTML. The 3D scenes are loaded separately (`src/components/canvas/index.jsx`), and the ones below the fold are only created when scrolled near.

## Search and sharing metadata

- **`index.html`**: title, description, canonical URL, Open Graph / Twitter tags and JSON-LD structured data (`Person`, `WebSite`, `ProfilePage`).
- **Profile links**: add new profiles (X, LeetCode…) in two places, `sameAs` in `index.html` and `socialLinks` in `src/constants/index.js` (shown in the footer).
- **`public/`**: `robots.txt`, `sitemap.xml` (update `<lastmod>` after content changes), `og-image.jpg` (1200×630 link preview), favicons and `site.webmanifest`.
- **`vercel.json`**: security headers, long-term caching for hashed assets, and a redirect from the `.vercel.app` address to the custom domain.

## Content

Projects, experience, skills and testimonials live in `src/constants/index.js`. Keep the skills list at 12 or fewer: each skill is its own 3D canvas, and browsers cap WebGL contexts per page at about 16.

## Blog

Posts are Markdown files in `content/blog/`. The file name is the URL (`content/blog/my-post.md` → `/blog/my-post`), and each starts with:

```markdown
---
title: My post title
description: One sentence of about 150 characters, shown in search results.
date: 2026-11-22
topic: Encryption
---
```

`scripts/build-blog.js` (the last build step) turns them into plain HTML pages with the site's look, adds them to the blog index and `sitemap.xml`, and adds structured data for search engines. `vercel.json` sets `cleanUrls` so the pages are served without `.html`.

## Light and dark mode

The theme is the `data-theme` attribute on `<html>`, and every colour comes from CSS variables in `src/index.css` (dark values in `@theme`, light overrides under `:root[data-theme="light"]`). Use `text-heading` for main text instead of `text-white`, so it switches too. Visitors switch by pulling the lamp's string in the navbar (`src/components/LampToggle.jsx`; on the blog, `scripts/blog/theme.js`), and the choice is saved in `localStorage`.

A small inline script in `index.html` applies the saved choice before the first paint. The Content-Security-Policy in `vercel.json` allows it by its SHA-256 hash, so if you change the script, update the hash; the build fails with the new value if they don't match.

Smooth scrolling uses [Lenis](https://github.com/darkroomengineering/lenis) (`src/smoothScroll.js`); the scroll progress bar, cursor glow and back-to-top button are in `src/components/Effects.jsx`. All motion is reduced for visitors who ask for it in their system settings.

## Credits

- 3D models: [Gaming Desktop PC](https://sketchfab.com/3d-models/gaming-desktop-pc-d1d8282c9916438091f11aeb28787b66) by Yolala1232 and [Stylized planet](https://sketchfab.com/3d-models/stylized-planet-789725db86f547fc9163b00f302c3e70) by cmzw, both [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Optimised for the web with [glTF Transform](https://gltf-transform.dev/); see the `license.txt` next to each model.
- PostgreSQL and Redis icons: [Devicon](https://devicon.dev/) (MIT).
