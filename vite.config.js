import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const pageFile = fileURLToPath(new URL('./src/content/page.html', import.meta.url))

export default defineConfig({
  plugins: [
    {
      name: 'inline-page',
      transformIndexHtml(html) {
        const page = readFileSync(pageFile, 'utf8')
        return html.replace('<!--app-->', page)
      },
      configureServer(server) {
        server.watcher.add(pageFile)
        server.watcher.on('change', (file) => {
          if (String(file).endsWith('page.html')) server.ws.send({ type: 'full-reload' })
        })
      },
    },
  ],
  server: { host: true },
})
