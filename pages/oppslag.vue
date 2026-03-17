<template>
  <div class="h-screen overflow-hidden bg-gray-950 text-white">
    <div class="h-full w-full px-2 sm:px-3 lg:px-8 py-2 sm:py-3 lg:py-6 flex flex-col overflow-hidden">
      <div class="flex items-start justify-between mb-2 sm:mb-4 lg:mb-8 flex-col sm:flex-row gap-1 sm:gap-3 flex-shrink-0">
        <div class="min-w-0">
          <h1 class="text-lg sm:text-2xl lg:text-5xl font-bold tracking-tight leading-tight">Makerspace Status</h1>
          <p class="text-gray-300 mt-0.5 sm:mt-1 text-xs sm:text-sm lg:text-xl hidden sm:block">Sanntidsoversikt for oppslagsskjerm</p>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="flex justify-end mb-1 sm:mb-2">
            <NuxtLink
              to="/hjem"
              class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-gray-700 bg-gray-900/80 text-xs text-gray-200 hover:bg-gray-800"
            >
              Lukk
            </NuxtLink>
          </div>
          <p class="text-lg sm:text-2xl lg:text-5xl font-bold tabular-nums leading-tight">{{ clock }}</p>
          <p class="text-gray-400 mt-0.5 sm:mt-1 text-xs sm:text-xs lg:text-lg">{{ dateLabel }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2.5 lg:gap-5 mb-2 sm:mb-3 lg:mb-5 flex-shrink-0 overflow-hidden">
        <div class="rounded p-1.5 sm:p-2.5 lg:p-6 bg-emerald-500/15 border border-emerald-500/30 overflow-hidden flex flex-col">
          <p class="text-gray-300 text-xs lg:text-base mb-0.5 lg:mb-2 leading-tight">3D-printere i bruk</p>
          <p class="text-2xl sm:text-3xl lg:text-6xl font-bold tabular-nums leading-none">{{ printerStats.printing }}</p>
        </div>

        <div class="rounded p-1.5 sm:p-2.5 lg:p-6 bg-sky-500/15 border border-sky-500/30 overflow-hidden flex flex-col">
          <p class="text-gray-300 text-xs lg:text-base mb-0.5 lg:mb-2 leading-tight">3D-printere ledig</p>
          <p class="text-2xl sm:text-3xl lg:text-6xl font-bold tabular-nums leading-none">{{ printerStats.idle }}</p>
        </div>

        <div class="rounded p-1.5 sm:p-2.5 lg:p-6 bg-orange-500/15 border border-orange-500/30 overflow-hidden flex flex-col">
          <p class="text-gray-300 text-xs lg:text-base mb-0.5 leading-tight">Lodde</p>
          <p class="text-xl sm:text-2xl lg:text-5xl font-bold leading-none">{{ loddestasjonLabel }}</p>
          <p class="text-xs text-gray-400 mt-0.5 lg:mt-1 leading-tight">{{ loddestasjonTempLabel }}</p>
        </div>

        <div class="rounded p-1.5 sm:p-2.5 lg:p-6 bg-fuchsia-500/15 border border-fuchsia-500/30 overflow-hidden flex flex-col">
          <p class="text-gray-300 text-xs lg:text-base mb-0.5 leading-tight">Laser</p>
          <p class="text-xl sm:text-2xl lg:text-5xl font-bold leading-none">{{ laserkutterInUse ? 'I bruk' : 'Ledig' }}</p>
          <p class="text-xs text-gray-400 mt-0.5 lg:mt-1 leading-tight hidden sm:block">Aksel</p>
        </div>

        <div class="rounded p-1.5 sm:p-2.5 lg:p-6 bg-violet-500/15 border border-violet-500/30 overflow-hidden flex flex-col">
          <p class="text-gray-300 text-xs lg:text-base mb-0.5 leading-tight">Printer</p>
          <p class="text-lg sm:text-xl lg:text-4xl font-bold leading-none">{{ hpStatusLabel }}</p>
          <p class="text-xs text-gray-400 mt-0.5 lg:mt-1 leading-tight hidden sm:block">HP</p>
        </div>

        <div class="rounded p-1.5 sm:p-2.5 lg:p-6 bg-cyan-500/15 border border-cyan-500/30 flex items-center gap-1 sm:gap-2 lg:gap-4 overflow-hidden">
          <img :src="weatherIcon" :alt="weatherLabel" class="w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 object-contain flex-shrink-0" />
          <div class="min-w-0 overflow-hidden">
            <p class="text-gray-300 text-xs lg:text-base mb-0.5 lg:mb-2 leading-tight hidden sm:block">Vær</p>
            <p class="text-xs sm:text-sm lg:text-3xl font-bold leading-tight break-words">{{ weatherLabel }}</p>
            <p class="text-xs text-gray-400 mt-0.5 lg:mt-2 leading-tight">{{ weatherTempLabel }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-2 sm:gap-3 lg:gap-5 flex-1 min-h-0 overflow-hidden">
        <div class="rounded p-2 sm:p-3 lg:p-6 bg-gray-900 border border-gray-800 flex flex-col justify-between overflow-hidden">
          <div class="overflow-hidden flex-1">
            <div class="flex items-center justify-between mb-1.5 sm:mb-2 lg:mb-5 flex-col sm:flex-row gap-1">
              <h2 class="text-base sm:text-lg lg:text-2xl font-semibold leading-tight">Miljødata</h2>
              <p class="text-xs text-gray-400 leading-tight">Sensor: {{ environment.nodeStatusLabel }}</p>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-4 mb-1.5 sm:mb-2 lg:mb-5 overflow-hidden">
              <div class="rounded p-1.5 sm:p-2 lg:p-4 bg-gradient-to-br from-red-500/15 to-red-500/5 border border-red-500/20 overflow-hidden">
                <p class="text-gray-400 text-xs mb-0.5 lg:mb-2 leading-tight">Temp</p>
                <p class="text-lg sm:text-2xl lg:text-4xl font-bold tabular-nums leading-tight">{{ environment.temperature }}<span class="text-xs sm:text-lg text-gray-400">°</span></p>
              </div>
              <div class="rounded p-1.5 sm:p-2 lg:p-4 bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-500/20 overflow-hidden">
                <p class="text-gray-400 text-xs mb-0.5 lg:mb-2 leading-tight">Fukt</p>
                <p class="text-lg sm:text-2xl lg:text-4xl font-bold tabular-nums leading-tight">{{ environment.humidity }}<span class="text-xs sm:text-lg text-gray-400">%</span></p>
              </div>
              <div class="rounded p-1.5 sm:p-2 lg:p-4 bg-gradient-to-br from-yellow-500/15 to-yellow-500/5 border border-yellow-500/20 overflow-hidden">
                <p class="text-gray-400 text-xs mb-0.5 leading-tight">Lys</p>
                <p class="text-lg sm:text-2xl lg:text-4xl font-bold leading-tight">{{ environment.lightLabel }}</p>
                <p class="text-xs text-gray-400 mt-0.5 lg:mt-2 leading-tight hidden sm:block">{{ environment.illuminanceLabel }}</p>
              </div>
              <div class="rounded p-1.5 sm:p-2 lg:p-4 bg-gradient-to-br from-green-500/15 to-green-500/5 border border-green-500/20 overflow-hidden">
                <p class="text-gray-400 text-xs mb-0.5 leading-tight">Bevegelse</p>
                <p class="text-lg sm:text-2xl lg:text-4xl font-bold leading-tight">{{ environment.motion ? 'Ja' : 'Nei' }}</p>
                <p class="text-xs text-gray-400 mt-0.5 lg:mt-2 leading-tight hidden sm:block">{{ environment.motionText }}</p>
              </div>
            </div>
          </div>

          <p class="text-gray-400 text-xs lg:text-lg leading-tight mt-1 flex-shrink-0">Oppdatert: {{ lastUpdatedText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const clock = ref('--:--')
const dateLabel = ref('')
const lastUpdatedText = ref('--')

const printerStats = ref({ printing: 0, idle: 0, total: 0 })
const laserkutterInUse = ref(false)
const loddestasjonTemp = ref(null)
const hpDesignjet = ref({ online: false, isPrinting: false, status: null })
const environment = ref({
  temperature: '--',
  humidity: '--',
  lightLabel: '--',
  motion: false,
  illuminanceLabel: '--',
  motionText: 'Ingen bevegelse',
  nodeStatusLabel: 'Ukjent'
})
const weather = ref({
  state: 'unknown',
  temperature: null,
  humidity: null,
  windSpeed: null,
  forecast: '—'
})

let dataIntervalId = null
let clockIntervalId = null

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const loddestasjonInUse = computed(() => (loddestasjonTemp.value || 0) > 35)
const loddestasjonLabel = computed(() => (loddestasjonInUse.value ? 'I bruk' : 'Ledig'))
const loddestasjonTempLabel = computed(() => {
  if (loddestasjonTemp.value === null) return 'Termisk kamera'
  return `${Math.round(loddestasjonTemp.value * 10) / 10}°C maks`
})

const hpStatusLabel = computed(() => {
  if (!hpDesignjet.value.online) return 'Frakoblet'
  return hpDesignjet.value.isPrinting ? 'I bruk' : 'Ledig'
})

const hpMessage = computed(() => {
  if (!hpDesignjet.value.online) return 'HP DesignJet T630 er utilgjengelig'
  return hpDesignjet.value.status?.message || 'HP DesignJet T630'
})

const weatherLabel = computed(() => {
  const labelMap = {
    sunny: 'Sol',
    clear: 'Klart',
    cloudy: 'Skyet',
    partlycloudy: 'Delvis skyet',
    rainy: 'Regn',
    pouring: 'Kraftig regn',
    snowy: 'Snø',
    fog: 'Tåke',
    windy: 'Vind',
    lightning: 'Torden',
    'lightning-rainy': 'Tordenregn',
    exceptional: 'Varsel'
  }

  return labelMap[weather.value.state] || '—'
})

const weatherTempLabel = computed(() => {
  if (weather.value.temperature === null || weather.value.temperature === undefined) return '—'
  return `${Math.round(Number(weather.value.temperature))}°C`
})

const weatherIcon = computed(() => {
  const iconMap = {
    sunny: '/weather icon/sunny.svg',
    clear: '/weather icon/moon.svg',
    cloudy: '/weather icon/cloud.svg',
    partlycloudy: '/weather icon/partlycloudy.svg',
    rainy: '/weather icon/rain.svg',
    pouring: '/weather icon/lightningpouring.svg',
    snowy: '/weather icon/snowy.svg',
    fog: '/weather icon/fog.svg',
    lightning: '/weather icon/thunder.svg',
    'lightning-rainy': '/weather icon/lightningpouring.svg',
    exceptional: '/weather icon/cloud.svg'
  }

  return iconMap[weather.value.state] || '/weather icon/cloud.svg'
})

function updateClock() {
  const now = new Date()
  clock.value = now.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
  dateLabel.value = now.toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

async function fetchData() {
  try {
    const [printerRes, laserkutterRes, loddestasjonRes, hpRes, environmentRes, weatherRes] = await Promise.all([
      fetch('/api/printer-stats'),
      fetch('/api/laserkutter-sensor'),
      fetch('/api/loddestasjon-sensor'),
      fetch('/api/hp-designjet'),
      fetch('/api/multisensor'),
      fetch('/api/weather-outdoor')
    ])

    if (printerRes.ok) {
      const data = await printerRes.json()
      if (data?.success && data?.stats) {
        printerStats.value = {
          printing: data.stats.printing || 0,
          idle: data.stats.idle || 0,
          total: data.stats.total || 0
        }
      }
    }

    if (laserkutterRes.ok) {
      const data = await laserkutterRes.json()
      laserkutterInUse.value = data?.inUse === true
    }

    if (loddestasjonRes.ok) {
      const data = await loddestasjonRes.json()
      const temp = parseFloat(data?.thermalMax)
      loddestasjonTemp.value = Number.isFinite(temp) ? temp : null
    }

    if (hpRes.ok) {
      hpDesignjet.value = await hpRes.json()
    }

    if (environmentRes.ok) {
      const data = await environmentRes.json()
      const lux = parseFloat(data?.illuminance)
      const nodeStatusMap = {
        alive: 'Aktiv',
        awake: 'Våken',
        asleep: 'Sover',
        dead: 'Ingen kontakt'
      }

      environment.value = {
        temperature: data?.temperature !== null ? Math.round(parseFloat(data.temperature) * 10) / 10 : '--',
        humidity: data?.humidity !== null ? Math.round(parseFloat(data.humidity)) : '--',
        lightLabel: Number.isFinite(lux) && lux > 5 ? 'På' : 'Av',
        motion: data?.motion === 'on',
        illuminanceLabel: Number.isFinite(lux) ? `${Math.round(lux)} lux` : 'Ukjent lysstyrke',
        motionText: data?.motion === 'on' ? 'Registrert nå' : 'Rolig område',
        nodeStatusLabel: nodeStatusMap[data?.nodeStatus] || 'Ukjent'
      }
    }

    if (weatherRes.ok) {
      const data = await weatherRes.json()
      if (data?.weather) {
        weather.value = data.weather
      }
    }

    const now = new Date()
    lastUpdatedText.value = now.toLocaleTimeString('nb-NO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (e) {
    console.error('Feil ved oppdatering av oppslagsdata:', e)
  }
}

function preventScroll(e) {
  e.preventDefault()
}

onMounted(() => {
  if (process.client) {
    previousBodyOverflow = document.body.style.overflow
    previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
  }

  updateClock()
  fetchData()

  clockIntervalId = setInterval(updateClock, 1000)
  dataIntervalId = setInterval(fetchData, 15000)
})

onUnmounted(() => {
  if (clockIntervalId) clearInterval(clockIntervalId)
  if (dataIntervalId) clearInterval(dataIntervalId)

  if (process.client) {
    window.removeEventListener('wheel', preventScroll)
    window.removeEventListener('touchmove', preventScroll)
    document.body.style.overflow = previousBodyOverflow
    document.documentElement.style.overflow = previousHtmlOverflow
  }
})
</script>
