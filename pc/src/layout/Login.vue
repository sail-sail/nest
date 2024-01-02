<template>
<div
  ref="loginRef"
  class="wrap_login_div"
  un-z="10000"
>
  <div
    un-pos-absolute
    un-top="0"
    un-right="0"
    un-text="transparent"
    @click="clearCacheClk"
  >
    清空缓存
  </div>
  <div class="login_div">
    <div
      style="margin-top: 20px;margin-left: 20px;font-size: 14px;"
    >
      {{ i18n.ns('登录') }}
    </div>
    <el-form
      ref="formRef"
      :model="model"
      :rules="form_rules"
      :validate-on-rule-change="false"
      class="login_form"
      size="large"
      @keyup.enter="onLogin"
    >
      <el-form-item prop="tenant_id">
        <el-select
          v-model="model.tenant_id"
          class="from_input"
          style="width: 100%;"
          filterable
          default-first-option
        >
          <template #prefix>
            <el-icon>
              <ElIconUser />
            </el-icon>
          </template>
          <el-option
            v-for="item in tenants"
            :key="item.id"
            :label="item.lbl"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item prop="lang">
        <CustomSelect
          v-model="model.lang"
          :method="getLoginLangs"
          :placeholder="`${ i18n.ns('请选择') } ${ i18n.n('语言') }`"
          :pinyin-filterable="false"
          :options4-select-v2="[
            {
              label: '中文',
              value: 'zh-cn',
            },
            {
              label: 'English',
              value: 'en',
            },
          ]"
          :options-map="(item: LangModel) => {
            return {
              label: item.lbl,
              value: item.code,
            };
          }"
          un-w="full"
          class="from_input"
          @change="langChg"
        >
          <template #prefix>
            <div
              un-w="3.5"
              un-h="3.5"
              un-text-gray
              un-m="l-2"
              un-self-stretch
              un-flex
              un-place-content-center
            >
              <ElIconUser />
            </div>
          </template>
        </CustomSelect>
      </el-form-item>
      
      <el-form-item prop="username">
        <el-input
          v-model="model.username"
          class="from_input"
          :placeholder="`${ i18n.ns('请输入') } ${ i18n.n('用户名') }`"
          :input-style="inputStyle"
          clearable
          :prefix-icon="User"
        >
        </el-input>
      </el-form-item>
      
      <el-form-item prop="password">
        <el-input
          v-model="model.password" 
          class="from_input"
          size="large"
          :placeholder="`${ i18n.ns('请输入') } ${ i18n.n('密码') }`"
          type="password"
          :input-style="inputStyle"
          show-password
          clearable
          :prefix-icon="Lock"
        >
        </el-input>
      </el-form-item>
      
      <el-button
        size="large"
        type="primary"
        style="width: 100%;margin-top: 20px;"
        @click="onLogin"
        :disabled="!usrStore.isLogining"
      >
        <span
          v-if="!usrStore.authorization"
        >
          {{ i18n.ns("登录") }}
        </span>
        <span
          v-else
        >
          {{ i18n.ns("正在登录") }}...
        </span>
      </el-button>
      
    </el-form>
  </div>
</div>
</template>

<script lang="ts" setup>
import {
  useI18n,
} from "@/locales/i18n";

import {
  lang,
} from "@/locales/index";

import {
  User,
  Lock,
} from "@element-plus/icons-vue";

import {
  login,
  getLoginTenants, // 根据 当前网址的域名+端口 获取 租户列表
  getLoginLangs,
  clearCache,
} from "./Api";

import type {
  LangModel,
  MutationLoginArgs,
} from "#/types";

import type {
  TenantId,
} from "@/typings/ids";

let i18n = $ref(useI18n("/base/usr"));

const usrStore = useUsrStore();
const indexStore = useIndexStore();
const tabsStore = useTabsStore();

usrStore.isLogining = true;

const inputStyle = {
  backgroundColor: 'transparent',
  border: 0,
  borderBottom: '1px var(--el-text-color-regular) solid',
  borderRadius: 0,
};

let model = $ref<MutationLoginArgs["input"]>({
  username: "",
  password: "",
  tenant_id: "" as unknown as TenantId,
  org_id: undefined,
  lang,
});

let loginRef = $ref<InstanceType<typeof HTMLDivElement>>();

let formRef = $ref<InstanceType<typeof ElForm>>();

let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(() => {
  form_rules = {
    tenant_id: [
      { required: true, message: `${ i18n.ns("请选择") } ${ i18n.n("租户") }` },
    ],
    username: [
      { required: true, message: `${ i18n.ns("请输入") } ${ i18n.n("用户名") }` },
    ],
    password: [
      { required: true, message: `${ i18n.ns("请输入") } ${ i18n.n("密码") }` },
    ],
  };
});

/**
 * 语言切换
 */
async function langChg() {
  if (!model.lang) {
    return;
  }
  if (model.lang === usrStore.lang) {
    return;
  }
  usrStore.setLang(model.lang);
  await initI18nEfc();
}

let oldLoginModelKey = "oldLoginModelPc";

/**
 * 登录
 */
async function onLogin() {
  if (!formRef) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  const loginModel = await login(model);
  if (!loginModel.authorization) {
    return;
  }
  localStorage.setItem(
    oldLoginModelKey,
    JSON.stringify({
      username: model.username,
      tenant_id: model.tenant_id,
      org_id: model.org_id,
    }),
  );
  if (usrStore.username !== model.username) {
    tabsStore.closeOtherTabs();
  }
  usrStore.authorization = loginModel.authorization;
  usrStore.usr_id = loginModel.usr_id;
  usrStore.username = model.username;
  usrStore.tenant_id = model.tenant_id;
  usrStore.lang = model.lang;
  tabsStore.clearKeepAliveNames();
  await Promise.all([
    indexStore.initI18nVersion(),
  ]);
  window.history.go(0);
}

let tenants = $ref<{
  id: TenantId;
  lbl: string;
}[]>([ ]);

/**
 * 获取租户列表
 */
async function getLoginTenantsEfc() {
  tenants = await getLoginTenants({ domain: window.location.host });
  if (!model.tenant_id && tenants.length > 0) {
    model.tenant_id = tenants[0].id;
  }
}

async function initI18nEfc() {
  i18n = useI18n("/base/usr");
  await Promise.all([
    i18n.initSysI18ns([
      "请选择",
      "请输入",
    ]),
    i18n.initI18ns([
      "租户",
      "用户名",
      "密码",
    ]),
  ]);
}

async function clearCacheClk() {
  await clearCache();
  ElMessage.success({
    message: "清空缓存成功",
    appendTo: loginRef,
  });
}

async function initFrame() {
  const oldLoginModelStr = localStorage.getItem(oldLoginModelKey);
  let oldLoginModel: any = undefined;
  if (oldLoginModelStr) {
    try {
      oldLoginModel = JSON.parse(oldLoginModelStr);
    } catch (err) {
      localStorage.removeItem(oldLoginModelKey);
    }
  }
  if (oldLoginModel) {
    model = {
      ...model,
      ...oldLoginModel,
    };
  }
  await Promise.all([
    initI18nEfc(),
    getLoginTenantsEfc(),
  ]);
}

initFrame();
</script>

<style lang="scss" scoped>
.wrap_login_div {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  background-color: #072540;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login_div {
  background-color: #114f86;
  color: #FFF;
  width: 480px;
  min-height: 320px;
  box-shadow: 0 0 5px lightblue;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login_form {
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 20px;
}
.from_input {
  --el-input-bg-color: transparent;
  --el-fill-color-blank: transparent;
}
.from_input :deep(.el-input__inner),.from_input {
  color: #FFF;
  border: 0 !important;
}
.from_input.custom_select_div :deep(.el-select-v2__placeholder) {
  padding-left: 22px;
}
</style>
