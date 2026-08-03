import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
// import { VitePWA } from "vite-plugin-pwa";
// import ViteRsw from "vite-plugin-rsw";

import Inspector from "vite-plugin-vue-inspector";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

import {
  FileSystemIconLoader,
} from "unplugin-icons/loaders";

import {
  ElementPlusResolver,
  VueUseComponentsResolver,
} from "unplugin-vue-components/resolvers";

import Unocss from "unocss/vite";
import { webUpdateNotice } from "@plugin-web-update-notification/vite";
import DefineOptions from "unplugin-vue-define-options/vite";
import ReactivityTransform from "@vue-macros/reactivity-transform/vite";
// import Wasm from "vite-plugin-wasm";
import TurboConsole from "unplugin-turbo-console/vite";

// import VueDevTools from "vite-plugin-vue-devtools";

import VueDevtoolsJson from "vite-plugin-devtools-json";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [
      "@jsquash/webp",
      "@jsquash/resize",
    ],
  },
  plugins: [
    Unocss({
      // mode: "vue-scoped",
      configFile: "./uno.config.ts",
    }),
    TurboConsole({
      inspector: false,
    }),
    Inspector({
      toggleButtonPos: "top-left",
      lazyLoad: 500,
      disableInspectorOnEditorOpen: true,
      launchEditor: "code",
    }),
    // VueDevTools(),
    VueDevtoolsJson(),
    Vue(),
    ReactivityTransform(),
    DefineOptions(),
    VueJsx(),
    // Wasm(),
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
          "@/components/CustomDialog.vue": [
            [ "default", "CustomDialog" ],
          ],
          "@/components/CustomInput.vue": [
            [ "default", "CustomInput" ],
          ],
          "@/utils/common.ts": [
            "getDict",
            "getDictbiz",
            "showUploadMsg",
            "list2tree",
            "setClientTenantId",
          ],
          "@/utils/excel_util.ts": [
            "getExcelData",
            "toExcelColumns",
            "useRenderExcel",
            "saveAsExcel",
            "SPLIT_SQL_INSERT_LEN",
            "splitArr",
            "splitCreateArr",
          ],
          "@/locales/index.ts": [
            "getLocale",
          ],
          "element-plus": [
            "ElButton",
            "ElInput",
            "ElInputNumber",
            "ElSwitch",
            "ElTreeSelect",
            "ElCheckbox",
            "ElDatePicker",
            "ElImage",
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
            "ElColorPicker",
          ],
          "numeral": [
            [ "default", "numeral" ]
          ],
          "dayjs": [
            [ "default", "dayjs" ]
          ],
          "@/compositions/List.ts": [
            "usePage",
            "useSubscribeList",
            "useSelect",
            "useSelectOne",
            "useTableColumns",
            "initListI18ns",
            "initBuiltInSearch",
            "initBuiltInModel",
            "useDynPageFields",
          ],
          "@/compositions/Detail.ts": [
            "initDetailI18ns",
          ],
          "@/components/UploadFileDialog.vue": [
            [ "default", "UploadFileDialog" ],
          ],
          "@/components/CustomSelect.vue": [
            [ "default", "CustomSelect" ],
          ],
          "@/components/MessageBox.ts": [
            "MessageBox",
          ],
          "@/compositions/fullscreen.ts": [
            "useFullscreenEfc",
          ],
          "@/store/menu.ts": [
            [ "default", "useMenuStore" ],
          ],
          "@/store/usr.ts": [
            [ "default", "useUsrStore" ],
          ],
          "@/store/permit.ts": [
            [ "default", "usePermitStore" ],
          ],
          "@/store/field_permit.ts": [
            [ "default", "useFieldPermitStore" ],
          ],
          "@/store/tabs.ts": [
            [ "default", "useTabsStore" ],
          ],
          "@/store/tenant.ts": [
            [ "default", "useTenantStore" ],
          ],
          "@/store/index.ts": [
            [ "default", "useIndexStore" ],
          ],
          "@/store/dirty.ts": [
            [ "default", "useDirtyStore" ],
          ],
          "@/utils/request.ts": [
            "request",
            "getRequestUrl",
            "uploadFile",
            "deleteFile",
            "getDownloadUrl",
            "downloadById",
            "getImgUrl",
            "getImgUrlArr",
          ],
          "@/utils/graphql.ts": [
            "query",
            "mutation",
            "getQueryUrl",
          ],
          "@/utils/StringUtil.ts": [
            "isEmpty",
          ],
          "@/utils/ObjectUtil.ts": [
            "deepCompare",
          ],
          "@/router/util.ts": [
            "openForeignPage",
          ],
          "@/locales/i18n.ts": [
            "useI18n",
          ],
          "decimal.js": [
            [ "default", "Decimal" ],
          ],
          "@/components/CustomCityPickerApi.ts": [
            "findNameByCodePcaCode",
          ],
        },
      ],
      viteOptimizeDeps: false,
      resolvers: [
        ElementPlusResolver(),
        VueUseComponentsResolver(),
        IconsResolver(),
      ],
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
    // VitePWA({
    //   workbox: {
    //     globPatterns: [ ],
    //     runtimeCaching: [ ],
    //     skipWaiting: false,
    //     clientsClaim: false,
    //   },
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
    webUpdateNotice({
      versionType: "build_timestamp",
    }),
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
    chunkSizeWarningLimit: 3000,
    reportCompressedSize: false,
    sourcemap: false,
  },
  define: {
    __VUE_OPTIONS_API__: true,
  },
  preview: {
    port: 4000,
    open: false,
    cors: true,
    strictPort: true,
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
  server: {
    port: 4000,
    host: "0.0.0.0",
    open: false,
    cors: true,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:4001",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/graphql": {
        target: "http://localhost:4001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
