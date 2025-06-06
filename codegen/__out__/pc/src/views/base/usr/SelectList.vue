<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <template #extra_header>
    <div
      title="刷新"
    >
      <ElIconRefresh
        class="select_refresh_icon"
        @click="onRefresh"
      ></ElIconRefresh>
    </div>
  </template>
  <div
    un-overflow-hidden
    un-flex="~ [1_0_0] row basis-[inherit]"
  >
    <List
      v-bind="$attrs"
      :selected-ids="selectedIds"
      :is-multiple="multiple ? '1' : '0'"
      :is-readonly="isReadonly ? '1' : '0'"
      :is-locked="isReadonly ? '1' : '0'"
      @selected-ids-chg="selectedIdsChg"
      @row-enter="onRowEnter"
      @row-dblclick="onRowDblclick"
    ></List>
  </div>
  <div
    un-p="y-2.5"
    un-flex="~"
    un-justify-center
    un-items-center
  >
    <el-button
      plain
      @click="onClose"
    >
      <template #icon>
        <ElIconCircleClose />
      </template>
      <span>关闭</span>
    </el-button>
    
    <el-button
      plain
      type="primary"
      @click="onSave"
    >
      <template #icon>
        <ElIconCircleCheck />
      </template>
      <span>确定</span>
    </el-button>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import type {
  MaybeRefOrGetter,
  WatchStopHandle,
} from "vue";

import {
  findAll,
} from "./Api";

import List from "./List.vue";

const emit = defineEmits<{
  (e: "change", value?: UsrModel | UsrModel[] | null): void,
}>();

let inited = $ref(false);

let dialogAction = $ref("select");

export type OnCloseResolveType = {
  type: "ok" | "cancel";
  selectedIds: UsrId[];
};
export type OnBeforeCloseFnType = (value: OnCloseResolveType) => Promise<boolean | undefined>;
export type OnBeforeChangeFnType = (value: UsrModel[]) => Promise<boolean | undefined>;

let onCloseResolve = function(_value: OnCloseResolveType) { };

let onBeforeClose: OnBeforeCloseFnType | undefined = undefined;
let onBeforeChange: OnBeforeChangeFnType | undefined = undefined;

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let selectedIds = $ref<UsrId[]>([ ]);

let multiple = $ref(false);

let isReadonly = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    multiple?: boolean;
    isReadonly?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: UsrId[];
    };
    action?: typeof dialogAction;
    onBeforeClose?: OnBeforeCloseFnType;
    onBeforeChange?: OnBeforeChangeFnType;
  },
) {
  inited = false;
  const title = arg?.title;
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "medium",
    title,
    pointerPierce: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  onBeforeClose = arg?.onBeforeClose;
  onBeforeChange = arg?.onBeforeChange;
  const model = arg?.model;
  const action = arg?.action;
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    isReadonly = toValue(arg?.isReadonly) ?? false;
  });
  dialogAction = action || "select";
  
  if (arg?.multiple != null) {
    multiple = arg.multiple;
  }
  
  selectedIds = model?.ids || [ ];
  
  inited = true;
  return await dialogRes.dialogPrm;
}

function selectedIdsChg(value: UsrId[]) {
  selectedIds = value;
}

async function getModelsByIds(ids: UsrId[]) {
  if (ids.length === 0) {
    return [ ];
  }
  const res = await findAll(
    {
      ids,
    },
  );
  return res;
}

/** 键盘回车按键 */
async function onRowEnter(e?: KeyboardEvent) {
  if (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  await onSave();
}

/** 双击行 */
async function onRowDblclick(row: { id: UsrId }) {
  selectedIds = [ row.id ];
  await onSave();
}

const listRef = $(useTemplateRef<InstanceType<typeof List>>("listRef"));

/** 刷新 */
async function onRefresh() {
  await listRef?.refresh();
}

/** 确定 */
async function onSave() {
  if (onBeforeClose) {
    const isClose = await onBeforeClose({
      type: "ok",
      selectedIds,
    });
    if (isClose === false) {
      return;
    }
  }
  const models = await getModelsByIds(selectedIds);
  if (onBeforeChange) {
    const isCloseChange = await onBeforeChange(models);
    if (isCloseChange === false) {
      return;
    }
  }
  emit("change", models);
  onCloseResolve({
    type: "ok",
    selectedIds,
  });
}

/** 点击取消关闭按钮 */
async function onClose() {
  if (onBeforeClose) {
    const isClose = await onBeforeClose({
      type: "cancel",
      selectedIds,
    });
    if (isClose === false) {
      return;
    }
  }
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  onCloseResolve({
    type: "cancel",
    selectedIds,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  done(false);
  onCloseResolve({
    type: "cancel",
    selectedIds,
  });
}

defineExpose({
  showDialog,
  getModelsByIds,
  refresh: onRefresh,
});
</script>
