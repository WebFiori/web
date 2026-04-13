<script setup lang="ts">
import CodeBlock from '../components/CodeBlock.vue'

const pageCode = `// App/Pages/HomePage.php
namespace App\\Pages;

use WebFiori\\Framework\\Ui\\WebPage;

class HomePage extends WebPage {
    public function __construct() {
        parent::__construct();
        $this->insert('h1')->text('Hello WebFiori!');
    }
}`

const routeCode = `// App/Init/Routes/PagesRoutes.php
Router::page([
    RouteOption::PATH => '/',
    RouteOption::TO => HomePage::class
]);`

const folderStructure = `my-site/
├── public/          # Web root (index.php, static assets)
├── App/             # Application source code
│   ├── Apis/        # REST API controllers
│   ├── Commands/    # Custom CLI commands
│   ├── Config/      # Configuration files
│   ├── Database/    # Database classes
│   ├── Init/Routes/ # Route definitions
│   ├── Middleware/   # HTTP middleware
│   ├── Pages/       # Page classes and templates
│   ├── Storage/     # Uploads, sessions, logs, cache
│   └── Tasks/       # Background jobs
├── tests/           # Unit and integration tests
└── vendor/          # Composer dependencies`
</script>

<template>
  <v-container class="py-12" style="max-width: 900px">
    <h1 class="text-h3 font-weight-bold mb-2">Getting Started</h1>
    <p class="text-medium-emphasis mb-8">Set up your WebFiori project in minutes.</p>

    <!-- Requirements -->
    <section class="mb-10">
      <h2 class="text-h5 font-weight-bold mb-4">Requirements</h2>
      <v-list density="compact" class="bg-transparent">
        <v-list-item prepend-icon="mdi-language-php" title="PHP 8.1 or higher" />
        <v-list-item prepend-icon="mdi-package-variant" title="Composer (dependency manager)" />
        <v-list-item prepend-icon="mdi-server" title="Web server: Apache, Nginx, or PHP built-in server" />
      </v-list>
      <p class="text-body-2 text-medium-emphasis mt-2">Required PHP extensions: mbstring, mysqli (for MySQL), fileinfo, json</p>
    </section>

    <!-- Installation -->
    <section class="mb-10">
      <h2 class="text-h5 font-weight-bold mb-4">Installation</h2>
      <p class="mb-3">The recommended way to create a new project is via Composer:</p>
      <CodeBlock code="composer create-project webfiori/app my-site --prefer-dist" language="bash" />
    </section>

    <!-- Running -->
    <section class="mb-10">
      <h2 class="text-h5 font-weight-bold mb-4">Running the Project</h2>
      <p class="mb-3">Navigate to your project folder and start the built-in PHP server:</p>
      <CodeBlock :code="'cd my-site\nphp -S localhost:8080 -t public'" language="bash" />
      <p class="text-body-2 text-medium-emphasis mt-2">Open <code>http://localhost:8080</code> in your browser.</p>
    </section>

    <!-- Folder structure -->
    <section class="mb-10">
      <h2 class="text-h5 font-weight-bold mb-4">Project Structure</h2>
      <CodeBlock :code="folderStructure" language="markup" />
    </section>

    <!-- First page -->
    <section class="mb-10">
      <h2 class="text-h5 font-weight-bold mb-4">Your First Page</h2>
      <p class="mb-2">1. Create a page class:</p>
      <CodeBlock :code="pageCode" />
      <p class="mt-4 mb-2">2. Add a route:</p>
      <CodeBlock :code="routeCode" />
    </section>

    <section>
      <h2 class="text-h5 font-weight-bold mb-4">Next Steps</h2>
      <v-row>
        <v-col cols="12" sm="6">
          <v-btn block variant="outlined" to="/docs" prepend-icon="mdi-book-open-variant">Read the Docs</v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn block variant="outlined" to="/features" prepend-icon="mdi-star">Explore Features</v-btn>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>
