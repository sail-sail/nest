import {
  type PluginOption,
  defineConfig,
} from "vite";

import uni from "@dcloudio/vite-plugin-uni";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

import Unocss from "unocss/vite";

import Inspector from "vite-plugin-vue-inspector";

import reactivityTransform from "@vue-macros/reactivity-transform/vite";

// import TurboConsole from "unplugin-turbo-console/vite";

const pluginsH5: PluginOption[] = [ ];

const isH5 = process.env.UNI_PLATFORM === "h5";

if (isH5) {
  // pluginsH5.push(TurboConsole());
  pluginsH5.push(
    Inspector({
      toggleButtonPos: "top-left",
    }),
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/uni/",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@import "@/assets/style/uni.scss";`,
      },
    },
  },
  plugins: [
    (uni as any).default(),
    reactivityTransform(),
    ...pluginsH5,
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
        "pinia",
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
            "getImgUrl",
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
          "@/tmui/components/tm-form/tm-form.vue": [
            [ "default", "TmForm" ],
          ],
        },
      ],
      resolvers: [
        IconsResolver(),
      ],
      dts: "./src/typings/auto-imports.d.ts",
      ignore: [
        "RouterLink",
      ],
    }),
    Components({
      dirs: [
        // "./src/components",
        // "./src/uni_modules/tmui/components",
      ],
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
    Unocss({
      configFile: "./uno.config.ts",
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
