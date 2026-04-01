<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  @open="onDialogOpen"
  @close="onDialogClose"
  @keydown.page-down="onPageDown"
  @keydown.page-up="onPageUp"
  @keydown.insert="onInsert"
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
        
        un-grid="~ cols-[repeat(3,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
        
        @submit.prevent
      >
        
        <template v-if="(showBuildIn || builtInModel?.code == null)">
          <el-form-item
            label="编码"
            prop="code"
          >
            <CustomInput
              v-model="dialogModel.code"
              placeholder="请输入 编码"
              :readonly="true"
              :readonly-placeholder="inited ? '(自动生成)' : ''"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.lbl == null)">
          <el-form-item
            label="流程名称"
            prop="lbl"
          >
            <CustomInput
              v-model="dialogModel.lbl"
              placeholder="请输入 流程名称"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.biz_code == null)">
          <el-form-item
            label="关联业务"
            prop="biz_code"
          >
            <DictSelect
              v-model="dialogModel.biz_code"
              :set="dialogModel.biz_code = dialogModel.biz_code ?? undefined"
              code="bpm_biz_code"
              placeholder="请选择 关联业务"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.current_revision_id == null) && dialogAction !== 'add' && dialogAction !== 'copy'">
          <el-form-item
            label="当前生效版本"
            prop="current_revision_id"
          >
            <SelectInputProcessRevision
              v-model="dialogModel.current_revision_id"
              v-model:model-label="dialogModel.current_revision_id_lbl"
              placeholder="请选择 当前生效版本"
              :readonly="isLocked || isReadonly"
              :page-inited="inited"
            ></SelectInputProcessRevision>
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
        
        <template v-if="(showBuildIn || builtInModel?.description == null)">
          <el-form-item
            label="流程描述"
            prop="description"
          >
            <CustomInput
              v-model="dialogModel.description"
              placeholder="请输入 流程描述"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
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
        
      </el-form>
        
      <template v-if="(showBuildIn || builtInModel?.graph_json == null)">
        <el-form-item
          label="流程图"
          prop="graph_json"
          un-grid-col="span-full"
          un-w="full"
          un-flex="[1_0_0]"
          un-overflow-hidden
        >
          <FlowDesigner
            v-model="dialogModel.graph_json"
            :readonly="isLocked || isReadonly"
          ></FlowDesigner>
        </el-form-item>
      </template>
      
    </div>
    <div
      un-p="b-3"
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
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>保存草稿</span>
      </el-button>
      
      <el-button
        v-if="(dialogAction === 'edit' || dialogAction === 'view') && permit('edit', '编辑') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>编辑 {{ dialogModel.current_revision_id_lbl }}</span>
      </el-button>
      
      <el-button
        v-if="permit('save_and_publishs', '保存并发布流程') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSaveAndPublishsProcessDef"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>保存并发布流程</span>
      </el-button>
      
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

import {
  createProcessDef,
  findOneProcessDef,
  findLastOrderByProcessDef,
  updateByIdProcessDef,
  getDefaultInputProcessDef,
  getPagePathProcessDef,
  intoInputProcessDef,
} from "./Api.ts";

import {
  saveAndPublishsProcessDef,
} from "./Api2.ts";

import SelectInputProcessRevision from "@/views/bpm/process_revision/SelectInput.vue";

import FlowDesigner from "@/views/bpm/process_revision/FlowDesigner.vue";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: ProcessDefId,
    },
  ],
}>();

const pagePath = getPagePathProcessDef();

const permitStore = usePermitStore();

const permit = permitStore.getPermit(pagePath);

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
let oldDialogNotice: string | undefined = undefined;
let oldIsLocked = $ref(false);
let dialogNotice = $ref("");

let dialogModel = $ref<ProcessDefInput>({
} as ProcessDefInput);

let process_def_model = $ref<ProcessDefModel>();

let ids = $ref<ProcessDefId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<ProcessDefId[]>([ ]);

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
    // 流程名称
    lbl: [
      {
        required: true,
        message: "请输入 流程名称",
      },
      {
        type: "string",
        max: 100,
        message: "流程名称 长度不能超过 100",
      },
    ],
    // 关联业务
    biz_code: [
      {
        required: true,
        message: "请选择 关联业务",
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
  changedIds: ProcessDefId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<ProcessDefInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef("customDialogRef"));

let findOneModel = findOneProcessDef;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: ProcessDefInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: ProcessDefId[];
      is_deleted?: 0 | 1 | null;
    };
    findOne?: typeof findOneProcessDef;
    action: DialogAction;
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  oldDialogTitle = dialogTitle;
  const notice = arg?.notice;
  oldDialogNotice = notice;
  dialogNotice = notice ?? "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "large",
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
  if (arg?.findOne) {
    findOneModel = arg.findOne;
  } else {
    findOneModel = findOneProcessDef;
  }
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    showBuildIn = toValue(arg?.showBuildIn) ?? showBuildIn;
    isReadonly = toValue(arg?.isReadonly) ?? isReadonly;
    oldIsLocked = toValue(arg?.isLocked) ?? false;
    
    if (!permit("edit")) {
      isLocked = true;
    } else {
      isLocked = toValue(arg?.isLocked) ?? isLocked;
    }
  });
  dialogAction = action || "add";
  nextTick(() => formRef?.clearValidate());
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
  };
  process_def_model = undefined;
  if (dialogAction === "copy" && !model?.ids?.[0]) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,
      order_by,
    ] = await Promise.all([
      getDefaultInputProcessDef(),
      findLastOrderByProcessDef(
        undefined,
        {
          notLoading: !inited,
        },
      ),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      ...model,
      order_by: order_by + 1,
    };
  } else if (dialogAction === "copy") {
    const id = model?.ids?.[0];
    if (!id) {
      return await dialogRes.dialogPrm;
    }
    const [
      defaultInput,
      data,
      order_by,
    ] = await Promise.all([
      getDefaultInputProcessDef(),
      findOneModel({
        id,
        is_deleted,
      }),
      findLastOrderByProcessDef(
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
        code: defaultInput.code,
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
  const id = dialogModel.id;
  if (!id) {
    const [
      defaultModel,
      order_by,
    ] = await Promise.all([
      getDefaultInputProcessDef(),
      findLastOrderByProcessDef(
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
    dialogModel = intoInputProcessDef({
      ...data,
    });
    dialogTitle = `${ oldDialogTitle } - ${ dialogModel.lbl }`;
  }
  process_def_model = data;
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
    dialogModel.biz_code,
    dialogModel.current_revision_id,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (!dialogModel.biz_code) {
      dialogModel.biz_code_lbl = "";
    }
    if (!dialogModel.current_revision_id) {
      dialogModel.current_revision_id_lbl = "";
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
  if (!inited || isReadonly) {
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
  let id: ProcessDefId | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await createProcessDef(dialogModel2);
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
    id = await updateByIdProcessDef(
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

/** 保存并发布流程 */
async function onSaveAndPublishsProcessDef() {
  
  if (!inited || isReadonly) {
    return;
  }
  if (!formRef) {
    return;
  }
  if (!permit("save_and_publishs", "保存并发布流程")) {
    ElMessage.warning("无权限");
    return;
  }
  
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  
  try {
    await ElMessageBox.confirm(`确定要发布新的流程版本吗？`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (err) {
    return;
  }

  const dialogModel2 = {
    ...dialogModel,
  };
  if (!showBuildIn) {
    Object.assign(dialogModel2, builtInModel);
  }
  Object.assign(dialogModel2, { is_deleted: undefined });

  const ids2 = await saveAndPublishsProcessDef(
    [ dialogModel2 ],
  );

  const id = ids2[0];
  if (!id) {
    return;
  }

  dialogModel.id = id;
  if (!changedIds.includes(id)) {
    changedIds.push(id);
  }

  ElMessage.success("保存并发布成功");

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
