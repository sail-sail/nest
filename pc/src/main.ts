import { createApp } from "vue";
import { createPinia, setActivePinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";

import "element-plus/dist/index.css";

import router from "./router/index";
import "./utils/DateUtil";
import "./utils/Console";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
setActivePinia(pinia);

app.use(router);

app.config.errorHandler = (err: Error, vm, info) => {
  if (
    err &&
    err.message &&
    (
      err.message.includes("Failed to fetch dynamically imported module") ||
      err.message.includes("Unable to preload CSS for")
    )
  ) {
    if (window.confirm("发现新版本, 是否立即重新载入?")) {
      let pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      params.set("__reload__", "");
      const searchStr = "?" + params.toString();
      const hash = window.location.hash || "";
      window.sessionStorage.setItem("__hash__", hash);
      window.location.href = window.location.origin + pathname + searchStr + hash;
      return;
    }
  }
  console.error(err, vm, info);
};

app.mount("#app");
