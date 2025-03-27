<#
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");

// 审核
const hasAudit = !!opts?.audit;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
let auditModelLabel = "";
let auditTableIdColumn = undefined;
let auditTableSchema = undefined;
if (hasAudit) {
  auditColumn = opts.audit.column;
  auditMod = opts.audit.auditMod;
  auditTable = opts.audit.auditTable;
}
// 是否有复核
const hasReviewed = opts?.hasReviewed;
const auditTableUp = auditTable.substring(0, 1).toUpperCase()+auditTable.substring(1);
const auditTable_Up = auditTableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
if (hasAudit) {
  auditTableSchema = opts?.audit?.auditTableSchema;
  auditTableIdColumn = auditTableSchema.columns.find(item => item.COLUMN_NAME === `${ table }_id`);
  if (!auditTableIdColumn) {
    throw new Error(`${ auditMod }_${ auditTable }: ${ auditTable }_id 字段不存在`);
  }
  auditModelLabel = auditTableIdColumn.modelLabel;
}
#><template>
<CustomDialog
  ref="customDialogRef"
  close-on-click-modal
>
  <div
    un-flex="~ col"
  >
    <div
      un-flex="~ col"
      un-overflow-auto
      un-p="x-8 y-4"
      un-box-border
      un-gap="4"
      un-justify-start
      un-items-safe-center
      un-min="h-40"
    >
      <template v-if="!inited">
        <el-skeleton
          :rows="5"
          :loading="true"
        ></el-skeleton>
      </template>
      <template v-else-if="data.length === 0">
        <div
          un-flex="~ [1_0_0] col"
          un-overflow-hidden
          un-justify-center
          un-items-center
          un-text="gray"
        ><#
          if (isUseI18n) {
          #>
          ({{ ns('暂无数据') }})<#
          } else {
          #>
          (暂无数据)<#
          }
          #>
        </div>
      </template>
      <template v-else>
        <el-timeline>
          <el-timeline-item
            v-for="item in data"
            :key="item.id"
            :timestamp="item.audit_time_lbl"
            :type="timelineItemTypes[item.audit]"
          >
            <div
              un-flex="~ col"
              un-gap="y-2"
            >
              <div
                un-flex="~"
                un-gap="x-4"
              >
                <div>
                  {{ item.audit_usr_id_lbl }}
                </div>
                <div
                  :class="{
                    'text-red': item.audit === <#=auditTable_Up#>Audit.Rejected,
                  }"
                >
                  {{ item.audit_lbl }}
                </div>
              </div>
              <div
                v-if="item.rem"
                :class="{
                  'text-red': item.audit === <#=auditTable_Up#>Audit.Rejected,
                }"
              >
                {{ item.rem }}
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </template>
    </div>
    <div
      un-p="b-4"
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
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('关闭') }}</span><#
        } else {
        #>
        <span>关闭</span><#
        }
        #>
      </el-button>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import {
  findAll<#=auditTable_Up#>,
} from "../<#=auditTable#>/Api.ts";

import {
  <#=auditTable_Up#>Audit,
} from "#/types.ts";

let inited = $ref(false);

type DialogAction = "list";
let dialogAction = $ref<DialogAction>("list");
let dialogTitle = $ref("");
let dialogNotice = $ref("");

const timelineItemTypes = {
  "unsubmited": "info",
  "unaudited": "success",
  "audited": "primary",
  "rejected": "danger",<#
  if (hasReviewed) {
  #>
  "reviewed": "warning",<#
  }
  #>
} as const;

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let id = $ref<<#=Table_Up#>Id>();

let is_deleted = $ref<0|1>();

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    model?: {
      id?: <#=Table_Up#>Id;
      is_deleted?: 0 | 1 | null;
    };
    action: DialogAction;
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  const notice = arg?.notice;
  dialogNotice = notice ?? "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title: $$(dialogTitle),
    pointerPierce: false,
    notice: $$(dialogNotice),
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  dialogAction = action || "list";
  id = model?.id;
  is_deleted = model?.is_deleted ?? 0;
  
  await initFrame();
  
  return await dialogRes.dialogPrm;
}

let data = $ref<<#=auditTable_Up#>Model[]>([ ]);

async function onRefresh() {
  if (!id) {
    data = [ ];
    return;
  }
  data = await findAll<#=auditTable_Up#>(
    {
      <#=table#>_id: [ id ],
      is_deleted,
    },
    undefined,
    undefined,
    {
      notLoading: true,
    },
  );
}

async function initFrame() {
  data = [ ];
  await onRefresh();
  inited = true;
}

async function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({
  showDialog,
  refresh: onRefresh,
});
</script>
