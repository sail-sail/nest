<template>
<tm-app
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
>
  <view
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    
    <tm-form
      ref="formRef"
      v-model="model"
      @submit="onLogin"
      un-flex="~ [1_0_0] col"
      un-overflow-auto
      :label-width="120"
      :transprent="true"
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
    
  </view>
  <AppLoading></AppLoading>
</tm-app>
</template>

<script setup lang="ts">
import useUsrStore from "@/store/usr";

import cfg from "@/utils/config";

import {
  login,
  getLoginTenants, // 根据 当前网址的域名+端口 获取 租户列表
} from "./Api";

import { lang } from "@/locales/index";

const usrStore = useUsrStore();

let formRef = $ref<InstanceType<typeof TmForm>>();

let model = $ref({
  username: "admin",
  password: "a",
  tenant_id: "",
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
  usrStore.authorization = loginModel.authorization;
  usrStore.username = model.username;
  usrStore.tenant_id = model.tenant_id;
  usrStore.lang = model.lang;
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
