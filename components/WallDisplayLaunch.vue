<template>
  <NuxtLink
    to="/oppslag"
    class="group flex items-center justify-between gap-3 rounded-2xl p-5 min-h-[96px] !text-white shadow-sm transition-colors duration-200 !bg-emerald-600 hover:!bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
  >
    <div class="min-w-0">
      <p class="text-base sm:text-lg font-semibold leading-none whitespace-nowrap truncate">Oppslagsskjerm</p>
      <p class="mt-1 text-sm text-white/80 leading-none whitespace-nowrap truncate">Fullskjerm for veggdisplay</p>
    </div>
    <svg class="w-5 h-5 flex-shrink-0 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
    </svg>
  </NuxtLink>
</template>
