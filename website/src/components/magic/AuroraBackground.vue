<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  colors?: string[]
  speed?: number
}>(), {
  colors: () => ['#2E7D32', '#4CAF50', '#81C784', '#C0CA33', '#388E3C'],
  speed: 4,
})

const el = ref<HTMLCanvasElement>()
let animId = 0

onMounted(() => {
  const canvas = el.value!
  const ctx = canvas.getContext('2d')!
  let w = 0, h = 0

  function resize() {
    w = canvas.width = canvas.offsetWidth
    h = canvas.height = canvas.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const circles = props.colors.map((color) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.max(w, h) * (0.3 + Math.random() * 0.3),
    dx: (Math.random() - 0.5) * props.speed,
    dy: (Math.random() - 0.5) * props.speed,
    color,
  }))

  function draw() {
    ctx.clearRect(0, 0, w, h)
    circles.forEach(c => {
      c.x += c.dx
      c.y += c.dy
      if (c.x < -c.r || c.x > w + c.r) c.dx *= -1
      if (c.y < -c.r || c.y > h + c.r) c.dy *= -1
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r)
      g.addColorStop(0, c.color + '40')
      g.addColorStop(1, c.color + '00')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    })
    animId = requestAnimationFrame(draw)
  }
  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas ref="el" class="aurora-bg" />
</template>

<style scoped>
.aurora-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  filter: blur(80px);
}
</style>
