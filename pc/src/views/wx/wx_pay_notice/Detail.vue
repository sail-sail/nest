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
        
        <template v-if="(showBuildIn || builtInModel?.appid == null)">
          <el-form-item
            :label="n('开发者ID')"
            prop="appid"
          >
            <CustomInput
              v-model="dialogModel.appid"
              :placeholder="`${ ns('请输入') } ${ n('开发者ID') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.mchid == null)">
          <el-form-item
            :label="n('商户号')"
            prop="mchid"
          >
            <CustomInput
              v-model="dialogModel.mchid"
              :placeholder="`${ ns('请输入') } ${ n('商户号') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.openid == null)">
          <el-form-item
            :label="n('用户标识')"
            prop="openid"
          >
            <CustomInput
              v-model="dialogModel.openid"
              :placeholder="`${ ns('请输入') } ${ n('用户标识') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.out_trade_no == null)">
          <el-form-item
            :label="n('商户订单号')"
            prop="out_trade_no"
          >
            <CustomInput
              v-model="dialogModel.out_trade_no"
              :placeholder="`${ ns('请输入') } ${ n('商户订单号') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.transaction_id == null)">
          <el-form-item
            :label="n('微信支付订单号')"
            prop="transaction_id"
          >
            <CustomInput
              v-model="dialogModel.transaction_id"
              :placeholder="`${ ns('请输入') } ${ n('微信支付订单号') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.trade_type == null)">
          <el-form-item
            :label="n('交易类型')"
            prop="trade_type"
          >
            <DictSelect
              v-model="dialogModel.trade_type"
              :set="dialogModel.trade_type = dialogModel.trade_type ?? undefined"
              code="wx_unified_order_trade_type"
              :placeholder="`${ ns('请选择') } ${ n('交易类型') }`"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.trade_state == null)">
          <el-form-item
            :label="n('交易状态')"
            prop="trade_state"
          >
            <DictSelect
              v-model="dialogModel.trade_state"
              :set="dialogModel.trade_state = dialogModel.trade_state ?? undefined"
              code="wx_pay_notice_trade_state"
              :placeholder="`${ ns('请选择') } ${ n('交易状态') }`"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.trade_state_desc == null)">
          <el-form-item
            :label="n('交易状态描述')"
            prop="trade_state_desc"
          >
            <CustomInput
              v-model="dialogModel.trade_state_desc"
              :placeholder="`${ ns('请输入') } ${ n('交易状态描述') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.bank_type == null)">
          <el-form-item
            :label="n('付款银行')"
            prop="bank_type"
          >
            <CustomInput
              v-model="dialogModel.bank_type"
              :placeholder="`${ ns('请输入') } ${ n('付款银行') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.attach == null)">
          <el-form-item
            :label="n('附加数据')"
            prop="attach"
          >
            <CustomInput
              v-model="dialogModel.attach"
              :placeholder="`${ ns('请输入') } ${ n('附加数据') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.success_time == null)">
          <el-form-item
            :label="n('支付完成时间')"
            prop="success_time"
          >
            <CustomDatePicker
              v-model="dialogModel.success_time"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="`${ ns('请选择') } ${ n('支付完成时间') }`"
              :readonly="isLocked || isReadonly"
            ></CustomDatePicker>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.total == null)">
          <el-form-item
            :label="n('总金额')"
            prop="total"
          >
            <CustomInputNumber
              v-model="dialogModel.total"
              :placeholder="`${ ns('请输入') } ${ n('总金额') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.payer_total == null)">
          <el-form-item
            :label="n('用户支付金额')"
            prop="payer_total"
          >
            <CustomInputNumber
              v-model="dialogModel.payer_total"
              :placeholder="`${ ns('请输入') } ${ n('用户支付金额') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.currency == null)">
          <el-form-item
            :label="n('货币类型')"
            prop="currency"
          >
            <DictSelect
              v-model="dialogModel.currency"
              :set="dialogModel.currency = dialogModel.currency ?? undefined"
              code="wx_pay_notice_currency"
              :placeholder="`${ ns('请选择') } ${ n('货币类型') }`"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.payer_currency == null)">
          <el-form-item
            :label="n('用户支付币种')"
            prop="payer_currency"
          >
            <DictSelect
              v-model="dialogModel.payer_currency"
              :set="dialogModel.payer_currency = dialogModel.payer_currency ?? undefined"
              code="wx_pay_notice_currency"
              :placeholder="`${ ns('请选择') } ${ n('用户支付币种') }`"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.device_id == null)">
          <el-form-item
            :label="n('商户端设备号')"
            prop="device_id"
          >
            <CustomInput
              v-model="dialogModel.device_id"
              :placeholder="`${ ns('请输入') } ${ n('商户端设备号') }`"
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
        
        <template v-if="(showBuildIn || builtInModel?.raw == null)">
          <el-form-item
            :label="n('原始数据')"
            prop="raw"
          >
            <CustomInput
              v-model="dialogModel.raw"
              :placeholder="`${ ns('请输入') } ${ n('原始数据') }`"
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
      id: WxPayNoticeId,
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

let dialogModel: WxPayNoticeInput = $ref({
} as WxPayNoticeInput);

let ids = $ref<WxPayNoticeId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<WxPayNoticeId[]>([ ]);

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
    // 交易类型
    trade_type: [
      {
        required: true,
        message: `${ await nsAsync("请选择") } ${ n("交易类型") }`,
      },
    ],
    // 交易状态
    trade_state: [
      {
        required: true,
        message: `${ await nsAsync("请选择") } ${ n("交易状态") }`,
      },
    ],
    // 货币类型
    currency: [
      {
        required: true,
        message: `${ await nsAsync("请选择") } ${ n("货币类型") }`,
      },
    ],
    // 用户支付币种
    payer_currency: [
      {
        required: true,
        message: `${ await nsAsync("请选择") } ${ n("用户支付币种") }`,
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: WxPayNoticeId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<WxPayNoticeInput>();

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
    builtInModel?: WxPayNoticeInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      id?: WxPayNoticeId;
      ids?: WxPayNoticeId[];
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
      findOneModel({
        id: model.id,
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
    dialogModel.trade_type,
    dialogModel.trade_state,
    dialogModel.success_time,
    dialogModel.currency,
    dialogModel.payer_currency,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (!dialogModel.trade_type) {
      dialogModel.trade_type_lbl = "";
    }
    if (!dialogModel.trade_state) {
      dialogModel.trade_state_lbl = "";
    }
    if (!dialogModel.success_time) {
      dialogModel.success_time_lbl = "";
      dialogModel.success_time_save_null = true;
    }
    if (!dialogModel.currency) {
      dialogModel.currency_lbl = "";
    }
    if (!dialogModel.payer_currency) {
      dialogModel.payer_currency_lbl = "";
    }
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

/** 初始化ts中的国际化信息 */
async function onInitI18ns() {
  const codes: string[] = [
    "开发者ID",
    "商户号",
    "用户标识",
    "商户订单号",
    "微信支付订单号",
    "交易类型",
    "交易状态",
    "交易状态描述",
    "付款银行",
    "附加数据",
    "支付完成时间",
    "总金额",
    "用户支付金额",
    "货币类型",
    "用户支付币种",
    "商户端设备号",
    "备注",
    "原始数据",
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
