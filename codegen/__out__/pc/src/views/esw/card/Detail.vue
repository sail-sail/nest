<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  @keydown.page-down="onPageDown"
  @keydown.page-up="onPageUp"
  @keydown.insert="onInsert"
  @keydown.ctrl.arrow-down="onPageDown"
  @keydown.ctrl.arrow-up="onPageUp"
  @keydown.ctrl.i="onInsert"
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
    <template v-if="!isLocked && !is_deleted">
      <div
        v-if="!isReadonly"
        :title="ns('锁定')"
      >
        <ElIconUnlock
          class="unlock_but"
          @click="isReadonly = true"
        >
        </ElIconUnlock>
      </div>
      <div
        v-else
        :title="ns('解锁')"
      >
        <ElIconLock
          class="lock_but"
          @click="isReadonly = false"
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
      un-p="5"
      un-gap="4"
      un-justify-start
      un-items-center
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
      >
        
        <template v-if="(showBuildIn || builtInModel?.lbl == null)">
          <el-form-item
            :label="n('卡号')"
            prop="lbl"
          >
            <CustomInput
              v-model="dialogModel.lbl"
              :placeholder="`${ ns('请输入') } ${ n('卡号') }`"
              :readonly="true"
              readonly-placeholder="(自动生成)"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.usr_id == null)">
          <el-form-item
            :label="n('绑定用户')"
            prop="usr_id"
          >
            <CustomSelect
              v-model="dialogModel.usr_id"
              :method="getUsrList"
              :options-map="((item: UsrModel) => {
                return {
                  label: item.lbl,
                  value: item.id,
                };
              })"
              :placeholder="`${ ns('请选择') } ${ n('绑定用户') }`"
              :readonly="isLocked || isReadonly"
            ></CustomSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.grade == null)">
          <el-form-item
            :label="n('会员等级')"
            prop="grade"
          >
            <DictbizSelect
              :set="dialogModel.grade = dialogModel.grade ?? undefined"
              v-model="dialogModel.grade"
              code="card_grade"
              :placeholder="`${ ns('请选择') } ${ n('会员等级') }`"
              :readonly="isLocked || isReadonly"
            ></DictbizSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.name == null)">
          <el-form-item
            :label="n('姓名')"
            prop="name"
          >
            <CustomInput
              v-model="dialogModel.name"
              :placeholder="`${ ns('请输入') } ${ n('姓名') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.mobile == null)">
          <el-form-item
            :label="n('电话')"
            prop="mobile"
          >
            <CustomInput
              v-model="dialogModel.mobile"
              :placeholder="`${ ns('请输入') } ${ n('电话') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.balance == null)">
          <el-form-item
            :label="n('充值余额')"
            prop="balance"
          >
            <CustomInputNumber
              v-model="dialogModel.balance"
              :max="99999999999.99"
              :precision="2"
              :placeholder="`${ ns('请输入') } ${ n('充值余额') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.give_balance == null)">
          <el-form-item
            :label="n('赠送余额')"
            prop="give_balance"
          >
            <CustomInputNumber
              v-model="dialogModel.give_balance"
              :max="99999999999.99"
              :precision="2"
              :placeholder="`${ ns('请输入') } ${ n('赠送余额') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.integral == null)">
          <el-form-item
            :label="n('积分')"
            prop="integral"
          >
            <CustomInputNumber
              v-model="dialogModel.integral"
              :placeholder="`${ ns('请输入') } ${ n('积分') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.growth_amt == null)">
          <el-form-item
            :label="n('累计消费')"
            prop="growth_amt"
          >
            <CustomInputNumber
              v-model="dialogModel.growth_amt"
              :max="99999999999.99"
              :precision="2"
              :placeholder="`${ ns('请输入') } ${ n('累计消费') }`"
              :readonly="true"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.rem == null)">
          <el-form-item
            :label="n('备注')"
            prop="rem"
            un-grid="col-span-2"
          >
            <CustomInput
              v-model="dialogModel.rem"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              @keyup.enter.stop
              :placeholder="`${ ns('请输入') } ${ n('备注') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
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
        <span>{{ n('关闭') }}</span>
      </el-button>
      
      <el-button
        v-if="!isLocked && !isReadonly"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ n('确定') }}</span>
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
          @click="onPrevId"
        >
          {{ n('上一项') }}
        </el-button>
        
        <span>
          {{ (dialogModel.id && ids.indexOf(dialogModel.id) || 0) + 1 }} / {{ ids.length }}
        </span>
        
        <el-button
          link
          :disabled="!dialogModel.id || ids.indexOf(dialogModel.id) >= ids.length - 1"
          @click="onNextId"
        >
          {{ n('下一项') }}
        </el-button>
        
        <span v-if="changedIds.length > 0">
          {{ changedIds.length }}
        </span>
        
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
} from "./Api";

import type {
  CardId,
} from "@/typings/ids";

import type {
  CardInput,
  UsrModel,
} from "#/types";

import {
  getUsrList,
} from "./Api";

import {
  CardGrade,
} from "#/types";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: CardId,
    },
  ],
}>();

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns,
} = useI18n("/esw/card");

const permitStore = usePermitStore();

const permit = permitStore.getPermit("/esw/card");

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
let dialogNotice = $ref("");

let dialogModel: CardInput = $ref({
} as CardInput);

let ids = $ref<CardId[]>([ ]);
let is_deleted = $ref<number>(0);
let changedIds = $ref<CardId[]>([ ]);

let formRef = $ref<InstanceType<typeof ElForm>>();

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(async () => {
  if (!inited) {
    form_rules = { };
    return;
  }
  await nextTick();
  form_rules = {
    // 会员等级
    grade: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("会员等级") }`,
      },
    ],
    // 姓名
    name: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("姓名") }`,
      },
      {
        type: "string",
        max: 10,
        message: `${ n("姓名") } ${ await nsAsync("长度不能超过 {0}", 10) }`,
      },
    ],
    // 电话
    mobile: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("电话") }`,
      },
      {
        type: "string",
        max: 22,
        message: `${ n("电话") } ${ await nsAsync("长度不能超过 {0}", 22) }`,
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: CardId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<CardInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

/** 新增时的默认值 */
async function getDefaultInput() {
  const defaultInput: CardInput = {
    grade: CardGrade.Normal,
    balance: "0.00",
    give_balance: "0.00",
    integral: 0,
    growth_amt: "0.00",
    is_locked: 0,
    is_enabled: 1,
  };
  return defaultInput;
}

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: CardInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      id?: CardId;
      ids?: CardId[];
      is_deleted?: number | null;
    };
    action: DialogAction;
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  oldDialogTitle = dialogTitle;
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
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    showBuildIn = toValue(arg?.showBuildIn) ?? showBuildIn;
    isReadonly = toValue(arg?.isReadonly) ?? isReadonly;
    
    if (dialogAction === "add") {
      isLocked = false;
    } else {
      if (!permit("edit")) {
        isLocked = true;
      } else {
        isLocked = dialogModel.is_locked == 1 ?? toValue(arg?.isLocked) ?? isLocked;
      }
    }
  });
  dialogAction = action || "add";
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
  };
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
      ...builtInModel,
      ...model,
    };
  } else if (dialogAction === "copy") {
    if (!model?.id) {
      return await dialogRes.dialogPrm;
    }
    const [
      data,
    ] = await Promise.all([
      findOne({
        id: model.id,
        is_deleted,
      }),
    ]);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
        is_default: undefined,
        is_default_lbl: undefined,
        is_locked: undefined,
        is_locked_lbl: undefined,
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
  () => [ isLocked, is_deleted, dialogNotice ],
  async () => {
    if (is_deleted) {
      dialogNotice = await nsAsync("(已删除)");
      return;
    }
    if (isLocked) {
      dialogNotice = await nsAsync("(已锁定)");
    } else {
      dialogNotice = "";
    }
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
  if (!dialogModel.id) {
    return;
  }
  const data = await findOne({
    id: dialogModel.id,
    is_deleted,
  });
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
    inited,
    dialogModel.usr_id,
    dialogModel.grade,
    dialogModel.is_default,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (!dialogModel.usr_id) {
      dialogModel.usr_id_lbl = "";
    }
    if (!dialogModel.grade) {
      dialogModel.grade_lbl = "";
    }
    if (!dialogModel.is_default) {
      dialogModel.is_default_lbl = "";
    }
  },
);

async function onSaveKeydown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopImmediatePropagation();
  customDialogRef?.focus();
  await onSave();
}

/** 确定 */
async function onSave() {
  if (isReadonly) {
    return;
  }
  if (!formRef) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  let id: CardId | undefined = undefined;
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
    msg = await nsAsync("添加成功");
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
    ElMessage.success(msg);
    const hasNext = await nextId();
    if (hasNext) {
      return;
    }
    onCloseResolve({
      type: "ok",
      changedIds,
    });
  }
}

/** 点击取消关闭按钮 */
function onClose() {
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  onCloseResolve({
    type: "cancel",
    changedIds,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  if (readonlyWatchStop) {
    readonlyWatchStop();
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
    "卡号",
    "绑定用户",
    "会员等级",
    "姓名",
    "电话",
    "充值余额",
    "赠送余额",
    "积分",
    "累计消费",
    "默认",
    "锁定",
    "启用",
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
