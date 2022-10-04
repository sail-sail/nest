<template>
<el-dialog
  :fullscreen="fullscreen"
  v-model="dialogVisible"
  append-to-body
  :close-on-click-modal="false"
  :class="'custom_dialog ListSelectDialog'"
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
      <el-icon
        class="full_but"
        @click="setFullscreen"
      >
        <FullScreen/>
      </el-icon>
    </div>
  </template>
  <div
    flex="~ [1_0_0] col basis-[inherit]"
    overflow-hidden
  >
    <div
      flex="~ [1_0_0] col basis-[inherit]"
      overflow-auto
      p="0"
      justify-start
      items-center
    >
      <slot :selectedIds="selectedIds"></slot>
    </div>
    <div
      p="y-2.5"
      flex
      justify-center
      items-center
    >
      
      <el-button
        @click="cancelClk"
      >
        <template #icon>
          <CircleClose/>
        </template>
        <span>取消</span>
      </el-button>
      
      <el-button
        class="mx-1"
        @click="revertClk"
      >
        <template #icon>
          <Refresh/>
        </template>
        <span>还原</span>
      </el-button>
      
      <el-button
        type="primary"
        @click="saveClk"
      >
        <template #icon>
          <CircleCheck/>
        </template>
        <span>确定</span>
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

import { useFullscreenEfc } from "@/compositions/fullscreen";

let { fullscreen, setFullscreen } = $(useFullscreenEfc());

let inited = $ref(false);

let dialogTitle = $ref("");
let dialogVisible = $ref(false);
let dialogAction: string = $ref("select");

let selectedIds: string[]|undefined = $ref([ ]);
let oldSelectedIds: string[]|undefined = [ ];

let onCloseResolve = function(value: {
  action: "select" | "close" | "cancel";
  selectedIds: string[]|undefined;
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
  dialogVisible = true;
  const dialogPrm = new Promise<{
    action: "select" | "close" | "cancel";
    selectedIds: string[] | undefined;
  }>(function(resolve) {
    onCloseResolve = resolve;
  })
  const title = arg?.title;
  const action = arg?.action;
  dialogAction = action || "select";
  if (title) {
    dialogTitle = title;
  }
  if (arg?.selectedIds) {
    selectedIds = [
      ...arg.selectedIds,
    ];
    oldSelectedIds = [
      ...arg.selectedIds,
    ];
  } else {
    selectedIds = [ ];
    oldSelectedIds = [ ];
  }
  inited = true;
  return await dialogPrm;
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
  selectedIds = oldSelectedIds && [ ...oldSelectedIds ];
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

<style>
.el-dialog.ListSelectDialog {
  width: calc(100% - 30px);
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
}
</style>
