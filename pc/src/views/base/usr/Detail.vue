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
        
        <template v-if="(showBuildIn || builtInModel?.img == null)">
          <el-form-item
            label="头像"
            prop="img"
          >
            <UploadImage
              v-model="dialogModel.img"
              db="base_usr.img"
              :is-public="false"
              :readonly="isLocked || isReadonly"
              :page-inited="inited"
            ></UploadImage>
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
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.username == null)">
          <el-form-item
            label="用户名"
            prop="username"
          >
            <CustomInput
              v-model="dialogModel.username"
              placeholder="请输入 用户名"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.password == null)">
          <el-form-item
            label="密码"
            prop="password"
          >
            <CustomInput
              v-model="dialogModel.password"
              type="password"
              show-password
              placeholder="请输入 密码"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.role_ids == null)">
          <el-form-item
            label="所属角色"
            prop="role_ids"
          >
            <CustomSelect
              v-model="dialogModel.role_ids"
              :set="dialogModel.role_ids = dialogModel.role_ids ?? [ ]"
              :method="getListRole"
              :find-by-values="findByIdsRole"
              :options-map="((item: RoleModel) => {
                return {
                  label: item.lbl,
                  value: item.id,
                };
              })"
              placeholder="请选择 所属角色"
              multiple
              :readonly="isLocked || isReadonly"
            ></CustomSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.dept_ids == null)">
          <el-form-item
            label="所属部门"
            prop="dept_ids"
          >
            <CustomTreeSelect
              v-model="dialogModel.dept_ids"
              :set="dialogModel.dept_ids = dialogModel.dept_ids ?? [ ]"
              :method="getTreeDept"
              placeholder="请选择 所属部门"
              multiple
              :readonly="isLocked || isReadonly"
            ></CustomTreeSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.org_ids == null)">
          <el-form-item
            label="所属组织"
            prop="org_ids"
          >
            <CustomSelect
              v-model="dialogModel.org_ids"
              :set="dialogModel.org_ids = dialogModel.org_ids ?? [ ]"
              :method="getListOrg"
              :find-by-values="findByIdsOrg"
              :options-map="((item: OrgModel) => {
                return {
                  label: item.lbl,
                  value: item.id,
                };
              })"
              placeholder="请选择 所属组织"
              multiple
              :readonly="isLocked || isReadonly"
            ></CustomSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.default_org_id == null)">
          <el-form-item
            label="默认组织"
            prop="default_org_id"
          >
            <CustomSelect
              ref="default_org_idRef"
              v-model="dialogModel.default_org_id"
              :init="false"
              :method="getListOrgApi"
              :find-by-values="findByIdsOrg"
              :options-map="((item: OrgModel) => {
                return {
                  label: item.lbl,
                  value: item.id,
                };
              })"
              placeholder="请选择 默认组织"
              :readonly="isLocked || isReadonly"
              @change="old_default_org_id = dialogModel.default_org_id;"
            ></CustomSelect>
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
              code="usr_type"
              placeholder="请选择 类型"
              :readonly="isLocked || isReadonly"
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
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.rem == null)">
          <el-form-item
            label="备注"
            prop="rem"
            un-grid="col-span-full"
          >
            <CustomInput
              v-model="dialogModel.rem"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="请输入 备注"
              :readonly="isLocked || isReadonly"
              @keyup.enter.stop
            ></CustomInput>
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
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>保存</span>
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
  createUsr,
  findOneUsr,
  findLastOrderByUsr,
  updateByIdUsr,
  getDefaultInputUsr,
  getPagePathUsr,
  intoInputUsr,
} from "./Api.ts";

import {
  getListRole,
  getListOrg,
} from "./Api.ts";

import {
  findByIdsRole,
} from "@/views/base/role/Api.ts";

import {
  findByIdsOrg,
} from "@/views/base/org/Api.ts";

import {
  getTreeDept,
} from "@/views/base/dept/Api.ts";

import {
  findAllOrg as getOrgList,
} from "@/views/base/org/Api.ts";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: UsrId,
    },
  ],
}>();

const pagePath = getPagePathUsr();

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

let dialogModel: UsrInput = $ref({
  role_ids: [ ],
  dept_ids: [ ],
  org_ids: [ ],
} as UsrInput);

let usr_model = $ref<UsrModel>();

let ids = $ref<UsrId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<UsrId[]>([ ]);

const formRef = $(useTemplateRef<InstanceType<typeof ElForm>>("formRef"));

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(async () => {
  if (!inited) {
    form_rules = { };
    return;
  }
  await nextTick();
  form_rules = {
    // 名称
    lbl: [
      {
        required: true,
        message: "请输入 名称",
      },
      {
        type: "string",
        max: 45,
        message: "名称 长度不能超过 45",
      },
    ],
    // 用户名
    username: [
      {
        required: true,
        message: "请输入 用户名",
      },
      {
        type: "string",
        max: 45,
        message: "用户名 长度不能超过 45",
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
  changedIds: UsrId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<UsrInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let findOneModel = findOneUsr;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: UsrInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: UsrId[];
      is_deleted?: 0 | 1 | null;
    };
    findOne?: typeof findOneUsr;
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
    findOneModel = findOneUsr;
  }
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    showBuildIn = toValue(arg?.showBuildIn) ?? showBuildIn;
    isReadonly = toValue(arg?.isReadonly) ?? isReadonly;
    oldIsLocked = toValue(arg?.isLocked) ?? false;
    
    if (dialogAction === "add") {
      isLocked = false;
    } else {
      if (!permit("edit")) {
        isLocked = true;
      } else {
        isLocked = (toValue(arg?.isLocked) || dialogModel.is_locked == 1) ?? isLocked;
      }
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
      order_by,
    ] = await Promise.all([
      getDefaultInputUsr(),
      findLastOrderByUsr({
        notLoading: !inited,
      }),
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
      data,
      order_by,
    ] = await Promise.all([
      findOneModel({
        id,
        is_deleted,
      }),
      findLastOrderByUsr({
        notLoading: !inited,
      }),
    ]);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
        is_locked: undefined,
        is_locked_lbl: undefined,
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

watch(
  () => [ inited, isLocked, is_deleted, dialogNotice ],
  async () => {
    if (!inited) {
      return;
    }
    if (oldDialogNotice != null) {
      return;
    }
    if (is_deleted) {
      dialogNotice = "(已删除)";
      return;
    }
    if (isLocked) {
      dialogNotice = "(已锁定)";
      return;
    }
    dialogNotice = "";
  },
);

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
  if (dialogAction === "add" || dialogAction === "copy") {
    const [
      defaultModel,
      order_by,
    ] = await Promise.all([
      getDefaultInputUsr(),
      findLastOrderByUsr({
        notLoading: !inited,
      }),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      order_by: order_by + 1,
    };
    nextTick(() => nextTick(() => formRef?.clearValidate()));
  } else if (dialogAction === "edit" || dialogAction === "view") {
    await onRefresh();
  }
  ElMessage({
    message: "表单重置完毕",
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
    dialogModel = intoInputUsr({
      ...data,
    });
    old_default_org_id = dialogModel.default_org_id;
    dialogTitle = `${ oldDialogTitle } - ${ dialogModel.lbl }`;
  }
  usr_model = data;
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
    dialogModel.role_ids,
    dialogModel.dept_ids,
    dialogModel.org_ids,
    dialogModel.default_org_id,
    dialogModel.type,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (!dialogModel.role_ids || dialogModel.role_ids.length === 0) {
      dialogModel.role_ids_lbl = [ ];
    }
    if (!dialogModel.dept_ids || dialogModel.dept_ids.length === 0) {
      dialogModel.dept_ids_lbl = [ ];
    }
    if (!dialogModel.org_ids || dialogModel.org_ids.length === 0) {
      dialogModel.org_ids_lbl = [ ];
    }
    if (!dialogModel.default_org_id) {
      dialogModel.default_org_id_lbl = "";
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
  if (isReadonly) {
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
  let id: UsrId | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await createUsr(dialogModel2);
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
    id = await updateByIdUsr(
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

const default_org_idRef = $(useTemplateRef<InstanceType<typeof CustomSelect>>("default_org_idRef"));
let old_default_org_id: OrgId | null | undefined = undefined;

async function getListOrgApi() {
  const org_ids = dialogModel.org_ids || [ ];
  if (!dialogModel.default_org_id && old_default_org_id) {
    if (org_ids.includes(old_default_org_id)) {
      dialogModel.default_org_id = old_default_org_id;
    }
  }
  if (!dialogModel.default_org_id || !org_ids.includes(dialogModel.default_org_id)) {
    dialogModel.default_org_id = undefined;
  }
  let data = await getListOrg();
  data = data.filter((item) => {
    return org_ids.includes(item.id);
  });
  return data;
}

watch(
  () => [
    dialogModel.org_ids,
    default_org_idRef,
  ],
  async () => {
    if (!default_org_idRef) {
      return;
    }
    await default_org_idRef.refresh();
  },
);

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
