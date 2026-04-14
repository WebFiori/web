<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import docs from 'virtual:docs'

const theme = useTheme()
const route = useRoute()
const router = useRouter()
const drawer = ref(false)
const isDark = ref(true)
const searchQuery = ref('')

const isDocsRoute = computed(() => route.path.startsWith('/docs'))

const searchResults = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return []
  const results: { slug: string; title: string; snippet: string }[] = []
  for (const [slug, doc] of Object.entries(docs)) {
    if (slug === 'index') continue
    const titleMatch = doc.title.toLowerCase().includes(q)
    const textIdx = doc.text.toLowerCase().indexOf(q)
    if (!titleMatch && textIdx === -1) continue
    let snippet = ''
    if (textIdx !== -1) {
      const start = Math.max(0, textIdx - 40)
      const end = Math.min(doc.text.length, textIdx + q.length + 40)
      snippet = (start > 0 ? '...' : '') + doc.text.slice(start, end) + (end < doc.text.length ? '...' : '')
    }
    results.push({ slug, title: doc.title, snippet })
    if (results.length >= 10) break
  }
  return results
})

function goToResult(slug: string) {
  searchQuery.value = ''
  router.push(`/docs/${slug}`)
}

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

        <!-- Docs search -->
        <div v-if="isDocsRoute" style="position: relative;">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search docs..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            style="width: 220px;"
          />
          <v-menu
            :model-value="!!searchQuery?.trim()"
            activator="parent"
            :close-on-content-click="false"
            location="bottom end"
            offset="4"
            max-height="400"
            width="360"
          >
            <v-list v-if="searchResults.length" density="compact">
              <v-list-item
                v-for="r in searchResults"
                :key="r.slug"
                @click="goToResult(r.slug)"
              >
                <v-list-item-title class="text-body-2 font-weight-medium">{{ r.title }}</v-list-item-title>
                <v-list-item-subtitle v-if="r.snippet" class="text-caption text-truncate">{{ r.snippet }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-card v-else>
              <v-card-text class="text-body-2 text-medium-emphasis">No results found.</v-card-text>
            </v-card>
          </v-menu>
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

