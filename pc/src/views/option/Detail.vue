<template>
<el-dialog
  v-model="dialogVisible"
  :fullscreen="fullscreen"
  append-to-body
  :close-on-click-modal="false"
  class="custom_dialog pointer_pierce_dialog auto_dialog"
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
        @keyup.enter="saveClk"
      >
        
        <template v-if="builtInModel?.lbl == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
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
        
        <template v-if="builtInModel?.ky == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span un-text="red">*</span>
            <span>键</span>
          </label>
          <el-form-item
            prop="ky"
            un-h="full"
          >
            <el-input
              v-model="dialogModel.ky"
              
              un-w="full"
              
              placeholder="请输入键"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.val == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span>值</span>
          </label>
          <el-form-item
            prop="val"
            un-h="full"
          >
            <el-input
              v-model="dialogModel.val"
              
              un-w="full"
              
              placeholder="请输入值"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.is_enabled == null">
          <label
            un-m="l-1"
            un-text-right
            un-self-center
            un-whitespace-nowrap
            un-after="content-[quoted::]"
          >
            <span un-text="red">*</span>
            <span>启用</span>
          </label>
          <el-form-item
            prop="is_enabled"
            un-h="full"
          >
            <el-select
              :set="dialogModel.is_enabled = dialogModel.is_enabled ?? undefined"
              v-model="dialogModel.is_enabled"
              
              un-w="full"
              
              placeholder="请选择启用"
              filterable
              default-first-option
              clearable
              @keyup.enter.stop
            >
              <el-option
                :value="1"
                label="是"
              ></el-option>
              <el-option
                :value="0"
                label="否"
              ></el-option>
            </el-select>
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
        :icon="CircleClose"
        @click="cancelClk"
      >
        <span>取消</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        :icon="CircleCheck"
        @click="saveClk"
      >
        <span>保存</span>
      </el-button>
      
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
          上一项
        </el-button>
        
        <span>
          {{ (dialogModel.id && ids.indexOf(dialogModel.id) || 0) + 1 }} / {{ ids.length }}
        </span>
        
        <el-button
          link
          :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) >= ids.length - 1"
          @click="nextIdClk"
        >
          下一项
        </el-button>
        
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
  create,
  findById,
  updateById,
} from "./Api";

import {
  type OptionInput,
} from "#/types";

import {
} from "./Api";

const emit = defineEmits<
  (e: "nextId", value: { dialogAction: DialogAction, id: string }) => void
>();

let inited = $ref(false);
let { fullscreen, setFullscreen } = $(useFullscreenEfc());

type DialogAction = "add" | "copy" | "edit";

let dialogTitle = $ref("");
let dialogVisible = $ref(false);
let dialogAction = $ref<DialogAction>("add");

let dialogModel = $ref({
} as OptionInput);

let ids = $ref<string[]>([ ]);
let changedIds = $ref<string[]>([ ]);

let formRef = $ref<InstanceType<typeof ElForm> | undefined>();

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule | FormItemRule[]>>({
  ky: [
    {
      required: true,
      message: "请输入键",
    },
  ],
  is_enabled: [
    {
      required: true,
      message: "请输入启用",
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
let builtInModel = $ref<OptionInput | undefined>();

/** 增加时的默认值 */
async function getDefaultInput() {
  const defaultInput: OptionInput = {
    is_enabled: 1,
  };
  return defaultInput;
}

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: OptionInput;
    model?: {
      id?: string;
      ids?: string[];
    };
    action: DialogAction;
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
  emit("nextId", { dialogAction, id: dialogModel.id! });
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
  emit("nextId", { dialogAction, id: dialogModel.id! });
  return true;
}

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
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    id = await create({
      ...dialogModel,
      ...builtInModel,
    });
    dialogModel.id = id;
    msg = `增加成功!`;
  } else if (dialogAction === "edit") {
    id = await updateById(
      dialogModel.id,
      {
        ...dialogModel,
        ...builtInModel,
      },
    );
    msg = `修改成功!`;
  }
  if (id) {
    if (!changedIds.includes(id)) {
      changedIds.push(dialogModel.id);
    }
    ElMessage.success(msg);
    const isNext = await nextId();
    if (!isNext) {
      onCloseResolve({
        type: "ok",
        changedIds,
      });
    }
  }
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
