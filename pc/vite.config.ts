import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { VitePWA } from "vite-plugin-pwa";
// import ViteRsw from "vite-plugin-rsw";
// import Inspector from "vite-plugin-vue-inspector";
import Unocss from "unocss/vite";
import transformerDirective from "@unocss/transformer-directives";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/style/common.scss";`,
      },
    },
  },
  plugins: [
    vue({
      reactivityTransform: /^((?!node_modules).)*$/,
    }),
    // Inspector(),
    vueJsx(),
    VitePWA({
      manifest: {
        name: "管理系统",
        short_name: "管理系统",
        description: "管理系统",
        theme_color: "#ffffff",
        icons: [
          {
            src: "favicon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ]
      },
    }),
    // ViteRsw({
    //   cli: "pnpm",
    //   root: "./",
    //   crates: [
    //     "@rsw/excel-render"
    //   ],
    // }),
    Unocss({
      transformers: [
        transformerDirective(),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@/": "/src/",
      "#/": "/src/typings/",
    },
  },
  base: "/",
  build: {
    outDir: "../build/pc",
  },
  define: {
    __VUE_OPTIONS_API__: false,
  },
  server: {
    port: 4000,
    open: false,
    cors: true,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4001",
        changeOrigin: true,
        secure: false,
      },
      "/graphql": {
        target: "http://127.0.0.1:4001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
