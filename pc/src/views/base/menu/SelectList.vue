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
      :selected-ids="selectedIds"
      @selected-ids-chg="selectedIdsChg"
      :is-multiple="multiple"
    ></List>
  </div>
  <div
    un-p="y-2.5"
    un-flex
    un-justify-center
    un-items-center
  >
    <el-button
      plain
      @click="closeClk"
    >
      <template #icon>
        <ElIconCircleClose />
      </template>
      <span>取消</span>
    </el-button>
    
    <el-button
      plain
      type="primary"
      @click="saveClk"
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
import {
  findAll,
} from "./Api";

import List from "./List.vue";

import {
  type MenuModel,
} from "#/types";

const emit = defineEmits<{
  (e: "change", value?: MenuModel | (MenuModel | undefined)[] | null): void,
}>();

let inited = $ref(false);

let dialogAction = $ref("select");

type OnCloseResolveType = {
  type: "ok" | "cancel";
  selectedIds: string[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

let selectedIds = $ref<string[]>([ ]);

let multiple = $ref(false);

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    multiple?: boolean;
    model?: {
      ids?: string[];
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
  dialogAction = action || "select";
  
  if (arg?.multiple != null) {
    multiple = arg.multiple;
  }
  
  selectedIds = model?.ids || [ ];
  
  inited = true;
  return await dialogRes.dialogPrm;
}

function selectedIdsChg(value: string[]) {
  selectedIds = value;
}

async function getModelsByIds(ids: string[]) {
  const res = await findAll(
    {
      ids,
    },
  );
  return res;
}

/** 确定 */
async function saveClk() {
  onCloseResolve({
    type: "ok",
    selectedIds,
  });
  const models = await getModelsByIds(selectedIds);
  emit("change", models);
}

/** 点击取消关闭按钮 */
async function closeClk() {
  onCloseResolve({
    type: "cancel",
    selectedIds,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
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
