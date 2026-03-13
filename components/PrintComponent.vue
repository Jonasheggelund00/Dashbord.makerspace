<template>
  <div class="p-6">
    <div class="header">
      <h1 :class="isDark ? 'text-white' : 'text-gray-900'">Prusa Print Status</h1>
      <div class="flex flex-col items-end gap-2">
        <button @click="fetchInfo" class="refresh-btn">
          Oppdater info
        </button>
        <div v-if="lastUpdated" :class="isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-500'">
          Sist oppdatert: {{ lastUpdated }}
        </div>
      </div>
    </div>

    <!-- Filamentskap-stripe -->
    <div v-if="cabinet.online" class="mb-6">
      <div
        :class="isDark
          ? 'inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-gray-800 border border-gray-700 px-4 py-2'
          : 'inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-white shadow-sm border border-gray-200 px-4 py-2'"
      >
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          <span :class="isDark ? 'text-sm font-semibold text-white' : 'text-sm font-semibold text-gray-800'">Filamentskap</span>
        </div>
        <div :class="isDark ? 'w-px h-4 bg-gray-600' : 'w-px h-4 bg-gray-300'"></div>
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 flex-shrink-0" :class="isDark ? 'text-orange-400' : 'text-orange-500'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
          </svg>
          <span :class="isDark ? 'text-sm font-bold text-orange-400' : 'text-sm font-bold text-orange-600'">{{ cabinet.averageTemp }}°C</span>
          <span :class="isDark ? 'text-xs text-gray-500' : 'text-xs text-gray-400'">({{ cabinet.temperature1 }}° / {{ cabinet.temperature2 }}°)</span>
        </div>
        <div :class="isDark ? 'w-px h-4 bg-gray-600' : 'w-px h-4 bg-gray-300'"></div>
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 flex-shrink-0" :class="isDark ? 'text-blue-400' : 'text-blue-500'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
          </svg>
          <span :class="isDark ? 'text-sm font-bold text-blue-400' : 'text-sm font-bold text-blue-600'">{{ cabinet.averageHumidity }}%</span>
          <span :class="isDark ? 'text-xs text-gray-500' : 'text-xs text-gray-400'">({{ cabinet.humidity1 }}% / {{ cabinet.humidity2 }}%)</span>
        </div>
      </div>
    </div>

    <div v-if="printerList.length">
      <!-- MK4S og Mini Section - Bruker én felles v-for over printerList -->
      <!-- MK4S Section -->
      <div v-if="mk4sPrinters.length" class="mb-8">
        <div class="flex items-center mb-4">
          <h2
            :class="isDark ? 'text-xl font-semibold text-white mr-4 whitespace-nowrap' : 'text-xl font-semibold text-gray-800 mr-4 whitespace-nowrap'">
            MK4S</h2>
          <div :class="isDark ? 'flex-grow border-t-2 border-gray-600' : 'flex-grow border-t-2 border-gray-300'"></div>
        </div>
        <div class="printer-grid">
          <div v-for="printer in mk4sPrinters" :key="printer.serial || printer.ip" class="printer-card">
            <!-- Header med navn og status -->
            <div class="printer-card-header">
              <div class="printer-title">
                <span class="printer-model">{{ modelName(printer.hostname) }}</span>
                <span v-if="printer.displayName" class="printer-name">{{ printer.displayName }}</span>
              </div>
              <span class="status-badge" :class="getStatusClass(printer)">
                {{ getStatusText(printer) }}
              </span>
            </div>

            <!-- Printer-bilde -->
            <div class="printer-image-wrapper">
              <img :src="printerImage(printer.hostname)" :alt="'Bilde av ' + modelName(printer.hostname)"
                class="printer-img" />
            </div>


            <!-- Informasjon -->
            <div class="printer-details">
              <!-- Temperaturer -->
              <div class="temp-grid">
                <div class="temp-item">
                  <div class="temp-label">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" />
                    </svg>
                    Bed
                  </div>
                  <div class="temp-value">
                    <span class="current">{{ printer.temp_bed }}°</span>
                    <span class="target">/ {{ printer.target_bed }}°</span>
                  </div>
                </div>
                <div class="temp-item">
                  <div class="temp-label">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" />
                    </svg>
                    Dyse <span class="ml-1 text-xs text-gray-400">{{ printer.nozzle_diameter }} mm</span>
                  </div>
                  <div class="temp-value">
                    <span class="current">{{ printer.temp_nozzle }}°</span>
                    <span class="target">/ {{ printer.target_nozzle }}°</span>
                  </div>
                </div>
              </div>

              <!-- Print info (hvis printer) -->
              <div v-if="printer.job && printer.state === 'PRINTING'" class="print-info">
                <!-- Filnavn -->
                <div v-if="printer.job.file && printer.job.file.display_name" class="filename-display">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  <span class="filename-text" :title="printer.job.file.display_name">{{ printer.job.file.display_name
                    }}</span>
                  <a v-if="printer.job.file.refs && printer.job.file.refs.download"
                    :href="`/api/download-file?ip=${printer.ip}&path=${encodeURIComponent(printer.job.file.refs.download)}&filename=${encodeURIComponent(printer.job.file.display_name)}`"
                    class="download-btn" :title="'Last ned ' + printer.job.file.display_name">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                    </svg>
                  </a>
                </div>
                <div class="progress-section">
                  <div class="progress-header">
                    <span class="progress-label">Fremdrift</span>
                    <span class="progress-percent">{{ Math.round(printer.job.progress) }}%</span>
                  </div>
                  <div class="progress-bar-wrapper">
                    <div class="progress-bar-fill" :style="{ width: Math.round(printer.job.progress) + '%' }"></div>
                  </div>
                </div>
                <div class="time-grid">
                  <div class="time-item">
                    <span class="time-label">Tid brukt</span>
                    <span class="time-value">{{ formatTime(printer.job.time_printing) }}</span>
                  </div>
                  <div class="time-item">
                    <span class="time-label">Tid igjen</span>
                    <span class="time-value">{{ formatTime(printer.job.time_remaining) }}</span>
                  </div>
                </div>
              </div>

              <!-- Status info (hvis ikke printer) -->
              <div v-else class="status-info">
                <p>{{ getDetailedStatus(printer.state) }}</p>
              </div>
            </div>

            <!-- Feilmelding -->
            <div v-if="printer?.error" class="printer-error">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              {{ printer?.error }}
            </div>

            <div class="status-bar" :class="getStatusClass(printer)"></div>
          </div>
        </div>
      </div>

      <!-- Mini Section -->
      <div v-if="miniPrinters.length" class="mb-8">
        <div class="flex items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800 mr-4 whitespace-nowrap">Mini</h2>
          <div class="flex-grow border-t-2 border-gray-300"></div>
        </div>
        <div class="printer-grid">
          <div v-for="printer in miniPrinters" :key="printer.serial || printer.ip" class="printer-card">
            <!-- Header med navn og status -->
            <div class="printer-card-header">
              <div class="printer-title">
                <span class="printer-model">{{ modelName(printer.hostname) }}</span>
                <span v-if="printer.displayName" class="printer-name">{{ printer.displayName }}</span>
              </div>
              <span class="status-badge" :class="getStatusClass(printer)">
                {{ getStatusText(printer) }}
              </span>
            </div>

            <!-- Printer-bilde -->
            <div class="printer-image-wrapper">
              <img :src="printerImage(printer.hostname)" :alt="'Bilde av ' + modelName(printer.hostname)"
                class="printer-img" />
            </div>


            <!-- Informasjon -->
            <div class="printer-details">
              <!-- Temperaturer -->
              <div class="temp-grid">
                <div class="temp-item">
                  <div class="temp-label">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" />
                    </svg>
                    Bed
                  </div>
                  <div class="temp-value">
                    <span class="current">{{ printer.temp_bed }}°</span>
                    <span class="target">/ {{ printer.target_bed }}°</span>
                  </div>
                </div>
                <div class="temp-item">
                  <div class="temp-label">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" />
                    </svg>
                    Dyse <span class="ml-1 text-xs text-gray-400">{{ printer.nozzle_diameter }} mm</span>
                  </div>
                  <div class="temp-value">
                    <span class="current">{{ printer.temp_nozzle }}°</span>
                    <span class="target">/ {{ printer.target_nozzle }}°</span>
                  </div>
                </div>
              </div>

              <!-- Print info (hvis printer) -->
              <div v-if="printer.job && printer.state === 'PRINTING'" class="print-info">
                <!-- Filnavn -->
                <div v-if="printer.job.file && printer.job.file.display_name" class="filename-display">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  <span class="filename-text" :title="printer.job.file.display_name">{{ printer.job.file.display_name
                    }}</span>
                  <a v-if="printer.job.file.refs && printer.job.file.refs.download"
                    :href="`/api/download-file?ip=${printer.ip}&path=${encodeURIComponent(printer.job.file.refs.download)}&filename=${encodeURIComponent(printer.job.file.display_name)}`"
                    class="download-btn" :title="'Last ned ' + printer.job.file.display_name">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                    </svg>
                  </a>
                </div>
                <div class="progress-section">
                  <div class="progress-header">
                    <span class="progress-label">Fremdrift</span>
                    <span class="progress-percent">{{ Math.round(printer.job.progress) }}%</span>
                  </div>
                  <div class="progress-bar-wrapper">
                    <div class="progress-bar-fill" :style="{ width: Math.round(printer.job.progress) + '%' }"></div>
                  </div>
                </div>
                <div class="time-grid">
                  <div class="time-item">
                    <span class="time-label">Tid brukt</span>
                    <span class="time-value">{{ formatTime(printer.job.time_printing) }}</span>
                  </div>
                  <div class="time-item">
                    <span class="time-label">Tid igjen</span>
                    <span class="time-value">{{ formatTime(printer.job.time_remaining) }}</span>
                  </div>
                </div>
              </div>

              <!-- Status info (hvis ikke printer) -->
              <div v-else class="status-info">
                <p>{{ getDetailedStatus(printer.state) }}</p>
              </div>
            </div>

            <!-- Feilmelding -->
            <div v-if="printer?.error" class="printer-error">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              {{ printer?.error }}
            </div>

            <!-- Fargestripe nederst -->
            <div class="status-bar" :class="getStatusClass(printer)"></div>
          </div>
        </div>
      </div>

      <!-- XL Section -->
      <div v-if="xlPrinters.length" class="mb-8">
        <div class="flex items-center mb-4">
          <h2
            :class="isDark ? 'text-xl font-semibold text-white mr-4 whitespace-nowrap' : 'text-xl font-semibold text-gray-800 mr-4 whitespace-nowrap'">
            Prusa XL</h2>
          <div :class="isDark ? 'flex-grow border-t-2 border-gray-600' : 'flex-grow border-t-2 border-gray-300'"></div>
        </div>
        <!-- XL printer med horisontalt layout -->
        <div v-for="printer in xlPrinters" :key="printer.serial || printer.ip" class="xl-printer-card">
          <!-- Venstre side: Printer-bilde -->
          <div class="xl-image-section">
            <img :src="printerImage(printer.hostname)" :alt="'Bilde av ' + modelName(printer.hostname)"
              class="xl-printer-img" />
          </div>

          <!-- Høyre side: All info -->
          <div class="xl-info-section">
            <!-- Header med navn og status -->
            <div class="printer-card-header">
              <div class="printer-title">
                <span class="printer-model">{{ modelName(printer.hostname) }}</span>
                <span v-if="printer.displayName" class="printer-name">{{ printer.displayName }}</span>
              </div>
              <span class="status-badge" :class="getStatusClass(printer)">
                {{ getStatusText(printer) }}
              </span>
            </div>

            <!-- Informasjon -->
            <div class="printer-details">
              <!-- Temperaturer -->
              <div class="temp-grid">
                <div class="temp-item">
                  <div class="temp-label">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" />
                    </svg>
                    Bed
                  </div>
                  <div class="temp-value">
                    <span class="current">{{ printer.temp_bed }}°</span>
                    <span class="target">/ {{ printer.target_bed }}°</span>
                  </div>
                </div>
                <div class="temp-item">
                  <div class="temp-label">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" />
                    </svg>
                    Dyse <span class="ml-1 text-xs text-gray-400">{{ printer.nozzle_diameter }} mm</span>
                  </div>
                  <div class="temp-value">
                    <span class="current">{{ printer.temp_nozzle }}°</span>
                    <span class="target">/ {{ printer.target_nozzle }}°</span>
                  </div>
                </div>
              </div>

              <!-- Print info (hvis printer) -->
              <div v-if="printer.job && printer.state === 'PRINTING'" class="print-info">
                <!-- Filnavn -->
                <div v-if="printer.job.file && printer.job.file.display_name" class="filename-display">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  <span class="filename-text" :title="printer.job.file.display_name">{{ printer.job.file.display_name
                    }}</span>
                  <a v-if="printer.job.file.refs && printer.job.file.refs.download"
                    :href="`/api/download-file?ip=${printer.ip}&path=${encodeURIComponent(printer.job.file.refs.download)}&filename=${encodeURIComponent(printer.job.file.display_name)}`"
                    class="download-btn" :title="'Last ned ' + printer.job.file.display_name">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                    </svg>
                  </a>
                </div>
                <div class="progress-section">
                  <div class="progress-header">
                    <span class="progress-label">Fremdrift</span>
                    <span class="progress-percent">{{ Math.round(printer.job.progress) }}%</span>
                  </div>
                  <div class="progress-bar-wrapper">
                    <div class="progress-bar-fill" :style="{ width: Math.round(printer.job.progress) + '%' }"></div>
                  </div>
                </div>
                <div class="time-grid">
                  <div class="time-item">
                    <span class="time-label">Tid brukt</span>
                    <span class="time-value">{{ formatTime(printer.job.time_printing) }}</span>
                  </div>
                  <div class="time-item">
                    <span class="time-label">Tid igjen</span>
                    <span class="time-value">{{ formatTime(printer.job.time_remaining) }}</span>
                  </div>
                </div>
              </div>

              <!-- Status info (hvis ikke printer) -->
              <div v-else class="status-info">
                <p>{{ getDetailedStatus(printer.state) }}</p>
              </div>
            </div>

            <!-- Feilmelding -->
            <div v-if="printer?.error" class="printer-error">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              {{ printer?.error }}
            </div>

            <div class="status-bar" :class="getStatusClass(printer)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Spinner og lastetekst når printere lastes inn -->
    <div v-if="!printerList.length && !error" class="flex flex-col items-center justify-center py-16">
      <div class="mb-4 text-lg font-semibold text-gray-700">Laster inn printere...</div>
      <div class="spinner border-4 border-orange-400 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
    </div>
    <div v-if="error" class="error-msg">{{ error }}</div>
  </div>
</template>

<style scoped>
/* --- Spinner --- */
.spinner {
  border-width: 4px;
  border-color: #fb923c;
  border-top-color: transparent;
  border-radius: 9999px;
  width: 3rem;
  height: 3rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* --- Layout --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
}

/* --- Oppdater-knapp --- */
.refresh-btn {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.25s ease;
}

.refresh-btn:hover {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
}

.refresh-btn:active {
  transform: scale(0.98);
}

/* --- Printer grid --- */
.printer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 400px));
  gap: 2rem;
  margin: auto;
  justify-content: center;
}

/* --- Printer kort --- */
.printer-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  border: 1px solid #e5e7eb;
}

.printer-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* --- Printer kort header --- */
.printer-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.printer-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.printer-model {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.printer-name {
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
}

/* --- Feilmelding --- */
.printer-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 1.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border-left: 3px solid #dc2626;
}

/* --- Printer-bilde --- */
.printer-image-wrapper {
  background: #fafafa;
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.printer-img {
  width: 160px;
  height: auto;
  object-fit: contain;
}

/* --- Info --- */
.printer-details {
  padding: 1.5rem;
  color: #334155;
}

/* --- Status badge --- */
.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.75rem;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-badge.printing {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.status-badge.error {
  background: #991b1b;
  color: #ffffff;
  border: 1px solid #991b1b;
}

.status-badge.attention {
  background: #fefce8;
  color: #854d0e;
  border: 1px solid #fef08a;
}

.status-badge.paused {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #dbeafe;
}

.status-badge.stopped {
  background: #f9fafb;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.status-badge.busy {
  background: #fff7ed;
  color: #9a3412;
  border: 1px solid #fed7aa;
}

.status-badge.finished {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

/* --- Temperatur grid --- */
.temp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.temp-item {
  background: #fafafa;
  padding: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.temp-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.temp-label svg {
  color: #9ca3af;
}

.temp-value {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.temp-value .current {
  font-size: 1.375rem;
  font-weight: 600;
  color: #111827;
}

.temp-value .target {
  font-size: 0.875rem;
  font-weight: 400;
  color: #9ca3af;
}

/* --- Print info --- */
.print-info {
  margin-top: 1rem;
}

/* --- Filnavn display --- */
.filename-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.875rem;
}

.filename-display svg {
  flex-shrink: 0;
  color: #6b7280;
}

.filename-text {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.download-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  background: transparent;
  color: #6b7280;
  transition: all 0.2s ease;
  cursor: pointer;
}

.download-btn:hover {
  color: #374151;
  transform: scale(1.15);
}

.download-btn:active {
  transform: scale(0.95);
}

.download-btn svg {
  color: inherit;
}

.progress-section {
  margin-bottom: 0.875rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.progress-percent {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

/* --- Time grid --- */
.time-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
}

.time-item {
  background: #fafafa;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.time-label {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.time-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
}

/* --- Status info --- */
.status-info {
  margin-top: 0.875rem;
  padding: 0.875rem;
  background: #fafafa;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.status-info p {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
}

.info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 1rem;
}

.info-list li {
  margin-bottom: 0.4rem;
}

.info-list .target {
  color: #94a3b8;
  font-size: 0.9rem;
}

.info-list .yes {
  color: #22c55e;
  font-weight: 600;
}

.info-list .no {
  color: #ef4444;
  font-weight: 600;
}

.info-list .error {
  color: #dc2626;
  font-weight: 600;
}

/* --- Kompakt job-info og progressbar (legacy) --- */
.job-info-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 0.7rem;
  margin-bottom: 0.2rem;
}

.progress-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar-bg {
  background: #e5e7eb;
  border-radius: 6px;
  width: 70px;
  height: 8px;
  overflow: hidden;
  position: relative;
}

.progress-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fb923c;
}

.job-badge {
  background: #f3f4f6;
  color: #334155;
  border-radius: 0.5rem;
  padding: 0.2rem 0.7rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: inline-block;
}

/* --- Statuslinje nederst --- */
.status-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #10b981;
  transition: background 0.3s;
}

/* Grønn - Ledig/Ferdig */
.status-bar.idle,
.status-bar.ready,
.status-bar.finished {
  background: #10b981;
}

/* Rød - I bruk/Feil */
.status-bar.printing,
.status-bar.error {
  background: #dc2626;
}

/* Gul - Opptatt/Attention */
.status-bar.busy,
.status-bar.attention {
  background: #eab308;
}

/* Blå - Pause/Stoppet */
.status-bar.paused,
.status-bar.stopped {
  background: #3b82f6;
}

/* --- Feilmeldinger --- */
.error-msg {
  color: #b91c1c;
  margin-top: 1.5rem;
  font-weight: 600;
}

/* --- XL Printer Card (Horisontalt layout) --- */
.xl-printer-card {
  display: flex;
  gap: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.xl-printer-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.xl-image-section {
  flex-shrink: 0;
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.xl-printer-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 350px;
}

.xl-info-section {
  flex: 1;
  padding: 1.5rem;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Status bar for XL printer - kun på høyre siden */
.xl-info-section .status-bar {
  left: -1.5rem;
  width: calc(100% + 1.5rem);
}

@media (max-width: 1024px) {
  .xl-info-section .status-bar {
    left: 0;
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .xl-printer-card {
    flex-direction: column;
  }
  
  .xl-image-section {
    width: 100%;
    padding: 1.5rem;
  }
  
  .xl-printer-img {
    max-height: 250px;
  }
  
  .xl-info-section {
    padding: 1.5rem;
  }
}
</style>


<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useState } from '#app'
import { sharedPrinterList } from './printerState.js'
import { useRoute } from 'vue-router'

// Dark mode state
const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false;
  }
  return false;
});

const printerList = sharedPrinterList
const error = ref(null)
const lastUpdated = ref('')
let intervalId = null

// Filamentskap
const cabinet = ref({ online: false })
let cabinetInterval = null
async function fetchCabinet() {
  try {
    const data = await $fetch('/api/filament-cabinet')
    cabinet.value = data
  } catch {
    cabinet.value = { online: false }
  }
}
const pollingInterval = ref(3000) // Default 3 seconds
const route = useRoute()

// Computed properties for filtering printers
const mk4sPrinters = computed(() => {
  return printerList.value
    .filter(printer => printer.hostname && printer.hostname.toLowerCase().includes('mk4'))
    .sort((a, b) => {
      const nameA = (a.displayName || a.hostname || a.ip).toLowerCase();
      const nameB = (b.displayName || b.hostname || b.ip).toLowerCase();
      return nameA.localeCompare(nameB);
    });
})

const miniPrinters = computed(() => {
  return printerList.value
    .filter(printer => printer.hostname && printer.hostname.toLowerCase().includes('mini'))
    .sort((a, b) => {
      const nameA = (a.displayName || a.hostname || a.ip).toLowerCase();
      const nameB = (b.displayName || b.hostname || b.ip).toLowerCase();
      return nameA.localeCompare(nameB);
    });
})

const xlPrinters = computed(() => {
  return printerList.value
    .filter(printer => printer.hostname && printer.hostname.toLowerCase().includes('xl'))
    .sort((a, b) => {
      const nameA = (a.displayName || a.hostname || a.ip).toLowerCase();
      const nameB = (b.displayName || b.hostname || b.ip).toLowerCase();
      return nameA.localeCompare(nameB);
    });
})


async function fetchInfo() {
  error.value = null

  // Oppdater tidspunkt umiddelbart når funksjonen kalles
  const now = new Date()
  lastUpdated.value = now.toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  try {
    const res = await fetch('/api/prusa')
    const data = await res.json()
    
    // API returnerer alltid en array
    if (Array.isArray(data)) {
      printerList.value = data
      error.value = null
    } else {
      console.error('Uventet respons fra /api/prusa:', data)
      error.value = 'Uventet respons fra server'
      printerList.value = []
    }
  } catch (e) {
    error.value = e.message
    printerList.value = []
  }
}

function printerImage(hostname) {
  if (!hostname) return ''
  if (hostname.toLowerCase().includes('xl')) return '/printere/Prusa-XL.png'
  if (hostname.toLowerCase().includes('mk4')) return '/printere/prusa-mk4s.png'
  if (hostname.toLowerCase().includes('mini')) return '/printere/prusa-mini.png'
  return '/printere/prusa-mk4s.png' // fallback
}

function modelName(hostname) {
  if (!hostname) return ''
  if (hostname.toLowerCase().includes('xl')) return 'Prusa XL'
  if (hostname.toLowerCase().includes('mk4')) return 'Prusa MK4S'
  if (hostname.toLowerCase().includes('mini')) return 'Prusa Mini'
  return hostname
}

async function loadPollingInterval() {
  try {
    const data = await fetch('/api/settings')
    const result = await data.json()
    if (result.success && result.settings?.polling?.printerInterval) {
      pollingInterval.value = result.settings.polling.printerInterval
      // Restart polling med nytt intervall hvis det kjører allerede
      if (intervalId && (route.path === '/' || route.path === '/3dprintere')) {
        startPolling()
      }
    }
  } catch (e) {
    console.error('Kunne ikke laste polling-intervall:', e)
  }
}

function startPolling() {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(fetchInfo, pollingInterval.value)
}

onMounted(() => {
  loadPollingInterval()
  if (route.path === '/' || route.path === '/3dprintere') {
    fetchInfo()
    startPolling()
  }
  fetchCabinet()
  cabinetInterval = setInterval(fetchCabinet, 10000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (cabinetInterval) clearInterval(cabinetInterval)
  // Ikke tøm printerList her, så den bevares mellom navigasjon
})

watch(() => route.path, (newPath, oldPath) => {
  if (newPath === '/' || newPath === '/3dprintere') {
    fetchInfo()
    startPolling()
  } else {
    if (intervalId) clearInterval(intervalId)
    // Ikke tøm printerList her, så den bevares mellom navigasjon
  }
})


function formatTime(sec) {
  if (typeof sec !== 'number' || isNaN(sec)) return '-';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Hjelpefunksjon for å få detaljert status-tekst
function getDetailedStatus(state) {
  if (!state) return 'Ukjent';

  const statusMap = {
    'IDLE': 'Ledig',
    'READY': 'Klar til å printe',
    'PRINTING': 'Printer aktiv',
    'PAUSED': 'Pause',
    'FINISHED': 'Print ferdig',
    'STOPPED': 'Stoppet',
    'ERROR': 'Feil',
    'ATTENTION': 'Trenger oppmerksomhet',
    'BUSY': 'Opptatt'
  };

  return statusMap[state] || state;
}

// Hjelpefunksjon for å få status-tekst for badge
function getStatusText(printer) {
  if (printer.error) return 'Feil';
  if (!printer.state) return 'Ukjent';

  const state = printer.state.toUpperCase();

  if (state === 'PRINTING') return 'I bruk';
  if (state === 'IDLE' || state === 'READY') return 'Ledig';
  if (state === 'PAUSED') return 'Pause';
  if (state === 'FINISHED') return 'Ferdig';
  if (state === 'STOPPED') return 'Stoppet';
  if (state === 'ERROR') return 'Feil';
  if (state === 'ATTENTION') return 'OBS!';
  if (state === 'BUSY') return 'Opptatt';

  return printer.state;
}

// Hjelpefunksjon for å få CSS-klasser for status badge
function getStatusClass(printer) {
  if (printer.error) return 'error';
  if (!printer.state) return '';

  const state = printer.state.toUpperCase();

  if (state === 'PRINTING') return 'printing';
  if (state === 'ERROR') return 'error';
  if (state === 'ATTENTION') return 'attention';
  if (state === 'PAUSED') return 'paused';
  if (state === 'STOPPED') return 'stopped';
  if (state === 'BUSY') return 'busy';
  if (state === 'FINISHED') return 'finished';

  return ''; // IDLE, READY får standard grønn
}

</script>
