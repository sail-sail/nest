import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "~/assets/css/common.scss",
  ],
  experimental: {
    asyncContext: true,
  },
  devtools: {
    enabled: false,
  },
  modules: [
    "@unocss/nuxt",
    "@vue-macros/nuxt",
    "@nuxt/icon",
  ],
  icon: {
    customCollections: [
      {
        prefix: "iconfont",
        dir: "./assets/iconfont",
      },
    ],
  },
  macros: {
    reactivityTransform: true,
  },
  runtimeConfig: {
    serverHost: process.env.NUXT_SERVER_HOST,
  },
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./", import.meta.url)),
        "#": fileURLToPath(new URL("./typings", import.meta.url)),
      },
    },
  },
  compatibilityDate: "2024-12-11",
});
