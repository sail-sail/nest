import { createApp } from "vue";
import { createPinia, setActivePinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";

import "element-plus/dist/index.css";

import router from "./router/index";
import "./utils/DateUtil";
// import "./utils/Console";
import { errorHandler } from "./compositions/ErrorHandler";
import { headerOrderDrag } from "./components/TableHeaderOrderDrag";
import { draggable } from "./components/draggable";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
setActivePinia(pinia);

app.use(router);

app.config.errorHandler = errorHandler;

app.directive("header-order-drag", headerOrderDrag);
app.directive("draggable", draggable);

app.mount("#app");
