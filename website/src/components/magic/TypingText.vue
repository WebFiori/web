<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  delay?: number
  speed?: number
}>(), { delay: 0, speed: 40 })

const displayed = ref('')
const done = ref(false)

onMounted(() => {
  setTimeout(() => {
    let i = 0
    const interval = setInterval(() => {
      displayed.value = props.text.slice(0, ++i)
      if (i >= props.text.length) {
        clearInterval(interval)
        done.value = true
      }
    }, props.speed)
  }, props.delay)
})
</script>

<template>
  <span>{{ displayed }}<span v-if="!done" class="cursor">|</span></span>
</template>

<style scoped>
.cursor {
  animation: blink 0.7s step-end infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
</style>
