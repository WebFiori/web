<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-php'
import docs from 'virtual:docs'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const doc = computed(() => docs[slug.value])
const contentEl = ref<any>()

const sidebar = computed(() =>
  Object.entries(docs)
    .filter(([k]) => k !== 'index')
    .map(([k, v]) => ({ slug: k, title: v.title }))
    .sort((a, b) => a.title.localeCompare(b.title))
)

function highlightAndAddCopyButtons() {
  const el = contentEl.value?.$el || contentEl.value
  if (!el || !el.querySelectorAll) return

  el.querySelectorAll('pre code').forEach((block: Element) => {
    // Detect language from class or content
    const classes = block.className || ''
    let lang = 'markup'
    if (classes.includes('php') || block.textContent?.includes('<?php') || block.textContent?.includes('namespace ') || block.textContent?.includes('$')) lang = 'php'
    else if (classes.includes('bash') || classes.includes('shell') || block.textContent?.match(/^\s*(composer |php |cd |npm |git )/m)) lang = 'bash'
    else if (classes.includes('json') || block.textContent?.trim().startsWith('{')) lang = 'json'
    else if (classes.includes('html') || classes.includes('markup')) lang = 'markup'

    const grammar = Prism.languages[lang]
    if (grammar) {
      block.innerHTML = Prism.highlight(block.textContent || '', grammar, lang)
    }

    // Add copy button to parent <pre>
    const pre = block.parentElement
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

watch(slug, () => nextTick(highlightAndAddCopyButtons), { immediate: true })
// Also run after initial render
watch(contentEl, () => nextTick(highlightAndAddCopyButtons))
</script>

<template>
  <v-container fluid class="py-6">
    <v-row>
      <!-- Sidebar -->
      <v-col cols="12" md="3">
        <v-card variant="outlined" class="sticky-sidebar">
          <v-list density="compact" nav>
            <v-list-item to="/docs" title="Overview" prepend-icon="mdi-home" exact />
            <v-divider class="my-1" />
            <v-list-item
              v-for="item in sidebar"
              :key="item.slug"
              :to="`/docs/${item.slug}`"
              :title="item.title"
              :active="slug === item.slug"
            />
          </v-list>
        </v-card>
      </v-col>

      <!-- Content -->
      <v-col cols="12" md="9">
        <v-card v-if="doc" variant="flat">
          <div class="d-flex justify-end px-4 pt-3 ga-1">
            <v-btn
              :href="`https://github.com/WebFiori/docs/blob/main/${slug}.md`"
              target="_blank"
              variant="text"
              size="small"
              prepend-icon="mdi-file-document-outline"
            >
              View source
            </v-btn>
            <v-btn
              :href="`https://github.com/WebFiori/docs/edit/main/${slug}.md`"
              target="_blank"
              variant="text"
              size="small"
              prepend-icon="mdi-pencil"
            >
              Edit this page
            </v-btn>
          </div>
          <v-card-text ref="contentEl" class="doc-content" v-html="doc.html" />
        </v-card>
        <v-alert v-else type="warning" variant="tonal">
          Documentation page not found.
          <template #append>
            <v-btn to="/docs" variant="text" size="small">Back to Docs</v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.sticky-sidebar {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* Copy button */
.doc-copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: 1px solid rgba(128,128,128,0.3);
  border-radius: 6px;
  padding: 4px 6px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  color: inherit;
  display: flex;
  align-items: center;
}
.doc-content pre:hover .doc-copy-btn { opacity: 1; }

/* Typography */
.doc-content h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; }
.doc-content h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; }
.doc-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
.doc-content p { margin-bottom: 1rem; line-height: 1.7; }
.doc-content ul, .doc-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
.doc-content li { margin-bottom: 0.25rem; }
.doc-content a { color: rgb(var(--v-theme-primary)); }
.doc-content img { max-width: 100%; border-radius: 8px; margin: 1rem 0; }

/* Inline code */
.doc-content code {
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}
.v-theme--dark .doc-content code { background: #132613; color: #cdd6f4; }
.v-theme--light .doc-content code { background: #f5f5f5; color: #1e1e1e; }

/* Code blocks */
.doc-content pre {
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}
.v-theme--dark .doc-content pre { background: #132613; }
.v-theme--light .doc-content pre { background: #f5f5f5; }
.doc-content pre code { padding: 0; background: none; }

/* Prism token colors - dark */
.v-theme--dark .doc-content .token.comment, .v-theme--dark .doc-content .token.prolog { color: #6c7086; }
.v-theme--dark .doc-content .token.keyword { color: #cba6f7; }
.v-theme--dark .doc-content .token.function { color: #89b4fa; }
.v-theme--dark .doc-content .token.string { color: #a6e3a1; }
.v-theme--dark .doc-content .token.number { color: #fab387; }
.v-theme--dark .doc-content .token.operator { color: #89dceb; }
.v-theme--dark .doc-content .token.class-name { color: #f9e2af; }
.v-theme--dark .doc-content .token.punctuation { color: #bac2de; }
.v-theme--dark .doc-content .token.variable { color: #f38ba8; }
.v-theme--dark .doc-content .token.tag { color: #f38ba8; }
.v-theme--dark .doc-content .token.attr-name { color: #fab387; }
.v-theme--dark .doc-content .token.attr-value { color: #a6e3a1; }

/* Prism token colors - light */
.v-theme--light .doc-content .token.comment, .v-theme--light .doc-content .token.prolog { color: #6a737d; }
.v-theme--light .doc-content .token.keyword { color: #7c3aed; }
.v-theme--light .doc-content .token.function { color: #0277bd; }
.v-theme--light .doc-content .token.string { color: #2e7d32; }
.v-theme--light .doc-content .token.number { color: #e65100; }
.v-theme--light .doc-content .token.operator { color: #0097a7; }
.v-theme--light .doc-content .token.class-name { color: #f57f17; }
.v-theme--light .doc-content .token.punctuation { color: #37474f; }
.v-theme--light .doc-content .token.variable { color: #c62828; }
.v-theme--light .doc-content .token.tag { color: #c62828; }
.v-theme--light .doc-content .token.attr-name { color: #e65100; }
.v-theme--light .doc-content .token.attr-value { color: #2e7d32; }

/* Other elements */
.doc-content blockquote {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  opacity: 0.85;
}
.doc-content table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
.doc-content th, .doc-content td { border: 1px solid rgba(128,128,128,0.3); padding: 0.5rem; }
.doc-content th { font-weight: 600; }
</style>
