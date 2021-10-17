import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import IconsResolver from 'unplugin-icons/resolver'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Icons({}),
    Components({
      resolvers: [
        IconsResolver({
          prefix: 'i'
        }),
        NaiveUiResolver()
      ]
    }),
  ]
})
