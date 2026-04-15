<template>
  <div :class="isDark ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-gray-50'">
    <Header />

    <div class="max-w-6xl mx-auto mt-12 px-4 pb-12">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <h1 :class="isDark ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-gray-900'">
                Weller Loddestasjon
              </h1>
              <button
                type="button"
                @click="showInfo = !showInfo"
                :aria-expanded="showInfo"
                aria-label="Sensorinfo"
                title="Sensorinfo"
                :class="[
                  'flex items-center justify-center w-7 h-7 rounded-full border text-xs font-bold transition-colors',
                  isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                ]"
              >
                !
              </button>
            </div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              Sanntidsovervåking av utstyr
            </p>
          </div>
          <div
            v-if="sensorData"
            :class="[
              'flex items-center gap-3 px-4 py-2 rounded-lg',
              isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
            ]"
          >
            <div
              class="w-2.5 h-2.5 rounded-full"
              :class="{
                'bg-green-500 animate-pulse': isActive,
                'bg-gray-400': !isActive
              }"
            ></div>
            <span :class="isDark ? 'text-sm font-medium text-gray-200' : 'text-sm font-medium text-gray-700'">
              {{ isActive ? 'I bruk' : 'Ledig' }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="showInfo"
        :class="[
          'mb-6 rounded-lg border p-4 text-sm',
          isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
        ]"
      >
        <p :class="isDark ? 'font-semibold text-gray-100' : 'font-semibold text-gray-800'">Sensorer</p>
        <ul class="mt-2 list-disc pl-5 space-y-1">
          <li>Termisk kamera (32x24) MLX90640 sensor for min/snitt/maks og varmekart</li>
        </ul>
        <p :class="['mt-3 font-semibold', isDark ? 'text-gray-100' : 'text-gray-800']">Datahenting</p>
        <ul class="mt-2 list-disc pl-5 space-y-1">
          <li>/api/loddestasjon-sensor</li>
          <li>Oppdateres hvert 1. sekund</li>
        </ul>
      </div>

      <!-- Feilmelding -->
      <transition name="fade">
        <div
          v-if="error"
          :class="isDark ? 'mb-6 p-4 rounded-lg bg-red-900/20 text-red-300 border border-red-800 text-sm' : 'mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm'"
        >
          ⚠️ {{ error }}
        </div>
      </transition>

      <!-- To-kolonners layout -->
      <div v-if="sensorData" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- VENSTRE KOLONNE: Vibrasjon & Status -->
        <div class="space-y-6">
          <!-- Produktbilde -->
          <div
            :class="[
              'rounded-lg overflow-hidden',
              isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
            ]"
          >
            <div :class="isDark ? 'bg-gray-700/50 p-8 flex justify-center items-center' : 'bg-gray-100 p-8 flex justify-center items-center'">
              <img
                src="/weller.png"
                alt="Weller Loddestasjon"
                class="object-contain h-48 drop-shadow-sm"
              />
            </div>
          </div>

          <!-- Status Card -->
          <div
            :class="[
              'rounded-lg p-6',
              isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
            ]"
          >
            <h2 :class="isDark ? 'text-base font-semibold text-white mb-4' : 'text-base font-semibold text-gray-900 mb-4'">
              Status
            </h2>
            
            <div class="flex items-center gap-3">
              <span
                class="w-3 h-3 rounded-full flex-shrink-0"
                :class="isActive ? 'bg-blue-500 animate-pulse' : 'bg-green-500'"
              ></span>
              <span :class="isDark ? 'text-lg font-medium text-gray-200' : 'text-lg font-medium text-gray-800'">
                {{ isActive ? 'I bruk' : 'Ledig' }}
              </span>
            </div>
            <div :class="isDark ? 'mt-4 pt-4 border-t border-gray-700' : 'mt-4 pt-4 border-t border-gray-100'">
              <div class="flex items-center justify-between">
                <span :class="isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-500'">Maks temperatur</span>
                <span :class="isDark ? 'text-sm font-mono text-gray-300' : 'text-sm font-mono text-gray-700'">{{ sensorData?.thermalMax ?? '–' }}°C</span>
              </div>
            </div>
            <p v-if="lastUpdate" :class="isDark ? 'text-xs text-gray-600 mt-3' : 'text-xs text-gray-400 mt-3'">Sist oppdatert: {{ lastUpdate }}</p>
          </div>
        </div>

        <!-- HØYRE KOLONNE: Termisk Kamera -->
        <div class="space-y-6">
          <!-- Thermal Camera Card -->
          <div
            :class="[
              'rounded-lg p-6',
              isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
            ]"
          >
            <div class="flex items-center gap-2 mb-5">
              <Camera :size="20" :class="isDark ? 'text-gray-400' : 'text-gray-600'" />
              <h2 :class="isDark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'">
                Termisk Kamera
              </h2>
            </div>
            
            <!-- Heat map canvas -->
            <div :class="isDark ? 'bg-gray-900/50 rounded-lg p-4 mb-5' : 'bg-gray-50 rounded-lg p-4 mb-5'">
              <div class="thermal-canvas-wrapper">
                <canvas 
                  ref="canvasThermal" 
                  width="32" 
                  height="24"
                  class="thermal-canvas"
                ></canvas>
              </div>
              <p v-if="thermalLastUpdate" :class="isDark ? 'text-xs text-gray-500 text-center mt-2' : 'text-xs text-gray-600 text-center mt-2'">
                Oppdatert: {{ thermalLastUpdate }}
              </p>
              <p v-if="thermalStale" :class="isDark ? 'text-xs text-yellow-300 text-center mt-1' : 'text-xs text-yellow-700 text-center mt-1'">
                Kamera utilgjengelig — viser siste bilde
              </p>
            </div>
            
            <!-- Temperatur statistikk -->
            <div class="grid grid-cols-3 gap-3">
              <div :class="isDark ? 'text-center' : 'text-center'">
                <p :class="isDark ? 'text-xs text-gray-500 mb-1' : 'text-xs text-gray-500 mb-1'">
                  Min
                </p>
                <p :class="isDark ? 'text-2xl font-bold text-blue-400' : 'text-2xl font-bold text-blue-600'">
                  {{ sensorData.thermalMin }}°
                </p>
              </div>
              
              <div :class="isDark ? 'text-center' : 'text-center'">
                <p :class="isDark ? 'text-xs text-gray-500 mb-1' : 'text-xs text-gray-500 mb-1'">
                  Snitt
                </p>
                <p :class="isDark ? 'text-2xl font-bold text-green-400' : 'text-2xl font-bold text-green-600'">
                  {{ sensorData.thermalAvg }}°
                </p>
              </div>
              
              <div :class="isDark ? 'text-center' : 'text-center'">
                <p :class="isDark ? 'text-xs text-gray-500 mb-1' : 'text-xs text-gray-500 mb-1'">
                  Maks
                </p>
                <p :class="isDark ? 'text-2xl font-bold text-red-400' : 'text-2xl font-bold text-red-600'">
                  {{ sensorData.thermalMax }}°
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else-if="loading" class="text-center py-16">
        <div :class="isDark ? 'inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400' : 'inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'"></div>
        <p :class="isDark ? 'text-gray-400 mt-4' : 'text-gray-600 mt-4'">Henter sensordata...</p>
      </div>

      <!-- Footer info -->
      <div v-if="lastUpdate" :class="isDark ? 'text-center text-gray-500 text-xs mt-8' : 'text-center text-gray-500 text-xs mt-8'">
        Sist oppdatert: {{ lastUpdate }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useState } from '#app'
import Header from '@/components/Header.vue'
import { Camera } from 'lucide-vue-next';
import { sharedLoddestasjonData, isDataLoaded, loddestasjonInUse, updateLoddestasjonUsage } from '@/components/loddestasjonState.js'

// Dark mode state
const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false;
  }
  return false;
});

let intervalId: ReturnType<typeof setInterval> | null = null

const canvasThermal = ref<HTMLCanvasElement | null>(null)
const sensorData = sharedLoddestasjonData // Bruk delt state i stedet for lokal state
const loading = ref(!isDataLoaded.value) // Vis ikke loading hvis data allerede er lastet
const error = ref('')
const lastUpdate = ref('')
const thermalLastUpdate = ref('')
const thermalStale = ref(false)
const showInfo = ref(false)

const isActive = loddestasjonInUse

function tempToColorRGB(t: number, minT: number, maxT: number): [number, number, number] {
  let p = (t - minT) / (maxT - minT)
  p = Math.max(0, Math.min(1, p))

  const stops: [number, number, number][] = [
    [0,   0,   0  ],
    [80,  0,   180],
    [255, 0,   50 ],
    [255, 180, 0  ],
    [255, 255, 0  ],
  ]

  const n = stops.length - 1
  const scaled = p * n
  const i = Math.min(Math.floor(scaled), n - 1)
  const f = scaled - i

  const a = stops[i]!, b = stops[i + 1]!
  return [
    ~~(a[0] + (b[0] - a[0]) * f),
    ~~(a[1] + (b[1] - a[1]) * f),
    ~~(a[2] + (b[2] - a[2]) * f),
  ]
}

function getSmartColorRange(pixels: number[]): { min: number; max: number } {
  if (pixels.length === 0) return { min: 0, max: 100 }

  // Beregn gjennomsnitt og standardavvik
  const mean = pixels.reduce((a, b) => a + b, 0) / pixels.length
  const variance = pixels.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / pixels.length
  const stdDev = Math.sqrt(variance)

  // Bruk moyenne ± 2*stdDev for bedre granularitet
  // Dette gir bedre fargefordeling selv når det er mye av en verdi
  const min = Math.max(0, mean - 1.5 * stdDev)
  const max = mean + 2 * stdDev

  // Sikre at vi har en minimum spread
  if (max - min < 1) {
    return {
      min: Math.max(0, mean - 2),
      max: mean + 2
    }
  }

  return { min, max }
}

onMounted(() => {
  // Kun fetch hvis data ikke allerede er lastet
  if (!isDataLoaded.value) {
    fetchSensorData()
  }
  // Oppdater hvert 100 ms for høyere FPS (match Home Assistant update_interval)
  intervalId = setInterval(fetchSensorData, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  // Ikke tøm sensorData her, så den bevares mellom navigasjon
})

async function fetchSensorData() {
  error.value = ''
  try {
    const response = await fetch('/api/loddestasjon-sensor')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    

    sensorData.value = {
      vibration: data.vibration || false,
      tilt: data.tilt || false,
      drop: data.drop || false,
      battery: data.battery || 0,
      thermalMin: data.thermalMin || 0,
      thermalMax: data.thermalMax || 0,
      thermalAvg: data.thermalAvg || 0
    }

    updateLoddestasjonUsage(sensorData.value.thermalMax)

    // Tegn thermal heat map hvis vi har pixels (4 deler, comma-separated)
    if (data.thermalPixels1 && data.thermalPixels1 !== 'unknown' && canvasThermal.value) {
      try {
        const part1 = data.thermalPixels1.split(',').map(Number)
        const part2 = data.thermalPixels2.split(',').map(Number)
        const part3 = data.thermalPixels3.split(',').map(Number)
        const part4 = data.thermalPixels4.split(',').map(Number)
        
        const pixels = [...part1, ...part2, ...part3, ...part4]
        
        if (pixels.length === 768) {
          const ctx = canvasThermal.value.getContext('2d')
          if (ctx) {
            const colorRange = getSmartColorRange(pixels)
            const minT = colorRange.min
            const maxT = colorRange.max

            const cols = 32
            const rows = 24
            const cw = canvasThermal.value.width
            const ch = canvasThermal.value.height
            const imageData = ctx.createImageData(cw, ch)
            const d = imageData.data

            for (let cy = 0; cy < ch; cy++) {
              for (let cx = 0; cx < cw; cx++) {
                const gx = (cx / (cw - 1)) * (cols - 1)
                const gy = (cy / (ch - 1)) * (rows - 1)
                const x0 = Math.floor(gx), x1 = Math.min(x0 + 1, cols - 1)
                const y0 = Math.floor(gy), y1 = Math.min(y0 + 1, rows - 1)
                const fx = gx - x0, fy = gy - y0
                const temp =
                  pixels[y0 * cols + x0] * (1 - fx) * (1 - fy) +
                  pixels[y0 * cols + x1] * fx * (1 - fy) +
                  pixels[y1 * cols + x0] * (1 - fx) * fy +
                  pixels[y1 * cols + x1] * fx * fy
                const col = tempToColorRGB(temp, minT, maxT)
                const idx = (cy * cw + cx) * 4
                d[idx]     = col[0]
                d[idx + 1] = col[1]
                d[idx + 2] = col[2]
                d[idx + 3] = 255
              }
            }
            ctx.putImageData(imageData, 0, 0)

            // Oppdater timestamp for thermal data
            const now = new Date()
            thermalLastUpdate.value = now.toLocaleTimeString('nb-NO', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          }
        }
      } catch (err) {
        console.error('Feil ved tegning av thermal map:', err)
      }
    }

    // thermalStale flag from server indicates we're returning cached/stale data
    thermalStale.value = !!data.thermalStale

    // Vis feilmelding hvis API returnerte error, men fortsett å vise data
    if (data.error) {
      console.warn('API warning:', data.error)
    }

    // Oppdater timestamp
    const now = new Date()
    lastUpdate.value = now.toLocaleTimeString('nb-NO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    loading.value = false
    isDataLoaded.value = true // Marker at data er lastet
  } catch (e) {
    console.error('Fetch error:', e)
    error.value = (e instanceof Error ? e.message : String(e)) || 'Ukjent feil ved henting av sensordata.'
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.thermal-canvas-wrapper {
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  aspect-ratio: 4 / 3;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.thermal-canvas {
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
  filter: contrast(1.1) saturate(1.2);
  transition: filter 0.3s ease;
}

.thermal-canvas:hover {
  filter: contrast(1.15) saturate(1.25);
}
</style>