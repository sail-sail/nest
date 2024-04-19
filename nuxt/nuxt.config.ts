// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },
  modules: [
    "@unocss/nuxt",
    "@vue-macros/nuxt",
  ],
  macros: {
    reactivityTransform: true,
  },
  runtimeConfig: {
    serverHost: process.env.NUXT_SERVER_HOST,
  },
});
