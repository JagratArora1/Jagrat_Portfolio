import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb', '**/*.gltf'], // For Three.js models
  // The prerender bundle (src/entry-server.jsx) runs in Node at build time.
  // Bundling its dependencies avoids Node failing on browser-style imports.
  ssr: { noExternal: true },
  build: { copyPublicDir: !isSsrBuild },
}))
