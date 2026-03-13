<template>
  <div :class="isDark ? 'min-h-screen bg-gradient-to-b from-gray-900 to-gray-800' : 'min-h-screen bg-white'">
    <Header />

    <div class="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">

      <!-- Heading -->
      <div class="mb-10">
        <h1 :class="isDark ? 'text-4xl font-bold text-white mb-2' : 'text-4xl font-bold text-gray-900 mb-2'">Om dette dashbordet</h1>
        <p :class="isDark ? 'text-gray-400 text-lg' : 'text-gray-500 text-lg'">Makerspace Halden – Sanntidsoversikt</p>
      </div>

      <!-- Main card -->
      <div :class="isDark ? 'bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-xl mb-8' : 'bg-gray-50 border border-gray-100 rounded-3xl p-8 shadow-sm mb-8'">
        <div class="flex items-center gap-4 mb-6">

          <div>
            <h2 :class="isDark ? 'text-xl font-bold text-white' : 'text-xl font-bold text-gray-800'">Masteroppgave</h2>
            <p :class="isDark ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'">Høgskolen i Østfold, 2025–2026</p>
          </div>
        </div>

        <p :class="isDark ? 'text-gray-300 leading-relaxed mb-4' : 'text-gray-700 leading-relaxed mb-4'">
          Dette dashbordet er utviklet som en del av en masteroppgave ved <strong>Høgskolen i Østfold</strong>.
          Målet med prosjektet er å gi studenter og ansatte ved Makerspace Halden en enkel og oversiktlig
          sanntidsvisning av status på utstyr og maskiner i verkstedet.
        </p>

        <p :class="isDark ? 'text-gray-300 leading-relaxed' : 'text-gray-700 leading-relaxed'">
          Dashbordet er bygget med <strong>Nuxt 3</strong> og integrerer seg mot <strong>Home Assistant</strong>
          for å hente live-data fra sensorer og maskiner, inkludert 3D-printere, laserkutter,
          loddestasjon, storformatskriver og termisk kamera.
        </p>
      </div>

      <!-- Developer card -->
      <div :class="isDark ? 'bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-xl mb-8' : 'bg-gray-50 border border-gray-100 rounded-3xl p-8 shadow-sm mb-8'">
        <div class="flex items-center gap-4 mb-6">
          <div>
            <h2 :class="isDark ? 'text-xl font-bold text-white' : 'text-xl font-bold text-gray-800'">Utvikler</h2>
            <p :class="isDark ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'">Student ved Høgskolen i Østfold</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span :class="isDark ? 'text-gray-400 text-sm w-24' : 'text-gray-500 text-sm w-24'">Navn</span>
            <span :class="isDark ? 'text-white font-medium' : 'text-gray-800 font-medium'">Jonas Dombestein Heggelund</span>
          </div>
          <div class="flex items-center gap-3">
            <span :class="isDark ? 'text-gray-400 text-sm w-24' : 'text-gray-500 text-sm w-24'">Studie</span>
            <span :class="isDark ? 'text-white font-medium' : 'text-gray-800 font-medium'">Master i Applied Computer Science</span>
          </div>
          <div class="flex items-center gap-3">
            <span :class="isDark ? 'text-gray-400 text-sm w-24' : 'text-gray-500 text-sm w-24'">Sted</span>
            <span :class="isDark ? 'text-white font-medium' : 'text-gray-800 font-medium'">Høgskolen i Østfold, Halden</span>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { useState } from '#app'

const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? saved === 'true' : false
  }
  return false
})

</script>
