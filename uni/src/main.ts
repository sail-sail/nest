import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from "pinia";
import cfg from "@/utils/config";

import tmui from "./uni_modules/tmui";

import "virtual:uno.css";

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
  cfg.pinia = pinia;
  Pinia.setActivePinia(pinia);
  app.use(tmui);
  return {
    app,
    Pinia,
  };
}
