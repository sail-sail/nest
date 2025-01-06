<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  @open="onDialogOpen"
  @close="onDialogClose"
  @keydown.page-down="onPageDown"
  @keydown.page-up="onPageUp"
  @keydown.ctrl.arrow-down="onPageDown"
  @keydown.ctrl.arrow-up="onPageUp"
>
  <template #extra_header>
    <div
      :title="ns('重置')"
    >
      <ElIconRefresh
        class="reset_but"
        @click="onReset"
      ></ElIconRefresh>
    </div>
    <template v-if="!isLocked && !is_deleted && (dialogAction === 'edit' || dialogAction === 'view')">
      <div
        v-if="!isReadonly"
        :title="ns('锁定')"
      >
        <ElIconUnlock
          class="unlock_but"
          @click="isReadonly = true;"
        >
        </ElIconUnlock>
      </div>
      <div
        v-else
        :title="ns('解锁')"
      >
        <ElIconLock
          class="lock_but"
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
      un-p="x-8 y-5"
      un-box-border
      un-gap="4"
      un-justify-start
      un-items-safe-center
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
        
        <template v-if="(showBuildIn || builtInModel?.module == null)">
          <el-form-item
            :label="n('模块')"
            prop="module"
          >
            <CustomInput
              v-model="dialogModel.module"
              :placeholder="`${ ns('请输入') } ${ n('模块') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.module_lbl == null)">
          <el-form-item
            :label="n('模块名称')"
            prop="module_lbl"
          >
            <CustomInput
              v-model="dialogModel.module_lbl"
              :placeholder="`${ ns('请输入') } ${ n('模块名称') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.method == null)">
          <el-form-item
            :label="n('方法')"
            prop="method"
          >
            <CustomInput
              v-model="dialogModel.method"
              :placeholder="`${ ns('请输入') } ${ n('方法') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.method_lbl == null)">
          <el-form-item
            :label="n('方法名称')"
            prop="method_lbl"
          >
            <CustomInput
              v-model="dialogModel.method_lbl"
              :placeholder="`${ ns('请输入') } ${ n('方法名称') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.lbl == null)">
          <el-form-item
            :label="n('操作')"
            prop="lbl"
          >
            <CustomInput
              v-model="dialogModel.lbl"
              :placeholder="`${ ns('请输入') } ${ n('操作') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.time == null)">
          <el-form-item
            :label="n('耗时(毫秒)')"
            prop="time"
          >
            <CustomInputNumber
              v-model="dialogModel.time"
              :placeholder="`${ ns('请输入') } ${ n('耗时(毫秒)') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
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
        @click="onClose"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>{{ ns('关闭') }}</span>
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
  findOne,
  getDefaultInput,
  getPagePath,
} from "./Api";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: OperationRecordId,
    },
  ],
}>();

const pagePath = getPagePath();

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns,
} = useI18n(pagePath);

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

let dialogModel: OperationRecordInput = $ref({
} as OperationRecordInput);

let ids = $ref<OperationRecordId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<OperationRecordId[]>([ ]);

const formRef = $ref<InstanceType<typeof ElForm>>();

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(async () => {
  if (!inited) {
    form_rules = { };
    return;
  }
  await nextTick();
  form_rules = {
    // 操作
    lbl: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("操作") }`,
      },
      {
        type: "string",
        max: 100,
        message: `${ n("操作") } ${ await nsAsync("长度不能超过 {0}", 100) }`,
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: OperationRecordId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<OperationRecordInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

let findOneModel = findOne;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: OperationRecordInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: OperationRecordId[];
      is_deleted?: 0 | 1;
    };
    findOne?: typeof findOne;
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
  if (arg?.findOne) {
    findOneModel = arg.findOne;
  } else {
    findOneModel = findOne;
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
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
  };
  if (dialogAction === "copy" && !model?.ids?.[0]) {
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
      ...builtInModel,
      ...model,
    };
  } else if (dialogAction === "copy") {
    const id = model?.ids?.[0];
    if (!id) {
      return await dialogRes.dialogPrm;
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
      dialogModel = {
        ...data,
        id: undefined,
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

/** 重置 */
async function onReset() {
  if (!formRef) {
    return;
  }
  if (!isReadonly && !isLocked) {
    try {
      await ElMessageBox.confirm(
        await nsAsync("确定要重置表单吗"),
        {
          confirmButtonText: await nsAsync("确定"),
          cancelButtonText: await nsAsync("取消"),
          type: "warning",
        },
      );
    } catch (err) {
      return;
    }
  }
  if (dialogAction === "add" || dialogAction === "copy") {
    const [
      defaultModel,
    ] = await Promise.all([
      getDefaultInput(),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
    };
    nextTick(() => nextTick(() => formRef?.clearValidate()));
  } else if (dialogAction === "edit" || dialogAction === "view") {
    await onRefresh();
  }
  ElMessage({
    message: await nsAsync("表单重置完毕"),
    type: "success",
  });
}

/** 刷新 */
async function onRefresh() {
  const id = dialogModel.id;
  if (!id) {
    return;
  }
  const [
    data,
  ] = await Promise.all([
    await findOneModel({
      id,
      is_deleted,
    }),
  ]);
  if (data) {
    dialogModel = {
      ...data,
    };
    dialogTitle = `${ oldDialogTitle } - ${ dialogModel.lbl }`;
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
    ElMessage.warning(await nsAsync("已经是第一项了"));
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
    ElMessage.warning(await nsAsync("已经是最后一项了"));
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

/** 初始化ts中的国际化信息 */
async function onInitI18ns() {
  const codes: string[] = [
    "模块名称",
    "方法名称",
    "操作",
    "耗时(毫秒)",
    "操作前数据",
    "操作后数据",
    "操作人",
    "操作时间",
  ];
  await Promise.all([
    initDetailI18ns(),
    initI18ns(codes),
  ]);
}
onInitI18ns();

defineExpose({
  showDialog,
  refresh: onRefresh,
});
</script>
