import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import './style.css'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#4CAF50',
          secondary: '#81C784',
          accent: '#C0CA33',
          surface: '#1A2E1A',
          background: '#0F1F0F',
        },
      },
      light: {
        colors: {
          primary: '#2E7D32',
          secondary: '#388E3C',
          accent: '#9E9D24',
          surface: '#FFFFFF',
          background: '#F1F8E9',
        },
      },
    },
  },
})

createApp(App).use(vuetify).use(router).mount('#app')
