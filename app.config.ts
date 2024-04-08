import { defineConfig } from '@solidjs/start/config'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  vite: {
    plugins: [UnoCSS()],
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  },
  server: {
    // preset: 'node-server'
    preset: 'netlify_edge'
  }
})
