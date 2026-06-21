import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import docsPlugin from './src/plugins/vite-plugin-docs'
import blogPlugin from './src/plugins/vite-plugin-blog'

export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    docsPlugin('./docs-content'),
    blogPlugin('./blog-content'),
  ],
})
