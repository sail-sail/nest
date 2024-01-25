<template><#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasInlineForeignTabs = opts?.inlineForeignTabs && opts?.inlineForeignTabs.length > 0;
const inlineForeignTabs = opts?.inlineForeignTabs || [ ];
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
  if (column_name === "org_id") continue;
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
let detailCustomDialogType = opts.detailCustomDialogType;
if (!detailCustomDialogType) {
  if (columnNum > 20 || hasInlineForeignTabs) {
    detailCustomDialogType = "default";
  } else {
    detailCustomDialogType = "auto";
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
  if (opts.noAdd !== true) {
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
    <div
      :title="ns('重置')"
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
        v-if="!isReadonly"
        :title="ns('锁定')"
      >
        <ElIconUnlock
          class="unlock_but"
          @click="isReadonly = true;"
        >
        </ElIconUnlock>
      </div>
      <div
        v-else
        :title="ns('解锁')"
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
      un-p="x-8 y-5"
      un-box-border
      un-gap="4"
      un-justify-start
      un-items-center
    >
      <el-form
        ref="formRef"
        size="default"
        label-width="auto"<#
          if (columnNum > 4) {
        #>
        
        un-grid="~ cols-[repeat(2,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center<#
          } else {
        #>
        
        un-grid="~ cols-[repeat(1,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center<#
          }
        #>
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
      ><#
        const selectInputForeign_Table_Ups = [ ];
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
          if (column_name === "org_id") continue;
          let data_type = column.DATA_TYPE;
          let column_type = column.COLUMN_TYPE;
          let column_comment = column.COLUMN_COMMENT || "";
          let selectList = [ ];
          let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
          if (selectStr) {
            selectList = eval(`(${ selectStr })`);
          }
          if (column_comment.indexOf("[") !== -1) {
            column_comment = column_comment.substring(0, column_comment.indexOf("["));
          }
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
          if (column_type == null) {
            column_type = "";
          }
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
        #>
        
        <template v-if="(showBuildIn || builtInModel?.<#=column_name#> == null)<#=vIfStr ? ' && '+vIfStr : ''#>">
          <el-form-item
            :label="n('<#=column_comment#>')"
            prop="<#=column_name#>"<#
            if (column.isImg) {
            #>
            class="img_form_item"<#
            }
            #><#
            if (column.isTextarea && columnNum <= 4) {
            #>
            un-grid="col-span-1"<#
            } else if (column.isTextarea && columnNum > 4) {
            #>
            un-grid="col-span-2"<#
            }
            #>
          ><#
            if (column.isImg) {
            #>
            <UploadImage
              v-model="dialogModel.<#=column_name#>"<#
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
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
              }
              #>
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
              ref="default_org_idRef"
              :init="false"
              @change="old_default_org_id = dialogModel.default_org_id;"<#
              }
              #><#
              if (foreignKey.multiple) {
              #>
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? [ ]"<#
              }
              #>
              v-model="dialogModel.<#=column_name#>"<#
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
              })"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
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
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
              }
              #><#
              if (mod === "cron" && table === "cron_job" && column_name === "job_id") {
              #>
              @change="onJobId"<#
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
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? [ ]"<#
              }
              #>
              v-model="dialogModel.<#=column_name#>"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
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
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
              }
              #>
            ></SelectInput<#=Foreign_Table_Up#>><#
            } else if (foreignSchema && foreignSchema.opts?.list_tree
              && !foreignSchema.opts?.ignoreCodegen
              && !foreignSchema.opts?.onlyCodegenDeno
            ) {
            #>
            <CustomTreeSelect<#
              if (foreignKey.multiple) {
              #>
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? [ ]"<#
              }
              #>
              v-model="dialogModel.<#=column_name#>"
              :method="get<#=Foreign_Table_Up#>Tree"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
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
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
              }
              #>
            ></CustomTreeSelect><#
            } else if (selectList.length > 0) {
            #>
            <el-select
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? undefined"
              v-model="dialogModel.<#=column_name#>"
              un-w="full"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
              filterable
              default-first-option
              :clearable="true"
              @keyup.enter.stop
              :disabled="isLocked || isReadonly"
            ><#
              for (let item of selectList) {
                let value = item.value;
                let label = item.label;
                if (typeof(value) === "string") {
                  value = `'${ value }'`;
                } else if (typeof(value) === "number") {
                  value = value.toString();
                }
              #>
              <el-option
                :value="<#=value#>"
                :label="n('<#=label#>')"
              ></el-option><#
              }
              #>
            </el-select><#
            } else if (column.dict) {
            #>
            <DictSelect
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? undefined"
              v-model="dialogModel.<#=column_name#>"<#
              if (modelLabel) {
              #>
              v-model:model-label="dialogModel.<#=modelLabel#>"<#
              }
              #>
              code="<#=column.dict#>"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
              }
              #>
            ></DictSelect><#
            } else if (column.dictbiz) {
            #>
            <DictbizSelect
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? undefined"
              v-model="dialogModel.<#=column_name#>"<#
              if (modelLabel) {
              #>
              v-model:model-label="dialogModel.<#=modelLabel#>"<#
              }
              #>
              code="<#=column.dictbiz#>"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
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
              value-format="YYYY-MM-DD HH:mm:ss"<#
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
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
              }
              #>
            ></CustomDatePicker><#
            } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
            #>
            <CustomCheckbox
              v-model="dialogModel.<#=column_name#>"
              :true-readonly-label="`${ ns('是') }`"
              :false-readonly-label="`${ ns('否') }`"<#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
              }
              #>
            >
              <#=column_comment#>
            </CustomCheckbox><#
            } else if (column_type.startsWith("int")) {
            #>
            <CustomInputNumber
              v-model="dialogModel.<#=column_name#>"
              :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
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
              :precision="<#=precision#>"
              :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
              }
              #>
            ></CustomInputNumber><#
            } else {
            #>
            <CustomInput
              v-model="dialogModel.<#=column_name#>"<#
              if (column.isTextarea) {
              #>
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              @keyup.enter.stop<#
              }
              #>
              :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"<#
              if (column.readonly) {
              #>
              :readonly="true"<#
              } else {
              #>
              :readonly="isLocked || isReadonly"<#
              }
              #><#
              if (readonlyPlaceholder) {
              #>
              readonly-placeholder="<#=readonlyPlaceholder#>"<#
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
          if (column.isImg) {
          #><#
            if (columnNum > 4) {
          #>
          
          <div></div>
          <#
            }
          #><#
          }
          #>
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
      >
        <el-tabs
          v-model="inlineForeignTabLabel"
          class="el-flex-tabs"
          type="card"
          un-flex="~ [1_0_0] col"
          un-overflow-hidden
          un-w="full"
        ><#
          for (const inlineForeignTab of inlineForeignTabs) {
            const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
            const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
            const table = inlineForeignTab.table;
            const mod = inlineForeignTab.mod;
            if (!inlineForeignSchema) {
              throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
              process.exit(1);
            }
          #>
          
          <el-tab-pane
            label="<#=inlineForeignTab.label#>"
            name="<#=inlineForeignTab.label#>"
            un-flex="~ [1_0_0] col"
            un-overflow-hidden
          >
            <el-table
              ref="<#=table#>Ref"
              un-m="t-2"
              size="small"
              height="100%"
              :data="<#=table#>Data"
              class="tr_border_none"
            >
              
              <el-table-column
                prop="_seq"
                :label="ns('序号')"
                align="center"
                width="50"
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
                if (column_name === "org_id") continue;
                let data_type = column.DATA_TYPE;
                let column_type = column.COLUMN_TYPE;
                let column_comment = column.COLUMN_COMMENT || "";
                let selectList = [ ];
                let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
                if (selectStr) {
                  selectList = eval(`(${ selectStr })`);
                }
                if (column_comment.indexOf("[") !== -1) {
                  column_comment = column_comment.substring(0, column_comment.indexOf("["));
                }
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
              #>
              
              <el-table-column
                prop="<#=column_name#>"
                :label="n('<#=column_comment#>')"
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
                    <CustomSelect<#
                      if (foreignKey.multiple) {
                      #>
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? [ ]"<#
                      }
                      #>
                      v-model="row.<#=column_name#>"<#
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
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
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
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
                      }
                      #>
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
                      :method="get<#=Foreign_Table_Up#>Tree"
                      :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
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
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
                      }
                      #>
                    ></CustomTreeSelect><#
                    } else if (column.dict) {
                    #>
                    <DictSelect
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? undefined"
                      v-model="row.<#=column_name#>"<#
                      if (modelLabel) {
                      #>
                      v-model:model-label="row.<#=modelLabel#>"<#
                      }
                      #>
                      code="<#=column.dict#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
                      }
                      #>
                    ></DictSelect><#
                    } else if (column.dictbiz) {
                    #>
                    <DictbizSelect
                      :set="row.<#=column_name#> = row.<#=column_name#> ?? undefined"
                      v-model="row.<#=column_name#>"<#
                      if (modelLabel) {
                      #>
                      v-model:model-label="row.<#=modelLabel#>"<#
                      }
                      #>
                      code="<#=column.dictbiz#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
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
                      value-format="YYYY-MM-DD HH:mm:ss"<#
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
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
                      }
                      #>
                    ></CustomDatePicker><#
                    } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
                    #>
                    <CustomCheckbox
                      v-model="row.<#=column_name#>"
                      :true-readonly-label="`${ ns('是') }`"
                      :false-readonly-label="`${ ns('否') }`"<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
                      }
                      #>
                    >
                      <#=column_comment#>
                    </CustomCheckbox><#
                    } else if (column_type.startsWith("int")) {
                    #>
                    <CustomInputNumber
                      v-model="row.<#=column_name#>"
                      un-text="right"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
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
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
                      }
                      #>
                    ></CustomInputNumber><#
                    } else {
                    #>
                    <CustomInput
                      v-model="row.<#=column_name#>"
                      placeholder=" "<#
                      if (column.readonly) {
                      #>
                      :readonly="true"<#
                      } else {
                      #>
                      :readonly="isLocked || isReadonly"<#
                      }
                      #><#
                      if (readonlyPlaceholder) {
                      #>
                      readonly-placeholder="<#=readonlyPlaceholder#>"<#
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
                v-if="!isLocked && !isReadonly"
                prop="_operation"
                :label="ns('操作')"
                width="70"
                align="center"
                fixed="right"
              >
                <template #default="{ row }">
                  
                  <el-button
                    v-if="row._type === 'add'"
                    size="small"
                    plain
                    type="primary"
                    @click="<#=table#>Add"
                  >
                    {{ ns('新增') }}
                  </el-button>
                  
                  <el-button
                    v-else
                    size="small"
                    plain
                    type="danger"
                    @click="<#=table#>Remove(row)"
                  >
                    {{ ns('删除') }}
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
        <span>{{ n('关闭') }}</span>
      </el-button><#
      if (!opts.noAdd) {
      #>
      
      <el-button
        v-if="(dialogAction === 'add' || dialogAction === 'copy') && permit('add') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSaveAndCopy"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ n('保存并继续') }}</span>
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
        </template>
        <span>{{ n('保存') }}</span>
      </el-button><#
      }
      #><#
      if (!opts.noEdit) {
      #>
      
      <el-button
        v-if="(dialogAction === 'edit' || dialogAction === 'view') && permit('edit') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ n('保存') }}</span>
      </el-button><#
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
  </div>
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
  #>
  getDefaultInput,
} from "./Api";

import type {
  <#=Table_Up#>Id,<#
  if (mod === "base" && table === "usr") {
  #>
  OrgId,<#
  }
  #>
} from "@/typings/ids";

import type {
  <#=inputName#>,<#
  const foreignTableArr = [];
  for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "tenant_id") continue;
  if (column_name === "org_id") continue;
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
  const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  if (foreignSchema && foreignSchema.opts?.list_tree) {
    continue;
  }
  // if (table === foreignTable) continue;
  if (foreignTableArr.includes(foreignTable)) continue;
  foreignTableArr.push(foreignTable);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  if (selectInputForeign_Table_Ups.includes(Foreign_Table_Up)) {
    continue;
  }
#>
  <#=Foreign_Table_Up#>Model,<#
}
#>
} from "#/types";<#
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
    if (column_name === "org_id") continue;
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
  get<#=Foreign_Table_Up#>Tree,
} from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/Api";<#
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
#>

import type {<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    if (!inlineForeignSchema) {
      throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #><#
    if (!foreignTableArr.includes(table)) {
      foreignTableArr.push(table);
  #>
  // <#=inlineForeignTab.label#>
  <#=Table_Up#>Model,<#
    }
  #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "tenant_id") continue;
      if (column_name === "org_id") continue;
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
      if (selectInputForeign_Table_Ups.includes(Table_Up)) {
        continue;
      }
      if (foreignTableArr.includes(foreignTable)) continue;
      foreignTableArr.push(foreignTable);
  #>
  <#=Foreign_Table_Up#>Model,<#
    }
  }
  #>
} from "#/types";<#
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
      if (column_name === "org_id") continue;
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
    if (column_name === "org_id") continue;
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
    if (column_name === "org_id") continue;
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
if (mod === "cron" && table === "cron_job") {
#>

import cronstrue from "cronstrue/i18n";
import { lang } from "@/locales/index";

let locale = $computed(() => {
  if (lang === "zh-cn") {
    return "zh_CN";
  } else if (lang === "zh-tw") {
    return "zh_TW";
  }
});<#
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
#>

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: <#=Table_Up#>Id,
    },
  ],
}>();

const pagePath = "/<#=mod#>/<#=table#>";

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns,
} = useI18n(pagePath);

const permitStore = usePermitStore();

const permit = permitStore.getPermit(pagePath);

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
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
} as <#=inputName#>);

let ids = $ref<<#=Table_Up#>Id[]>([ ]);
let is_deleted = $ref<number>(0);
let changedIds = $ref<<#=Table_Up#>Id[]>([ ]);

let formRef = $ref<InstanceType<typeof ElForm>>();

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
      if (column_name === "org_id") continue;
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
    <#=column_name#>: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("<#=column_comment#>") }`,
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
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("不能大于 {0}", <#=validator.maximum#>) }`,
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
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("不能小于 {0}", <#=validator.minimum#>) }`,
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
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("长度不能超过 {0}", <#=validator.chars_max_length#>) }`,
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
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("长度不能小于 {0}", <#=validator.chars_min_length#>) }`,
      },<#
        } else if (validator.regex != null && [ "varchar", "text" ].includes(data_type)) {
      #>
      {
        type: "regexp",<#
          if (validator.regex != null) {
        #>
        pattern: "<#=validator.regex#>",<#
          }
        #>
        message: `${ n("<#=column_comment#>") } ${ await nsAsync("格式不正确") }`,
      },<#
        } else if (validator.email) {
      #>
      {
        type: "email",
        message: `${ await nsAsync("请输入正确的电子邮件") }`,
      },<#
        } else if (validator.url) {
      #>
      {
        type: "url",
        message: `${ await nsAsync("请输入正确的网址") }`,
      },<#
        } else if (validator.ip) {
      #>
      {
        type: "ip",
        message: `${ await nsAsync("请输入正确的IP地址") }`,
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
        required: true,
        message: `${ await nsAsync("请选择") } ${ n("<#=column_comment#>") }`,
      },
    ],<#
        }
    #><#
      }
    #><#
    }
    #>
  };
});

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

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: <#=inputName#>;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      id?: <#=Table_Up#>Id;
      ids?: <#=Table_Up#>Id[];
      is_deleted?: number | null;
    };
    action: DialogAction;
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  oldDialogTitle = dialogTitle;
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
  isShowEditCallbackConfirm = false;<#
  }
  #>
  is_deleted = model?.is_deleted ?? 0;
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    showBuildIn = toValue(arg?.showBuildIn) ?? showBuildIn;
    isReadonly = toValue(arg?.isReadonly) ?? isReadonly;
    <#
    if (hasLocked) {
    #>
    if (dialogAction === "add") {
      isLocked = false;
    } else {
      if (!permit("edit")) {
        isLocked = true;
      } else {
        isLocked = dialogModel.is_locked == 1 ?? toValue(arg?.isLocked) ?? isLocked;
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
    #>
  };
  if (dialogAction === "copy" && !model?.id) {
    dialogAction = "add";
  }
  if (action === "add") {
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
      ...builtInModel,
      ...model,<#
      if (hasOrderBy) {
      #>
      order_by: order_by + 1,<#
      }
      #>
    };
  } else if (dialogAction === "copy") {
    if (!model?.id) {
      return await dialogRes.dialogPrm;
    }
    const [
      data,<#
      if (hasOrderBy) {
      #>
      order_by,<#
      }
      #>
    ] = await Promise.all([
      findOne({
        id: model.id,<#
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
          if (column_name === "org_id") continue;
          let data_type = column.DATA_TYPE;
          let column_type = column.COLUMN_TYPE;
          let column_comment = column.COLUMN_COMMENT || "";
          if (!column.readonly) {
            continue;
          }
        #>
        <#=column_name#>: undefined,<#
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
        #>
        <#=table#>_models: data.<#=table#>_models?.map((item) => ({
          ...item,
          id: undefined,
        })) || [ ],<#
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
  } else if (dialogAction === "view") {
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
  () => [ isLocked, is_deleted, dialogNotice ],
  async () => {
    if (is_deleted) {
      dialogNotice = await nsAsync("(已删除)");
      return;
    }
    if (isLocked) {
      dialogNotice = await nsAsync("(已锁定)");
    } else {
      dialogNotice = "";
    }
  },
);<#
}
#><#
if (mod === "cron" && table === "cron_job") {
#>

let job_lbl = $ref<string>("");

// 任务
function onJobId(jobModel?: JobModel) {
  if (!jobModel) {
    job_lbl = "";
    return;
  }
  job_lbl = jobModel.lbl;
}

let cron_lbl = $computed(() => {
  if (!dialogModel.cron) {
    return "";
  }
  try {
    return cronstrue.toString(
      dialogModel.cron, {
        locale,
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
      await ElMessageBox.confirm(
        await nsAsync("确定要重置表单吗"),
        {
          confirmButtonText: await nsAsync("确定"),
          cancelButtonText: await nsAsync("取消"),
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
  ElMessage({
    message: await nsAsync("表单重置完毕"),
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
    await ElMessageBox.confirm(
      await nsAsync("此 {0} 已被其他用户编辑，是否刷新?", await nsAsync("<#=table_comment#>")),
      {
        confirmButtonText: await nsAsync("刷新"),
        cancelButtonText: await nsAsync("取消"),
        type: "warning",
      },
    );
    isShowEditCallbackConfirm = false;
  } catch (err) {
    isShowEditCallbackConfirm = false;
    return;
  }
  await onRefresh();
}<#
}
#>

/** 刷新 */
async function onRefresh() {
  if (!dialogModel.id) {
    return;
  }
  const data = await findOne({
    id: dialogModel.id,<#
    if (hasIsDeleted) {
    #>
    is_deleted,<#
    }
    #>
  });
  if (data) {
    dialogModel = {
      ...data,
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
  if (!isSucc) {
    ElMessage.warning(await nsAsync("已经是第一项了"));
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
  if (!isSucc) {
    ElMessage.warning(await nsAsync("已经是最后一项了"));
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
if (opts.noAdd !== true || opts.noEdit !== true) {
#>

watch(
  () => [
    inited,<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "is_deleted") continue;
      if (column_name === "tenant_id") continue;
      if (column_name === "org_id") continue;
      let column_type = column.COLUMN_TYPE;
      let data_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT;
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
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
      if (column_name === "org_id") continue;
      let column_type = column.COLUMN_TYPE;
      let data_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT;
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const isPassword = column.isPassword;
      if (isPassword) continue;
      if (column.readonly) continue;
      if (column.noEdit) continue;
    #><#
      if ((foreignKey && !foreignKey.multiple) || column.dict || column.dictbiz
        || data_type === "datetime" || data_type === "date"
      ) {
    #>
    if (!dialogModel.<#=column_name#>) {
      dialogModel.<#=column_name#>_lbl = "";
    }<#
      } else if (foreignKey && foreignKey.multiple) {
    #>
    if (!dialogModel.<#=column_name#> || dialogModel.<#=column_name#>.length === 0) {
      dialogModel.<#=column_name#>_lbl = [ ];
    }<#
      }
    #><#
    }
    #>
  },
);

/** 快捷键ctrl+shift+回车 */
async function onSaveAndCopyKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  if (dialogAction === "add" || dialogAction === "copy") {
    customDialogRef?.focus();
    await onSaveAndCopy();
  }
}

/** 快捷键ctrl+回车 */
async function onSaveKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  customDialogRef?.focus();
  await onSave();
}

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
      #>
      <#=table#>_models: [
        ...(dialogModel.<#=table#>_models || [ ]).map((item) => ({
          ...item,<#
          if (hasOrderBy) {
          #>
          order_by: (item as any)._seq,<#
          }
          #>
          _seq: undefined,
          _type: undefined,
        })),
      ],<#
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
    #>
    msg = await nsAsync("新增成功");
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
      #>
      <#=table#>_models: [
        ...(dialogModel.<#=table#>_models || [ ]).map((item) => ({
          ...item,<#
          if (hasOrderBy) {
          #>
          order_by: (item as any)._seq,<#
          }
          #>
          _seq: undefined,
          _type: undefined,
        })),
      ],<#
      }
      #>
      id: undefined,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
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
    #>
    msg = await nsAsync("编辑成功");
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
}

/** 保存并继续 */
async function onSaveAndCopy() {
  const id = await save();
  if (!id) {
    return;
  }
  dialogAction = "copy";
  const [
    data,<#
    if (hasOrderBy) {
    #>
    order_by,<#
    }
    #>
  ] = await Promise.all([
    findOne({
      id,
      is_deleted,
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
      if (column_name === "org_id") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (!column.readonly) {
        continue;
      }
    #>
    <#=column_name#>: undefined,<#
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
    #>
    <#=table#>_models: data.<#=table#>_models?.map((item) => ({
      ...item,
      id: undefined,
    })) || [ ],<#
    }
    #>
  };
  Object.assign(dialogModel, { is_deleted: undefined });
}

/** 保存 */
async function onSave() {
  const id = await save();
  if (!id) {
    return;
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
if (mod === "base" && table === "usr") {
#>

let default_org_idRef = $ref<InstanceType<typeof CustomSelect>>();
let old_default_org_id: OrgId | null | undefined = undefined;

async function getOrgListApi() {
  let org_ids = dialogModel.org_ids || [ ];
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

let inlineForeignTabLabel = $ref("<#=inlineForeignTabs[0].label#>");<#
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
#>

// <#=inlineForeignTab.label#>
let <#=table#>Ref = $ref<InstanceType<typeof ElTable>>();

let <#=table#>Data = $computed(() => {
  if (!isLocked && !isReadonly) {
    return [
      ...dialogModel.<#=table#>_models ?? [ ],
      {
        _type: 'add',
      },
    ];
  }
  return dialogModel.<#=table#>_models ?? [ ];
});

async function <#=table#>Add() {
  if (!dialogModel.<#=table#>_models) {
    dialogModel.<#=table#>_models = [ ];
  }
  const defaultModel = await getDefaultInput<#=Table_Up#>();
  dialogModel.<#=table#>_models.push(defaultModel);
  <#=table#>Ref?.setScrollTop(Number.MAX_SAFE_INTEGER);
}

function <#=table#>Remove(row: <#=Table_Up#>Model) {
  if (!dialogModel.<#=table#>_models) {
    return;
  }
  const idx = dialogModel.<#=table#>_models.indexOf(row);
  if (idx >= 0) {
    dialogModel.<#=table#>_models.splice(idx, 1);
  }
}

watch(
  () => [
    dialogModel.<#=table#>_models,
    dialogModel.<#=table#>_models?.length,
  ],
  () => {
    if (!dialogModel.<#=table#>_models) {
      return;
    }
    for (let i = 0; i < dialogModel.<#=table#>_models.length; i++) {
      const item = dialogModel.<#=table#>_models[i];
      (item as any)._seq = i + 1;
    }
  },
);<#
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
  );<#
  }
  #>
}

async function onDialogClose() {<#
  if (opts?.isRealData) {
  #>
  isShowEditCallbackConfirm = true;
  unSubscribe(
    JSON.stringify({
      pagePath,
      action: "edit",
    }),
    subscribeEditCallback,
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
}

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
    if (column_name === "org_id") continue;
    if (column_name === "tenant_id") continue;
    const isPassword = column.isPassword;
    if (isPassword) continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
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
onInitI18ns();

defineExpose({
  showDialog,
  refresh: onRefresh,
});
</script>
