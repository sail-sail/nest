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
    @click="onClearCache"
  >
    {{ ns("清空缓存") }}
  </div>
  <div class="login_div">
    <div
      style="margin-top: 14px;margin-left: 20px;font-size: 16px;color: white;"
    >
      {{ ns(app_title) }}
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
      
      <el-form-item prop="username">
        <el-input
          v-model="model.username"
          class="from_input"
          :placeholder="`${ ns('请输入') } ${ n('用户名') }`"
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
          :placeholder="`${ ns('请输入') } ${ n('密码') }`"
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
        style="width: 100%;margin-top: 20px;opacity: .7;"
        :loading="!usrStore.isLogining"
        @click="onLogin"
      >
        <span
          v-if="usrStore.isLogining"
        >
          {{ ns("登 录") }}
        </span>
        <span
          v-else
        >
          {{ ns("正在登录") }}...
        </span>
      </el-button>
      
    </el-form>
  </div>
</div>
</template>

<script lang="ts" setup>
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
  clearCache,
} from "./Api";

import type {
  LoginModel,
  MutationLoginArgs,
} from "#/types";

let i18n = $ref(useI18n("/base/usr"));

let ns = i18n.ns;
let n = i18n.n;

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
});

const app_title = import.meta.env.VITE_APP_TITLE;

const loginRef = $ref<InstanceType<typeof HTMLDivElement>>();

const formRef = $ref<InstanceType<typeof ElForm>>();

let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(() => {
  form_rules = {
    tenant_id: [
      { required: true, message: `${ ns("请选择") } ${ n("租户") }` },
    ],
    username: [
      { required: true, message: `${ ns("请输入") } ${ n("用户名") }` },
    ],
    password: [
      { required: true, message: `${ ns("请输入") } ${ n("密码") }` },
    ],
  };
});

const oldLoginModelKey = "oldLoginModelPc";

let tenants = $ref<{
  id: TenantId;
  lbl: string;
  lang: string;
}[]>([ ]);

try {
  tenants = JSON.parse(localStorage.getItem("login/tenants") || "[]");
} catch (err) {
  tenants = [ ];
}

const oldLoginModelStr = localStorage.getItem(oldLoginModelKey);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

if (!model.tenant_id && tenants.length > 0) {
  let tenant_id = tenants[0].id;
  for (const item of tenants) {
    if (item.lang === lang) {
      tenant_id = item.id;
      break;
    }
  }
  model.tenant_id = tenant_id;
}

watch(
  () => model.tenant_id,
  async () => {
    localStorage.setItem(
      oldLoginModelKey,
      JSON.stringify({
        username: model.username,
        tenant_id: model.tenant_id,
        org_id: model.org_id,
      }),
    );
    const old_lang = usrStore.lang;
    usrStore.lang = tenants.find(item => item.id === model.tenant_id)?.lang || "zh-CN";
    if (old_lang !== usrStore.lang) {
      await nextTick();
      await initI18nEfc();
      window.history.go(0);
    }
  },
);

// watch(
//   () => usrStore.lang,
//   async () => {
//     await nextTick();
//     await initI18nEfc();
//     window.history.go(0);
//   },
// );

/**
 * 登录
 */
async function onLogin() {
  if (!usrStore.isLogining) {
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
  usrStore.isLogining = false;
  let loginModel: LoginModel | undefined;
  try {
    loginModel = await login(model);
  } catch (err) {
    usrStore.isLogining = true;
    return;
  }
  if (!loginModel?.authorization) {
    usrStore.isLogining = true;
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
  const old_tenant_id = usrStore.tenant_id;
  const old_username = usrStore.username;
  if (old_username !== model.username) {
    tabsStore.closeOtherTabs();
    if (tabsStore.actTab) {
      tabsStore.closeCurrentTab(tabsStore.actTab);
    }
  }
  usrStore.authorization = loginModel.authorization;
  usrStore.usr_id = loginModel.usr_id;
  usrStore.username = loginModel.username;
  usrStore.tenant_id = loginModel.tenant_id;
  usrStore.lang = loginModel.lang;
  tabsStore.clearKeepAliveNames();
  await Promise.all([
    indexStore.initI18nVersion(),
  ]);
  if (old_username !== model.username || old_tenant_id !== model.tenant_id) {
    tabsStore.tabs = [ ];
    location.href = "/";
  } else {
    window.history.go(0);
  }
}

/**
 * 获取租户列表
 */
async function getLoginTenantsEfc() {
  tenants = await getLoginTenants({ domain: window.location.host });
  if (!model.tenant_id && tenants.length > 0) {
    let tenant_id = tenants[0].id;
    for (const item of tenants) {
      if (item.lang === lang) {
        tenant_id = item.id;
        break;
      }
    }
    model.tenant_id = tenant_id;
  }
  localStorage.setItem("login/tenants", JSON.stringify(tenants));
}

async function initI18nEfc() {
  i18n = useI18n("/base/usr");
  ns = i18n.ns;
  n = i18n.n;
  await Promise.all([
    i18n.initSysI18ns([
      app_title,
      "清空缓存",
      "请选择",
      "请输入",
      "登 录",
      "正在登录",
    ]),
    i18n.initI18ns([
      "租户",
      "用户名",
      "密码",
    ]),
  ]);
}

async function onClearCache() {
  indexStore.i18n_version = null;
  localStorage.removeItem("__i18n_version");
  localStorage.removeItem("i18nLblsLang");
  await clearCache();
  ElMessage.success({
    message: "清空缓存成功",
    appendTo: loginRef,
  });
}

async function initFrame() {
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
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg clip-path='url(%26quot%3b%23SvgjsClipPath1041%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='%2332325d'%3e%3c/rect%3e%3ccircle r='35.605' cx='185.1' cy='286.35' fill='url(%26quot%3b%23SvgjsLinearGradient1042%26quot%3b)'%3e%3c/circle%3e%3ccircle r='17.8' cx='57.44' cy='151.68' fill='%2343468b'%3e%3c/circle%3e%3ccircle r='27.595' cx='843.22' cy='195.61' fill='url(%26quot%3b%23SvgjsLinearGradient1043%26quot%3b)'%3e%3c/circle%3e%3ccircle r='55.4' cx='79.95' cy='304.45' fill='url(%26quot%3b%23SvgjsLinearGradient1044%26quot%3b)'%3e%3c/circle%3e%3ccircle r='17.2' cx='419.65' cy='331.62' fill='url(%26quot%3b%23SvgjsLinearGradient1045%26quot%3b)'%3e%3c/circle%3e%3ccircle r='33.66' cx='1110.51' cy='176.8' fill='url(%26quot%3b%23SvgjsLinearGradient1046%26quot%3b)'%3e%3c/circle%3e%3ccircle r='24.325' cx='51.8' cy='349.83' fill='url(%26quot%3b%23SvgjsLinearGradient1047%26quot%3b)'%3e%3c/circle%3e%3ccircle r='43.22' cx='693.82' cy='50.84' fill='%2343468b'%3e%3c/circle%3e%3c/g%3e%3cdefs%3e%3cclipPath id='SvgjsClipPath1041'%3e%3crect width='1440' height='560' x='0' y='0'%3e%3c/rect%3e%3c/clipPath%3e%3clinearGradient x1='113.89' y1='286.35' x2='256.31' y2='286.35' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1042'%3e%3cstop stop-color='%23ab3c51' offset='0.1'%3e%3c/stop%3e%3cstop stop-color='%234f4484' offset='0.9'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient x1='788.03' y1='195.61' x2='898.41' y2='195.61' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1043'%3e%3cstop stop-color='%2384b6e0' offset='0.1'%3e%3c/stop%3e%3cstop stop-color='%23464a8f' offset='0.9'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient x1='-30.849999999999994' y1='304.45' x2='190.75' y2='304.45' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1044'%3e%3cstop stop-color='%23f29b7c' offset='0.1'%3e%3c/stop%3e%3cstop stop-color='%237e6286' offset='0.9'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient x1='385.25' y1='331.62' x2='454.05' y2='331.62' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1045'%3e%3cstop stop-color='%23e298de' offset='0.1'%3e%3c/stop%3e%3cstop stop-color='%23484687' offset='0.9'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient x1='1043.19' y1='176.8' x2='1177.83' y2='176.8' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1046'%3e%3cstop stop-color='%23ab3c51' offset='0.1'%3e%3c/stop%3e%3cstop stop-color='%234f4484' offset='0.9'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient x1='3.1499999999999986' y1='349.83' x2='100.44999999999999' y2='349.83' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1047'%3e%3cstop stop-color='%23f29b7c' offset='0.1'%3e%3c/stop%3e%3cstop stop-color='%237e6286' offset='0.9'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e");
}
.login_div {
  min-width: 500px;
  min-height: 320px;
  box-shadow: 0 0 2px lightblue;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
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
