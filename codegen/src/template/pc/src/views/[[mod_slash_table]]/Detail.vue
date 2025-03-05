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
let columnNum = 0;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noAdd && column.noEdit) continue;
  if (column.isAtt) continue;
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
  @open="onDialogOpen"
  @close="onDialogClose"
  @keydown.page-down="onPageDown"
  @keydown.page-up="onPageUp"<#
  if (opts?.noAdd !== true || opts?.noEdit !== true) {
  #>
  @keydown.insert="onInsert"
  @keydown.ctrl.i="onInsert"<#
  }
  #>
  @keydown.ctrl.arrow-down="onPageDown"
  @keydown.ctrl.arrow-up="onPageUp"<#
  if ((opts.noAdd !== true || opts.noEdit !== true) && opts.hideSaveAndCopy === false) {
  #>
  @keydown.ctrl.shift.enter="onSaveAndCopyKeydown"<#
  }
  #><#
  if (opts.noAdd !== true || opts.noEdit !== true) {
  #>
  @keydown.ctrl.enter="onSaveKeydown"
  @keydown.ctrl.s="onSaveKeydown"<#
  }
  #>
>
  <template #extra_header>
    <div<#
      if (isUseI18n) {
      #>
      :title="ns('重置')"<#
      } else {
      #>
      title="重置"<#
      }
      #>
    >
      <ElIconRefresh
        class="reset_but"
        @click="onReset"
      ></ElIconRefresh>
    </div><#
    if (hasIsDeleted) {
    #>
    <template v-if="!isLocked && !is_deleted && (dialogAction === 'edit' || dialogAction === 'view')">
      <div
        v-if="!isReadonly"<#
        if (isUseI18n) {
        #>
        :title="ns('锁定')"<#
        } else {
        #>
        title="锁定"<#
        }
        #>
      >
        <ElIconUnlock
          class="unlock_but"
          @click="isReadonly = true;"
        >
        </ElIconUnlock>
      </div>
      <div
        v-else<#
        if (isUseI18n) {
        #>
        :title="ns('解锁')"<#
        } else {
        #>
        title="解锉"<#
        }
        #>
      >
        <ElIconLock
          class="lock_but"
          @click="isReadonly = false;"
        ></ElIconLock>
      </div>
    </template><#
    }
    #>
  </template>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-p="x-8 y-4"
      un-box-border
      un-gap="4"
      un-justify-start
      un-items-safe-center
    >
      <el-form
        ref="formRef"
        size="default"
        label-width="auto"
        
        un-grid="~ cols-[repeat(<#=detailFormCols#>,<#=detailFormWidth#>)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
        
        @submit.prevent
      ><#
        let form_item_index = 0;
        const selectInputForeign_Table_Ups = [ ];
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column.ignoreCodegen) continue;
          if (column.onlyCodegenDeno) continue;
          if (column.noAdd && column.noEdit) continue;
          // if (column.isAtt) continue;
          const column_name = column.COLUMN_NAME;
          if (column_name === "id") continue;
          if (column_name === "is_locked") continue;
          if (column_name === "is_deleted") continue;
          if (column_name === "version") continue;
          if (column_name === "tenant_id") continue;
          const data_type = column.DATA_TYPE;
          const column_type = column.COLUMN_TYPE || "";
          const column_comment = column.COLUMN_COMMENT || "";
          let require = column.require;
          const foreignKey = column.foreignKey;
          if (foreignKey && foreignKey.showType === "dialog") {
            continue;
          }
          const foreignTable = foreignKey && foreignKey.table;
          const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
          const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
          }).join("");
          let vIf = [ ];
          if (column.noAdd) {
            vIf.push("dialogAction !== 'add'");
          }
          if (column.noEdit) {
            vIf.push("dialogAction !== 'edit'");
          }
          const vIfStr = vIf.join(" && ");
          let foreignSchema = undefined;
          if (foreignKey) {
            foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
          }
          if (
            [
              "is_default",
            ].includes(column_name)
          ) {
            continue;
          }
          const readonlyPlaceholder = column.readonlyPlaceholder;
          const modelLabel = column.modelLabel;
          if (column.inlineMany2manyTab) continue;
          const isPassword = column.isPassword;
          form_item_index++;
          const fieldPermit = column.fieldPermit;
        #>
        
        <template v-if="<#
          if (fieldPermit) {
        #>field_permit('<#=column_name#>') && <#
          }
        #>(showBuildIn || builtInModel?.<#=column_name#> == null)<#=vIfStr ? ' && '+vIfStr : ''#>">
          <el-form-item<#
            if (isUseI18n) {
            #>
            :label="n('<#=column_comment#>')"<#
            } else {
            #>
            label="<#=column_comment#>"<#
            }
            #><#
            if (column.isIcon) {
            #>
            prop="<#=column_name#>_lbl"<#
            } else {
            #>
            prop="<#=column_name#>"<#
            }
            #><#
            if (
              (column.isTextarea && detailFormCols > 1) ||
              (column.isImg && detailFormCols > 1 && column.attMaxSize > 1)
            ) {
            #>
            un-grid="col-span-full"<#
            }
            #>
          ><#
            if (column.isIcon) {
            #>
            <CustomIcon
              v-model="dialogModel.<#=column_name#>"
              v-model:model-lbl="dialogModel.<#=column_name#>_lbl"<#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #>
              :page-inited="inited"
            ></CustomIcon><#
            } else if (column.isImg) {
            #>
            <UploadImage
              v-model="dialogModel.<#=column_name#>"
              db="<#=table_name#>.<#=column_name#>"<#
              if (column.attMaxSize > 1) {
              #>
              :max-size="<#=column.attMaxSize#>"<#
              }
              #><#
              if (column.maxFileSize > 1) {
              #>
              :max-file-size="<#=column.maxFileSize#>"<#
              }
              #><#
              if (column.attAccept) {
              #>
              accept="<#=column.attAccept#>"<#
              }
              #><#
              if (column.isPublicAtt) {
              #>
              :is-public="true"<#
              } else {
              #>
              :is-public="false"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>': ''"<#
              }
              #><#
              }
              #>
              :page-inited="inited"
            ></UploadImage><#
            } else if (
              foreignKey
              && (foreignKey.selectType === "select" || foreignKey.selectType == null)
              && !foreignSchema?.opts?.list_tree
            ) {
            #>
            <CustomSelect<#
              if (mod === "base" && table === "usr" && column_name === "default_org_id") {
              #>
              ref="default_org_idRef"<#
              }
              #><#
              if (foreignKey.hasSelectAdd && !(mod === "base" && table === "usr" && column_name === "default_org_id")) {
              #>
              ref="<#=column_name#>Ref"<#
              }
              #>
              v-model="dialogModel.<#=column_name#>"<#
              if (mod === "base" && table === "usr" && column_name === "default_org_id") {
              #>
              :init="false"<#
              }
              #><#
              if (foreignKey.multiple) {
              #>
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? [ ]"<#
              }
              #><#
              if (modelLabel) {
              #>
              v-model:model-label="dialogModel.<#=modelLabel#>"<#
              }
              #><#
              if (mod === "base" && table === "usr" && column_name === "default_org_id") {
              #>
              :method="getOrgListApi"<#
              } else {
              #>
              :method="get<#=Foreign_Table_Up#>List"<#
              }
              #>
              :options-map="((item: <#=Foreign_Table_Up#>Model) => {
                return {
                  label: item.<#=foreignKey.lbl#>,
                  value: item.<#=foreignKey.column#>,
                };
              })"<#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #><#
              if (foreignKey.multiple) {
              #>
              multiple<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #><#
              if (mod === "base" && table === "usr" && column_name === "default_org_id") {
              #>
              @change="old_default_org_id = dialogModel.default_org_id;"<#
              }
              #><#
              if (mod === "cron" && table === "cron_job" && column_name === "job_id") {
              #>
              @change="onJobId"<#
              }
              #>
            ><#
              if (foreignKey.hasSelectAdd) {
              #>
              <template
                v-if="<#=foreignSchema.opts.table#>Permit('add')"
                #footer
              >
                <div
                  un-flex="~"
                  un-justify-center
                >
                  <el-button
                    plain
                    @click="<#=column_name#>OpenAddDialog"
                  ><#
                    if (isUseI18n) {
                    #>
                    {{ ns("新增") }}{{ ns("<#=foreignSchema.opts.table_comment#>") }}<#
                    } else {
                    #>
                    新增<#=foreignSchema.opts.table_comment#><#
                    }
                    #>
                  </el-button>
                </div>
              </template>
            <#
            }
          #></CustomSelect><#
            } else if (foreignKey && foreignKey.selectType === "selectInput") {
              if (!selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
                selectInputForeign_Table_Ups.push(Foreign_Table_Up);
              }
            #>
            <SelectInput<#=Foreign_Table_Up#><#
              if (foreignKey.multiple) {
              #>
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? [ ]"<#
              }
              #>
              v-model="dialogModel.<#=column_name#>"<#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #><#
              if (foreignKey.multiple) {
              #>
              multiple<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #>
              @validate-field="() => formRef?.validateField('<#=column_name#>')"
            ></SelectInput<#=Foreign_Table_Up#>><#
            } else if (foreignSchema && foreignSchema.opts?.list_tree
              && !foreignSchema.opts?.ignoreCodegen
              && !foreignSchema.opts?.onlyCodegenDeno
            ) {
            #>
            <CustomTreeSelect
              v-model="dialogModel.<#=column_name#>"<#
              if (foreignKey.multiple) {
              #>
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? [ ]"<#
              }
              #>
              :method="get<#=Foreign_Table_Up#>Tree"<#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #><#
              if (foreignKey.lbl !== "lbl") {
              #>
              :props="{
                label: '<#=foreignKey.lbl#>',
                children: 'children',
              }"<#
              }
              #><#
              if (foreignKey.multiple) {
              #>
              multiple<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #><#
              if (mod === "base" && table === "data_permit" && column_name === "menu_id") {
              #>
              :props="{
                label: 'lbl',
                children: 'children',
                disabled: function(item: TreeNodeData) {
                  return !item.route_path;
                },
              }"
              :filter-node-method="useMenuTreeFilter"<#
              }
              #>
            ></CustomTreeSelect><#
            } else if (column.dict) {
            #>
            <DictSelect
              v-model="dialogModel.<#=column_name#>"<#
              if (modelLabel) {
              #>
              v-model:model-label="dialogModel.<#=modelLabel#>"<#
              }
              #>
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? undefined"
              code="<#=column.dict#>"<#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #><#
              if (column.dictHasSelectAdd) {
              #>
              :has-select-add="true"<#
              }
              #>
            ></DictSelect><#
            } else if (column.dictbiz) {
            #>
            <DictbizSelect
              v-model="dialogModel.<#=column_name#>"<#
              if (modelLabel) {
              #>
              v-model:model-label="dialogModel.<#=modelLabel#>"<#
              }
              #>
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? undefined"
              code="<#=column.dictbiz#>"<#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #><#
              if (column.dictHasSelectAdd) {
              #>
              :has-select-add="true"<#
              }
              #>
            ></DictbizSelect><#
            } else if (data_type === "datetime" || data_type === "date") {
            #>
            <CustomDatePicker
              v-model="dialogModel.<#=column_name#>"<#
              if (data_type === "datetime") {
              #>
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"<#
              } else if (data_type === "date" && !column.isMonth) {
              #>
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"<#
              } else if (column.isMonth) {
              #>
              type="month"
              format="YYYY-MM"
              value-format="YYYY-MM-DD"<#
              }
              #><#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #>
            ></CustomDatePicker><#
            } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
            #>
            <CustomCheckbox
              v-model="dialogModel.<#=column_name#>"<#
              if (isUseI18n) {
              #>
              :true-readonly-label="`${ ns('是') }`"
              :false-readonly-label="`${ ns('否') }`"<#
              } else {
              #>
              true-readonly-label="是"
              false-readonly-label="否"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #>
            >
              <#=column_comment#>
            </CustomCheckbox><#
            } else if (column_type.startsWith("int")) {
            #>
            <CustomInputNumber
              v-model="dialogModel.<#=column_name#>"<#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请输入 <#=column_comment#>"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #>
            ></CustomInputNumber><#
            } else if (column.DATA_TYPE === "decimal") {
              let arr = JSON.parse("["+column_type.substring(column_type.indexOf("(")+1, column_type.lastIndexOf(")"))+"]");
              let precision = Number(arr[1]);
              let max = "";
              if (column.max != null) {
                max = column.max;
              } else {
                for (let m = 0; m < Number(arr[0])-precision; m++) {
                  max += "9";
                }
                max = Number(max)+1-Math.pow(10, -precision);
              }
              let min = column.min;
            #>
            <CustomInputNumber
              v-model="dialogModel.<#=column_name#>"
              :max="<#=max#>"<#
                if (min) {
              #>
              :min="<#=min#>"<#
                }
              #>
              :precision="<#=precision#>"<#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请输入 <#=column_comment#>"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #>
            ></CustomInputNumber><#
            } else if (column.isAtt) {
            #>
            <LinkAtt
              v-model="dialogModel.<#=column_name#>"<#
              if (column.attMaxSize > 1) {
              #>
              :max-size="<#=column.attMaxSize#>"<#
              }
              #><#
              if (column.maxFileSize) {
              #>
              :maxFileSize="<#=column.maxFileSize#>"<#
              }
              #><#
              if (column.attAccept) {
              #>
              accept="<#=column.attAccept#>"<#
              }
              #><#
              if (column.isPublicAtt) {
              #>
              :is-public="true"<#
              } else {
              #>
              :is-public="false"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #>
              un-m="l-1"
            ></LinkAtt><#
            } else if (column.isColorPicker) {
            #>
            <CustomColorPicker
              v-model="dialogModel.<#=column_name#>"<#
              if (column.isColorShowAlpha) {
              #>
              show-alpha<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #>
            ></CustomColorPicker><#
            } else if (column.isCountyLbl) {
            #>
            <CustomCityPicker
              v-model="<#=column_name#>_city_picker"<#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请选择 <#=column_comment#>"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #>
            ></CustomCityPicker><#
            } else {
            #>
            <CustomInput
              v-model="dialogModel.<#=column_name#>"<#
              if (isPassword) {
              #>
              type="password"
              show-password<#
              }
              #><#
              if (column.isTextarea) {
              #>
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"<#
              }
              #><#
              if (isUseI18n) {
              #>
              :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
              } else {
              #>
              placeholder="请输入 <#=column_comment#>"<#
              }
              #><#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly<#
                if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                #> || !!dialogModel.is_sys<#
                }
                #>"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #><#
              if (isUseI18n) {
              #>
              :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
              } else {
              #>
              :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
              }
              #><#
              }
              #><#
              if (mod === "cron" && table === "cron_job" && column_name === "cron") {
              #>
              :title="cron_lbl"<#
              }
              #><#
              if (column.isTextarea) {
              #>
              @keyup.enter.stop<#
              }
              #>
            ></CustomInput><#
            }
            #>
          </el-form-item>
        </template><#
        }
        #>
        
      </el-form><#
      if (hasInlineForeignTabs) {
      #>
      <div
        un-w="full"
        un-flex="~ [1_0_0] col"
        un-overflow-hidden
        un-min="h-100"
      >
        <el-tabs
          v-model="inlineForeignTabLabel"
          class="el-flex-tabs"
          type="card"
        ><#
          for (const inlineForeignTab of inlineForeignTabs) {
            const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
            const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
            const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
            const table = inlineForeignTab.table;
            const mod = inlineForeignTab.mod;
            if (!inlineForeignSchema) {
              throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
              process.exit(1);
            }
            const opts = inlineForeignSchema.opts;
            const inline_column_name = inlineForeignTab.column_name;
            const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
          #><#
            if (inline_foreign_type === "one2many") {
          #>
          
          <el-tab-pane
            label="<#=inlineForeignTab.label#>"
            name="<#=inlineForeignTab.label#>"
            un-flex="~ [1_0_0] col"
            un-overflow-hidden
          >
            <el-table
              ref="<#=inline_column_name#>Ref"
              un-m="t-2"
              size="small"
              height="100%"
              :data="<#=inline_column_name#>Data"
              class="tr_border_none"
            >
              
              <el-table-column
                prop="_seq"<#
                if (isUseI18n) {
                #>
                :label="ns('序号')"<#
                } else {
                #>
                label="序号"<#
                }
                #>
                align="center"
                width="80"
              >
              </el-table-column><#
              for (let i = 0; i < columns.length; i++) {
                const column = columns[i];
                if (column.ignoreCodegen) continue;
                if (column.onlyCodegenDeno) continue;
                if (column.noAdd && column.noEdit) continue;
                if (column.isAtt) continue;
                const column_name = column.COLUMN_NAME;
                if (column_name === "id") continue;
                if (column_name === "is_deleted") continue;
                if (column_name === "is_locked") continue;
                if (column_name === "version") continue;
                if (column_name === "order_by") continue;
                if (column_name === "tenant_id") continue;
                const data_type = column.DATA_TYPE;
                let column_type = column.COLUMN_TYPE;
                const column_comment = column.COLUMN_COMMENT || "";
                let require = column.require;
                const foreignKey = column.foreignKey;
                if (foreignKey && foreignKey.showType === "dialog") {
                  continue;
                }
                const foreignTable = foreignKey && foreignKey.table;
                const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
                const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
                  return item.substring(0, 1).toUpperCase() + item.substring(1);
                }).join("");
                if (column_type == null) {
                  column_type = "";
                }
                let foreignSchema = undefined;
                if (foreignKey) {
                  foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
                }
                const width = (column.width || 180) + 38;
                const readonlyPlaceholder = column.readonlyPlaceholder;
                const modelLabel = column.modelLabel;
                const isPassword = column.isPassword;
              #>
              
              <el-table-column<#
                if (column.noAdd === true) {
                #>
                v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
                }
                #>
                prop="<#=column_name#>"<#
                if (isUseI18n) {
                #>
                :label="n('<#=column_comment#>')"<#
                } else {
                #>
                label="<#=column_comment#>"<#
                }
                #>
                width="<#=width#>"
                header-align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'add'"><#
                    if (column.isImg) {
                    #><#
                    } else if (
                      foreignKey
                      && (foreignKey.selectType === "select" || foreignKey.selectType == null)
                      && !foreignSchema?.opts?.list_tree
                    ) {
                    #>
                    <CustomSelect
                      v-model="row.<#=column_name#>"<#
                      if (foreignKey.multiple) {
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? [ ]"<#
                      }
                      #><#
                      if (modelLabel) {
                      #>
                      v-model:model-label="row.<#=modelLabel#>"<#
                      }
                      #>
                      :method="get<#=Foreign_Table_Up#>List"
                      :options-map="((item: <#=Foreign_Table_Up#>Model) => {
                        return {
                          label: item.<#=foreignKey.lbl#>,
                          value: item.<#=foreignKey.column#>,
                        };
                      })"
                      placeholder=" "<#
                      if (foreignKey.multiple) {
                      #>
                      multiple<#
                      }
                      #><#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomSelect><#
                    } else if (foreignKey && foreignKey.selectType === "selectInput") {
                      if (!selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
                        selectInputForeign_Table_Ups.push(Foreign_Table_Up);
                      }
                    #>
                    <SelectInput<#=Foreign_Table_Up#><#
                      if (foreignKey.multiple) {
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? [ ]"<#
                      }
                      #>
                      v-model="row.<#=column_name#>"
                      placeholder=" "<#
                      if (foreignKey.multiple) {
                      #>
                      multiple<#
                      }
                      #><#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                      @validate-field="() => formRef?.validateField('<#=column_name#>')"
                    >
                    </SelectInput<#=Foreign_Table_Up#>><#
                    } else if (foreignSchema && foreignSchema.opts?.list_tree
                      && !foreignSchema.opts?.ignoreCodegen
                      && !foreignSchema.opts?.onlyCodegenDeno
                    ) {
                    #>
                    <CustomTreeSelect<#
                      if (foreignKey.multiple) {
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? [ ]"<#
                      }
                      #>
                      v-model="row.<#=column_name#>"
                      :method="get<#=Foreign_Table_Up#>Tree"<#
                      if (isUseI18n) {
                      #>
                      :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
                      } else {
                      #>
                      placeholder="请选择 <#=column_comment#>"<#
                      }
                      #><#
                      if (foreignKey.lbl !== "lbl") {
                      #>
                      :props="{
                        label: '<#=foreignKey.lbl#>',
                        children: 'children',
                      }"<#
                      }
                      #><#
                      if (foreignKey.multiple) {
                      #>
                      multiple<#
                      }
                      #><#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomTreeSelect><#
                    } else if (column.dict) {
                    #>
                    <DictSelect
                      v-model="row.<#=column_name#>"<#
                      if (modelLabel) {
                      #>
                      v-model:model-label="row.<#=modelLabel#>"<#
                      }
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? undefined"
                      code="<#=column.dict#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #><#
                      if (column.dictHasSelectAdd) {
                      #>
                      :has-select-add="true"<#
                      }
                      #>
                    ></DictSelect><#
                    } else if (column.dictbiz) {
                    #>
                    <DictbizSelect
                      v-model="row.<#=column_name#>"<#
                      if (modelLabel) {
                      #>
                      v-model:model-label="row.<#=modelLabel#>"<#
                      }
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? undefined"
                      code="<#=column.dictbiz#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #><#
                      if (column.dictHasSelectAdd) {
                      #>
                      :has-select-add="true"<#
                      }
                      #>
                    ></DictbizSelect><#
                    } else if (data_type === "datetime" || data_type === "date") {
                    #>
                    <CustomDatePicker
                      v-model="row.<#=column_name#>"<#
                      if (data_type === "datetime") {
                      #>
                      type="datetime"
                      format="YYYY-MM-DD HH:mm:ss"
                      value-format="YYYY-MM-DDTHH:mm:ss"<#
                      } else if (data_type === "date" && !column.isMonth) {
                      #>
                      type="date"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"<#
                      } else if (column.isMonth) {
                      #>
                      type="month"
                      format="YYYY-MM"
                      value-format="YYYY-MM-DD"<#
                      }
                      #>
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                       #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomDatePicker><#
                    } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
                    #>
                    <CustomCheckbox
                      v-model="row.<#=column_name#>"<#
                      if (isUseI18n) {
                      #>
                      :true-readonly-label="`${ ns('是') }`"
                      :false-readonly-label="`${ ns('否') }`"<#
                      } else {
                      #>
                      true-readonly-label="是"
                      false-readonly-label="否"<#
                      }
                      #><#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    >
                      <#=column_comment#>
                    </CustomCheckbox><#
                    } else if (column_type.startsWith("int")) {
                    #>
                    <CustomInputNumber
                      v-model="row.<#=column_name#>"
                      un-text="<#=column.align || 'right'#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomInputNumber><#
                    } else if (column.DATA_TYPE === "decimal") {
                      let arr = JSON.parse("["+column_type.substring(column_type.indexOf("(")+1, column_type.lastIndexOf(")"))+"]");
                      let precision = Number(arr[1]);
                      let max = "";
                      if (column.max != null) {
                        max = column.max;
                      } else {
                        for (let m = 0; m < Number(arr[0])-precision; m++) {
                          max += "9";
                        }
                        max = Number(max)+1-Math.pow(10, -precision);
                      }
                      let min = column.min;
                    #>
                    <CustomInputNumber
                      v-model="row.<#=column_name#>"
                      :max="<#=max#>"<#
                        if (min) {
                      #>
                      :min="<#=min#>"<#
                        }
                      #>
                      :precision="<#=precision#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomInputNumber><#
                    } else {
                    #>
                    <CustomInput<#
                      if (isPassword) {
                      #>
                      type="password"
                      show-password<#
                      }
                      #>
                      v-model="row.<#=column_name#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomInput><#
                    }
                    #>
                  </template>
                </template>
              </el-table-column><#
              }
              #>
              
              <el-table-column
                v-if="!isLocked &&
                  !isReadonly &&
                  <#=inline_column_name#>Data.some((item) => item._type === 'add'<#
                  if (hasIsSys) {
                  #> || !item.is_sys<#
                  }
                  #>)
                "
                prop="_operation"<#
                if (isUseI18n) {
                #>
                :label="ns('操作')"<#
                } else {
                #>
                label="操作"<#
                }
                #>
                width="90"
                align="center"
                fixed="right"
              >
                <template #default="{ row }">
                  
                  <el-button
                    v-if="row._type === 'add'"
                    size="small"
                    plain
                    type="primary"
                    @click="<#=inline_column_name#>Add"
                  ><#
                    if (isUseI18n) {
                    #>
                    {{ ns('新增') }}<#
                    } else {
                    #>
                    新增<#
                    }
                    #>
                  </el-button><#
                  if (!opts?.noDelete) {
                  #>
                  
                  <el-button
                    v-else<#
                    if (hasIsSys) {
                    #>-if="!row.is_sys"<#
                    }
                    #>
                    size="small"
                    plain
                    type="danger"
                    @click="<#=inline_column_name#>Remove(row)"
                  ><#
                    if (isUseI18n) {
                    #>
                    {{ ns('删除') }}<#
                    } else {
                    #>
                    删除<#
                    }
                    #>
                  </el-button><#
                  }
                  #>
                  
                </template>
              </el-table-column>
              
            </el-table>
          </el-tab-pane><#
            } else if (inline_foreign_type === "one2one") {
          #>
          
          <el-tab-pane
            label="<#=inlineForeignTab.label#>"
            name="<#=inlineForeignTab.label#>"
            un-flex="~ [1_0_0] col"
            un-overflow-hidden
          >
            <div
              v-if="dialogModel.<#=inline_column_name#>"
              un-flex="~ [1_0_0] col basis-[inherit]"
              un-overflow-auto
              un-p="x-8 y-5"
              un-box-border
              un-gap="4"
              un-justify-start
              un-items-start
            ><#
            let columnNum = 0;
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              if (column.noAdd && column.noEdit) continue;
              if (column.isAtt) continue;
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
            #>
              <el-form
                ref="formRef"
                size="default"
                label-width="auto"
                
                un-grid="~ cols-[repeat(<#=detailFormCols#>,<#=detailFormWidth#>)]"
                un-gap="x-2 y-4"
                un-justify-items-end
                un-items-center
                
                :model="dialogModel"
                :rules="form_rules"
                :validate-on-rule-change="false"
                
                @submit.prevent
              ><#
                // const selectInputForeign_Table_Ups = [ ];
                for (let i = 0; i < columns.length; i++) {
                  const column = columns[i];
                  if (column.ignoreCodegen) continue;
                  if (column.onlyCodegenDeno) continue;
                  if (column.noAdd && column.noEdit) continue;
                  if (column.isAtt) continue;
                  const column_name = column.COLUMN_NAME;
                  if (column_name === "id") continue;
                  if (column_name === "is_locked") continue;
                  if (column_name === "is_deleted") continue;
                  if (column_name === "version") continue;
                  if (column_name === "tenant_id") continue;
                  const data_type = column.DATA_TYPE;
                  const column_type = column.COLUMN_TYPE || "";
                  const column_comment = column.COLUMN_COMMENT || "";
                  const require = column.require;
                  const foreignKey = column.foreignKey;
                  if (foreignKey && foreignKey.showType === "dialog") {
                    continue;
                  }
                  const foreignTable = foreignKey && foreignKey.table;
                  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
                  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
                    return item.substring(0, 1).toUpperCase() + item.substring(1);
                  }).join("");
                  let vIf = [ ];
                  if (column.noAdd) {
                    vIf.push("dialogAction !== 'add'");
                  }
                  if (column.noEdit) {
                    vIf.push("dialogAction !== 'edit'");
                  }
                  const vIfStr = vIf.join(" && ");
                  let foreignSchema = undefined;
                  if (foreignKey) {
                    foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
                  }
                  if (
                    [
                      "is_default",
                    ].includes(column_name)
                  ) {
                    continue;
                  }
                  const readonlyPlaceholder = column.readonlyPlaceholder;
                  const modelLabel = column.modelLabel;
                  if (column.inlineMany2manyTab) continue;
                  const isPassword = column.isPassword;
                #>
                
                <el-form-item<#
                  if (isUseI18n) {
                  #>
                  :label="n('<#=column_comment#>')"<#
                  } else {
                  #>
                  label="<#=column_comment#>"<#
                  }
                  #>
                  prop="<#=inline_column_name#>.<#=column_name#>"<#
                  if (
                    (column.isTextarea && detailFormCols > 1) ||
                    (column.isImg && detailFormCols > 1 && column.attMaxSize > 1)
                  ) {
                  #>
                  un-grid="col-span-full"<#
                  }
                  #>
                ><#
                  if (column.isImg) {
                  #>
                  <UploadImage
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"
                    db="<#=table_name#>.<#=column_name#>"<#
                    if (column.attMaxSize > 1) {
                    #>
                    :max-size="<#=column.attMaxSize#>"<#
                    }
                    #><#
                    if (column.maxFileSize) {
                    #>
                    :max-file-size="<#=column.maxFileSize#>"<#
                    }
                    #><#
                    if (column.attAccept) {
                    #>
                    accept="<#=column.attAccept#>"<#
                    }
                    #><#
                    if (column.isPublicAtt) {
                    #>
                    :is-public="true"<#
                    } else {
                    #>
                    :is-public="false"<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #>
                    :page-inited="inited"
                  ></UploadImage><#
                  } else if (
                    foreignKey
                    && (foreignKey.selectType === "select" || foreignKey.selectType == null)
                    && !foreignSchema?.opts?.list_tree
                  ) {
                  #>
                  <CustomSelect<#
                    if (mod === "base" && table === "usr" && column_name === "default_org_id") {
                    #>
                    ref="default_org_idRef"<#
                    }
                    #><#
                    if (foreignKey.hasSelectAdd && !(mod === "base" && table === "usr" && column_name === "default_org_id")) {
                    #>
                    ref="<#=column_name#>Ref"<#
                    }
                    #>
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"<#
                    if (modelLabel) {
                    #>
                    v-model:model-label="dialogModel.<#=inline_column_name#>.<#=modelLabel#>"<#
                    }
                    #><#
                    if (foreignKey.multiple) {
                    #>
                    :set="dialogModel.<#=inline_column_name#>.<#=column_name#> = dialogModel.<#=inline_column_name#>.<#=column_name#> ?? [ ]"<#
                    }
                    #><#
                    if (mod === "base" && table === "usr" && column_name === "default_org_id") {
                    #>
                    :init="false"
                    :method="getOrgListApi"<#
                    } else {
                    #>
                    :method="get<#=Foreign_Table_Up#>List"<#
                    }
                    #>
                    :options-map="((item: <#=Foreign_Table_Up#>Model) => {
                      return {
                        label: item.<#=foreignKey.lbl#>,
                        value: item.<#=foreignKey.column#>,
                      };
                    })"<#
                    if (isUseI18n) {
                    #>
                    :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
                    } else {
                    #>
                    placeholder="请选择 <#=column_comment#>"<#
                    }
                    #><#
                    if (foreignKey.multiple) {
                    #>
                    multiple<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #><#
                    if (mod === "base" && table === "usr" && column_name === "default_org_id") {
                    #>
                    @change="old_default_org_id = dialogModel.<#=inline_column_name#>.default_org_id;"<#
                    }
                    #><#
                    if (mod === "cron" && table === "cron_job" && column_name === "job_id") {
                    #>
                    @change="onJobId"<#
                    }
                    #>
                  ><#
                    if (foreignKey.hasSelectAdd) {
                    #>
                    <template
                      v-if="<#=foreignSchema.opts.table#>Permit('add')"
                      #footer
                    >
                      <div
                        un-flex="~"
                        un-justify-center
                      >
                        <el-button
                          plain
                          @click="<#=column_name#>OpenAddDialog"
                        ><#
                          if (isUseI18n) {
                          #>
                          {{ ns("新增") }} {{ ns("<#=foreignSchema.opts.table_comment#>") }}<#
                          } else {
                          #>
                          新增 <#=foreignSchema.opts.table_comment#><#
                          }
                          #>
                        </el-button>
                      </div>
                    </template>
                  <#
                  }
                #></CustomSelect><#
                  } else if (foreignKey && foreignKey.selectType === "selectInput") {
                    if (!selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
                      selectInputForeign_Table_Ups.push(Foreign_Table_Up);
                    }
                  #>
                  <SelectInput<#=Foreign_Table_Up#><#
                    if (foreignKey.multiple) {
                    #>
                    :set="dialogModel.<#=inline_column_name#>.<#=column_name#> = dialogModel.<#=inline_column_name#>.<#=column_name#> ?? [ ]"<#
                    }
                    #>
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"<#
                    if (isUseI18n) {
                    #>
                    :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
                    } else {
                    #>
                    placeholder="请选择 <#=column_comment#>"<#
                    }
                    #><#
                    if (foreignKey.multiple) {
                    #>
                    multiple<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #>
                    @validate-field="() => formRef?.validateField('<#=column_name#>')"
                  ></SelectInput<#=Foreign_Table_Up#>><#
                  } else if (foreignSchema && foreignSchema.opts?.list_tree
                    && !foreignSchema.opts?.ignoreCodegen
                    && !foreignSchema.opts?.onlyCodegenDeno
                  ) {
                  #>
                  <CustomTreeSelect<#
                    if (foreignKey.multiple) {
                    #>
                    :set="dialogModel.<#=inline_column_name#>.<#=column_name#> = dialogModel.<#=inline_column_name#>.<#=column_name#> ?? [ ]"<#
                    }
                    #>
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"
                    :method="get<#=Foreign_Table_Up#>Tree"<#
                    if (isUseI18n) {
                    #>
                    :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
                    } else {
                    #>
                    placeholder="请选择 <#=column_comment#>"<#
                    }
                    #><#
                    if (foreignKey.lbl !== "lbl") {
                    #>
                    :props="{
                      label: '<#=foreignKey.lbl#>',
                      children: 'children',
                    }"<#
                    }
                    #><#
                    if (foreignKey.multiple) {
                    #>
                    multiple<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #><#
                    if (mod === "base" && table === "data_permit" && column_name === "menu_id") {
                    #>
                    :props="{
                      label: 'lbl',
                      children: 'children',
                      disabled: function(item: MenuModel) {
                        return !item.route_path;
                      },
                    }"
                    :filter-node-method="useMenuTreeFilter"<#
                    }
                    #>
                  ></CustomTreeSelect><#
                  } else if (column.dict) {
                  #>
                  <DictSelect
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"<#
                    if (modelLabel) {
                    #>
                    v-model:model-label="dialogModel.<#=inline_column_name#>.<#=modelLabel#>"<#
                    }
                    #>
                    :set="dialogModel.<#=inline_column_name#>.<#=column_name#> = dialogModel.<#=inline_column_name#>.<#=column_name#> ?? undefined"
                    code="<#=column.dict#>"<#
                    if (isUseI18n) {
                    #>
                    :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
                    } else {
                    #>
                    placeholder="请选择 <#=column_comment#>"<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #><#
                    if (column.dictHasSelectAdd) {
                    #>
                    :has-select-add="true"<#
                    }
                    #>
                  ></DictSelect><#
                  } else if (column.dictbiz) {
                  #>
                  <DictbizSelect
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"<#
                    if (modelLabel) {
                    #>
                    v-model:model-label="dialogModel.<#=inline_column_name#>.<#=modelLabel#>"<#
                    }
                    #>
                    :set="dialogModel.<#=inline_column_name#>.<#=column_name#> = dialogModel.<#=inline_column_name#>.<#=column_name#> ?? undefined"
                    code="<#=column.dictbiz#>"<#
                    if (isUseI18n) {
                    #>
                    :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
                    } else {
                    #>
                    placeholder="请选择 <#=column_comment#>"<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #><#
                    if (column.dictHasSelectAdd) {
                    #>
                    :has-select-add="true"<#
                    }
                    #>
                  ></DictbizSelect><#
                  } else if (data_type === "datetime" || data_type === "date") {
                  #>
                  <CustomDatePicker
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"<#
                    if (data_type === "datetime") {
                    #>
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DDTHH:mm:ss"<#
                    } else if (data_type === "date" && !column.isMonth) {
                    #>
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"<#
                    } else if (column.isMonth) {
                    #>
                    type="month"
                    format="YYYY-MM"
                    value-format="YYYY-MM-DD"<#
                    }
                    #><#
                    if (isUseI18n) {
                    #>
                    :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
                    } else {
                    #>
                    placeholder="请选择 <#=column_comment#>"<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #>
                  ></CustomDatePicker><#
                  } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
                  #>
                  <CustomCheckbox
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"<#
                    if (isUseI18n) {
                    #>
                    :true-readonly-label="`${ ns('是') }`"
                    :false-readonly-label="`${ ns('否') }`"<#
                    } else {
                    #>
                    true-readonly-label="是"
                    false-readonly-label="否"<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #>
                  >
                    <#=column_comment#>
                  </CustomCheckbox><#
                  } else if (column_type.startsWith("int")) {
                  #>
                  <CustomInputNumber
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"<#
                    if (isUseI18n) {
                    #>
                    :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
                    } else {
                    #>
                    placeholder="请输入 <#=column_comment#>"<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #>
                  ></CustomInputNumber><#
                  } else if (column.DATA_TYPE === "decimal") {
                    let arr = JSON.parse("["+column_type.substring(column_type.indexOf("(")+1, column_type.lastIndexOf(")"))+"]");
                    let precision = Number(arr[1]);
                    let max = "";
                    if (column.max != null) {
                      max = column.max;
                    } else {
                      for (let m = 0; m < Number(arr[0])-precision; m++) {
                        max += "9";
                      }
                      max = Number(max)+1-Math.pow(10, -precision);
                    }
                    let min = column.min;
                  #>
                  <CustomInputNumber
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"
                    :max="<#=max#>"<#
                      if (min) {
                    #>
                    :min="<#=min#>"<#
                      }
                    #>
                    :precision="<#=precision#>"<#
                    if (isUseI18n) {
                    #>
                    :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
                    } else {
                    #>
                    placeholder="请输入 <#=column_comment#>"<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #>
                  ></CustomInputNumber><#
                  } else {
                  #>
                  <CustomInput<#
                    if (isPassword) {
                    #>
                    type="password"
                    show-password<#
                    }
                    #>
                    v-model="dialogModel.<#=inline_column_name#>.<#=column_name#>"<#
                    if (column.isTextarea) {
                    #>
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 5 }"
                    @keyup.enter.stop<#
                    }
                    #><#
                    if (isUseI18n) {
                    #>
                    :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
                    } else {
                    #>
                    placeholder="请输入 <#=column_comment#>"<#
                    }
                    #><#
                    if (column.readonly) {
                    #>
                    :readonly="true"<#
                    } else {
                    #>
                    :readonly="isLocked || isReadonly<#
                      if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                      #> || !!dialogModel.is_sys<#
                      }
                      #>"<#
                    }
                    #><#
                    if (readonlyPlaceholder) {
                    #><#
                    if (isUseI18n) {
                    #>
                    :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                    } else {
                    #>
                    :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                    }
                    #><#
                    }
                    #><#
                    if (mod === "cron" && table === "cron_job" && column_name === "cron") {
                    #>
                    :title="cron_lbl"<#
                    }
                    #>
                  ></CustomInput><#
                  }
                  #>
                </el-form-item><#
                }
                #>
                
              </el-form>
            </div>
          </el-tab-pane><#
            }
          #><#
          }
          #>
          
        </el-tabs>
      </div><#
      }
      #><#
      let inlineMany2manyTabLabel = "";
      if (hasInlineMany2manyTab) {
      #>
      <div
        un-w="full"
        un-flex="~ [1_0_0] col"
        un-overflow-hidden
        un-min="h-100"
      >
        <el-tabs
          v-model="inlineMany2manyTabLabel"
          class="el-flex-tabs"
          type="card"
        ><#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            const column_name = column.COLUMN_NAME;
            const column_comment = column.COLUMN_COMMENT;
            let is_nullable = column.IS_NULLABLE === "YES";
            const foreignKey = column.foreignKey;
            const foreignTable = foreignKey && foreignKey.table;
            const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
            const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
              return item.substring(0, 1).toUpperCase() + item.substring(1);
            }).join("");
            let data_type = column.DATA_TYPE;
            const many2many = column.many2many;
            if (!many2many || !foreignKey) continue;
            if (!column.inlineMany2manyTab) continue;
            const table = many2many.table;
            const mod = many2many.mod;
            const inlineMany2manySchema = optTables[mod + "_" + table];
            if (!inlineMany2manySchema) {
              throw new Error(`表: ${ mod }_${ table } 不存在`);
              process.exit(1);
            }
            const opts = inlineMany2manySchema.opts;
            const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
            const Table_Up = tableUp.split("_").map(function(item) {
              return item.substring(0, 1).toUpperCase() + item.substring(1);
            }).join("");
            const inlineMany2manyColumns = inlineMany2manySchema.columns;
            if (inlineMany2manyTabLabel === "") {
              inlineMany2manyTabLabel = column_name;
            }
            const hasIsSys = inlineMany2manyColumns.some((column) => column.COLUMN_NAME === "is_sys");
          #>
          <el-tab-pane
            label="<#=column_comment#>"
            name="<#=column_name#>"
            un-flex="~ [1_0_0] col"
            un-overflow-hidden
          >
            <el-table
              ref="<#=column_name#>_<#=table#>Ref"
              v-table-data-sortable="<#=column_name#>TableDataSortableOptions"
              un-m="t-2"
              size="default"
              height="100%"
              :data="<#=column_name#>_<#=table#>_models"
              class="inlineMany2manyTab_table"
              :cell-class-name="<#=column_name#>TableCellClassName"
            >
              
              <el-table-column
                prop="order_by"<#
                if (isUseI18n) {
                #>
                :label="ns('序号')"<#
                } else {
                #>
                label="序号"<#
                }
                #>
                align="center"
                width="52"
              >
              </el-table-column><#
              for (let i = 0; i < inlineMany2manyColumns.length; i++) {
                const column = inlineMany2manyColumns[i];
                if (column.ignoreCodegen) continue;
                if (column.onlyCodegenDeno) continue;
                if (column.noAdd && column.noEdit) continue;
                if (column.isAtt) continue;
                const column_name = column.COLUMN_NAME;
                if (column_name === "id") continue;
                if (column_name === "is_deleted") continue;
                if (column_name === "is_locked") continue;
                if (column_name === "version") continue;
                if (column_name === "order_by") continue;
                if (column_name === "tenant_id") continue;
                const data_type = column.DATA_TYPE;
                const column_type = column.COLUMN_TYPE || "";
                const column_comment = column.COLUMN_COMMENT || "";
                const require = column.require;
                const foreignKey = column.foreignKey;
                if (foreignKey && foreignKey.showType === "dialog") {
                  continue;
                }
                const foreignTable = foreignKey && foreignKey.table;
                const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
                const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
                  return item.substring(0, 1).toUpperCase() + item.substring(1);
                }).join("");
                let foreignSchema = undefined;
                if (foreignKey) {
                  foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
                }
                const width = (column.width || 180) + 38;
                const readonlyPlaceholder = column.readonlyPlaceholder;
                const modelLabel = column.modelLabel;
                if (many2many.column1 === column_name) {
                  continue;
                }
                const isPassword = column.isPassword;
              #><#
                if (many2many.column2 !== column_name) {
              #>
              
              <el-table-column<#
                if (column.noAdd === true) {
                #>
                v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
                }
                #>
                prop="<#=column_name#>"<#
                if (isUseI18n) {
                #>
                :label="n('<#=column_comment#>')"<#
                } else {
                #>
                label="<#=column_comment#>"<#
                }
                #>
                width="<#=width#>"
                header-align="center"
              >
                <template #default="{ row }">
                  <template v-if="row._type !== 'select'"><#
                    if (column.isImg) {
                    #><#
                    } else if (
                      foreignKey
                      && (foreignKey.selectType === "select" || foreignKey.selectType == null)
                      && !foreignSchema?.opts?.list_tree
                    ) {
                    #>
                    <CustomSelect
                      v-model="row.<#=column_name#>"<#
                      if (foreignKey.multiple) {
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? [ ]"<#
                      }
                      #><#
                      if (modelLabel) {
                      #>
                      v-model:model-label="row.<#=modelLabel#>"<#
                      }
                      #>
                      :method="get<#=Foreign_Table_Up#>List"
                      :options-map="((item: <#=Foreign_Table_Up#>Model) => {
                        return {
                          label: item.<#=foreignKey.lbl#>,
                          value: item.<#=foreignKey.column#>,
                        };
                      })"
                      placeholder=" "<#
                      if (foreignKey.multiple) {
                      #>
                      multiple<#
                      }
                      #><#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomSelect><#
                    } else if (foreignKey && foreignKey.selectType === "selectInput") {
                      if (!selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
                        selectInputForeign_Table_Ups.push(Foreign_Table_Up);
                      }
                    #>
                    <SelectInput<#=Foreign_Table_Up#><#
                      if (foreignKey.multiple) {
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? [ ]"<#
                      }
                      #>
                      v-model="row.<#=column_name#>"
                      placeholder=" "<#
                      if (foreignKey.multiple) {
                      #>
                      multiple<#
                      }
                      #><#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                      @validate-field="() => formRef?.validateField('<#=column_name#>')"
                    >
                    </SelectInput<#=Foreign_Table_Up#>><#
                    } else if (foreignSchema && foreignSchema.opts?.list_tree
                      && !foreignSchema.opts?.ignoreCodegen
                      && !foreignSchema.opts?.onlyCodegenDeno
                    ) {
                    #>
                    <CustomTreeSelect<#
                      if (foreignKey.multiple) {
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? [ ]"<#
                      }
                      #>
                      v-model="row.<#=column_name#>"
                      :method="get<#=Foreign_Table_Up#>Tree"<#
                      if (isUseI18n) {
                      #>
                      :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
                      } else {
                      #>
                      placeholder="请选择 <#=column_comment#>"<#
                      }
                      #><#
                      if (foreignKey.lbl !== "lbl") {
                      #>
                      :props="{
                        label: '<#=foreignKey.lbl#>',
                        children: 'children',
                      }"<#
                      }
                      #><#
                      if (foreignKey.multiple) {
                      #>
                      multiple<#
                      }
                      #><#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomTreeSelect><#
                    } else if (column.dict) {
                    #>
                    <DictSelect
                      v-model="row.<#=column_name#>"<#
                      if (modelLabel) {
                      #>
                      v-model:model-label="row.<#=modelLabel#>"<#
                      }
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? undefined"
                      code="<#=column.dict#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #><#
                      if (column.dictHasSelectAdd) {
                      #>
                      :has-select-add="true"<#
                      }
                      #>
                    ></DictSelect><#
                    } else if (column.dictbiz) {
                    #>
                    <DictbizSelect
                      v-model="row.<#=column_name#>"<#
                      if (modelLabel) {
                      #>
                      v-model:model-label="row.<#=modelLabel#>"<#
                      }
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? undefined"
                      code="<#=column.dictbiz#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #><#
                      if (column.dictHasSelectAdd) {
                      #>
                      :has-select-add="true"<#
                      }
                      #>
                    ></DictbizSelect><#
                    } else if (data_type === "datetime" || data_type === "date") {
                    #>
                    <CustomDatePicker
                      v-model="row.<#=column_name#>"<#
                      if (data_type === "datetime") {
                      #>
                      type="datetime"
                      format="YYYY-MM-DD HH:mm:ss"
                      value-format="YYYY-MM-DDTHH:mm:ss"<#
                      } else if (data_type === "date" && !column.isMonth) {
                      #>
                      type="date"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"<#
                      } else if (column.isMonth) {
                      #>
                      type="month"
                      format="YYYY-MM"
                      value-format="YYYY-MM-DD"<#
                      }
                      #>
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomDatePicker><#
                    } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
                    #>
                    <CustomCheckbox
                      v-model="row.<#=column_name#>"<#
                      if (isUseI18n) {
                      #>
                      :true-readonly-label="`${ ns('是') }`"
                      :false-readonly-label="`${ ns('否') }`"<#
                      } else {
                      #>
                      true-readonly-label="是"
                      false-readonly-label="否"<#
                      }
                      #><#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    >
                      <#=column_comment#>
                    </CustomCheckbox><#
                    } else if (column_type.startsWith("int")) {
                    #>
                    <CustomInputNumber
                      v-model="row.<#=column_name#>"
                      un-text="<#=column.align || 'right'#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomInputNumber><#
                    } else if (column.DATA_TYPE === "decimal") {
                      let arr = JSON.parse("["+column_type.substring(column_type.indexOf("(")+1, column_type.lastIndexOf(")"))+"]");
                      let precision = Number(arr[1]);
                      let max = "";
                      if (column.max != null) {
                        max = column.max;
                      } else {
                        for (let m = 0; m < Number(arr[0])-precision; m++) {
                          max += "9";
                        }
                        max = Number(max)+1-Math.pow(10, -precision);
                      }
                      let min = column.min;
                    #>
                    <CustomInputNumber
                      v-model="row.<#=column_name#>"
                      :max="<#=max#>"<#
                        if (min) {
                      #>
                      :min="<#=min#>"<#
                        }
                      #>
                      :precision="<#=precision#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomInputNumber><#
                    } else {
                    #>
                    <CustomInput<#
                      if (isPassword) {
                      #>
                      type="password"
                      show-password<#
                      }
                      #>
                      v-model="row.<#=column_name#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly<#
                        if (hasIsSys && opts.sys_fields?.includes(column_name)) {
                        #> || !!row.is_sys<#
                        }
                        #>"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #><#
                      if (isUseI18n) {
                      #>
                      :readonly-placeholder="inited ? n('<#=readonlyPlaceholder#>') : ''"<#
                      } else {
                      #>
                      :readonly-placeholder="inited ? '<#=readonlyPlaceholder#>' : ''"<#
                      }
                      #><#
                      }
                      #>
                    ></CustomInput><#
                    }
                    #>
                  </template>
                </template>
              </el-table-column><#
                } else {
              #>
              
              <el-table-column<#
                if (column.noAdd === true) {
                #>
                v-if="dialogAction !== 'add' && dialogAction !== 'copy'"<#
                }
                #>
                prop="<#=column_name#>_lbl"<#
                if (isUseI18n) {
                #>
                :label="n('<#=column_comment#>')"<#
                } else {
                #>
                label="<#=column_comment#>"<#
                }
                #>
                width="<#=width#>"
                header-align="center"
                align="<#=column.align || 'center'#>"
              ></el-table-column><#
                }
              #><#
              }
              #>
              
              <el-table-column
                v-if="permit('edit') && !isLocked && !isReadonly"
                prop="_operation"<#
                if (isUseI18n) {
                #>
                :label="ns('操作')"<#
                } else {
                #>
                label="操作"<#
                }
                #>
                width="72"
                align="center"
                fixed="right"
              >
                <template #default="{ row }">
                  
                  <el-button
                    v-if="row._type === 'select'"
                    size="small"
                    plain
                    type="primary"
                    @click="<#=column_name#>Select"
                  ><#
                    if (isUseI18n) {
                    #>
                    {{ ns('选择') }}<#
                    } else {
                    #>
                    选择<#
                    }
                    #>
                  </el-button>
                  
                  <el-button
                    v-else
                    size="small"
                    plain
                    type="danger"
                    @click="<#=column_name#>Remove(row)"
                  ><#
                    if (isUseI18n) {
                    #>
                    {{ ns('删除') }}<#
                    } else {
                    #>
                    删除<#
                    }
                    #>
                  </el-button>
                  
                </template>
              </el-table-column>
              
            </el-table>
          </el-tab-pane><#
          }
          #>
          
        </el-tabs>
      </div><#
      }
      #>
    </div>
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
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('关闭') }}</span><#
        } else {
        #>
        <span>关闭</span><#
        }
        #>
      </el-button><#
      if (!opts.noAdd && opts.hideSaveAndCopy === false) {
      #>
      
      <el-button
        v-if="(dialogAction === 'add' || dialogAction === 'copy') && permit('add') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSaveAndCopy"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('保存并继续') }}</span><#
        } else {
        #>
        <span>保存并继续</span><#
        }
        #>
      </el-button><#
      }
      #><#
      if (!opts.noAdd) {
      #>
      
      <el-button
        v-if="(dialogAction === 'add' || dialogAction === 'copy') && permit('add') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('保存') }}</span><#
        } else {
        #>
        <span>保存</span><#
        }
        #>
      </el-button><#
      }
      #><#
      if (!opts.noEdit) {
      #>
      
      <el-button
        v-if="<#
        if (hasAudit) {
        #>inited && <#
        }
        #>(dialogAction === 'edit' || dialogAction === 'view') && permit('edit') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template><#
        if (isUseI18n) {
        #>
        <span>{{ ns('保存') }}</span><#
        } else {
        #>
        <span>保存</span><#
        }
        #>
      </el-button><#
      }
      #><#
      if (hasAudit) {
      #>
      
      <template
        v-if="dialogAction === 'audit' && !isLocked"
      >
        
        <el-button
          v-if="permit('audit_reject') &&
            dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Unaudited
          "
          plain
          type="danger"
          @click="onAuditReject"
        >
          <template #icon>
            <ElIconCircleClose />
          </template><#
          if (isUseI18n) {
          #>
          <span>{{ ns('审核拒绝') }}</span><#
          } else {
          #>
          <span>审核拒绝</span><#
          }
          #>
        </el-button>
        
        <el-button
          v-if="permit('audit_submit') &&
            (
              dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Unsubmited ||
              dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Rejected
            )
          "
          plain
          type="primary"
          @click="onAuditSubmit"
        >
          <template #icon>
            <ElIconCircleCheck />
          </template><#
          if (isUseI18n) {
          #>
          <span>{{ ns('审核提交') }}</span><#
          } else {
          #>
          <span>审核提交</span><#
          }
          #>
        </el-button>
        
        <el-button
          v-if="permit('audit_pass') &&
            dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Unaudited
          "
          plain
          type="primary"
          @click="onAuditPass"
        >
          <template #icon>
            <ElIconCircleCheck />
          </template><#
          if (isUseI18n) {
          #>
          <span>{{ ns('审核通过') }}</span><#
          } else {
          #>
          <span>审核通过</span><#
          }
          #>
        </el-button><#
        if (!hasReviewed) {
        #>
        
        <el-button
          v-if="permit('audit_pass') &&
            dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Audited
          "
          plain
          type="primary"
          disabled
        >
          <template #icon>
            <ElIconCircleCheck />
          </template><#
          if (isUseI18n) {
          #>
          <span>{{ ns('已审核') }}</span><#
          } else {
          #>
          <span>已审核</span><#
          }
          #>
        </el-button><#
        } else {
        #>
        
        <el-button
          v-if="permit('audit_review') &&
            dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Audited
          "
          plain
          type="primary"
          @click="onAuditReview"
        >
          <template #icon>
            <ElIconCircleCheck />
          </template><#
          if (isUseI18n) {
          #>
          <span>{{ ns('复核') }}</span><#
          } else {
          #>
          <span>复核</span><#
          }
          #>
        </el-button>
        
        <el-button
          v-if="permit('audit_review') &&
            dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Reviewed
          "
          plain
          type="primary"
          disabled
        >
          <template #icon>
            <ElIconCircleCheck />
          </template><#
          if (isUseI18n) {
          #>
          <span>{{ ns('已复核') }}</span><#
          } else {
          #>
          <span>已复核</span><#
          }
          #>
        </el-button><#
        }
        #>
        
      </template><#
      }
      #>
      
      <div
        un-text="3 [var(--el-text-color-regular)]"
        un-pos-absolute
        un-right="2"
        un-flex="~"
        un-gap="x-1"
      >
        <template v-if="(ids && ids.length > 1)">
          <el-button
            link
            :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) <= 0"
            @click="onPrevId"
          >
            <ElIconArrowLeft
              un-w="1em"
              un-h="1em"
            ></ElIconArrowLeft>
          </el-button>
          
          <div>
            {{ (dialogModel.id && ids.indexOf(dialogModel.id) || 0) + 1 }} / {{ ids.length }}
          </div>
          
          <el-button
            link
            :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) >= ids.length - 1"
            @click="onNextId"
          >
            <ElIconArrowRight
              un-w="1em"
              un-h="1em"
            ></ElIconArrowRight>
          </el-button>
        </template>
        
        <div v-if="changedIds.length > 0">
          {{ changedIds.length }}
        </div>
      </div>
      
    </div>
  </div><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noAdd && column.noEdit) continue;
    if (column.isAtt) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "is_locked") continue;
    if (column_name === "is_deleted") continue;
    if (column_name === "version") continue;
    if (column_name === "tenant_id") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    if (!foreignKey) continue;
    if (foreignKey && foreignKey.showType === "dialog") {
      continue;
    }
    if (!foreignKey.hasSelectAdd || (foreignKey.selectType !== "select" && foreignKey.selectType != null)) {
      continue;
    }
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let foreignSchema = undefined;
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    }
    if (!foreignSchema) {
      throw `表: ${ mod }_${ table } 的外键 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
      process.exit(1);
    }
  #>
  
  <!-- <#=foreignSchema.opts.table_comment#> -->
  <<#=foreignSchema.opts.tableUp#>DetailDialog
    ref="<#=foreignSchema.opts.table#>DetailDialogRef"
  ></<#=foreignSchema.opts.tableUp#>DetailDialog><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const table = many2many.table;
    const mod = many2many.mod;
    const inlineMany2manySchema = optTables[mod + "_" + table];
    if (!inlineMany2manySchema) {
      throw new Error(`表: ${ mod }_${ table } 不存在`);
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  <!-- <#=column_comment#> -->
  <ListSelectDialog
    ref="<#=column_name#>ListSelectDialogRef"
    v-slot="listSelectProps"
    :is-locked="isLocked"
  >
    <<#=foreignTable_Up#>List
      v-bind="(listSelectProps as any)"
    ></<#=foreignTable_Up#>List>
  </ListSelectDialog><#
  }
  #><#
  if (hasAudit) {
  #>
  
  <AuditDialog
    ref="auditDialogRef"
  ></AuditDialog><#
  }
  #>
</CustomDialog>
</template>

<script lang="ts" setup>
import type {
  MaybeRefOrGetter,
  WatchStopHandle,
} from "vue";

import {<#
  if (opts.noAdd !== true) {
  #>
  create,<#
  }
  #>
  findOne,<#
  if(hasOrderBy) {
  #>
  findLastOrderBy,<#
  }
  #><#
  if (opts.noEdit !== true) {
  #>
  updateById,<#
  }
  #><#
  if (hasAudit) {
  #>
  auditSubmit,
  auditPass,<#
  if (hasReviewed) {
  #>
  auditReview,<#
  }
  #><#
  }
  #>
  getDefaultInput,<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  getEditableDataPermitsByIds,<#
  }
  #>
  getPagePath,
} from "./Api";<#
if (hasAudit) {
#>

import {
  <#=Table_Up#>Audit,
} from "#/types.ts";

import AuditDialog from "./AuditDialog.vue";<#
}
#><#
const foreignTableArr2 = [];
const foreignTableArr3 = [];
if (
  columns.some((column) => {
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") return false;
    if (column_name === "tenant_id") return false;
    if (column.ignoreCodegen) return false;
    if (column.onlyCodegenDeno) return false;
    const foreignKey = column.foreignKey;
    if (!foreignKey) return false;
    if (foreignKey.showType === "dialog") {
      return false;
    }
    if (column.noAdd && column.noEdit) {
      return false;
    }
    if (column.inlineMany2manyTab) {
      return false;
    }
    const foreignTable = foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    if (foreignSchema && foreignSchema.opts?.list_tree) {
      return false;
    }
    if (selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
      return false;
    }
    return true;
  })
) {
#>

import {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "tenant_id") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    if (!foreignKey) continue;
    if (foreignKey.showType === "dialog") {
      continue;
    }
    if (column.noAdd && column.noEdit) {
      continue;
    }
    if (column.inlineMany2manyTab) {
      continue;
    }
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    if (foreignSchema && foreignSchema.opts?.list_tree) {
      continue;
    }
    if (foreignTableArr2.includes(foreignTable)) continue;
    foreignTableArr2.push(foreignTable);
    if (selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
      continue;
    }
  #>
  get<#=Foreign_Table_Up#>List,<#
  }
  #>
} from "./Api";<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
  if (column.noAdd && column.noEdit) {
    continue;
  }
  const foreignKey = column.foreignKey;
  if (!foreignKey) {
    continue;
  }
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  if (foreignKey.showType === "dialog") {
    continue;
  }
  const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  if (!foreignSchema) {
    continue;
  }
  if (foreignSchema.opts?.ignoreCodegen || foreignSchema.opts?.onlyCodegenDeno) {
    continue;
  }
  if (!foreignSchema.opts?.list_tree) {
    continue;
  }
  if (foreignTableArr3.includes(foreignTable)) continue;
  foreignTableArr3.push(foreignTable);
#>

import {
  get<#=Foreign_Table_Up#>Tree,<#
  if (mod === "base" && table === "data_permit" && column_name === "menu_id") {
  #>
  useMenuTreeFilter,<#
  }
  #>
} from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/Api";<#
}
#><#
const findAllTableUps = [ ];
const getDefaultInputTableUps = [ ];
const listVueTableUps = [ ];
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  const comment = column.COLUMN_COMMENT;
  let is_nullable = column.IS_NULLABLE === "YES";
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  let data_type = column.DATA_TYPE;
  const many2many = column.many2many;
  if (!many2many || !foreignKey) continue;
  if (!column.inlineMany2manyTab) continue;
  const table = many2many.table;
  const mod = many2many.mod;
  const inlineMany2manySchema = optTables[mod + "_" + table];
  if (!inlineMany2manySchema) {
    throw `inlineMany2manyTab, 表: ${ mod }_${ table } 不存在`;
    process.exit(1);
  }
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const foreign_mod = foreignKey.mod;
  const foreign_table = foreignKey.table;
  const foreign_tableUp = foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
  const foreign_Table_Up = foreign_tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  
#><#
  if (!findAllTableUps.includes(foreign_Table_Up)) {
    const hasFindAllTableUps = findAllTableUps.includes(foreign_Table_Up);
    if (!hasFindAllTableUps) {
      findAllTableUps.push(foreign_Table_Up);
    }
#>

import {<#
  if (!hasFindAllTableUps) {
  #>
  findAll as findAll<#=foreign_Table_Up#>,<#
  }
  #>
} from "@/views/<#=foreign_mod#>/<#=foreign_table#>/Api";<#
 }
#><#
  if (!listVueTableUps.includes(Table_Up)) {
    const hasListVueTableUps = listVueTableUps.includes(Table_Up);
    if (!hasListVueTableUps) {
      listVueTableUps.push(Table_Up);
    }
#>

import <#=foreign_Table_Up#>List from "@/views/<#=foreign_mod#>/<#=foreign_table#>/List.vue";<#
  }
#><#
  if (!getDefaultInputTableUps.includes(Table_Up)) {
    const hasGetDefaultInputTableUps = getDefaultInputTableUps.includes(Table_Up);
    if (!hasGetDefaultInputTableUps) {
      getDefaultInputTableUps.push(Table_Up);
    }
#>

import {<#
  if (!hasGetDefaultInputTableUps) {
  #>
  getDefaultInput as getDefaultInput<#=Table_Up#>,<#
  }
  #>
} from "@/views/<#=mod#>/<#=table#>/Api";<#
  }
#><#
}
#><#
const selectInputNoRepeats = [ ];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  if (!selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
    continue;
  }
  if (selectInputNoRepeats.includes(Foreign_Table_Up)) {
    continue;
  }
  selectInputNoRepeats.push(Foreign_Table_Up);
#>

import SelectInput<#=Foreign_Table_Up#> from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/SelectInput.vue";<#
}
#><#
if (hasInlineForeignTabs) {
  let hasListApi = false;
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      const foreignKey = column.foreignKey;
      const data_type = column.DATA_TYPE;
      if (!foreignKey) continue;
      if (foreignKey.showType === "dialog") {
        continue;
      }
      const foreignTable = foreignKey.table;
      const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      if (column.noAdd && column.noEdit) {
        continue;
      }
      const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
      if (foreignSchema && foreignSchema.opts?.list_tree) {
        continue;
      }
      if (selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
        continue;
      }
      if (foreignTableArr2.includes(foreignTable)) {
        continue;
      }
      hasListApi = true;
      break;
    }
    if (hasListApi) {
      break;
    }
  }
#><#
if (hasListApi) {
#>

import {<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "tenant_id") continue;
      const foreignKey = column.foreignKey;
      const data_type = column.DATA_TYPE;
      if (!foreignKey) continue;
      if (foreignKey.showType === "dialog") {
        continue;
      }
      const foreignTable = foreignKey.table;
      const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      if (column.noAdd && column.noEdit) {
        continue;
      }
      const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
      if (foreignSchema && foreignSchema.opts?.list_tree) {
        continue;
      }
      if (selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
        continue;
      }
      if (foreignTableArr2.includes(foreignTable)) {
        continue;
      }
      foreignTableArr2.push(foreignTable);
  #>
  get<#=Foreign_Table_Up#>List,<#
    }
  }
  #>
} from "./Api";<#
}
#><#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "tenant_id") continue;
    const foreignKey = column.foreignKey;
    const data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    if (foreignKey.showType === "dialog") {
      continue;
    }
    const foreignTable = foreignKey.table;
    const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    if (column.noAdd && column.noEdit) {
      continue;
    }
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    if (foreignSchema.opts?.ignoreCodegen || foreignSchema.opts?.onlyCodegenDeno) {
      continue;
    }
    if (!foreignSchema.opts?.list_tree) {
      continue;
    }
    if (foreignTableArr3.includes(foreignTable)) continue;
    foreignTableArr3.push(foreignTable);
#>

import {
  get<#=Foreign_Table_Up#>Tree,
} from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/Api";<#
  }
}
#><#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "tenant_id") continue;
    const foreignKey = column.foreignKey;
    const data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    if (!selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
      continue;
    }
    if (selectInputNoRepeats.includes(Foreign_Table_Up)) {
      continue;
    }
    selectInputNoRepeats.push(Foreign_Table_Up);
#>

import SelectInput<#=Foreign_Table_Up#> from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/SelectInput.vue";<#
  }
}
#><#
}
#><#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
#>

import {
  getDefaultInput as getDefaultInput<#=Table_Up#>,
} from "@/views/<#=mod#>/<#=table#>/Api";<#
}
#><#
if (opts?.isRealData) {
#>

import {
  subscribe,
  publish,
  unSubscribe,
} from "@/compositions/websocket";<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noAdd && column.noEdit) continue;
  if (column.isAtt) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "is_locked") continue;
  if (column_name === "is_deleted") continue;
  if (column_name === "version") continue;
  if (column_name === "tenant_id") continue;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  const foreignKey = column.foreignKey;
  if (!foreignKey) continue;
  if (foreignKey && foreignKey.showType === "dialog") {
    continue;
  }
  if (!foreignKey.hasSelectAdd || (foreignKey.selectType !== "select" && foreignKey.selectType != null)) {
    continue;
  }
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  let foreignSchema = undefined;
  if (foreignKey) {
    foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  }
  if (!foreignSchema) {
    throw `表: ${ mod }_${ table } 的外键 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
    process.exit(1);
  }
#>

// <#=foreignSchema.opts.table_comment#>
import <#=foreignSchema.opts.tableUp#>DetailDialog from "@/views/<#=foreignSchema.opts.mod#>/<#=foreignSchema.opts.table#>/Detail.vue";<#
}
#><#
if (mod === "cron" && table === "cron_job") {
#>

import cronstrue from "cronstrue/i18n";
import { lang } from "@/locales/index";<#
}
#>

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: <#=Table_Up#>Id,
    },
  ],
}>();

const pagePath = getPagePath();<#
if (isUseI18n) {
#>

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns,
} = useI18n(pagePath);<#
}
#>

const permitStore = usePermitStore();<#
if (tableFieldPermit) {
#>
const fieldPermitStore = useFieldPermitStore();<#
}
#>

const permit = permitStore.getPermit(pagePath);<#
if (tableFieldPermit) {
#>
const field_permit = fieldPermitStore.getFieldPermit(pagePath);<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noAdd && column.noEdit) continue;
  if (column.isAtt) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "is_locked") continue;
  if (column_name === "is_deleted") continue;
  if (column_name === "version") continue;
  if (column_name === "tenant_id") continue;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  const foreignKey = column.foreignKey;
  if (!foreignKey) continue;
  if (foreignKey && foreignKey.showType === "dialog") {
    continue;
  }
  if (!foreignKey.hasSelectAdd || (foreignKey.selectType !== "select" && foreignKey.selectType != null)) {
    continue;
  }
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  let foreignSchema = undefined;
  if (foreignKey) {
    foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  }
  if (!foreignSchema) {
    throw `表: ${ mod }_${ table } 的外键 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
    process.exit(1);
  }
#>

// <#=foreignSchema.opts.table_comment#>
const <#=foreignSchema.opts.table#>Permit = permitStore.getPermit("/<#=foreignSchema.opts.mod#>/<#=foreignSchema.opts.table#>");<#
}
#>

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view"<#
if (hasAudit) {
#> | "audit"<#
}
#>;
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
let oldDialogNotice: string | undefined = undefined;
let oldIsLocked = $ref(false);
let dialogNotice = $ref("");

let dialogModel: <#=inputName#> = $ref({<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  #><#
    if (foreignKey && foreignKey.multiple) {
  #>
  <#=column_name#>: [ ],<#
    }
  }
  #>
} as <#=inputName#>);<#
if (county_lbl_column) {
#>

/** 选择省市区县 */
const <#=county_lbl_column.COLUMN_NAME#>_city_picker = $computed<[string, string, string] | undefined>({
  get() {
    return [
      dialogModel.<#=province_code_column.COLUMN_NAME#> ?? "",
      dialogModel.<#=city_code_column.COLUMN_NAME#> ?? "",
      dialogModel.<#=county_code_column.COLUMN_NAME#> ?? "",
    ];
  },
  async set(codes) {
    const <#=province_code_column.COLUMN_NAME#> = codes?.[0] ?? "";
    const <#=province_lbl_column.COLUMN_NAME#> = await findNameByCodePcaCode(<#=province_code_column.COLUMN_NAME#>);
    const <#=city_code_column.COLUMN_NAME#> = codes?.[1] ?? "";
    const <#=city_lbl_column.COLUMN_NAME#> = await findNameByCodePcaCode(<#=city_code_column.COLUMN_NAME#>);
    const <#=county_code_column.COLUMN_NAME#> = codes?.[2] ?? "";
    const <#=county_lbl_column.COLUMN_NAME#> = await findNameByCodePcaCode(<#=county_code_column.COLUMN_NAME#>);
    dialogModel.<#=province_code_column.COLUMN_NAME#> = <#=province_code_column.COLUMN_NAME#>;
    dialogModel.<#=province_lbl_column.COLUMN_NAME#> = <#=province_lbl_column.COLUMN_NAME#>;
    dialogModel.<#=city_code_column.COLUMN_NAME#> = <#=city_code_column.COLUMN_NAME#>;
    dialogModel.<#=city_lbl_column.COLUMN_NAME#> = <#=city_lbl_column.COLUMN_NAME#>;
    dialogModel.<#=county_code_column.COLUMN_NAME#> = <#=county_code_column.COLUMN_NAME#>;
    dialogModel.<#=county_lbl_column.COLUMN_NAME#> = <#=county_lbl_column.COLUMN_NAME#>;
  },
});<#
}
#><#
if (hasDataPermit() && hasCreateUsrId) {
#>
let isEditableDataPermit = $ref(true);<#
}
#>

let ids = $ref<<#=Table_Up#>Id[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<<#=Table_Up#>Id[]>([ ]);

const formRef = $(useTemplateRef<InstanceType<typeof ElForm>>("formRef"));

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(async () => {
  if (!inited) {
    form_rules = { };
    return;
  }
  await nextTick();
  form_rules = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "tenant_id") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      const require = column.require;
      if (data_type == "datetime" || data_type == "date") {
        column_comment = column_comment + "开始";
      }
      const foreignKey = column.foreignKey;
      if (column.readonly) {
        continue;
      }
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const validators = column.validators || [ ];
      if (
        [
          "is_default",
        ].includes(column_name)
      ) {
        continue;
      }
      if (column.onlyCodegenDeno) {
        continue;
      }
      if (column.readonly) {
        continue;
      }
      if (column.noAdd && column.noEdit) {
        continue;
      }
      const isIcon = column.isIcon;
    #><#
      if (require) {
        if (!foreignKey) {
    #>
    // <#=column_comment#><#
    if (isIcon) {
    #>
    <#=column_name#>_lbl<#
    } else {
    #>
    <#=column_name#><#
    }
    #>: [<#
      if (isIcon) {
      #>
      {
        required: <#=(!!require).toString()#>,<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请选择") } ${ n("<#=column_comment#>") }`,<#
        } else {
        #>
        message: "请选择 <#=column_comment#>",<#
        }
        #>
      },<#
      } else if (column.dict || column.dictbiz) {
      #>
      {
        required: <#=(!!require).toString()#>,<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请选择") } ${ n("<#=column_comment#>") }`,<#
        } else {
        #>
        message: "请选择 <#=column_comment#>",<#
        }
        #>
      },<#
      } else {
      #>
      {
        required: <#=(!!require).toString()#>,<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请输入") } ${ n("<#=column_comment#>") }`,<#
        } else {
        #>
        message: "请输入 <#=column_comment#>",<#
        }
        #>
      },<#
      }
      #><#
        for (let j = 0; j < validators.length; j++) {
          const validator = validators[j];
      #><#
        if (validator.maximum != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
          if (column.foreignKey || column.dict || column.dictbiz) {
            continue;
          }
      #>
      {
        type: "number",<#
          if (validator.maximum != null) {
        #>
        max: <#=validator.maximum#>,<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("不能大于 {0}", <#=validator.maximum#>) }`,<#
        } else {
        #>
        message: "<#=column_comment#> 不能大于 <#=validator.maximum#>",<#
        }
        #>
      },<#
        } else if (validator.minimum != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
          if (column.foreignKey || column.dict || column.dictbiz) {
            continue;
          }
      #>
      {
        type: "number",<#
          if (validator.minimum != null) {
        #>
        min: <#=validator.minimum#>,<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("不能小于 {0}", <#=validator.minimum#>) }`,<#
        } else {
        #>
        message: "<#=column_comment#> 不能小于 <#=validator.minimum#>",<#
        }
        #>
      },<#
        } else if (validator.chars_max_length != null && [ "varchar", "text" ].includes(data_type)) {
          if (column.foreignKey || column.dict || column.dictbiz) {
            continue;
          }
      #>
      {
        type: "string",<#
          if (validator.chars_max_length != null) {
        #>
        max: <#=validator.chars_max_length#>,<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("长度不能超过 {0}", <#=validator.chars_max_length#>) }`,<#
        } else {
        #>
        message: "<#=column_comment#> 长度不能超过 <#=validator.chars_max_length#>",<#
        }
        #>
      },<#
        } else if (validator.chars_min_length != null && [ "varchar", "text" ].includes(data_type)) {
          if (column.foreignKey || column.dict || column.dictbiz) {
            continue;
          }
      #>
      {
        type: "string",<#
          if (validator.chars_min_length != null) {
        #>
        min: <#=validator.chars_min_length#>,<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("长度不能小于 {0}", <#=validator.chars_min_length#>) }`,<#
        } else {
        #>
        message: "<#=column_comment#> 长度不能小于 <#=validator.chars_min_length#>",<#
        }
        #>
      },<#
        } else if (validator.regex != null && [ "varchar", "text" ].includes(data_type)) {
      #>
      {
        type: "regexp",<#
          if (validator.regex != null) {
        #>
        pattern: "<#=validator.regex#>",<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("格式不正确") }`,<#
        } else {
        #>
        message: "<#=column_comment#> 格式不正确",<#
        }
        #>
      },<#
        } else if (validator.email) {
      #>
      {
        type: "email",<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请输入正确的电子邮件") }`,<#
        } else {
        #>
        message: "请输入正确的电子邮件",<#
        }
        #>
      },<#
        } else if (validator.url) {
      #>
      {
        type: "url",<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请输入正确的网址") }`,<#
        } else {
        #>
        message: "请输入正确的网址",<#
        }
        #>
      },<#
        } else if (validator.ip) {
      #>
      {
        type: "ip",<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请输入正确的IP地址") }`,<#
        } else {
        #>
        message: "请输入正确的IP地址",<#
        }
        #>
      },<#
        }
      #><#
        }
      #>
    ],<#
        } else {
    #>
    // <#=column_comment#>
    <#=column_name#>: [
      {
        required: <#=(!!require).toString()#>,<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请选择") } ${ n("<#=column_comment#>") }`,<#
        } else {
        #>
        message: "请选择 <#=column_comment#>",<#
        }
        #>
      },
    ],<#
        }
    #><#
      }
    #><#
    }
    #><#
    for (const inlineForeignTab of inlineForeignTabs) {
      const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
      const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
      const table = inlineForeignTab.table;
      const mod = inlineForeignTab.mod;
      if (!inlineForeignSchema) {
        throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
        process.exit(1);
      }
      const inline_column_name = inlineForeignTab.column_name;
      const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
    #><#
      if (inline_foreign_type === "one2one") {
    #>
    
    // <#=inlineForeignTab.label#><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "tenant_id") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const require = column.require;
      if (data_type == "datetime" || data_type == "date") {
        column_comment = column_comment + "开始";
      }
      const foreignKey = column.foreignKey;
      if (column.readonly) {
        continue;
      }
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const validators = column.validators || [ ];
      if (
        [
          "is_default",
        ].includes(column_name)
      ) {
        continue;
      }
      if (column.onlyCodegenDeno) {
        continue;
      }
      if (column.readonly) {
        continue;
      }
      if (column.noAdd && column.noEdit) {
        continue;
      }
    #><#
      if (require) {
        if (!foreignKey) {
    #>
    // <#=column_comment#>
    "<#=inline_column_name#>.<#=column_name#>": [
      {
        required: <#=(!!require).toString()#>,<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请输入") } ${ n("<#=column_comment#>") }`,<#
        } else {
        #>
        message: "请输入 <#=column_comment#>",<#
        }
        #>
      },<#
        for (let j = 0; j < validators.length; j++) {
          const validator = validators[j];
      #><#
        if (validator.maximum != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
          if (column.foreignKey || column.dict || column.dictbiz) {
            continue;
          }
      #>
      {
        type: "number",<#
          if (validator.maximum != null) {
        #>
        max: <#=validator.maximum#>,<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("不能大于 {0}", <#=validator.maximum#>) }`,<#
        } else {
        #>
        message: "<#=column_comment#> 不能大于 <#=validator.maximum#>",<#
        }
        #>
      },<#
        } else if (validator.minimum != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
          if (column.foreignKey || column.dict || column.dictbiz) {
            continue;
          }
      #>
      {
        type: "number",<#
          if (validator.minimum != null) {
        #>
        min: <#=validator.minimum#>,<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("不能小于 {0}", <#=validator.minimum#>) }`,<#
        } else {
        #>
        message: "<#=column_comment#> 不能小于 <#=validator.minimum#>",<#
        }
        #>
      },<#
        } else if (validator.chars_max_length != null && [ "varchar", "text" ].includes(data_type)) {
          if (column.foreignKey || column.dict || column.dictbiz) {
            continue;
          }
      #>
      {
        type: "string",<#
          if (validator.chars_max_length != null) {
        #>
        max: <#=validator.chars_max_length#>,<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("长度不能超过 {0}", <#=validator.chars_max_length#>) }`,<#
        } else {
        #>
        message: "<#=column_comment#> 长度不能超过 <#=validator.chars_max_length#>",<#
        }
        #>
      },<#
        } else if (validator.chars_min_length != null && [ "varchar", "text" ].includes(data_type)) {
          if (column.foreignKey || column.dict || column.dictbiz) {
            continue;
          }
      #>
      {
        type: "string",<#
          if (validator.chars_min_length != null) {
        #>
        min: <#=validator.chars_min_length#>,<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("长度不能小于 {0}", <#=validator.chars_min_length#>) }`,<#
        } else {
        #>
        message: "<#=column_comment#> 长度不能小于 <#=validator.chars_min_length#>",<#
        }
        #>
      },<#
        } else if (validator.regex != null && [ "varchar", "text" ].includes(data_type)) {
      #>
      {
        type: "regexp",<#
          if (validator.regex != null) {
        #>
        pattern: "<#=validator.regex#>",<#
          }
        #><#
        if (isUseI18n) {
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("格式不正确") }`,<#
        } else {
        #>
        message: "<#=column_comment#> 格式不正确",<#
        }
        #>
      },<#
        } else if (validator.email) {
      #>
      {
        type: "email",<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请输入正确的电子邮件") }`,<#
        } else {
        #>
        message: "请输入正确的电子邮件",<#
        }
        #>
      },<#
        } else if (validator.url) {
      #>
      {
        type: "url",<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请输入正确的网址") }`,<#
        } else {
        #>
        message: "请输入正确的网址",<#
        }
        #>
      },<#
        } else if (validator.ip) {
      #>
      {
        type: "ip",<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请输入正确的IP地址") }`,<#
        } else {
        #>
        message: "请输入正确的IP地址",<#
        }
        #>
      },<#
        }
      #><#
        }
      #>
    ],<#
        } else {
    #>
    // <#=column_comment#>
    "<#=inline_column_name#>.<#=column_name#>": [
      {
        required: <#=(!!require).toString()#>,<#
        if (isUseI18n) {
        #>
        message: `${ await nsAsync("请选择") } ${ n("<#=column_comment#>") }`,<#
        } else {
        #>
        message: "请选择 <#=column_comment#>",<#
        }
        #>
      },
    ],<#
        }
    #><#
      }
    #><#
    }
    #><#
      }
    #><#
    }
    #>
  };
});<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noAdd && column.noEdit) continue;
  if (column.isAtt) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "is_locked") continue;
  if (column_name === "is_deleted") continue;
  if (column_name === "version") continue;
  if (column_name === "tenant_id") continue;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  const foreignKey = column.foreignKey;
  if (!foreignKey) continue;
  if (foreignKey && foreignKey.showType === "dialog") {
    continue;
  }
  if (!foreignKey.hasSelectAdd || (foreignKey.selectType !== "select" && foreignKey.selectType != null)) {
    continue;
  }
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  let foreignSchema = undefined;
  if (foreignKey) {
    foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  }
  if (!foreignSchema) {
    throw `表: ${ mod }_${ table } 的外键 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
    process.exit(1);
  }
#>

// <#=foreignSchema.opts.table_comment#>
const <#=foreignSchema.opts.table#>DetailDialogRef = $(useTemplateRef<InstanceType<typeof <#=foreignSchema.opts.tableUp#>DetailDialog>>("<#=foreignSchema.opts.table#>DetailDialogRef"));
const <#=column_name#>Ref = $(useTemplateRef<InstanceType<typeof CustomSelect>>("<#=column_name#>Ref"));

/** 打开新增 <#=foreignSchema.opts.table_comment#> 对话框 */
async function <#=column_name#>OpenAddDialog() {
  if (!<#=column_name#>Ref || !<#=foreignSchema.opts.table#>DetailDialogRef) {
    return;
  }
  const {
    changedIds,
  } = await <#=foreignSchema.opts.table#>DetailDialogRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("新增") + " " + await nsAsync("<#=foreignSchema.opts.table_comment#>"),<#
    } else {
    #>
    title: "新增 <#=foreignSchema.opts.table_comment#>",<#
    }
    #>
    action: "add",
  });
  if (changedIds.length > 0) {
    await <#=column_name#>Ref.refresh();<#
    if (foreignKey.multiple) {
    #>
    dialogModel.<#=column_name#> = dialogModel.<#=column_name#> || [ ];
    for (const id of changedIds) {
      if (dialogModel.<#=column_name#>.includes(id)) {
        continue;
      }
      dialogModel.<#=column_name#>.push(id);
    }<#
    } else {
    #>
    dialogModel.<#=column_name#> = changedIds[0];<#
    }
    #>
  }
  <#=column_name#>Ref.focus();
}<#
}
#>

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: <#=Table_Up#>Id[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<<#=inputName#>>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let findOneModel = findOne;<#
let hasDefaultInputColumn = false;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noAdd && column.noEdit) continue;
  if (column.isAtt) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "is_locked") continue;
  if (column_name === "is_deleted") continue;
  if (column_name === "version") continue;
  if (column_name === "tenant_id") continue;
  if (column_name === "order_by") continue;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  if (!column.readonly) {
    continue;
  }
  hasDefaultInputColumn = true;
  break;
}
#>

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: <#=inputName#>;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: <#=Table_Up#>Id[];
      is_deleted?: 0 | 1 | null;
    };
    findOne?: typeof findOne;
    action: DialogAction;
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  oldDialogTitle = dialogTitle;
  const notice = arg?.notice;
  oldDialogNotice = notice;
  dialogNotice = notice ?? "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "<#=detailCustomDialogType#>",
    title: $$(dialogTitle),
    pointerPierce: true,
    notice: $$(dialogNotice),
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  builtInModel = arg?.builtInModel;
  showBuildIn = false;
  isReadonly = false;
  isLocked = false;<#
  if (opts?.isRealData) {
  #>
  isShowEditCallbackConfirm = false;
  isShowDeleteCallbackConfirm = false;<#
  }
  #>
  is_deleted = model?.is_deleted ?? 0;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  isEditableDataPermit = true;<#
  }
  #>
  if (arg?.findOne) {
    findOneModel = arg.findOne;
  } else {
    findOneModel = findOne;
  }
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    showBuildIn = toValue(arg?.showBuildIn) ?? showBuildIn;
    isReadonly = toValue(arg?.isReadonly) ?? isReadonly;
    oldIsLocked = toValue(arg?.isLocked) ?? false;
    <#
    if (hasLocked) {
    #>
    if (dialogAction === "add") {
      isLocked = false;
    } else {
      if (!permit("edit")) {
        isLocked = true;
      } else {
        isLocked = (toValue(arg?.isLocked) || dialogModel.is_locked == 1) ?? isLocked;
      }
    }<#
    } else {
    #>
    if (!permit("edit")) {
      isLocked = true;
    } else {
      isLocked = toValue(arg?.isLocked) ?? isLocked;
    }<#
    }
    #>
  });
  dialogAction = action || "add";
  ids = [ ];
  changedIds = [ ];
  dialogModel = {<#
    if (hasVersion) {
    #>
    version: 0,<#
    }
    #><#
    for (const inlineForeignTab of inlineForeignTabs) {
      const table = inlineForeignTab.table;
      const mod = inlineForeignTab.mod;
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inline_column_name = inlineForeignTab.column_name;
      const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
    #><#
      if (inline_foreign_type === "one2one") {
    #>
    // <#=inlineForeignTab.label#>
    <#=inline_column_name#>: { },<#
      }
    #><#
    }
    #>
  };
  if (dialogAction === "copy" && !model?.ids?.[0]) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,<#
      if (hasOrderBy) {
      #>
      order_by,<#
      }
      #><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.onlyCodegenDeno) continue;
        const column_name = column.COLUMN_NAME;
        const column_comment = column.COLUMN_COMMENT;
        let is_nullable = column.IS_NULLABLE === "YES";
        const foreignKey = column.foreignKey;
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        let data_type = column.DATA_TYPE;
        const many2many = column.many2many;
        if (!many2many || !foreignKey) continue;
        if (!column.inlineMany2manyTab) continue;
        const table = many2many.table;
        const mod = many2many.mod;
        const inlineMany2manySchema = optTables[mod + "_" + table];
        if (!inlineMany2manySchema) {
          throw `表: ${ mod }_${ table } 不存在`;
          process.exit(1);
        }
        const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
        const Table_Up = tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const foreign_table = foreignKey.table;
        const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
        const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const inlineMany2manyColumns = inlineMany2manySchema.columns;
      #>
      
      // <#=column_comment#>
      _<#=column_name#>_<#=foreign_table#>_models,<#
      }
      #>
    ] = await Promise.all([
      getDefaultInput(),<#
      if (hasOrderBy) {
      #>
      findLastOrderBy(),<#
      }
      #><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.onlyCodegenDeno) continue;
        const column_name = column.COLUMN_NAME;
        const column_comment = column.COLUMN_COMMENT;
        let is_nullable = column.IS_NULLABLE === "YES";
        const foreignKey = column.foreignKey;
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        let data_type = column.DATA_TYPE;
        const many2many = column.many2many;
        if (!many2many || !foreignKey) continue;
        if (!column.inlineMany2manyTab) continue;
        const table = many2many.table;
        const mod = many2many.mod;
        const inlineMany2manySchema = optTables[mod + "_" + table];
        if (!inlineMany2manySchema) {
          throw `表: ${ mod }_${ table } 不存在`;
          process.exit(1);
        }
        const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
        const Table_Up = tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const foreign_table = foreignKey.table;
        const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
        const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const inlineMany2manyColumns = inlineMany2manySchema.columns;
      #>
      
      // <#=column_comment#>
      await findAll<#=foreign_Table_Up#>({<#
        if (hasIsDeleted) {
        #>
        is_deleted,<#
        }
        #>
      }),<#
      }
      #>
    ]);<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      let data_type = column.DATA_TYPE;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (!column.inlineMany2manyTab) continue;
      const table = many2many.table;
      const mod = many2many.mod;
      const inlineMany2manySchema = optTables[mod + "_" + table];
      if (!inlineMany2manySchema) {
        throw `表: ${ mod }_${ table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const foreign_table = foreignKey.table;
      const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
      const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inlineMany2manyColumns = inlineMany2manySchema.columns;
    #>
    
    // <#=column_comment#>
    <#=column_name#>_<#=foreign_table#>_models = _<#=column_name#>_<#=foreign_table#>_models;<#
    }
    #>
    dialogModel = {
      ...defaultModel,<#
      for (const inlineForeignTab of inlineForeignTabs) {
        const table = inlineForeignTab.table;
        const mod = inlineForeignTab.mod;
        const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
        const Table_Up = tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const inline_column_name = inlineForeignTab.column_name;
        const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
      #><#
        if (inline_foreign_type === "one2one") {
      #>
      // <#=inlineForeignTab.label#>
      <#=inline_column_name#>: await getDefaultInput<#=Table_Up#>(),<#
        }
      #><#
      }
      #>
      ...builtInModel,
      ...model,<#
      if (hasOrderBy) {
      #>
      order_by: order_by + 1,<#
      }
      #>
    };
  } else if (dialogAction === "copy") {
    const id = model?.ids?.[0];
    if (!id) {
      return await dialogRes.dialogPrm;
    }
    const [<#
      if (hasDefaultInputColumn) {
      #>
      defaultInput,<#
      }
      #>
      data,<#
      if (hasOrderBy) {
      #>
      order_by,<#
      }
      #><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.onlyCodegenDeno) continue;
        const column_name = column.COLUMN_NAME;
        const column_comment = column.COLUMN_COMMENT;
        let is_nullable = column.IS_NULLABLE === "YES";
        const foreignKey = column.foreignKey;
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        let data_type = column.DATA_TYPE;
        const many2many = column.many2many;
        if (!many2many || !foreignKey) continue;
        if (!column.inlineMany2manyTab) continue;
        const table = many2many.table;
        const mod = many2many.mod;
        const inlineMany2manySchema = optTables[mod + "_" + table];
        if (!inlineMany2manySchema) {
          throw `表: ${ mod }_${ table } 不存在`;
          process.exit(1);
        }
        const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
        const Table_Up = tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const foreign_table = foreignKey.table;
        const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
        const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const inlineMany2manyColumns = inlineMany2manySchema.columns;
      #>
      
      // <#=column_comment#>
      _<#=column_name#>_<#=foreign_table#>_models,<#
      }
      #>
    ] = await Promise.all([<#
      if (hasDefaultInputColumn) {
      #>
      getDefaultInput(),<#
      }
      #>
      findOneModel({
        id,<#
        if (hasIsDeleted) {
        #>
        is_deleted,<#
        }
        #>
      }),<#
      if (hasOrderBy) {
      #>
      findLastOrderBy(),<#
      }
      #><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.onlyCodegenDeno) continue;
        const column_name = column.COLUMN_NAME;
        const column_comment = column.COLUMN_COMMENT;
        let is_nullable = column.IS_NULLABLE === "YES";
        const foreignKey = column.foreignKey;
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        let data_type = column.DATA_TYPE;
        const many2many = column.many2many;
        if (!many2many || !foreignKey) continue;
        if (!column.inlineMany2manyTab) continue;
        const table = many2many.table;
        const mod = many2many.mod;
        const inlineMany2manySchema = optTables[mod + "_" + table];
        if (!inlineMany2manySchema) {
          throw `表: ${ mod }_${ table } 不存在`;
          process.exit(1);
        }
        const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
        const Table_Up = tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const foreign_table = foreignKey.table;
        const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
        const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const inlineMany2manyColumns = inlineMany2manySchema.columns;
      #>
      
      // <#=column_comment#>
      await findAll<#=foreign_Table_Up#>({<#
        if (hasIsDeleted) {
        #>
        is_deleted,<#
        }
        #>
      }),<#
      }
      #>
    ]);<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      let data_type = column.DATA_TYPE;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (!column.inlineMany2manyTab) continue;
      const table = many2many.table;
      const mod = many2many.mod;
      const inlineMany2manySchema = optTables[mod + "_" + table];
      if (!inlineMany2manySchema) {
        throw `表: ${ mod }_${ table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const foreign_table = foreignKey.table;
      const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
      const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inlineMany2manyColumns = inlineMany2manySchema.columns;
    #>
    
    // <#=column_comment#>
    <#=column_name#>_<#=foreign_table#>_models = _<#=column_name#>_<#=foreign_table#>_models;<#
    }
    #>
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,<#
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column.ignoreCodegen) continue;
          if (column.onlyCodegenDeno) continue;
          if (column.noAdd && column.noEdit) continue;
          if (column.isAtt) continue;
          const column_name = column.COLUMN_NAME;
          if (column_name === "id") continue;
          if (column_name === "is_locked") continue;
          if (column_name === "is_deleted") continue;
          if (column_name === "version") continue;
          if (column_name === "tenant_id") continue;
          if (column_name === "order_by") continue;
          let data_type = column.DATA_TYPE;
          let column_type = column.COLUMN_TYPE;
          let column_comment = column.COLUMN_COMMENT || "";
          if (!column.readonly) {
            continue;
          }
        #>
        <#=column_name#>: defaultInput.<#=column_name#>,<#
        }
        #><#
        if (hasDefault) {
        #>
        is_default: undefined,
        is_default_lbl: undefined,<#
        }
        #><#
        if (hasLocked) {
        #>
        is_locked: undefined,
        is_locked_lbl: undefined,<#
        }
        #><#
        if (hasOrderBy) {
        #>
        order_by: order_by + 1,<#
        }
        #><#
        if (hasVersion) {
        #>
        version: 0,<#
        }
        #><#
        for (const inlineForeignTab of inlineForeignTabs) {
          const table = inlineForeignTab.table;
          const mod = inlineForeignTab.mod;
          const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
          const Table_Up = tableUp.split("_").map(function(item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
          }).join("");
          const inline_column_name = inlineForeignTab.column_name;
          const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
        #><#
          if (inline_foreign_type === "one2many") {
        #>
        <#=inline_column_name#>: data.<#=inline_column_name#>?.map((item) => ({
          ...item,
          id: undefined,
        })) || [ ],<#
          } else if (inline_foreign_type === "one2one") {
        #>
        <#=inline_column_name#>: data.<#=inline_column_name#> || { },<#
          }
        #><#
        }
        #><#
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column.ignoreCodegen) continue;
          if (column.onlyCodegenDeno) continue;
          const column_name = column.COLUMN_NAME;
          const column_comment = column.COLUMN_COMMENT;
          let is_nullable = column.IS_NULLABLE === "YES";
          const foreignKey = column.foreignKey;
          const foreignTable = foreignKey && foreignKey.table;
          const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
          const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
          }).join("");
          let data_type = column.DATA_TYPE;
          const many2many = column.many2many;
          if (!many2many || !foreignKey) continue;
          if (!column.inlineMany2manyTab) continue;
          const table = many2many.table;
          const mod = many2many.mod;
          const inlineMany2manySchema = optTables[mod + "_" + table];
          if (!inlineMany2manySchema) {
            throw `表: ${ mod }_${ table } 不存在`;
            process.exit(1);
          }
          const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
          const Table_Up = tableUp.split("_").map(function(item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
          }).join("");
          const foreign_table = foreignKey.table;
          const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
          const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
          }).join("");
          const inlineMany2manyColumns = inlineMany2manySchema.columns;
        #>
        
        // <#=column_comment#>
        <#=column_name#>: data.<#=column_name#>
          ?.filter((id) => <#=column_name#>_<#=foreign_table#>_models.some((item) => item.id === id))
          ?? [ ],
        <#=column_name#>_<#=table#>_models: data.<#=column_name#>_<#=table#>_models
          ?.filter((item) => <#=column_name#>_<#=foreign_table#>_models.some((item2) => item2.id === item.<#=many2many.column2#>))
          ?.map((item) => {
            return {
              ...item,
              id: undefined,
              <#=many2many.column1#>: undefined,
            };
          })
          ?? [ ],<#
        }
        #>
      };
      Object.assign(dialogModel, { is_deleted: undefined });
    }
  } else if (dialogAction === "edit") {
    if (!model || !model.ids) {
      return await dialogRes.dialogPrm;
    }
    ids = model.ids;
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      await onRefresh();
    }
  } else if (dialogAction === "view"<#
  if (hasAudit) {
  #> || dialogAction === "audit"<#
  }
  #>) {
    if (!model || !model.ids) {
      return await dialogRes.dialogPrm;
    }
    isReadonly = true;
    ids = model.ids;
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      await onRefresh();
    }
  }
  inited = true;
  return await dialogRes.dialogPrm;
}<#
if (hasLocked) {
#>

watch(
  () => [ inited, isLocked, is_deleted, dialogNotice<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>, isEditableDataPermit<#
  }
  #> ],
  async () => {
    if (!inited) {
      return;
    }
    if (oldDialogNotice != null) {
      return;
    }
    if (is_deleted) {<#
      if (isUseI18n) {
      #>
      dialogNotice = await nsAsync("(已删除)");<#
      } else {
      #>
      dialogNotice = "(已删除)";<#
      }
      #>
      return;
    }<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    if (!isEditableDataPermit) {
      isLocked = true;
    }<#
    }
    #>
    if (isLocked) {<#
      if (hasDataPermit() && hasCreateUsrId) {
      #>
      if (isEditableDataPermit) {<#
        if (isUseI18n) {
        #>
        dialogNotice = await nsAsync("(已锁定)");<#
        } else {
        #>
        dialogNotice = "(已锁定)";<#
        }
        #>
      } else {<#
        if (isUseI18n) {
        #>
        dialogNotice = await nsAsync("(无编辑权限)");<#
        } else {
        #>
        dialogNotice = "(无编辑权限)";<#
        }
        #>
      }<#
      } else {
      #><#
      if (isUseI18n) {
      #>
      dialogNotice = await nsAsync("(已锁定)");<#
      } else {
      #>
      dialogNotice = "(已锁定)";<#
      }
      #><#
      }
      #>
      return;
    }
    dialogNotice = "";
  },
);<#
}
#><#
if (mod === "cron" && table === "cron_job") {
#>

let job_lbl = $ref<string>("");

// 任务
function onJobId(jobModel?: JobModel) {
  job_lbl = jobModel?.lbl || "";
}

const cron_lbl = $computed(() => {
  if (!dialogModel.cron) {
    return "";
  }
  try {
    return cronstrue.toString(
      dialogModel.cron,
      {
        use24HourTimeFormat: true,
        locale: lang.replace("-", "_"),
      },
    );
  } catch (err) {
    return "";
  }
});

// 名称
watch(
  () => [ inited, job_lbl, cron_lbl ],
  () => {
    if (!inited) {
      return;
    }
    if (!job_lbl || !cron_lbl) {
      return;
    }
    dialogModel.lbl = `${ cron_lbl } - ${ job_lbl }`;
  },
);<#
}
#><#
if (opts?.noAdd !== true || opts?.noEdit !== true) {
#>

/** 键盘按 Insert */
async function onInsert() {
  isReadonly = !isReadonly;
  await nextTick();
  customDialogRef?.focus();
}<#
}
#>

/** 重置 */
async function onReset() {
  if (!formRef) {
    return;
  }
  if (!isReadonly && !isLocked) {
    try {
      await ElMessageBox.confirm(<#
        if (isUseI18n) {
        #>
        await nsAsync("确定要重置表单吗"),<#
        } else {
        #>
        "确定要重置表单吗",<#
        }
        #>
        {<#
          if (isUseI18n) {
          #>
          confirmButtonText: await nsAsync("确定"),
          cancelButtonText: await nsAsync("取消"),<#
          } else {
          #>
          confirmButtonText: "确定",
          cancelButtonText: "取消",<#
          }
          #>
          type: "warning",
        },
      );
    } catch (err) {
      return;
    }
  }
  if (dialogAction === "add" || dialogAction === "copy") {
    const [
      defaultModel,<#
      if (hasOrderBy) {
      #>
      order_by,<#
      }
      #>
    ] = await Promise.all([
      getDefaultInput(),<#
      if (hasOrderBy) {
      #>
      findLastOrderBy(),<#
      }
      #>
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,<#
      if (hasOrderBy) {
      #>
      order_by: order_by + 1,<#
      }
      #>
    };
    nextTick(() => nextTick(() => formRef?.clearValidate()));
  } else if (dialogAction === "edit" || dialogAction === "view") {
    await onRefresh();
  }
  ElMessage({<#
    if (isUseI18n) {
    #>
    message: await nsAsync("表单重置完毕"),<#
    } else {
    #>
    message: "表单重置完毕",<#
    }
    #>
    type: "success",
  });
}<#
if (opts?.isRealData) {
#>

let isShowEditCallbackConfirm = false;

/** 订阅编辑消息回调 */
async function subscribeEditCallback(id?: <#=Table_Up#>Id) {
  if (!id) {
    return;
  }
  if (id !== dialogModel.id) {
    return;
  }
  if (isShowEditCallbackConfirm) {
    return;
  }
  isShowEditCallbackConfirm = true;
  try {
    await ElMessageBox.confirm(<#
      if (isUseI18n) {
      #>
      await nsAsync("此 {0} 已被其他用户编辑，是否刷新?", await nsAsync("<#=table_comment#>")),<#
      } else {
      #>
      "此 {0} 已被其他用户编辑，是否刷新?", "<#=table_comment#>",<#
      }
      #>
      {<#
        if (isUseI18n) {
        #>
        confirmButtonText: await nsAsync("刷新"),
        cancelButtonText: await nsAsync("取消"),<#
        } else {
        #>
        confirmButtonText: "刷新",
        cancelButtonText: "取消",<#
        }
        #>
        type: "warning",
      },
    );
    isShowEditCallbackConfirm = false;
  } catch (err) {
    isShowEditCallbackConfirm = false;
    return;
  }
  await onRefresh();
}

let isShowDeleteCallbackConfirm = false;

/** 订阅删除消息回调 */
async function subscribeDeleteCallback(ids?: <#=Table_Up#>Id[]) {
  if (!ids) {
    return;
  }
  if (!dialogModel.id) {
    return;
  }
  if (!ids.includes(dialogModel.id)) {
    return;
  }
  if (dialogAction === "add" || dialogAction === "copy") {
    return;
  }
  if (isShowDeleteCallbackConfirm) {
    return;
  }
  try {
    await ElMessageBox.confirm(<#
      if (isUseI18n) {
      #>
      await nsAsync("此 {0} 已被其他用户删除, 是否关闭窗口", await nsAsync("<#=table_comment#>")),<#
      } else {
      #>
      "此 {0} 已被其他用户删除, 是否关闭窗口", "<#=table_comment#>",<#
      }
      #>
      {<#
        if (isUseI18n) {
        #>
        confirmButtonText: await nsAsync("关闭"),
        cancelButtonText: await nsAsync("暂不关闭"),<#
        } else {
        #>
        confirmButtonText: "关闭",
        cancelButtonText: "暂不关闭",<#
        }
        #>
        type: "warning",
      },
    );
  } catch {
    return;
  }
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}<#
}
#>

/** 刷新 */
async function onRefresh() {
  const id = dialogModel.id;
  if (!id) {
    return;
  }
  const [
    data,<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    editableDataPermits,<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      let data_type = column.DATA_TYPE;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (!column.inlineMany2manyTab) continue;
      const table = many2many.table;
      const mod = many2many.mod;
      const inlineMany2manySchema = optTables[mod + "_" + table];
      if (!inlineMany2manySchema) {
        throw `表: ${ mod }_${ table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const foreign_table = foreignKey.table;
      const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
      const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inlineMany2manyColumns = inlineMany2manySchema.columns;
    #>
    
    // <#=column_comment#>
    _<#=column_name#>_<#=foreign_table#>_models,<#
    }
    #>
  ] = await Promise.all([
    await findOneModel({
      id,<#
      if (hasIsDeleted) {
      #>
      is_deleted,<#
      }
      #>
    }),<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    getEditableDataPermitsByIds([ id ]),<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      let data_type = column.DATA_TYPE;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (!column.inlineMany2manyTab) continue;
      const table = many2many.table;
      const mod = many2many.mod;
      const inlineMany2manySchema = optTables[mod + "_" + table];
      if (!inlineMany2manySchema) {
        throw `表: ${ mod }_${ table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const foreign_table = foreignKey.table;
      const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
      const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inlineMany2manyColumns = inlineMany2manySchema.columns;
    #>
    await findAll<#=foreign_Table_Up#>({<#
      if (hasIsDeleted) {
      #>
      is_deleted,<#
      }
      #>
    }),<#
    }
    #>
  ]);<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  isEditableDataPermit = editableDataPermits[0] !== 0;<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const table = many2many.table;
    const mod = many2many.mod;
    const inlineMany2manySchema = optTables[mod + "_" + table];
    if (!inlineMany2manySchema) {
      throw `表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const foreign_table = foreignKey.table;
    const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
    const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inlineMany2manyColumns = inlineMany2manySchema.columns;
  #>
  
  // <#=column_comment#>
  <#=column_name#>_<#=foreign_table#>_models = _<#=column_name#>_<#=foreign_table#>_models;<#
  }
  #>
  if (data) {
    dialogModel = {
      ...data,<#
      for (const inlineForeignTab of inlineForeignTabs) {
        const table = inlineForeignTab.table;
        const mod = inlineForeignTab.mod;
        const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
        const Table_Up = tableUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        const inline_column_name = inlineForeignTab.column_name;
        const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
      #><#
        if (inline_foreign_type === "one2one") {
      #>
      // <#=inlineForeignTab.label#>
      <#=inline_column_name#>: data.<#=inline_column_name#> || { },<#
        }
      #><#
      }
      #>
    };<#
    if (mod === "base" && table === "usr") {
    #>
    old_default_org_id = dialogModel.default_org_id;<#
    }
    #><#
    if (opts.lbl_field) {
    #>
    dialogTitle = `${ oldDialogTitle } - ${ dialogModel.<#=opts.lbl_field#> }`;<#
    }
    #>
  }
}

/** 键盘按 PageUp */
async function onPageUp(e?: KeyboardEvent) {
  if (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  const isSucc = await prevId();
  if (!isSucc) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("已经是第一项了"));<#
    } else {
    #>
    ElMessage.warning("已经是第一项了");<#
    }
    #>
  }
}

/** 点击上一项 */
async function onPrevId() {
  await prevId();
  customDialogRef?.focus();
}

/** 上一项 */
async function prevId() {
  if (!dialogModel.id) {
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
    }
  } else {
    const idx = ids.indexOf(dialogModel.id);
    if (idx > 0) {
      dialogModel.id = ids[idx - 1];
    } else {
      return false;
    }
  }
  await onRefresh();
  emit(
    "nextId",
    {
      dialogAction,
      id: dialogModel.id!,
    },
  );
  return true;
}

/** 键盘按 PageDown */
async function onPageDown(e?: KeyboardEvent) {
  if (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  const isSucc = await nextId();
  if (!isSucc) {<#
    if (isUseI18n) {
    #>
    ElMessage.warning(await nsAsync("已经是最后一项了"));<#
    } else {
    #>
    ElMessage.warning("已经是最后一项了");<#
    }
    #>
  }
}

/** 点击下一项 */
async function onNextId() {
  await nextId();
  customDialogRef?.focus();
}

/** 下一项 */
async function nextId() {
  if (!dialogModel.id) {
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
    } else {
      return false;
    }
  } else {
    const idx = ids.indexOf(dialogModel.id);
    if (idx >= 0 && idx < ids.length - 1) {
      dialogModel.id = ids[idx + 1];
    } else {
      return false;
    }
  }
  await onRefresh();
  emit(
    "nextId",
    {
      dialogAction,
      id: dialogModel.id!,
    },
  );
  return true;
}<#
let hasWatchCol = false;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const data_type = column.DATA_TYPE;
  const column_name = column.COLUMN_NAME;
  if (column_name === "is_deleted") continue;
  if (column_name === "tenant_id") continue;
  const isPassword = column.isPassword;
  if (isPassword) continue;
  if (column.readonly) continue;
  if (column.noEdit) continue;
  const foreignKey = column.foreignKey;
  if (foreignKey || column.dict || column.dictbiz
    || data_type === "datetime" || data_type === "date"
  ) {
    hasWatchCol = true;
  }
}
#><#
if (hasWatchCol) {
#>

watch(
  () => [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "is_deleted") continue;
      if (column_name === "tenant_id") continue;
      const data_type = column.DATA_TYPE;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      const isPassword = column.isPassword;
      if (isPassword) continue;
      if (column.readonly) continue;
      if (column.noEdit) continue;
    #><#
      if (foreignKey || column.dict || column.dictbiz
        || data_type === "datetime" || data_type === "date"
      ) {
    #>
    dialogModel.<#=column_name#>,<#
      }
    #><#
    }
    #>
  ],
  () => {
    if (!inited) {
      return;
    }<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "is_deleted") continue;
      if (column_name === "tenant_id") continue;
      const is_nullable = column.IS_NULLABLE === "YES";
      const column_type = column.COLUMN_TYPE;
      const data_type = column.DATA_TYPE;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      const isPassword = column.isPassword;
      if (isPassword) continue;
      if (column.readonly) continue;
      if (column.noEdit) continue;
      let modelLabel = column.modelLabel;
      let cascade_fields = [ ];
      if (foreignKey) {
        cascade_fields = foreignKey.cascade_fields || [ ];
        if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
          cascade_fields = cascade_fields.filter((item) => item !== column_name + "_" + foreignKey.lbl);
        } else if (modelLabel) {
          cascade_fields = cascade_fields.filter((item) => item !== modelLabel);
        }
      }
      if (foreignKey && foreignKey.lbl && !modelLabel) {
        modelLabel = column_name + "_" + foreignKey.lbl;
      } else if (!foreignKey && !modelLabel) {
        modelLabel = column_name + "_lbl";
      }
      let hasModelLabel = !!column.modelLabel;
      if (column.dict || column.dictbiz || data_type === "date" || data_type === "datetime") {
        hasModelLabel = true;
      } else if (foreignKey && foreignKey.lbl) {
        hasModelLabel = true;
      }
    #><#
      if ((foreignKey && !foreignKey.multiple) || column.dict || column.dictbiz) {
    #><#
      if (hasModelLabel) {
    #>
    if (!dialogModel.<#=column_name#>) {
      dialogModel.<#=modelLabel#> = "";
    }<#
      }
    #><#
      } else if (data_type === "datetime" || data_type === "date") {
    #>
    if (!dialogModel.<#=column_name#>) {
      dialogModel.<#=modelLabel#> = "";<#
        if (is_nullable) {
      #>
      dialogModel.<#=column_name#>_save_null = true;<#
        }
      #>
    }<#
      } else if (foreignKey && foreignKey.multiple) {
    #><#
      if (hasModelLabel) {
    #>
    if (!dialogModel.<#=column_name#> || dialogModel.<#=column_name#>.length === 0) {
      dialogModel.<#=column_name#>_lbl = [ ];
    }<#
      }
    #><#
      }
    #><#
    }
    #>
  },
);<#
}
#><#
if ((opts.noAdd !== true || opts.noEdit !== true) && opts.hideSaveAndCopy === false) {
#>

/** 快捷键ctrl+shift+回车 */
async function onSaveAndCopyKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  if (dialogAction === "add" || dialogAction === "copy") {
    customDialogRef?.focus();
    await onSaveAndCopy();
  }
}<#
}
#><#
if (opts.noAdd !== true || opts.noEdit !== true) {
#>

/** 快捷键ctrl+回车 */
async function onSaveKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  customDialogRef?.focus();
  await onSave();
}<#
if (hasAudit) {
#>

// 已审核提交的不允许编辑
watch(
  () => [
    inited,
    dialogModel.<#=auditColumn#>,
    dialogAction,
    oldIsLocked,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (oldIsLocked) {
      return;
    }
    if (
      (dialogAction === "edit" || dialogAction === "view") &&
      (dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Unaudited || dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Audited<#
      if (hasReviewed) {
      #> || dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Reviewed<#
      }
      #>)
    ) {
      isLocked = true;
      dialogNotice = dialogModel.<#=auditColumn#>_lbl ?? oldDialogNotice ?? "";
    }
  },
);

/** 审核提交 */
async function onAuditSubmit() {
  const id = dialogModel.id;
  if (!id) {
    return;
  }
  if (!permit("audit_submit")) {
    return;
  }
  try {
    await ElMessageBox.confirm(<#
      if (isUseI18n) {
      #>
      await nsAsync("确定要审核提交吗"),<#
      } else {
      #>
      "确定要审核提交吗",<#
      }
      #>
      {<#
        if (isUseI18n) {
        #>
        confirmButtonText: await nsAsync("确定"),
        cancelButtonText: await nsAsync("取消"),<#
        } else {
        #>
        confirmButtonText: "确定",
        cancelButtonText: "取消",<#
        }
        #>
        type: "warning",
      },
    );
  } catch (err) {
    return;
  }
  await auditSubmit(id);
  ElMessage({<#
    if (isUseI18n) {
    #>
    message: await nsAsync("审核提交成功"),<#
    } else {
    #>
    message: "审核提交成功",<#
    }
    #>
    type: "success",
  });
  if (!changedIds.includes(id)) {
    changedIds.push(id);
  }
  const hasNext = await nextId();
  if (hasNext) {
    return;
  }
  onCloseResolve({
    type: "ok",
    changedIds,
  });
}

/** 审核通过 */
async function onAuditPass() {
  const id = dialogModel.id;
  if (!id) {
    return;
  }
  if (!permit("audit_pass")) {
    return;
  }
  try {
    await ElMessageBox.confirm(<#
      if (isUseI18n) {
      #>
      await nsAsync("确定要审核通过吗"),<#
      } else {
      #>
      "确定要审核通过吗",<#
      }
      #>
      {<#
        if (isUseI18n) {
        #>
        confirmButtonText: await nsAsync("确定"),
        cancelButtonText: await nsAsync("取消"),<#
        } else {
        #>
        confirmButtonText: "确定",
        cancelButtonText: "取消",<#
        }
        #>
        type: "warning",
      },
    );
  } catch (err) {
    return;
  }
  await auditPass(id);
  ElMessage({<#
    if (isUseI18n) {
    #>
    message: await nsAsync("审核通过成功"),<#
    } else {
    #>
    message: "审核通过成功",<#
    }
    #>
    type: "success",
  });
  if (!changedIds.includes(id)) {
    changedIds.push(id);
  }
  const hasNext = await nextId();
  if (hasNext) {
    return;
  }
  onCloseResolve({
    type: "ok",
    changedIds,
  });
}

const auditDialogRef = $(useTemplateRef<InstanceType<typeof AuditDialog>>("auditDialogRef"));

/** 审核拒绝 */
async function onAuditReject() {
  if (!auditDialogRef) {
    return;
  }
  const id = dialogModel.id;
  if (!id) {
    return;
  }
  if (!permit("audit_reject")) {
    return;
  }
  const {
    type,
  } = await auditDialogRef.showDialog({
    title: <#
      if (isUseI18n) {
      #>await nsAsync("审核拒绝")<#
      } else {
      #>"审核拒绝"<#
      }
      #><#
      if (opts?.lbl_field) {
      #> + " - " + dialogModel.<#=opts?.lbl_field#><#
      }
      #>,
    model: {
      id,
    },
    action: "reject",
  });
  if (type === "cancel") {
    return;
  }
  ElMessage({<#
    if (isUseI18n) {
    #>
    message: await nsAsync("审核拒绝成功"),<#
    } else {
    #>
    message: "审核拒绝成功",<#
    }
    #>
    type: "success",
  });
  if (!changedIds.includes(id)) {
    changedIds.push(id);
  }
  const hasNext = await nextId();
  if (hasNext) {
    return;
  }
  onCloseResolve({
    type: "ok",
    changedIds,
  });
}<#
if (hasReviewed) {
#>

/** 复核通过 */
async function onAuditReview() {
  const id = dialogModel.id;
  if (!id) {
    return;
  }
  if (!permit("audit_review")) {
    return;
  }
  try {
    await ElMessageBox.confirm(<#
      if (isUseI18n) {
      #>
      await nsAsync("确定要复核通过吗"),<#
      } else {
      #>
      "确定要复核通过吗",<#
      }
      #>
      {<#
        if (isUseI18n) {
        #>
        confirmButtonText: await nsAsync("确定"),
        cancelButtonText: await nsAsync("取消"),<#
        } else {
        #>
        confirmButtonText: "确定",
        cancelButtonText: "取消",<#
        }
        #>
        type: "warning",
      },
    );
  } catch (err) {
    return;
  }
  await auditReview(id);
  ElMessage({<#
    if (isUseI18n) {
    #>
    message: await nsAsync("复核通过成功"),<#
    } else {
    #>
    message: "复核通过成功",<#
    }
    #>
    type: "success",
  });
  if (!changedIds.includes(id)) {
    changedIds.push(id);
  }
  const hasNext = await nextId();
  if (hasNext) {
    return;
  }
  onCloseResolve({
    type: "ok",
    changedIds,
  });
}<#
}
#><#
}
#>

/** 保存并返回id */
async function save() {
  if (isReadonly) {
    return;
  }
  if (!formRef) {
    return;
  }
  if ((dialogAction === "edit" || dialogAction === "view") && !permit("edit")) {
    return;
  }
  if (dialogAction === "add" && !permit("add")) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  let id: <#=Table_Up#>Id | undefined = undefined;
  let msg = "";<#
  if (opts.noAdd !== true) {
  #>
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,<#
      for (const inlineForeignTab of inlineForeignTabs) {
        const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
        const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
        const hasOrderBy = columns.some((item) => item.COLUMN_NAME === "order_by");
        const table = inlineForeignTab.table;
        const mod = inlineForeignTab.mod;
        if (!inlineForeignSchema) {
          throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
          process.exit(1);
        }
        const inline_column_name = inlineForeignTab.column_name;
        const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
      #><#
        if (inline_foreign_type === "one2many") {
      #>
      <#=inline_column_name#>: [
        ...(dialogModel.<#=inline_column_name#> || [ ]).map((item) => ({
          ...item,<#
          if (hasOrderBy) {
          #>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          order_by: (item as any)._seq,<#
          }
          #>
          _seq: undefined,
          _type: undefined,
        })),
      ],<#
        } else if (inline_foreign_type === "one2one") {
      #>
      <#=inline_column_name#>: dialogModel.<#=inline_column_name#> || {<#
        if (hasOrderBy) {
        #>
        order_by: 1,<#
        }
        #>
      },<#
        }
      #><#
      }
      #>
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await create(dialogModel2);
    dialogModel.id = id;<#
    if (opts?.isRealData) {
    #>
    publish({
      topic: JSON.stringify({
        pagePath,
        action: "add",
      }),
      payload: id,
    });<#
    }
    #><#
    if (isUseI18n) {
    #>
    msg = await nsAsync("新增成功");<#
    } else {
    #>
    msg = "新增成功";<#
    }
    #>
  }<#
  }
  #><#
  if (opts.noAdd !== true && opts.noEdit !== true) {
  #> else <#
  }
  #><#
  if (opts.noEdit !== true) {
  #>if (dialogAction === "edit" || dialogAction === "view") {
    if (!dialogModel.id) {
      return;
    }
    const dialogModel2 = {
      ...dialogModel,<#
      for (const inlineForeignTab of inlineForeignTabs) {
        const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
        const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
        const hasOrderBy = columns.some((item) => item.COLUMN_NAME === "order_by");
        const table = inlineForeignTab.table;
        const mod = inlineForeignTab.mod;
        if (!inlineForeignSchema) {
          throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
          process.exit(1);
        }
        const inline_column_name = inlineForeignTab.column_name;
        const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
      #><#
        if (inline_foreign_type === "one2many") {
      #>
      <#=inline_column_name#>: [
        ...(dialogModel.<#=inline_column_name#> || [ ]).map((item) => ({
          ...item,<#
          if (hasOrderBy) {
          #>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          order_by: (item as any)._seq,<#
          }
          #>
          _seq: undefined,
          _type: undefined,
        })),
      ],<#
        } else if (inline_foreign_type === "one2one") {
      #>
      <#=inline_column_name#>: dialogModel.<#=inline_column_name#> || { },<#
        }
      #><#
      }
      #>
      id: undefined,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }<#
    if (hasAudit) {
    #>
    
    const defaultInput = await getDefaultInput();
    dialogModel2.<#=auditColumn#> = defaultInput.<#=auditColumn#>;<#
    }
    #>
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await updateById(
      dialogModel.id,
      dialogModel2,
    );<#
    if (opts?.isRealData) {
    #>
    publish({
      topic: JSON.stringify({
        pagePath,
        action: "edit",
      }),
      payload: id,
    });<#
    }
    #><#
    if (isUseI18n) {
    #>
    msg = await nsAsync("编辑成功");<#
    } else {
    #>
    msg = "编辑成功";<#
    }
    #>
  }<#
  }
  #>
  if (id) {
    if (!changedIds.includes(id)) {
      changedIds.push(id);
    }
  }
  if (msg) {
    ElMessage.success(msg);
  }
  return id;
}<#
if (opts.hideSaveAndCopy === false) {
#>

/** 保存并继续 */
async function onSaveAndCopy() {
  const id = await save();
  if (!id) {
    return;
  }
  dialogAction = "copy";
  const [<#
    if (hasDefaultInputColumn) {
    #>
    defaultInput,<#
    }
    #>
    data,<#
    if (hasOrderBy) {
    #>
    order_by,<#
    }
    #>
  ] = await Promise.all([<#
    if (hasDefaultInputColumn) {
    #>
    getDefaultInput(),<#
    }
    #>
    findOneModel({
      id,<#
      if (hasIsDeleted) {
      #>
      is_deleted,<#
      }
      #>
    }),<#
    if (hasOrderBy) {
    #>
    findLastOrderBy(),<#
    }
    #>
  ]);
  if (!data) {
    return;
  }
  dialogModel = {
    ...data,
    id: undefined,<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      if (column.noAdd && column.noEdit) continue;
      if (column.isAtt) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_locked") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "version") continue;
      if (column_name === "tenant_id") continue;
      if (column_name === "order_by") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (!column.readonly) {
        continue;
      }
    #>
    <#=column_name#>: defaultInput.<#=column_name#>,<#
    }
    #><#
    if (hasDefault) {
    #>
    is_default: undefined,
    is_default_lbl: undefined,<#
    }
    #><#
    if (hasLocked) {
    #>
    is_locked: undefined,
    is_locked_lbl: undefined,<#
    }
    #><#
    if (hasOrderBy) {
    #>
    order_by: order_by + 1,<#
    }
    #><#
    for (const inlineForeignTab of inlineForeignTabs) {
      const table = inlineForeignTab.table;
      const mod = inlineForeignTab.mod;
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inline_column_name = inlineForeignTab.column_name;
      const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
    #><#
      if (inline_foreign_type === "one2many") {
    #>
    // <#=inlineForeignTab.label#>
    <#=inline_column_name#>: data.<#=inline_column_name#>?.map((item) => ({
      ...item,
      id: undefined,
    })) || [ ],<#
      } else if (inline_foreign_type === "one2one") {
    #>
    // <#=inlineForeignTab.label#>
    <#=inline_column_name#>: data.<#=inline_column_name#> || { },<#
      }
    #><#
    }
    #>
  };
  Object.assign(dialogModel, { is_deleted: undefined });
}<#
}
#>

/** 保存 */
async function onSave() {
  const id = await save();
  if (!id) {
    return;
  }<#
  if (hasAudit) {
  #>
  if (permit("audit_submit")) {
    await onRefresh();
    if (dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Unsubmited ||
      dialogModel.<#=auditColumn#> === <#=Table_Up#>Audit.Rejected
    ) {
      try {
        await ElMessageBox.confirm(<#
          if (isUseI18n) {
          #>
          await nsAsync("确定要审核提交吗"),<#
          } else {
          #>
          "确定要审核提交吗",<#
          }
          #>
          {<#
            if (isUseI18n) {
            #>
            confirmButtonText: await nsAsync("确定"),
            cancelButtonText: await nsAsync("取消"),<#
            } else {
            #>
            confirmButtonText: "确定",
            cancelButtonText: "取消",<#
            }
            #>
            type: "warning",
          },
        );
        await auditSubmit(id);
      } catch (err) { /* empty */ }
    }
  }<#
  }
  #>
  const hasNext = await nextId();
  if (hasNext) {
    return;
  }
  onCloseResolve({
    type: "ok",
    changedIds,
  });
}<#
}
#><#
if (mod === "base" && table === "usr") {
#>

const default_org_idRef = $(useTemplateRef<InstanceType<typeof CustomSelect>>("default_org_idRef"));
let old_default_org_id: OrgId | null | undefined = undefined;

async function getOrgListApi() {
  const org_ids = dialogModel.org_ids || [ ];
  if (!dialogModel.default_org_id && old_default_org_id) {
    if (org_ids.includes(old_default_org_id)) {
      dialogModel.default_org_id = old_default_org_id;
    }
  }
  if (!dialogModel.default_org_id || !org_ids.includes(dialogModel.default_org_id)) {
    dialogModel.default_org_id = undefined;
  }
  let data = await getOrgList();
  data = data.filter((item) => {
    return org_ids.includes(item.id);
  });
  return data;
}

watch(
  () => [
    dialogModel.org_ids,
    default_org_idRef,
  ],
  async () => {
    if (!default_org_idRef) {
      return;
    }
    await default_org_idRef.refresh();
  },
);<#
}
#><#
if (hasInlineForeignTabs) {
#>

const inlineForeignTabLabel = $ref("<#=inlineForeignTabs[0].label#>");<#
}
#><#
for (const inlineForeignTab of inlineForeignTabs) {
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const inline_column_name = inlineForeignTab.column_name;
  const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
#><#
  if (inline_foreign_type === "one2many") {
#>

// <#=inlineForeignTab.label#>
const <#=inline_column_name#>Ref = $(useTemplateRef<InstanceType<typeof ElTable>>("<#=inline_column_name#>Ref"));

const <#=inline_column_name#>Data = $computed(() => {
  if (!isLocked && !isReadonly) {
    return [
      ...dialogModel.<#=inline_column_name#> ?? [ ],
      {
        _type: 'add',
      },
    ];
  }
  return dialogModel.<#=inline_column_name#> ?? [ ];
}) as (<#=Table_Up#>Input & { _type?: "add", is_sys: 0|1 })[];

async function <#=inline_column_name#>Add() {
  if (!dialogModel.<#=inline_column_name#>) {
    dialogModel.<#=inline_column_name#> = [ ];
  }
  const defaultModel = await getDefaultInput<#=Table_Up#>();
  dialogModel.<#=inline_column_name#>.push(defaultModel);
  <#=inline_column_name#>Ref?.setScrollTop(Number.MAX_SAFE_INTEGER);
}

function <#=inline_column_name#>Remove(row: <#=Table_Up#>Model) {
  if (!dialogModel.<#=inline_column_name#>) {
    return;
  }
  const idx = dialogModel.<#=inline_column_name#>.indexOf(row);
  if (idx >= 0) {
    dialogModel.<#=inline_column_name#>.splice(idx, 1);
  }
}

watch(
  () => [
    dialogModel.<#=inline_column_name#>,
    dialogModel.<#=inline_column_name#>?.length,
  ],
  () => {
    if (!dialogModel.<#=inline_column_name#>) {
      return;
    }
    for (let i = 0; i < dialogModel.<#=inline_column_name#>.length; i++) {
      const item = dialogModel.<#=inline_column_name#>[i];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item as any)._seq = i + 1;
    }
  },
);<#
  }
#><#
}
#><#
if (hasInlineMany2manyTab) {
#>

let inlineMany2manyTabLabel = $ref("<#=inlineMany2manyTabLabel#>");<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const table = many2many.table;
    const mod = many2many.mod;
    const inlineMany2manySchema = optTables[mod + "_" + table];
    if (!inlineMany2manySchema) {
      throw `表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const foreign_table = foreignKey.table;
    const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
    const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inlineMany2manyColumns = inlineMany2manySchema.columns;
#>

// <#=column_comment#>
const <#=column_name#>_<#=table#>_models = $computed(() => {
  return [
    ...dialogModel.<#=column_name#>_<#=table#>_models ?? [ ],
    {
      _type: "select",
    },
  ];
});

const <#=column_name#>TableDataSortableOptions = {
  handle: ".table_data_sortable_handle",
  onEnd: async (event: SortableEvent) => {
    const { oldIndex, newIndex } = event
    if (oldIndex == null || newIndex == null) {
      return;
    }
    if (!dialogModel.<#=column_name#>_<#=table#>_models) {
      return;
    }
    const oldData = dialogModel.<#=column_name#>_<#=table#>_models[oldIndex];
    dialogModel.<#=column_name#>_<#=table#>_models.splice(oldIndex, 1);
    dialogModel.<#=column_name#>_<#=table#>_models.splice(newIndex, 0, oldData);
    const <#=column_name#>_<#=table#>_modelsOld = dialogModel.<#=column_name#>_<#=table#>_models;
    dialogModel.<#=column_name#>_<#=table#>_models = [ ];
    await nextTick();
    dialogModel.<#=column_name#>_<#=table#>_models = <#=column_name#>_<#=table#>_modelsOld;
  },
} as SortableOptions;

function <#=column_name#>TableCellClassName(
  {
    row,
    column,
  }: {
    row: <#=Table_Up#>Input;
    column: TableColumnCtx<<#=Table_Up#>Input>;
  },
) {
  const prop = column.property;
  if (prop === "order_by") {
    return "table_data_sortable_handle";
  }
}

let <#=column_name#>_<#=foreign_table#>_models = $ref<<#=foreign_Table_Up#>Model[]>([ ]);

async function <#=column_name#>Remove(row: <#=Table_Up#>Input) {
  if (dialogModel.<#=column_name#>_<#=table#>_models) {
    const idx = dialogModel.<#=column_name#>_<#=table#>_models.indexOf(row);
    if (idx >= 0) {
      dialogModel.<#=column_name#>_<#=table#>_models.splice(idx, 1);
    }
  }
  if (row.<#=many2many.column2#> && dialogModel.<#=column_name#> && dialogModel.<#=column_name#>.length > 0) {
    const idx = dialogModel.<#=column_name#>.indexOf(row.<#=many2many.column2#>);
    if (idx >= 0) {
      dialogModel.<#=column_name#>.splice(idx, 1);
    }
  }
}<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  const column_comment = column.COLUMN_COMMENT;
  let is_nullable = column.IS_NULLABLE === "YES";
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  let data_type = column.DATA_TYPE;
  const many2many = column.many2many;
  if (!many2many || !foreignKey) continue;
  if (!column.inlineMany2manyTab) continue;
  const table = many2many.table;
  const mod = many2many.mod;
  const inlineMany2manySchema = optTables[mod + "_" + table];
  if (!inlineMany2manySchema) {
    throw `表: ${ mod }_${ table } 不存在`;
    process.exit(1);
  }
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const foreign_table = foreignKey.table;
  const foreign_tableUp = foreign_table && foreign_table.substring(0, 1).toUpperCase()+foreign_table.substring(1);
  const foreign_Table_Up = foreign_tableUp && foreign_tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const inlineMany2manyColumns = inlineMany2manySchema.columns;
#>

const <#=column_name#>ListSelectDialogRef = $(useTemplateRef<InstanceType<typeof ListSelectDialog>>("<#=column_name#>ListSelectDialogRef"));
const <#=column_name#>_<#=table#>Ref = $(useTemplateRef<InstanceType<typeof ElTable>>("<#=column_name#>_<#=table#>Ref"));

async function <#=column_name#>Select() {
  if (!<#=column_name#>ListSelectDialogRef) {
    return;
  }
  if (isLocked) {
    return;
  }
  dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? [ ];
  const res = await <#=column_name#>ListSelectDialogRef.showDialog({<#
    if (isUseI18n) {
    #>
    title: await nsAsync("选择") + " " + await nsAsync("<#=column_comment#>"),<#
    } else {
    #>
    title: "选择 <#=column_comment#>",<#
    }
    #>
    selectedIds: dialogModel.<#=column_name#>,
    isLocked: dialogModel.is_locked == 1 || is_deleted == 1,
  });
  const action = res.action;
  if (action !== "select") {
    return;
  }
  const selectedIds2 = res.selectedIds || [ ];
  dialogModel.<#=column_name#> = selectedIds2;
}<#
}
#>

watch(
  () => dialogModel.<#=column_name#>,
  async () => {
    if (!inited) {
      return;
    }
    inlineMany2manyTabLabel = "<#=column_name#>";
    if (!dialogModel.<#=column_name#> || dialogModel.<#=column_name#>.length === 0) {
      dialogModel.<#=column_name#>_<#=table#>_models = [ ];
      return;
    }
    let updateNum = 0;
    let createNum = 0;
    const inputs: <#=Table_Up#>Input[] = [ ];
    for (let i = 0; i < dialogModel.<#=column_name#>.length; i++) {
      const <#=many2many.column2#> = dialogModel.<#=column_name#>[i];
      const model = dialogModel.<#=column_name#>_<#=table#>_models?.find((item) => item.<#=many2many.column2#> === <#=many2many.column2#>);
      if (model) {
        inputs.push(model);
        updateNum++;
        continue;
      }
      const input = <#=column_name#>_<#=foreign_table#>_models.find((item) => item.id === <#=many2many.column2#>)!;
      const defaultInput = await getDefaultInput<#=Table_Up#>();
      inputs.push({
        ...defaultInput,
        <#=many2many.column2#>,
        <#=many2many.column2#>_lbl: input.lbl,
        <#=many2many.column1#>: dialogModel.id,
        <#=many2many.column1#>_lbl: dialogModel.lbl,
      });
      createNum++;
    }
    let removeNum = (dialogModel.<#=column_name#>_<#=table#>_models?.length || 0) - updateNum;
    if (removeNum < 0) {
      removeNum = 0;
    }
    dialogModel.<#=column_name#>_<#=table#>_models = inputs;
    let msg = "";
    if (removeNum > 0) {<#
      if (isUseI18n) {
      #>
      msg += await nsAsync("删除 {0} 项", removeNum);<#
      } else {
      #>
      msg += "删除 " + removeNum + " 项";<#
      }
      #>
    }
    if (createNum > 0) {
      if (msg) {
        msg += ", ";
      }<#
      if (isUseI18n) {
      #>
      msg += await nsAsync("新增 {0} 项", createNum);<#
      } else {
      #>
      msg += "新增 " + createNum + " 项";<#
      }
      #>
    }
    if (msg) {
      ElMessage.success(msg);
    }
    await nextTick();
    rights_ids_rights_pack_rightsRef?.setScrollTop(Number.MAX_VALUE);
  },
  {
    deep: true,
  },
);

watch(
  () => dialogModel.<#=column_name#>_<#=table#>_models,
  () => {
    if (!inited) {
      return;
    }
    dialogModel.<#=column_name#>_<#=table#>_models = dialogModel.<#=column_name#>_<#=table#>_models ?? [ ];
    for (let i = 0; i < dialogModel.<#=column_name#>_<#=table#>_models.length; i++) {
      const item = dialogModel.<#=column_name#>_<#=table#>_models[i];
      item.order_by = i + 1;
    }
  },
  {
    deep: true,
  },
);<#
  }
#><#
}
#>

async function onDialogOpen() {<#
  if (opts?.isRealData) {
  #>
  subscribe(
    JSON.stringify({
      pagePath,
      action: "edit",
    }),
    subscribeEditCallback,
  );
  subscribe(
    JSON.stringify({
      pagePath,
      action: "delete",
    }),
    subscribeDeleteCallback,
  );<#
  }
  #>
}

async function onDialogClose() {<#
  if (opts?.isRealData) {
  #>
  isShowEditCallbackConfirm = true;
  isShowDeleteCallbackConfirm = true;
  unSubscribe(
    JSON.stringify({
      pagePath,
      action: "edit",
    }),
    subscribeEditCallback,
  );
  unSubscribe(
    JSON.stringify({
      pagePath,
      action: "delete",
    }),
    subscribeDeleteCallback,
  );<#
  }
  #>
}

async function onBeforeClose() {
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  return true;
}

/** 点击取消关闭按钮 */
async function onClose() {
  if (!await onBeforeClose()) {
    return;
  }
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  if (!await onBeforeClose()) {
    return;
  }
  done(false);
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}<#
if (isUseI18n) {
#>

/** 初始化ts中的国际化信息 */
async function onInitI18ns() {
  const codes: string[] = [<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noList) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "is_deleted") continue;
    if (column_name === "tenant_id") continue;
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const column_comment = column.COLUMN_COMMENT || "";
  #>
    "<#=column_comment#>",<#
  }
  #>
  ];
  await Promise.all([
    initDetailI18ns(),
    initI18ns(codes),
  ]);
}
onInitI18ns();<#
}
#>

defineExpose({
  showDialog,
  refresh: onRefresh,
});
</script>
