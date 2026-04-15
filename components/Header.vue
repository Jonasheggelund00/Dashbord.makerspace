<!-- components/Header.vue -->
<template>
  <div class="w-full">
  <header class="fixed top-0 left-0 right-0 z-50 text-white w-full bg-gray-800 backdrop-blur shadow-md">
    <!-- Top bar -->
    <div class="container mx-auto flex items-center justify-between px-5 py-4 relative z-10">
      <!-- Logo -->

      <a href="/">
      <img
        src="/logo.png"
        alt="Makerspace Logo"
        class="h-12"
      />
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden xl:flex flex-1 justify-center">
        <ul class="flex gap-5 items-center">
          <li>
            <NuxtLink
              to="/hjem"
              class="tab-button relative font-bold px-4 py-2 rounded-lg transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur"
              :class="{ 'active': isActive('hjem') }"
            >
              <span class="relative z-10">Hjem</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/3dprintere"
              class="tab-button relative font-bold px-4 py-2 rounded-lg transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur"
              :class="{ 'active': isActive('3d') }"
            >
              <span class="relative z-10">3D-printere</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/loddestasjon"
              class="tab-button relative font-bold px-4 py-2 rounded-lg transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur"
              :class="{ 'active': isActive('loddestasjon') }"
            >
              <span class="relative z-10">Loddestasjon</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/laserkutter"
              class="tab-button relative font-bold px-4 py-2 rounded-lg transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur"
              :class="{ 'active': isActive('laserkutter') }"
            >
              <span class="relative z-10">Laserkutter</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/storformatprinter"
              class="tab-button relative font-bold px-4 py-2 rounded-lg transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur"
              :class="{ 'active': isActive('storformatprinter') }"
            >
              <span class="relative z-10">Storformatskriver</span>
            </NuxtLink>
          </li>
          <li v-if="user">
            <NuxtLink
              to="/admin"
              class="tab-button relative font-bold px-4 py-2 rounded-lg transition-all duration-300 border border-orange-400 bg-white/5 backdrop-blur"
              :class="{ 'active': isActive('admin') }"
            >
              <span class="relative z-10">Admin</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/om"
              class="tab-button relative font-bold px-4 py-2 rounded-lg transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur"
              :class="{ 'active': isActive('om') }"
            >
              <span class="relative z-10">Om</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Right side: dark mode + user (desktop) + hamburger (mobile) -->
      <div class="flex items-center gap-3">
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg bg-white/10 hover:bg-orange-400 transition-colors duration-200 border border-white/10"
          :title="isDark ? 'Bytt til lys modus' : 'Bytt til mørk modus'"
        >
          <svg v-if="isDark" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
          <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </button>

        <!-- User menu (desktop only) -->
        <div class="relative hidden xl:flex items-center">
          <template v-if="user === ''">
            <NuxtLink to="/login" class="tab-button relative font-bold px-4 py-2 rounded-lg transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur">Logg inn</NuxtLink>
          </template>
          <template v-else>
            <div ref="dropdownBtn" @click="toggleDropdown" class="cursor-pointer select-none flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-orange-400 transition-colors duration-200 shadow-sm border border-white/10">
              <span class="font-semibold">Hei, {{ user }}</span>
              <svg :class="{'rotate-180': showDropdown}" class="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </div>
            <transition name="dropdown-fade-slide">
              <div v-if="showDropdown" ref="dropdownMenu" class="absolute right-0 top-full mt-2 w-52 bg-white text-gray-800 rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
                <button @click="logout" class="block w-full text-left px-5 py-3 hover:bg-orange-50 transition-colors font-medium">Logg ut</button>
              </div>
            </transition>
          </template>
        </div>

        <!-- Hamburger button (mobile only) -->
        <button
          class="xl:hidden p-2 rounded-lg bg-white/10 hover:bg-orange-400 transition-colors duration-200 border border-white/10"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Åpne meny"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="xl:hidden bg-gray-900 border-t border-white/10 px-5 pb-5 z-20 relative">
        <ul class="flex flex-col gap-2 pt-4">
          <li>
            <NuxtLink
              to="/hjem"
              class="tab-button block font-bold px-4 py-3 rounded-lg transition-all duration-300 border border-white/10 bg-white/5"
              :class="{ 'active': isActive('hjem') }"
              @click="mobileMenuOpen = false"
            >Hjem</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/3dprintere"
              class="tab-button block font-bold px-4 py-3 rounded-lg transition-all duration-300 border border-white/10 bg-white/5"
              :class="{ 'active': isActive('3d') }"
              @click="mobileMenuOpen = false"
            >3D-printere</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/loddestasjon"
              class="tab-button block font-bold px-4 py-3 rounded-lg transition-all duration-300 border border-white/10 bg-white/5"
              :class="{ 'active': isActive('loddestasjon') }"
              @click="mobileMenuOpen = false"
            >Loddestasjon</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/laserkutter"
              class="tab-button block font-bold px-4 py-3 rounded-lg transition-all duration-300 border border-white/10 bg-white/5"
              :class="{ 'active': isActive('laserkutter') }"
              @click="mobileMenuOpen = false"
            >Laserkutter</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/storformatprinter"
              class="tab-button block font-bold px-4 py-3 rounded-lg transition-all duration-300 border border-white/10 bg-white/5"
              :class="{ 'active': isActive('storformatprinter') }"
              @click="mobileMenuOpen = false"
            >Storformatskriver</NuxtLink>
          </li>
          <li v-if="user">
            <NuxtLink
              to="/admin"
              class="tab-button block font-bold px-4 py-3 rounded-lg transition-all duration-300 border border-orange-400 bg-white/5"
              :class="{ 'active': isActive('admin') }"
              @click="mobileMenuOpen = false"
            >Admin</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/om"
              class="tab-button block font-bold px-4 py-3 rounded-lg transition-all duration-300 border border-white/10 bg-white/5"
              :class="{ 'active': isActive('om') }"
              @click="mobileMenuOpen = false"
            >Om</NuxtLink>
          </li>
        </ul>

        <!-- User section in mobile menu -->
        <div class="mt-4 pt-4 border-t border-white/10">
          <template v-if="user === ''">
            <NuxtLink to="/login" class="tab-button block font-bold px-4 py-3 rounded-lg transition-all duration-300 border border-white/10 bg-white/5" @click="mobileMenuOpen = false">Logg inn</NuxtLink>
          </template>
          <template v-else>
            <p class="text-sm text-white/60 mb-2 px-1">Logget inn som <span class="font-semibold text-white">{{ user }}</span></p>
            <button @click="logout" class="tab-button block w-full text-left font-bold px-4 py-3 rounded-lg transition-all duration-300 border border-white/10 bg-white/5">Logg ut</button>
          </template>
        </div>
      </div>
    </transition>
  </header>
  <div class="h-20"></div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useState } from '#app';

const route = useRoute();
const router = useRouter();
const user = useState('user', () => '');

// Dark mode state (shared across app)
const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false; // Default to LIGHT mode
  }
  return false;
});

function toggleDarkMode() {
  isDark.value = !isDark.value;
  if (process.client) {
    localStorage.setItem('darkMode', isDark.value.toString());
  }
}

import { onBeforeUnmount, nextTick, watch } from 'vue';
const showDropdown = ref(false)
const dropdownBtn = ref(null)
const dropdownMenu = ref(null)
const mobileMenuOpen = ref(false)

// Close mobile menu on route change
watch(() => route.path, () => { mobileMenuOpen.value = false })

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    nextTick(() => {
      document.addEventListener('mousedown', handleClickOutside)
    })
  }
}

function handleClickOutside(e) {
  if (
    dropdownMenu.value &&
    !dropdownMenu.value.contains(e.target) &&
    dropdownBtn.value &&
    !dropdownBtn.value.contains(e.target)
  ) {
    showDropdown.value = false
    document.removeEventListener('mousedown', handleClickOutside)
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

function isActive(tab) {
  if (tab === 'hjem') return route.path === '/' || route.path === '/hjem';
  if (tab === '3d') return route.path === '/3dprintere';
  if (tab === 'admin') return route.path.startsWith('/admin');
  if (tab === 'loddestasjon') return route.path.startsWith('/loddestasjon');
  if (tab === 'laserkutter') return route.path.startsWith('/laserkutter');
  if (tab === 'storformatprinter') return route.path.startsWith('/storformatprinter');
  if (tab === 'om') return route.path.startsWith('/om');

  return false;
}

async function checkUser() {
  const res = await fetch('/api/check-admin', { credentials: 'include' });
  const data = await res.json();
  user.value = data.isAdmin ? (data.username || '') : '';
}
onMounted(checkUser);

async function logout() {
  await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  user.value = '';
  setTimeout(() => {
    router.push('/hjem');
  }, 0);
}
</script>

<style scoped>
.tab-button {
  white-space: nowrap;
}

.tab-button::before {
  content: '';

}

.tab-button:hover::before,
.tab-button.active::before {
  transform: scaleX(1);
}

.tab-button:hover,
.tab-button.active {
  background-color: #ff8d12;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 141, 18, 0.4);
  transform: translateY(-2px);
}
/* Dropdown animation */
.dropdown-fade-slide-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-fade-slide-leave-active {
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}
.dropdown-fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.dropdown-fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.dropdown-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

/* Mobile menu animation */
.mobile-menu-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-menu-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.mobile-menu-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.mobile-menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
