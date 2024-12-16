<template>
<el-dialog
  v-model="dialogVisible"
  :fullscreen="fullscreen"
  append-to-body
  :close-on-click-modal="false"
  top="0"
  :before-close="beforeClose"
  class="custom_dialog background_task_ListDialog"
>
  <template #header>
    <div
      v-draggable
      class="dialog_title"
    >
      <div class="title_lbl">
        <span class="title_span">
          {{ dialogTitle }}
        </span>
      </div>
      <ElIconFullScreen
        class="full_but"
        @click="setFullscreen"
      />
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
import useBackground_taskStore from "@/store/background_task";
import List from "./List.vue";

const {
  fullscreen,
  setFullscreen,
} = $(useFullscreenEfc());

let dialogTitle = $ref("后台任务列表");
let dialogVisible = $ref(false);

const background_taskStore = useBackground_taskStore();

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

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
  const dialogPrm = new Promise<OnCloseResolveType>((resolve) => {
    onCloseResolve = function(arg: OnCloseResolveType) {
      dialogVisible = false;
      resolve(arg);
    };
  });
  return await dialogPrm;
}

async function beforeClose(done: (cancel: boolean) => void) {
  (background_taskStore.listDialogVisible as unknown as boolean) = false;
  onCloseResolve({
    type: "cancel",
  });
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
