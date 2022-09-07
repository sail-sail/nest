import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

import Unocss from "unocss/vite";
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

import uniTwuCssPlugin from "./src/utils/vite-plugin-uni-twucss.js";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/style/uni.scss";`,
      },
    },
  },
  plugins: [
    uni({
      vueOptions:{
        reactivityTransform: /^((?!node_modules).)*$/,
      }
    }),
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          warn: true,
        }),
      ],
      transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
      ],
    }),
    uniTwuCssPlugin({
      source: "unocss",
    }),
  ],
  resolve: {
    alias: {
      "@/": "/src/",
      "#/": "/src/typings/",
    },
  },
  define: {
    
  },
  server: {
    port: 4001,
    open: false,
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:4001",
        changeOrigin: true,
        secure: false,
      },
      "/graphql": {
        target: "http://localhost:4001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
