<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <template #extra_header>
    <template v-if="!isLocked">
      <ElIconUnlock
        v-if="!isReadonly"
        class="unlock_but"
        @click="isReadonly = true"
      >
      </ElIconUnlock>
      <ElIconLock
        v-else
        class="lock_but"
        @click="isReadonly = false"
      ></ElIconLock>
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
        
        <template v-if="(showBuildIn || builtInModel?.appid == null)">
          <el-form-item
            :label="n('appid')"
            prop="appid"
          >
            <CustomInput
              v-model="dialogModel.appid"
              :placeholder="`${ ns('请输入') } ${ n('appid') }`"
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
        
        <template v-if="(showBuildIn || builtInModel?.description == null)">
          <el-form-item
            :label="n('商品描述')"
            prop="description"
          >
            <CustomInput
              v-model="dialogModel.description"
              :placeholder="`${ ns('请输入') } ${ n('商品描述') }`"
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
        
        <template v-if="(showBuildIn || builtInModel?.trade_state == null)">
          <el-form-item
            :label="n('交易状态')"
            prop="trade_state"
          >
            <DictbizSelect
              :set="dialogModel.trade_state = dialogModel.trade_state ?? undefined"
              v-model="dialogModel.trade_state"
              code="wx_pay_notice_trade_state"
              :placeholder="`${ ns('请选择') } ${ n('交易状态') }`"
              :readonly="isLocked || isReadonly"
            ></DictbizSelect>
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
              :readonly="isReadonly"
            ></CustomDatePicker>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.time_expire == null)">
          <el-form-item
            :label="n('交易限制时间')"
            prop="time_expire"
          >
            <CustomInput
              v-model="dialogModel.time_expire"
              :placeholder="`${ ns('请输入') } ${ n('交易限制时间') }`"
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
        
        <template v-if="(showBuildIn || builtInModel?.attach2 == null)">
          <el-form-item
            :label="n('附加数据2')"
            prop="attach2"
          >
            <CustomInput
              v-model="dialogModel.attach2"
              :placeholder="`${ ns('请输入') } ${ n('附加数据2') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.notify_url == null)">
          <el-form-item
            :label="n('通知地址')"
            prop="notify_url"
          >
            <CustomInput
              v-model="dialogModel.notify_url"
              :placeholder="`${ ns('请输入') } ${ n('通知地址') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.support_fapiao == null)">
          <el-form-item
            :label="n('是否支持发票')"
            prop="support_fapiao"
          >
            <DictSelect
              :set="dialogModel.support_fapiao = dialogModel.support_fapiao ?? undefined"
              v-model="dialogModel.support_fapiao"
              code="is_enabled"
              :placeholder="`${ ns('请选择') } ${ n('是否支持发票') }`"
              :readonly="isLocked || isReadonly"
            ></DictSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.total_fee == null)">
          <el-form-item
            :label="n('订单金额(分)')"
            prop="total_fee"
          >
            <CustomInputNumber
              v-model="dialogModel.total_fee"
              :placeholder="`${ ns('请输入') } ${ n('订单金额(分)') }`"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.currency == null)">
          <el-form-item
            :label="n('货币类型')"
            prop="currency"
          >
            <DictbizSelect
              :set="dialogModel.currency = dialogModel.currency ?? undefined"
              v-model="dialogModel.currency"
              code="wx_pay_notice_currency"
              :placeholder="`${ ns('请选择') } ${ n('货币类型') }`"
              :readonly="isLocked || isReadonly"
            ></DictbizSelect>
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
        
        <template v-if="(showBuildIn || builtInModel?.prepay_id == null)">
          <el-form-item
            :label="n('预支付交易会话标识')"
            prop="prepay_id"
          >
            <CustomInput
              v-model="dialogModel.prepay_id"
              :placeholder="`${ ns('请输入') } ${ n('预支付交易会话标识') }`"
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
  findById,
} from "./Api";

import type {
  PayTransactionsJsapiInput,
} from "#/types";

import {
} from "./Api";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: string,
    },
  ],
}>();

const {
  n,
  ns,
  nsAsync,
  initI18ns,
  initSysI18ns,
} = useI18n("/wx/pay_transactions_jsapi");

const permitStore = usePermitStore();

const permit = permitStore.getPermit("/wx/pay_transactions_jsapi");

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
let dialogNotice = $ref("");

let dialogModel = $ref({
} as PayTransactionsJsapiInput);

let ids = $ref<string[]>([ ]);
let changedIds = $ref<string[]>([ ]);

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
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: string[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<PayTransactionsJsapiInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

/** 增加时的默认值 */
async function getDefaultInput() {
  const defaultInput: PayTransactionsJsapiInput = {
    trade_state: "NOTPAY",
    trade_state_desc: "未支付",
    support_fapiao: 0,
    total_fee: 0,
  };
  return defaultInput;
}

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: PayTransactionsJsapiInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      id?: string;
      ids?: string[];
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
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    showBuildIn = toValue(arg?.showBuildIn) ?? showBuildIn;
    isReadonly = toValue(arg?.isReadonly) ?? isReadonly;
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
    const data = await findById(model.id);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
      };
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

/** 刷新 */
async function onRefresh() {
  if (!dialogModel.id) {
    return;
  }
  const data = await findById(dialogModel.id);
  if (data) {
    dialogModel = {
      ...data,
    };
  }
}

/** 点击上一项 */
async function onPrevId() {
  await prevId();
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

/** 点击下一项 */
async function onNextId() {
  await nextId();
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
    "appid",
    "商户号",
    "商品描述",
    "商户订单号",
    "微信支付订单号",
    "交易状态",
    "交易状态描述",
    "支付完成时间",
    "交易限制时间",
    "附加数据",
    "附加数据2",
    "通知地址",
    "是否支持发票",
    "订单金额(分)",
    "货币类型",
    "用户标识",
    "预支付交易会话标识",
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
