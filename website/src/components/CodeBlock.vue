<script setup lang="ts">
import { computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-php'
import { useTheme } from 'vuetify'

const props = withDefaults(defineProps<{ code: string; language?: string }>(), { language: 'php' })
const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')

const highlighted = computed(() => {
  const grammar = Prism.languages[props.language]
  if (!grammar) return props.code
  return Prism.highlight(props.code, grammar, props.language)
})
</script>

<template>
  <v-card :variant="isDark ? 'tonal' : 'outlined'" :class="isDark ? 'prism-dark' : 'prism-light'" class="code-block my-3">
    <v-card-text class="pa-4" style="overflow-x: auto">
      <pre class="ma-0"><code :class="`language-${language}`" v-html="highlighted"></code></pre>
    </v-card-text>
  </v-card>
</template>

<style>
.prism-dark { background-color: #132613 !important; }
.prism-dark code, .prism-dark pre { color: #cdd6f4; }
.prism-dark .token.comment, .prism-dark .token.prolog { color: #6c7086; }
.prism-dark .token.keyword { color: #cba6f7; }
.prism-dark .token.function { color: #89b4fa; }
.prism-dark .token.string { color: #a6e3a1; }
.prism-dark .token.number { color: #fab387; }
.prism-dark .token.operator { color: #89dceb; }
.prism-dark .token.class-name { color: #f9e2af; }
.prism-dark .token.punctuation { color: #bac2de; }
.prism-dark .token.variable { color: #f38ba8; }
.prism-dark .token.tag { color: #f38ba8; }
.prism-dark .token.attr-name { color: #fab387; }
.prism-dark .token.attr-value { color: #a6e3a1; }

.prism-light { background-color: #f5f5f5 !important; }
.prism-light code, .prism-light pre { color: #1e1e1e; }
.prism-light .token.comment, .prism-light .token.prolog { color: #6a737d; }
.prism-light .token.keyword { color: #7c3aed; }
.prism-light .token.function { color: #0277bd; }
.prism-light .token.string { color: #2e7d32; }
.prism-light .token.number { color: #e65100; }
.prism-light .token.operator { color: #0097a7; }
.prism-light .token.class-name { color: #f57f17; }
.prism-light .token.punctuation { color: #37474f; }
.prism-light .token.variable { color: #c62828; }
.prism-light .token.tag { color: #c62828; }
.prism-light .token.attr-name { color: #e65100; }
.prism-light .token.attr-value { color: #2e7d32; }

.code-block pre { margin: 0; white-space: pre-wrap; word-wrap: break-word; }
</style>
