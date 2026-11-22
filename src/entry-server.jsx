// Build-time entry: renders the app to static HTML (see scripts/prerender.js),
// so search engines and link-preview bots get the real content without
// having to run JavaScript. The browser then hydrates it via src/main.jsx.
import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import App from './App.jsx'

// `prerender` (unlike renderToString) waits for lazy-loaded parts such as the
// 3D canvases, so the HTML matches what the browser hydrates.
export async function render() {
  const { prelude } = await prerender(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  return new Response(prelude).text()
}
