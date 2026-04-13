<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const drawer = ref(false)
const isDark = ref(true)

function toggleTheme() {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
}

const navItems = [
  { title: 'Home', to: '/', icon: 'mdi-home' },
  { title: 'Features', to: '/features', icon: 'mdi-star' },
  { title: 'Getting Started', to: '/getting-started', icon: 'mdi-rocket-launch' },
  { title: 'Documentation', to: '/docs', icon: 'mdi-book-open-variant' },
  { title: 'Libraries', to: '/libraries', icon: 'mdi-package-variant-closed' },
  { title: 'Contributing', to: '/contributing', icon: 'mdi-handshake' },
]
</script>

<template>
  <v-app>
    <v-app-bar elevation="2" color="surface">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" aria-label="Toggle navigation menu" />
      <v-toolbar-title>
        <router-link to="/" class="text-decoration-none d-flex align-center" style="color: inherit">
          <img src="/favicon.png" alt="WebFiori logo" style="height: 32px; width: 32px" class="mr-2" />
          <span class="font-weight-bold">WebFiori</span>
        </router-link>
      </v-toolbar-title>
      <template v-slot:append>
        <div class="d-none d-md-flex align-center">
          <v-btn v-for="item in navItems" :key="item.to" :to="item.to" variant="text" size="small">
            {{ item.title }}
          </v-btn>
        </div>
        <v-btn :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="toggleTheme" variant="text" :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'" />
        <v-btn icon="mdi-github" href="https://github.com/WebFiori/framework" target="_blank" variant="text" aria-label="GitHub repository" />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item v-for="item in navItems" :key="item.to" :to="item.to" :prepend-icon="item.icon" :title="item.title" @click="drawer = false" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer class="bg-surface pa-6">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <div class="text-h6 mb-2">WebFiori Framework</div>
            <div class="text-body-2 text-medium-emphasis">A PHP web development framework. Lightweight, flexible, and developer-friendly.</div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2">Links</div>
            <div><a href="https://github.com/WebFiori/framework" target="_blank" class="text-primary text-decoration-none">GitHub</a></div>
            <div><a href="https://packagist.org/packages/webfiori/framework" target="_blank" class="text-primary text-decoration-none">Packagist</a></div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2">License</div>
            <div class="text-body-2 text-medium-emphasis">MIT License</div>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <div class="text-center text-body-2 text-medium-emphasis">&copy; {{ new Date().getFullYear() }} WebFiori. All rights reserved.</div>
      </v-container>
    </v-footer>
  </v-app>
</template>
