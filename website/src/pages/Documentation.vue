<script setup lang="ts">
const sections = [
  {
    category: 'Getting Started',
    items: [
      { title: 'Introduction', desc: 'Overview of WebFiori framework, philosophy, and use cases.', icon: 'mdi-information' },
      { title: 'Installation', desc: 'Set up PHP, Composer, and create your first project.', icon: 'mdi-download' },
      { title: 'Folder Structure', desc: 'Understand the project directory hierarchy.', icon: 'mdi-folder-outline' },
      { title: 'Basic Usage', desc: 'Serve static and dynamic pages with routing.', icon: 'mdi-play-circle' },
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
      { title: 'Migrations and Seeders', desc: 'Schema versioning and data seeding.', icon: 'mdi-database-sync' },
      { title: 'Sessions Management', desc: 'Advanced session handling with custom storage.', icon: 'mdi-account-lock' },
      { title: 'WebFiori JSON', desc: 'JSON data handling library.', icon: 'mdi-code-json' },
      { title: 'Uploading Files', desc: 'File upload management with validation.', icon: 'mdi-upload' },
    ],
  },
  {
    category: 'Advanced Topics',
    items: [
      { title: 'MVC Architecture', desc: 'Controllers, repositories, and entities.', icon: 'mdi-sitemap' },
      { title: 'Sending Emails', desc: 'HTML email with attachments and templates.', icon: 'mdi-email' },
      { title: 'Background Tasks', desc: 'CRON-like scheduled task execution.', icon: 'mdi-clock-outline' },
      { title: 'Command Line Interface', desc: 'Built-in and custom CLI commands.', icon: 'mdi-console' },
    ],
  },
  {
    category: 'Configuration',
    items: [
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

    <v-alert type="info" variant="tonal" class="mb-8">
      Full documentation with code examples is available on the
      <a href="https://github.com/WebFiori/docs" target="_blank" class="text-primary">docs repository</a>
      and at <a href="https://webfiori.com/learn" target="_blank" class="text-primary">webfiori.com/learn</a>.
    </v-alert>

    <div v-for="section in sections" :key="section.category" class="mb-8">
      <h2 class="text-h5 font-weight-bold mb-4">{{ section.category }}</h2>
      <v-row>
        <v-col v-for="item in section.items" :key="item.title" cols="12" sm="6" md="4">
          <v-card height="100%" variant="outlined" class="pa-3">
            <v-icon :icon="item.icon" color="primary" class="mb-2" />
            <v-card-title class="px-0 text-wrap text-body-1 font-weight-bold">{{ item.title }}</v-card-title>
            <v-card-text class="px-0 text-body-2">{{ item.desc }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
