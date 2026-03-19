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
      title="重置"
    >
      <ElIconRefresh
        class="reset_but"
        @dblclick.stop
        @click="onReset"
      ></ElIconRefresh>
    </div>
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
        
        <template v-if="(showBuildIn || builtInModel?.appid == null)">
          <el-form-item
            label="开发者ID"
            prop="appid"
          >
            <CustomInput
              v-model="dialogModel.appid"
              placeholder="请输入 开发者ID"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.mchid == null)">
          <el-form-item
            label="商户号"
            prop="mchid"
          >
            <CustomInput
              v-model="dialogModel.mchid"
              placeholder="请输入 商户号"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.out_trade_no == null)">
          <el-form-item
            label="商户订单号"
            prop="out_trade_no"
          >
            <CustomInput
              v-model="dialogModel.out_trade_no"
              placeholder="请输入 商户订单号"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.transaction_id == null)">
          <el-form-item
            label="微信支付订单号"
            prop="transaction_id"
          >
            <CustomInput
              v-model="dialogModel.transaction_id"
              placeholder="请输入 微信支付订单号"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.out_refund_no == null)">
          <el-form-item
            label="商户退款单号"
            prop="out_refund_no"
          >
            <CustomInput
              v-model="dialogModel.out_refund_no"
              placeholder="请输入 商户退款单号"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.refund_id == null)">
          <el-form-item
            label="微信退款单号"
            prop="refund_id"
          >
            <CustomInput
              v-model="dialogModel.refund_id"
              placeholder="请输入 微信退款单号"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.reason == null)">
          <el-form-item
            label="退款原因"
            prop="reason"
          >
            <CustomInput
              v-model="dialogModel.reason"
              placeholder="请输入 退款原因"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.channel == null)">
          <el-form-item
            label="退款渠道"
            prop="channel"
          >
            <DictSelect
              v-model="dialogModel.channel"
              :set="dialogModel.channel = dialogModel.channel ?? undefined"
              code="wx_refund_channel"
              placeholder="请选择 退款渠道"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.user_received_account == null)">
          <el-form-item
            label="退款入账账户"
            prop="user_received_account"
          >
            <CustomInput
              v-model="dialogModel.user_received_account"
              placeholder="请输入 退款入账账户"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.success_time == null)">
          <el-form-item
            label="退款成功时间"
            prop="success_time"
          >
            <CustomDatePicker
              v-model="dialogModel.success_time"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              placeholder="请选择 退款成功时间"
              :readonly="isLocked || isReadonly"
            ></CustomDatePicker>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.status == null)">
          <el-form-item
            label="退款状态"
            prop="status"
          >
            <DictSelect
              v-model="dialogModel.status"
              :set="dialogModel.status = dialogModel.status ?? undefined"
              code="wx_refund_status"
              placeholder="请选择 退款状态"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.funds_account == null)">
          <el-form-item
            label="资金账户"
            prop="funds_account"
          >
            <DictSelect
              v-model="dialogModel.funds_account"
              :set="dialogModel.funds_account = dialogModel.funds_account ?? undefined"
              code="wx_refund_funds_account"
              placeholder="请选择 资金账户"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.amount_total == null)">
          <el-form-item
            label="订单金额(分)"
            prop="amount_total"
          >
            <CustomInputNumber
              v-model="dialogModel.amount_total"
              placeholder="请输入 订单金额(分)"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.amount_refund == null)">
          <el-form-item
            label="退款金额(分)"
            prop="amount_refund"
          >
            <CustomInputNumber
              v-model="dialogModel.amount_refund"
              placeholder="请输入 退款金额(分)"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.amount_payer_total == null)">
          <el-form-item
            label="用户实际支付金额(分)"
            prop="amount_payer_total"
          >
            <CustomInputNumber
              v-model="dialogModel.amount_payer_total"
              placeholder="请输入 用户实际支付金额(分)"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.amount_payer_refund == null)">
          <el-form-item
            label="用户退款金额(分)"
            prop="amount_payer_refund"
          >
            <CustomInputNumber
              v-model="dialogModel.amount_payer_refund"
              placeholder="请输入 用户退款金额(分)"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.amount_settlement_refund == null)">
          <el-form-item
            label="应结退款金额(分)"
            prop="amount_settlement_refund"
          >
            <CustomInputNumber
              v-model="dialogModel.amount_settlement_refund"
              placeholder="请输入 应结退款金额(分)"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.amount_discount_refund == null)">
          <el-form-item
            label="优惠退款金额(分)"
            prop="amount_discount_refund"
          >
            <CustomInputNumber
              v-model="dialogModel.amount_discount_refund"
              placeholder="请输入 优惠退款金额(分)"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.amount_currency == null)">
          <el-form-item
            label="退款币种"
            prop="amount_currency"
          >
            <DictSelect
              v-model="dialogModel.amount_currency"
              :set="dialogModel.amount_currency = dialogModel.amount_currency ?? undefined"
              code="wx_pay_notice_currency"
              placeholder="请选择 退款币种"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.amount_refund_fee == null)">
          <el-form-item
            label="手续费退款金额(分)"
            prop="amount_refund_fee"
          >
            <CustomInputNumber
              v-model="dialogModel.amount_refund_fee"
              placeholder="请输入 手续费退款金额(分)"
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
  findOneWxRefund,
  getDefaultInputWxRefund,
  getPagePathWxRefund,
  intoInputWxRefund,
} from "./Api.ts";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: WxRefundId,
    },
  ],
}>();

const pagePath = getPagePathWxRefund();

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

let dialogModel = $ref<WxRefundInput>({
} as WxRefundInput);

let wx_refund_model = $ref<WxRefundModel>();

let ids = $ref<WxRefundId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<WxRefundId[]>([ ]);

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
    // 退款渠道
    channel: [
      {
        required: true,
        message: "请选择 退款渠道",
      },
    ],
    // 退款状态
    status: [
      {
        required: true,
        message: "请选择 退款状态",
      },
    ],
    // 资金账户
    funds_account: [
      {
        required: true,
        message: "请选择 资金账户",
      },
    ],
    // 退款币种
    amount_currency: [
      {
        required: true,
        message: "请选择 退款币种",
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: WxRefundId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<WxRefundInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef("customDialogRef"));

let findOneModel = findOneWxRefund;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: WxRefundInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: WxRefundId[];
      is_deleted?: 0 | 1 | null;
    };
    findOne?: typeof findOneWxRefund;
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
    type: "default",
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
    findOneModel = findOneWxRefund;
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
  wx_refund_model = undefined;
  if (dialogAction === "copy" && !model?.ids?.[0]) {
    dialogAction = "add";
  }
  if (action === "add") {
    const [
      defaultModel,
    ] = await Promise.all([
      getDefaultInputWxRefund(),
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
    ] = await Promise.all([
      getDefaultInputWxRefund(),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
    };
    return;
  }
  const [
    data,
  ] = await Promise.all([
    await findOneModel({
      id,
    }),
  ]);
  if (data) {
    dialogModel = intoInputWxRefund({
      ...data,
    });
  }
  wx_refund_model = data;
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
    dialogModel.channel,
    dialogModel.success_time,
    dialogModel.status,
    dialogModel.funds_account,
    dialogModel.amount_currency,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (!dialogModel.channel) {
      dialogModel.channel_lbl = "";
    }
    if (!dialogModel.success_time) {
      dialogModel.success_time_lbl = "";
      dialogModel.success_time_save_null = true;
    }
    if (!dialogModel.status) {
      dialogModel.status_lbl = "";
    }
    if (!dialogModel.funds_account) {
      dialogModel.funds_account_lbl = "";
    }
    if (!dialogModel.amount_currency) {
      dialogModel.amount_currency_lbl = "";
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

defineExpose({
  showDialog,
  refresh: onRefresh,
});
</script>
