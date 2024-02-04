import { defineConfig } from '@solidjs/start/config'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  base: './solid-bata2',
  plugins: [UnoCSS()],
  ssr: {
    noExternal: ['@kobalte/core']
  },
  start: {
    server: {
      preset: 'github_pages'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
