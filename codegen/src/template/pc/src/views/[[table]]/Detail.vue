<template><#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
#>
<el-dialog
  draggable
  :fullscreen="fullscreen"
  v-model="dialogVisible"
  append-to-body
  :close-on-click-modal="false"
  :custom-class="columnNum > 20 ? 'custom_dialog' : 'custom_dialog auto_dialog'"
  top="0"
  :before-close="beforeClose"
>
  <template v-slot:title>
    <div class="dialog_title">
      <div class="title_lbl">
        <span class="dialogTitle_span">
          {{ dialogTitle }}
        </span>
        <span v-if="isModelDirty" class="isModelDirty_span">
          *
        </span>
      </div>
      <el-icon class="full_but" @click="setFullscreen">
        <FullScreen/>
      </el-icon>
    </div>
  </template>
  <div class="wrap_div">
    <div class="content_div">
      <el-form
        :class="columnNum <= 4 ? 'dialog_form1' : 'dialog_form2'"
        :model="dialogModel"
        ref="formRef"
        :rules="form_rules"
        :validate-on-rule-change="false"
        @keyup.enter.native="saveClk"
      ><#
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column.ignoreCodegen) continue;
          if (column.isAtt) continue;
          const column_name = column.COLUMN_NAME;
          if (column_name === "id") continue;
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
          const foreignTable = foreignKey && foreignKey.table;
          const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        #>
        
        <label class="form_label"><# if (require) { #>
          <span style="color: red;">*</span><#
          }
          #>
          <span><#=column_comment#></span>
        </label>
        <el-form-item prop="<#=column_name#>"<#
          if (column.isImg) {
        #> class="img_form_item"<#
        }
        #>><#
          if (column.isImg) {
          #>
          <UploadImage
            v-model="dialogModel.<#=column_name#>"<#
            if (column.attMaxSize > 1) {
          #>
            :maxSize="column.attMaxSize"<#
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
          } else if (foreignKey) {
          #>
          <el-select-v2
            :height="300"<#
            if (foreignKey.multiple) {
            #>
            multiple
            collapse-tags
            collapse-tags-tooltip<#
            }
            #>
            class="form_input"
            @keyup.enter.native.stop
            v-model="dialogModel.<#=column_name#>"
            placeholder="请选择<#=column_comment#>"
            :options="<#=foreignTable#>Info.data.map((item) => ({ value: item.<#=foreignKey.column#>, label: item.<#=foreignKey.lbl#> }))"
            filterable
            clearable
            :loading="!inited"
            :remote="<#=foreignTable#>Info.count > SELECT_V2_SIZE"
            :remote-method="<#=foreignTable#>FilterEfc"
          ></el-select-v2><#
          } else if (selectList.length > 0) {
          #>
          <el-select
            class="form_input"
            @keyup.enter.native.stop
            v-model="dialogModel.<#=column_name#>"
            placeholder="请选择<#=column_comment#>"
            filterable
            default-first-option
            clearable
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
              label="<#=label#>"
            ></el-option><#
            }
          #>
          </el-select><#
          } else if (data_type === "datetime" || data_type === "date") {
          #>
          <el-date-picker
            type="date"
            class="form_input"
            v-model="dialogModel.<#=column_name#>"<#
              if (data_type === "datetime") {
            #>
            value-format="YYYY-MM-DD HH:mm:ss"<#
              } else if (data_type === "date") {
            #>
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD 00:00:00"<#
              }
            #>
            placeholder="请选择<#=column_comment#>"
          ></el-date-picker><#
          } else if (column_type === "int(1)") {
          #>
          <el-checkbox
            class="form_input"
            v-model="dialogModel.<#=column_name#>"
            :false-label="0"
            :true-label="1"
          >
            <#=column_comment#>
          </el-checkbox><#
          } else if (column_type.startsWith("int")) {
          #>
          <el-input-number
            class="form_input"
            v-model="dialogModel.<#=column_name#>"
            :precision="0"
            :step="1"
            :step-strictly="true"
            :controls="false"
            placeholder="请输入<#=column_comment#>"
          ></el-input-number><#
          } else if (column.DATA_TYPE === "decimal") {
            let arr = JSON.parse("["+column_type.substring(column_type.indexOf("(")+1, column_type.lastIndexOf(")"))+"]");
            let precision = Number(arr[1]);
            let max = "";
            for (let m = 0; m < Number(arr[0])-precision; m++) {
              max += "9";
            }
            max = Number(max)+1-Math.pow(10, -precision);
          #>
          <el-input-number
            class="form_input"
            v-model="dialogModel.<#=column_name#>"
            :max="<#=max#>"
            :precision="<#=precision#>"
            :controls="false"
            placeholder="请输入<#=column_comment#>"
          ></el-input-number><#
          } else {
          #>
          <el-input
            class="form_input"
            v-model="dialogModel.<#=column_name#>"
            placeholder="请输入<#=column_comment#>"
          ></el-input><#
          }
          #>
        </el-form-item><#
        if (column.isImg) {
        #>
        
        <template v-if="columnNum > 4">
          <div></div>
          <div></div>
        </template><#
        }
        #><#
        }
        #>
        
      </el-form>
    </div>
    <div class="toolbox_div">
      <el-button
        type="primary"
        :disabled="!isModelDirty"
        :icon="CircleCheck"
        class="save_but"
        @click="saveClk"
      >
        保存
      </el-button>
      <div class="page_div">
        <template v-if="ids && ids.length > 0">
          <el-button
            type="text"
            class="prev_but"
            :disabled="ids.indexOf(dialogModel.id) <= 0"
            @click="prevIdClk"
          >
            上一页
          </el-button>
          <span class="detail_pg_span">
            <span>
              {{ ids.indexOf(dialogModel.id) + 1 }} / {{ ids.length }}
            </span>
          </span>
          <el-button
            type="text"
            class="next_but"
            :disabled="ids.indexOf(dialogModel.id) >= ids.length - 1"
            @click="nextIdClk"
          >
            下一页
          </el-button>
        </template>
        <span class="chg_ids_span" v-if="changedIds.length > 0">
          {{ changedIds.length }}
        </span>
      </div>
    </div>
  </div>
</el-dialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElIcon,
  ElMessage,
  ElMessageBox,
  ElForm,
  ElFormItem,
  FormItemRule,
  ElInput,
  ElInputNumber,
  ElCheckbox,
  ElSelect,
  ElSelectV2,
  ElOption,
  ElDatePicker,
  ElButton,
} from "element-plus";
import {
  CircleCheck,
  FullScreen,
} from "@element-plus/icons-vue";<#
const hasImg = columns.some((item) => item.isImg);
#><#
if (hasImg) {
#>
import UploadImage from "@/components/UploadImage.vue";<#
}
#>
import { useFullscreenEffect } from "@/compositions/fullscreen";
import {
  deepCompare,
  SELECT_V2_SIZE,
} from "@/views/common/App";
import {
  create,
  findById<#
  if(hasOrderBy) {
  #>,
  findLastOrderBy<#
  }
  #>,
  updateById,
} from "./Api";

import { <#=tableUp#>Model } from "./Model";<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (!foreignKey) continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  if (table === foreignTable) continue;
#>
import { <#=foreignTableUp#>Model } from "../<#=foreignTable#>/Model";<#
}
#>

import {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
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
    if (foreignKey) {
  #>
  findAllAndCount<#=foreignTableUp#>,
  findAll<#=foreignTableUp#>,<#
    }
  }
  #>
} from "./Api";

const emit = defineEmits([
  "change",
  "nextId",
]);

let inited = $ref(false);
let columnNum = $ref(<#=columns.length-1#>);

let { fullscreen, setFullscreen } = $(useFullscreenEffect());

let dialogTitle = $ref("");
let dialogVisible = $ref(false);
let dialogAction = $ref("add");

let dialogModel: <#=tableUp#>Model = $ref({<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
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
});

let oldDialogModel: <#=tableUp#>Model = $ref({<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
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
});
let ids: string[] = $ref([ ]);
let oldIds: string[] = $ref([ ]);
let changedIds: string[] = $ref([ ]);

let formRef = $ref<InstanceType<typeof ElForm>>();

// 表单校验
let form_rules = $ref<Record<string, FormItemRule | FormItemRule[]>>({<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
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
    { required: true, message: "请输入<#=column_comment#>" },
  ],<#
      } else {
  #>
  <#=column_name#>: [
    { required: true, message: "请选择<#=column_comment#>" },
  ],<#
      }
  #><#
    }
  #><#
  }
  #>
});

// 下拉框列表
<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  const data_type = column.DATA_TYPE;
  const column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
#><#
  if (foreignKey) {
#>
let <#=foreignTable#>Info: { count: number, data: <#=foreignTableUp#>Model[] } = $ref({ count: 0, data: [ ] });<#
  }
}
#>

// 获取下拉框列表
async function getSelectListEfc() {
  [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const defaultSort = foreignKey && foreignKey.defaultSort;
    #><#
      if (foreignKey) {
    #>
    <#=foreignTable#>Info,<#
      }
    }
    #>
  ] = await Promise.all([<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const defaultSort = foreignKey && foreignKey.defaultSort;
  #><#
    if (foreignKey) {
  #>
    findAllAndCount<#=foreignTableUp#>(
      {<#
        if (defaultSort && defaultSort.prop) {
      #>
        orderBy: "<#=defaultSort.prop#>",
        orderDec: "<#=defaultSort.order#>",<#
        }
      #>
      },
      {
        pgSize: SELECT_V2_SIZE,
      },
    ),<#
    }
  }
  #>
  ]);
}
<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  const data_type = column.DATA_TYPE;
  const column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const defaultSort = foreignKey && foreignKey.defaultSort;
#><#
  if (foreignKey) {
#>
// <#=column_comment#>下拉框远程搜索
async function <#=foreignTable#>FilterEfc(query: string) {
  <#=foreignTable#>Info.data = await findAll<#=foreignTableUp#>({<#
      if (defaultSort && defaultSort.prop) {
    #>
    orderBy: "<#=defaultSort.prop#>",
    orderDec: "<#=defaultSort.order#>",<#
      }
    #>
    lbl: query ? `%${ query }%` : undefined,
  }, { pgSize: SELECT_V2_SIZE }, { notLoading: true });
}<#
  }
}
#>

// 打开对话框
async function showDialog(
  { title, model, action }: { title?: string, model?: any, action: "add"|"edit" },
): Promise<void> {
  inited = false;
  if (formRef) {
    formRef.resetFields();
  }
  dialogAction = action;
  if (title) {
    dialogTitle = title;
  }
  ids = [ ];
  oldIds = [ ];
  changedIds = [ ];
  dialogModel = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
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
      } else if (column_type.startsWith("int") || column_type.startsWith("decimal")) {
    #>
    <#=column_name#>: 0,<#
      }
    }
    #>
  };
  oldDialogModel = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
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
      } else if (column_type.startsWith("int") || column_type.startsWith("decimal")) {
    #>
    <#=column_name#>: 0,<#
      }
    }
    #>
  };
  await getSelectListEfc();
  if (action === "add") {
    dialogModel = {<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
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
        } else if (column_type.startsWith("int") || column_type.startsWith("decimal")) {
          let COLUMN_DEFAULT = Number(column.COLUMN_DEFAULT || 0);
      #>
      <#=column_name#>: <#=String(COLUMN_DEFAULT)#>,<#
        }
      }
      #>
      ...model,
    };
    oldDialogModel = {<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
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
        } else if (column_type.startsWith("int") || column_type.startsWith("decimal")) {
      #>
      <#=column_name#>: 0,<#
        }
      }
      #>
      ...model,
    };<#
    if (hasOrderBy) {
    #>
    const order_by = await findLastOrderBy();
    dialogModel.order_by = order_by + 1;
    oldDialogModel.order_by = dialogModel.order_by;<#
    }
    #>
  } else if (action === "edit") {
    ids = model.ids;
    oldIds = model.ids;
    if (!ids || ids.length === 0 && model.id) {
      ids = [ model.id ];
      oldIds = [ model.id ];
    }
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      oldDialogModel.id = ids[0];
      await refreshEfc();
    }
  }
  if (formRef) {
    formRef.clearValidate();
  }
  inited = true;
  dialogVisible = true;
}

// 是否有改动
let isModelDirty = $computed(() => !deepCompare(dialogModel, oldDialogModel));

// 刷新
async function refreshEfc() {
  if (formRef) {
    formRef.clearValidate();
  }
  const data = await findById(dialogModel.id);
  if (data) {
    dialogModel = data;
    oldDialogModel = Object.assign({ }, data);
  }
}

// 点击上一页
async function prevIdClk() {
  if (!(await vldInputChg())) return;
  await prevId();
}

// 点击下一页
async function nextIdClk() {
  if (!(await vldInputChg())) return;
  await nextId();
}

// 下一页
async function nextId() {
  if (!dialogModel.id) {
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      oldDialogModel.id = ids[0];
    } else {
      return false;
    }
  } else {
    const idx = ids.indexOf(dialogModel.id);
    if (idx >= 0 && idx < ids.length - 1) {
      dialogModel.id = ids[idx + 1];
      oldDialogModel.id = ids[idx + 1];
    } else {
      return false;
    }
  }
  await refreshEfc();
  emit("nextId", { dialogAction, id: dialogModel.id });
  return true;
}

// 上一页
async function prevId() {
  if (!dialogModel.id) {
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      oldDialogModel.id = ids[0];
    }
  } else {
    const idx = ids.indexOf(dialogModel.id);
    if (idx > 0) {
      dialogModel.id = ids[idx - 1];
      oldDialogModel.id = ids[idx - 1];
    } else {
      return false;
    }
  }
  await refreshEfc();
  emit("nextId", { dialogAction, id: dialogModel.id });
  return true;
}

// 确定
async function saveClk() {
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  let id = undefined;
  let msg = "";
  if (dialogAction === "add") {
    id = await create(dialogModel);
    dialogModel.id = id;
    oldIds.push(id);
    msg = `增加成功!`;
  } else if (dialogAction === "edit") {
    id = await updateById(dialogModel.id, dialogModel);
    msg = `修改成功!`;
  }
  if (id) {
    changedIds.push(dialogModel.id);
    ElMessage.success(msg);
    const oldId = dialogModel.id;
    let isNext = await nextId();
    if (!isNext) {
      isNext = await prevId();
    }
    if (!isNext) {
      dialogVisible = false;
      emit("change", {
        action: dialogAction,
        ids: oldIds,
        changedIds,
      });
    } else {
      ids = ids.filter((id) => id !== oldId);
    }
  }
}

// 校验是否有改动
async function vldInputChg(): Promise<boolean> {
  if (isModelDirty) {
    try {
      await ElMessageBox.confirm(`尚未保存, 是否继续?`, {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning",
      });
    } catch (err) {
      return false;
    }
    return true;
  }
  return true;
}

// 窗口关闭之前判断是否有改动
async function beforeClose(done: (cancel: boolean) => void) {
  if (await vldInputChg()) {
    if (changedIds.length > 0) {
      emit("change", {
        action: dialogAction,
        ids: oldIds,
        changedIds,
      });
    }
    done(false);
  }
}

defineExpose({ showDialog });
</script>

<style lang="scss" scoped>
.wrap_div {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-basis: inherit;
}
.content_div {
  flex: 1 0 0;
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  flex-basis: inherit;
}
.toolbox_div {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog_form1 {
  display: grid;
  grid-template-columns: repeat(1, minmax(min-content, max-content) 280px);
  justify-items: end;
  align-items: center;
  grid-row-gap: 15px;
  grid-column-gap: 5px;
  grid-template-rows: auto;
  place-content: center;
}

.dialog_form2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(min-content, max-content) 280px);
  justify-items: end;
  align-items: center;
  grid-row-gap: 15px;
  grid-column-gap: 5px;
  grid-template-rows: auto;
  place-content: center;
}
.form_label {
  margin-left: 3px;
  text-align: right;
}
.form_label::after {
  content: ":";
}
.form_input {
  width: 100%;
}
.save_but {
  margin-left: inherit;
}
.page_div {
  position: absolute;
  right: 10px;
  color: gray;
  font-size: 12px;
}
.chg_ids_span {
  margin-left: 5px;
}
.prev_but {
  margin-right: 5px;
}
.next_but {
  margin-left: 3px;
}
.isModelDirty_span {
  color: red;
  position: relative;
  top: 2px;
  font-weight: bold;
  margin-left: 3px;
}
</style>
