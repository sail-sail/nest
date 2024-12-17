<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
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
        
        un-grid="~ cols-[repeat(1,480px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
      >
        
        <el-form-item
          :label="n('名称')"
          prop="lbl"
        >
          <CustomInput
            v-model="loginInfo.lbl"
            :readonly="true"
          ></CustomInput>
        </el-form-item>
        
        <el-form-item
          :label="n('用户名')"
          prop="username"
        >
          <CustomInput
            v-model="loginInfo.username"
            :readonly="true"
          ></CustomInput>
        </el-form-item>
        
        <el-form-item
          :label="n('旧密码')"
          prop="oldPassword"
        >
          <CustomInput
            v-model="dialogModel.oldPassword"
            :placeholder="`${ ns('请输入') } ${ n('旧密码') }`"
            type="password"
          ></CustomInput>
        </el-form-item>
        
        <el-form-item
          :label="n('新密码')"
          prop="oldPassword"
        >
          <CustomInput
            v-model="dialogModel.password"
            :placeholder="`${ ns('请输入') } ${ n('新密码') }`"
            type="password"
          ></CustomInput>
        </el-form-item>
        
        <el-form-item
          :label="n('确认密码')"
          prop="confirmPassword"
        >
          <CustomInput
            v-model="dialogModel.confirmPassword"
            :placeholder="`${ ns('请输入') } ${ n('确认密码') }`"
            type="password"
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
        <span>{{ ns('关闭') }}</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ ns('确定') }}</span>
      </el-button>
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import type {
  ChangePasswordInput,
  GetLoginInfo,
} from "#/types";

import {
  getLoginInfo,
  changePassword,
} from "./Api";

const {
  n,
  ns,
  nAsync,
  nsAsync,
  initI18ns,
} = useI18n("/base/usr");

let inited = $ref(false);

type DialogAction = "edit";
let dialogAction = $ref<DialogAction>("edit");
let dialogTitle = $ref("修改密码");

let dialogModel = $ref({
} as ChangePasswordInput);

let loginInfo = $ref({
} as GetLoginInfo);

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
    // 旧密码
    oldPassword: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("旧密码") }`,
      },
    ],
    // 新密码
    password: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("新密码") }`,
      },
    ],
    // 确认密码
    confirmPassword: [
      {
        required: true,
        message: `${ await nsAsync("请输入") } ${ n("确认密码") }`,
      },
    ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    action: DialogAction;
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title: $$(dialogTitle),
    pointerPierce: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const action = arg?.action;
  dialogAction = action || "edit";
  dialogModel = {
    oldPassword: "",
    password: "",
    confirmPassword: "",
  };
  if (dialogAction === "edit") {
    await onRefresh();
  }
  inited = true;
  return await dialogRes.dialogPrm;
}

async function onSave() {
  if (!formRef) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  if (dialogAction === "edit") {
    const isSucc = await changePassword(dialogModel);
    if (isSucc) {
      ElMessage.success(await nAsync("修改密码成功"));
      onCloseResolve({
        type: "ok",
      });
    }
  }
}

/** 点击关闭按钮 */
function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

/** 刷新 */
async function onRefresh() {
  loginInfo = await getLoginInfo();
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    type: "cancel",
  });
}

watchEffect(() => {
  dialogTitle = n("修改密码");
});

/** 初始化ts中的国际化信息 */
async function onInitI18ns() {
  const codes: string[] = [
    "用户",
    "新密码",
    "旧密码",
    "确认密码",
    "修改密码",
  ];
  await Promise.all([
    initI18ns(codes),
  ]);
}

onInitI18ns();

defineExpose({
  showDialog,
  refresh: onRefresh,
});
</script>
