import { createApp } from "vue";
import { createPinia, setActivePinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
import "uno.css";

import "@/assets/style/common.scss";

import App from "./App.vue";

import router from "./router/index";
import "./utils/DateUtil";
import { headerOrderDrag } from "./components/TableHeaderOrderDrag";
import { draggable } from "./components/draggable";
import { tableDataSortable } from "./components/TableDataSortable";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
setActivePinia(pinia);

app.use(router);

app.directive("header-order-drag", headerOrderDrag);
app.directive("draggable", draggable);
app.directive("table-data-sortable", tableDataSortable);

app.mount("#app");
