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
          v-if="tabGroup === 'exec_state'"
        >
        
          <el-tab-pane
            :label="'任务执行日志明细' + (cron_job_log_detail_total != null ? ` (${ cron_job_log_detail_total })` : '')"
          >
            <Cron_job_log_detailList
              :cron_job_log_id="dialogModel.id"
              :is_deleted="dialogModel.is_deleted ? '1' : '0'"
              :is-locked="dialogModel.is_deleted ? '1' : '0'"
              @add="useAllFindDebounce"
              @remove="useAllFindDebounce"
              @revert="useAllFindDebounce"
            ></Cron_job_log_detailList>
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
        <span>{{ ns("关闭") }}</span>
      </el-button>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>

import Cron_job_log_detailList from "@/views/cron/cron_job_log_detail/List.vue";

import {
  findCount as findCountCron_job_log_detail,
} from "@/views/cron/cron_job_log_detail/Api";

const {
  n,
  ns,
  initI18ns,
} = useI18n("/cron/cron_job_log");

let inited = $ref(false);

let dialogAction = $ref<"list">("list");

const dialogModel = $ref<{
  id?: CronJobLogId,
  is_deleted?: 0 | 1,
}>({ });

let tabGroup = $ref("");

const tabName = $ref<string>();

let cron_job_log_detail_total = $ref<number>();

async function useFindCountCron_job_log_detail() {
  const cron_job_log_id: CronJobLogId[] = [ dialogModel.id! ];
  cron_job_log_detail_total = await findCountCron_job_log_detail(
    {
      is_deleted: dialogModel.is_deleted,
      cron_job_log_id,
    },
  );
}

async function useAllFindCount() {
  await Promise.all([
    useFindCountCron_job_log_detail(),
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

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    tabGroup: string;
    model?: {
      id?: CronJobLogId;
      is_deleted?: 0 | 1;
    };
    action?: typeof dialogAction;
  },
) {
  inited = false;
  const title = arg?.title || "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "default",
    title,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  tabGroup = arg?.tabGroup ?? tabGroup;
  dialogModel.is_deleted = model?.is_deleted;
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
