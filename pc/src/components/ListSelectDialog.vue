<template>
<el-dialog
  :fullscreen="fullscreen"
  v-model="dialogVisible"
  append-to-body
  :close-on-click-modal="false"
  :custom-class="'custom_dialog ListSelectDialog'"
  top="0"
  :before-close="beforeClose"
>
  <template #header>
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
  <div class="flex-1 flex-shrink-0 overflow-hidden flex flex-col">
    <div class="flex-1 flex-shrink-0 overflow-auto justify-start items-center flex flex-col p-0">
      <slot :selectedIds="selectedIds"></slot>
    </div>
    <div class="py-2 flex justify-center items-center">
      <el-button
        :icon="CircleClose"
        @click="cancelClk"
      >
        取消
      </el-button>
      <el-button
        :icon="Refresh"
        class="mx-1"
        @click="revertClk"
      >
        还原
      </el-button>
      <el-button
        type="primary"
        :icon="CircleCheck"
        @click="saveClk"
      >
        确定
      </el-button>
    </div>
  </div>
</el-dialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElIcon,
  ElButton
} from "element-plus";
import {
  FullScreen,
  CircleCheck,
  CircleClose,
  Refresh,
} from "@element-plus/icons-vue";
import { useFullscreenEffect } from "@/compositions/fullscreen";
import { inject, provide } from "vue";

let { fullscreen, setFullscreen } = $(useFullscreenEffect());

let inited = $ref(false);

let dialogTitle = $ref("");
let dialogVisible = $ref(false);
let dialogAction = $ref("select");

let selectedIds = $ref<string[]>([ ]);
let oldSelectedIds: string[] = [ ];

let onCloseResolve = function(value: {
  action: "select" | "close" | "cancel";
  selectedIds: string[];
}) { };

// 打开对话框
async function showDialog(
  arg?: {
    title?: string;
    action?: "select";
    selectedIds: string[];
  },
) {
  inited = false;
  const title = arg?.title;
  const action = arg?.action;
  dialogAction = action;
  if (title) {
    dialogTitle = title;
  }
  if (arg?.selectedIds) {
    selectedIds = [ ...arg.selectedIds ];
    oldSelectedIds = [ ...arg.selectedIds ];
  } else {
    selectedIds = [ ];
    oldSelectedIds = [ ];
  }
  dialogVisible = true;
  inited = true;
  const reslut = await new Promise<{
    action: "select" | "close" | "cancel";
    selectedIds: string[];
  }>(function(resolve) {
    onCloseResolve = resolve;
  });
  return reslut;
}

function selectedIdsChg(value: string[]) {
  selectedIds = value;
}

async function saveClk() {
  dialogVisible = false;
  onCloseResolve({
    action: "select",
    selectedIds,
  });
}

function revertClk() {
  selectedIds = [ ...oldSelectedIds ];
}

function cancelClk() {
  dialogVisible = false;
  onCloseResolve({
    action: "cancel",
    selectedIds: undefined,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    action: "close",
    selectedIds: undefined,
  });
}

defineExpose({ showDialog, selectedIdsChg });
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
  padding: 20px;
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
.el-dialog.ListSelectDialog {
  width: calc(100% - 30px);
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
}
</style>
