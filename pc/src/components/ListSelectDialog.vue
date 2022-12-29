<template>
<el-dialog
  v-model="dialogVisible"
  :fullscreen="fullscreen"
  append-to-body
  :close-on-click-modal="false"
  :class="'custom_dialog ListSelectDialog'"
  top="0"
  :before-close="beforeClose"
>
  <template #header>
    <div
      v-draggable
      class="dialog_title"
    >
      <div class="title_lbl">
        <span class="dialogTitle_span">
          {{ dialogTitle }}
        </span>
      </div>
      <el-icon
        class="full_but"
        @click="setFullscreen"
      >
        <FullScreen />
      </el-icon>
    </div>
  </template>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-p="0"
      un-justify-start
      un-items-center
    >
      <slot :selected-ids="selectedIds"></slot>
    </div>
    <div
      un-p="y-2.5"
      un-flex
      un-justify-center
      un-items-center
    >
      
      <el-button
        @click="cancelClk"
      >
        <template #icon>
          <CircleClose />
        </template>
        <span>取消</span>
      </el-button>
      
      <el-button
        un-m="x-1"
        @click="revertClk"
      >
        <template #icon>
          <Refresh />
        </template>
        <span>还原</span>
      </el-button>
      
      <el-button
        type="primary"
        @click="saveClk"
      >
        <template #icon>
          <CircleCheck />
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
let dialogAction = $ref<"select" | "close" | "cancel">("select");

let selectedIds = $ref<string[] | undefined>([ ]);
let oldSelectedIds: string[] = [ ];

type OnCloseResolveType = {
  action: typeof dialogAction;
  selectedIds?: string[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

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
  const dialogPrm = new Promise<OnCloseResolveType>(function(resolve) {
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
