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
    desc: 'Build RESTful APIs with PHP 8 attributes (#[RestController], #[GetMapping], #[RequestParam]), automatic validation, and OpenAPI generation.',
  },
  {
    icon: 'mdi-database',
    title: 'Database Abstraction',
    desc: 'Schema and query building for MySQL, MSSQL, and SQLite. Supports migrations, seeders, repositories, joins, transactions, and raw SQL.',
  },
  {
    icon: 'mdi-shield-lock',
    title: 'Security & Authorization',
    desc: 'RBAC with role inheritance, ABAC with policy objects, #[PreAuthorize] expressions, SecurityContext, and session encryption (AES-256-GCM).',
  },
  {
    icon: 'mdi-shield-check',
    title: 'Middleware',
    desc: 'Priority-based execution with dependency resolution. Built-in: rate limiting, CORS, CSRF, maintenance mode, HTTP caching, authorization.',
  },
  {
    icon: 'mdi-tray-full',
    title: 'Job Queue',
    desc: 'Background job processing with priority, delayed execution, automatic retry with backoff, payload encryption, and failed job tracking.',
  },
  {
    icon: 'mdi-broadcast',
    title: 'Event Dispatcher',
    desc: 'Decoupled event-driven architecture. Dispatch events and let registered listeners react independently.',
  },
  {
    icon: 'mdi-needle',
    title: 'Dependency Injection',
    desc: 'Lightweight DI container with bind(), singleton(), instance(), callable factories, and automatic constructor resolution.',
  },
  {
    icon: 'mdi-clock-outline',
    title: 'Background Tasks',
    desc: 'CRON-based task scheduling with arguments, conditional execution, and a scheduler daemon for development.',
  },
  {
    icon: 'mdi-cached',
    title: 'Caching',
    desc: 'Key-value cache with TTL, cache-aside pattern, pluggable storage backends, and full HTTP caching (ETag/304).',
  },
  {
    icon: 'mdi-heart-pulse',
    title: 'Health Checks',
    desc: 'Monitor application dependencies with an HTTP endpoint (200/503). Built-in checks for cache and storage, extensible via interface.',
  },
  {
    icon: 'mdi-email-outline',
    title: 'HTML Email',
    desc: 'Send professional HTML emails with attachments. Build email content using the same UI library used for web pages.',
  },
  {
    icon: 'mdi-palette',
    title: 'Theming System',
    desc: 'Create multiple UIs for the same app. Themes act as modular plug-ins that can provide additional functionality beyond styling.',
  },
  {
    icon: 'mdi-console',
    title: 'CLI Tools',
    desc: 'Built-in commands for scaffolding routes, middleware, database tables, and more. Create custom commands for your project.',
  },
  {
    icon: 'mdi-account-lock',
    title: 'Sessions Management',
    desc: 'Multiple concurrent sessions per user, custom storage engines, encryption at rest, automatic regeneration, and hijacking protection.',
  },
  {
    icon: 'mdi-translate',
    title: 'Internationalization',
    desc: 'Built-in i18n support with LTR/RTL for creating multi-language applications with translation files.',
  },
  {
    icon: 'mdi-text-box-outline',
    title: 'Structured Logging',
    desc: 'File-based logging with daily rotation, level filtering, and structured context data for observability.',
  },
  {
    icon: 'mdi-upload',
    title: 'File Uploads',
    desc: 'File upload handling with validation, size limits, MIME type checking, and type restrictions.',
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
