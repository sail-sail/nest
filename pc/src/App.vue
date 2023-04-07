<template>
<el-config-provider
  :locale="locale"
  :button="{ autoInsertSpace: false }"
>
  <Login v-if="!usrStore.authorization"></Login>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <component :is="Component"></component>
    </template>
    <template v-else-if="$route.fullPath === '/'">
    </template>
    <template v-else>
      <div
        un-flex="~ [1_0_0] col"
        un-overflow="hidden"
        un-justify="center"
      >
        <el-empty description="页面不存在!">
          <el-button
            un-w="[200px]"
            
            size="large"
            type="danger"
            @click="goBack"
          >
            <span un-text="[18px]">
              返 回
            </span>
          </el-button>
        </el-empty>
      </div>
    </template>
  </router-view>
  <Background_taskListDialog></Background_taskListDialog>
</el-config-provider>
</template>

<script setup lang="ts">
import locale from "@/locales";
import Background_taskListDialog from "./views/base/background_task/ListDialog.vue";

import Login from "./layout/Login.vue";

const {
  ns,
  initSysI18ns,
} = useI18n();

const tabsStore = useTabsStore();
const usrStore = useUsrStore();

const router = useRouter();
const route = useRoute();

function goBack() {
  router.back();
  if (route.matched.length === 0) {
    window.location.reload();
  }
}

const warn = console.warn;
console.warn = (...args: any[]) => {
  if (args[0] === "[HMR] Something went wrong during Vue component hot-reload. Full reload required.") {
    window.location.reload();
    return;
  }
  warn(...args);
};

async function initI18nsEfc() {
  const codes = [
    "删除成功",
  ];
  await initSysI18ns(codes);
}
initI18nsEfc();

onMounted(async () => {
  await tabsStore.refreshTab();
});
</script>

<style lang="scss">
::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: transparent;
  cursor: pointer;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(144, 146, 152, 0.3);
}
html,body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  --el-font-size-base: 13px;
  font-size: var(--el-font-size-base);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  text-rendering: optimizeLegibility;
}
#app {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.el-form {
  label {
    white-space: nowrap;
    margin-left: 4px;
    display: flex;
    align-items: center;
  }
  .el-form-item {
    margin-bottom: 0;
    width: 100%;
    --font-size: var(--el-font-size-base);
  }
}
.el-divider.el-divider--horizontal {
  margin-top: 15px;
  margin-bottom: 15px;
}
.dialog_fullscreen {
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  max-height: 100%;
}
.dark .el-dialog {
  background-color: var(--el-fill-color-lighter);
}
//弹出框滚动条优化
.el-dialog.custom_dialog {
  height: 90vh;
  --el-dialog-width: 960px;
  --el-dialog-padding-primary: 10px;
  .el-dialog__footer {
    display: none;
  }
}
.el-dialog__body {
  --el-dialog-content-font-size: var(--el-font-size-base);
}
.el-overlay-dialog {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  .el-dialog {
    margin: 0;
  }
  .el-dialog.custom_dialog.is-fullscreen {
    height: 100%;
    overflow: auto;
    max-height: 100%;
    width: 100%;
  }
  .el-dialog.custom_dialog {
    min-width: 460px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    .el-dialog__body {
      overflow-y: auto;
      flex: 1 0 0;
      overflow: auto;
      display: flex;
      flex-direction: column;
      padding: 0;
    }
    .el-dialog.is-fullscreen {
      height: 100%;
    }
    .el-dialog__headerbtn {
      width: 30px;
      height: 30px;
      right: 10px;
      top: 5px;
    }
    .el-dialog__headerbtn .el-dialog__close:hover {
      color: red;
    }
  }
  // 自动高度的弹出框
  .el-dialog.auto_dialog {
    height: auto;
    width: auto;
    max-height: 98vh;
    overflow: auto;
    .el-dialog__body {
      flex-basis: auto;
    }
    .content_div {
      flex-basis: auto;
    }
  }
  .el-dialog__header {
    .dialog_title {
      display: flex;
      padding-right: 20px;
      color: var(--el-text-color-regular);
    }
    .title_lbl {
      flex: 1 0 0;
      overflow: hidden;
    }
    .full_but {
      cursor: pointer;
      position: relative;
      top: 2px;
      width: 13px;
      height: 13px;
    }
    .full_but:hover {
      color: blue;
    }
  }
}
div.el-overlay.is-message-box::after {
  content: none;
}
.el-overlay.is-message-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
body .el-table {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .el-table__inner-wrapper {
    flex: 1 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  th.el-table__cell>.cell {
    display: flex;
    vertical-align: unset;
  }
  .cell {
    line-height: normal;
    display: flex;
    align-items: center;
  }
  .el-table__cell.is-center .cell {
    justify-content: center;
  }
  .el-table__cell.is-left .cell {
    justify-content: flex-start;
  }
  .el-table__cell.is-right .cell {
    justify-content: flex-end;
  }
}
body .el-table--small {
  // .el-table__cell:first-child .cell {
  //   padding-left: 3px;
  // }
  .el-table__header {
    thead tr {
      height: 29px;
    }
  }
  .el-table__row {
    height: 29px;
  }
  .cell {
    padding-top: 0;
    padding-bottom: 0;
  }
  font-size: 13px;
  th.el-table__cell {
    padding: 3px 0;
  }
  td.el-table__cell {
    padding: 0;
  }
  .el-table__footer-wrapper {
    .el-table__footer tr {
      height: 29px;
    }
  }
}
.el-table__body-wrapper tr td.el-table-fixed-column--left,
.el-table__body-wrapper tr td.el-table-fixed-column--right,
.el-table__body-wrapper tr th.el-table-fixed-column--left,
.el-table__body-wrapper tr th.el-table-fixed-column--right,
.el-table__footer-wrapper tr td.el-table-fixed-column--left,
.el-table__footer-wrapper tr td.el-table-fixed-column--right,
.el-table__footer-wrapper tr th.el-table-fixed-column--left,
.el-table__footer-wrapper tr th.el-table-fixed-column--right,
.el-table__header-wrapper tr td.el-table-fixed-column--left,
.el-table__header-wrapper tr td.el-table-fixed-column--right,
.el-table__header-wrapper tr th.el-table-fixed-column--left,
.el-table__header-wrapper tr th.el-table-fixed-column--right {
  background-color: inherit;
}
.dark {
  .el-table {
    --el-table-tr-bg-color: var(--el-table-header-bg-color);
  }
}
.el-table--enable-row-transition .el-table__body td.el-table__cell {
  transition: unset;
}
// 复选框
body .el-checkbox.el-checkbox--small {
  height: auto;
  .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }
  .el-checkbox__inner::after {
    width: 3px;
    height: 7px;
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    top: 5px;
  }
}
body .el-input-number {
  width: 100%;
}
body .el-input-number.is-without-controls .el-input__inner {
  text-align: inherit;
}
.el-table {
  .table_current_row {
    background-color: var(--el-fill-color-darker);
  }
  .table_current_row.hover-row {
    background-color: var(--el-fill-color-darker);
  }
  .el-table__body tr.table_current_row:hover>td.el-table__cell {
    background-color: var(--el-fill-color-darker);
  }
}
.dark .el-table {
  .table_current_row {
    background-color: var(--el-fill-color-darker);
  }
  .table_current_row.hover-row {
    background-color: var(--el-fill-color-darker);
  }
  .el-table__body tr.table_current_row:hover>td.el-table__cell {
    background-color: var(--el-fill-color-darker);
  }
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  --el-date-editor-width: 100%;
}
.el-date-editor.el-input>.el-input__wrapper {
  width: 100%;
}
.img_form_item {
  height: 200px;
  border: 1px solid #EEE;
  width: auto;
  justify-self: self-start;
  min-width: 100%;
}
.el-form .el-form-item--default.el-form-item.img_form_item, .el-form .el-form-item--small.el-form-item.img_form_item {
  width: auto;
}
.el-form .el-form-item__error {
  padding: 0;
}
.el-form .el-form-item__label {
  padding-right: 4px;
}
.el-form div.el-form-item__label {
  padding-right: 1px;
}
.el-form-item__content:has(.el-select-v2) {
  padding-left: 4px;
  .el-form-item__error {
    padding-left: 4px;
  }
}

body .el-tree {
  .el-tree-node.is-current .el-tree-node__content {
    background-color: rgba(210,210,210,.8);
  }
  .el-tree-node {
    .el-tree-node__content:hover {
      background-color: rgba(210,210,210,.8);
    }
  }
}
.dark .el-tree {
  .el-tree-node.is-current .el-tree-node__content {
    background-color: rgba(81, 81, 81,.8);
  }
  .el-tree-node {
    .el-tree-node__content:hover {
      background-color: rgba(81, 81, 81,.8);
    }
  }
}
.el-flex-card.el-card {
  display: flex;
  flex-direction: column;
  .el-card__body {
    flex: 1 0 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
}
// flex布局的el-tabs
.el-tabs.el-flex-tabs.el-tabs {
  display: flex;
  flex-direction: column;
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__content, .el-tab-pane {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
  }
}
.el-tabs.el-tabs--card {
  .el-tabs__header {
    .el-tabs__item.is-active {
      background-color: var(--el-fill-color-extra-light);
    }
  }
}
// 最大号的弹出框
.el-dialog.large_dialog {
  width: calc(100% - 100px);
  height: calc(100% - 20px);
}
// 中等大小的弹出框
.el-dialog.medium_dialog {
  width: 1250px;
}
.dark .filter_invert {
  filter: invert(1) hue-rotate(180deg);
}
.el-icon img {
  height: 1em;
  width: 1em;
}
.swiper-slide {
  overflow-y: auto;
}
// 弹出框点击穿透
.el-overlay:has(.pointer_pierce_dialog) {
  pointer-events: none;
  .pointer_pierce_dialog {
    pointer-events: auto;
  }
}
.is-draggable {
  cursor: move;
}
// 限制菜单的最大高度
.el-scrollbar__view.el-dropdown__list {
  max-height: 650px;
}
// Excel预览
.hide-input {
  display: none;
}
</style>
