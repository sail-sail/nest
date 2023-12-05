<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <div
    un-overflow-hidden
    un-flex="~ [1_0_0] row basis-[inherit]"
  >
    <List
      v-bind="$attrs"
      :selected-ids="selectedIds"
      @selected-ids-chg="selectedIdsChg"
      :is-multiple="multiple"
      :is-readonly="isReadonly ? '1' : '0'"
      :is-locked="isReadonly ? '1' : '0'"
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
      <span>{{ ns("关闭") }}</span>
    </el-button>
    
    <el-button
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

import type {
  CardId,
} from "@/typings/ids";

import type {
  CardModel,
} from "#/types";

const emit = defineEmits<{
  (e: "change", value?: CardModel | (CardModel | undefined)[] | null): void,
}>();

const {
  n,
  ns,
} = useI18n("/esw/card");

let inited = $ref(false);

let dialogAction = $ref("select");

type OnCloseResolveType = {
  type: "ok" | "cancel";
  selectedIds: CardId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

let selectedIds = $ref<CardId[]>([ ]);

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
      ids?: CardId[];
    };
    action?: typeof dialogAction;
  },
) {
  inited = false;
  const title = arg?.title;
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "medium",
    title,
  });
  onCloseResolve = dialogRes.onCloseResolve;
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

function selectedIdsChg(value: CardId[]) {
  selectedIds = value;
}

async function getModelsByIds(ids: CardId[]) {
  const res = await findAll(
    {
      ids,
    },
  );
  return res;
}

/** 确定 */
async function onSave() {
  onCloseResolve({
    type: "ok",
    selectedIds,
  });
  const models = await getModelsByIds(selectedIds);
  emit("change", models);
}

/** 点击取消关闭按钮 */
async function onClose() {
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
});
</script>
