<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  @keydown.page-down="onPageDown"
  @keydown.page-up="onPageUp"
  @keydown.insert="onInsert"
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
        @keyup.enter="onSave"
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
        
        <template v-if="(showBuildIn || builtInModel?.domain_ids == null)">
          <el-form-item
            :label="n('所属域名')"
            prop="domain_ids"
          >
            <CustomSelect
              :set="dialogModel.domain_ids = dialogModel.domain_ids ?? [ ]"
              v-model="dialogModel.domain_ids"
              :method="getDomainList"
              :options-map="((item: DomainModel) => {
                return {
                  label: item.lbl,
                  value: item.id,
                };
              })"
              :placeholder="`${ ns('请选择') } ${ n('所属域名') }`"
              multiple
              :readonly="isLocked || isReadonly"
            ></CustomSelect>
          </el-form-item>
        </template>
        
        <template v-if="(showBuildIn || builtInModel?.order_by == null)">
          <el-form-item
            :label="n('排序')"
            prop="order_by"
          >
            <CustomInputNumber
              v-model="dialogModel.order_by"
              :placeholder="`${ ns('请输入') } ${ n('排序') }`"
              :readonly="isLocked || isReadonly"
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
              :autosize="{ minRows: 3, maxRows: 5 }"
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
  findById,
  findLastOrderBy,
  updateById,
} from "./Api";

import type {
  TenantInput,
  DomainModel,
} from "#/types";

import {
  getDomainList,
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
} = useI18n("/base/tenant");

const permitStore = usePermitStore();

const permit = permitStore.getPermit("/base/tenant");

let inited = $ref(false);

type DialogAction = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<DialogAction>("add");
let dialogTitle = $ref("");
let oldDialogTitle = "";
let dialogNotice = $ref("");

let dialogModel = $ref({
  domain_ids: [ ],
  menu_ids: [ ],
} as TenantInput);

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
    // 名称
    lbl: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("名称") }`,
      },
      {
        type: "string",
        max: 45,
        message: `${ n("名称") } ${ await nsAsync("长度不能超过 {0}", 45) }`,
      },
    ],
    // 所属域名
    domain_ids: [
      {
        required: true,
        message: `${ await nsAsync("请选择") } ${ n("所属域名") }`,
      },
    ],
    // 锁定
    is_locked: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("锁定") }`,
      },
    ],
    // 启用
    is_enabled: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("启用") }`,
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: string[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 内置变量 */
let builtInModel = $ref<TenantInput>();

/** 是否显示内置变量 */
let showBuildIn = $ref(false);

/** 是否只读模式 */
let isReadonly = $ref(false);

/** 是否锁定 */
let isLocked = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

/** 增加时的默认值 */
async function getDefaultInput() {
  const defaultInput: TenantInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    builtInModel?: TenantInput;
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
      isLocked = dialogModel.is_locked == 1 ?? toValue(arg?.isLocked) ?? isLocked;
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
      order_by,
    ] = await Promise.all([
      getDefaultInput(),
      findLastOrderBy(),
    ]);
    dialogModel = {
      ...defaultModel,
      ...builtInModel,
      ...model,
      order_by: order_by + 1,
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
        is_locked: undefined,
        is_locked_lbl: undefined,
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

watch(
  () => isLocked,
  async () => {
    if (isLocked) {
      dialogNotice = await nsAsync("(已锁定)");
    } else {
      dialogNotice = "";
    }
  },
);

/** 键盘按 Insert */
function onInsert() {
  isReadonly = !isReadonly;
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
    dialogTitle = `${ oldDialogTitle } - ${ dialogModel.lbl }`;
  }
}

/** 键盘按 PageUp */
async function onPageUp() {
  await prevId();
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
async function onPageDown() {
  await nextId();
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
  let id: string | undefined = undefined;
  let msg = "";
  if (dialogAction === "add" || dialogAction === "copy") {
    const dialogModel2 = {
      ...dialogModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    id = await create(dialogModel2);
    dialogModel.id = id;
    msg = await nsAsync("添加成功");
  } else if (dialogAction === "edit" || dialogAction === "view") {
    if (!dialogModel.id) {
      return;
    }
    const dialogModel2 = {
      ...dialogModel,
        ...builtInModel,
    };
    if (!showBuildIn) {
      Object.assign(dialogModel2, builtInModel);
    }
    id = await updateById(
      dialogModel.id,
      dialogModel2,
    );
    msg = await nsAsync("修改成功");
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
    "名称",
    "所属域名",
    "菜单权限",
    "锁定",
    "启用",
    "排序",
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
