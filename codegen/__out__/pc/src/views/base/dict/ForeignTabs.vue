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
      >
      
        <template
          v-if="tabGroup === 'code'"
        >
        
          <el-tab-pane
            :label="'系统字典明细' + (dict_detail_total != null ? ` (${ dict_detail_total })` : '')"
          >
            <Dict_detailList
              :dict_id="dialogModel.id"
              :is_deleted="dialogModel.is_deleted ? '1' : '0'"
              :is-locked="dialogModel.is_deleted ? '1' : '0'"
              @add="useAllFindDebounce"
              @remove="useAllFindDebounce"
              @revert="useAllFindDebounce"
            ></Dict_detailList>
          </el-tab-pane>
          
        </template>
        
      </el-tabs>
    </div>
    <div
      un-p="y-2.5"
      un-box-border
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
        <span>关闭</span>
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

let inited = $ref(false);

let dialogAction = $ref<"list">("list");

const dialogModel = $ref<{
  id?: DictId,
  is_deleted?: 0 | 1,
}>({ });

let tabGroup = $ref("");

const tabName = $ref<string>();

let dict_detail_total = $ref<number>();

async function useFindCountDict_detail() {
  const dict_id: DictId[] = [ dialogModel.id! ];
  dict_detail_total = await findCountDict_detail(
    {
      is_deleted: dialogModel.is_deleted,
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

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    tabGroup: string;
    model?: {
      ids?: DictId[];
      is_deleted?: 0 | 1;
    };
    action?: typeof dialogAction;
  },
) {
  inited = false;
  const title = arg?.title || "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "medium",
    title,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  tabGroup = arg?.tabGroup ?? tabGroup;
  dialogModel.is_deleted = model?.is_deleted;
  dialogAction = action || "list";
  if (dialogAction === "list") {
    dialogModel.id = model?.ids?.[0];
    await useAllFindCount();
  }
  inited = true;
  return await dialogRes.dialogPrm;
}

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
