<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// Redirect til /hjem siden som ny startside
const router = useRouter();
onMounted(() => {
  router.push('/hjem');
});
</script>
