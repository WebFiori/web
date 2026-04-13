<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}>(), { duration: 2000, prefix: '', suffix: '' })

const current = ref(0)
const el = ref<HTMLElement>()

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      observer.disconnect()
      const start = performance.now()
      function tick(now: number) {
        const progress = Math.min((now - start) / props.duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        current.value = Math.round(eased * props.end)
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  }, { threshold: 0.1 })
  if (el.value) observer.observe(el.value)
})
</script>

<template>
  <span ref="el">{{ prefix }}{{ current }}{{ suffix }}</span>
</template>
