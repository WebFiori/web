<script setup lang="ts">
withDefaults(defineProps<{
  items: string[]
  speed?: number
  reverse?: boolean
}>(), { speed: 30, reverse: false })
</script>

<template>
  <div class="marquee-wrapper" role="marquee">
    <div class="marquee-track" :class="{ reverse }" :style="{ '--speed': speed + 's' }">
      <div class="marquee-content" v-for="n in 2" :key="n" :aria-hidden="n > 1">
        <span v-for="item in items" :key="item" class="marquee-item">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-wrapper {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: scroll var(--speed) linear infinite;
}
.marquee-track.reverse {
  animation-direction: reverse;
}
.marquee-content {
  display: flex;
  flex-shrink: 0;
}
.marquee-item {
  padding: 0.5rem 1.5rem;
  margin: 0 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  white-space: nowrap;
  font-weight: 500;
}
@keyframes scroll {
  to { transform: translateX(-50%); }
}
</style>
