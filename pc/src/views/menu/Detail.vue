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
  <div class="wrap_div">
    <div class="content_div">
      <el-form
        size="default"
        :class="columnNum <= 4 ? 'dialog_form1' : 'dialog_form2'"
        :model="dialogModel"
        ref="formRef"
        :rules="form_rules"
        :validate-on-rule-change="false"
        @keyup.enter.native="saveClk"
      >
        
        <template v-if="builtInModel?.type == null">
          <label class="form_label">
            <span>类型</span>
          </label>
          <el-form-item prop="type">
            <el-select
              class="form_input"
              @keyup.enter.native.stop
              v-model="dialogModel.type"
              placeholder="请选择类型"
              filterable
              default-first-option
              clearable
            >
              <el-option
                :value="'pc'"
                label="电脑端"
              ></el-option>
              <el-option
                :value="'mobile'"
                label="手机端"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.menu_id == null">
          <label class="form_label">
            <span>父菜单</span>
          </label>
          <el-form-item prop="menu_id">
            <el-select-v2
              :height="300"
              class="form_input"
              @keyup.enter.native.stop
              v-model="dialogModel.menu_id"
              placeholder="请选择父菜单"
              :options="menuInfo.data.map((item) => ({ value: item.id!, label: item.lbl! }))"
              filterable
              clearable
              :loading="!inited"
              :remote="menuInfo.count > SELECT_V2_SIZE"
              :remote-method="menuFilterEfc"
            ></el-select-v2>
          </el-form-item>
        </template>
        
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
        
        <template v-if="builtInModel?.route_path == null">
          <label class="form_label">
            <span>路由</span>
          </label>
          <el-form-item prop="route_path">
            <el-input
              class="form_input"
              v-model="dialogModel.route_path"
              placeholder="请输入路由"
            ></el-input>
          </el-form-item>
        </template>
        
        <template v-if="builtInModel?.route_query == null">
          <label class="form_label">
            <span>参数</span>
          </label>
          <el-form-item prop="route_query">
            <el-input
              class="form_input"
              v-model="dialogModel.route_query"
              placeholder="请输入参数"
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
        
        <template v-if="builtInModel?.order_by == null">
          <label class="form_label">
            <span>排序</span>
          </label>
          <el-form-item prop="order_by">
            <el-input-number
              class="form_input"
              v-model="dialogModel.order_by"
              :precision="0"
              :step="1"
              :step-strictly="true"
              :controls="false"
              placeholder="请输入排序"
            ></el-input-number>
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
    <div class="toolbox_div">
      <el-button
        :icon="CircleClose"
        class="cancel_but"
        @click="cancelClk"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        :icon="CircleCheck"
        class="save_but"
        @click="saveClk"
      >
        保存
      </el-button>
      <div class="page_div">
        <template v-if="ids && ids.length > 0">
          <el-button
            link
            class="prev_but"
            :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) <= 0"
            @click="prevIdClk"
          >
            上一页
          </el-button>
          <span class="detail_pg_span">
            <span>
              {{ (dialogModel.id && ids.indexOf(dialogModel.id) || 0) + 1 }} / {{ ids.length }}
            </span>
          </span>
          <el-button
            link
            class="next_but"
            :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) >= ids.length - 1"
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
  CircleClose,
  FullScreen,
} from "@element-plus/icons-vue";
import { useFullscreenEffect } from "@/compositions/fullscreen";
import {
  SELECT_V2_SIZE,
} from "@/views/common/App";
import {
  create,
  findById,
  findLastOrderBy,
  updateById,
} from "./Api";

import { MenuModel } from "./Model";

import {
  findAllAndCountMenu,
  findAllMenu,
} from "./Api";

const emit = defineEmits([
  "nextId",
]);

let inited = $ref(false);
let columnNum = $ref(8);

let { fullscreen, setFullscreen } = $(useFullscreenEffect());

let dialogTitle = $ref("");
let dialogVisible = $ref(false);
let dialogAction = $ref("add");

let dialogModel: MenuModel = $ref({
});

let ids: string[] = $ref([ ]);
let changedIds: string[] = $ref([ ]);

let formRef = $ref<InstanceType<typeof ElForm>>();

// 表单校验
let form_rules = $ref<Record<string, FormItemRule | FormItemRule[]>>({
  lbl: [
    {
      required: true,
      message: "请输入名称",
    },
  ],
});

// 下拉框列表
let menuInfo: {
  count: number;
  data: MenuModel[];
} = $ref({
  count: 0,
  data: [ ],
});

// 获取下拉框列表
async function getSelectListEfc() {
  [
    menuInfo,
  ] = await Promise.all([
    findAllAndCountMenu(
      undefined,
      {
        pgSize: SELECT_V2_SIZE,
      },
      [
        {
          prop: "order_by",
          order: "ascending",
        },
      ],
      {
        notLoading: true,
      },
    ),
  ]);
}

// 父菜单下拉框远程搜索
async function menuFilterEfc(query: string) {
  menuInfo.data = await findAllMenu(
    {
      lblLike: query,
    },
    {
      pgSize: SELECT_V2_SIZE,
    },
    [
      {
        prop: "order_by",
        order: "ascending",
      },
    ],
    {
      notLoading: true,
    },
  );
}

let onCloseResolve = function(value: {
  changedIds: string[];
}) { };

// 内置变量
let builtInModel: MenuModel|undefined = $ref();

// 增加时的默认值
async function getDefaultModel(): Promise<MenuModel> {
  const defaultModel: MenuModel = {
    type: "pc",
    is_enabled: 1,
    order_by: 0,
  };
  return defaultModel;
}

// 打开对话框
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: MenuModel;
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
    const defaultModel = await getDefaultModel();
    dialogModel = {
      ...defaultModel,
      ...model,
    };
    const order_by = await findLastOrderBy();
    dialogModel.order_by = order_by + 1;
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

// 刷新
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

// 点击上一页
async function prevIdClk() {
  await prevId();
}

// 点击下一页
async function nextIdClk() {
  await nextId();
}

// 下一页
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

// 上一页
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

// 确定
async function saveClk() {
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
</style>
