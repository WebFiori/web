<script setup lang="ts">
const libraries = [
  { name: 'HTTP', repo: 'WebFiori/http', desc: 'HTTP request/response handling and RESTful web service creation with data filtering and validation.' },
  { name: 'Database', repo: 'WebFiori/database', desc: 'Database abstraction layer with schema and query building for MySQL and MSSQL.' },
  { name: 'CLI', repo: 'WebFiori/cli', desc: 'Library for building interactive command-line applications in PHP.' },
  { name: 'UI', repo: 'WebFiori/ui', desc: 'Object-oriented HTML/DOM manipulation library for building web pages in PHP.' },
  { name: 'JSON', repo: 'WebFiori/json', desc: 'JSON data handling with custom serialization and formatting support.' },
  { name: 'Collections', repo: 'WebFiori/collections', desc: 'Data structures including linked lists and stacks for PHP.' },
  { name: 'Mailer', repo: 'WebFiori/mail', desc: 'SMTP email library for sending HTML emails with attachments.' },
  { name: 'Error Handler', repo: 'WebFiori/err', desc: 'Custom error and exception handling with structured error reporting.' },
  { name: 'Cache', repo: 'WebFiori/cache', desc: 'Caching mechanisms for improved application response times.' },
  { name: 'File', repo: 'WebFiori/file', desc: 'File handling utilities for reading, writing, and managing files.' },
]
</script>

<template>
  <v-container class="py-12">
    <h1 class="text-h3 font-weight-bold mb-2">Standard Libraries</h1>
    <p class="text-medium-emphasis mb-8">WebFiori is composed of independent, reusable libraries that can be used standalone or together.</p>
    <v-row>
      <v-col v-for="lib in libraries" :key="lib.name" cols="12" sm="6" md="4">
        <v-card height="100%" variant="outlined" class="pa-4">
          <v-card-title class="px-0">{{ lib.name }}</v-card-title>
          <v-card-text class="px-0">{{ lib.desc }}</v-card-text>
          <v-card-actions class="px-0">
            <v-btn :href="`https://github.com/${lib.repo}`" target="_blank" variant="text" color="primary" size="small" prepend-icon="mdi-github">
              GitHub
            </v-btn>
            <v-btn :href="`https://packagist.org/packages/${lib.repo.toLowerCase()}`" target="_blank" variant="text" color="secondary" size="small" prepend-icon="mdi-package-variant">
              Packagist
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
