// Tells Bing (and the other IndexNow search engines: Yandex, Seznam, Naver…)
// that the site's pages are new or changed, so they are crawled within hours
// instead of whenever the crawler next comes by. Bing's index is what ChatGPT
// search and Microsoft Copilot use for live answers.
//
// Run it after a deploy that adds or changes pages:
//   node scripts/indexnow.js
//
// It submits every URL in the live sitemap. The key is public by design: the
// search engines check that https://www.jagratarora.com/<key>.txt contains it,
// which proves the submission comes from the site's owner.
const SITE = 'https://www.jagratarora.com'
const KEY = '5e3335672aeebf83e083157a2bdba79a' // public/<KEY>.txt

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text()
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith(SITE))

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
})

console.log(`IndexNow: HTTP ${response.status} for ${urlList.length} URLs`)
for (const url of urlList) console.log(`  ${url}`)
// 200 = accepted, 202 = accepted and the key is still being checked.
if (response.status !== 200 && response.status !== 202) {
  console.error(await response.text())
  process.exit(1)
}
