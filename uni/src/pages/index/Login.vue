<template>
<view
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <tm-form
    v-model="login_input"
    :label-width="120"
    :rules="form_rules"
    
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
    
    @submit="onLogin"
  >
    
    <view
      un-flex="~ [1_0_0] col"
      un-overflow="y-auto x-hidden"
      un-p="2"
      un-box-border
    >
      
      <tm-form-item
        label="租户"
        name="tenant_id"
      >
        <CustomSelect
          v-model="login_input.tenant_id"
          :page-inited="inited"
          :method="getLoginTenantsEfc"
          placeholder="请选择 租户"
          :multiple="false"
          @data="(e) => tenants = e"
        >
          <template #left>
            <i
              un-i="iconfont-tenant"
            ></i>
          </template>
        </CustomSelect>
      </tm-form-item>
      
      <tm-form-item
        label="用户名"
        name="username"
      >
        <CustomInput
          v-model="login_input.username"
          :type="'text'"
          :show-clear="true"
          placeholder="请输入 用户名"
        >
          <template #left>
            <i
              un-i="iconfont-user"
            ></i>
          </template>
        </CustomInput>
      </tm-form-item>
      
      <tm-form-item
        label="密码"
        name="password"
      >
        <CustomInput
          v-model="login_input.password"
          :type="'password'"
          :show-clear="true"
          placeholder="请输入 密码"
        >
          <template #left>
            <i
              un-i="iconfont-password"
            ></i>
          </template>
        </CustomInput>
      </tm-form-item>
      
    </view>
    
    <view
      un-p="2"
      un-box-border
    >
      <tm-button
        form-type="submit"
        block
      >
        登录
      </tm-button>
    </view>
    
  </tm-form>
  
  <AppLoading></AppLoading>
</view>
</template>

<script setup lang="ts">
import cfg from "@/utils/config";

import {
  login,
  getLoginTenants, // 根据 当前网址的域名+端口 获取 租户列表
} from "./Api";

import type {
  GetLoginTenants,
  LoginInput,
} from "@/typings/types";

const usrStore = useUsrStore();

let inited = $ref(false);

// eslint-disable-next-line prefer-const
let tenants: GetLoginTenants[] = [ ];

const login_input = ref<LoginInput>({
  username: "admin",
  password: "a",
  tenant_id: "" as unknown as TenantId,
});

const form_rules: Record<string, TM.FORM_RULE[]> = {
  tenant_id: [
    {
      required: true,
      message: "请选择 租户",
    },
  ],
  username: [
    {
      required: true,
      message: "请输入 用户名",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入 密码",
    },
  ],
};

let redirect_uri = cfg.homePage;
let redirect_action = "reLaunch";

async function onLogin(
  formSubmitResult?: TM.FORM_SUBMIT_RESULT,
) {
  if (formSubmitResult?.isPass === false) {
    return;
  }
  uni.setStorage({
    key: "oldLoginModel",
    data: login_input.value,
  });
  const loginModel = await login(login_input.value);
  if (!loginModel.authorization) {
    return;
  }
  usrStore.setAuthorization(loginModel.authorization);
  usrStore.setUsrId(loginModel.usr_id);
  usrStore.setUsername(loginModel.username);
  usrStore.setTenantId(loginModel.tenant_id);
  if (redirect_action === "navigateBack") {
    await uni.navigateBack();
    return;
  }
  await uni.reLaunch({
    url: redirect_uri,
  });
}

/**
 * 获取租户列表
 */
async function getLoginTenantsEfc() {
  const tenants = await getLoginTenants({ domain: cfg.domain });
  if (!login_input.value.tenant_id && tenants.length > 0) {
    login_input.value.tenant_id = tenants[0].id;
  } else if (login_input.value.tenant_id && !tenants.some((item) => item.id === login_input.value.tenant_id)) {
    login_input.value.tenant_id = tenants[0].id;
  }
  return tenants;
}

async function setOldLoginModel() {
  try {
    const res = await uni.getStorage({
      key: "login.oldLoginModel",
    });
    if (res) {
      if (typeof res.data === "string") {
        try {
          res.data = JSON.parse(res.data);
        } catch (err) {
          console.error(err);
        }
      }
      login_input.value = res.data;
      if (!tenants.some((item) => item.id === login_input.value.tenant_id)) {
        login_input.value.tenant_id = tenants[0]?.id;
      }
    }
  } catch (err) { /* empty */ }
}

async function initFrame() {
  await setOldLoginModel();
  inited = true;
}

onLoad(async function(query) {
  if (query?.redirect_uri) {
    redirect_uri = decodeURIComponent(query.redirect_uri);
  }
  if (query?.redirect_action) {
    redirect_action = decodeURIComponent(query.redirect_action);
  }
  await initFrame();
});
</script>
