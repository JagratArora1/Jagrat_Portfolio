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

## Credits

- 3D models: [Gaming Desktop PC](https://sketchfab.com/3d-models/gaming-desktop-pc-d1d8282c9916438091f11aeb28787b66) by Yolala1232 and [Stylized planet](https://sketchfab.com/3d-models/stylized-planet-789725db86f547fc9163b00f302c3e70) by cmzw, both [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Optimised for the web with [glTF Transform](https://gltf-transform.dev/); see the `license.txt` next to each model.
- PostgreSQL and Redis icons: [Devicon](https://devicon.dev/) (MIT).
