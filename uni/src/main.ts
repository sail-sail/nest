import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia, setActivePinia } from "pinia";

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(pinia);
  setActivePinia(pinia);
  return {
    app,
  };
}
