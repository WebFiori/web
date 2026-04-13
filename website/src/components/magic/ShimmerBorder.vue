<template>
  <div class="shimmer-border" :style="{ '--border-color': color }">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), { color: '#4CAF50' })
</script>

<style scoped>
.shimmer-border {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}
.shimmer-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: conic-gradient(from var(--angle, 0deg), transparent 40%, var(--border-color) 50%, transparent 60%);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: rotate 3s linear infinite;
}
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes rotate {
  to { --angle: 360deg; }
}
</style>
