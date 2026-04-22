<template>
  <div
    :class="isDark ? 'min-h-screen bg-gradient-to-b from-gray-900 to-gray-800' : 'min-h-screen bg-gradient-to-b from-gray-50 to-white'">
    <Header />
    <div class="container mx-auto max-w-7xl p-6 mt-8">

      <!-- Navigation Tabs -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            <button @click="activeTab = 'dashbord'" :class="[
              activeTab === 'dashbord'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors'
            ]">
              Dashbord
            </button>
            <button @click="activeTab = 'printers'" :class="[
              activeTab === 'printers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors'
            ]">
              Printere
            </button>
            <button @click="activeTab = 'logs'" :class="[
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors'
            ]">
              Aktivitetslogg
            </button>
            <button @click="activeTab = 'users'" :class="[
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors'
            ]">
              Brukeraktivitet
            </button>
            <button @click="activeTab = 'accounts'" :class="[
              activeTab === 'accounts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors'
            ]">
              Kontoer
            </button>
            <button @click="activeTab = 'settings'" :class="[
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors'
            ]">
              Innstillinger
            </button>
          </nav>
        </div>
      </div>

      <!-- Dashboard Tab -->
      <div v-show="activeTab === 'dashbord'" class="space-y-6">

        <!-- Statistikk kort -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div :class="isDark ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-200'"
            class="rounded-2xl p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                class="text-xs font-semibold uppercase tracking-wider">Totalt printere</span>
              <div :class="isDark ? 'bg-gray-700 p-2 rounded-lg' : 'bg-gray-100 p-2 rounded-lg'">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
            </div>
            <span :class="isDark ? 'text-white' : 'text-gray-900'" class="text-5xl font-bold tracking-tight">{{
              printers.length }}</span>
          </div>

          <div :class="isDark ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-200'"
            class="rounded-2xl p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                class="text-xs font-semibold uppercase tracking-wider">Aktive prints</span>
              <div class="bg-emerald-500/10 p-2 rounded-lg">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="flex items-end gap-2">
              <span class="text-5xl font-bold tracking-tight text-emerald-500">{{ activePrintsCount }}</span>
              <span v-if="activePrintsCount > 0"
                class="mb-1 text-xs text-emerald-500 font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span> Live
              </span>
            </div>
          </div>

          <div :class="isDark ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-200'"
            class="rounded-2xl p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                class="text-xs font-semibold uppercase tracking-wider">Totale logger</span>
              <div :class="isDark ? 'bg-gray-700 p-2 rounded-lg' : 'bg-gray-100 p-2 rounded-lg'">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <span :class="isDark ? 'text-white' : 'text-gray-900'" class="text-5xl font-bold tracking-tight">{{
              totalLogsCount }}</span>
          </div>

          <div :class="isDark ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-200'"
            class="rounded-2xl p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                class="text-xs font-semibold uppercase tracking-wider">Printer feil</span>
              <div
                :class="printerErrorsCount > 0 ? 'bg-red-500/10 p-2 rounded-lg' : isDark ? 'bg-gray-700 p-2 rounded-lg' : 'bg-gray-100 p-2 rounded-lg'">
                <svg class="w-4 h-4" :class="printerErrorsCount > 0 ? 'text-red-500' : 'text-gray-500'" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <span class="text-5xl font-bold tracking-tight"
              :class="printerErrorsCount > 0 ? 'text-red-500' : isDark ? 'text-white' : 'text-gray-900'">{{
              printerErrorsCount }}</span>
          </div>

        </div>

        <!-- Nedre rad: Aktivitet + Top printere side ved side -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">

          <!-- Aktivitet siste 7 dager -->
          <div :class="isDark ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-200'"
            class="rounded-2xl p-6 lg:col-span-3">
            <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-semibold mb-5">Aktivitet siste 7 dager</h2>
            <div class="space-y-1">
              <div v-for="day in last7DaysActivity" :key="day.date"
                :class="isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors">
                <span :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm w-20 shrink-0">{{ day.date
                  }}</span>
                <div class="flex-1 flex items-center gap-2">
                  <div class="flex-1 h-1.5 rounded-full" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'">
                    <div class="h-1.5 rounded-full bg-emerald-500 transition-all"
                      :style="{ width: Math.max(2, (day.starts / Math.max(...last7DaysActivity.map(d => d.starts), 1)) * 100) + '%' }">
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3 text-xs shrink-0">
                  <span class="text-emerald-500 font-medium w-8 text-right">{{ day.starts }}</span>
                  <span :class="isDark ? 'text-blue-400' : 'text-blue-500'" class="font-medium w-8 text-right">{{
                    day.ends }}</span>
                  <span class="font-medium w-8 text-right"
                    :class="day.errors > 0 ? 'text-red-500' : isDark ? 'text-gray-600' : 'text-gray-300'">{{ day.errors
                    }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4 mt-4 pt-4"
              :class="isDark ? 'border-t border-gray-700' : 'border-t border-gray-100'">
              <span class="flex items-center gap-1.5 text-xs text-emerald-500"><span
                  class="w-2 h-2 rounded-full bg-emerald-500"></span>Startet</span>
              <span class="flex items-center gap-1.5 text-xs" :class="isDark ? 'text-blue-400' : 'text-blue-500'"><span
                  class="w-2 h-2 rounded-full bg-blue-500"></span>Ferdig</span>
              <span class="flex items-center gap-1.5 text-xs text-red-500"><span
                  class="w-2 h-2 rounded-full bg-red-500"></span>Feil</span>
            </div>
          </div>

          <!-- Mest brukte printere -->
          <div :class="isDark ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-200'"
            class="rounded-2xl p-6 lg:col-span-2">
            <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-semibold mb-5">Mest brukt <span
                :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-sm font-normal">30 dager</span></h2>
            <div v-if="topPrinters.length === 0" :class="isDark ? 'text-gray-500' : 'text-gray-400'"
              class="text-sm text-center py-8">Ingen data ennå</div>
            <div v-else class="space-y-4">
              <div v-for="(printer, i) in topPrinters" :key="printer.name" class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-xs font-bold w-4">{{ i + 1
                      }}</span>
                    <span :class="isDark ? 'text-gray-200' : 'text-gray-700'"
                      class="text-sm font-medium truncate max-w-28">{{ printer.name }}</span>
                  </div>
                  <span :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs">{{ printer.count }}</span>
                </div>
                <div class="h-1 rounded-full ml-6" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'">
                  <div class="h-1 rounded-full transition-all duration-500"
                    :class="i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-orange-400' : 'bg-gray-400'"
                    :style="{ width: printer.percentage + '%' }">
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Printers Tab -->
      <div v-show="activeTab === 'printers'"
        :class="isDark ? 'bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700' : 'bg-white rounded-xl shadow-lg p-6'">
        <h1 :class="isDark ? 'text-3xl font-bold mb-6 text-white' : 'text-3xl font-bold mb-6 text-gray-800'">Administrer
          printere</h1>

        <form @submit.prevent="addPrinter" class="mb-8 flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                :class="isDark ? 'block mb-1 font-semibold text-gray-300' : 'block mb-1 font-semibold text-gray-700'">IP-adresse</label>
              <input v-model="ip" type="text"
                :class="isDark ? 'bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'"
                placeholder="f.eks. 192.168.1.100" required />
            </div>
            <div>
              <label
                :class="isDark ? 'block mb-1 font-semibold text-gray-300' : 'block mb-1 font-semibold text-gray-700'">API
                Key</label>
              <input v-model="apiKey" type="text"
                :class="isDark ? 'bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'"
                placeholder="API Key" required />
            </div>
          </div>
          <button type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 w-fit"
            :disabled="loading">
            {{ loading ? 'Legger til...' : 'Legg til printer' }}
          </button>
          <div v-if="error" class="text-red-600 font-medium">{{ error }}</div>
          <div v-if="success" class="text-green-600 font-medium">Printer lagt til!</div>
        </form>

        <h2 :class="isDark ? 'text-2xl font-bold mb-4 text-white' : 'text-2xl font-bold mb-4 text-gray-800'">
          Eksisterende printere</h2>

        <!-- Filter og sortering -->
        <div v-if="printers.length > 0" class="mb-6 flex flex-wrap gap-4 items-center">
          <!-- Filter buttons -->
          <div class="flex gap-2">
            <button @click="printerFilter = 'all'" :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              printerFilter === 'all'
                ? 'bg-blue-600 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]">
              Alle ({{ printers.length }})
            </button>
            <button @click="printerFilter = 'mk4'" :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              printerFilter === 'mk4'
                ? 'bg-blue-600 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]">
              MK4S ({{printers.filter(p => p.hostname?.toLowerCase().includes('mk4')).length}})
            </button>
            <button @click="printerFilter = 'mini'" :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              printerFilter === 'mini'
                ? 'bg-blue-600 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]">
              Mini ({{printers.filter(p => p.hostname?.toLowerCase().includes('mini')).length}})
            </button>
          </div>

          <!-- Sortering -->
          <div class="flex gap-2 items-center">
            <span :class="isDark ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'">Sorter:</span>
            <button @click="setSortBy('name')" :class="[
              'px-3 py-1 rounded text-sm font-medium transition',
              sortBy === 'name'
                ? 'bg-blue-600 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]">
              Navn {{ sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </button>
            <button @click="setSortBy('hostname')" :class="[
              'px-3 py-1 rounded text-sm font-medium transition',
              sortBy === 'hostname'
                ? 'bg-blue-600 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]">
              Type {{ sortBy === 'hostname' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </button>
            <button @click="setSortBy('ip')" :class="[
              'px-3 py-1 rounded text-sm font-medium transition',
              sortBy === 'ip'
                ? 'bg-blue-600 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]">
              IP {{ sortBy === 'ip' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </button>
            <button @click="setSortBy('recent')" :class="[
              'px-3 py-1 rounded text-sm font-medium transition',
              sortBy === 'recent'
                ? 'bg-blue-600 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]">
              Nylig {{ sortBy === 'recent' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </button>
          </div>
        </div>

        <div v-if="printers.length === 0"
          :class="isDark ? 'text-gray-400 text-center py-8' : 'text-gray-500 text-center py-8'">Ingen printere lagt til.
        </div>
        <div v-else-if="filteredAndSortedPrinters.length === 0"
          :class="isDark ? 'text-gray-400 text-center py-8' : 'text-gray-500 text-center py-8'">
          Ingen printere matcher filteret.
        </div>
        <div v-else class="overflow-x-auto">
          <table
            :class="isDark ? 'w-full bg-gray-700 rounded-lg overflow-hidden' : 'w-full bg-gray-50 rounded-lg overflow-hidden'">
            <thead :class="isDark ? 'bg-gray-600' : 'bg-gray-200'">
              <tr>
                <th
                  :class="isDark ? 'py-3 px-4 text-left font-semibold text-gray-200' : 'py-3 px-4 text-left font-semibold'">
                  <button @click="setSortBy('name')" class="flex items-center gap-1 hover:text-blue-500 transition">
                    Visningsnavn
                    <span v-if="sortBy === 'name'" class="text-xs">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                  </button>
                </th>
                <th
                  :class="isDark ? 'py-3 px-4 text-left font-semibold text-gray-200' : 'py-3 px-4 text-left font-semibold'">
                  <button @click="setSortBy('hostname')" class="flex items-center gap-1 hover:text-blue-500 transition">
                    Hostname
                    <span v-if="sortBy === 'hostname'" class="text-xs">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                  </button>
                </th>
                <th
                  :class="isDark ? 'py-3 px-4 text-left font-semibold text-gray-200' : 'py-3 px-4 text-left font-semibold'">
                  <button @click="setSortBy('ip')" class="flex items-center gap-1 hover:text-blue-500 transition">
                    IP
                    <span v-if="sortBy === 'ip'" class="text-xs">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                  </button>
                </th>
                <th
                  :class="isDark ? 'py-3 px-4 text-left font-semibold text-gray-200' : 'py-3 px-4 text-left font-semibold'">
                  API Key</th>
                <th
                  :class="isDark ? 'py-3 px-4 text-left font-semibold text-gray-200' : 'py-3 px-4 text-left font-semibold'">
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="printer in filteredAndSortedPrinters" :key="printer.ip"
                :class="isDark ? 'border-b border-gray-600 group hover:bg-gray-600 transition' : 'border-b group hover:bg-red-50 transition'">
                <td class="py-3 px-4">
                  <template v-if="editNameIp === printer.ip">
                    <input v-model="editNameValue"
                      :class="isDark ? 'border border-gray-500 bg-gray-800 text-white rounded px-2 py-1 w-32' : 'border rounded px-2 py-1 w-32'"
                      @keyup.enter="saveDisplayName(printer)" @blur="saveDisplayName(printer)" />
                    <button @click="saveDisplayName(printer)" class="ml-2 text-blue-600 hover:text-blue-800">✓</button>
                  </template>
                  <template v-else>
                    <span :class="isDark ? 'font-medium text-white' : 'font-medium'">{{ printer.displayName || '-'
                      }}</span>
                    <button @click="startEditName(printer)"
                      :class="isDark ? 'ml-2 text-gray-400 hover:text-blue-400' : 'ml-2 text-gray-400 hover:text-blue-600'">✎</button>
                  </template>
                </td>
                <td :class="isDark ? 'py-3 px-4 text-gray-300' : 'py-3 px-4'">{{ printer.hostname || '-' }}</td>
                <td :class="isDark ? 'py-3 px-4 font-mono text-sm text-gray-300' : 'py-3 px-4 font-mono text-sm'">{{
                  printer.ip }}</td>
                <td
                  :class="isDark ? 'py-3 px-4 font-mono text-xs text-gray-400' : 'py-3 px-4 font-mono text-xs text-gray-600'">
                  {{
                  printer.apiKey }}</td>
                <td class="py-3 px-4 text-right">
                  <button @click="confirmDelete(printer)"
                    class="text-red-500 hover:text-red-700 opacity-60 group-hover:opacity-100 transition font-bold"
                    title="Slett printer">
                    ✕
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div
            :class="isDark ? 'bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 max-w-sm w-full' : 'bg-white rounded-lg shadow-lg p-8 max-w-sm w-full'">
            <h3 :class="isDark ? 'text-lg font-bold mb-4 text-white' : 'text-lg font-bold mb-4'">Er du sikker på at du
              vil
              slette denne printeren?</h3>
            <div :class="isDark ? 'mb-4 text-gray-300' : 'mb-4 text-gray-700'">
              <b>Navn:</b> {{ printerToDelete?.hostname || '-' }}<br>
              <b>IP:</b> {{ printerToDelete?.ip }}
            </div>
            <div class="flex gap-4 justify-end">
              <button @click="showConfirm = false"
                class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                Avbryt
              </button>
              <button @click="deletePrinter"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition">
                Slett
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs Tab -->
      <div v-show="activeTab === 'logs'"
        :class="isDark ? 'bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700' : 'bg-white rounded-xl shadow-lg p-6'">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
          <h1
            :class="isDark ? 'text-2xl sm:text-3xl font-bold text-white' : 'text-2xl sm:text-3xl font-bold text-gray-800'">
            Aktivitetslogg</h1>
          <div class="flex gap-2 w-full sm:w-auto">
            <button @click="exportLogsToCSV"
              class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
              <span class="hidden sm:inline">Eksporter CSV</span>
              <span class="inline sm:hidden">CSV</span>
            </button>
            <button @click="refreshLogs"
              class="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
              :disabled="loadingLogs">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" :class="{ 'animate-spin': loadingLogs }" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                </path>
              </svg>
              <span class="hidden sm:inline">{{ loadingLogs ? 'Oppdaterer...' : 'Oppdater' }}</span>
              <span class="inline sm:hidden">{{ loadingLogs ? '...' : '↻' }}</span>
            </button>
          </div>
        </div>


        <!-- Info box -->
        <div v-if="showInfoBox"
          :class="isDark ? 'relative bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6' : 'relative bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'">
          <!-- Lukkeknapp -->
          <button @click="showInfoBox = false"
            :class="isDark ? 'absolute top-2 right-2 rounded-md p-1 text-blue-300/70 hover:text-blue-200 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'absolute top-2 right-2 rounded-md p-1 text-blue-700/70 hover:text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300'"
            aria-label="Lukk informasjonsboksen" title="Lukk">
            <!-- X ikon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>

          <p :class="isDark ? 'text-blue-200 text-sm' : 'text-blue-800 text-sm'">
            <strong>Om logging:</strong> Her vil du kunne se all aktivitet fra 3D-printere, laserkutter, loddestasjon og
            storformatsskriver. Systemet logger automatisk når enheter er i bruk og når prints starter eller avsluttes.
            Dette er tilgjengelig kun for admin-brukere.
          </p>
        </div>


        <!-- Filter dropdown and delete button -->
        <div class="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-end">
          <div class="flex-1 w-full">
            <label for="logFilter"
              :class="isDark ? 'block text-sm font-medium text-gray-300 mb-2' : 'block text-sm font-medium text-gray-700 mb-2'">
              Filtrer logger:
            </label>
            <select id="logFilter" v-model="logFilter"
              :class="isDark ? 'block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm' : 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'">
              <option value="">Alle hendelser</option>
              <option value="printer_start">3D-print startet</option>
              <option value="printer_end">3D-print ferdig</option>
              <option value="printer_stopped">3D-print stoppet</option>
              <option value="printer_error">3D-printer feil</option>
              <option value="printer_attention">3D-printer trenger oppmerksomhet</option>
              <option value="laserkutter_in_use">Laserkutter i bruk</option>
              <option value="laserkutter_idle">Laserkutter ledig</option>
              <option value="laserkutter_on">Laserkutter på</option>
              <option value="laserkutter_off">Laserkutter av</option>
              <option value="loddestasjon_in_use">Loddestasjon i bruk</option>
              <option value="loddestasjon_idle">Loddestasjon ledig</option>
              <option value="loddestasjon_on">Loddestasjon på</option>
              <option value="loddestasjon_off">Loddestasjon av</option>
              <option value="storformat_in_use">Storformatsskriver i bruk</option>
              <option value="storformat_idle">Storformatsskriver ledig</option>
            </select>
          </div>
          <button v-if="logs.length > 0" @click="showDeleteAllConfirm = true"
            class="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold">
            ✕ <span class="hidden sm:inline">Slett alle logger</span><span class="inline sm:hidden">Slett alt</span>
          </button>
        </div>

        <!-- Activity logs -->
        <div v-if="logs.length > 0">
          <!-- Tabell for logger -->
          <div
            :class="isDark ? 'bg-gray-700 border border-gray-600 rounded-lg overflow-hidden' : 'bg-white border border-gray-200 rounded-lg overflow-hidden'">
            <table class="w-full">
              <thead :class="isDark ? 'bg-gray-600 border-b border-gray-500' : 'bg-gray-100 border-b border-gray-200'">
                <tr>
                  <th
                    :class="isDark ? 'px-4 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                    Status</th>
                  <th
                    :class="isDark ? 'px-4 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                    Enhet</th>
                  <th
                    :class="isDark ? 'px-4 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                    Dato</th>
                  <th
                    :class="isDark ? 'px-4 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                    Tid</th>
                  <th
                    :class="isDark ? 'px-4 py-3 text-center text-xs font-semibold text-gray-200 uppercase tracking-wider w-16' : 'px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16'">
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <template v-for="log in paginatedLogs" :key="log.id">
                  <tr class="hover:bg-gray-50 transition-colors cursor-pointer" @click="toggleLogExpanded(log.id)" :class="expandedLogs.has(log.id) ? (isDark ? 'bg-gray-600' : 'bg-gray-100') : ''">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <span
                          :class="['px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block', getLogTypeClass(log.type)]">
                          {{ getLogTypeLabel(log.type) }}
                        </span>
                        <span v-if="log.type === 'printer_start' && log.metadata" class="text-xs text-gray-500">
                          {{ expandedLogs.has(log.id) ? '▼' : '▶' }}
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3 font-medium text-gray-800">{{ log.device }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{{ formatDate(log.timestamp) }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{{ formatTime(log.timestamp) }}</td>
                    <td class="px-4 py-3 text-center">
                      <button @click.stop="confirmDeleteLog(log)"
                        class="text-red-600 hover:text-red-800 transition-colors p-1 text-lg font-bold"
                        title="Slett denne loggen">
                        ✕
                      </button>
                    </td>
                  </tr>
                  
                  <!-- Expanded row for printer_start -->
                  <tr v-if="expandedLogs.has(log.id) && log.type === 'printer_start' && log.metadata" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
                    <td :colspan="5" class="px-4 py-4">
                      <div class="space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div v-if="log.metadata.filename">
                            <p :class="isDark ? 'text-xs text-gray-400 uppercase' : 'text-xs text-gray-600 uppercase'">G-code Filnavn</p>
                            <p :class="isDark ? 'text-sm text-gray-200 font-medium break-words' : 'text-sm text-gray-800 font-medium break-words'">{{ log.metadata.filename }}</p>
                          </div>
                          <div v-if="log.metadata.filament">
                            <p :class="isDark ? 'text-xs text-gray-400 uppercase' : 'text-xs text-gray-600 uppercase'">Filament</p>
                            <p :class="isDark ? 'text-sm text-gray-200 font-medium' : 'text-sm text-gray-800 font-medium'">{{ log.metadata.filament }}</p>
                          </div>
                          <div v-if="log.metadata.print_duration">
                            <p :class="isDark ? 'text-xs text-gray-400 uppercase' : 'text-xs text-gray-600 uppercase'">Estimert Varighet</p>
                            <p :class="isDark ? 'text-sm text-gray-200 font-medium' : 'text-sm text-gray-800 font-medium'">{{ log.metadata.print_duration }}</p>
                          </div>
                          <div v-if="log.metadata.hostname">
                            <p :class="isDark ? 'text-xs text-gray-400 uppercase' : 'text-xs text-gray-600 uppercase'">Printer</p>
                            <p :class="isDark ? 'text-sm text-gray-200 font-medium' : 'text-sm text-gray-800 font-medium'">{{ log.metadata.hostname }}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- Paginering -->
          <div v-if="hasMoreLogs" class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div class="text-sm text-gray-600">
              Viser {{ ((currentPage - 1) * logsPerPage) + 1 }}-{{ Math.min(currentPage * logsPerPage, logs.length) }}
              av {{
                logs.length }} logger
            </div>
            <div class="flex gap-2">
              <button @click="currentPage--" :disabled="currentPage === 1"
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                ← Forrige
              </button>
              <div class="flex items-center gap-2 px-3">
                <span class="text-sm text-gray-600">Side {{ currentPage }} av {{ totalPages }}</span>
              </div>
              <button @click="currentPage++" :disabled="currentPage >= totalPages"
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Neste →
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-500">
          Ingen logger å vise
        </div>
      </div>

      <!-- Users Tab -->
      <div v-show="activeTab === 'users'"
        :class="isDark ? 'bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700' : 'bg-white rounded-xl shadow-lg p-6'">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
          <h1
            :class="isDark ? 'text-2xl sm:text-3xl font-bold text-white' : 'text-2xl sm:text-3xl font-bold text-gray-800'">
            Brukeraktivitet</h1>
          <div class="flex gap-2 w-full sm:w-auto">
            <button @click="refreshUserActivity"
              class="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
              :disabled="loadingUserActivity">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" :class="{ 'animate-spin': loadingUserActivity }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                </path>
              </svg>
              <span class="hidden sm:inline">{{ loadingUserActivity ? 'Oppdaterer...' : 'Oppdater' }}</span>
              <span class="inline sm:hidden">{{ loadingUserActivity ? '...' : '↻' }}</span>
            </button>
            <button @click="showDeleteUserActivityConfirm = true"
              class="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
              :disabled="userActivityLogs.length === 0">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                </path>
              </svg>
              <span class="hidden sm:inline">Slett alt</span>
              <span class="inline sm:hidden">✕</span>
            </button>
          </div>
        </div>

        <!-- Info box -->
        <div
          :class="isDark ? 'bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6' : 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'">
          <p :class="isDark ? 'text-blue-200 text-sm' : 'text-blue-800 text-sm'">
            <strong>Om brukeraktivitet:</strong> Her kan du se hvem som har logget inn i admin-panelet, når de logget
            inn og
            fra hvilken IP-adresse.
          </p>
        </div>

        <!-- User activity logs -->
        <div v-if="userActivityLogs.length > 0">
          <div
            :class="isDark ? 'bg-gray-700 border border-gray-600 rounded-lg overflow-hidden' : 'bg-white border border-gray-200 rounded-lg overflow-hidden'">
            <table class="w-full">
              <thead :class="isDark ? 'bg-gray-600 border-b border-gray-500' : 'bg-gray-100 border-b border-gray-200'">
                <tr>
                  <th
                    :class="isDark ? 'px-4 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                    Bruker</th>
                  <th
                    :class="isDark ? 'px-4 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                    Handling</th>
                  <th
                    :class="isDark ? 'px-4 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                    IP-adresse</th>
                  <th
                    :class="isDark ? 'px-4 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                    Dato & Tid</th>
                </tr>
              </thead>
              <tbody :class="isDark ? 'divide-y divide-gray-600' : 'divide-y divide-gray-200'">
                <tr v-for="activity in userActivityLogs" :key="activity.id"
                  :class="isDark ? 'hover:bg-gray-600 transition-colors' : 'hover:bg-gray-50 transition-colors'">
                  <td :class="isDark ? 'px-4 py-3 font-medium text-white' : 'px-4 py-3 font-medium text-gray-800'">{{
                    activity.username }}</td>
                  <td class="px-4 py-3">
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1',
                      activity.action === 'login' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <circle v-if="activity.action === 'login'" cx="10" cy="10" r="8"></circle>
                        <circle v-else cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2">
                        </circle>
                      </svg>
                      {{ activity.action === 'login' ? 'Logget inn' : 'Logget ut' }}
                    </span>
                  </td>
                  <td
                    :class="isDark ? 'px-4 py-3 text-sm text-gray-300 font-mono' : 'px-4 py-3 text-sm text-gray-600 font-mono'">
                    {{ activity.ip || 'N/A' }}</td>
                  <td :class="isDark ? 'px-4 py-3 text-sm text-gray-300' : 'px-4 py-3 text-sm text-gray-600'">{{
                    formatDateTime(activity.timestamp) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else :class="isDark ? 'text-center py-12 text-gray-400' : 'text-center py-12 text-gray-500'">
          Ingen brukeraktivitet å vise
        </div>
      </div>

      <!-- Accounts (user management) Tab -->
      <div v-show="activeTab === 'accounts'"
        :class="isDark ? 'bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700' : 'bg-white rounded-xl shadow-lg p-6'">
        <h1 :class="isDark ? 'text-3xl font-bold mb-6 text-white' : 'text-3xl font-bold mb-6 text-gray-800'">
          Adminbrukere</h1>

        <!-- Add user form -->
        <div
          :class="isDark ? 'border border-gray-700 rounded-lg p-3 sm:p-6 mb-6' : 'border border-gray-200 rounded-lg p-3 sm:p-6 mb-6'">
          <h2
            :class="isDark ? 'text-lg sm:text-xl font-bold mb-4 text-white' : 'text-lg sm:text-xl font-bold mb-4 text-gray-800'">
            Legg til bruker</h2>
          <form @submit.prevent="addAdminUser" class="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input v-model="newUserForm.username" type="text" placeholder="Brukernavn" maxlength="50"
              :class="isDark ? 'flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm' : 'flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm'" />
            <input v-model="newUserForm.password" type="password" placeholder="Passord"
              :class="isDark ? 'flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm' : 'flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm'" />
            <button type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm whitespace-nowrap">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span class="hidden sm:inline">Legg til</span>
              <span class="inline sm:hidden">+</span>
            </button>
          </form>
          <p v-if="addUserError" class="text-red-500 text-xs sm:text-sm mt-2">{{ addUserError }}</p>
          <p v-if="addUserSuccess" class="text-green-600 text-xs sm:text-sm mt-2">Bruker lagt til!</p>
        </div>

        <!-- Users table -->
        <div v-if="adminUsers.length > 0"
          :class="isDark ? 'bg-gray-700 border border-gray-600 rounded-lg overflow-x-auto' : 'bg-white border border-gray-200 rounded-lg overflow-x-auto'">
          <table class="w-full">
            <thead :class="isDark ? 'bg-gray-600 border-b border-gray-500' : 'bg-gray-100 border-b border-gray-200'">
              <tr>
                <th
                  :class="isDark ? 'px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                  Brukernavn</th>
                <th
                  :class="isDark ? 'px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider hidden md:table-cell' : 'px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell'">
                  Opprettet</th>
                <th
                  :class="isDark ? 'px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider' : 'px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'">
                  Handlinger</th>
              </tr>
            </thead>
            <tbody :class="isDark ? 'divide-y divide-gray-600' : 'divide-y divide-gray-200'">
              <tr v-for="user in adminUsers" :key="user.id"
                :class="isDark ? 'hover:bg-gray-600 transition-colors' : 'hover:bg-gray-50 transition-colors'">
                <td
                  :class="isDark ? 'px-2 sm:px-4 py-2 sm:py-3 font-medium text-white text-sm' : 'px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-800 text-sm'">
                  {{ user.username }}</td>
                <td
                  :class="isDark ? 'px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-300 hidden md:table-cell' : 'px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 hidden md:table-cell'">
                  {{ formatDateTime(user.createdAt) }}</td>
                <td class="px-2 sm:px-4 py-2 sm:py-3">
                  <div class="flex gap-1 flex-wrap">
                    <button @click="openEditUser(user)"
                      class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded transition flex items-center gap-1 whitespace-nowrap">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                      </svg>
                      <span class="hidden sm:inline">Rediger</span>
                      <span class="inline sm:hidden">✎</span>
                    </button>
                    <button @click="confirmDeleteAdminUser(user)"
                      class="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded transition flex items-center gap-1 whitespace-nowrap">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                      </svg>
                      <span class="hidden sm:inline">Slett</span>
                      <span class="inline sm:hidden">✕</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else :class="isDark ? 'text-center py-12 text-gray-400' : 'text-center py-12 text-gray-500'">
          Ingen brukere funnet
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-show="activeTab === 'settings'"
        :class="isDark ? 'bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700' : 'bg-white rounded-xl shadow-lg p-6'">
        <h1 :class="isDark ? 'text-3xl font-bold mb-6 text-white' : 'text-3xl font-bold mb-6 text-gray-800'">
          Systeminnstillinger</h1>

        <div class="space-y-6">
          <!-- Home Assistant Settings -->
          <div :class="isDark ? 'border border-gray-700 rounded-lg p-6' : 'border border-gray-200 rounded-lg p-6'">
            <h2 :class="isDark ? 'text-xl font-bold mb-4 text-white' : 'text-xl font-bold mb-4 text-gray-800'">Home
              Assistant
            </h2>
            <div class="space-y-4">
              <div>
                <label
                  :class="isDark ? 'block text-sm font-medium text-gray-300 mb-2' : 'block text-sm font-medium text-gray-700 mb-2'">Base
                  URL</label>
                <input v-model="haSettings.baseUrl" type="text"
                  :class="isDark ? 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white' : 'w-full px-3 py-2 border border-gray-300 rounded-md'"
                  placeholder="http://homeassistant.local:8123" />
              </div>
              <form @submit.prevent="testHAConnection" class="space-y-4">
                <div>
                  <label
                    :class="isDark ? 'block text-sm font-medium text-gray-300 mb-2' : 'block text-sm font-medium text-gray-700 mb-2'">Access
                    Token</label>
                  <input v-model="haSettings.token" type="password"
                    :class="isDark ? 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-mono text-sm' : 'w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm'"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
                </div>
                <button type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                  Test tilkobling
                </button>
              </form>
              <div v-if="haTestResult" :class="haTestResult.success ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium">
                {{ haTestResult.message }}
              </div>
            </div>
          </div>

          <!-- Polling Settings -->
          <div :class="isDark ? 'border border-gray-700 rounded-lg p-6' : 'border border-gray-200 rounded-lg p-6'">
            <h2 :class="isDark ? 'text-xl font-bold mb-4 text-white' : 'text-xl font-bold mb-4 text-gray-800'">
              Oppdateringsintervaller</h2>
            <div class="space-y-4">
              <div>
                <label
                  :class="isDark ? 'block text-sm font-medium text-gray-300 mb-2' : 'block text-sm font-medium text-gray-700 mb-2'">
                  Printer polling (sekunder)
                </label>
                <input v-model.number="pollingSettings.printerInterval" type="number" min="1" max="300"
                  :class="isDark ? 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white' : 'w-full px-3 py-2 border border-gray-300 rounded-md'" />
                <p :class="isDark ? 'text-xs text-gray-400 mt-1' : 'text-xs text-gray-500 mt-1'">Hvor ofte alle brukere
                  skal
                  se oppdatert printer-status (1-300 sekunder). Standard: 3 sekunder</p>
              </div>
              <div>
                <label
                  :class="isDark ? 'block text-sm font-medium text-gray-300 mb-2' : 'block text-sm font-medium text-gray-700 mb-2'">
                  Sensor polling (sekunder)
                </label>
                <input v-model.number="pollingSettings.sensorInterval" type="number" min="1" max="300"
                  :class="isDark ? 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white' : 'w-full px-3 py-2 border border-gray-300 rounded-md'" />
                <p :class="isDark ? 'text-xs text-gray-400 mt-1' : 'text-xs text-gray-500 mt-1'">Hvor ofte systemet skal
                  sjekke sensor-status (1-300 sekunder). Standard: 10 sekunder</p>
              </div>
            </div>
          </div>

          <!-- Log Retention -->
          <div :class="isDark ? 'border border-gray-700 rounded-lg p-6' : 'border border-gray-200 rounded-lg p-6'">
            <h2 :class="isDark ? 'text-xl font-bold mb-4 text-white' : 'text-xl font-bold mb-4 text-gray-800'">Logger
            </h2>
            <div class="space-y-4">
              <div>
                <label
                  :class="isDark ? 'block text-sm font-medium text-gray-300 mb-2' : 'block text-sm font-medium text-gray-700 mb-2'">
                  Lagre logger i antall dager
                </label>
                <input v-model.number="logSettings.retentionDays" type="number" min="1" max="365"
                  :class="isDark ? 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white' : 'w-full px-3 py-2 border border-gray-300 rounded-md'" />
                <p :class="isDark ? 'text-xs text-gray-400 mt-1' : 'text-xs text-gray-500 mt-1'">Logger eldre enn dette
                  slettes automatisk</p>
              </div>
            </div>
          </div>

          <!-- LED Strip Thresholds -->
          <div :class="isDark ? 'border border-gray-700 rounded-lg p-6' : 'border border-gray-200 rounded-lg p-6'">
            <h2 :class="isDark ? 'text-xl font-bold mb-1 text-white' : 'text-xl font-bold mb-1 text-gray-800'">LED-strip
              terskelverdier (termalkamera)</h2>
            <p :class="isDark ? 'text-sm text-gray-400 mb-4' : 'text-sm text-gray-500 mb-4'">Bestemmer hvilke
              temperaturer som
              endrer fargen på LED-stripen basert på termalkameraet.</p>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                <div class="flex-1">
                  <label
                    :class="isDark ? 'block text-sm font-medium text-gray-300 mb-1' : 'block text-sm font-medium text-gray-700 mb-1'">
                    Grønn (maks °C for grønn)
                  </label>
                  <input v-model.number="ledThresholds.green" type="number" min="0" max="100"
                    :class="isDark ? 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white' : 'w-full px-3 py-2 border border-gray-300 rounded-md'" />
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-4 h-4 rounded-full flex-shrink-0" style="background-color: rgb(255,200,0)"></div>
                <div class="flex-1">
                  <label
                    :class="isDark ? 'block text-sm font-medium text-gray-300 mb-1' : 'block text-sm font-medium text-gray-700 mb-1'">
                    Gul (maks °C for Gul)
                  </label>
                  <input v-model.number="ledThresholds.yellow" type="number" min="0" max="100"
                    :class="isDark ? 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white' : 'w-full px-3 py-2 border border-gray-300 rounded-md'" />
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-4 h-4 rounded-full flex-shrink-0" style="background-color: rgb(255,80,0)"></div>
                <div class="flex-1">
                  <label
                    :class="isDark ? 'block text-sm font-medium text-gray-300 mb-1' : 'block text-sm font-medium text-gray-700 mb-1'">
                    Rød (maks °C for Rød)
                  </label>
                  <input v-model.number="ledThresholds.orange" type="number" min="0" max="100"
                    :class="isDark ? 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white' : 'w-full px-3 py-2 border border-gray-300 rounded-md'" />
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <button @click="saveSettings" :disabled="savingSettings"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
            <svg v-if="savingSettings" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            {{ savingSettings ? 'Lagrer...' : 'Lagre innstillinger' }}
          </button>
          <div v-if="settingsSaved"
            class="text-green-600 text-center font-medium flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Innstillingene er lagret!
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Confirm delete single log modal -->
  <div v-if="showDeleteLogConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Bekreft sletting</h3>
      <p class="text-gray-600 mb-6">
        Er du sikker på at du vil slette denne loggen?
      </p>
      <div class="flex gap-3 justify-end">
        <button @click="showDeleteLogConfirm = false; logToDelete = null"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Avbryt
        </button>
        <button @click="deleteLog" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Slett
        </button>
      </div>
    </div>
  </div>

  <!-- Edit admin user modal -->
  <div v-if="editUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Rediger bruker: {{ editUserModal.originalUsername }}</h3>
      <form @submit.prevent="saveEditUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Brukernavn</label>
          <input v-model="editUserModal.username" type="text" maxlength="50"
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nytt passord <span
              class="text-gray-400 font-normal">(la stå tomt for å beholde)</span></label>
          <input v-model="editUserModal.password" type="password" placeholder="Nytt passord"
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <p v-if="editUserError" class="text-red-500 text-sm">{{ editUserError }}</p>
        <div class="flex gap-3 justify-end mt-6">
          <button type="button" @click="editUserModal = null; editUserError = ''"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Avbryt
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Lagre
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Confirm delete admin user modal -->
  <div v-if="showDeleteAdminUserConfirm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4 text-red-600">Slett bruker</h3>
      <p class="text-gray-600 mb-6">Er du sikker på at du vil slette brukeren <strong>{{ adminUserToDelete?.username
          }}</strong>?</p>
      <div class="flex gap-3 justify-end">
        <button @click="showDeleteAdminUserConfirm = false; adminUserToDelete = null"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Avbryt
        </button>
        <button @click="deleteAdminUser" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Slett
        </button>
      </div>
    </div>
  </div>

  <!-- Edit admin user modal -->
  <div v-if="editUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Rediger bruker: {{ editUserModal.originalUsername }}</h3>
      <form @submit.prevent="saveEditUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Brukernavn</label>
          <input v-model="editUserModal.username" type="text" maxlength="50"
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nytt passord <span
              class="text-gray-400 font-normal">(la stå tomt for å beholde)</span></label>
          <input v-model="editUserModal.password" type="password" placeholder="Nytt passord"
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <p v-if="editUserError" class="text-red-500 text-sm">{{ editUserError }}</p>
        <div class="flex gap-3 justify-end mt-6">
          <button type="button" @click="editUserModal = null; editUserError = ''"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Avbryt
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Lagre
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Confirm delete admin user modal -->
  <div v-if="showDeleteAdminUserConfirm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4 text-red-600">⚠️ Slett bruker</h3>
      <p class="text-gray-600 mb-6">Er du sikker på at du vil slette brukeren <strong>{{ adminUserToDelete?.username
          }}</strong>?</p>
      <div class="flex gap-3 justify-end">
        <button @click="showDeleteAdminUserConfirm = false; adminUserToDelete = null"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Avbryt
        </button>
        <button @click="deleteAdminUser" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Slett
        </button>
      </div>
    </div>
  </div>

  <!-- Confirm delete all user activity modal -->
  <div v-if="showDeleteUserActivityConfirm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4 text-red-600">⚠️ Advarsel</h3>
      <p class="text-gray-600 mb-6">
        Er du sikker på at du vil slette <strong>hele brukerloggen</strong>? Denne handlingen kan ikke angres.
      </p>
      <div class="flex gap-3 justify-end">
        <button @click="showDeleteUserActivityConfirm = false"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Avbryt
        </button>
        <button @click="deleteAllUserActivity" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Slett alt
        </button>
      </div>
    </div>
  </div>

  <!-- Confirm delete all logs modal -->
  <div v-if="showDeleteAllConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4 text-red-600">⚠️ Advarsel</h3>
      <p class="text-gray-600 mb-6">
        Er du sikker på at du vil slette <strong>alle</strong> logger? Denne handlingen kan ikke angres.
      </p>
      <div class="flex gap-3 justify-end">
        <button @click="showDeleteAllConfirm = false"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Avbryt
        </button>
        <button @click="deleteAllLogs" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Slett alle
        </button>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useState } from '#app';
import { sharedPrinterList } from '../components/printerState.js';
import { useRoute, useRouter } from '#app';
import Header from '../components/Header.vue';

// Dark mode state
const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false;
  }
  return false;
});

const showInfoBox = ref(true)

// (Valgfritt) Husk valget i localStorage:
// onMounted(() => { showInfoBox.value = localStorage.getItem('hideInfoBox') !== '1' })
// watch(showInfoBox, v => { if (!v) localStorage.setItem('hideInfoBox', '1') })


// Beskytt siden med middleware
definePageMeta({ middleware: 'admin' });

// Tab state
const activeTab = ref('dashbord');

// Logging state
const loadingLogs = ref(false);
const logs = ref<any[]>([]);
const expandedLogs = ref<Set<string>>(new Set());
const logFilter = ref('');
const showDeleteLogConfirm = ref(false);
const showDeleteAllConfirm = ref(false);
const logToDelete = ref<any>(null);

// Paginering for logger
const logsPerPage = 50;
const currentPage = ref(1);

// Dashboard state
const totalLogsCount = ref(0);
const printerStats = ref({
  printing: 0,
  idle: 0,
  finished: 0,
  attention: 0,
  error: 0,
  total: 0
});
const statsLoaded = ref(false);
const activePrintsCount = computed(() => {
  return printerStats.value.printing;
});

const printerErrorsCount = computed(() => {
  return (printerStats.value.error || 0) + (printerStats.value.attention || 0);
});

const last7DaysActivity = computed(() => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });

    const dayLogs = logs.value.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === date.toDateString();
    });

    days.push({
      date: dateStr,
      starts: dayLogs.filter(l => l.type === 'printer_start').length,
      ends: dayLogs.filter(l => l.type === 'printer_end').length,
      errors: dayLogs.filter(l => l.type === 'printer_error' || l.type === 'printer_attention').length
    });
  }
  return days;
});

const topPrinters = computed(() => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const printerCounts: { [key: string]: number } = {};
  logs.value.forEach(log => {
    if (log.type === 'printer_start' && new Date(log.timestamp) > last30Days) {
      printerCounts[log.device] = (printerCounts[log.device] || 0) + 1;
    }
  });

  const sorted = Object.entries(printerCounts)
    .map(([name, count]) => ({ name, count: count as number }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 5);

  const maxCount = sorted[0]?.count || 1;
  return sorted.map(p => ({
    ...p,
    percentage: ((p.count as number) / maxCount) * 100
  }));
});

// User activity state
const loadingUserActivity = ref(false);
const showDeleteUserActivityConfirm = ref(false);

// Admin user management state
const adminUsers = ref<{ id: string; username: string; createdAt: string }[]>([]);
const newUserForm = ref({ username: '', password: '' });
const addUserError = ref('');
const addUserSuccess = ref(false);
const editUserModal = ref<{ id: string; username: string; originalUsername: string; password: string } | null>(null);
const editUserError = ref('');
const showDeleteAdminUserConfirm = ref(false);
const adminUserToDelete = ref<{ id: string; username: string } | null>(null);
interface UserActivity {
  id: string;
  timestamp: string;
  username: string;
  action: 'login' | 'logout';
  ip: string;
}
const userActivityLogs = ref<UserActivity[]>([]);

// Settings state
const haSettings = ref({
  baseUrl: 'http://homeassistant.local:8123',
  token: ''
});
const pollingSettings = ref({
  printerInterval: 3,
  sensorInterval: 10
});
const logSettings = ref({
  retentionDays: 90
});
const ledThresholds = ref({
  green: 30,
  yellow: 40,
  orange: 50
});
const haTestResult = ref<{ success: boolean; message: string } | null>(null);
const settingsSaved = ref(false);
const savingSettings = ref(false);

// Computed: filtrerte og paginerte logger
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * logsPerPage;
  const end = start + logsPerPage;
  return logs.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(logs.value.length / logsPerPage);
});

const hasMoreLogs = computed(() => {
  return logs.value.length > logsPerPage;
});

// Watch filter changes and reload logs
watch(logFilter, () => {
  currentPage.value = 1; // Reset til første side ved filtrering
  refreshLogs();
});

async function refreshLogs() {
  loadingLogs.value = true;
  try {
    const params = new URLSearchParams();
    if (logFilter.value) {
      params.append('type', logFilter.value);
    }
    const data = await $fetch(`/api/logs?${params.toString()}`) as any;
    logs.value = data.logs || [];
    totalLogsCount.value = data.total || data.logs?.length || 0;
  } catch (e) {
    console.error('Feil ved henting av logger:', e);
    logs.value = [];
    totalLogsCount.value = 0;
  } finally {
    loadingLogs.value = false;
  }
}

function toggleLogExpanded(logId: string) {
  const newSet = new Set(expandedLogs.value);
  if (newSet.has(logId)) {
    newSet.delete(logId);
  } else {
    newSet.add(logId);
  }
  expandedLogs.value = newSet;
}

function confirmDeleteLog(log: any) {
  logToDelete.value = log;
  showDeleteLogConfirm.value = true;
}

async function deleteLog() {
  if (!logToDelete.value) return;

  try {
    const res = await fetch('/api/logs-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logId: logToDelete.value.id })
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || 'Kunne ikke slette logg');
    }

    // Hvis vi sletter siste logg på en side, gå til forrige side
    if (paginatedLogs.value.length === 1 && currentPage.value > 1) {
      currentPage.value--;
    }

    await refreshLogs();
    showDeleteLogConfirm.value = false;
    logToDelete.value = null;
  } catch (e: any) {
    alert(e.message || 'Feil ved sletting av logg');
  }
}

async function deleteAllLogs() {
  try {
    const res = await fetch('/api/logs-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleteAll: true })
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || 'Kunne ikke slette logger');
    }

    currentPage.value = 1; // Reset til første side
    await refreshLogs();
    showDeleteAllConfirm.value = false;
  } catch (e: any) {
    alert(e.message || 'Feil ved sletting av alle logger');
  }
}

function getLogTypeClass(type: string) {
  switch (type) {
    case 'printer_start':
      return 'bg-green-100 text-green-800';
    case 'printer_end':
      return 'bg-blue-100 text-blue-800';
    case 'printer_stopped':
      return 'bg-gray-100 text-gray-800';
    case 'printer_error':
      return 'bg-red-100 text-red-800';
    case 'printer_attention':
      return 'bg-yellow-100 text-yellow-800';
    case 'laserkutter_on':
      return 'bg-blue-100 text-blue-800';
    case 'laserkutter_off':
      return 'bg-gray-100 text-gray-800';
    case 'laserkutter_in_use':
      return 'bg-green-100 text-green-800';
    case 'laserkutter_idle':
      return 'bg-gray-100 text-gray-800';
    case 'loddestasjon_on':
      return 'bg-yellow-100 text-yellow-800';
    case 'loddestasjon_off':
      return 'bg-gray-100 text-gray-800';
    case 'loddestasjon_in_use':
      return 'bg-green-100 text-green-800';
    case 'loddestasjon_idle':
      return 'bg-gray-100 text-gray-800';
    case 'storformat_in_use':
      return 'bg-green-100 text-green-800';
    case 'storformat_idle':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getLogTypeLabel(type: string) {
  switch (type) {
    case 'printer_start':
      return 'Print startet';
    case 'printer_end':
      return 'Print avsluttet';
    case 'printer_stopped':
      return 'Print stoppet';
    case 'printer_error':
      return 'Printer feil';
    case 'printer_attention':
      return 'Trenger oppmerksomhet';
    case 'laserkutter_in_use':
      return 'Laserkutter i bruk';
    case 'laserkutter_idle':
      return 'Laserkutter ledig';
    case 'laserkutter_on':
      return 'Laserkutter på';
    case 'laserkutter_off':
      return 'Laserkutter av';
    case 'loddestasjon_in_use':
      return 'Loddestasjon i bruk';
    case 'loddestasjon_idle':
      return 'Loddestasjon ledig';
    case 'loddestasjon_on':
      return 'Loddestasjon på';
    case 'loddestasjon_off':
      return 'Loddestasjon av';
    case 'storformat_in_use':
      return 'Storformatsskriver i bruk';
    case 'storformat_idle':
      return 'Storformatsskriver ledig';
    default:
      return type;
  }
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Printer management state
const showConfirm = ref(false);
const printerToDelete = ref<any>(null);

function confirmDelete(printer: any) {
  printerToDelete.value = printer;
  showConfirm.value = true;
}

async function deletePrinter() {
  if (!printerToDelete.value) return;
  const targetIp = printerToDelete.value.ip;
  try {
    const res = await fetch('/api/prusa-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip: printerToDelete.value.ip })
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok || result?.error) throw new Error(result?.error || 'Kunne ikke slette printer');
    printers.value = printers.value.filter(p => p.ip !== targetIp);
    showConfirm.value = false;
    printerToDelete.value = null;
    fetchPrinters();
  } catch (e: any) {
    alert(e.message || 'Feil ved sletting');
  }
}

const ip = ref('');
const apiKey = ref('');
interface Printer {
  ip: string;
  apiKey: string;
  hostname?: string;
  displayName?: string;
}
const printers = sharedPrinterList as unknown as Ref<Printer[]>;
const loading = ref(false);
const error = ref('');
const success = ref(false);

// Sortering og filtrering
const printerFilter = ref<'all' | 'mk4' | 'mini'>('all');
const sortBy = ref<'name' | 'hostname' | 'ip' | 'recent'>('name');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Computed: filtrerte og sorterte printere
const filteredAndSortedPrinters = computed(() => {
  let result = [...printers.value];

  // Filtrer
  if (printerFilter.value === 'mk4') {
    result = result.filter(p => p.hostname?.toLowerCase().includes('mk4'));
  } else if (printerFilter.value === 'mini') {
    result = result.filter(p => p.hostname?.toLowerCase().includes('mini'));
  }

  // Sorter
  result.sort((a, b) => {
    let compareA: any;
    let compareB: any;

    if (sortBy.value === 'name') {
      compareA = (a.displayName || a.hostname || a.ip).toLowerCase();
      compareB = (b.displayName || b.hostname || b.ip).toLowerCase();
    } else if (sortBy.value === 'hostname') {
      compareA = (a.hostname || '').toLowerCase();
      compareB = (b.hostname || '').toLowerCase();
    } else if (sortBy.value === 'ip') {
      // Sorter IP-adresser numerisk
      const parseIp = (ip: string) => {
        const parts = ip.split('.').map(Number);
        return (parts[0] || 0) * 16777216 + (parts[1] || 0) * 65536 + (parts[2] || 0) * 256 + (parts[3] || 0);
      };
      compareA = parseIp(a.ip);
      compareB = parseIp(b.ip);
    } else if (sortBy.value === 'recent') {
      // Sist lagt til = sist i array (antar at nye printere legges til på slutten)
      compareA = printers.value.indexOf(a);
      compareB = printers.value.indexOf(b);
    }

    if (compareA < compareB) return sortOrder.value === 'asc' ? -1 : 1;
    if (compareA > compareB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });

  return result;
});

function setSortBy(field: 'name' | 'hostname' | 'ip' | 'recent') {
  if (sortBy.value === field) {
    // Toggle sort order
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
}

// For displayName editing
const editNameIp = ref<string | null>(null);
const editNameValue = ref('');

function startEditName(printer: Printer) {
  editNameIp.value = printer.ip;
  editNameValue.value = printer.displayName || '';
}

async function saveDisplayName(printer: Printer) {
  if (!editNameIp.value) return;
  const newName = editNameValue.value.trim();
  try {
    const res = await fetch('/api/prusa-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip: printer.ip, displayName: newName })
    });
    if (!res.ok) throw new Error('Kunne ikke lagre navn');
    await fetchPrinters();
    editNameIp.value = null;
    editNameValue.value = '';
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}

async function fetchPrinters() {
  try {
    const data = await $fetch('/api/prusa');
    console.log('Hentet printere:', data);

    // API returnerer alltid en array
    if (Array.isArray(data)) {
      sharedPrinterList.value = data;
      console.log('sharedPrinterList oppdatert:', sharedPrinterList.value.length, 'printere');
    } else {
      console.error('Uventet respons fra /api/prusa:', data);
      sharedPrinterList.value = [];
    }
  } catch (e) {
    console.error('Feil ved henting av printere:', e);
    sharedPrinterList.value = [];
  }
}

onMounted(() => {
  fetchPrinters();
  refreshLogs();
  refreshUserActivity();
  refreshPrinterStats();
  loadSettings();
  loadAdminUsers();
  loadAdminUsers();

  // Oppdater printer-stats hvert 10. sekund
  setInterval(() => {
    refreshPrinterStats();
  }, 10000);
});

async function refreshPrinterStats() {
  try {
    const data = await $fetch('/api/printer-stats') as any;
    if (data.success) {
      printerStats.value = data.stats;
      statsLoaded.value = true;
    }
  } catch (e) {
    console.error('Feil ved henting av printer-stats:', e);
    statsLoaded.value = true;
  }
}

async function loadAdminUsers() {
  try {
    const data = await $fetch('/api/admin-users') as any;
    if (data.success) adminUsers.value = data.users;
  } catch (e) {
    console.error('Feil ved henting av adminbrukere:', e);
  }
}

async function addAdminUser() {
  addUserError.value = '';
  addUserSuccess.value = false;
  try {
    const res = await fetch('/api/admin-users-add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUserForm.value),
      credentials: 'include'
    });
    const result = await res.json();
    if (!result.success) {
      addUserError.value = result.error || 'Kunne ikke legge til bruker';
      return;
    }
    adminUsers.value.push(result.user);
    newUserForm.value = { username: '', password: '' };
    addUserSuccess.value = true;
    setTimeout(() => { addUserSuccess.value = false; }, 3000);
  } catch (e: any) {
    addUserError.value = e.message || 'Nettverksfeil';
  }
}

function openEditUser(user: { id: string; username: string; createdAt: string }) {
  editUserError.value = '';
  editUserModal.value = { id: user.id, username: user.username, originalUsername: user.username, password: '' };
}

async function saveEditUser() {
  editUserError.value = '';
  if (!editUserModal.value) return;
  try {
    const res = await fetch('/api/admin-users-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editUserModal.value.id,
        username: editUserModal.value.username,
        password: editUserModal.value.password || undefined
      }),
      credentials: 'include'
    });
    const result = await res.json();
    if (!result.success) {
      editUserError.value = result.error || 'Kunne ikke lagre';
      return;
    }
    const idx = adminUsers.value.findIndex(u => u.id === result.user.id);
    if (idx !== -1) adminUsers.value[idx] = result.user;
    editUserModal.value = null;
  } catch (e: any) {
    editUserError.value = e.message || 'Nettverksfeil';
  }
}

function confirmDeleteAdminUser(user: { id: string; username: string }) {
  adminUserToDelete.value = user;
  showDeleteAdminUserConfirm.value = true;
}

async function deleteAdminUser() {
  if (!adminUserToDelete.value) return;
  try {
    const res = await fetch('/api/admin-users-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: adminUserToDelete.value.id }),
      credentials: 'include'
    });
    const result = await res.json();
    if (!result.success) {
      alert(result.error || 'Kunne ikke slette bruker');
      return;
    }
    adminUsers.value = adminUsers.value.filter(u => u.id !== adminUserToDelete.value!.id);
    showDeleteAdminUserConfirm.value = false;
    adminUserToDelete.value = null;
  } catch (e: any) {
    alert(e.message || 'Feil ved sletting');
  }
}

async function refreshUserActivity() {
  loadingUserActivity.value = true;
  try {
    const data = await $fetch('/api/user-activity') as any;
    userActivityLogs.value = data.logs || [];
  } catch (e) {
    console.error('Feil ved henting av brukeraktivitet:', e);
    userActivityLogs.value = [];
  } finally {
    loadingUserActivity.value = false;
  }
}

async function deleteAllUserActivity() {
  try {
    const res = await fetch('/api/user-activity-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      credentials: 'include'
    });
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || 'Kunne ikke slette brukerloggen');
    }
    userActivityLogs.value = [];
    showDeleteUserActivityConfirm.value = false;
  } catch (e: any) {
    alert(e.message || 'Feil ved sletting av brukerlogg');
  }
}

function formatDateTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString('nb-NO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function exportLogsToCSV() {
  if (logs.value.length === 0) {
    alert('Ingen logger å eksportere');
    return;
  }

  const headers = ['Timestamp', 'Type', 'Enhet', 'Status'];
  const rows = logs.value.map(log => [
    log.timestamp,
    log.type,
    log.device,
    getLogTypeLabel(log.type)
  ]);

  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `aktivitetslogg_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function testHAConnection() {
  try {
    const res = await fetch('/api/ha-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(haSettings.value)
    });
    const result = await res.json();
    haTestResult.value = result;
  } catch (e) {
    haTestResult.value = { success: false, message: 'Kunne ikke teste tilkobling' };
  }
}

async function loadSettings() {
  try {
    const data = await $fetch('/api/settings') as any;
    if (data.success && data.settings) {
      haSettings.value.baseUrl = data.settings.homeAssistant?.baseUrl || haSettings.value.baseUrl;
      haSettings.value.token = data.settings.homeAssistant?.token || haSettings.value.token;
      pollingSettings.value.printerInterval = (data.settings.polling?.printerInterval || 3000) / 1000; // Convert to seconds for UI
      pollingSettings.value.sensorInterval = (data.settings.polling?.sensorInterval || 10000) / 1000;
      logSettings.value.retentionDays = data.settings.logs?.retentionDays || 90;
      if (data.settings.ledThresholds) {
        ledThresholds.value.green = data.settings.ledThresholds.green ?? 30;
        ledThresholds.value.yellow = data.settings.ledThresholds.yellow ?? 40;
        ledThresholds.value.orange = data.settings.ledThresholds.orange ?? 50;
      }
    }
  } catch (e) {
    console.error('Feil ved lasting av innstillinger:', e);
  }
}

async function saveSettings() {
  savingSettings.value = true;
  settingsSaved.value = false;

  try {
    const settings = {
      homeAssistant: haSettings.value,
      polling: {
        printerInterval: pollingSettings.value.printerInterval * 1000, // Convert to milliseconds
        sensorInterval: pollingSettings.value.sensorInterval * 1000
      },
      logs: logSettings.value,
      ledThresholds: ledThresholds.value
    };

    console.log('Sending settings:', settings);

    const res = await fetch('/api/settings-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
      credentials: 'include'
    });

    const result = await res.json();
    console.log('Server response:', result);

    if (result.success) {
      settingsSaved.value = true;
      setTimeout(() => {
        settingsSaved.value = false;
      }, 3000);
    } else {
      const errorMsg = typeof result.error === 'string' ? result.error : 'Ukjent feil';
      alert('Feil ved lagring: ' + errorMsg);
    }
  } catch (e: unknown) {
    console.error('Error saving settings:', e);
    const errMsg = e instanceof Error ? e.message : String(e);
    alert('Feil ved lagring av innstillinger: ' + errMsg);
  } finally {
    savingSettings.value = false;
  }
}

async function addPrinter() {
  error.value = '';
  success.value = false;
  // Sjekk lokalt om IP allerede finnes
  if (printers.value.some(p => p.ip === ip.value)) {
    error.value = 'Printeren er allerede i listen.';
    return;
  }
  loading.value = true;
  try {
    console.log('Legger til printer:', ip.value);
    const res = await fetch('/api/prusa-add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip: ip.value, apiKey: apiKey.value })
    });
    const result = await res.json();
    console.log('Resultat fra prusa-add:', result);
    console.log('res.ok:', res.ok);
    console.log('res.status:', res.status);
    if (!res.ok) {
      if (result.error && result.error.includes('finnes allerede')) {
        error.value = 'Printeren er allerede i listen.';
        success.value = false;
        loading.value = false;
        return;
      }
      throw new Error(result.error || 'Ukjent feil');
    }
    success.value = true;
    error.value = '';
    ip.value = '';
    apiKey.value = '';
    // Vent litt før vi henter på nytt for å sikre at filen er skrevet
    console.log('Venter 500ms før vi henter printere...');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Henter printere på nytt...');
    await fetchPrinters();
    console.log('Printere hentet. Totalt:', printers.value.length);
  } catch (e: any) {
    console.error('Feil ved tillegging av printer:', e);
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
