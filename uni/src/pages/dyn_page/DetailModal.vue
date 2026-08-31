<template>
<CustomDialog
  ref="customDialogRef"
  :title="dialogTitle"
  type="large"
  disabled-scroll
  show-close
  :show-footer="false"
  :content-padding="0"
  max-height="90%"
  :close-on-click-modal="true"
  v-bind="$attrs"
  @close="onClose"
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
  
</CustomDialog>
</template>

<script lang="ts" setup>
import CustomDialog from "@/components/CustomDialog/CustomDialog.vue";
import DynPageDetal from "./Detail.vue";

import {
  findOneDynPage,
} from "./Api";

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");

let dyn_page_id = $ref<DynPageId>();
let order_by = $ref<number>();

let inited = $ref(false);

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();
const dyn_page_detail_ref = $ref<InstanceType<typeof DynPageDetal>>();

let findOneModel = findOneDynPage;

type OnCloseResolveType = {
  type: "ok";
  input: DynPageInput;
} | {
  type: "cancel";
};

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
  
  await onRefresh();
  
  inited = true;
  
  return await customDialogRef!.showDialog<OnCloseResolveType>({
    title: dialogTitle,
    type: "large",
    showFooter: false,
    showClose: true,
    showTitle: true,
    disabledScroll: true,
    contentPadding: 0,
    maxHeight: "90%",
    closeOnClickModal: true,
    closeResult: {
      type: "cancel",
    },
  });
}

/** 刷新 */
async function onRefresh() {
  await nextTick();
  await dyn_page_detail_ref?.refresh();
}

async function beforeSave(
  input: DynPageInput,
) {
  customDialogRef?.resolve({
    type: "ok",
    input,
  });
  return false;
}

async function onClose() {
  customDialogRef?.resolve({
    type: "cancel",
  });
}

defineExpose({
  showDialog,
  close: onClose,
  refresh: onRefresh,
});
</script>
