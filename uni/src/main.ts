import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia, setActivePinia } from "pinia";

import tmui from "./tmui";

import "uno.css";

globalThis.process = globalThis.process || { };
globalThis.process.env = globalThis.process.env || { };

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(pinia);
  setActivePinia(pinia);
  app.use(tmui, { } as Tmui.tmuiConfig);
  return {
    app,
  };
}
