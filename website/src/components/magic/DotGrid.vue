<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement>()
let animId = 0

onMounted(() => {
  const c = canvas.value!
  const ctx = c.getContext('2d')!
  let w = 0, h = 0
  const cols = 40
  const rows = 25
  let mouseX = -1, mouseY = -1

  function resize() {
    w = c.width = c.offsetWidth
    h = c.height = c.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)

  function onMove(e: MouseEvent) {
    const rect = c.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  }
  function onLeave() { mouseX = mouseY = -1 }
  c.addEventListener('mousemove', onMove)
  c.addEventListener('mouseleave', onLeave)

  function draw() {
    ctx.clearRect(0, 0, w, h)
    const gapX = w / cols, gapY = h / rows
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = gapX * (i + 0.5), y = gapY * (j + 0.5)
        let r = 1, alpha = 0.15
        if (mouseX >= 0) {
          const dist = Math.hypot(x - mouseX, y - mouseY)
          const proximity = Math.max(0, 1 - dist / 150)
          r = 1 + proximity * 3
          alpha = 0.15 + proximity * 0.6
        }
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(76, 175, 80, ${alpha})`
        ctx.fill()
      }
    }
    animId = requestAnimationFrame(draw)
  }
  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
    c.removeEventListener('mousemove', onMove)
    c.removeEventListener('mouseleave', onLeave)
  })
})
</script>

<template>
  <canvas ref="canvas" class="dot-grid" />
</template>

<style scoped>
.dot-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>
