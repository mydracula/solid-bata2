import { defineConfig, presetUno } from 'unocss'
import { presetKobalte } from 'unocss-preset-primitives'

export default defineConfig({
  presets: [presetUno(), presetKobalte(/* options */)],
})
