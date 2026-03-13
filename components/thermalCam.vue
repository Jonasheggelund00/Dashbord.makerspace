<template>
  <div class="max-w-2xl mx-auto mt-6 px-4">
    <div :class="[
      isDark 
        ? 'bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-600' 
        : 'bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200'
    ]">
      <div class="p-8">
        <h2 :class="isDark ? 'text-2xl font-bold text-white mb-6' : 'text-2xl font-bold text-gray-800 mb-6'">
          Termal Kamera
        </h2>
        
        <!-- Canvas for thermal visualization -->
        <div class="flex justify-center mb-6">
          <canvas 
            ref="canvas" 
            width="320" 
            height="240"
            :class="isDark ? 'border-2 border-gray-600' : 'border-2 border-gray-300'"
            class="rounded-lg"
          ></canvas>
        </div>
        
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div :class="isDark ? 'bg-gray-700/50 rounded-lg p-4 border border-gray-600' : 'bg-blue-50 rounded-lg p-4 border border-blue-200'">
            <p :class="isDark ? 'text-xs text-gray-400 mb-1' : 'text-xs text-gray-600 mb-1'">Min Temperatur</p>
            <p :class="isDark ? 'text-2xl font-bold text-blue-400' : 'text-2xl font-bold text-blue-600'">
              {{ min }}°C
            </p>
          </div>
          
          <div :class="isDark ? 'bg-gray-700/50 rounded-lg p-4 border border-gray-600' : 'bg-green-50 rounded-lg p-4 border border-green-200'">
            <p :class="isDark ? 'text-xs text-gray-400 mb-1' : 'text-xs text-gray-600 mb-1'">Gj.snitt</p>
            <p :class="isDark ? 'text-2xl font-bold text-green-400' : 'text-2xl font-bold text-green-600'">
              {{ avg }}°C
            </p>
          </div>
          
          <div :class="isDark ? 'bg-gray-700/50 rounded-lg p-4 border border-gray-600' : 'bg-red-50 rounded-lg p-4 border border-red-200'">
            <p :class="isDark ? 'text-xs text-gray-400 mb-1' : 'text-xs text-gray-600 mb-1'">Max Temperatur</p>
            <div class="flex items-center gap-2">
              <p :class="isDark ? 'text-2xl font-bold text-red-400' : 'text-2xl font-bold text-red-600'">
                {{ max }}°C
              </p>
              <div
                class="w-5 h-5 rounded-full border border-gray-400 transition-colors duration-500 flex-shrink-0"
                :style="{ backgroundColor: ledPreviewColor }"
                title="LED strip farge"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useState } from '#app'

const canvas = ref(null)
const min = ref(0)
const max = ref(0)
const avg = ref(0)

// LED strip – oppdater farge basert på max-temperatur
const { updateFromTemp, ledColorFromTemp } = useLedStrip()

const ledPreviewColor = computed(() => {
  const [r, g, b] = ledColorFromTemp(max.value)
  return `rgb(${r}, ${g}, ${b})`
})

watch(max, (temp) => {
  updateFromTemp(parseFloat(temp))
})

// Dark mode state
const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false;
  }
  return false;
});

function tempToColor(t, minT, maxT) {
  let p = (t - minT) / (maxT - minT)
  p = Math.max(0, Math.min(1, p))

  // Iron/thermal colormap: svart → lilla → blå → rød → oransje → gul → hvit
  const stops = [
    [0,   0,   0  ],  // 0.00 svart
    [80,  0,   180],  // 0.25 lilla
    [255, 0,   50 ],  // 0.50 rød
    [255, 180, 0  ],  // 0.75 oransje-gul
    [255, 255, 255],  // 1.00 hvit
  ]

  const n = stops.length - 1
  const scaled = p * n
  const i = Math.min(Math.floor(scaled), n - 1)
  const f = scaled - i

  const a = stops[i], b = stops[i + 1]
  const r = ~~(a[0] + (b[0] - a[0]) * f)
  const g = ~~(a[1] + (b[1] - a[1]) * f)
  const bl = ~~(a[2] + (b[2] - a[2]) * f)
  return `rgb(${r},${g},${bl})`
}

async function fetchThermalData() {
  try {
    const response = await fetch('/api/thermal-camera')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.error) {
      console.warn('Thermal camera API warning:', data.error)
    }
    
    min.value = data.min || 0
    max.value = data.max || 0
    avg.value = data.average || 0

    // Oppdater LED strip basert på max-temperatur
    if (data.max) updateFromTemp(parseFloat(data.max))
    
    // Parse pixel data
    if (data.pixels) {
      const pixels = data.pixels.split(',').map(v => parseInt(v))
      
      // Draw heat map
      const ctx = canvas.value.getContext('2d')
      const minT = parseFloat(data.min)
      const maxT = parseFloat(data.max)
      
      for (let y = 0; y < 24; y++) {
        for (let x = 0; x < 32; x++) {
          const temp = pixels[y * 32 + x]
          ctx.fillStyle = tempToColor(temp, minT, maxT)
          ctx.fillRect(x * 10, y * 10, 10, 10)
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch thermal data:', error)
  }
}

let interval
onMounted(() => {
  fetchThermalData()
  interval = setInterval(fetchThermalData, 2000)  // Match ESP32 update interval
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
canvas {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>