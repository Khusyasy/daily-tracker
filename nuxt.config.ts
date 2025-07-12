// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/reset.css', '~/assets/css/tailwind.css'],
  tailwindcss: {
    // Options
  },
});
