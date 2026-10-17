import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const pageFile = fileURLToPath(new URL('./src/content/page.html', import.meta.url))
const ORIGIN = 'https://clublaavenida.com.mx'
const servicePages = {
  lavados: {
    title: 'Lavados | Club de Autolavado La Avenida',
    desc: 'Lavado Express, Completo y Deluxe en Campestre, Yucatán. El precio cambia según tu vehículo. Lunes a sábado de 8:00 AM a 5:00 PM',
  },
  adicionales: {
    title: 'Servicios adicionales | Club de Autolavado La Avenida',
    desc: 'Quince servicios de detallado, interiores y ceras en Campestre, Yucatán. Súmalos al lavado y ve el total según tu vehículo.',
  },
}

function serviceHtml(html, name, meta) {
  const url = `${ORIGIN}/${name}`
  let out = html
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
  out = out.replace(/(<meta name="description" content=")[^"]*(")/, `$1${meta.desc}$2`)
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  out = out.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${meta.title}$2`)
  out = out.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${meta.desc}$2`)
  out = out.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  out = out.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${meta.title}$2`)
  out = out.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${meta.desc}$2`)
  out = out.replace('"url": "https://clublaavenida.com.mx/"', `"url": "${url}"`)
  out = out.replace('<main class="page" data-view="inicio">', '<main class="page" data-view="inicio" hidden>')
  out = out.replace(`<main class="page" data-view="${name}" hidden>`, `<main class="page" data-view="${name}">`)
  return out
}

export default defineConfig({
  plugins: [
    {
      name: 'inline-page',
      transformIndexHtml(html) {
        const page = readFileSync(pageFile, 'utf8')
        return html.replace('<!--app-->', page)
      },
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const path = (req.url || '').split('?')[0]
          if (path === '/lavados' || path === '/lavados/' || path === '/adicionales' || path === '/adicionales/') {
            const q = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
            req.url = '/' + q
          }
          next()
        })
        server.watcher.add(pageFile)
        server.watcher.on('change', (file) => {
          if (String(file).endsWith('page.html')) server.ws.send({ type: 'full-reload' })
        })
      },
      closeBundle() {
        const indexPath = join(process.cwd(), 'dist', 'index.html')
        const html = readFileSync(indexPath, 'utf8')
        for (const [name, meta] of Object.entries(servicePages)) {
          const file = join(process.cwd(), 'dist', name, 'index.html')
          mkdirSync(dirname(file), { recursive: true })
          writeFileSync(file, serviceHtml(html, name, meta))
        }
      },
    },
  ],
  server: { host: true },
})
