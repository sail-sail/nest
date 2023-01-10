import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

import Unocss from "unocss/vite";

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
    Icons({
      compiler: "vue3",
      customCollections: {
        font: FileSystemIconLoader("src/assets/iconfont/"),
      },
    }),
    AutoImport({
      imports: [
        "vue",
        "uni-app",
        {
          "numeral": [
            [ "default", "numeral" ]
          ],
          "dayjs": [
            [ "default", "dayjs" ]
          ],
          "@/store/usr": [
            [ "default", "useUsrStore" ],
          ],
          "@/store/index": [
            [ "default", "useIndexStore" ],
          ],
          "@/utils/request": [
            "request",
            "uploadFile",
            "getDownloadUrl",
            "getAttUrl",
            "downloadFile",
            "uniLogin",
          ],
          "@/utils/graphql": [
            "gqlQuery",
            "_gqlQuery",
          ],
          "@/utils/StringUtil": [
            "isEmpty",
            "isNotEmpty",
            "uniqueID",
          ],
        },
      ],
      resolvers: [
        IconsResolver(),
      ],
      eslintrc: {
        enabled: true,
      },
      dts: "./src/typings/auto-imports.d.ts",
      ignore: [
        "RouterLink",
      ],
    }),
    Components({
      dirs: [ ],
      resolvers: [
        IconsResolver({
          prefix: "icon",
          customCollections: [
            "font",
          ],
        }),
      ],
      dts: "./src/typings/components.d.ts",
    }),
    Unocss(),
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
