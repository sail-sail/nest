<template>
<el-dialog
  v-model="dialogVisible"
  :fullscreen="fullscreen"
  append-to-body
  :close-on-click-modal="false"
  class="custom_dialog auto_dialog"
  top="0"
  :before-close="beforeClose"
>
  <template #header>
    <div
      v-draggable
      class="dialog_title"
    >
      <div class="title_lbl">
        <span class="dialogTitle_span">
          {{ dialogTitle }}
        </span>
      </div>
      <el-icon
        class="full_but"
        @click="setFullscreen"
      >
        <FullScreen />
      </el-icon>
    </div>
  </template>
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
        
        un-justify-end
        un-items-end
        un-grid="~ rows-[auto] cols-[repeat(2,minmax(min-content,max-content)_280px)]"
        un-gap="x-1 y-4"
        un-place-content-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
      >
        
        <template v-if="builtInModel?.lbl == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span un-text="red">*</span>
            <span>名称</span>
          </label>
          <el-form-item
            prop="lbl"
            un-h="full"
          >
            <el-input
              v-model="dialogModel.lbl"
              
              un-w="full"
              
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.state == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span un-text="red">*</span>
            <span>状态</span>
          </label>
          <el-form-item
            prop="state"
            un-h="full"
          >
            <el-select
              :set="dialogModel.state = dialogModel.state ?? undefined"
              v-model="dialogModel.state"
              
              un-w="full"
              
              placeholder="请选择状态"
              filterable
              default-first-option
              clearable
              @keyup.enter.stop
            >
              <el-option
                :value="'running'"
                label="运行中"
              ></el-option>
              <el-option
                :value="'success'"
                label="成功"
              ></el-option>
              <el-option
                :value="'fail'"
                label="失败"
              ></el-option>
              <el-option
                :value="'cancel'"
                label="取消"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.type == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span un-text="red">*</span>
            <span>类型</span>
          </label>
          <el-form-item
            prop="type"
            un-h="full"
          >
            <el-select
              :set="dialogModel.type = dialogModel.type ?? undefined"
              v-model="dialogModel.type"
              
              un-w="full"
              
              placeholder="请选择类型"
              filterable
              default-first-option
              clearable
              @keyup.enter.stop
            >
              <el-option
                :value="'text'"
                label="文本"
              ></el-option>
              <el-option
                :value="'download'"
                label="下载"
              ></el-option>
              <el-option
                :value="'inline'"
                label="查看"
              ></el-option>
              <el-option
                :value="'tag'"
                label="标签"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.result == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span>执行结果</span>
          </label>
          <el-form-item
            prop="result"
            un-h="full"
          >
            <el-input
              v-model="dialogModel.result"
              
              un-w="full"
              
              placeholder="请输入执行结果"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.err_msg == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span>错误信息</span>
          </label>
          <el-form-item
            prop="err_msg"
            un-h="full"
          >
            <el-input
              v-model="dialogModel.err_msg"
              
              un-w="full"
              
              placeholder="请输入错误信息"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.begin_time == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span>开始时间</span>
          </label>
          <el-form-item
            prop="begin_time"
            un-h="full"
          >
            <el-date-picker
              :set="dialogModel.begin_time = dialogModel.begin_time ?? undefined"
              v-model="dialogModel.begin_time"
              
              un-w="full"
              
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择开始时间"
            ></el-date-picker>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.end_time == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span>结束时间</span>
          </label>
          <el-form-item
            prop="end_time"
            un-h="full"
          >
            <el-date-picker
              :set="dialogModel.end_time = dialogModel.end_time ?? undefined"
              v-model="dialogModel.end_time"
              
              un-w="full"
              
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择结束时间"
            ></el-date-picker>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.rem == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span>备注</span>
          </label>
          <el-form-item
            prop="rem"
            un-h="full"
          >
            <el-input
              v-model="dialogModel.rem"
              
              un-w="full"
              
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </template>
        
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
        @click="cancelClk"
      >
        <template #icon>
          <CircleClose />
        </template>
        <span>取消</span>
      </el-button>
      
      <div
        un-text="3 gray"
        un-pos-absolute
        un-right-2
      >
        <template v-if="ids && ids.length > 0">
          
          <el-button
            link
            :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) <= 0"
            @click="prevIdClk"
          >
            上一项
          </el-button>
          
          <span>
            <span>
              {{ (dialogModel.id && ids.indexOf(dialogModel.id) || 0) + 1 }} / {{ ids.length }}
            </span>
          </span>
          
          <el-button
            link
            :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) >= ids.length - 1"
            @click="nextIdClk"
          >
            下一项
          </el-button>
          
        </template>
        <span v-if="changedIds.length > 0">
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
  CircleClose,
  FullScreen,
} from "@element-plus/icons-vue";

import { useFullscreenEfc } from "@/compositions/fullscreen";

import {
  findById,
} from "./Api";

import {
  type Background_TaskInput,
} from "#/types";

import {
} from "./Api";

const emit = defineEmits([
  "nextId",
]);

let inited = $ref(false);
let { fullscreen, setFullscreen } = $(useFullscreenEfc());

let dialogTitle = $ref("");
let dialogVisible = $ref(false);
let dialogAction = $ref("add");

let dialogModel = $ref({
} as Background_TaskInput);

let ids = $ref<string[]>([ ]);
let changedIds = $ref<string[]>([ ]);

let formRef = $ref<InstanceType<typeof ElForm> | undefined>();

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule | FormItemRule[]>>({
  lbl: [
    {
      required: true,
      message: "请输入名称",
    },
  ],
  state: [
    {
      required: true,
      message: "请输入状态",
    },
  ],
  type: [
    {
      required: true,
      message: "请输入类型",
    },
  ],
});

/** 下拉框列表 */

/** 获取下拉框列表 */
async function getSelectListEfc() {
  [
  ] = await Promise.all([
  ]);
}

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: string[];
};

let onCloseResolve = function(value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<Background_TaskInput | undefined>();

/** 增加时的默认值 */
async function getDefaultInput() {
  const defaultInput: Background_TaskInput = {
  };
  return defaultInput;
}

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: Background_TaskInput;
    model?: {
      id?: string;
      ids?: string[];
    };
    action: "add" | "edit" | "copy";
  },
) {
  inited = false;
  dialogVisible = true;
  const dialogPrm = new Promise<OnCloseResolveType>((resolve) => {
    onCloseResolve = function(arg: OnCloseResolveType) {
      dialogVisible = false;
      resolve(arg);
    };
  });
  formRef?.resetFields();
  const title = arg?.title;
  const model = arg?.model;
  const action = arg?.action;
  builtInModel = arg?.builtInModel;
  dialogAction = action || "add";
  if (title) {
    dialogTitle = title;
  }
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
  };
  const selectListPrm = getSelectListEfc();
  if (dialogAction === "copy" && !model?.id) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,
    ] = await Promise.all([
      getDefaultInput(),
    ]);
    dialogModel = {
      ...defaultModel,
      ...model,
    };
  } else if (dialogAction === "copy") {
    if (!model?.id) {
      return await dialogPrm;
    }
    const data = await findById(model.id);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
      };
    }
  } else if (action === "edit") {
    if (!model || !model.ids) {
      return await dialogPrm;
    }
    ids = model.ids;
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      await refreshEfc();
    }
  }
  await selectListPrm;
  formRef?.clearValidate();
  inited = true;
  return await dialogPrm;
}

/** 刷新 */
async function refreshEfc() {
  formRef?.clearValidate();
  if (!dialogModel.id) {
    return;
  }
  const data = await findById(dialogModel.id);
  if (data) {
    dialogModel = data;
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
  emit("nextId", { dialogAction, id: dialogModel.id });
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
  emit("nextId", { dialogAction, id: dialogModel.id });
  return true;
}

/** 点击取消关闭按钮 */
function cancelClk() {
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

defineExpose({ showDialog });
</script>
