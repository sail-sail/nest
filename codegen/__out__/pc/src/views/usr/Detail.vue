<template>
<el-dialog
  :fullscreen="fullscreen"
  v-model="dialogVisible"
  append-to-body
  :close-on-click-modal="false"
  :custom-class="columnNum > 20 ? 'custom_dialog' : 'custom_dialog auto_dialog'"
  top="0"
  :before-close="beforeClose"
>
  <template #header>
    <div class="dialog_title" v-draggable>
      <div class="title_lbl">
        <span class="dialogTitle_span">
          {{ dialogTitle }}
        </span>
      </div>
      <el-icon class="full_but" @click="setFullscreen">
        <FullScreen/>
      </el-icon>
    </div>
  </template>
  <div
    overflow="hidden"
    flex="~ [1_0_0] col basis-[inherit]"
  >
    <div
      overflow="auto"
      flex="~ [1_0_0] col basis-[inherit]"
      p="5"
      justify="start"
      items="center"
    >
      <el-form
        size="default"
        
        justify="end"
        items="end"
        grid="~ rows-[auto]"
        gap="x-[16px] y-[16px]"
        place="content-center"
        
        :class="columnNum <= 4 ? 'dialog_form1' : 'dialog_form2'"
        :model="dialogModel"
        ref="formRef"
        :rules="form_rules"
        :validate-on-rule-change="false"
        @keyup.enter.native="saveClk"
      >
        
        <template v-if="builtInModel?.lbl == null">
          <label class="form_label">
            <span style="color: red;">*</span>
            <span>名称</span>
          </label>
          <el-form-item prop="lbl">
            <el-input
              class="form_input"
              v-model="dialogModel.lbl"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.username == null">
          <label class="form_label">
            <span style="color: red;">*</span>
            <span>用户名</span>
          </label>
          <el-form-item prop="username">
            <el-input
              class="form_input"
              v-model="dialogModel.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.password == null">
          <label class="form_label">
            <span>密码</span>
          </label>
          <el-form-item prop="password">
            <el-input
              class="form_input"
              v-model="dialogModel.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.is_enabled == null">
          <label class="form_label">
            <span>启用</span>
          </label>
          <el-form-item prop="is_enabled">
            <el-select
              class="form_input"
              @keyup.enter.native.stop
              :set="dialogModel.is_enabled = dialogModel.is_enabled || undefined"
              v-model="dialogModel.is_enabled"
              placeholder="请选择启用"
              filterable
              default-first-option
              clearable
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
        
        <template v-if="builtInModel?.role_ids == null">
          <label class="form_label">
            <span>角色</span>
          </label>
          <el-form-item prop="role_ids">
            <el-select-v2
              :height="300"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :set="dialogModel.role_ids = dialogModel.role_ids || [ ]"
              class="form_input"
              @keyup.enter.native.stop
              v-model="dialogModel.role_ids"
              placeholder="请选择角色"
              :options="roleInfo.data.map((item) => ({ value: item.id, label: item.lbl }))"
              filterable
              clearable
              :loading="!inited"
            ></el-select-v2>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.rem == null">
          <label class="form_label">
            <span>备注</span>
          </label>
          <el-form-item prop="rem">
            <el-input
              class="form_input"
              v-model="dialogModel.rem"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </template>
        
      </el-form>
    </div>
    <div
      p="y-2.5"
      flex
      justify="center"
      items="center"
    >
      <el-button
        plain
        :icon="CircleClose"
        @click="cancelClk"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        plain
        :icon="CircleCheck"
        @click="saveClk"
      >
        保存
      </el-button>
      <div
        text="[12px] [gray]"
        pos="absolute right-2"
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
  create,
  findById,
  updateById,
} from "./Api";

import {
  type UsrInput,
} from "#/types";
import {
  type RoleModel,
} from "#/types";

import {
  findAllAndCountRole,
  findAllRole,
} from "./Api";

const emit = defineEmits([
  "nextId",
]);

let inited = $ref(false);
let columnNum = $ref(6);

let { fullscreen, setFullscreen } = $(useFullscreenEfc());

let dialogTitle = $ref("");
let dialogVisible = $ref(false);
let dialogAction = $ref("add");

let dialogModel: UsrInput = $ref({
  role_ids: [ ],
} as any);

let ids: string[] = $ref([ ]);
let changedIds: string[] = $ref([ ]);

let formRef: InstanceType<typeof ElForm>|undefined = $ref();

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule | FormItemRule[]>>({
  lbl: [
    {
      required: true,
      message: "请输入名称",
    },
  ],
  username: [
    {
      required: true,
      message: "请输入用户名",
    },
  ],
});

/** 下拉框列表 */
let roleInfo: {
  count: number;
  data: RoleModel[];
} = $ref({
  count: 0,
  data: [ ],
});

/** 获取下拉框列表 */
async function getSelectListEfc() {
  [
    roleInfo,
  ] = await Promise.all([
    findAllAndCountRole(
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

let onCloseResolve = function(value: {
  changedIds: string[];
}) { };

/** 内置变量 */
let builtInModel: UsrInput|undefined = $ref();

/** 增加时的默认值 */
async function getDefaultInput() {
  const defaultInput: UsrInput = {
    is_enabled: 1,
  };
  return defaultInput;
}

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: UsrInput;
    model?: {
      ids: string[];
    };
    action: "add"|"edit";
  },
) {
  inited = false;
  if (formRef) {
    formRef.resetFields();
  }
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
  await getSelectListEfc();
  if (action === "add") {
    const defaultModel = await getDefaultInput();
    dialogModel = {
      ...defaultModel,
      ...model,
    };
  } else if (action === "edit") {
    if (!model) {
      return;
    }
    ids = model.ids;
    if (ids && ids.length > 0) {
      dialogModel.id = ids[0];
      await refreshEfc();
    }
  }
  if (formRef) {
    formRef.clearValidate();
  }
  inited = true;
  dialogVisible = true;
  const reslut = await new Promise<{
    changedIds: string[];
  }>((resolve) => {
    onCloseResolve = resolve;
  });
  return reslut;
}

/** 刷新 */
async function refreshEfc() {
  if (formRef) {
    formRef.clearValidate();
  }
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
  let id: string|undefined = undefined;
  let msg = "";
  if (dialogAction === "add") {
    id = await create({ ...dialogModel, ...builtInModel });
    dialogModel.id = id;
    msg = `增加成功!`;
  } else if (dialogAction === "edit") {
    if (!dialogModel.id) {
      return;
    }
    id = await updateById(dialogModel.id, { ...dialogModel, ...builtInModel });
    msg = `修改成功!`;
  }
  if (id) {
    if (dialogModel.id) {
      changedIds.push(dialogModel.id);
    }
    ElMessage.success(msg);
    const oldId = dialogModel.id;
    let isNext = await nextId();
    if (!isNext) {
      isNext = await prevId();
    }
    if (!isNext) {
      dialogVisible = false;
      onCloseResolve({
        changedIds,
      });
    } else {
      ids = ids.filter((id) => id !== oldId);
    }
  }
}

/** 点击取消关闭按钮 */
function cancelClk() {
  dialogVisible = false;
  onCloseResolve({
    changedIds,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    changedIds,
  });
}

defineExpose({ showDialog });
</script>

<style lang="scss" scoped>
.dialog_form1 {
  grid-template-columns: repeat(1, minmax(min-content, max-content) 280px);
}

.dialog_form2 {
  grid-template-columns: repeat(2, minmax(min-content, max-content) 280px);
}
.form_label {
  margin-left: 3px;
  text-align: right;
  align-self: center;
}
.form_label::after {
  content: ":";
}
.form_input {
  width: 100%;
}
</style>
