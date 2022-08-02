import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia, setActivePinia } from "pinia";

import "uno.css";

export function createApp() {
  globalThis.process = globalThis.process || { };
  globalThis.process.env = globalThis.process.env || { };
  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(pinia);
  setActivePinia(pinia);
  return {
    app,
  };
}
