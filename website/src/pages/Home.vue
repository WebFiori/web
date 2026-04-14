<script setup lang="ts">
import { ref } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'
import AuroraBackground from '../components/magic/AuroraBackground.vue'
import TypingText from '../components/magic/TypingText.vue'
import FadeIn from '../components/magic/FadeIn.vue'
import ShimmerBorder from '../components/magic/ShimmerBorder.vue'
import AnimatedCounter from '../components/magic/AnimatedCounter.vue'
import DotGrid from '../components/magic/DotGrid.vue'

const features = [
  { icon: 'mdi-routes', title: 'Routing', desc: 'Flexible URL routing that can target static files, PHP classes, closures, or MVC controllers.' },
  { icon: 'mdi-api', title: 'Web Services', desc: 'Build RESTful APIs with built-in JSON handling, data filtering, and validation.' },
  { icon: 'mdi-database', title: 'Database', desc: 'Schema and query building for MySQL and MSSQL with an intuitive abstraction layer.' },
  { icon: 'mdi-palette', title: 'Theming', desc: 'Swap the entire UI by changing one line of code. Themes work as modular plug-ins.' },
  { icon: 'mdi-email', title: 'Email', desc: 'Send HTML emails with attachments using familiar HTML syntax and SMTP configuration.' },
  { icon: 'mdi-console', title: 'CLI', desc: 'Built-in and custom CLI commands to streamline development workflows.' },
]

const codeExamples = [
  { label: 'Route', lang: 'php', code: `Router::page([
    RouteOption::PATH => '/products/{category}',
    RouteOption::TO => ProductsPage::class
]);` },
  { label: 'API', lang: 'php', code: `Router::addRoute([
    RouteOption::PATH => '/api/users/{id}',
    RouteOption::TO => UserController::class,
    RouteOption::ACTION => 'getUser',
    RouteOption::REQUEST_METHODS => ['GET']
]);` },
  { label: 'Email', lang: 'php', code: `$message = new EmailMessage('no-reply');
$message->setSubject('Welcome!');
$message->addTo('user@example.com');
$message->insert('p')->text('Hello!');
$message->send();` },
  { label: 'CLI', lang: 'php', code: `class MyCommand extends CLICommand {
    public function __construct() {
        parent::__construct('greet', [
            'name' => ['optional' => true]
        ]);
    }
    public function exec(): int {
        $this->println('Hello %s!', $this->getArgValue('name'));
        return 0;
    }
}` },
]

const activeTab = ref(0)
const typingDone = ref(false)
</script>

<template>
  <div>
    <!-- Hero with Aurora + Dot Grid -->
    <div style="position: relative; overflow: hidden">
      <AuroraBackground />
      <DotGrid />
      <v-container fluid class="py-16 text-center" style="position: relative; z-index: 1">
        <v-container>
          <img
            src="/favicon.png" alt="WebFiori logo"
            style="height: 100px; width: 100px"
            class="mb-4 logo-spin"
          />
          <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
            <span :class="{ 'gradient-text': typingDone }">
              <TypingText text="WebFiori Framework" :speed="50" @vue:updated="typingDone = true" />
            </span>
          </h1>
          <p class="text-h6 text-medium-emphasis mx-auto" style="max-width: 700px">
            A lightweight, flexible PHP framework for building web applications and APIs. Object-oriented, developer-friendly, and ready for production.
          </p>
          <div class="mt-8">
            <v-btn color="primary" size="large" to="/getting-started" class="mr-3" prepend-icon="mdi-rocket-launch">Get Started</v-btn>
            <v-btn variant="outlined" size="large" href="https://github.com/WebFiori/framework" target="_blank" prepend-icon="mdi-github">GitHub</v-btn>
          </div>
          <div class="mt-6">
            <v-chip class="ma-1" variant="tonal" color="primary">PHP 8.1+</v-chip>
            <v-chip class="ma-1" variant="tonal" color="secondary">MIT License</v-chip>
          </div>
        </v-container>
      </v-container>
    </div>

    <!-- Stats counters -->
    <v-container class="py-10">
      <FadeIn>
        <v-row justify="center" class="text-center">
          <v-col cols="6" sm="4">
            <div class="text-h3 font-weight-bold text-primary"><AnimatedCounter :end="6" suffix="+" /></div>
            <div class="text-body-2 text-medium-emphasis">PHP Versions Supported</div>
          </v-col>
          <v-col cols="6" sm="4">
            <div class="text-h3 font-weight-bold text-primary"><AnimatedCounter :end="100" suffix="%" /></div>
            <div class="text-body-2 text-medium-emphasis">Open Source</div>
          </v-col>
        </v-row>
      </FadeIn>
    </v-container>

    <!-- Quick install with shimmer -->
    <v-container class="py-12">
      <FadeIn>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-bold">Install in Seconds</h2>
        </div>
        <div style="max-width: 700px; margin: 0 auto">
          <ShimmerBorder>
            <CodeBlock code="composer create-project webfiori/app my-site --prefer-dist" language="bash" />
          </ShimmerBorder>
        </div>
      </FadeIn>
    </v-container>

    <!-- Features grid -->
    <v-container class="py-12">
      <FadeIn>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-bold">Key Features</h2>
        </div>
      </FadeIn>
      <v-row>
        <v-col v-for="(f, i) in features" :key="f.title" cols="12" sm="6" md="4">
          <FadeIn :delay="i * 100" style="height: 100%">
            <v-card height="100%" variant="outlined" class="pa-4 feature-card">
              <v-icon :icon="f.icon" size="40" color="primary" class="mb-3" />
              <v-card-title class="px-0">{{ f.title }}</v-card-title>
              <v-card-text class="px-0">{{ f.desc }}</v-card-text>
            </v-card>
          </FadeIn>
        </v-col>
      </v-row>
      <div class="text-center mt-8">
        <v-btn to="/features" variant="text" color="primary" append-icon="mdi-arrow-right">See All Features</v-btn>
      </div>
    </v-container>

    <!-- Interactive code tabs -->
    <v-container fluid class="py-12" style="background: rgba(76,175,80,0.05)">
      <v-container>
        <FadeIn>
          <div class="text-center mb-8">
            <h2 class="text-h4 font-weight-bold">Simple & Expressive</h2>
          </div>
        </FadeIn>
        <FadeIn>
          <v-card variant="outlined" max-width="700" class="mx-auto">
            <v-tabs v-model="activeTab" color="primary" grow>
              <v-tab v-for="(ex, i) in codeExamples" :key="i" :value="i">{{ ex.label }}</v-tab>
            </v-tabs>
            <v-window v-model="activeTab">
              <v-window-item v-for="(ex, i) in codeExamples" :key="i" :value="i">
                <CodeBlock :code="ex.code" :language="ex.lang" />
              </v-window-item>
            </v-window>
          </v-card>
        </FadeIn>
      </v-container>
    </v-container>

    <!-- CTA -->
    <v-container class="py-16 text-center">
      <FadeIn>
        <h2 class="text-h4 font-weight-bold mb-4">Ready to Build?</h2>
        <p class="text-medium-emphasis mb-6">Get started with WebFiori in minutes.</p>
        <v-btn color="primary" size="large" to="/getting-started" prepend-icon="mdi-rocket-launch">Get Started</v-btn>
      </FadeIn>
    </v-container>
  </div>
</template>

<style scoped>
.logo-spin {
  animation: spin-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes spin-in {
  from { transform: rotate(-180deg) scale(0); opacity: 0; }
  to { transform: rotate(0) scale(1); opacity: 1; }
}

.gradient-text {
  background: linear-gradient(135deg, #4CAF50, #C0CA33, #81C784);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.15);
}
</style>
