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
      <ElIconFullScreen
        class="full_but"
        @click="setFullscreen"
      />
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
      <slot
        v-bind="$attrs"
        :selected-ids="selectedIds"
      ></slot>
    </div>
    <div
      un-p="y-2.5"
      un-flex="~ gap-1"
      un-justify-center
      un-items-center
    >
      
      <el-button
        @click="cancelClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ ns("关闭") }}</span>
      </el-button>
      
      <el-button
        @click="revertClk"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        <span>{{ ns("还原") }}</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="saveClk"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ ns("确定") }}</span>
      </el-button>
      
    </div>
  </div>
</el-dialog>
</template>

<script setup lang="ts">
const {
  ns,
} = useI18n("/base/usr");

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
