<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}>(), { delay: 0, direction: 'up' })

const visible = ref(false)
const el = ref<HTMLElement>()

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      setTimeout(() => { visible.value = true }, props.delay)
      observer.disconnect()
    }
  }, { threshold: 0.1 })
  if (el.value) observer.observe(el.value)
})

const transforms: Record<string, string> = {
  up: 'translateY(30px)',
  down: 'translateY(-30px)',
  left: 'translateX(30px)',
  right: 'translateX(-30px)',
}
</script>

<template>
  <div
    ref="el"
    :style="{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : transforms[direction],
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }"
  >
    <slot />
  </div>
</template>
