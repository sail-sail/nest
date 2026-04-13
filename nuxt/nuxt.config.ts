import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "~/assets/css/common.scss",
    "swiper/swiper-bundle.css",
  ],
  experimental: {
    asyncContext: true,
    // 全局启用视图过渡，按页面逐个页面禁用
    // https://nuxt.com.cn/docs/4.x/getting-started/transitions
    // viewTransition: true,
  },
  devtools: {
    enabled: true,
  },
  modules: [
    "@unocss/nuxt",
    "@vue-macros/nuxt",
    "@nuxt/icon",
    "@nuxt/eslint",
    "@formkit/auto-animate",
  ],
  hooks: {
    // 修改构建清单，禁用prefetch和preload
    "build:manifest": (manifest) => {
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
    optimizeDeps: {
      include: [
        "graphql/index.mjs",
        'file-saver', // CJS
        'swiper/modules',
        'swiper/vue',
      ]
    },
  },
  compatibilityDate: "2024-12-11",
});