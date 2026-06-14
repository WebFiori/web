<script setup lang="ts">
import docs from 'virtual:docs'

const slugMap: Record<string, string> = {
  'Introduction': 'introduction',
  'Installation': 'installation',
  'Folder Structure': 'folder-structure',
  'Basic Usage': 'basic-usage',
  'Examples': 'examples',
  'Routing': 'routing',
  'The Class Response': 'class-response',
  'Web Pages': 'web-pages',
  'Web Services': 'web-services',
  'Middleware': 'middleware',
  'Built-in Middleware': 'built-in-middleware',
  'UI Package': 'ui-package',
  'Themes': 'themes',
  'Internationalization': 'i18n',
  'Database Management': 'database',
  'Repository Pattern': 'database-repository',
  'Migrations and Seeders': 'migrations',
  'Sessions Management': 'sessions-management',
  'Caching': 'caching',
  'WebFiori JSON': 'webfiori-json',
  'Uploading Files': 'uploading-files',
  'Streaming Uploads': 'streaming-uploads',
  'Resumable Uploads': 'resumable-uploads',
  'MVC Architecture': 'mvc',
  'Sending Emails': 'sending-emails',
  'Background Tasks': 'background-tasks',
  'Job Queue': 'job-queue',
  'Event Dispatcher': 'event-dispatcher',
  'Dependency Injection': 'dependency-injection',
  'Security & Authorization': 'security',
  'Command Line Interface': 'command-line-interface',
  'Health Checks': 'health-checks',
  'Logging': 'logging',
  'Environment Variables': 'env-vars',
  'Coding Standards': 'coding-standards',
}

function docLink(title: string): string | undefined {
  const slug = slugMap[title]
  return slug && docs[slug] ? `/docs/${slug}` : undefined
}

const sections = [
  {
    category: 'Getting Started',
    items: [
      { title: 'Introduction', desc: 'Overview of WebFiori framework, philosophy, and use cases.', icon: 'mdi-information' },
      { title: 'Installation', desc: 'Set up PHP, Composer, and create your first project.', icon: 'mdi-download' },
      { title: 'Folder Structure', desc: 'Understand the project directory hierarchy.', icon: 'mdi-folder-outline' },
      { title: 'Basic Usage', desc: 'Serve static and dynamic pages with routing.', icon: 'mdi-play-circle' },
      { title: 'Examples', desc: 'Real-world example projects to learn from.', icon: 'mdi-book-open-variant' },
    ],
  },
  {
    category: 'Core Features',
    items: [
      { title: 'Routing', desc: 'URL routing, parameters, grouping, and middleware assignment.', icon: 'mdi-routes' },
      { title: 'The Class Response', desc: 'HTTP response management and output control.', icon: 'mdi-arrow-right-bold' },
      { title: 'Web Pages', desc: 'Dynamic page creation with PHP classes.', icon: 'mdi-file-document' },
      { title: 'Web Services', desc: 'RESTful API development with validation and filtering.', icon: 'mdi-api' },
      { title: 'Middleware', desc: 'Request/response filtering and interception.', icon: 'mdi-shield-check' },
      { title: 'Built-in Middleware', desc: 'Rate limiting, CORS, CSRF, caching, maintenance mode.', icon: 'mdi-shield-lock' },
    ],
  },
  {
    category: 'User Interface',
    items: [
      { title: 'UI Package', desc: 'Object-oriented HTML component system.', icon: 'mdi-xml' },
      { title: 'Themes', desc: 'Theming system for consistent styling.', icon: 'mdi-palette' },
      { title: 'Internationalization', desc: 'Multi-language support with translation files.', icon: 'mdi-translate' },
    ],
  },
  {
    category: 'Data & Storage',
    items: [
      { title: 'Database Management', desc: 'Schema building, queries, joins, and transactions.', icon: 'mdi-database' },
      { title: 'Repository Pattern', desc: 'Repository, Active Record, eager loading, pagination.', icon: 'mdi-database-search' },
      { title: 'Migrations and Seeders', desc: 'Schema versioning and data seeding.', icon: 'mdi-database-sync' },
      { title: 'Sessions Management', desc: 'Advanced session handling with custom storage.', icon: 'mdi-account-lock' },
      { title: 'Caching', desc: 'Key-value cache with TTL and storage backends.', icon: 'mdi-cached' },
      { title: 'WebFiori JSON', desc: 'JSON serialization, deserialization, and attributes.', icon: 'mdi-code-json' },
    ],
  },
  {
    category: 'File Handling',
    items: [
      { title: 'Uploading Files', desc: 'Multipart form file uploads with validation.', icon: 'mdi-upload' },
      { title: 'Streaming Uploads', desc: 'Raw body uploads in constant memory.', icon: 'mdi-cloud-upload' },
      { title: 'Resumable Uploads', desc: 'Chunked uploads with pause/resume support.', icon: 'mdi-cloud-sync' },
    ],
  },
  {
    category: 'Advanced Topics',
    items: [
      { title: 'MVC Architecture', desc: 'Controllers, repositories, and entities.', icon: 'mdi-sitemap' },
      { title: 'Sending Emails', desc: 'HTML email with attachments and custom transports.', icon: 'mdi-email' },
      { title: 'Background Tasks', desc: 'CRON-like scheduled task execution.', icon: 'mdi-clock-outline' },
      { title: 'Job Queue', desc: 'Background job processing with retry and priority.', icon: 'mdi-tray-full' },
      { title: 'Event Dispatcher', desc: 'Decoupled event-driven architecture.', icon: 'mdi-broadcast' },
      { title: 'Dependency Injection', desc: 'DI container with auto-resolution.', icon: 'mdi-needle' },
      { title: 'Security & Authorization', desc: 'RBAC, ABAC, SecurityContext, PreAuthorize.', icon: 'mdi-lock' },
    ],
  },
  {
    category: 'Infrastructure',
    items: [
      { title: 'Command Line Interface', desc: 'Built-in and custom CLI commands.', icon: 'mdi-console' },
      { title: 'Health Checks', desc: 'Application dependency monitoring.', icon: 'mdi-heart-pulse' },
      { title: 'Logging', desc: 'Structured file-based logging.', icon: 'mdi-text-box-outline' },
      { title: 'Environment Variables', desc: 'Application configuration management.', icon: 'mdi-cog' },
      { title: 'Coding Standards', desc: 'Best practices and conventions.', icon: 'mdi-check-decagram' },
    ],
  },
]
</script>

<template>
  <v-container class="py-12">
    <h1 class="text-h3 font-weight-bold mb-2">Documentation</h1>
    <p class="text-medium-emphasis mb-8">Comprehensive guides covering every aspect of the framework.</p>

    <div v-for="section in sections" :key="section.category" class="mb-8">
      <h2 class="text-h5 font-weight-bold mb-4">{{ section.category }}</h2>
      <v-row>
        <v-col v-for="item in section.items" :key="item.title" cols="12" sm="6" md="4">
          <v-card height="100%" variant="outlined" class="pa-3" :to="docLink(item.title)" :href="docLink(item.title) ? undefined : '#'">
            <v-icon :icon="item.icon" color="primary" class="mb-2" />
            <v-card-title class="px-0 text-wrap text-body-1 font-weight-bold">{{ item.title }}</v-card-title>
            <v-card-text class="px-0 text-body-2">{{ item.desc }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
