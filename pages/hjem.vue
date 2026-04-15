<template>
  <div :class="isDark ? 'home-dark min-h-screen bg-gray-900' : 'min-h-screen bg-white'">
    <Header />

    <div class="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">

      <!-- Velkomst -->
      <div class="mb-10">
        <h1 class="text-4xl font-bold text-gray-900 mb-1">Makerspace</h1>
        <p class="text-gray-400 text-lg">Sanntids oversikt over verksted og utstyr</p>
      </div>

      <!-- Lab-bilde med info -->
      <section class="mb-10">
        <div class="relative rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
          <!-- Bilde -->
          <img
            src="/makerpsace.jpg"
            alt="Makerspace labben"
            class="w-full h-56 sm:h-72 object-cover"
          />
          <!-- Mørk overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <!-- Tekst over bildet -->
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h2 class="text-white text-2xl font-bold mb-1">Høgskolen i Østfold – Makerspace</h2>
            <p class="text-gray-300 text-sm">Et åpent verksted for studenter og ansatte</p>
          </div>
        </div>

        <!-- Info-rad under bildet -->
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">

          <!-- Åpningstider -->
          <div class="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Bemannet</p>
              <p class="text-sm text-gray-700">Man–fre: 12:00–16:00</p>
            </div>
          </div>

          <!-- Lokasjon -->
          <div class="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Lokasjon</p>
              <p class="text-sm text-gray-700">Høgskolen i Østfold</p>
              <p class="text-sm text-gray-400">Rom D1-044</p>
            </div>
          </div>

          <!-- Tilgang -->
          <div class="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Tilgang</p>
              <p class="text-sm text-gray-700">Studenter og ansatte</p>
              <p class="text-sm text-gray-400">Kreves studentkort etter klokken 16:00</p>
            </div>
          </div>

        </div>
      </section>

      <!-- Utstyrsstatus -->
      <section class="mb-8">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Utstyr</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <!-- 3D-Printere -->
          <div class="relative bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div v-if="hasPrinterAlerts" class="absolute top-3 right-3 text-yellow-500" :title="printerAlertMessage">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3H6C4.9 3 4 3.9 4 5v4c-1.1 0-2 .9-2 2v6h4v4h12v-4h4v-6c0-1.1-.9-2-2-2V5c0-1.1-.9-2-2-2zm-2 14H8v-4h8v4zm2-6v-2H6v2H4V9h16v2h-2z"/>
              </svg>
              <span class="text-sm font-medium text-gray-500">3D-Printere</span>
            </div>
            <div v-if="loadingPrinters" class="space-y-2">
              <div class="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div v-else>
              <div class="flex items-center gap-2 mb-1">
                <span
                  :class="printersPrinting > 0 ? 'bg-orange-400' : 'bg-green-400'"
                  class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                ></span>
                <p class="text-2xl font-bold text-gray-900">
                  {{ printersPrinting > 0 ? printersPrinting + ' i bruk' : 'Alle ledige' }}
                </p>
              </div>
              <p class="text-sm text-gray-400">{{ printersIdle }} ledig · {{ printers.length }} totalt</p>
            </div>
          </div>

          <!-- Loddestasjon -->
          <div class="relative bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div v-if="hasLoddestasjonAlert" class="absolute top-3 right-3 text-yellow-500" :title="loddestasjonAlertMessage">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19v2M9 21h6"/>
              </svg>
              <span class="text-sm font-medium text-gray-500">Loddestasjon</span>
            </div>
            <div v-if="loadingLoddestasjon" class="space-y-2">
              <div class="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-4 w-36 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div v-else>
              <div class="flex items-center gap-2 mb-1">
                <span
                  :class="loddestasjonInUse ? 'bg-orange-400' : 'bg-green-400'"
                  class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                ></span>
                <p class="text-2xl font-bold text-gray-900">{{ loddestasjonInUse ? 'I bruk' : 'Ledig' }}</p>
              </div>
              <p class="text-sm text-gray-400">
                <span v-if="loddestasjonInUse && loddestasjonTemp !== null">{{ loddestasjonTemp }}°C maks · termisk kamera</span>
                <span v-else>Basert på termisk kamera</span>
              </p>
            </div>
          </div>

          <!-- Laserkutter -->
          <div class="relative bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div v-if="hasLaserkutterAlert" class="absolute top-3 right-3 text-yellow-500" :title="laserkutterAlertMessage">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 3l14 9-14 9V3z"/>
              </svg>
              <span class="text-sm font-medium text-gray-500">Laserkutter</span>
            </div>
            <div v-if="loadingLaserkutter" class="space-y-2">
              <div class="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-4 w-36 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div v-else>
              <div class="flex items-center gap-2 mb-1">
                <span
                  :class="laserkutterInUse ? 'bg-orange-400' : 'bg-green-400'"
                  class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                ></span>
                <p class="text-2xl font-bold text-gray-900">{{ laserkutterInUse ? 'I bruk' : 'Ledig' }}</p>
              </div>
              <p class="text-sm text-gray-400">Basert på akselerometer</p>
            </div>
          </div>

          <!-- HP DesignJet T630 -->
          <div class="relative bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div v-if="hasHpDesignjetAlert" class="absolute top-3 right-3 text-yellow-500" :title="hpDesignjetAlertMessage">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 17H7a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2zM5 9H3m18 0h-2M12 17v2m0-10V7"/>
              </svg>
              <span class="text-sm font-medium text-gray-500">Storformatskriver</span>
            </div>
            <div v-if="loadingHpDesignjet" class="space-y-2">
              <div class="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-4 w-36 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div v-else-if="!hpDesignjet.online">
              <div class="flex items-center gap-2 mb-1">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gray-400"></span>
                <p class="text-2xl font-bold text-gray-900">Frakoblet</p>
              </div>
              <p class="text-sm text-gray-400">HP DesignJet T630</p>
            </div>
            <div v-else>
              <div class="flex items-center gap-2 mb-1">
                <span
                  :class="hpDesignjet.isPrinting ? 'bg-blue-400 animate-pulse' : 'bg-green-400'"
                  class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                ></span>
                <p class="text-2xl font-bold text-gray-900">
                  {{ hpDesignjet.isPrinting ? 'I bruk' : 'Ledig' }}
                </p>
              </div>
              <p class="text-sm text-gray-400">
                {{ hpDesignjet.status?.message || 'HP DesignJet T630' }}
              </p>
            </div>
          </div>

        </div>
      </section>

      <!-- Verkstedmiljø -->
      <section class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400">Verkstedmiljø</h2>
          <span v-if="lastSensorUpdate" class="text-xs text-gray-400">Oppdatert {{ lastSensorUpdate }}</span>
        </div>

        <div v-if="loadingSensor" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="bg-gray-50 rounded-2xl p-5 border border-gray-100 h-28 animate-pulse"></div>
        </div>

        <div v-else-if="sensorError" class="bg-red-50 rounded-2xl p-5 border border-red-100 text-red-500 text-sm">
          Kunne ikke hente miljødata: {{ sensorError }}
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">

          <!-- Temperatur -->
          <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19V6a3 3 0 016 0v13a5 5 0 11-6 0z"/>
              </svg>
              <span class="text-sm text-gray-500 font-medium">Temperatur</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">
              {{ sensorData.temperature }}<span class="text-sm font-normal text-gray-400">&#176;C</span>
            </p>
          </div>

          <!-- Luftfuktighet -->
          <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 2C6 10 6 14 12 18c6-4 6-8 0-16z"/>
              </svg>
              <span class="text-sm text-gray-500 font-medium">Luftfuktighet</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">
              {{ sensorData.humidity }}<span class="text-sm font-normal text-gray-400">%</span>
            </p>
          </div>

          <!-- Lys -->
          <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <span class="text-sm text-gray-500 font-medium">Lys</span>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="lightOn ? 'bg-green-400' : 'bg-gray-300'"
                class="w-2.5 h-2.5 rounded-full flex-shrink-0"
              ></span>
              <p class="text-2xl font-bold text-gray-900">{{ lightOn ? 'På' : 'Av' }}</p>
            </div>
          </div>

          <!-- Bevegelse -->
          <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span class="text-sm text-gray-500 font-medium">Bevegelse</span>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="sensorData.motion ? 'bg-green-400 animate-pulse' : 'bg-gray-300'"
                class="w-2.5 h-2.5 rounded-full flex-shrink-0"
              ></span>
              <p class="text-2xl font-bold text-gray-900">{{ sensorData.motion ? 'Ja' : 'Nei' }}</p>
            </div>
          </div>

        </div>

        <div v-if="!loadingSensor && !sensorError && sensorData.nodeStatus" class="mt-3 flex items-center gap-2">
          <span
            :class="{
              'bg-green-400 animate-pulse': sensorData.nodeStatus === 'alive',
              'bg-yellow-400': sensorData.nodeStatus === 'awake',
              'bg-gray-400': sensorData.nodeStatus === 'asleep',
              'bg-red-400': sensorData.nodeStatus === 'dead'
            }"
            class="w-2 h-2 rounded-full flex-shrink-0"
          ></span>
          <span class="text-xs text-gray-400">Sensor: {{ nodeStatusText }}</span>
        </div>
      </section>

      <!-- Snarvei -->
      <section>
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Gå til</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          <NuxtLink
            to="/3dprintere"
            class="group flex items-center justify-between gap-3 rounded-2xl p-5 min-h-[96px] text-white shadow-sm transition-colors duration-200 bg-orange-500 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2"
          >
            <div class="min-w-0">
              <p class="text-base sm:text-lg font-semibold leading-none whitespace-nowrap truncate">3D-Printere</p>
              <p class="mt-1 text-sm text-white/80 leading-none whitespace-nowrap truncate">Administrer og overvåk</p>
            </div>
            <svg class="w-5 h-5 flex-shrink-0 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/loddestasjon"
            class="group flex items-center justify-between gap-3 rounded-2xl p-5 min-h-[96px] text-white shadow-sm transition-colors duration-200 bg-blue-500 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
          >
            <div class="min-w-0">
              <p class="text-base sm:text-lg font-semibold leading-none whitespace-nowrap truncate">Loddestasjon</p>
              <p class="mt-1 text-sm text-white/80 leading-none whitespace-nowrap truncate">Sjekk tilgjengelighet</p>
            </div>
            <svg class="w-5 h-5 flex-shrink-0 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/laserkutter"
            class="group flex items-center justify-between gap-3 rounded-2xl p-5 min-h-[96px] text-white shadow-sm transition-colors duration-200 bg-purple-500 hover:bg-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2"
          >
            <div class="min-w-0">
              <p class="text-base sm:text-lg font-semibold leading-none whitespace-nowrap truncate">Laserkutter</p>
              <p class="mt-1 text-sm text-white/80 leading-none whitespace-nowrap truncate">Se status og effekt</p>
            </div>
            <svg class="w-5 h-5 flex-shrink-0 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/storformatprinter"
            class="group flex items-center justify-between gap-3 rounded-2xl p-5 min-h-[96px] text-white shadow-sm transition-colors duration-200 bg-sky-500 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
          >
            <div class="min-w-0">
              <p class="text-base sm:text-lg font-semibold leading-none whitespace-nowrap truncate">Storformatskriver</p>
              <p class="mt-1 text-sm text-white/80 leading-none whitespace-nowrap truncate">Blekk, status og jobbkø</p>
            </div>
            <svg class="w-5 h-5 flex-shrink-0 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>

          <WallDisplayLaunch />

        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useState } from '#app';
import Header from '../components/Header.vue';
import WallDisplayLaunch from '../components/WallDisplayLaunch.vue';
import { sharedPrinterList } from '../components/printerState.js';
import { loddestasjonInUse as sharedLoddestasjonInUse, updateLoddestasjonUsage } from '../components/loddestasjonState.js';

const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false;
  }
  return false;
});

const printers = sharedPrinterList;
const loadingPrinters = ref(true);
const printersError = ref(null);
const loadingLoddestasjon = ref(true);
const loddestasjonError = ref(null);
const loadingLaserkutter = ref(true);
const laserkutterError = ref(null);
const loadingSensor = ref(true);
const sensorError = ref(null);
const lastSensorUpdate = ref('');

const loddestasjonInUse = sharedLoddestasjonInUse;
const loddestasjonTemp = ref(null);
const laserkutterInUse = ref(false);
const loadingHpDesignjet = ref(true);
const hpDesignjetError = ref(null);
const hpDesignjet = ref({ online: false, isPrinting: false, status: null, ink: [] });
const user = useState('user', () => '');
const isAdmin = computed(() => user.value !== '');

const sensorData = ref({
  temperature: '--',
  humidity: '--',
  illuminance: '--',
  motion: false,
  nodeStatus: null
});

let printerIntervalId = null;
let sensorIntervalId = null;

const printersIdle = computed(() =>
  printers.value.filter(p => p.state === 'IDLE' || p.state === 'READY').length
);
const printersPrinting = computed(() =>
  printers.value.filter(p => p.state === 'PRINTING').length
);

const hasPrinterAlerts = computed(() => {
  if (!isAdmin.value || loadingPrinters.value) return false;
  if (printersError.value) return true;
  const errorStates = ['ERROR', 'ATTENTION', 'STOPPED'];
  return printers.value.some(p => {
    const state = (p.state || '').toUpperCase();
    return p?.error || errorStates.includes(state);
  });
});

const hasLoddestasjonAlert = computed(() =>
  isAdmin.value && !loadingLoddestasjon.value && !!loddestasjonError.value
);

const hasLaserkutterAlert = computed(() =>
  isAdmin.value && !loadingLaserkutter.value && !!laserkutterError.value
);

const hasLowInk = computed(() => {
  if (!hpDesignjet.value?.ink || hpDesignjet.value.ink.length === 0) return false;
  return hpDesignjet.value.ink.some(ink => typeof ink.level === 'number' && ink.level < 20);
});

const hasHpDesignjetAlert = computed(() => {
  if (!isAdmin.value || loadingHpDesignjet.value) return false;
  if (hpDesignjetError.value) return true;
  if (!hpDesignjet.value.online) return true;
  const category = (hpDesignjet.value.status?.category || '').toLowerCase();
  return category === 'error' || category === 'warning' || hasLowInk.value;
});

const printerAlertMessage = computed(() => {
  if (!hasPrinterAlerts.value) return '';
  if (printersError.value) return printersError.value;
  const errorStates = ['ERROR', 'ATTENTION', 'STOPPED'];
  const offenders = printers.value
    .filter(p => p?.error || errorStates.includes((p.state || '').toUpperCase()))
    .map(p => p.displayName || p.hostname || p.ip)
    .filter(Boolean);
  return offenders.length > 0
    ? `Feil på: ${offenders.join(', ')}`
    : 'Feil på en eller flere printere';
});

const loddestasjonAlertMessage = computed(() => {
  if (!hasLoddestasjonAlert.value) return '';
  return loddestasjonError.value || 'Feil ved loddestasjon';
});

const laserkutterAlertMessage = computed(() => {
  if (!hasLaserkutterAlert.value) return '';
  return laserkutterError.value || 'Feil ved laserkutter';
});

const hpDesignjetAlertMessage = computed(() => {
  if (!hasHpDesignjetAlert.value) return '';
  const messages = [];
  if (hpDesignjetError.value) messages.push(hpDesignjetError.value);
  if (!hpDesignjet.value.online) messages.push('Printer frakoblet');
  const category = (hpDesignjet.value.status?.category || '').toLowerCase();
  if (category === 'error' || category === 'warning') {
    messages.push(hpDesignjet.value.status?.message || 'Feilstatus');
  }
  if (hasLowInk.value) messages.push('Lite blekk (under 20%)');
  return messages.join(' · ');
});

const lightOn = computed(() => {
  const lux = parseFloat(sensorData.value.illuminance);
  return !isNaN(lux) && lux > 5;
});

const nodeStatusText = computed(() => {
  switch (sensorData.value.nodeStatus) {
    case 'alive': return 'Aktiv';
    case 'awake': return 'Våken';
    case 'asleep': return 'Sover';
    case 'dead': return 'Ingen kontakt';
    default: return 'Ukjent';
  }
});

async function fetchPrinters() {
  try {
    const res = await fetch('/api/prusa');
    if (res.ok) {
      const data = await res.json();
      printers.value = Array.isArray(data) ? data : [data];
      printersError.value = null;
    } else {
      printersError.value = 'Kunne ikke hente printerstatus';
    }
  } catch (e) {
    console.error('Feil ved henting av printere:', e);
    printersError.value = 'Feil ved henting av printere';
  } finally {
    loadingPrinters.value = false;
  }
}

async function fetchLoddestasjon() {
  try {
    const res = await fetch('/api/loddestasjon-sensor');
    if (res.ok) {
      const data = await res.json();
      const maxTemp = parseFloat(data.thermalMax);
      updateLoddestasjonUsage(!isNaN(maxTemp) ? maxTemp : null);
      loddestasjonTemp.value = !isNaN(maxTemp) ? maxTemp : null;
      loddestasjonError.value = null;
    } else {
      loddestasjonError.value = 'Kunne ikke hente loddestasjon';
    }
  } catch (e) {
    console.error('Feil ved henting av loddestasjon:', e);
    loddestasjonError.value = 'Feil ved henting av loddestasjon';
  } finally {
    loadingLoddestasjon.value = false;
  }
}

async function fetchLaserkutter() {
  try {
    const res = await fetch('/api/laserkutter-sensor');
    if (res.ok) {
      const data = await res.json();
      laserkutterInUse.value = data.inUse === true;
      laserkutterError.value = null;
    } else {
      laserkutterError.value = 'Kunne ikke hente laserkutter';
    }
  } catch (e) {
    console.error('Feil ved henting av laserkutter:', e);
    laserkutterError.value = 'Feil ved henting av laserkutter';
  } finally {
    loadingLaserkutter.value = false;
  }
}

async function fetchHpDesignjet() {
  try {
    const res = await fetch('/api/hp-designjet');
    if (res.ok) {
      hpDesignjet.value = await res.json();
      hpDesignjetError.value = null;
    } else {
      hpDesignjetError.value = 'Kunne ikke hente storformatskriver';
    }
  } catch (e) {
    console.error('Feil ved henting av HP DesignJet:', e);
    hpDesignjetError.value = 'Feil ved henting av storformatskriver';
  } finally {
    loadingHpDesignjet.value = false;
  }
}

async function fetchSensorData() {
  try {
    const res = await fetch('/api/multisensor');
    if (res.ok) {
      const data = await res.json();
      if (data.error) {
        sensorError.value = data.error;
      } else {
        sensorData.value = {
          temperature: data.temperature !== null ? Math.round(parseFloat(data.temperature) * 10) / 10 : '--',
          humidity: data.humidity !== null ? Math.round(parseFloat(data.humidity)) : '--',
          illuminance: data.illuminance !== null ? parseFloat(data.illuminance) : '--',
          motion: data.motion === 'on',
          nodeStatus: data.nodeStatus || null
        };
        sensorError.value = null;
        const now = new Date();
        lastSensorUpdate.value = now.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
      }
    } else {
      sensorError.value = 'Kunne ikke hente sensordata';
    }
  } catch (e) {
    sensorError.value = 'Feil ved henting av data';
  } finally {
    loadingSensor.value = false;
  }
}

onMounted(() => {
  if (printers.value.length > 0) {
    loadingPrinters.value = false;
  } else {
    fetchPrinters();
  }

  fetchLoddestasjon();
  fetchLaserkutter();
  fetchHpDesignjet();
  fetchSensorData();

  printerIntervalId = setInterval(() => {
    fetchPrinters();
    fetchLoddestasjon();
    fetchLaserkutter();
    fetchHpDesignjet();
  }, 15000);

  const now = new Date();
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 2000;
  setTimeout(() => {
    fetchSensorData();
    sensorIntervalId = setInterval(fetchSensorData, 60000);
  }, msUntilNextMinute);
});

onUnmounted(() => {
  if (printerIntervalId) clearInterval(printerIntervalId);
  if (sensorIntervalId) clearInterval(sensorIntervalId);
});
</script>

<style scoped>
.home-dark .bg-gray-50 {
  background-color: #1f2937 !important;
}

.home-dark .bg-gray-100 {
  background-color: #111827 !important;
}

.home-dark .border-gray-100,
.home-dark .border-gray-200 {
  border-color: #374151 !important;
}

.home-dark .text-gray-900 {
  color: #f3f4f6 !important;
}

.home-dark .text-gray-700,
.home-dark .text-gray-600 {
  color: #d1d5db !important;
}

.home-dark .text-gray-500,
.home-dark .text-gray-400 {
  color: #9ca3af !important;
}

.home-dark .bg-red-50 {
  background-color: rgba(127, 29, 29, 0.25) !important;
}

.home-dark .border-red-100 {
  border-color: rgba(185, 28, 28, 0.45) !important;
}

.home-dark .text-red-500 {
  color: #fca5a5 !important;
}
</style>