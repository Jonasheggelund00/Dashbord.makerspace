<template>
  <NuxtLink
    to="/oppslag"
    class="group flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-5 transition-colors duration-200"
  >
    <div>
      <p class="font-bold text-lg">Oppslagsskjerm</p>
      <p class="text-emerald-100 text-sm">Fullskjerm for veggdisplay</p>
    </div>
    <svg class="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
    </svg>
  </NuxtLink>
</template>
