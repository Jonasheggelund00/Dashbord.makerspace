<template>
  <div :class="isDark ? 'min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'">
    <Header />

    <PrintComponent />
  </div>
</template>


<script setup>
import { useState } from '#app';
import Header from '../components/Header.vue';
import PrintComponent from '../components/PrintComponent.vue';

const isDark = useState('darkMode', () => {
  if (process.client) {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false;
  }
  return false;
});
</script>
