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
    "@nuxt/eslint",
  ],
  hooks: {
    // 修改构建清单，禁用prefetch和preload
    'build:manifest': (manifest) => {
      for (const key in manifest) {
        if (manifest[key]) {
          manifest[key].prefetch = false;
          manifest[key].preload = false;
        }
      }
    }
  },
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