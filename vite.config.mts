import { defineConfig } from '@solidjs/start/config'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [UnoCSS()],
  ssr: {
    noExternal: ['@kobalte/core']
  },
  start: {
    server: {
      preset: 'cloudflare_module',
      rollupConfig: {
        external: ['__STATIC_CONTENT_MANIFEST', 'node:async_hooks']
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
