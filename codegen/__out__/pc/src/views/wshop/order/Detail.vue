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
        
        <template v-if="(showBuildIn || builtInModel?.lbl == null)">
          <el-form-item
            label="订单号"
            prop="lbl"
          >
            <CustomInput
              v-model="dialogModel.lbl"
              placeholder="请输入 订单号"
              :readonly="true"
              :readonly-placeholder="inited ? '(自动生成)' : ''"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.company == null)">
          <el-form-item
            label="公司"
            prop="company"
          >
            <CustomInput
              v-model="dialogModel.company"
              placeholder="请输入 公司"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.phone == null)">
          <el-form-item
            label="联系电话"
            prop="phone"
          >
            <CustomInput
              v-model="dialogModel.phone"
              placeholder="请输入 联系电话"
              :readonly="isLocked || isReadonly"
            ></CustomInput>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.status == null)">
          <el-form-item
            label="订单状态"
            prop="status"
          >
            <DictbizSelect
              v-model="dialogModel.status"
              :set="dialogModel.status = dialogModel.status ?? undefined"
              code="order_status"
              placeholder="请选择 订单状态"
              :readonly="isLocked || isReadonly"
            ></DictbizSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.usr_id == null)">
          <el-form-item
            label="用户"
            prop="usr_id"
          >
            <CustomSelect
              v-model="dialogModel.usr_id"
              :method="getListUsr"
              :find-by-values="findByIdsUsr"
              :options-map="((item: UsrModel) => {
                return {
                  label: item.lbl,
                  value: item.id,
                };
              })"
              placeholder="请选择 用户"
              :readonly="isLocked || isReadonly"
            ></CustomSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.card_id == null)">
          <el-form-item
            label="会员卡"
            prop="card_id"
          >
            <SelectInputCard
              v-model="dialogModel.card_id"
              placeholder="请选择 会员卡"
              :readonly="isLocked || isReadonly"
            ></SelectInputCard>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.price == null)">
          <el-form-item
            label="订单金额"
            prop="price"
          >
            <CustomInputNumber
              v-model="dialogModel.price"
              :max="99999999999.99"
              :precision="2"
              placeholder="请输入 订单金额"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.type == null)">
          <el-form-item
            label="订单类别"
            prop="type"
          >
            <DictbizSelect
              v-model="dialogModel.type"
              :set="dialogModel.type = dialogModel.type ?? undefined"
              code="order_type"
              placeholder="请选择 订单类别"
              :readonly="isLocked || isReadonly"
            ></DictbizSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.amt == null) && dialogAction !== 'add' && dialogAction !== 'copy' && dialogAction !== 'edit'">
          <el-form-item
            label="消费充值金额"
            prop="amt"
          >
            <CustomInputNumber
              v-model="dialogModel.amt"
              :max="99999999999.99"
              :precision="2"
              placeholder="请输入 消费充值金额"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.give_amt == null) && dialogAction !== 'add' && dialogAction !== 'copy' && dialogAction !== 'edit'">
          <el-form-item
            label="消费赠送金额"
            prop="give_amt"
          >
            <CustomInputNumber
              v-model="dialogModel.give_amt"
              :max="99999999999.99"
              :precision="2"
              placeholder="请输入 消费赠送金额"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.integral == null) && dialogAction !== 'add' && dialogAction !== 'copy' && dialogAction !== 'edit'">
          <el-form-item
            label="获得积分"
            prop="integral"
          >
            <CustomInputNumber
              v-model="dialogModel.integral"
              placeholder="请输入 获得积分"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.balance == null) && dialogAction !== 'add' && dialogAction !== 'copy' && dialogAction !== 'edit'">
          <el-form-item
            label="消费后充值余额"
            prop="balance"
          >
            <CustomInputNumber
              v-model="dialogModel.balance"
              :max="99999999999.99"
              :precision="2"
              placeholder="请输入 消费后充值余额"
              :readonly="isLocked || isReadonly"
            ></CustomInputNumber>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.give_balance == null) && dialogAction !== 'add' && dialogAction !== 'copy' && dialogAction !== 'edit'">
          <el-form-item
            label="消费后赠送余额"
            prop="give_balance"
          >
            <CustomInputNumber
              v-model="dialogModel.give_balance"
              :max="99999999999.99"
              :precision="2"
              placeholder="请输入 消费后赠送余额"
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
  createOrder,
  findOneOrder,
  updateByIdOrder,
  getDefaultInputOrder,
  getPagePathOrder,
  intoInputOrder,
} from "./Api.ts";

import {
  getListUsr,
} from "./Api.ts";

import {
  findByIdsUsr,
} from "@/views/base/usr/Api.ts";

import SelectInputCard from "@/views/wshop/card/SelectInput.vue";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: OrderId,
    },
  ],
}>();

const pagePath = getPagePathOrder();

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

let dialogModel: OrderInput = $ref({
} as OrderInput);

let order_model = $ref<OrderModel>();

let ids = $ref<OrderId[]>([ ]);
let is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<OrderId[]>([ ]);

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
    // 公司
    company: [
      {
        required: true,
        message: "请输入 公司",
      },
      {
        type: "string",
        max: 50,
        message: "公司 长度不能超过 50",
      },
    ],
    // 联系电话
    phone: [
      {
        required: true,
        message: "请输入 联系电话",
      },
      {
        type: "string",
        max: 20,
        message: "联系电话 长度不能超过 20",
      },
    ],
    // 订单状态
    status: [
      {
        required: true,
        message: "请选择 订单状态",
      },
    ],
    // 用户
    usr_id: [
      {
        required: true,
        message: "请选择 用户",
      },
    ],
    // 会员卡
    card_id: [
      {
        required: true,
        message: "请选择 会员卡",
      },
    ],
    // 订单金额
    price: [
      {
        required: true,
        message: "请输入 订单金额",
      },
    ],
    // 订单类别
    type: [
      {
        required: true,
        message: "请选择 订单类别",
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: OrderId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<OrderInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let findOneModel = findOneOrder;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    builtInModel?: OrderInput;
    showBuildIn?: MaybeRefOrGetter<boolean>;
    isReadonly?: MaybeRefOrGetter<boolean>;
    isLocked?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: OrderId[];
      is_deleted?: 0 | 1 | null;
    };
    findOne?: typeof findOneOrder;
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
    findOneModel = findOneOrder;
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
    ] = await Promise.all([
      getDefaultInputOrder(),
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
      defaultInput,
      data,
    ] = await Promise.all([
      getDefaultInputOrder(),
      findOneModel({
        id,
        is_deleted,
      }),
    ]);
    if (data) {
      dialogModel = {
        ...data,
        id: undefined,
        lbl: defaultInput.lbl,
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
    ] = await Promise.all([
      getDefaultInputOrder(),
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
    dialogModel = intoInputOrder({
      ...data,
    });
    dialogTitle = `${ oldDialogTitle } - ${ dialogModel.lbl }`;
  }
  order_model = data;
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
    dialogModel.status,
    dialogModel.usr_id,
    dialogModel.card_id,
    dialogModel.type,
  ],
  () => {
    if (!inited) {
      return;
    }
    if (!dialogModel.status) {
      dialogModel.status_lbl = "";
    }
    if (!dialogModel.usr_id) {
      dialogModel.usr_id_lbl = "";
    }
    if (!dialogModel.card_id) {
      dialogModel.card_id_lbl = "";
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
  let id: OrderId | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    Object.assign(dialogModel2, { is_deleted: undefined });
    id = await createOrder(dialogModel2);
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
    id = await updateByIdOrder(
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
