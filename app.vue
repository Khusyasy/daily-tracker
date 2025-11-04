<script setup>
useHead({
  title: 'Daily Tracker',
  meta: [
    { name: 'description', content: 'Simple App to Track Your Dailies' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
})

</script>

<template>
  <div class="min-h-screen bg-white">
    <Header />
    <NuxtPage />
  </div>
</template>
