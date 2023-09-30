import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from "pinia";
import { createUnistorage } from "pinia-plugin-unistorage";

import tmui from "./tmui";

import "uno.css";

globalThis.process = globalThis.process || { };
globalThis.process.env = globalThis.process.env || { };

export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();
  pinia.use(createUnistorage())
  app.use(pinia);
  Pinia.setActivePinia(pinia);
  app.use(tmui, { } as Tmui.tmuiConfig);
  return {
    app,
    Pinia,
  };
}
