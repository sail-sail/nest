import {
  type PluginOption,
  defineConfig,
} from "vite";

import uni from "@dcloudio/vite-plugin-uni";

import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";

import Unocss from "unocss/vite";

import Inspector from "vite-plugin-vue-inspector";

import reactivityTransform from "@vue-macros/reactivity-transform/vite";

import TurboConsole from "unplugin-turbo-console/vite";

const pluginsH5: PluginOption[] = [ ];

const isH5 = process.env.UNI_PLATFORM === "h5";

if (isH5) {
  pluginsH5.push(TurboConsole() as any);
  pluginsH5.push(
    Inspector({
      toggleButtonPos: "top-left",
    }) as any,
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/uni/",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@use "@/assets/style/uni.scss";`,
      },
    },
  },
  plugins: [
    (uni as any).default(),
    reactivityTransform(),
    ...pluginsH5,
    AutoImport({
      imports: [
        "vue",
        "uni-app",
        "pinia",
        {
          "numeral": [
            [ "default", "numeral" ]
          ],
          "dayjs": [
            [ "default", "dayjs" ]
          ],
          "@/utils/common": [
            "getDict",
            "getDictbiz",
            "list2tree",
          ],
          "@/store/usr": [
            [ "default", "useUsrStore" ],
          ],
          "@/store/index": [
            [ "default", "useIndexStore" ],
          ],
          "@/utils/request": [
            "request",
            "getRequestUrl",
            "uploadFile",
            "getDownloadUrl",
            "getImgUrl",
            "getImgUrlArr",
            "getAttUrl",
            "downloadFile",
            "uniLogin",
          ],
          "@/utils/graphql": [
            "query",
            "mutation",
          ],
          "@/pages/index/Api": [
            "checkLogin",
          ],
          "@/utils/StringUtil": [
            "isEmpty",
            "isNotEmpty",
            "uniqueID",
          ],
          "decimal.js": [
            [ "default", "Decimal" ],
          ],
          "@/uni_modules/tm-ui/components/tm-form/tm-form.vue": [
            [ "default", "TmForm" ],
          ],
        },
      ],
      dts: "./src/typings/auto-imports.d.ts",
      ignore: [
        "RouterLink",
      ],
    }),
    // Components({
    //   dirs: [
    //     "./src/components",
    //     "./src/uni_modules/tm-ui/components",
    //   ],
    //   dts: "./src/typings/components.d.ts",
    // }),
    Unocss({
      configFile: "./uno_uni.config.ts",
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
    port: 4002,
    open: false,
    cors: true,
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
      "/img": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
