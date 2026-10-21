import { createApp } from "vue";

import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
import "virtual:uno.css";

import "@/assets/style/common.scss";

import App from "./App.vue";

import router from "./router/index";
import { setupAssetUpdateRecovery } from "./utils/app_update";
import "./utils/DateUtil";
import { headerOrderDragDirective } from "./components/TableHeaderOrderDrag";
import { draggable } from "./components/draggable";
import { tableDataSortable } from "./components/TableDataSortable";
import { searchFormItemWidthAuto } from "./components/SearchFormItemWidthAutoDirective";
import { startPageAgentBridge } from "./utils/pageAgentBridge";

// import VueScan, { type VueScanOptions } from "z-vue-scan";

const app = createApp(App);

// app.use<VueScanOptions>(VueScan, { });

setupAssetUpdateRecovery();

app.use(router);

app.directive("header-order-drag", headerOrderDragDirective);
app.directive("draggable", draggable);
app.directive("table-data-sortable", tableDataSortable);
app.directive("search-form-item-width-auto", searchFormItemWidthAuto);

app.mount("#app");

// 智能助手的页面操作通道：一边保持 SSE 接收任务，一边按需加载 PageAgent
startPageAgentBridge();
