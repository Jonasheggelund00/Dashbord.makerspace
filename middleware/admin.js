
import { defineNuxtRouteMiddleware, navigateTo, useRequestHeaders } from '#app'

export default defineNuxtRouteMiddleware(async () => {
  let isAdmin = false;

  if (process.server) {
    // Hent cookies fra request headers
    const cookies = useRequestHeaders(['cookie']).cookie || '';
    const match = cookies.match(/admin_session=([^;]+)/);
    if (match && match[1] === 'Jonas00') { // evt. bruk env-verdi
      isAdmin = true;
    }
  } else {
    // Klient: Sjekk admin-status via API
    try {
      const res = await $fetch('/api/check-admin', { credentials: 'include' });
      isAdmin = res.isAdmin;
    } catch {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    return navigateTo('/login');
  }
});
