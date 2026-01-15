import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    {
      name: 'oldborderscup-dev-index-rewrite',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url || ''
          const [pathname, search] = url.split('?')
          if (pathname === '/oldborderscup' || pathname === '/oldborderscup/') {
            req.url = `/oldborderscup/index.html${search ? `?${search}` : ''}`
          }
          next()
        })
      },
    },
    react(),
  ],
  // Custom domain deployment
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
