import { createSSRApp } from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import App from "./App.vue";
import * as Pinia from "pinia";

import tmui from "./uni_modules/tm-ui";

import "@/utils/DateUtil.ts";

globalThis.process = globalThis.process || { };
globalThis.process.env = globalThis.process.env || { };

export function createApp() {
  const app = createSSRApp(App);
  let pinia = app.config.globalProperties.$pinia || null;
  if (!pinia) {
    pinia = Pinia.createPinia();
    app.config.globalProperties.$pinia = pinia;
    app.use(pinia);
  }
  Pinia.setActivePinia(pinia);
  app.use(tmui);
  return {
    app,
    Pinia,
  };
}
