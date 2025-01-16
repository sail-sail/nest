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
  @keydown.ctrl.shift.enter="onSaveAndCopyKeydown"
  @keydown.ctrl.enter="onSaveKeydown"
  @keydown.ctrl.s="onSaveKeydown"
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
      un-p="x-8 y-4"
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
        
        <template v-if="(showBuildIn || builtInModel?.lbl == null)">
          <el-form-item
            :label="n('名称')"
            prop="lbl"
          >
            <CustomInput
              v-model="dialogModel.lbl"
              :placeholder="`${ ns('请输入') } ${ n('名称') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.usr_id == null)">
          <el-form-item
            :label="n('用户')"
            prop="usr_id"
          >
            <CustomSelect
              v-model="dialogModel.usr_id"
              v-model:model-label="dialogModel.usr_id_lbl"
              :method="getUsrList"
              :options-map="((item: UsrModel) => {
                return {
                  label: item.lbl,
                  value: item.id,
                };
              })"
              :placeholder="`${ ns('请选择') } ${ n('用户') }`"
              :readonly="isLocked || isReadonly"
            ></CustomSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.nick_name == null)">
          <el-form-item
            :label="n('昵称')"
            prop="nick_name"
          >
            <CustomInput
              v-model="dialogModel.nick_name"
              :placeholder="`${ ns('请输入') } ${ n('昵称') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.avatar_img == null)">
          <el-form-item
            :label="n('头像')"
            prop="avatar_img"
          >
            <UploadImage
              v-model="dialogModel.avatar_img"
              db="wx_wx_usr.avatar_img"
              :is-public="true"
              :readonly="isLocked || isReadonly"
              :page-inited="inited"
            ></UploadImage>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.mobile == null)">
          <el-form-item
            :label="n('手机')"
            prop="mobile"
          >
            <CustomInput
              v-model="dialogModel.mobile"
              :placeholder="`${ ns('请输入') } ${ n('手机') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.openid == null)">
          <el-form-item
            :label="n('小程序用户唯一标识')"
            prop="openid"
          >
            <CustomInput
              v-model="dialogModel.openid"
              :placeholder="`${ ns('请输入') } ${ n('小程序用户唯一标识') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.unionid == null)">
          <el-form-item
            :label="n('用户统一标识')"
            prop="unionid"
          >
            <CustomInput
              v-model="dialogModel.unionid"
              :placeholder="`${ ns('请输入') } ${ n('用户统一标识') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.gender == null)">
          <el-form-item
            :label="n('性别')"
            prop="gender"
          >
            <DictSelect
              v-model="dialogModel.gender"
              :set="dialogModel.gender = dialogModel.gender ?? undefined"
              code="wx_usr_gender"
              :placeholder="`${ ns('请选择') } ${ n('性别') }`"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.city == null)">
          <el-form-item
            :label="n('城市')"
            prop="city"
          >
            <CustomInput
              v-model="dialogModel.city"
              :placeholder="`${ ns('请输入') } ${ n('城市') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.province == null)">
          <el-form-item
            :label="n('省份')"
            prop="province"
          >
            <CustomInput
              v-model="dialogModel.province"
              :placeholder="`${ ns('请输入') } ${ n('省份') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.country == null)">
          <el-form-item
            :label="n('国家')"
            prop="country"
          >
            <CustomInput
              v-model="dialogModel.country"
              :placeholder="`${ ns('请输入') } ${ n('国家') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.language == null)">
          <el-form-item
            :label="n('语言')"
            prop="language"
          >
            <CustomInput
              v-model="dialogModel.language"
              :placeholder="`${ ns('请输入') } ${ n('语言') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.rem == null)">
          <el-form-item
            :label="n('备注')"
            prop="rem"
            un-grid="col-span-full"
          >
            <CustomInput
              v-model="dialogModel.rem"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              :placeholder="`${ ns('请输入') } ${ n('备注') }`"
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
        <span>{{ ns('关闭') }}</span>
      </el-button>
      
      <el-button
        v-if="(dialogAction === 'add' || dialogAction === 'copy') && permit('add') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSaveAndCopy"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ ns('保存并继续') }}</span>
      </el-button>
      
      <el-button
        v-if="(dialogAction === 'add' || dialogAction === 'copy') && permit('add') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ ns('保存') }}</span>
      </el-button>
      
      <el-button
        v-if="(dialogAction === 'edit' || dialogAction === 'view') && permit('edit') && !isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ ns('保存') }}</span>
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
  create,
  findOne,
  updateById,
  getDefaultInput,
  getPagePath,
} from "./Api";

import {
  getUsrList,
} from "./Api";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: WxUsrId,
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

let dialogModel: WxUsrInput = $ref({
} as WxUsrInput);

let ids = $ref<WxUsrId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<WxUsrId[]>([ ]);

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
        message: `${ await nsAsync("请输入") } ${ n("名称") }`,
      },
      {
        type: "string",
        max: 100,
        message: `${ n("名称") } ${ await nsAsync("长度不能超过 {0}", 100) }`,
      },
    ],
    // 用户
    usr_id: [
      {
        required: true,
        message: `${ await nsAsync("请选择") } ${ n("用户") }`,
      },
    ],
    // 性别
    gender: [
      {
        required: true,
        message: `${ await nsAsync("请选择") } ${ n("性别") }`,
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: WxUsrId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<WxUsrInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let findOneModel = findOne;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: WxUsrInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: WxUsrId[];
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

watch(
  () => [
    dialogModel.usr_id,
    dialogModel.gender,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (!dialogModel.usr_id) {
      dialogModel.usr_id_lbl = "";
    }
    if (!dialogModel.gender) {
      dialogModel.gender_lbl = "";
    }
  },
);

/** 快捷键ctrl+shift+回车 */
async function onSaveAndCopyKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  if (dialogAction === "add" || dialogAction === "copy") {
    customDialogRef?.focus();
    await onSaveAndCopy();
  }
}

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
  let id: WxUsrId | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await create(dialogModel2);
    dialogModel.id = id;
    msg = await nsAsync("新增成功");
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
    id = await updateById(
      dialogModel.id,
      dialogModel2,
    );
    msg = await nsAsync("编辑成功");
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

/** 保存并继续 */
async function onSaveAndCopy() {
  const id = await save();
  if (!id) {
    return;
  }
  dialogAction = "copy";
  const [
    data,
  ] = await Promise.all([
    findOneModel({
      id,
      is_deleted,
    }),
  ]);
  if (!data) {
    return;
  }
  dialogModel = {
    ...data,
    id: undefined,
  };
  Object.assign(dialogModel, { is_deleted: undefined });
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

/** 初始化ts中的国际化信息 */
async function onInitI18ns() {
  const codes: string[] = [
    "名称",
    "用户",
    "昵称",
    "头像",
    "手机",
    "小程序用户唯一标识",
    "用户统一标识",
    "性别",
    "城市",
    "省份",
    "国家",
    "语言",
    "备注",
    "创建人",
    "创建时间",
    "更新人",
    "更新时间",
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
