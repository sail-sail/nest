<template>
<tm-modal
  v-model:show="dialogVisible"
  :closeable="true"
  :height="height"
  :title="dialogTitle"
  disabled-scroll
  show-close
  :show-footer="false"
  :content-padding="0"
  max-height="90%"
  :overlay-click="true"
  v-bind="$attrs"
>
  
  <view
    un-h="full"
    un-flex="~ [1_0_0] col"
    un-overflow="hidden"
  >
      
    <scroll-view
      un-flex="~ [1_0_0] col"
      un-overflow="hidden"
      scroll-y
      :rebound="false"
      :scroll-with-animation="true"
    >
      
      <DynPageDetal
        ref="dyn_page_detail_ref"
        un-flex="~ [1_0_0]"
        un-overflow="hidden"
        un-h="full"
        :init="false"
        :before-save="beforeSave"
        :action="dialogAction"
        :dyn_page_id="dyn_page_id"
        :find-one="findOneModel"
        :order_by="order_by"
      ></DynPageDetal>
      
    </scroll-view>
    
  </view>
  
</tm-modal>
</template>

<script lang="ts" setup>
import DynPageDetal from "./Detail.vue";

import {
  findOneDynPage,
} from "./Api";

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let dialogVisible = $ref(false);
const height = $ref<string | number>("90%");

let dyn_page_id = $ref<DynPageId>();
let order_by = $ref<number>();

let inited = $ref(false);

const dyn_page_detail_ref = $ref<InstanceType<typeof DynPageDetal>>();

let findOneModel = findOneDynPage;

type OnCloseResolveType = {
  type: "ok";
  input: DynPageInput;
} | {
  type: "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    model?: {
      id?: DynPageId;
      order_by?: number;
    };
    findOne?: typeof findOneDynPage;
    action: DialogAction;
  },
) {
  inited = false;
  const model = arg?.model;
  const action = arg?.action;
  order_by = model?.order_by;
  dialogTitle = arg?.title ?? "";
  if (arg?.findOne) {
    findOneModel = arg.findOne;
  } else {
    findOneModel = findOneDynPage;
  }
  dialogAction = action || "add";
  dyn_page_id = model?.id;
  
  const dialogPrm = new Promise<OnCloseResolveType>((resolve) => {
    onCloseResolve = function(arg: OnCloseResolveType) {
      dialogVisible = false;
      resolve(arg);
    };
  });
  
  dialogVisible = true;
  
  await onRefresh();
  
  inited = true;
  return await dialogPrm;
}

/** 刷新 */
async function onRefresh() {
  await nextTick();
  await dyn_page_detail_ref?.refresh();
}

async function beforeSave(
  input: DynPageInput,
) {
  onCloseResolve({
    type: "ok",
    input,
  });
  return false;
}

async function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({
  showDialog,
  close: onClose,
  refresh: onRefresh,
});
</script>
