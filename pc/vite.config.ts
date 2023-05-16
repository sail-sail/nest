import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// import { VitePWA } from "vite-plugin-pwa";
// import ViteRsw from "vite-plugin-rsw";

import Inspector from "vite-plugin-vue-inspector";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import Unocss from "unocss/vite";

import { webUpdateNotice } from "@plugin-web-update-notification/vite";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import defineOptions from "unplugin-vue-define-options/vite";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import reactivityTransform from "@vue-macros/reactivity-transform/vite";

import VueDevTools from "vite-plugin-vue-devtools";

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
    VueDevTools(),
    vue(),
    reactivityTransform(),
    defineOptions(),
    vueJsx(),
    Icons({
      compiler: "vue3",
      customCollections: {
        font: FileSystemIconLoader("src/assets/iconfont/"),
      },
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "@vueuse/core",
        {
          "@/components/ListSelectDialog.vue": [
            [ "default", "ListSelectDialog" ],
          ],
        },
        {
          "@/components/CustomDialog.vue": [
            [ "default", "CustomDialog" ],
          ],
        },
        {
          "@/utils/common": [
            "getDict",
            "getDictbiz",
            "useRenderExcel",
            "saveAsExcel",
            "showUploadMsg",
          ],
        },
        {
          "@/utils/excel_util": [
            "getExcelData",
          ],
        },
        {
          "element-plus": [
            "ElButton",
            "ElInput",
            "ElForm",
            "ElFormItem",
            "ElDropdown",
            "ElDropdownItem",
            "ElDropdownMenu",
            "FormItemRule",
            "ElMessage",
            "ElMessageBox",
            "ElNotification",
            "ElMenu",
            "ElSubmenu",
            "ElMenuItemGroup",
            "ElMenuItem",
            "ElCard",
            "ElTable",
            "ElTableColumn",
            "ElPagination",
            "ElDialog",
            "ElTag",
            "ElTree",
            "ElSelect",
            "ElOption",
            "ElOptionGroup",
            "ElSelectV2",
            "ElIcon",
            "ElAutocomplete",
            "ElLink",
          ],
          "pinia": [
            "defineStore",
          ],
          "numeral": [
            [ "default", "numeral" ]
          ],
          "dayjs": [
            [ "default", "dayjs" ]
          ],
          "@/compositions/List": [
            "usePage",
            "useSelect",
            "useSelectOne",
            "useTableColumns",
            "initListI18ns",
          ],
          "@/compositions/Detail": [
            "initDetailI18ns",
          ],
          "@/components/UploadFileDialog.vue": [
            [ "default", "UploadFileDialog" ],
          ],
          "@/components/MessageBox": [
            "MessageBox",
          ],
          "@/compositions/fullscreen": [
            "useFullscreenEfc",
          ],
          "@/store/menu": [
            [ "default", "useMenuStore" ],
          ],
          "@/store/usr": [
            [ "default", "useUsrStore" ],
          ],
          "@/store/tabs": [
            [ "default", "useTabsStore" ],
          ],
          "@/store/tenant": [
            [ "default", "useTenantStore" ],
          ],
          "@/store/index": [
            [ "default", "useIndexStore" ],
          ],
          "@/utils/axios": [
            "axios",
            "uploadFile",
            "getDownloadUrl",
            "downloadById",
          ],
          "@/utils/graphql": [
            "query",
            "mutation",
            "getQueryUrl",
          ],
          "@/utils/StringUtil": [
            "isEmpty",
          ],
          "@/utils/ObjectUtil": [
            "deepCompare",
          ],
          "@/locales/i18n": [
            "useI18n",
          ],
        },
      ],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver(),
      ],
      eslintrc: {
        enabled: true,
      },
      dts: "./src/typings/auto-imports.d.ts",
    }),
    Components({
      resolvers: [
        IconsResolver({
          prefix: "icon",
          customCollections: [
            "font",
          ],
        }),
        ElementPlusResolver({
          importStyle: false,
        }),
      ],
      dts: "./src/typings/components.d.ts",
    }),
    Inspector({
      toggleButtonPos: "top-left",
    }),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   manifest: {
    //     name: "管理系统",
    //     short_name: "管理系统",
    //     description: "管理系统",
    //     theme_color: "#ffffff",
    //     icons: [
    //       {
    //         src: "favicon.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ]
    //   },
    // }),
    // ViteRsw({
    //   cli: "pnpm",
    //   root: "./",
    //   crates: [
    //     "@rsw/excel-render"
    //   ],
    // }),
    Unocss(),
    webUpdateNotice(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#": fileURLToPath(new URL("./src/typings", import.meta.url)),
    },
  },
  base: "/",
  build: {
    outDir: "../build/pc",
    reportCompressedSize: false,
    sourcemap: true,
  },
  define: {
    __VUE_OPTIONS_API__: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
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
