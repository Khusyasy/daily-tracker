// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
  ],
  css: ['~/assets/css/reset.css', '~/assets/css/tailwind.css'],
  tailwindcss: {
    // Options
  },
  pwa: {
    registerWebManifestInRouteRules: true,
    devOptions: {
      enabled: true
    },
    strategies: 'generateSW',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      navigateFallback: '/',
    }
  },
});
