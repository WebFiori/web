<script setup lang="ts">
import docs, { nav } from 'virtual:docs'

// Navigation is derived from the docs repo's index.md at build time (see
// vite-plugin-docs). Adding or reordering pages there updates this page
// automatically, with no changes needed here.
function docLink(slug: string): string | undefined {
  return docs[slug] ? `/docs/${slug}` : undefined
}
</script>

<template>
  <v-container class="py-12">
    <h1 class="text-h3 font-weight-bold mb-2">Documentation</h1>
    <p class="text-medium-emphasis mb-8">Comprehensive guides covering every aspect of the framework.</p>

    <div v-for="group in nav" :key="group.category" class="mb-8">
      <h2 class="text-h5 font-weight-bold mb-1">{{ group.category }}</h2>
      <p v-if="group.description" class="text-medium-emphasis text-body-2 mb-4">{{ group.description }}</p>
      <div v-else class="mb-4" />
      <v-row>
        <v-col v-for="item in group.items" :key="item.slug" cols="12" sm="6" md="4">
          <v-card
            height="100%"
            variant="outlined"
            class="pa-3"
            :to="docLink(item.slug)"
            :href="docLink(item.slug) ? undefined : '#'"
          >
            <v-icon :icon="group.icon" color="primary" class="mb-2" />
            <v-card-title class="px-0 text-wrap text-body-1 font-weight-bold">{{ item.title }}</v-card-title>
            <v-card-text class="px-0 text-body-2">{{ item.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
