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
import { onMounted } from "vue";

import {
  ElConfigProvider,
  ElEmpty,
  ElButton,
} from "element-plus";

import locale from "@/locales";
import Background_taskListDialog from "./views/background_task/ListDialog.vue";

import {
  RouterView,
  useRouter,
  useRoute,
} from "vue-router";

import Login from "./layout/Login.vue";

import useTabsStore from "@/store/tabs";
import useUsrStore from "@/store/usr";

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
}
*,
*:before,
*:after {
  box-sizing: border-box;
}
#app {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.el-form {
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
    }
    .full_but:hover {
      color: green;
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
// .el-message {
//   top: 0 !important;
// }
body {
  --el-menu-active-color: #60beff;
}
body .el-menu {
  --el-menu-active-color: #60beff;
  .el-sub-menu .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  .el-sub-menu__title {
    height: 40px;
    line-height: 40px;
  }
  .el-menu-item.is-active {
    background-color: rgba(0,0,0,.8) !important;
  }
  .el-menu-item.is-active::after {
    content:"";
    width: 5px;
    height: 100%;
    position:absolute;
    top:0;
    left:0;
    background-color: var(--el-color-primary);
  }
}
// .dark body {
//   --el-menu-active-color: #4284b4;
// }
// .dark body .el-menu {
//   --el-menu-bg-color: #04121e !important;
// }
// .dark body .el-sub-menu__title {
//   background-color: #04121e !important;
// }
.dark body {
  --el-menu-active-color: #4284b4;
}
.dark body .el-menu {
  --el-menu-bg-color: black !important;
}
.dark body .el-sub-menu__title {
  background-color: black !important;
}
.el-menu.el-menu--collapse>.el-menu-item>span, .el-menu--collapse>.el-sub-menu>.el-sub-menu__title>span {
  height: initial;
  width: initial;
  visibility: initial;
  display: flex;
  justify-content: center;
  align-items: center;
}
body .el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}
.el-table {
  .table_current_row {
    background-color: rgba(210,210,210,.8);
  }
  .el-table__body tr.table_current_row:hover>td.el-table__cell {
    background-color: rgba(210,210,210,.8);
  }
}
.dark .el-table {
  .table_current_row {
    background-color: rgba(81, 81, 81,.8);
  }
  .el-table__body tr.table_current_row:hover>td.el-table__cell {
    background-color: rgba(81, 81, 81,.8);
  }
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  --el-date-editor-width: 100%;
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
.el-flex-tabs.el-tabs {
  display: flex;
  flex-direction: column;
  .el-tabs__content, .el-tab-pane {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
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
</style>
