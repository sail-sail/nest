<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <tm-form
    ref="formRef"
    v-model="model"
    :label-width="120"
    un-flex="~ [1_0_0] col"
    un-overflow-auto
  >
      
    <tm-form-item
      label="租户"
      field="tenant_id"
      :rules="{
        required: true,
        message: '请选择 租户',
      }"
      required
    >
      <CustomSelect
        v-model="model.tenant_id"
        :method="getLoginTenantsEfc"
        placeholder="请选择 租户"
        :multiple="false"
      >
        <template #left>
          <i
            un-i="iconfont-user"
            un-m="r-2"
          ></i>
        </template>
      </CustomSelect>
    </tm-form-item>
    
    <tm-form-item
      label="用户名"
      field="username"
      :rules="{
        required: true,
        message: '请输入 用户名',
      }"
      required
    >
      <CustomInput
        v-model="model.username"
        :type="'text'"
        :show-clear="true"
        placeholder="请输入 用户名"
      >
        <template #left>
          <i
            un-i="iconfont-user"
            un-m="r-2"
          ></i>
        </template>
      </CustomInput>
    </tm-form-item>
    
    <tm-form-item
      label="密码"
      field="password"
      :rules="{
        required: true,
        message: '请输入 密码',
      }"
      required
    >
      <CustomInput
        v-model="model.password"
        :type="'password'"
        :show-clear="true"
        placeholder="请输入 密码"
      >
        <template #left>
          <i
            un-i="iconfont-password"
            un-m="r-2"
          ></i>
        </template>
      </CustomInput>
    </tm-form-item>
      
  </tm-form>
  
  <view
    un-m="x-2"
  >
    <tm-button
      @click="onLogin"
      label="登录"
      block
    ></tm-button>
  </view>
  
  <AppLoading></AppLoading>
  <tm-message
    ref="msgRef"
    :lines="2"
  ></tm-message>
</tm-app>
</template>

<script setup lang="ts">
import cfg from "@/utils/config";

import {
  login,
  getLoginTenants, // 根据 当前网址的域名+端口 获取 租户列表
} from "./Api";

import type {
  LoginInput,
} from "@/typings/types";

import type {
  TenantId,
} from "@/typings/ids";

import {
  lang,
} from "@/locales/index";

const usrStore = useUsrStore(cfg.pinia);

let formRef = $ref<InstanceType<typeof CustomForm>>();

let model: LoginInput = $ref<LoginInput>({
  username: "admin",
  password: "a",
  tenant_id: "" as unknown as TenantId,
  lang,
});

let redirect_uri = cfg.homePage;

async function onLogin() {
  if (!formRef) {
    return;
  }
  
  const {
    isPass,
  } = formRef.validate();
  
  if (!isPass) {
    return;
  }
  
  uni.setStorage({
    key: "oldLoginModel",
    data: model,
  });
  const loginModel = await login(model);
  if (!loginModel.authorization) {
    return;
  }
  usrStore.setAuthorization(loginModel.authorization);
  usrStore.setUsername(model.username);
  usrStore.setTenantId(model.tenant_id);
  usrStore.setLang(model.lang);
  await uni.reLaunch({
    url: redirect_uri,
  });
}

/**
 * 获取租户列表
 */
async function getLoginTenantsEfc() {
  const tenants = await getLoginTenants({ domain: cfg.domain });
  if (!model.tenant_id && tenants.length > 0) {
    model.tenant_id = tenants[0].id;
  } else if (model.tenant_id && !tenants.some((item) => item.id === model.tenant_id)) {
    model.tenant_id = tenants[0].id;
  }
  return tenants;
}

async function setOldLoginModel() {
  try {
    let res = await uni.getStorage({
      key: "oldLoginModel",
    });
    if (res) {
      if (typeof res.data === "string") {
        try {
          res.data = JSON.parse(res.data);
        } catch (err) {
          console.error(err);
        }
      }
      model = res.data;
      model.lang = model.lang || lang;
    }
  } catch (err) {
  }
}

async function initFrame() {
  setOldLoginModel();
}

onLoad(async function(query) {
  if (query?.redirect_uri) {
    redirect_uri = query.redirect_uri;
  }
  await initFrame();
});
</script>
