<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import posts from 'virtual:blog'

const route = useRoute()
const router = useRouter()
const searchQuery = ref((route.query.q as string) || '')
const selectedTag = ref((route.query.tag as string) || '')

// Collect tags only from published posts
const allTags = computed(() => {
  const tags = new Set<string>()
  for (const post of sortedPosts.value) {
    post.tags.forEach(t => tags.add(t))
  }
  return Array.from(tags).sort()
})

// Sort posts by date (newest first), exclude future posts
const sortedPosts = computed(() => {
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return Object.entries(posts)
    .map(([slug, post]) => ({ slug, ...post }))
    .filter(p => p.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date))
})

// Filter posts
const filteredPosts = computed(() => {
  let result = sortedPosts.value

  if (selectedTag.value) {
    result = result.filter(p => p.tags.includes(selectedTag.value))
  }

  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  return result
})

function toggleTag(tag: string) {
  selectedTag.value = selectedTag.value === tag ? '' : tag
  updateQuery()
}

function updateQuery() {
  const query: Record<string, string> = {}
  if (selectedTag.value) query.tag = selectedTag.value
  if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
  router.replace({ query })
}

function formatDate(date: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <v-container class="py-8" style="max-width: 900px;">
    <h1 class="text-h3 font-weight-bold mb-2">Blog</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">Technical posts about WebFiori framework features and best practices.</p>

    <!-- Search -->
    <v-text-field
      v-model="searchQuery"
      placeholder="Search posts..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="compact"
      hide-details
      clearable
      class="mb-4"
      @update:model-value="updateQuery"
    />

    <!-- Tags -->
    <div class="mb-6 d-flex flex-wrap ga-2">
      <v-chip
        v-for="tag in allTags"
        :key="tag"
        :color="selectedTag === tag ? 'primary' : undefined"
        :variant="selectedTag === tag ? 'flat' : 'outlined'"
        size="small"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </v-chip>
    </div>

    <!-- Posts -->
    <div v-if="filteredPosts.length">
      <v-card
        v-for="post in filteredPosts"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        variant="outlined"
        class="mb-4 pa-4"
        hover
      >
        <div class="text-caption text-medium-emphasis mb-1">{{ formatDate(post.date) }}</div>
        <div class="text-h6 font-weight-bold mb-1">{{ post.title }}</div>
        <div class="text-body-2 text-medium-emphasis mb-2">{{ post.summary }}</div>
        <div class="d-flex flex-wrap ga-1">
          <v-chip v-for="tag in post.tags" :key="tag" size="x-small" variant="tonal">{{ tag }}</v-chip>
        </div>
      </v-card>
    </div>
    <v-alert v-else type="info" variant="tonal">
      No posts found.
    </v-alert>
  </v-container>
</template>
