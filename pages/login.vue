<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col">

    <!-- Top bar with logo + back button -->
    <div class="flex items-center justify-between px-4 sm:px-8 pt-6 pb-2">
      <a href="/hjem">
        <img src="/logo.png" alt="Makerspace Logo" class="h-12 sm:h-16" />
      </a>
      <a href="/hjem"
        class="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors text-sm sm:text-base">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Tilbake til hjemmesiden
      </a>
    </div>

    <!-- Centered form -->
    <div class="flex-1 flex items-center justify-center px-4 py-8">
      <form @submit.prevent="onLogin"
        :class="[shake ? 'animate-shake' : '', 'bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200 animate-fade-in']">
        <h2 class="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Logg inn
        </h2>

        <div class="mb-5">
          <label class="block mb-2 font-medium text-gray-700">Brukernavn</label>
          <input v-model="username" @input="error = ''"
            :class="error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition"
            placeholder="Skriv inn brukernavn" required />
        </div>

        <div class="mb-6">
          <label class="block mb-2 font-medium text-gray-700">Passord</label>
          <input v-model="password" type="password" @input="error = ''"
            :class="error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition"
            placeholder="••••••••" required />
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white py-2.5 rounded-lg font-semibold shadow-md hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg v-if="loading" class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ loading ? 'Logger inn...' : 'Logg inn' }}
        </button>

        <transition name="fade-msg">
          <div v-if="error" class="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>
        </transition>
      </form>
    </div>

    <footer class="w-full bg-gray-800 text-white text-center py-3">
      <div class="container mx-auto text-sm">
        Makerspace Halden
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const shake = ref(false)
const router = useRouter()

async function onLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
      credentials: 'include'
    })
    if (res.ok) {
      setTimeout(() => router.push('/admin'), 0)
    } else {
      error.value = 'Feil brukernavn eller passord'
      shake.value = true
      setTimeout(() => { shake.value = false }, 500)
    }
  } catch (e) {
    error.value = 'Nettverksfeil – prøv igjen'
  } finally {
    loading.value = false
  }
}
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-shake {
  animation: shake 0.45s ease-in-out;
}

.fade-msg-enter-active, .fade-msg-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-msg-enter-from, .fade-msg-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
