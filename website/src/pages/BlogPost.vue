<script setup lang="ts">
import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-php'
import posts from 'virtual:blog'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const post = computed(() => posts[slug.value])
const contentEl = ref<any>()
const activeHeading = ref('')
const mobileTocOpen = ref(false)

// Chronological navigation
const sortedSlugs = computed(() =>
  Object.entries(posts)
    .sort((a, b) => b[1].date.localeCompare(a[1].date))
    .map(([s]) => s)
)
const currentIndex = computed(() => sortedSlugs.value.indexOf(slug.value))
const prevPost = computed(() => {
  const i = currentIndex.value
  const s = sortedSlugs.value[i + 1]
  const p = s ? posts[s] : undefined
  return p ? { slug: s!, title: p.title } : null
})
const nextPost = computed(() => {
  const i = currentIndex.value
  const s = sortedSlugs.value[i - 1]
  const p = s ? posts[s] : undefined
  return p ? { slug: s!, title: p.title } : null
})

function formatDate(date: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// TOC observer
let observer: IntersectionObserver | null = null

function observeHeadings() {
  observer?.disconnect()
  const el = contentEl.value?.$el || contentEl.value
  if (!el) return
  const headings = el.querySelectorAll('h2[id], h3[id]')
  if (!headings.length) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeHeading.value = entry.target.id
      }
    },
    { rootMargin: '0px 0px -70% 0px', threshold: 0.1 }
  )
  headings.forEach((h: Element) => observer!.observe(h))
}

onBeforeUnmount(() => observer?.disconnect())

function highlightAndAddCopyButtons() {
  const el = contentEl.value?.$el || contentEl.value
  if (!el || !el.querySelectorAll) return

  el.querySelectorAll('pre code').forEach((block: Element) => {
    const classes = block.className || ''
    const pre = block.parentElement
    const dataLang = pre?.getAttribute('data-lang') || ''
    let lang = 'markup'
    if (dataLang === 'php' || classes.includes('php') || block.textContent?.includes('<?php') || block.textContent?.includes('namespace ') || block.textContent?.includes('$')) lang = 'php'
    else if (dataLang === 'bash' || dataLang === 'shell' || classes.includes('bash') || block.textContent?.match(/^\s*(composer |php |cd |npm |git )/m)) lang = 'bash'
    else if (dataLang === 'json' || classes.includes('json') || block.textContent?.trim().startsWith('{')) lang = 'json'
    else if (classes.includes('html') || classes.includes('markup')) lang = 'markup'

    const grammar = Prism.languages[lang]
    if (grammar) {
      block.innerHTML = Prism.highlight(block.textContent || '', grammar, lang)
    }

    if (pre && !pre.querySelector('.doc-copy-btn')) {
      pre.style.position = 'relative'
      const btn = document.createElement('button')
      btn.className = 'doc-copy-btn'
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
      btn.title = 'Copy code'
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(block.textContent || '')
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
        setTimeout(() => {
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
        }, 1500)
      })
      pre.appendChild(btn)
    }
  })
}

watch(slug, () => { mobileTocOpen.value = false; nextTick(() => { highlightAndAddCopyButtons(); observeHeadings() }) }, { immediate: true })
watch(contentEl, () => nextTick(() => { highlightAndAddCopyButtons(); observeHeadings() }))
</script>

<template>
  <v-container fluid class="py-6">
    <v-row justify="center">
      <!-- Content -->
      <v-col cols="12" :md="post?.toc?.length ? 8 : 10" :lg="post?.toc?.length ? 7 : 8">
        <v-card v-if="post" variant="flat">
          <!-- Meta -->
          <div class="px-4 pt-4">
            <v-btn to="/blog" variant="text" size="small" prepend-icon="mdi-arrow-left" class="mb-3">All posts</v-btn>
            <div class="text-caption text-medium-emphasis mb-1">{{ formatDate(post.date) }}</div>
            <h1 class="text-h4 font-weight-bold mb-2">{{ post.title }}</h1>
            <div class="d-flex flex-wrap ga-1 mb-2">
              <v-chip
                v-for="tag in post.tags"
                :key="tag"
                :to="`/blog?tag=${tag}`"
                size="small"
                variant="tonal"
              >
                {{ tag }}
              </v-chip>
              <v-chip
                v-if="post.example"
                :href="post.example"
                target="_blank"
                size="small"
                variant="tonal"
                color="primary"
                prepend-icon="mdi-github"
              >
                Example app
              </v-chip>
            </div>
          </div>

          <!-- Mobile TOC -->
          <div v-if="post.toc?.length" class="d-md-none px-4 pt-2">
            <v-btn variant="tonal" size="small" block prepend-icon="mdi-table-of-contents" @click="mobileTocOpen = !mobileTocOpen">
              On this page
            </v-btn>
            <nav v-if="mobileTocOpen" class="toc-nav mt-2 mb-2">
              <a
                v-for="entry in post.toc"
                :key="entry.id"
                :href="`#${entry.id}`"
                class="toc-link text-body-2"
                :class="{ 'toc-h3': entry.level === 3, 'toc-active': activeHeading === entry.id }"
                @click="mobileTocOpen = false"
              >
                {{ entry.title }}
              </a>
            </nav>
          </div>

          <v-card-text ref="contentEl" class="doc-content" v-html="post.html" />

          <!-- Prev / Next -->
          <v-card-actions v-if="prevPost || nextPost" class="px-4 pb-4 pt-2">
            <v-btn v-if="prevPost" :to="`/blog/${prevPost.slug}`" variant="tonal" prepend-icon="mdi-arrow-left">
              {{ prevPost.title }}
            </v-btn>
            <v-spacer />
            <v-btn v-if="nextPost" :to="`/blog/${nextPost.slug}`" variant="tonal" append-icon="mdi-arrow-right">
              {{ nextPost.title }}
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-alert v-else type="warning" variant="tonal">
          Post not found.
          <template #append>
            <v-btn to="/blog" variant="text" size="small">Back to Blog</v-btn>
          </template>
        </v-alert>
      </v-col>

      <!-- TOC (desktop) -->
      <v-col v-if="post?.toc?.length" cols="12" md="3" lg="2" class="d-none d-md-block">
        <div class="sticky-sidebar">
          <div class="text-caption text-medium-emphasis font-weight-bold mb-2">ON THIS PAGE</div>
          <nav class="toc-nav">
            <a
              v-for="entry in post.toc"
              :key="entry.id"
              :href="`#${entry.id}`"
              class="toc-link text-body-2"
              :class="{ 'toc-h3': entry.level === 3, 'toc-active': activeHeading === entry.id }"
            >
              {{ entry.title }}
            </a>
          </nav>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
