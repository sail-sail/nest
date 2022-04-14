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
  <template #title>
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
        
        <label class="form_label">
          <span>域名绑定</span>
        </label>
        <el-form-item prop="host">
          <el-input
            class="form_input"
            v-model="dialogModel.host"
            placeholder="请输入域名绑定"
          ></el-input>
        </el-form-item>
        
        <label class="form_label">
          <span>到期日</span>
        </label>
        <el-form-item prop="expiration">
          <el-date-picker
            type="date"
            class="form_input"
            v-model="dialogModel.expiration"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD 00:00:00"
            placeholder="请选择到期日"
          ></el-date-picker>
        </el-form-item>
        
        <label class="form_label">
          <span>最大用户数</span>
        </label>
        <el-form-item prop="max_usr_num">
          <el-input-number
            class="form_input"
            v-model="dialogModel.max_usr_num"
            :precision="0"
            :step="1"
            :step-strictly="true"
            :controls="false"
            placeholder="请输入最大用户数"
          ></el-input-number>
        </el-form-item>
        
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
        
        <label class="form_label">
          <span>菜单</span>
        </label>
        <el-form-item prop="menu_ids">
          <el-select-v2
            :height="300"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :set="dialogModel.menu_ids = dialogModel.menu_ids || [ ]"
            class="form_input"
            @keyup.enter.native.stop
            v-model="dialogModel.menu_ids"
            placeholder="请选择菜单"
            :options="menuInfo.data.map((item) => ({ value: item.id, label: item.lbl }))"
            filterable
            clearable
            :loading="!inited"
            :remote="menuInfo.count > SELECT_V2_SIZE"
            :remote-method="menuFilterEfc"
          ></el-select-v2>
        </el-form-item>
        
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
        
      </el-form>
    </div>
    <div class="toolbox_div">
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

import { TenantModel } from "./Model";
import { MenuModel } from "../menu/Model";

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

let dialogModel: TenantModel = $ref({
  menu_ids: [ ],
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
      {
        orderBy: "order_by",
        orderDec: "ascending",
      },
      {
        pgSize: SELECT_V2_SIZE,
      },
    ),
  ]);
}

// 菜单下拉框远程搜索
async function menuFilterEfc(query: string) {
  menuInfo.data = await findAllMenu({
    orderBy: "order_by",
    orderDec: "ascending",
    lblLike: query,
  }, { pgSize: SELECT_V2_SIZE }, { notLoading: true });
}

let onCloseResolve = function(value: {
  changedIds: string[];
}) { };

// 打开对话框
async function showDialog(
  {
    title,
    model,
    action,
  }: {
    title?: string;
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
  dialogAction = action;
  if (title) {
    dialogTitle = title;
  }
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
  };
  await getSelectListEfc();
  if (action === "add") {
    dialogModel = {
      ...model,
    };
    const order_by = await findLastOrderBy();
    dialogModel.order_by = order_by + 1;
  } else if (action === "edit") {
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
  let id = undefined;
  let msg = "";
  if (dialogAction === "add") {
    id = await create(dialogModel);
    dialogModel.id = id;
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
      onCloseResolve({
        changedIds,
      });
    } else {
      ids = ids.filter((id) => id !== oldId);
    }
  }
}

// 窗口关闭之前判断是否有改动
async function beforeClose(done: (cancel: boolean) => void) {
  onCloseResolve({
    changedIds,
  });
  done(false);
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
</style>
