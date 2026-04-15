<template>
  <div :class="isDark ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-gray-50'">
    <Header />

    <div class="max-w-6xl mx-auto mt-12 px-4 pb-12">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 :class="isDark ? 'text-3xl font-bold text-white mb-2' : 'text-3xl font-bold text-gray-900 mb-2'">
              Laserkutter
            </h1>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">Sanntidsovervåking av laserkutter</p>
          </div>

          <div
            v-if="sensorData"
            :class="[
              'flex items-center gap-3 px-3 py-1 rounded-full border',
              isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-700'
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

      <!-- Two-column layout like loddestasjon -->
      <div v-if="sensorData" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Image + Info -->
        <div class="space-y-6">
          <div :class="[ 'rounded-lg overflow-hidden', isDark ? 'bg-gray-800' : 'bg-white shadow-sm' ]">
            <div :class="isDark ? 'bg-gray-700/50 p-8 flex justify-center items-center' : 'bg-gray-100 p-8 flex justify-center items-center'">
              <img src="/glowforge.png" alt="Laserkutter" class="object-contain h-48 drop-shadow-sm" />
            </div>
          </div>

          <div :class="[ 'rounded-lg p-6', isDark ? 'bg-gray-800' : 'bg-white shadow-sm' ]">
            <h2 :class="isDark ? 'text-base font-semibold text-white mb-4' : 'text-base font-semibold text-gray-900 mb-4'">Status</h2>
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
                <span :class="isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-500'">Total bevegelse</span>
                <span :class="isDark ? 'text-sm font-mono text-gray-300' : 'text-sm font-mono text-gray-700'">{{ sensorData?.total ?? '–' }}</span>
              </div>
            </div>
            <p v-if="lastUpdate" :class="isDark ? 'text-xs text-gray-600 mt-3' : 'text-xs text-gray-400 mt-3'">Sist oppdatert: {{ lastUpdate }}</p>
          </div>
        </div>

        <!-- RIGHT: Sensor values -->
        <div class="space-y-6">
          <div :class="[ 'rounded-lg p-6', isDark ? 'bg-gray-800' : 'bg-white shadow-sm' ]">
            <div class="flex items-center gap-2 mb-5">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"/><path d="M12 3v18"/></svg>
              <h2 :class="isDark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'">Akselerometer</h2>
            </div>

            <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="text-center">
                <p :class="isDark ? 'text-xs text-gray-500 mb-1' : 'text-xs text-gray-500 mb-1'">X-akse</p>
                <p :class="isDark ? 'text-2xl font-bold text-gray-200' : 'text-2xl font-bold text-gray-800'">{{ sensorData.x }}</p>
              </div>
              <div class="text-center">
                <p :class="isDark ? 'text-xs text-gray-500 mb-1' : 'text-xs text-gray-500 mb-1'">Y-akse</p>
                <p :class="isDark ? 'text-2xl font-bold text-gray-200' : 'text-2xl font-bold text-gray-800'">{{ sensorData.y }}</p>
              </div>
              <div class="text-center">
                <p :class="isDark ? 'text-xs text-gray-500 mb-1' : 'text-xs text-gray-500 mb-1'">Z-akse</p>
                <p :class="isDark ? 'text-2xl font-bold text-gray-200' : 'text-2xl font-bold text-gray-800'">{{ sensorData.z }}</p>
              </div>
            </div>

            <div :class="isDark ? 'text-center' : 'text-center'">
              <p :class="isDark ? 'text-xs text-gray-500 mb-1' : 'text-xs text-gray-500 mb-1'">Total bevegelse</p>
              <p :class="isDark ? 'text-3xl font-bold text-gray-100' : 'text-3xl font-bold text-gray-900'">{{ sensorData.total }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="text-center py-16">
        <div :class="isDark ? 'inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400' : 'inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'"></div>
        <p :class="isDark ? 'text-gray-400 mt-4' : 'text-gray-600 mt-4'">Henter sensordata...</p>
      </div>

      <div v-if="lastUpdate" :class="isDark ? 'text-center text-gray-500 text-xs mt-8' : 'text-center text-gray-500 text-xs mt-8'">Sist oppdatert: {{ lastUpdate }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useState } from '#app'
import Header from '@/components/Header.vue'
import { sharedLaserkutterData, isLaserkutterDataLoaded } from '@/components/laserkutterState.js'

// Dark mode
const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? saved === 'true' : false
  }
  return false
})

let intervalId: ReturnType<typeof setInterval> | null = null

const sensorData = sharedLaserkutterData
const loading = ref(!isLaserkutterDataLoaded.value)
const error = ref('')
const lastUpdate = ref('')

const isActive = computed(() => {
  return sensorData.value?.inUse === true
})

onMounted(() => {
  if (!isLaserkutterDataLoaded.value) fetchSensorData()
  intervalId = setInterval(fetchSensorData, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

async function fetchSensorData() {
  error.value = ''
  try {
    const res = await fetch('/api/laserkutter-sensor')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    sensorData.value = {
      x: data.x || 0,
      y: data.y || 0,
      z: data.z || 0,
      total: data.total || 0,
      inUse: !!data.inUse
    }

    if (data.error) console.warn('API warning:', data.error)

    const now = new Date()
    lastUpdate.value = now.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    loading.value = false
    isLaserkutterDataLoaded.value = true
  } catch (e) {
    console.error('Fetch error:', e)
    error.value = (e instanceof Error ? e.message : String(e)) || 'Ukjent feil ved henting av sensordata.'
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
