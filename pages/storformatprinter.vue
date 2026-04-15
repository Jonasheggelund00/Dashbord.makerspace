<template>
  <div :class="isDark ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-gray-50'">
    <Header />

    <div class="max-w-5xl mx-auto mt-12 px-4 pb-12">

      <!-- Toppseksjon -->
      <div class="mb-8">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <h1 :class="isDark ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-gray-900'">
              HP DesignJet T630
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

          <!-- Status-pille -->
          <div
            v-if="!loading && data.online"
            :class="[
              'flex items-center gap-3 px-3 py-1 rounded-full border',
              isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-700'
            ]"
          >
            <div
              class="w-2.5 h-2.5 rounded-full"
              :class="{
                'bg-orange-400 animate-pulse': data.isPrinting,
                'bg-green-500': !data.isPrinting
              }"
            ></div>
            <span :class="isDark ? 'text-sm font-medium text-gray-200' : 'text-sm font-medium text-gray-700'">
              {{ data.isPrinting ? 'I bruk' : 'Ledig' }}
            </span>
          </div>
          <div v-else-if="loading" class="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
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
          <li>Ingen eksterne sensorer - status og blekknivå hentes fra skriveren</li>
        </ul>
        <p :class="['mt-3 font-semibold', isDark ? 'text-gray-100' : 'text-gray-800']">Datahenting</p>
        <ul class="mt-2 list-disc pl-5 space-y-1">
          <li>/api/hp-designjet</li>
          <li>Oppdateres hvert 20. sekund</li>
        </ul>
      </div>

      <!-- Feil: printer ikke tilgjengelig -->
      <div v-if="!loading && !data.online" :class="isDark ? 'rounded-xl border border-red-900/50 bg-red-950/30 p-6 flex items-start gap-4 mb-6' : 'rounded-xl border border-red-200 bg-red-50 p-6 flex items-start gap-4 mb-6'">
        <svg class="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        <div>
          <p :class="isDark ? 'font-semibold text-red-400' : 'font-semibold text-red-700'">Finner ingen informasjon fra printeren</p>
          <p :class="isDark ? 'text-sm text-red-500/80 mt-1' : 'text-sm text-red-500 mt-1'">Kan ikke hente data fra HP DesignJet T630.</p>
          <p :class="isDark ? 'text-sm text-red-500/60 mt-0.5' : 'text-sm text-red-400 mt-0.5'">Sjekk at printeren er skrudd på, ikke i strømsparingsmodus, og koblet til nettverket.</p>
        </div>
      </div>

      <!-- Innhold når online -->
      <div v-if="!loading && data.online" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- VENSTRE: Status + Bilde -->
        <div class="space-y-6">

          <!-- Illustrasjon + modellinfo -->
          <div :class="isDark ? 'rounded-xl bg-gray-800 overflow-hidden' : 'rounded-xl bg-white shadow-sm overflow-hidden'">
            <div :class="isDark ? 'bg-gray-700/40 flex items-center justify-center p-8' : 'bg-gray-100 flex items-center justify-center p-8'">
              <img src="/designjet.png" alt="HP DesignJet T630" class="object-contain h-52 drop-shadow-sm" />
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between">
                <div>
                  <p :class="isDark ? 'text-base font-semibold text-white' : 'text-base font-semibold text-gray-900'">HP DesignJet T630</p>
                  <p :class="isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-500'">Storformatskriver (A0/A1)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Skrivestatus -->
          <div :class="isDark ? 'rounded-xl bg-gray-800 p-6' : 'rounded-xl bg-white shadow-sm p-6'">
            <h2 :class="isDark ? 'text-base font-semibold text-white mb-4' : 'text-base font-semibold text-gray-900 mb-4'">
              Skrivestatus
            </h2>
            <div class="flex items-center gap-3">
              <span
                class="w-3 h-3 rounded-full flex-shrink-0"
                :class="{
                  'bg-blue-500 animate-pulse': data.isPrinting,
                  'bg-green-500': !data.isPrinting && data.status?.category !== 'error',
                  'bg-red-500': data.status?.category === 'error',
                }"
              ></span>
              <span :class="isDark ? 'text-lg font-medium text-gray-200' : 'text-lg font-medium text-gray-800'">
                {{ data.status?.message || 'Ukjent' }}
              </span>
            </div>

            <!-- Rullestatus -->
            <div :class="isDark ? 'mt-4 pt-4 border-t border-gray-700' : 'mt-4 pt-4 border-t border-gray-100'">
              <div class="flex items-center justify-between">
                <span :class="isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-500'">Papirrull</span>
                <div v-if="data.roll" class="flex items-center gap-2">
                  <span
                    class="text-xs font-medium"
                    :class="data.roll.loaded
                      ? isDark ? 'text-green-400' : 'text-green-600'
                      : isDark ? 'text-gray-500' : 'text-gray-400'"
                  >
                    {{ data.roll.loaded ? 'Lastet inn' : 'Ingen rull' }}
                  </span>
                  <span
                    v-if="data.roll.widthLabel"
                    class="text-xs font-mono px-2 py-1 rounded"
                    :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ data.roll.widthLabel }}
                  </span>
                </div>
                <span v-else :class="isDark ? 'text-xs text-gray-500' : 'text-xs text-gray-400'">Ukjent</span>
              </div>
            </div>

            <p v-if="lastUpdated" :class="isDark ? 'text-xs text-gray-600 mt-3' : 'text-xs text-gray-400 mt-3'">
              Sist oppdatert: {{ lastUpdated }}
            </p>

                  <!-- Oppdater-knapp -->
      <div class="mt-6 flex justify-end">
        <button
          @click="fetchData"
          :disabled="loading"
          class="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
          :class="isDark
            ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
        >
          <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ loading ? 'Oppdaterer...' : 'Oppdater' }}
        </button>
      </div>
          </div>
        </div>

        <!-- HØYRE: Blekk + Jobbkø -->
        <div class="space-y-6">

          <!-- Blekknivåer -->
          <div :class="isDark ? 'rounded-xl bg-gray-800 p-6' : 'rounded-xl bg-white shadow-sm p-6'">
            <h2 :class="isDark ? 'text-base font-semibold text-white mb-4' : 'text-base font-semibold text-gray-900 mb-4'">
              Blekknivåer
            </h2>

            <div v-if="data.ink && data.ink.length > 0" class="space-y-3">
              <div v-for="ink in data.ink" :key="ink.colorCode" class="flex items-center gap-3">
                <!-- Fargeindikator -->
                <span
                  class="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                  :style="{ backgroundColor: ink.hex }"
                ></span>
                <!-- Fargenavn -->
                <span :class="isDark ? 'text-sm text-gray-300 w-28 flex-shrink-0' : 'text-sm text-gray-600 w-28 flex-shrink-0'">
                  {{ ink.color }}
                </span>
                <!-- Progress bar -->
                <div class="flex-1">
                  <div :class="isDark ? 'w-full bg-gray-700 rounded-full h-2' : 'w-full bg-gray-200 rounded-full h-2'">
                    <div
                      class="h-2 rounded-full transition-all duration-500"
                      :style="{
                        width: ink.level !== null ? ink.level + '%' : '0%',
                        backgroundColor: ink.level !== null && ink.level < 15 ? '#ef4444' : ink.hex
                      }"
                    ></div>
                  </div>
                </div>
                <!-- Prosent -->
                <span
                  :class="[
                    'text-sm font-semibold w-10 text-right flex-shrink-0',
                    ink.level !== null && ink.level < 15
                      ? 'text-red-500'
                      : isDark ? 'text-gray-300' : 'text-gray-700'
                  ]"
                >
                  {{ ink.level !== null ? ink.level + '%' : '—' }}
                </span>
              </div>
            </div>

            <div v-else :class="isDark ? 'text-sm text-gray-500 py-4 text-center' : 'text-sm text-gray-400 py-4 text-center'">
              Ingen blekkinformasjon tilgjengelig
            </div>
          </div>

          <!-- Jobbkø -->
          <div :class="isDark ? 'rounded-xl bg-gray-800 p-6' : 'rounded-xl bg-white shadow-sm p-6'">
            <div class="flex items-center justify-between mb-4">
              <h2 :class="isDark ? 'text-base font-semibold text-white' : 'text-base font-semibold text-gray-900'">
                Jobbkø
              </h2>
              <span
                v-if="data.jobs && data.jobs.length > 0"
                class="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
              >
                {{ data.jobs.length }} {{ data.jobs.length === 1 ? 'jobb' : 'jobber' }}
              </span>
            </div>

            <div v-if="data.jobs && data.jobs.length > 0" class="space-y-3">
              <div
                v-for="job in data.jobs"
                :key="job.id || job.name"
                :class="isDark ? 'bg-gray-700/50 rounded-lg p-4' : 'bg-gray-50 rounded-lg p-4 border border-gray-100'"
              >
                <div class="flex items-start justify-between gap-2 mb-1">
                  <p :class="isDark ? 'text-sm font-medium text-gray-200 break-all' : 'text-sm font-medium text-gray-800 break-all'">
                    {{ job.name }}
                  </p>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                    :class="jobStateBadgeClass(job.stateRaw)"
                  >
                    {{ job.state }}
                  </span>
                </div>
                <div class="flex items-center gap-3 mt-1">
                  <p v-if="job.user" :class="isDark ? 'text-xs text-gray-500' : 'text-xs text-gray-400'">
                    {{ job.user }}
                  </p>
                  <p v-if="job.pagesRequested" :class="isDark ? 'text-xs text-gray-500' : 'text-xs text-gray-400'">
                    Side {{ job.pagesCompleted }} / {{ job.pagesRequested }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else :class="isDark ? 'text-sm text-gray-500 py-4 text-center' : 'text-sm text-gray-400 py-4 text-center'">
              <svg class="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              Ingen jobber i køen
            </div>
          </div>
        </div>
      </div>

      <!-- Skeleton loader -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-6">
          <div class="h-64 rounded-xl bg-gray-200 animate-pulse"></div>
          <div class="h-28 rounded-xl bg-gray-200 animate-pulse"></div>
        </div>
        <div class="space-y-6">
          <div class="h-52 rounded-xl bg-gray-200 animate-pulse"></div>
          <div class="h-48 rounded-xl bg-gray-200 animate-pulse"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useState } from '#app';
import Header from '../components/Header.vue';

const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false;
  }
  return false;
});

const loading = ref(true);
const lastUpdated = ref('');
const showInfo = ref(false);
const data = ref({
  online: false,
  isPrinting: false,
  status: { category: 'unknown', message: 'Laster...', raw: null },
  ink: [],
  jobs: [],
  roll: null,
});

let intervalId = null;

function jobStateBadgeClass(stateRaw) {
  const s = (stateRaw || '').toLowerCase();
  if (s.includes('processing') || s.includes('printing')) {
    return 'bg-blue-100 text-blue-700';
  }
  if (s.includes('pending') || s.includes('queue')) {
    return 'bg-yellow-100 text-yellow-700';
  }
  if (s.includes('completed') || s.includes('finished')) {
    return 'bg-green-100 text-green-700';
  }
  if (s.includes('cancelled') || s.includes('aborted') || s.includes('error')) {
    return 'bg-red-100 text-red-700';
  }
  return 'bg-gray-100 text-gray-600';
}

async function fetchData(isInitial = false) {
  if (isInitial) {
    loading.value = true;
  }
  try {
    const res = await fetch('/api/hp-designjet');
    if (res.ok) {
      const newData = await res.json();
      // Oppdater feltene individuelt for å opprettholde Vue reaktivitet
      data.value.online = newData.online;
      data.value.isPrinting = newData.isPrinting;
      data.value.status = newData.status;
      data.value.ink = newData.ink;
      data.value.jobs = newData.jobs;
      data.value.roll = newData.roll;
      const now = new Date();
      lastUpdated.value = now.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else {
      data.value.online = false;
    }
  } catch (e) {
    console.error('Feil ved henting av HP DesignJet data:', e);
    data.value.online = false;
  } finally {
    if (isInitial) {
      loading.value = false;
    }
  }
}

onMounted(() => {
  fetchData(true);
  intervalId = setInterval(() => fetchData(false), 20000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
