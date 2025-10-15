<script setup>
useHead({
  title: 'Daily Tracker',
  meta: [
    { name: 'description', content: 'Simple App to Track Your Dailies' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

</script>

<template>
  <div class="min-h-screen bg-white">
    <Header />
    <NuxtPage />
  </div>
</template>
