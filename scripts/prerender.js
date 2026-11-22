// Runs after `vite build` (see the "build" script in package.json).
// Renders the app with the server bundle from dist-server/ and injects the HTML
// into dist/index.html, so the deployed page contains its content up front.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const serverDir = path.join(root, 'dist-server')
const indexFile = path.join(root, 'dist', 'index.html')
const marker = '<div id="root"></div>'

const { render } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)

const template = fs.readFileSync(indexFile, 'utf8')
if (!template.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`)
}

const appHtml = await render()
fs.writeFileSync(indexFile, template.replace(marker, () => `<div id="root">${appHtml}</div>`))
fs.rmSync(serverDir, { recursive: true, force: true })

console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`)
