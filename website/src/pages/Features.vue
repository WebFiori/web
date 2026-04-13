<script setup lang="ts">
const features = [
  {
    icon: 'mdi-routes',
    title: 'Flexible Routing',
    desc: 'Routes can target static files, PHP classes, closures, or MVC controllers. Define custom URL structures with parameters, optional segments, and middleware.',
  },
  {
    icon: 'mdi-api',
    title: 'Web Services / REST APIs',
    desc: 'Build RESTful APIs with built-in JSON handling, request parameter validation, data filtering, and automatic OpenAPI documentation support.',
  },
  {
    icon: 'mdi-database',
    title: 'Database Abstraction',
    desc: 'Schema and query building for MySQL and MSSQL. Supports joins, unions, transactions, result-set mapping, and raw SQL when needed.',
  },
  {
    icon: 'mdi-palette',
    title: 'Theming System',
    desc: 'Create multiple UIs for the same app. Themes act as modular plug-ins that can provide additional functionality beyond styling.',
  },
  {
    icon: 'mdi-shield-check',
    title: 'Middleware',
    desc: 'Filter HTTP requests before they reach your application. Implement authentication, authorization, CORS, logging, and more.',
  },
  {
    icon: 'mdi-clock-outline',
    title: 'Background Tasks',
    desc: 'Schedule and automate background jobs using CRON-like scheduling. Run tasks via HTTP or terminal.',
  },
  {
    icon: 'mdi-email-outline',
    title: 'HTML Email',
    desc: 'Send professional HTML emails with attachments. Build email content using the same UI library used for web pages.',
  },
  {
    icon: 'mdi-console',
    title: 'CLI Tools',
    desc: 'Built-in commands for scaffolding routes, middleware, database tables, and more. Create custom commands for your project.',
  },
  {
    icon: 'mdi-account-lock',
    title: 'Sessions Management',
    desc: 'Multiple concurrent sessions per user, custom storage engines, automatic session regeneration, and hijacking protection.',
  },
  {
    icon: 'mdi-xml',
    title: 'DOM Manipulation in PHP',
    desc: 'Build and manipulate HTML DOM inside PHP using an object-oriented API. No need to touch raw HTML.',
  },
  {
    icon: 'mdi-translate',
    title: 'Internationalization',
    desc: 'Built-in i18n support for creating multi-language applications with translation files.',
  },
  {
    icon: 'mdi-upload',
    title: 'File Uploads',
    desc: 'Well-defined file upload sub-system with validation, size limits, and MIME type checking.',
  },
]
</script>

<template>
  <v-container class="py-12">
    <h1 class="text-h3 font-weight-bold mb-2">Features</h1>
    <p class="text-medium-emphasis mb-8">Everything you need to build modern PHP web applications.</p>
    <v-row>
      <v-col v-for="f in features" :key="f.title" cols="12" sm="6" md="4">
        <v-card height="100%" variant="outlined" class="pa-4">
          <v-icon :icon="f.icon" size="36" color="primary" class="mb-3" />
          <v-card-title class="px-0 text-wrap">{{ f.title }}</v-card-title>
          <v-card-text class="px-0">{{ f.desc }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
