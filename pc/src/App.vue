<template>
<el-config-provider
  :locale="locale"
  :button="{ autoInsertSpace: false }"
>
  <Layout1></Layout1>
  <Background_taskListDialog></Background_taskListDialog>
</el-config-provider>
</template>

<script setup lang="ts">
import {
  ElConfigProvider,
} from "element-plus";
import locale from "@/locales";
import Layout1 from "./layout/layout1/index.vue";
import Background_taskListDialog from "./views/background_task/ListDialog.vue";

</script>

<style lang="scss">
html.dark {
  --prism-scheme: dark;
  --prism-foreground: #a6accd;
  --prism-background: #181818;
  --prism-comment: #758575;
  --prism-string: #c3e88d;
  --prism-literal: #429988;
  --prism-keyword: #89ddff;
  --prism-boolean: #6394bf;
  --prism-number: #6394bf;
  --prism-variable: #c2b36e;
  --prism-function: #82aaff;
  --prism-deleted: #bc6066;
  --prism-class: #54b1bf;
  --prism-builtin: var(--el-color-primary-light-3);
  --prism-property: #c792ea;
  --prism-namespace: #db889a;
  --prism-punctuation: #89ddff;
  --prism-decorator: #bd8f8f;
  --prism-regex: #ab5e3f;
  --prism-json-property: #6b8b9e;
  --prism-line-number: #888888;
  --prism-line-number-gutter: #eeeeee;
  --prism-line-highlight-background: #444444;
  --prism-selection-background: #444444;
  --prism-inline-background: #2d2d2d;
}
html.dark {
  color-scheme: dark;
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #3375b9;
  --el-color-primary-light-5: #2a598a;
  --el-color-primary-light-7: #213d5b;
  --el-color-primary-light-8: #1d3043;
  --el-color-primary-light-9: #18222c;
  --el-color-primary-dark-2: #66b1ff;
  --el-color-success: #67c23a;
  --el-color-success-light-3: #4e8e2f;
  --el-color-success-light-5: #3e6b27;
  --el-color-success-light-7: #2d481f;
  --el-color-success-light-8: #25371c;
  --el-color-success-light-9: #1c2518;
  --el-color-success-dark-2: #85ce61;
  --el-color-warning: #e6a23c;
  --el-color-warning-light-3: #a77730;
  --el-color-warning-light-5: #7d5b28;
  --el-color-warning-light-7: #533f20;
  --el-color-warning-light-8: #3e301c;
  --el-color-warning-light-9: #292218;
  --el-color-warning-dark-2: #ebb563;
  --el-color-danger: #f56c6c;
  --el-color-danger-light-3: #b25252;
  --el-color-danger-light-5: #854040;
  --el-color-danger-light-7: #582e2e;
  --el-color-danger-light-8: #412626;
  --el-color-danger-light-9: #2b1d1d;
  --el-color-danger-dark-2: #f78989;
  --el-color-error: #f56c6c;
  --el-color-error-light-3: #b25252;
  --el-color-error-light-5: #854040;
  --el-color-error-light-7: #582e2e;
  --el-color-error-light-8: #412626;
  --el-color-error-light-9: #2b1d1d;
  --el-color-error-dark-2: #f78989;
  --el-color-info: #909399;
  --el-color-info-light-3: #6b6d71;
  --el-color-info-light-5: #525457;
  --el-color-info-light-7: #393a3c;
  --el-color-info-light-8: #2d2d2f;
  --el-color-info-light-9: #202121;
  --el-color-info-dark-2: #a6a9ad;
  --el-box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .36), 0px 8px 20px rgba(0, 0, 0, .72);
  --el-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, .72);
  --el-box-shadow-lighter: 0px 0px 6px rgba(0, 0, 0, .72);
  --el-box-shadow-dark: 0px 16px 48px 16px rgba(0, 0, 0, .72), 0px 12px 32px #000000, 0px 8px 16px -8px #000000;
  --el-bg-color-page: #0a0a0a;
  --el-bg-color: #141414;
  --el-bg-color-overlay: #1d1e1f;
  --el-text-color-primary: #E5EAF3;
  --el-text-color-regular: #CFD3DC;
  --el-text-color-secondary: #A3A6AD;
  --el-text-color-placeholder: #8D9095;
  --el-text-color-disabled: #6C6E72;
  --el-border-color-darker: #636466;
  --el-border-color-dark: #58585B;
  --el-border-color: #4C4D4F;
  --el-border-color-light: #414243;
  --el-border-color-lighter: #363637;
  --el-border-color-extra-light: #2B2B2C;
  --el-fill-color-darker: #424243;
  --el-fill-color-dark: #39393A;
  --el-fill-color: #303030;
  --el-fill-color-light: #262727;
  --el-fill-color-lighter: #1D1D1D;
  --el-fill-color-extra-light: #191919;
  --el-fill-color-blank: transparent;
  --el-mask-color: rgba(0, 0, 0, .8);
  --el-mask-color-extra-light: rgba(0, 0, 0, .3);
}

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
}
#app {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
body .el-button {
  height: 32px;
  line-height: normal;
  padding-top: initial;
  padding-bottom: initial;
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
  height: 85vh;
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
      color: gray;
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
</style>
