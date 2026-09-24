<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  @open="onDialogOpen"
  @close="onDialogClose"
  @keydown.page-down="onPageDown"
  @keydown.page-up="onPageUp"
  @keydown.ctrl.i="onInsert"
  @keydown.ctrl.arrow-down="onPageDown"
  @keydown.ctrl.arrow-up="onPageUp"
  @keydown.ctrl.enter="onSaveKeydown"
  @keydown.ctrl.s="onSaveKeydown"
>
  <template #extra_header>
    <div
      title="重置"
    >
      <ElIconRefresh
        class="reset_but"
        @dblclick.stop
        @click="onReset"
      ></ElIconRefresh>
    </div>
    <template v-if="!isLocked && !is_deleted && (dialogAction === 'edit' || dialogAction === 'view')">
      <div
        v-if="!isReadonly"
        title="锁定"
      >
        <ElIconUnlock
          class="unlock_but"
          @dblclick.stop
          @click="isReadonly = true;"
        >
        </ElIconUnlock>
      </div>
      <div
        v-else
        title="解锁"
      >
        <ElIconLock
          class="lock_but"
          @dblclick.stop
          @click="isReadonly = false;"
        ></ElIconLock>
      </div>
    </template>
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
      un-justify="start"
      un-items="center-safe"
    >
      <el-form
        ref="formRef"
        size="default"
        label-width="auto"
        
        un-grid="~ cols-[repeat(2,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
        
        @submit.prevent
      >
        
        <template v-if="(showBuildIn || builtInModel?.group == null)">
          <el-form-item
            label="分组"
            prop="group"
          >
            <CustomInput
              v-model="dialogModel.group"
              placeholder="请输入 分组"
              :readonly="isLocked || isReadonly || isWebsiteEdit"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.lbl == null)">
          <el-form-item
            label="名称"
            prop="lbl"
          >
            <CustomInput
              v-model="dialogModel.lbl"
              placeholder="请输入 名称"
              :readonly="isLocked || isReadonly || isWebsiteEdit"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.type == null)">
          <el-form-item
            label="类型"
            prop="type"
          >
            <DictSelect
              v-model="dialogModel.type"
              :set="dialogModel.type = dialogModel.type ?? undefined"
              code="nuxt_comp_cnf_type"
              placeholder="请选择 类型"
              :readonly="isLocked || isReadonly"
              :options-map="(item: DictModel) => {
                const disabled = allow_types && !allow_types.includes(item.val);
                return {
                  label: item.lbl,
                  value: item.val,
                  disabled,
                };
              }"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.order_by == null)">
          <el-form-item
            label="排序"
            prop="order_by"
          >
            <CustomInputNumber
              v-model="dialogModel.order_by"
              placeholder="请输入 排序"
              :readonly="isLocked || isReadonly"
              :is-hide-zero="true"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.rem == null)">
          <el-form-item
            label="备注"
            prop="rem"
          >
            <CustomInput
              v-model="dialogModel.rem"
              placeholder="请输入 备注"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.val == null)">
          <el-form-item
            label="值"
            prop="val"
            un-col="span-full"
          >
            <CompCnfValEditor
              v-model="dialogModel.val"
              :type="dialogModel.type"
              placeholder="请输入 值"
              :readonly="isLocked || isReadonly"
              :page-inited="inited"
            ></CompCnfValEditor>
          </el-form-item>
        </template>
        
      </el-form>
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
        </template>
        <span>关闭</span>
      </el-button>
      
      <el-button
        v-if="(dialogAction === 'add' || dialogAction === 'copy') && permit('add', '新增') && !isLocked && !isReadonly"
        plain
        type="primary"
        :disabled="is_form_hydrating"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>保存</span>
      </el-button>
      
      <el-button
        v-if="(dialogAction === 'edit' || dialogAction === 'view') && permit('edit', '编辑') && !isLocked && !isReadonly"
        plain
        type="primary"
        :disabled="is_form_hydrating"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>保存</span>
      </el-button>
      
      <div
        v-if="(ids && ids.length > 1)"
        un-text="3 [var(--el-text-color-regular)]"
        un-pos-absolute
        un-right="2"
        un-flex="~"
        un-gap="x-1"
      >
        
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

import {
  createCompCnf,
  findOneCompCnf,
  findLastOrderByCompCnf,
  updateByIdCompCnf,
  getDefaultInputCompCnf,
  getPagePathCompCnf,
  intoInputCompCnf,
} from "./Api.ts";

import type {
  DictModel,
} from "@/components/DictSelect.vue";

import CompCnfValEditor from "./CompCnfValEditor.vue";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: CompCnfId,
    },
  ],
}>();

const pagePath = getPagePathCompCnf();

const permitStore = usePermitStore();

const {
  permit,
  permitAsync,
} = permitStore.getPermit(pagePath);

let inited = $ref(false);
let is_form_hydrating = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
let oldDialogNotice: string | undefined = undefined;
let oldIsLocked = $ref(false);
let dialogNotice = $ref("");

let dialogModel = $ref<CompCnfInput>({
} as CompCnfInput);

let comp_cnf_model = $ref<CompCnfModel>();

let ids = $ref<CompCnfId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<CompCnfId[]>([ ]);

const formRef = $(useTemplateRef("formRef"));

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(async () => {
  if (!inited) {
    form_rules = { };
    return;
  }
  await nextTick();
  form_rules = {
    // 分组
    group: [
      {
        required: true,
        message: "请输入 分组",
      },
      {
        type: "string",
        max: 45,
        message: "分组 长度不能超过 45",
      },
    ],
    // 名称
    lbl: [
      {
        required: true,
        message: "请输入 名称",
      },
      {
        type: "string",
        max: 65,
        message: "名称 长度不能超过 65",
      },
    ],
    // 类型
    type: [
      {
        required: true,
        message: "请选择 类型",
      },
    ],
    // 排序
    order_by: [
      {
        required: true,
        message: "请输入 排序",
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: CompCnfId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<CompCnfInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef("customDialogRef"));

let findOneModel = findOneCompCnf;

let allow_types = $ref<string[]>();
let isWebsiteEdit = $ref(false);

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: CompCnfInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: CompCnfId[];
      is_deleted?: 0 | 1 | null;
      allow_types?: string[];
      input?: CompCnfInput,
    };
    findOne?: typeof findOneCompCnf;
    action: DialogAction;
    isWebsiteEdit?: boolean;
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  oldDialogTitle = dialogTitle;
  const notice = arg?.notice;
  oldDialogNotice = notice;
  dialogNotice = notice ?? "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
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
  isLocked = false;
  is_deleted = model?.is_deleted ?? 0;
  allow_types = model?.allow_types;
  isWebsiteEdit = arg?.isWebsiteEdit ?? false;
  if (arg?.findOne) {
    findOneModel = arg.findOne;
  } else {
    findOneModel = findOneCompCnf;
  }
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    showBuildIn = toValue(arg?.showBuildIn) ?? showBuildIn;
    isReadonly = toValue(arg?.isReadonly) ?? isReadonly;
    oldIsLocked = toValue(arg?.isLocked) ?? false;
    
    isLocked = toValue(arg?.isLocked) ?? isLocked;
  });
  dialogAction = action || "add";
  nextTick(() => formRef?.clearValidate());
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
  };
  comp_cnf_model = undefined;
  if (dialogAction === "copy" && !model?.ids?.[0]) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,
      order_by,
    ] = await Promise.all([
      getDefaultInputCompCnf(),
      findLastOrderByCompCnf(
        undefined,
        {
          notLoading: !inited,
        },
      ),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      order_by: order_by + 1,
    };
    if (model?.input) {
      dialogModel = {
        ...dialogModel,
        ...model.input,
      };
    }
    dialogModel.type = allow_types?.[0] ?? dialogModel.type;
  } else if (dialogAction === "copy") {
    const id = model?.ids?.[0];
    if (!id) {
      return await dialogRes.dialogPrm;
    }
    const [
      data,
      order_by,
    ] = await Promise.all([
      findOneModel({
        id,
        is_deleted,
      }),
      findLastOrderByCompCnf(
        undefined,
        {
          notLoading: !inited,
        },
      ),
    ]);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
        order_by: order_by + 1,
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
}

/** 键盘按 Insert */
async function onInsert() {
  isReadonly = !isReadonly;
  await nextTick();
  customDialogRef?.focus();
}

/** 重置 */
async function onReset() {
  if (!formRef) {
    return;
  }
  if (!isReadonly && !isLocked) {
    try {
      await ElMessageBox.confirm(
        "确定要重置表单吗",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        },
      );
    } catch (err) {
      return;
    }
  }
  await onRefresh();
  nextTick(() => nextTick(() => formRef?.clearValidate()));
  ElMessage({
    message: "表单重置完毕",
    type: "success",
  });
}

/** 刷新 */
async function onRefresh() {
  is_form_hydrating = true;
  try {
    const id = dialogModel.id;
    if (!id) {
      const [
        defaultModel,
        order_by,
      ] = await Promise.all([
        getDefaultInputCompCnf(),
        findLastOrderByCompCnf(
          undefined,
          {
            notLoading: !inited,
          },
        ),
      ]);
      dialogModel = {
        ...defaultModel,
        ...builtInModel,
        order_by: order_by + 1,
      };
      is_form_hydrating = false;
      return;
    }
    const [
      data,
    ] = await Promise.all([
      findOneModel({
        id,
        is_deleted,
      }),
    ]);
    if (data) {
      dialogModel = intoInputCompCnf({
        ...data,
      });
      dialogTitle = `${ oldDialogTitle } - ${ dialogModel.lbl }`;
    }
    comp_cnf_model = data;
  } finally {
    await nextTick();
    is_form_hydrating = false;
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
    ElMessage.warning("已经是第一项了");
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
    ElMessage.warning("已经是最后一项了");
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
}

watch(
  () => [
    dialogModel.type,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (!dialogModel.type) {
      dialogModel.type_lbl = "";
    }
  },
);

/** 快捷键ctrl+回车 */
async function onSaveKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  customDialogRef?.focus();
  await onSave();
}

/** 保存并返回id */
async function save() {
  if (!inited || isReadonly || is_form_hydrating) {
    return;
  }
  if (!formRef) {
    return;
  }
  if ((dialogAction === "edit" || dialogAction === "view") && !await permitAsync("edit")) {
    return;
  }
  if (dialogAction === "add" && !await permitAsync("add")) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  let id: CompCnfId | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await createCompCnf(dialogModel2);
    dialogModel.id = id;
    msg = "新增成功";
  } else if (dialogAction === "edit" || dialogAction === "view") {
    if (!dialogModel.id) {
      return;
    }
    const dialogModel2 = {
      ...dialogModel,
      id: undefined,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await updateByIdCompCnf(
      dialogModel.id,
      dialogModel2,
    );
    msg = "编辑成功";
  }
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
}

async function onDialogOpen() {
}

async function onDialogClose() {
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

defineExpose({
  showDialog,
  refresh: onRefresh,
});
</script>
