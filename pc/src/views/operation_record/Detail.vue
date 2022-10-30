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
        un-gap="x-[16px] y-[16px]"
        un-place-content-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
      >
        
        <template v-if="builtInModel?.mod == null">
          <label
            un-m="l-[3px]"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            class="after:content-[:]"
          >
            <span>模块</span>
          </label>
          <el-form-item
            prop="mod"
          >
            <el-input
              v-model="dialogModel.mod"
              
              un-w="full"
              
              placeholder="请输入模块"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.mod_lbl == null">
          <label
            un-m="l-[3px]"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            class="after:content-[:]"
          >
            <span>模块名称</span>
          </label>
          <el-form-item
            prop="mod_lbl"
          >
            <el-input
              v-model="dialogModel.mod_lbl"
              
              un-w="full"
              
              placeholder="请输入模块名称"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.method == null">
          <label
            un-m="l-[3px]"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            class="after:content-[:]"
          >
            <span>方法</span>
          </label>
          <el-form-item
            prop="method"
          >
            <el-input
              v-model="dialogModel.method"
              
              un-w="full"
              
              placeholder="请输入方法"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.method_lbl == null">
          <label
            un-m="l-[3px]"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            class="after:content-[:]"
          >
            <span>方法名称</span>
          </label>
          <el-form-item
            prop="method_lbl"
          >
            <el-input
              v-model="dialogModel.method_lbl"
              
              un-w="full"
              
              placeholder="请输入方法名称"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.lbl == null">
          <label
            un-m="l-[3px]"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            class="after:content-[:]"
          >
            <span>操作</span>
          </label>
          <el-form-item
            prop="lbl"
          >
            <el-input
              v-model="dialogModel.lbl"
              
              un-w="full"
              
              placeholder="请输入操作"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.rem == null">
          <label
            un-m="l-[3px]"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            class="after:content-[:]"
          >
            <span>备注</span>
          </label>
          <el-form-item
            prop="rem"
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
        un-text="[12px] [gray]"
        un-pos="absolute right-2"
      >
        <template v-if="ids && ids.length > 0">
          
          <el-button
            link
            :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) <= 0"
            @click="prevIdClk"
          >
            上一页
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
            下一页
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
  type Operation_RecordInput,
  type UsrModel,
} from "#/types";

import {
  findAllUsr,
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
} as Operation_RecordInput);

let ids = $ref<string[]>([ ]);
let changedIds = $ref<string[]>([ ]);

let formRef = $ref<InstanceType<typeof ElForm> | undefined>();

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule | FormItemRule[]>>({
});

/** 下拉框列表 */
let usrs = $ref<UsrModel[]>([ ]);

/** 获取下拉框列表 */
async function getSelectListEfc() {
  [
    usrs,
    usrs,
  ] = await Promise.all([
    findAllUsr(
      undefined,
      {
      },
      [
        {
          prop: "",
          order: "ascending",
        },
      ],
      {
        notLoading: true,
      },
    ),
    findAllUsr(
      undefined,
      {
      },
      [
        {
          prop: "",
          order: "ascending",
        },
      ],
      {
        notLoading: true,
      },
    ),
  ]);
}

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: string[];
};

let onCloseResolve = function(value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<Operation_RecordInput | undefined>();

/** 增加时的默认值 */
async function getDefaultInput() {
  const defaultInput: Operation_RecordInput = {
  };
  return defaultInput;
}

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: Operation_RecordInput;
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
    const defaultModel = await getDefaultInput();
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

/** 点击上一页 */
async function prevIdClk() {
  await prevId();
}

/** 点击下一页 */
async function nextIdClk() {
  await nextId();
}

/** 下一页 */
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

/** 上一页 */
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
