<script setup lang="ts">
import CodeBlock from '../components/CodeBlock.vue'
</script>

<template>
  <v-container class="py-12" style="max-width: 800px">
    <h1 class="text-h3 font-weight-bold mb-2">Contributing</h1>
    <p class="text-medium-emphasis mb-8">WebFiori is open source and welcomes contributions from the community.</p>

    <section class="mb-8">
      <h2 class="text-h5 font-weight-bold mb-4">How to Contribute</h2>
      <v-list density="compact" class="bg-transparent">
        <v-list-item prepend-icon="mdi-bug" title="Report bugs by opening an issue on GitHub" />
        <v-list-item prepend-icon="mdi-lightbulb" title="Suggest features or improvements" />
        <v-list-item prepend-icon="mdi-source-pull" title="Submit pull requests with fixes or new features" />
        <v-list-item prepend-icon="mdi-book-edit" title="Improve documentation" />
      </v-list>
    </section>

    <section class="mb-8">
      <h2 class="text-h5 font-weight-bold mb-4">Getting the Source</h2>
      <CodeBlock code="git clone https://github.com/WebFiori/framework.git" language="bash" />
    </section>

    <section class="mb-8">
      <h2 class="text-h5 font-weight-bold mb-4">Security</h2>
      <p>To report security vulnerabilities, please email <a href="mailto:ibrahim@webfiori.com" class="text-primary">ibrahim@webfiori.com</a>.</p>
    </section>

    <section>
      <h2 class="text-h5 font-weight-bold mb-4">Links</h2>
      <v-btn href="https://github.com/WebFiori/framework/issues/new" target="_blank" variant="outlined" class="mr-3 mb-2" prepend-icon="mdi-bug">Report Issue</v-btn>
      <v-btn href="https://github.com/WebFiori/framework" target="_blank" variant="outlined" class="mb-2" prepend-icon="mdi-github">GitHub</v-btn>
    </section>
  </v-container>
</template>
