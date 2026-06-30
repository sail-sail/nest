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
        
        un-grid="~ cols-[repeat(2,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
        
        @submit.prevent
      >
        
        <template v-if="(showBuildIn || builtInModel?.category == null)">
          <el-form-item
            label="分类"
            prop="category"
          >
            <DictSelect
              v-model="dialogModel.category"
              :set="dialogModel.category = dialogModel.category ?? undefined"
              code="message_category"
              placeholder="请选择 分类"
              :readonly="isLocked || isReadonly"
              :has-select-add="true"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.channel == null)">
          <el-form-item
            label="发送通道"
            prop="channel"
          >
            <DictSelect
              v-model="dialogModel.channel"
              :set="dialogModel.channel = dialogModel.channel ?? undefined"
              code="message_channel"
              placeholder="请选择 发送通道"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.title == null)">
          <el-form-item
            label="标题"
            prop="title"
          >
            <CustomInput
              v-model="dialogModel.title"
              placeholder="请输入 标题"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.content == null)">
          <el-form-item
            label="内容"
            prop="content"
          >
            <CustomInput
              v-model="dialogModel.content"
              placeholder="请输入 内容"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.route_path == null)">
          <el-form-item
            label="跳转路由"
            prop="route_path"
          >
            <CustomInput
              v-model="dialogModel.route_path"
              placeholder="请输入 跳转路由"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.route_query == null)">
          <el-form-item
            label="跳转参数"
            prop="route_query"
          >
            <CustomInput
              v-model="dialogModel.route_query"
              placeholder="请输入 跳转参数"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.sender_usr_id == null)">
          <el-form-item
            label="发送人"
            prop="sender_usr_id"
          >
            <CustomSelect
              v-model="dialogModel.sender_usr_id"
              v-model:model-label="dialogModel.sender_usr_id_lbl"
              :method="getListUsr"
              :find-by-values="findByIdsUsr"
              :options-map="((item: UsrModel) => {
                return {
                  label: item.lbl,
                  value: item.id,
                };
              })"
              placeholder="请选择 发送人"
              :readonly="isLocked || isReadonly"
              :page-inited="inited"
            ></CustomSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.is_sys_msg == null)">
          <el-form-item
            label="系统消息"
            prop="is_sys_msg"
          >
            <DictSelect
              v-model="dialogModel.is_sys_msg"
              :set="dialogModel.is_sys_msg = dialogModel.is_sys_msg ?? undefined"
              code="yes_no"
              placeholder="请选择 系统消息"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.is_pinned == null)">
          <el-form-item
            label="置顶"
            prop="is_pinned"
          >
            <DictSelect
              v-model="dialogModel.is_pinned"
              :set="dialogModel.is_pinned = dialogModel.is_pinned ?? undefined"
              code="yes_no"
              placeholder="请选择 置顶"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.org_id == null)">
          <el-form-item
            label="所属组织"
            prop="org_id"
          >
            <CustomSelect
              v-model="dialogModel.org_id"
              v-model:model-label="dialogModel.org_id_lbl"
              :method="getListOrg"
              :find-by-values="findByIdsOrg"
              :options-map="((item: OrgModel) => {
                return {
                  label: item.lbl,
                  value: item.id,
                };
              })"
              placeholder="请选择 所属组织"
              :readonly="isLocked || isReadonly"
              :page-inited="inited"
            ></CustomSelect>
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

<script lang="ts" setup vapor>
import type {
  MaybeRefOrGetter,
  WatchStopHandle,
} from "vue";

import {
  createMessage,
  findOneMessage,
  updateByIdMessage,
  getDefaultInputMessage,
  getPagePathMessage,
  intoInputMessage,
} from "./Api.ts";

import {
  getListUsr,
  getListOrg,
} from "./Api.ts";

import {
  findByIdsUsr,
} from "@/views/base/usr/Api.ts";

import {
  findByIdsOrg,
} from "@/views/base/org/Api.ts";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: MessageId,
    },
  ],
}>();

const pagePath = getPagePathMessage();

const permitStore = usePermitStore();

const permit = permitStore.getPermit(pagePath);

let inited = $ref(false);
let is_form_hydrating = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
let oldDialogNotice: string | undefined = undefined;
let oldIsLocked = $ref(false);
let dialogNotice = $ref("");

let dialogModel = $ref<MessageInput>({
} as MessageInput);

let message_model = $ref<MessageModel>();

let ids = $ref<MessageId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<MessageId[]>([ ]);

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
    // 分类
    category: [
      {
        required: true,
        message: "请选择 分类",
      },
    ],
    // 发送通道
    channel: [
      {
        required: true,
        message: "请选择 发送通道",
      },
    ],
    // 标题
    title: [
      {
        required: true,
        message: "请输入 标题",
      },
      {
        type: "string",
        max: 100,
        message: "标题 长度不能超过 100",
      },
    ],
    // 发送人
    sender_usr_id: [
      {
        required: true,
        message: "请选择 发送人",
      },
    ],
    // 系统消息
    is_sys_msg: [
      {
        required: true,
        message: "请选择 系统消息",
      },
    ],
    // 置顶
    is_pinned: [
      {
        required: true,
        message: "请选择 置顶",
      },
    ],
    // 所属组织
    org_id: [
      {
        required: true,
        message: "请选择 所属组织",
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: MessageId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<MessageInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef("customDialogRef"));

let findOneModel = findOneMessage;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: MessageInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: MessageId[];
      is_deleted?: 0 | 1 | null;
    };
    findOne?: typeof findOneMessage;
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
    findOneModel = findOneMessage;
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
  message_model = undefined;
  if (dialogAction === "copy" && !model?.ids?.[0]) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,
    ] = await Promise.all([
      getDefaultInputMessage(),
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
      ] = await Promise.all([
        getDefaultInputMessage(),
      ]);
      dialogModel = {
        ...defaultModel,
        ...builtInModel,
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
      dialogModel = intoInputMessage({
        ...data,
      });
      dialogTitle = `${ oldDialogTitle } - ${ dialogModel.content }`;
    }
    message_model = data;
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
    dialogModel.category,
    dialogModel.channel,
    dialogModel.sender_usr_id,
    dialogModel.is_sys_msg,
    dialogModel.is_pinned,
    dialogModel.org_id,
  ],
  () => {
    if (!inited || is_form_hydrating) {
      return;
    }
    if (!dialogModel.category) {
      dialogModel.category_lbl = "";
    }
    if (!dialogModel.channel) {
      dialogModel.channel_lbl = "";
    }
    if (!dialogModel.sender_usr_id) {
      dialogModel.sender_usr_id_lbl = "";
    }
    if (!dialogModel.is_sys_msg) {
      dialogModel.is_sys_msg_lbl = "";
    }
    if (!dialogModel.is_pinned) {
      dialogModel.is_pinned_lbl = "";
    }
    if (!dialogModel.org_id) {
      dialogModel.org_id_lbl = "";
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
  let id: MessageId | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await createMessage(dialogModel2);
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
    id = await updateByIdMessage(
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
