// Runs last in `npm run build` (see package.json).
//
// Builds the static pages around the portfolio from content/:
//   dist/blog.html           -> https://www.jagratarora.com/blog
//   dist/blog/<slug>.html    -> https://www.jagratarora.com/blog/<slug>
//   dist/blog/<slug>.md      -> the post as Markdown, for AI tools
//   dist/about.html          -> https://www.jagratarora.com/about (content/about.md)
//   dist/llms.txt            -> short summary of the site for AI assistants
//   dist/llms-full.txt       -> the profile and every post in one text file
// ("cleanUrls" in vercel.json serves the pages without the .html.) The pages
// are plain HTML and CSS with one small script for the light/dark lamp, so
// they load instantly, and search engines and AI crawlers (which mostly don't
// run JavaScript) read them directly. It also adds the pages to
// dist/sitemap.xml.
//
// Post format: front matter with title, description (one sentence, about 150
// characters), date (YYYY-MM-DD) and topic, then Markdown using ## headings.
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const postsDir = path.join(root, 'content', 'blog')
const dist = path.join(root, 'dist')
const SITE = 'https://www.jagratarora.com'
const PERSON_ID = `${SITE}/#person`

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

// --- The theme script ------------------------------------------------------
// The blog pages reuse index.html's inline theme script byte for byte, so the
// one hash in the Content-Security-Policy covers both. Fail the build if the
// script and the policy have drifted apart.
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const themeScript = indexHtml.match(/<script>(try\{[\s\S]*?)<\/script>/)?.[1]
if (!themeScript) throw new Error('build-pages: theme script not found in index.html')
const themeHash = `sha256-${crypto.createHash('sha256').update(themeScript).digest('base64')}`
const vercelConfig = fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')
if (!vercelConfig.includes(`'${themeHash}'`)) {
  throw new Error(
    `build-pages: the theme script in index.html changed. Put '${themeHash}' in script-src in vercel.json.`,
  )
}

// --- Posts ------------------------------------------------------------------
function readPost(file) {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8').replace(/\r\n/g, '\n')
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) throw new Error(`build-pages: ${file} has no front matter`)
  const meta = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon > 0) meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }
  for (const key of ['title', 'description', 'date', 'topic']) {
    if (!meta[key]) throw new Error(`build-pages: ${file} is missing "${key}"`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`build-pages: bad date in ${file}`)
  const markdown = raw.slice(match[0].length)
  const words = markdown.split(/\s+/).filter(Boolean).length
  const slug = file.replace(/\.md$/, '')
  return {
    ...meta,
    slug,
    url: `${SITE}/blog/${slug}`,
    markdown,
    html: marked.parse(markdown),
    minutes: Math.max(1, Math.round(words / 220)),
  }
}

const posts = fs
  .readdirSync(postsDir)
  .filter((file) => file.endsWith('.md'))
  .map(readPost)
  .sort((a, b) => b.date.localeCompare(a.date) || a.topic.localeCompare(b.topic) || a.title.localeCompare(b.title))

// --- Page template ------------------------------------------------------------
const STYLES = `
:root{color-scheme:dark;--bg:#050816;--card:#151030;--card-2:#100d25;--text:#d9d6ea;--heading:#fff;--muted:#aaa6c3;--link:#b99bff;--border:#262150;--code-bg:#0c0922;--code-text:#e8e6f5;--lamp-cable:#57527a;--lamp-cord:#9a95c2;--lamp-bulb:#3b3756;--lamp-glow:0}
:root[data-theme="light"]{color-scheme:light;--bg:#f7f5ff;--card:#fff;--card-2:#f1edff;--text:#2e2a48;--heading:#16122f;--muted:#5b5778;--link:#6232d8;--border:#e2dcf7;--code-bg:#f3f0ff;--code-text:#2b2746;--lamp-cable:#77729a;--lamp-cord:#77729a;--lamp-bulb:#ffe28c;--lamp-glow:1}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font-family:Poppins,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.75;transition:background-color .4s,color .4s}
a{color:var(--link)}a:hover{color:var(--heading)}
::selection{background:rgba(145,94,255,.35)}
::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}
.wrap{max-width:760px;margin:0 auto;padding:0 20px}
.site-header{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
.site-header .wrap{max-width:1120px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:20px;padding-bottom:20px}
.brand{display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;color:var(--heading);font-weight:700;font-size:18px;text-decoration:none}
.brand img{width:34px;height:34px;border-radius:8px}
.header-right{display:flex;align-items:center;gap:28px}
.site-nav{display:flex;gap:24px;font-size:15px}
.site-nav a{color:var(--muted);text-decoration:none;font-weight:500;transition:color .2s}
.site-nav a:hover,.site-nav a[aria-current]{color:var(--heading)}
main{padding:56px 0 72px}
h1{color:var(--heading);font-size:clamp(30px,5.2vw,46px);line-height:1.18;margin:14px 0 18px;font-weight:800;letter-spacing:-.01em}
.chip{display:inline-block;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:4px 12px;border-radius:999px;background:linear-gradient(90deg,rgba(0,206,168,.16),rgba(191,97,255,.18));color:var(--heading)}
.lead{color:var(--muted);font-size:18px;margin:0}
.profile-head{display:flex;align-items:center;gap:24px;margin:0 0 36px}
.profile-head img{width:128px;height:128px;border-radius:50%;object-fit:cover;object-position:top;flex-shrink:0;box-shadow:0 0 0 3px var(--bg),0 0 0 5px #915eff}
.profile-head h1{margin:6px 0 8px}
@media (max-width:560px){.profile-head{flex-direction:column;align-items:flex-start}}
.byline{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:14px;margin:0 0 40px}
.byline img{width:44px;height:44px;border-radius:50%;object-fit:cover;object-position:top}
.byline a{color:var(--heading);font-weight:600;text-decoration:none}
article{font-size:17px}
article h2{color:var(--heading);font-size:25px;line-height:1.3;margin:52px 0 12px}
article h3{color:var(--heading);font-size:19px;margin:34px 0 8px}
article p,article ul,article ol,article table{margin:0 0 20px}
article ul,article ol{padding-left:24px}
article li{margin:6px 0}
article strong{color:var(--heading)}
article blockquote{margin:0 0 20px;padding:4px 20px;border-left:3px solid #915eff;color:var(--muted)}
article code{font-family:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;font-size:.88em;background:var(--card-2);border:1px solid var(--border);border-radius:6px;padding:1px 6px}
article pre{background:var(--code-bg);border:1px solid var(--border);border-radius:14px;padding:16px 18px;overflow-x:auto;margin:0 0 24px;line-height:1.6}
article pre code{background:none;border:0;padding:0;font-size:14px;color:var(--code-text)}
article table{border-collapse:collapse;width:100%;font-size:15px;display:block;overflow-x:auto}
article th,article td{border:1px solid var(--border);padding:8px 12px;text-align:left}
article hr{border:0;border-top:1px solid var(--border);margin:40px 0}
.author{margin-top:56px;padding:24px;background:var(--card);border:1px solid var(--border);border-radius:20px;display:flex;gap:20px;align-items:center}
.author img{width:84px;height:84px;border-radius:50%;object-fit:cover;object-position:top;flex-shrink:0}
.author p{margin:0;color:var(--muted);font-size:15px}
.author strong{color:var(--heading)}
.more{margin-top:56px}
.more h2{color:var(--heading);font-size:22px;margin:0 0 16px}
.post-list{list-style:none;padding:0;margin:0;display:grid;gap:18px}
.card{display:block;background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;text-decoration:none;color:inherit;transition:transform .3s,box-shadow .3s,border-color .3s}
.card:hover{transform:translateY(-4px);border-color:rgba(145,94,255,.55);box-shadow:0 24px 60px -24px rgba(145,94,255,.55);color:inherit}
.card h3{color:var(--heading);font-size:21px;line-height:1.35;margin:12px 0 8px}
.card p{margin:0;color:var(--muted);font-size:15px}
.card .date{margin-top:12px;font-size:13px}
.site-footer{border-top:1px solid var(--border);color:var(--muted);font-size:14px}
.site-footer .wrap{max-width:1120px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;padding-top:24px;padding-bottom:32px}
.site-footer nav{display:flex;gap:20px}
.site-footer a{color:var(--muted);text-decoration:none}.site-footer a:hover{color:var(--heading)}
.read-progress{position:fixed;inset:0 0 auto;height:3px;z-index:20;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,#00cea8,#915eff,#bf61ff);animation:read-progress linear both;animation-timeline:scroll(root)}
@keyframes read-progress{to{transform:scaleX(1)}}
@supports not (animation-timeline:scroll()){.read-progress{display:none}}
.rise{animation:rise .7s cubic-bezier(.2,.7,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(16px)}}
.lamp-slot{position:relative;width:56px;height:36px;flex-shrink:0;pointer-events:none;user-select:none}
.lamp{position:absolute;left:0;top:-20px;width:56px;transform-origin:top center}
.lamp svg{display:block;overflow:visible}
.lamp-bulb{fill:var(--lamp-bulb);transition:fill .4s,filter .4s}
:root[data-theme="light"] .lamp-bulb{filter:drop-shadow(0 0 6px #ffd34d)}
.lamp-glow{opacity:var(--lamp-glow);transition:opacity .5s}
.lamp-cord{position:absolute;left:30px;top:46px;width:24px;height:100px;overflow:hidden}
.lamp-cord button{pointer-events:auto;position:absolute;left:0;top:-40px;width:24px;height:86px;display:flex;flex-direction:column;align-items:center;background:none;border:0;padding:0;cursor:grab;touch-action:none;outline:none}
.lamp-cord button:active{cursor:grabbing}
.lamp-line{width:2px;height:70px;border-radius:2px;background:var(--lamp-cord)}
.lamp-bead{width:12px;height:12px;margin-top:-1px;border-radius:50%;background:#915eff;box-shadow:0 0 0 2px rgba(201,179,255,.4);transition:transform .2s,box-shadow .2s}
.lamp-cord button:hover .lamp-bead{transform:scale(1.25)}
.lamp-cord button:focus-visible .lamp-bead{box-shadow:0 0 0 4px rgba(145,94,255,.6)}
.lamp.swing{animation:lamp-swing 1.4s ease-out}
@keyframes lamp-swing{20%{transform:rotate(7deg)}40%{transform:rotate(-5deg)}60%{transform:rotate(3deg)}80%{transform:rotate(-1.5deg)}}
@media (max-width:640px){.site-nav .optional{display:none}.header-right{gap:16px}.site-nav{gap:16px}.author{flex-direction:column;align-items:flex-start}}
@media (prefers-reduced-motion:reduce){.rise,.lamp.swing{animation:none}body,.card{transition:none}}
`

const LAMP = `<div class="lamp-slot"><div class="lamp">
<svg width="56" height="64" viewBox="0 0 56 64" aria-hidden="true"><defs><linearGradient id="lamp-shade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b08cff"/><stop offset="1" stop-color="#6a3be0"/></linearGradient><radialGradient id="lamp-light"><stop offset="0" stop-color="#ffe9a6" stop-opacity=".9"/><stop offset=".45" stop-color="#ffd96b" stop-opacity=".35"/><stop offset="1" stop-color="#ffd96b" stop-opacity="0"/></radialGradient></defs><circle class="lamp-glow" cx="28" cy="50" r="26" fill="url(#lamp-light)"/><line x1="28" y1="0" x2="28" y2="20" stroke="var(--lamp-cable)" stroke-width="2"/><rect x="23" y="17" width="10" height="8" rx="2" fill="var(--lamp-cable)"/><circle class="lamp-bulb" cx="28" cy="47" r="6"/><path d="M21 24h14l15 21c-6 4-38 4-44 0z" fill="url(#lamp-shade)"/><path d="M7 45c6 3.2 36 3.2 42 0" stroke="#d9c8ff" stroke-opacity=".6" stroke-width="1.5" fill="none"/></svg>
<div class="lamp-cord"><button type="button" role="switch" aria-checked="false" aria-label="Light mode" data-lamp><span class="lamp-line"></span><span class="lamp-bead"></span></button></div>
</div></div>`

function page({ title, description, canonical, ogType, head = '', body, current }) {
  const navLink = (href, label, extra = '') =>
    `<a href="${href}"${extra}${current === href ? ' aria-current="page"' : ''}>${label}</a>`
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#050816">
<script>${themeScript}</script>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="author" content="Jagrat Arora">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Jagrat Arora">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${SITE}/og-image.jpg">
${head}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap">
<style>${STYLES.trim()}</style>
</head>
<body>
<header class="site-header"><div class="wrap">
<a class="brand" href="/"><img src="/apple-touch-icon.png" alt="" width="34" height="34">Jagrat Arora</a>
<div class="header-right">${LAMP}
<nav class="site-nav" aria-label="Main">${navLink('/#about', 'About', ' class="optional"')}${navLink('/#work', 'Work', ' class="optional"')}${navLink('/blog', 'Blog')}${navLink('/#contact', 'Contact')}</nav>
</div>
</div></header>
${body}
<footer class="site-footer"><div class="wrap">
<span>© ${new Date().getFullYear()} Jagrat Arora</span>
<nav aria-label="Profiles"><a href="/">Portfolio</a><a href="/about">About Jagrat</a><a href="https://www.linkedin.com/in/jagrat-arora-0b923024b/" rel="me noopener" target="_blank">LinkedIn</a><a href="https://github.com/JagratArora1" rel="me noopener" target="_blank">GitHub</a></nav>
</div></footer>
<script src="/blog/theme.js" defer></script>
</body>
</html>
`
}

const postCard = (post, headingLevel = 'h3') => `<li><a class="card" href="/blog/${post.slug}">
<span class="chip">${escapeHtml(post.topic)}</span>
<${headingLevel}>${escapeHtml(post.title)}</${headingLevel}>
<p>${escapeHtml(post.description)}</p>
<p class="date"><time datetime="${post.date}">${formatDate(post.date)}</time> · ${post.minutes} min read</p>
</a></li>`

const AUTHOR = `<aside class="author">
<img src="/jagrat-arora.jpg" alt="Jagrat Arora" width="84" height="84" loading="lazy">
<p><strong>Jagrat Arora</strong> is a full-stack software developer at Quikkred in Faridabad, India, building secure fintech products for web and mobile. Jagrat writes about end-to-end encryption, security and AI. <a href="/about">More about Jagrat</a></p>
</aside>`

// --- Write the pages ----------------------------------------------------------
fs.mkdirSync(path.join(dist, 'blog'), { recursive: true })
fs.copyFileSync(path.join(root, 'scripts', 'blog', 'theme.js'), path.join(dist, 'blog', 'theme.js'))

for (const post of posts) {
  const others = posts.filter((other) => other.slug !== post.slug)
  const body = `<div class="read-progress" aria-hidden="true"></div>
<main class="wrap rise">
<span class="chip">${escapeHtml(post.topic)}</span>
<h1>${escapeHtml(post.title)}</h1>
<p class="byline"><img src="/jagrat-arora.jpg" alt="" width="44" height="44"><span>By <a href="/">Jagrat Arora</a> · <time datetime="${post.date}">${formatDate(post.date)}</time> · ${post.minutes} min read</span></p>
<article>
${post.html}
</article>
${AUTHOR}
<section class="more"><h2>More from the blog</h2><ul class="post-list">${others.map((other) => postCard(other)).join('\n')}</ul></section>
</main>`

  const head = jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${post.url}#post`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        inLanguage: 'en',
        url: post.url,
        mainEntityOfPage: post.url,
        image: `${SITE}/og-image.jpg`,
        articleSection: post.topic,
        author: { '@type': 'Person', '@id': PERSON_ID, name: 'Jagrat Arora', url: `${SITE}/` },
        publisher: { '@id': PERSON_ID },
        isPartOf: { '@id': `${SITE}/blog#blog` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: post.url },
        ],
      },
    ],
  }) + `\n<meta property="article:published_time" content="${post.date}">\n<meta property="article:author" content="${SITE}/">`

  fs.writeFileSync(
    path.join(dist, 'blog', `${post.slug}.html`),
    page({
      title: `${post.title} | Jagrat Arora`,
      description: post.description,
      canonical: post.url,
      ogType: 'article',
      head,
      body,
      current: '/blog',
    }),
  )
}

const indexDescription =
  'Articles by Jagrat Arora on end-to-end encryption and AI: how secure messaging, large language models and AI agents work, for developers.'
fs.writeFileSync(
  path.join(dist, 'blog.html'),
  page({
    title: 'Blog | Jagrat Arora',
    description: indexDescription,
    canonical: `${SITE}/blog`,
    ogType: 'website',
    current: '/blog',
    head: jsonLd({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${SITE}/blog#blog`,
      url: `${SITE}/blog`,
      name: 'Jagrat Arora – Blog',
      description: indexDescription,
      inLanguage: 'en',
      author: { '@type': 'Person', '@id': PERSON_ID, name: 'Jagrat Arora', url: `${SITE}/` },
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        '@id': `${post.url}#post`,
        headline: post.title,
        url: post.url,
        datePublished: post.date,
      })),
    }),
    body: `<main class="wrap rise">
<h1>Blog</h1>
<p class="lead">Notes on building secure software and working with AI, from my work as a full-stack developer: how end-to-end encryption works, how large language models and AI agents work, and what to watch out for when you build with them.</p>
<ul class="post-list" style="margin-top:40px">${posts.map((post) => postCard(post, 'h2')).join('\n')}</ul>
</main>`,
  }),
)

// --- About page ---------------------------------------------------------------
// A plain, factual profile written in the third person, so search engines and
// AI assistants can quote it directly when someone asks about Jagrat Arora.
const aboutRaw = fs.readFileSync(path.join(root, 'content', 'about.md'), 'utf8').replace(/\r\n/g, '\n')
const aboutMatch = aboutRaw.match(/^---\n([\s\S]*?)\n---\n/)
if (!aboutMatch) throw new Error('build-pages: content/about.md has no front matter')
const about = {}
for (const line of aboutMatch[1].split('\n')) {
  const colon = line.indexOf(':')
  if (colon > 0) about[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
}
for (const key of ['title', 'description', 'updated']) {
  if (!about[key]) throw new Error(`build-pages: content/about.md is missing "${key}"`)
}
const postList = posts.map((post) => `- [${post.title}](${post.url}): ${post.description}`).join('\n')
const aboutMarkdown = aboutRaw.slice(aboutMatch[0].length).replace('{{posts}}', postList)
const aboutIntro = aboutMarkdown.split('\n\n')[0]
const section = (heading) =>
  aboutMarkdown.match(new RegExp(`## ${heading}\\n\\n([\\s\\S]*?)(?=\\n## |$)`))?.[1].trim() ?? ''
const plainText = (markdown) => markdown.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '')
const faqs = [...section('Frequently asked questions').matchAll(/### (.+)\n\n([\s\S]*?)(?=\n### |$)/g)].map(
  ([, question, answer]) => ({ question: question.trim(), answer: plainText(answer.trim()) }),
)
if (faqs.length === 0) throw new Error('build-pages: no FAQs found in content/about.md')

fs.writeFileSync(
  path.join(dist, 'about.html'),
  page({
    title: about.title,
    description: about.description,
    canonical: `${SITE}/about`,
    ogType: 'profile',
    current: '/about',
    head: jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': `${SITE}/about#page`,
          url: `${SITE}/about`,
          name: about.title,
          description: about.description,
          inLanguage: 'en',
          dateModified: about.updated,
          isPartOf: { '@id': `${SITE}/#website` },
          mainEntity: { '@id': PERSON_ID },
        },
        {
          '@type': 'Person',
          '@id': PERSON_ID,
          name: 'Jagrat Arora',
          url: `${SITE}/`,
          image: `${SITE}/jagrat-arora.jpg`,
          jobTitle: 'Software Developer',
          description: plainText(aboutIntro),
          worksFor: { '@type': 'Organization', name: 'Quikkred', url: 'https://www.quikkred.in/' },
          homeLocation: { '@type': 'Place', name: 'Faridabad, Haryana, India' },
          sameAs: ['https://www.linkedin.com/in/jagrat-arora-0b923024b/', 'https://github.com/JagratArora1'],
        },
        {
          '@type': 'FAQPage',
          '@id': `${SITE}/about#faq`,
          mainEntity: faqs.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE}/about` },
          ],
        },
      ],
    }),
    body: `<main class="wrap rise">
<div class="profile-head">
<img src="/jagrat-arora.jpg" alt="Jagrat Arora" width="128" height="128">
<div><span class="chip">About</span><h1>Jagrat Arora</h1><p class="lead">Full-stack software developer at Quikkred · Faridabad, India</p></div>
</div>
<article>
${marked.parse(aboutMarkdown)}
</article>
</main>`,
  }),
)

// --- Files for AI assistants (https://llmstxt.org/) --------------------------
// Markdown copies of the posts, a short llms.txt that points to everything,
// and llms-full.txt with the full text in one file.
for (const post of posts) {
  fs.writeFileSync(
    path.join(dist, 'blog', `${post.slug}.md`),
    `# ${post.title}\n\n> ${post.description}\n\nBy Jagrat Arora · ${formatDate(post.date)} · ${post.url}\n\n${post.markdown.trim()}\n`,
  )
}

fs.writeFileSync(
  path.join(dist, 'llms.txt'),
  `# Jagrat Arora

> ${plainText(aboutIntro)}

${section('Quick facts')}

## Pages

- [Portfolio](${SITE}/): projects, work experience, skills and a contact form
- [About Jagrat Arora](${SITE}/about): full profile, work history, projects and frequently asked questions
- [Blog](${SITE}/blog): articles on end-to-end encryption and AI

## Articles

${posts.map((post) => `- [${post.title}](${post.url}.md): ${post.description}`).join('\n')}

## Optional

- [Full text of the profile and all articles](${SITE}/llms-full.txt)
`,
)

fs.writeFileSync(
  path.join(dist, 'llms-full.txt'),
  [
    `# Jagrat Arora\n\nSource: ${SITE}/about\n\n${aboutMarkdown.trim()}`,
    ...posts.map(
      (post) =>
        `# ${post.title}\n\nBy Jagrat Arora · ${formatDate(post.date)} · ${post.url}\n\n${post.markdown.trim()}`,
    ),
  ].join('\n\n---\n\n') + '\n',
)

// --- Sitemap ------------------------------------------------------------------
const sitemapFile = path.join(dist, 'sitemap.xml')
const sitemap = fs.readFileSync(sitemapFile, 'utf8')
const newest = posts.reduce((latest, post) => ((post.updated || post.date) > latest ? post.updated || post.date : latest), '')
const entries = [
  `  <url>\n    <loc>${SITE}/about</loc>\n    <lastmod>${about.updated}</lastmod>\n  </url>`,
  `  <url>\n    <loc>${SITE}/blog</loc>\n    <lastmod>${newest}</lastmod>\n  </url>`,
  ...posts.map((post) => `  <url>\n    <loc>${post.url}</loc>\n    <lastmod>${post.updated || post.date}</lastmod>\n  </url>`),
].join('\n')
fs.writeFileSync(sitemapFile, sitemap.replace('</urlset>', `${entries}\n</urlset>`))

console.log(
  `build-pages: wrote ${posts.length} posts, the blog index, the about page (${faqs.length} FAQs), llms.txt, llms-full.txt and ${posts.length + 2} sitemap entries`,
)
