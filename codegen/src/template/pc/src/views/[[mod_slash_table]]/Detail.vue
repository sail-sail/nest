<template><#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
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
  Table_Up = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
  modelName = Table_Up + "model";
  fieldCommentName = Table_Up + "fieldComment";
  inputName = Table_Up + "input";
  searchName = Table_Up + "search";
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
  columnNum++;
}
#>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-p="5"
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
        :validate-on-rule-change="false"<#
        if (opts.noAdd !== true || opts.noEdit !== true) {
        #>
        @keyup.enter="saveClk"<#
        }
        #>
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
          if (column_name === "version") continue;
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
              :maxFileSize="<#=column.maxFileSize#>"<#
            }
            #><#
            if (column.attAccept) {
            #>
              accept="<#=column.attAccept#>"<#
            }
            #>
            ></UploadImage><#
            } else if (
              foreignKey
              && (foreignKey.selectType === "select" || foreignKey.selectType == null)
            ) {
            #>
            <CustomSelect<#
              if (mod === "base" && table === "usr" && column_name === "default_dept_id") {
              #>
              ref="default_dept_idRef"
              :init="false"
              @change="old_default_dept_id = dialogModel.default_dept_id;"<#
              }
              #><#
              if (foreignKey.multiple) {
              #>
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? [ ]"<#
              }
              #>
              v-model="dialogModel.<#=column_name#>"<#
              if (mod === "base" && table === "usr" && column_name === "default_dept_id") {
              #>
              :method="getDeptListApi"<#
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
              un-w="full"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"<#
              if (foreignKey.multiple) {
              #>
              multiple<#
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
              #>
            ></SelectInput<#=Foreign_Table_Up#>><#
            } else if (foreignKey && foreignKey.selectType === "tree") {
            #>
            <CustomTreeSelect<#
              if (foreignKey.multiple) {
              #>
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? [ ]"<#
              }
              #>
              v-model="dialogModel.<#=column_name#>"
              :method="get<#=Foreign_Table_Up#>Tree"
              un-w="full"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
              :props="{
                label: '<#=foreignKey.lbl#>',
                children: 'children',
              }"
              check-strictly
              :render-after-expand="false"
              :default-expand-all="true"
              show-checkbox
              check-on-click-node<#
              if (foreignKey.multiple) {
              #>
              multiple<#
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
              v-model="dialogModel.<#=column_name#>"
              code="<#=column.dict#>"
              un-w="full"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            ></DictSelect><#
            } else if (column.dictbiz) {
            #>
            <DictbizSelect
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? undefined"
              v-model="dialogModel.<#=column_name#>"
              code="<#=column.dictbiz#>"
              un-w="full"
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            ></DictbizSelect><#
            } else if (data_type === "datetime" || data_type === "date") {
            #>
            <el-date-picker
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? undefined"
              v-model="dialogModel.<#=column_name#>"
              un-w="full"<#
                if (data_type === "datetime") {
              #>
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"<#
                } else if (data_type === "date") {
              #>
              type="date"
              format="YYYY-MM-DD"<#
                }
              #>
              :placeholder="`${ ns('请选择') } ${ n('<#=column_comment#>') }`"
            ></el-date-picker><#
            } else if (column_type.startsWith("int(1)") || column_type.startsWith("tinyint(1)")) {
            #>
            <el-checkbox
              :set="0"
              un-w="full"
              v-model="dialogModel.<#=column_name#>"
              :false-label="0"
              :true-label="1"
            >
              <#=column_comment#>
            </el-checkbox><#
            } else if (column_type.startsWith("int")) {
            #>
            <el-input-number
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? undefined"
              v-model="dialogModel.<#=column_name#>"
              un-w="full"
              :precision="0"
              :step="1"
              :step-strictly="true"
              :controls="false"
              :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"
              :clearable="true"
            ></el-input-number><#
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
            <el-input-number
              :set="dialogModel.<#=column_name#> = dialogModel.<#=column_name#> ?? undefined"
              v-model="dialogModel.<#=column_name#>"
              un-w="full"
              :max="<#=max#>"<#
                if (min) {
              #>
              :min="<#=min#>"<#
                }
              #>
              :precision="<#=precision#>"
              :controls="false"
              :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"
              :clearable="true"
            ></el-input-number><#
            } else {
            #>
            <el-input
              v-model="dialogModel.<#=column_name#>"<#
              if (column.isTextarea) {
              #>
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              @keyup.enter.stop<#
              }
              #>
              un-w="full"
              :placeholder="`${ ns('请输入') } ${ n('<#=column_comment#>') }`"
              :clearable="true"
            ></el-input><#
            }
            #>
          </el-form-item><#
          if (column.isImg) {
          #>
          
          <#
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
        
      </el-form>
    </div>
    <div
      un-p="y-2.5"
      un-flex
      un-justify-center
      un-items-center
    >
      
      <el-button
        plain
        @click="closeClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ n('关闭') }}</span>
      </el-button><#
      if (opts.noAdd !== true || opts.noEdit !== true) {
      #>
      
      <el-button
        plain
        type="primary"
        @click="saveClk"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ n('保存') }}</span>
      </el-button><#
      }
      #>
      
      <div
        v-if="(ids && ids.length > 1)"
        un-text="3 [var(--el-text-color-regular)]"
        un-pos-absolute
        un-right="2"
      >
        
        <el-button
          link
          :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) <= 0"
          @click="prevIdClk"
        >
          {{ n('上一项') }}
        </el-button>
        
        <span>
          {{ (dialogModel.id && ids.indexOf(dialogModel.id) || 0) + 1 }} / {{ ids.length }}
        </span>
        
        <el-button
          link
          :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) >= ids.length - 1"
          @click="nextIdClk"
        >
          {{ n('下一项') }}
        </el-button>
        
        <span v-if="changedIds.length > 0">
          {{ changedIds.length }}
        </span>
        
      </div>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import {<#
  if (opts.noAdd !== true) {
  #>
  create,<#
  }
  #>
  findById,<#
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
} from "./Api";

import {
  type <#=inputName#>,<#
  const foreignTableArr = [];
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
  type <#=Foreign_Table_Up#>Model,<#
}
#>
} from "#/types";

import {<#
  const foreignTableArr2 = [];
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
const foreignTableArr3 = [];
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
  if (!foreignKey || foreignKey.selectType !== "tree") {
    continue;
  }
  if (foreignKey.showType === "dialog") {
    continue;
  }
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
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
#>

const emit = defineEmits<
  (
    e: "nextId",
    value: {
      dialogAction: DialogAction,
      id: string,
    },
  ) => void
>();

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns,
} = useI18n("/<#=mod#>/<#=table#>");

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit";
let dialogAction = $ref<DialogAction>("add");

let dialogModel = $ref({<#
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

let ids = $ref<string[]>([ ]);
let changedIds = $ref<string[]>([ ]);

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
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      let require = column.require;
      if (data_type == "datetime" || data_type == "date") {
        column_comment = column_comment + "开始";
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    #><#
      if (require) {
        if (!foreignKey) {
    #>
    <#=column_name#>: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("<#=column_comment#>") }`,
      },
    ],<#
        } else {
    #>
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
  changedIds: string[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<<#=inputName#>>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 增加时的默认值 */
async function getDefaultInput() {
  const defaultInput: <#=inputName#> = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (!column.COLUMN_DEFAULT) continue;
      let defaultValue = column.COLUMN_DEFAULT.toString();
      if (selectList.length > 0) {
        if (typeof selectList[0].value === "string") {
          defaultValue = `"${ defaultValue }"`;
        } else {
          defaultValue = defaultValue;
        }
      } else if (column_type.startsWith("int") || column_type.startsWith("tinyint") || column_type.startsWith("decimal")) {
        defaultValue = defaultValue;
      } else {
        defaultValue = `"${ defaultValue }"`;
      }
    #>
    <#=column_name#>: <#=defaultValue#>,<#
    }
    #>
  };
  return defaultInput;
}

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: <#=inputName#>;
    showBuildIn?: Ref<boolean> | boolean;
    model?: {
      id?: string;
      ids?: string[];
    };
    action: DialogAction;
  },
) {
  inited = false;
  const title = arg?.title;
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({<#
    if (columnNum > 20) {
    #>
    type: "default",<#
    } else {
    #>
    type: "auto",<#
    }
    #>
    title,
    pointerPierce: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  builtInModel = arg?.builtInModel;
  showBuildIn = unref(arg?.showBuildIn) ?? false;
  dialogAction = action || "add";
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
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
    const data = await findById(model.id);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,<#
        if (hasLocked) {
        #>
        is_locked: undefined,
        is_locked_lbl: undefined,<#
        }
        #>
      };
    }
  } else if (action === "edit") {
    if (!model || !model.ids) {
      return await dialogRes.dialogPrm;
    }
    ids = model.ids;
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      await refreshEfc();
    }
  }
  inited = true;
  return await dialogRes.dialogPrm;
}

/** 刷新 */
async function refreshEfc() {
  if (!dialogModel.id) {
    return;
  }
  const data = await findById(dialogModel.id);
  if (data) {
    dialogModel = {
      ...data,
    };<#
    if (mod === "base" && table === "usr") {
    #>
    old_default_dept_id = dialogModel.default_dept_id;<#
    }
    #>
  }
}

/** 点击上一项 */
async function prevIdClk() {
  await prevId();
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
  await refreshEfc();
  emit(
    "nextId",
    {
      dialogAction,
      id: dialogModel.id!,
    },
  );
  return true;
}

/** 点击下一项 */
async function nextIdClk() {
  await nextId();
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
  await refreshEfc();
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

/** 确定 */
async function saveClk() {
  if (!formRef) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  let id: string | undefined = undefined;
  let msg = "";<#
  if (opts.noAdd !== true) {
  #>
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    id = await create(dialogModel2);
    dialogModel.id = id;
    msg = await nsAsync("添加成功");
  }<#
  }
  #><#
  if (opts.noAdd !== true && opts.noEdit !== true) {
  #> else <#
  }
  #><#
  if (opts.noEdit !== true) {
  #>if (dialogAction === "edit") {
    if (!dialogModel.id) {
      return;
    }
    const dialogModel2 = {
      ...dialogModel,
        ...builtInModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    id = await updateById(
      dialogModel.id,
      dialogModel2,
    );
    msg = await nsAsync("修改成功");
  }<#
  }
  #>
  if (id) {
    if (!changedIds.includes(id)) {
      changedIds.push(id);
    }
    ElMessage.success(msg);
    const hasNext = await nextId();
    if (hasNext) {
      return;
    }
    onCloseResolve({
      type: "ok",
      changedIds,
    });
  }
}<#
}
#><#
if (mod === "base" && table === "usr") {
#>

let default_dept_idRef = $ref<InstanceType<typeof CustomSelect>>();
let old_default_dept_id: string | null | undefined = undefined;

async function getDeptListApi() {
  let dept_ids = dialogModel.dept_ids || [ ];
  if (!dialogModel.default_dept_id && old_default_dept_id) {
    if (dept_ids.includes(old_default_dept_id)) {
      dialogModel.default_dept_id = old_default_dept_id;
    }
  }
  if (!dialogModel.default_dept_id || !dept_ids.includes(dialogModel.default_dept_id)) {
    dialogModel.default_dept_id = undefined;
  }
  let data = await getDeptList();
  data = data.filter((item) => {
    return dept_ids.includes(item.id);
  });
  return data;
}

watch(
  () => dialogModel.dept_ids,
  async () => {
    if (!default_dept_idRef) {
      return;
    }
    await default_dept_idRef.refresh();
  },
);<#
}
#>

/** 点击取消关闭按钮 */
function closeClk() {
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}

/** 初始化ts中的国际化信息 */
async function initI18nsEfc() {
  const codes: string[] = [<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noList) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
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
initI18nsEfc();

defineExpose({ showDialog });
</script>
