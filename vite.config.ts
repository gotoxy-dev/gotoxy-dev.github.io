import { defineConfig, type Plugin } from 'vite'
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

/**
 * Static hosting (GitHub Pages) only serves files that exist. The app is a single page, so
 * every route listed in the sitemap gets a copy of index.html at its path (served with 200),
 * and 404.html is a copy too so any other deep link still boots the router.
 */
function staticRoutes(): Plugin {
  let outDir = 'dist'
  return {
    name: 'static-routes',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const index = join(outDir, 'index.html')
      copyFileSync(index, join(outDir, '404.html'))
      const sitemap = readFileSync(fileURLToPath(new URL('./public/sitemap.xml', import.meta.url)), 'utf8')
      for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        const path = new URL(loc).pathname.replace(/^\/+|\/+$/g, '')
        if (!path) continue
        mkdirSync(join(outDir, path), { recursive: true })
        copyFileSync(index, join(outDir, path, 'index.html'))
      }
    },
  }
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    staticRoutes(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
