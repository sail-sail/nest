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
        
        un-grid="~ cols-[repeat(1,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
      >
        
        <el-form-item
          :label="n('租户名称')"
        >
          <CustomInput
            v-model="lblModel.tenant_lbl"
            readonly
            :is-readonly-border="false"
          ></CustomInput>
        </el-form-item>
        
        <el-form-item
          :label="n('用户名')"
        >
          <CustomInput
            v-model="lblModel.usr_username"
            readonly
            :is-readonly-border="false"
          ></CustomInput>
        </el-form-item>
        
        <el-form-item
          :label="n('新密码')"
          prop="pwd"
        >
          <CustomInput
            v-model="dialogModel.pwd"
            type="password"
            show-password
            :placeholder="`${ n('请输入') } ${ n('admin 的新密码') }`"
          ></CustomInput>
        </el-form-item>
        
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
        v-if="permit('pwd', '租户管理员密码')"
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ n('保存') }}</span>
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
            :disabled="!dialogModel.tenant_id || ids.indexOf(dialogModel.tenant_id) <= 0"
            @click="onPrevId"
          >
            <ElIconArrowLeft
              un-w="1em"
              un-h="1em"
            ></ElIconArrowLeft>
          </el-button>
          
          <div>
            {{ (dialogModel.tenant_id && ids.indexOf(dialogModel.tenant_id) || 0) + 1 }} / {{ ids.length }}
          </div>
          
          <el-button
            link
            :disabled="!dialogModel.tenant_id || ids.indexOf(dialogModel.tenant_id) >= ids.length - 1"
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
  SetTenantAdminPwdInput as SetTenantAdminPwdInput0,
} from '@/typings/types';

import {
  findOneTenant,
} from "./Api.ts";

import {
  setTenantAdminPwd,
} from "./Api2";

const emit = defineEmits<{
  nextId: [
    {
      dialogAction: DialogAction,
      id: TenantId,
    },
  ],
}>();

const pagePath = "/base/tenant";

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

type DialogAction = "pwd";
let dialogAction = $ref<DialogAction>("pwd");
let dialogTitle = $ref("");
let oldDialogTitle = "";
const dialogNotice = $ref("");

type SetTenantAdminPwdInput = Partial<SetTenantAdminPwdInput0>;

let dialogModel: SetTenantAdminPwdInput = $ref({
} as SetTenantAdminPwdInput);

const lblModel = $ref({
  tenant_lbl: "",
  usr_username: "admin",
});

let ids = $ref<TenantId[]>([ ]);
const is_deleted = $ref<0 | 1>(0);
let changedIds = $ref<TenantId[]>([ ]);

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
    // 新密码
    pwd: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("admin 的新密码") }`,
      },
      {
        type: "string",
        max: 45,
        message: `${ n("名称") } ${ await nsAsync("长度不能超过 {0}", 45) }`,
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedIds: TenantId[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    model?: {
      ids?: TenantId[];
    };
    action?: DialogAction;
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
  dialogAction = action || "pwd";
  ids = [ ];
  changedIds = [ ];
  dialogModel = {
  };
  if (dialogAction === "pwd") {
    if (!model || !model.ids) {
      return await dialogRes.dialogPrm;
    }
    ids = model.ids;
    if (ids && ids.length > 0) {
      dialogModel.tenant_id = ids[0];
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
  if (dialogAction === "pwd") {
    await onRefresh();
  }
  ElMessage({
    message: await nsAsync("表单重置完毕"),
    type: "success",
  });
}

/** 刷新 */
async function onRefresh() {
  const id = dialogModel.tenant_id;
  if (!id) {
    return;
  }
  const [
    data,
  ] = await Promise.all([
    await findOneTenant({
      id,
      is_deleted,
    }),
  ]);
  if (data) {
    lblModel.tenant_lbl = data.lbl;
    dialogModel = {
      tenant_id: data.id,
      pwd: "",
    };
    dialogTitle = `${ oldDialogTitle } - ${ data.lbl }`;
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
    ElMessage.warning(await nsAsync("已经是第一个 {0} 了", await nsAsync("租户")));
  }
}

/** 点击上一项 */
async function onPrevId() {
  await prevId();
  customDialogRef?.focus();
}

/** 上一项 */
async function prevId() {
  if (!dialogModel.tenant_id) {
    if (ids && ids.length > 0) {
      dialogModel.tenant_id = ids[0];
    }
  } else {
    const idx = ids.indexOf(dialogModel.tenant_id);
    if (idx > 0) {
      dialogModel.tenant_id = ids[idx - 1];
    } else {
      return false;
    }
  }
  await onRefresh();
  emit(
    "nextId",
    {
      dialogAction,
      id: dialogModel.tenant_id!,
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
  if (!dialogModel.tenant_id) {
    if (ids && ids.length > 0) {
      dialogModel.tenant_id = ids[0];
    } else {
      return false;
    }
  } else {
    const idx = ids.indexOf(dialogModel.tenant_id);
    if (idx >= 0 && idx < ids.length - 1) {
      dialogModel.tenant_id = ids[idx + 1];
    } else {
      return false;
    }
  }
  await onRefresh();
  emit(
    "nextId",
    {
      dialogAction,
      id: dialogModel.tenant_id!,
    },
  );
  return true;
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
  const tenant_id = dialogModel.tenant_id;
  if (!tenant_id) {
    return tenant_id;
  }
  await setTenantAdminPwd({
    tenant_id,
    pwd: dialogModel.pwd!,
  });
  if (!changedIds.includes(tenant_id)) {
    changedIds.push(tenant_id);
  }
  return tenant_id;
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
    "租户名称",
    "用户名",
    "新密码",
    "admin 的新密码",
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
