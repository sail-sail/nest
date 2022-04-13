<template>
<el-dialog
  :fullscreen="fullscreen"
  v-model="dialogVisible"
  append-to-body
  :close-on-click-modal="false"
  custom-class="custom_dialog background_task_ListDialog"
  top="0"
  :before-close="beforeClose"
>
  <template #title>
    <div class="dialog_title" v-draggable>
      <div class="title_lbl">
        <span class="dialogTitle_span">
          {{ dialogTitle }}
        </span>
      </div>
      <el-icon class="full_but" @click="setFullscreen">
        <FullScreen/>
      </el-icon>
    </div>
  </template>
  <div class="wrap_div">
    <div class="content_div">
      <List></List>
    </div>
    <div class="toolbox_div">
    </div>
  </div>
</el-dialog>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useFullscreenEffect } from "@/compositions/fullscreen";
import {
  ElDialog,
  ElIcon,
} from "element-plus";
import {
  FullScreen,
} from "@element-plus/icons-vue";
import useBackground_taskStore from "@/store/background_task";
import List from "./List.vue";

let { fullscreen, setFullscreen } = $(useFullscreenEffect());

let dialogTitle = $ref("后台任务列表");
let dialogVisible = $ref(false);
let background_taskStore = useBackground_taskStore();

let onCloseResolve = function(value: void) { };

watch(
  () => background_taskStore.listDialogVisible,
  () => {
    if (background_taskStore.listDialogVisible) {
      showDialog();
    } else {
      dialogVisible = false;
    }
  },
);

// 打开对话框
async function showDialog(
  arg?: {
    title?: string;
  },
) {
  if (arg?.title) {
    dialogTitle = arg.title;
  }
  dialogVisible = true;
  const reslut = await new Promise<void>((resolve) => {
    onCloseResolve = resolve;
  });
  return reslut;
}

async function beforeClose(done: (cancel: boolean) => void) {
  background_taskStore.listDialogVisible = false;
  onCloseResolve();
  done(false);
}

defineExpose({ showDialog });
</script>

<style lang="scss" scoped>
.wrap_div {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-basis: inherit;
}
.content_div {
  flex: 1 0 0;
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 0px;
  flex-basis: inherit;
}
.toolbox_div {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style>
.el-dialog.custom_dialog.background_task_ListDialog {
  width: 1100px;
  height: 670px;
}
</style>
