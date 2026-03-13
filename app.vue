<template>
  <div class="overflow-x-hidden">
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const { updateFromTemp } = useLedStrip()

let ledInterval = null

async function updateLed() {
  try {
    const res = await fetch('/api/loddestasjon-sensor')
    if (res.ok) {
      const data = await res.json()
      const temp = parseFloat(data.thermalMax)
      if (!isNaN(temp)) updateFromTemp(temp)
    }
  } catch (e) {
    // stille feil
  }
}

onMounted(() => {
  updateLed()
  ledInterval = setInterval(updateLed, 2000)
})

onUnmounted(() => {
  clearInterval(ledInterval)
})
</script>