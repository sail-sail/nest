import { createApp } from "vue";

import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
import "uno.css";

import "@/assets/style/common.scss";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from "./App.vue";

import router from "./router/index";
import "./utils/DateUtil";
import { headerOrderDragDirective } from "./components/TableHeaderOrderDrag";
import { draggable } from "./components/draggable";
import { tableDataSortable } from "./components/TableDataSortable";
import { searchFormItemWidthAuto } from "./components/SearchFormItemWidthAutoDirective";

import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

// import VueScan, { type VueScanOptions } from "z-vue-scan";

const app = createApp(App);

// app.use<VueScanOptions>(VueScan, { });

app.use(router);

app.directive("header-order-drag", headerOrderDragDirective);
app.directive("draggable", draggable);
app.directive("table-data-sortable", tableDataSortable);
app.directive("search-form-item-width-auto", searchFormItemWidthAuto);

app.use(autoAnimatePlugin);

app.mount("#app");
