<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  click-modal-close
>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-p="x-2"
      un-justify-start
      un-items-center
    >
      <el-tabs
        v-model="tabName"
        type="card"
        class="el-flex-tabs"
        un-flex="~ [1_0_0] col"
        un-w="full"
      >
        
        <el-tab-pane
          lazy
          :label="'系统字典' + (dict_detailTotal ? ` (${ dict_detailTotal })` : '')"
          name="系统字典"
        >
          <Dict_detailList
            :dict_id="dialogModel.id"
            @add="useAllFindDebounce"
            @remove="useAllFindDebounce"
            @revert="useAllFindDebounce"
          ></Dict_detailList>
        </el-tab-pane>
        
      </el-tabs>
    </div>
    <div
      un-p="y-2.5"
      un-flex
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
        <span>{{ n("关闭") }}</span>
      </el-button>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>

import Dict_detailList from "@/views/base/dict_detail/List.vue";

import {
  findCount as findCountDict_detail,
} from "@/views/base/dict_detail/Api";

const {
  n,
  initI18ns,
} = useI18n("/base/dict");

let inited = $ref(false);

let dialogAction = $ref<"list">("list");

let dialogModel = $ref<{
  id?: string,
}>({ });

let tabName = $ref("系统字典");

let dict_detailTotal = $ref<number>();

async function useFindCountDict_detail() {
  const dict_id = [ dialogModel.id! ];
  dict_detailTotal = await findCountDict_detail(
    {
      dict_id,
    },
  );
}

async function useAllFindCount() {
  await Promise.all([
    useFindCountDict_detail(),
  ]);
}

let findTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

function useAllFindDebounce() {
  clearTimeout(findTimeout);
  findTimeout = setTimeout(useAllFindCount, 0);
}

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    model?: {
      id?: string;
    };
    action?: typeof dialogAction;
  },
) {
  inited = false;
  const title = arg?.title || "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "large",
    title,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  dialogAction = action || "list";
  if (dialogAction === "list") {
    dialogModel.id = model?.id;
    await useAllFindCount();
  }
  inited = true;
  return await dialogRes.dialogPrm;
}

/** 初始化ts中的国际化信息 */
async function initI18nsEfc() {
  const {
    initI18ns,
  } = useI18n();
  const codes: string[] = [
  ];
  await initI18ns(codes);
}
initI18nsEfc();

/** 点击取消关闭按钮 */
function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({ showDialog });
</script>
