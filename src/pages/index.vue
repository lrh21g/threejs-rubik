<script setup lang="ts">
import Main from './game/main.js'

const threeCanvasRef = ref<HTMLCanvasElement>(null)

onMounted(() => {
  init()
})

function init() {
  return new Main(threeCanvasRef.value)
}
</script>

<template>
  <canvas ref="threeCanvasRef" />
</template>

<route lang="json5">
{
  name: 'Home'
}
</route>
