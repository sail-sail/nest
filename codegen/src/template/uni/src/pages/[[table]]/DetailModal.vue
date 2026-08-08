<template><#
const hasSummary = columns.some((column) => column.showSummary && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsMonth = columns.some((column) => column.isMonth);
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
const inlineForeignTabs = (opts?.inlineForeignTabs || [ ]).filter((item) => item.onlyCodegenDeno !== true);
const hasInlineForeignTabs = inlineForeignTabs.length > 0;
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const oldTable = table;
const oldTable_Up = Table_Up;
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
const hasForeignTabs = columns.some((item) => item.foreignTabs?.length > 0);
const hasForeignTabsButton = columns.some((item) => {
  if (!item.foreignTabs) {
    return false;
  }
  if (item.foreignTabs.length === 0) {
    return false;
  }
  return item.foreignTabs.some((item2) => {
    return item2.linkType === "button";
  });
});
const hasForeignTabsMore = columns.some((item) => {
  if (!item.foreignTabs) {
    return false;
  }
  if (item.foreignTabs.length === 0) {
    return false;
  }
  return item.foreignTabs.some((item2) => {
    return item2.linkType === "more";
  });
});
const hasForeignPage = columns.some((item) => item.foreignPage);
const hasImg = columns.some((item) => item.isImg && !item.onlyCodegenDeno);
const hasAtt = columns.some((item) => item.isAtt && !item.onlyCodegenDeno);

const searchFormWidth = opts.searchFormWidth;

const tableFieldPermit = columns.some((item) => item.fieldPermit);

const hasIsSwitch = columns.some((item) => item.isSwitch && !item.onlyCodegenDeno && !item.ignoreCodegen && !item.readonly && !item.noList
  && !item.isEncrypt
  && item.COLUMN_NAME !== "is_deleted"
);
const hasForeignKeyShowTypeDialog = columns.some((item) => item.foreignKey?.showType === "dialog" && !item.onlyCodegenDeno);
const hasOrderBy = columns.some((item) => item.COLUMN_NAME === 'order_by' && !item.readonly && !item.onlyCodegenDeno);

// 审核
const hasAudit = !!opts?.audit;
let hasReviewed = false;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
if (hasAudit) {
  auditColumn = opts.audit.column;
  auditMod = opts.audit.auditMod;
  auditTable = opts.audit.auditTable;
  // 是否有复核
  hasReviewed = opts?.audit?.hasReviewed;
}
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

// 根据关键字搜索
let searchByKeyword = opts?.searchByKeyword;

if (searchByKeyword) {
  if (!searchByKeyword.prop) {
    throw `表: ${ mod }_${ table } 的 opts.searchByKeyword.prop 不能为空`;
    process.exit(1);
  }
  if (!searchByKeyword.fields || !Array.isArray(searchByKeyword.fields) || searchByKeyword.fields.length === 0) {
    throw `表: ${ mod }_${ table } 的 opts.searchByKeyword.fields 不能为空`;
    process.exit(1);
  }
} else {
  searchByKeyword = { };
}

const search_fields = opts?.isUniPage?.list_page?.search_fields || [ ];
const lbl_field = opts?.isUniPage?.list_page?.lbl_field || "lbl";
const lbl_field_column = columns.find((col) => col.COLUMN_NAME === lbl_field);
const lbl2_fields = opts?.isUniPage?.list_page?.lbl2_fields || [ ];
const lbl2_fields_columns = lbl2_fields.map((field) => {
  const column = columns.find((col) => col.COLUMN_NAME === field);
  if (!column) {
    throw new Error(`表: ${ mod }_${ table } 中配置的列表辅助显示字段 ${ field } 在列中不存在`);
  }
  return column;
});
const right_field = opts?.isUniPage?.list_page?.right_field;
const right_field_column = columns.find((col) => col.COLUMN_NAME === right_field);
if (right_field && !right_field_column) {
  throw new Error(`表: ${ mod }_${ table } 中配置的列表右侧显示字段 ${ right_field } 在列中不存在`);
}
#>
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
      
      <<#=Table_Up#>Detail
        ref="<#=table#>_detail_ref"
        un-flex="~ [1_0_0]"
        un-overflow="hidden"
        un-h="full"
        :init="false"
        :before-save="beforeSave"
        :action="dialogAction"
        :<#=table#>_id="<#=table#>_id"
        :find-one="findOneModel"<#
        if (hasOrderBy) {
        #>
        :order_by="order_by"<#
        }
        #>
        :hide-fields="hideFields"
        :has-close-btn="hasCloseBtn"
        :close-btn-fn="onClose"
      ></<#=Table_Up#>Detail>
      
    </scroll-view>
    
  </view>
  
</CustomDialog>
</template>

<script lang="ts" setup>
import CustomDialog from "@/components/CustomDialog/CustomDialog.vue";
import <#=Table_Up#>Detail from "./Detail.vue";

import {
  findOne<#=Table_Up#>,
} from "./Api.ts";

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");

let <#=table#>_id = $ref<<#=Table_Up#>Id>();<#
if (hasOrderBy) {
#>
let order_by = $ref<number>();<#
}
#>

let inited = $ref(false);

provide("not_permit", true);

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();
const <#=table#>_detail_ref = $ref<InstanceType<typeof <#=Table_Up#>Detail>>();

let findOneModel = findOne<#=Table_Up#>;
let hideFields = $ref<string[]>([ ]);
let hasCloseBtn = $ref<boolean>(false);

type OnCloseResolveType = {
  type: "ok";
  input: <#=Table_Up#>Input;
} | {
  type: "cancel";
};

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    model?: {
      id?: <#=Table_Up#>Id;<#
      if (hasOrderBy) {
      #>
      order_by?: number;<#
      }
      #>
    };
    findOne?: typeof findOne<#=Table_Up#>;
    hideFields?: string[];
    hasCloseBtn?: boolean;
    action: DialogAction;
  },
) {
  inited = false;
  const model = arg?.model;
  const action = arg?.action;<#
  if (hasOrderBy) {
  #>
  order_by = model?.order_by;<#
  }
  #>
  dialogTitle = arg?.title ?? "";
  if (arg?.findOne) {
    findOneModel = arg.findOne;
  } else {
    findOneModel = findOne<#=Table_Up#>;
  }
  if (arg?.hideFields) {
    hideFields = arg.hideFields;
  } else {
    hideFields = [ ];
  }
  if (arg?.hasCloseBtn != null) {
    hasCloseBtn = arg.hasCloseBtn;
  } else {
    hasCloseBtn = false;
  }
  dialogAction = action || "add";
  <#=table#>_id = model?.id;
  
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
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
  
  await onRefresh();
  
  inited = true;
  
  return await dialogRes;
}

/** 刷新 */
async function onRefresh() {
  await nextTick();
  await <#=table#>_detail_ref?.refresh();
}

async function beforeSave(
  input: <#=Table_Up#>Input,
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
