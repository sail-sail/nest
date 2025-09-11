<template>
<el-dialog
  ref="dialogRef"
  v-model="dialogVisible"
  :fullscreen="fullscreen"
  append-to-body
  :close-on-click-modal="false"
  class="custom_dialog ListSelectDialog"
  :class="{
    auto_dialog: dialogType === 'auto',
    medium_dialog: dialogType === 'medium',
    large_dialog: dialogType === 'large',
  }"
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
        :selected-ids="oldSelectedIds"
        :is-locked="isLocked ? '1' : '0'"
        is-list-select-dialog="1"
        @selected-ids-chg="selectedIdsChg"
        @before-search-reset="onRevert"
        @row-enter="onRowEnter"
        @row-dblclick="onRowDblclick"
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
          <ElIconRefreshLeft />
        </template>
        <span>{{ ns("还原") }}</span>
      </el-button>
      
      <el-button
        v-if="!isLocked"
        plain
        type="primary"
        @click="onSave"
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

const {
  fullscreen,
  setFullscreen,
} = $(useFullscreenEfc());

let inited = $ref(false);

const dialogRef = $ref<InstanceType<typeof ElDialog>>();

export type CustomDialogType = "auto" | "medium" | "large" | "default";

let dialogTitle = $ref("");
let dialogVisible = $ref(false);
let dialogAction = $ref<"select" | "close" | "cancel">("select");
let dialogType = $ref<CustomDialogType>("default");

let selectedIds = $ref<string[] | undefined>([ ]);
let oldSelectedIds = $ref<string[] | undefined>([ ]);

const isLocked = $computed(() => {
  return argIsLocked || props.isLocked || false;
});

let argIsLocked = $ref<boolean>();

type OnCloseResolveType = {
  action: typeof dialogAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedIds?: any[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

// 打开对话框
async function showDialog(
  arg?: {
    type?: typeof dialogType;
    title?: string;
    action?: "select";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  dialogType = arg?.type ?? "medium";
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
  focus();
  inited = true;
  return await dialogPrm;
}

async function focus() {
  const activeElement = document.activeElement;
  if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
    (activeElement as HTMLInputElement).blur();
    (activeElement as HTMLInputElement).focus();
    return;
  }
  await nextTick();
  if (!dialogRef) {
    return;
  }
  const el = dialogRef.dialogContentRef.$el as (HTMLElement | undefined);
  if (el) {
    const tableEl = el.querySelector(".el-table") as (HTMLTableElement | undefined);
    if (tableEl) {
      await nextTick();
      await nextTick();
      tableEl.focus();
    }
  }
}

function selectedIdsChg(value: string[]) {
  selectedIds = value;
}

async function onRowEnter(e?: KeyboardEvent) {
  if (e) {
    if (e.ctrlKey || e.shiftKey) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  await onSave();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onRowDblclick(row: { id: any }) {
  selectedIds = [ row.id ];
  await onSave();
}

async function onSave() {
  if (isLocked) {
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
  oldSelectedIds = selectedIds;
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
