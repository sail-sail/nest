<template><#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
const inlineForeignTabs = (opts?.inlineForeignTabs || [ ]).filter((item) => item.onlyCodegenDeno !== true);
const hasInlineForeignTabs = inlineForeignTabs.length > 0;
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
let hasIsFluentEditor = false;
let columnNum = 0;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noDetail) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "is_locked") continue;
  if (column_name === "is_deleted") continue;
  if (column_name === "version") continue;
  if (column_name === "tenant_id") continue;
  const foreignKey = column.foreignKey;
  if (foreignKey && foreignKey.showType === "dialog") {
    continue;
  }
  if (
    [
      "is_default",
    ].includes(column_name)
  ) {
    continue;
  }
  if (column.isFluentEditor) {
    hasIsFluentEditor = true;
    continue;
  }
  columnNum++;
}

let detailFormCols = opts.detailFormCols;
if (detailFormCols == null) {
  if (columnNum <= 4) {
    detailFormCols = 1;
  } else {
    detailFormCols = 2;
  }
}
const detailFormWidth = opts.detailFormWidth;

let detailCustomDialogType = opts.detailCustomDialogType;
if (!detailCustomDialogType) {
  if (columnNum > 20 || hasInlineForeignTabs) {
    detailCustomDialogType = "default";
  } else {
    detailCustomDialogType = "auto";
  }
}
let hasInlineMany2manyTab = false;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const many2many = column.many2many;
  if (!many2many || !foreignKey) continue;
  if (!column.inlineMany2manyTab) continue;
  hasInlineMany2manyTab = true;
  break;
}
const old_mod = mod;
const old_table = table;

const tableFieldPermit = columns.some((item) => item.fieldPermit);

const hasImg = columns.some((item) => item.isImg);
const hasAtt = columns.some((item) => item.isAtt);
// bpm
const hasBpm = !!opts?.bpm && !!opts?.bpm?.biz_code;
const bpmBizCode = opts?.bpm?.biz_code;
const bpmStatusField = opts?.bpm?.bpm_status_field;
const bpmStatusFieldUp = bpmStatusField
  ? bpmStatusField.split("_").map((item) => item.substring(0, 1).toUpperCase() + item.substring(1)).join("")
  : "";

// 审核
const hasAudit = !!opts?.audit;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
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
const auditTableSchema = opts?.audit?.auditTableSchema;

// 选择省市县区
let province_code_column = undefined;
let province_lbl_column = undefined;
let city_code_column = undefined;
let city_lbl_column = undefined;
let county_code_column = undefined;
let county_lbl_column = undefined;
let address_column = undefined;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  const column_name = column.COLUMN_NAME;
  if (column.isProvinceCode) {
    province_code_column = column;
  }
  if (column.isProvinceLbl) {
    province_lbl_column = column;
  }
  if (column.isCityCode) {
    city_code_column = column;
    if (!province_code_column) {
      throw new Error("没有配置省份字段");
    }
  }
  if (column.isCityLbl) {
    city_lbl_column = column;
  }
  if (column.isCountyCode) {
    county_code_column = column;
    if (!city_lbl_column) {
      throw new Error("没有配置城市字段");
    }
  }
  if (column.isCountyLbl) {
    county_lbl_column = column;
  }
  if (column.isAddress) {
    address_column = column;
  }
  if (province_code_column && province_lbl_column && city_code_column && city_lbl_column && county_code_column && county_lbl_column && address_column) {
    break;
  }
}

#>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  
  <div
    un-flex="~ col"
    un-gap="4"
    un-p="x-8 y-4"
    un-box-border
    un-justify="center-safe"
    un-items="center-safe"
  >
    
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="auto"
      
      un-grid="~ cols-[repeat(1,480px)]"
      un-gap="x-2 y-4"
      un-justify-items-end
      un-items-center
      
      @submit.prevent
    >
      
      <el-form-item
        label="审批意见"
      >
        <CustomInput
          v-model="formModel.opinion"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          placeholder="请输入 审批意见"
        ></CustomInput>
      </el-form-item>

      <el-form-item
        label="加签用户"
      >
        <CustomSelect
          v-model="formModel.add_sign_usr_ids"
          v-model:model-label="formModel.add_sign_usr_ids_lbl"
          :method="getListUsr"
          :find-by-values="findByIdsUsr"
          :options-map="((item: UsrModel) => ({
            label: item.lbl,
            value: item.id,
          }))"
          multiple
          :show-select-all="false"
          placeholder="请选择加签用户（可选）"
        ></CustomSelect>
      </el-form-item>
      
    </el-form>
    
    <div
      un-p="y-3"
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
        <span>取消</span>
      </el-button>
      
      <el-button
        plain
        type="danger"
        :loading="submitting"
        @click="onReject"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>拒绝</span>
      </el-button>
      
      <el-button
        plain
        type="success"
        :loading="submitting"
        @click="onApprove"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>同意</span>
      </el-button>
      
    </div>
    
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import {
  TaskAction,
} from "#/types.ts";

import {
  completeTask<#=Table_Up#>,
  getListUsr,
} from "./Api.ts";

import {
  findByIdsUsr,
} from "@/views/base/usr/Api.ts";

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

const customDialogRef = $(useTemplateRef("customDialogRef"));
const formRef = $(useTemplateRef("formRef"));

let submitting = $ref(false);
let onCloseResolve = function(_value: OnCloseResolveType) { };

let formModel = $ref<{
  opinion?: string;
  add_sign_usr_ids?: UsrId[];
  add_sign_usr_ids_lbl?: string;
}>({
  opinion: "",
  add_sign_usr_ids: [],
  add_sign_usr_ids_lbl: "",
});

let currentId = $ref<<#=Table_Up#>Id>();

async function showDialog(arg: { id: <#=Table_Up#>Id }) {
  currentId = arg.id;
  formModel = {
    opinion: "",
    add_sign_usr_ids: [],
    add_sign_usr_ids_lbl: "",
  };

  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title: "审批 BPM测试业务单",
    pointerPierce: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;

  return await dialogRes.dialogPrm;
}

async function submit(action: TaskAction) {
  if (!currentId) {
    ElMessage.warning("缺少业务单 ID");
    return;
  }

  if (action === TaskAction.Reject) {
    if (!formModel.opinion?.trim()) {
      ElMessage.warning("请填写 审批意见");
      return;
    }
  }
  
  const opinion = formModel.opinion?.trim() || undefined;
  const add_sign_usr_ids = formModel.add_sign_usr_ids?.length ? formModel.add_sign_usr_ids : undefined;

  submitting = true;
  try {
    await completeTask<#=Table_Up#>(
      currentId,
      action,
      opinion,
      add_sign_usr_ids,
    );

    ElMessage.success(action === TaskAction.Approve ? "审批通过" : "已拒绝");
    onCloseResolve({ type: "ok" });
  } catch (err) {
    ElMessage.error(String(err));
  } finally {
    submitting = false;
  }
}

async function onApprove() {
  await submit(TaskAction.Approve);
}

async function onReject() {
  await submit(TaskAction.Reject);
}

function beforeClose(done: (cancel: boolean) => void) {
  done(false);
}

function onClose() {
  onCloseResolve({ type: "cancel" });
}

defineExpose({
  showDialog,
});
</script>
