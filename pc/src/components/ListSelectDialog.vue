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
        :is-locked="'1'"
        @selected-ids-chg="selectedIdsChg"
        @before-search-reset="onRevert"
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
        @click="onRevert"
      >
        <template #icon>
          <ElIconRefresh />
        </template>
        <span>{{ ns("还原") }}</span>
      </el-button>
      
      <el-button
        v-if="!isLocked"
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
const props = defineProps<{
  isLocked?: boolean;
}>();

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

let isLocked = $computed(() => {
  return argIsLocked || props.isLocked || false;
});

let argIsLocked = $ref<boolean>();

type OnCloseResolveType = {
  action: typeof dialogAction;
  selectedIds?: any[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

// 打开对话框
async function showDialog(
  arg?: {
    title?: string;
    action?: "select";
    selectedIds: any[];
    isLocked?: boolean;
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
  if (arg?.isLocked != null) {
    argIsLocked = arg?.isLocked;
  }
  inited = true;
  return await dialogPrm;
}

function selectedIdsChg(value: string[]) {
  selectedIds = value;
}

async function saveClk() {
  if (props.isLocked) {
    return;
  }
  dialogVisible = false;
  onCloseResolve({
    action: "select",
    selectedIds,
  });
}

function onRevert() {
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

defineExpose({ showDialog });
</script>

<style>
.el-dialog.ListSelectDialog {
  width: calc(100% - 30px);
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
}
</style>
