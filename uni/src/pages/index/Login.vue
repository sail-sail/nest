<template>
<view
  un-flex="~ [1_0_0] col"
  un-overflow-hidden
  un-p="4"
  un-box-border
>
  <tm-form
    v-model="model"
    :label-width="120"
    :rules="form_rules"
    
    un-flex="~ [1_0_0] col"
    un-overflow="y-auto x-hidden"
    
    @submit="onLogin"
  >
    
    <tm-form-item
      label="租户"
      name="tenant_id"
    >
      <CustomSelect
        v-model="model.tenant_id"
        :method="getLoginTenantsEfc"
        @data="(e) => tenants = e"
        placeholder="请选择 租户"
        :multiple="false"
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
        v-model="model.username"
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
        v-model="model.password"
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
    
    <view
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
    ></view>
    
    <view
      un-m="x-2"
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

const usrStore = useUsrStore(cfg.pinia);

let tenants: GetLoginTenants[] = [ ];

const model = ref<LoginInput>({
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

async function onLogin(
  {
    isPass,
  }: TM.FORM_SUBMIT_RESULT,
) {
  if (!isPass) {
    return;
  }
  uni.setStorage({
    key: "oldLoginModel",
    data: model.value,
  });
  const loginModel = await login(model.value);
  if (!loginModel.authorization) {
    return;
  }
  usrStore.setAuthorization(loginModel.authorization);
  usrStore.setUsrId(loginModel.usr_id);
  usrStore.setUsername(loginModel.username);
  usrStore.setTenantId(loginModel.tenant_id);
  usrStore.setLang(loginModel.lang);
  await uni.reLaunch({
    url: redirect_uri,
  });
}

/**
 * 获取租户列表
 */
async function getLoginTenantsEfc() {
  const tenants = await getLoginTenants({ domain: cfg.domain });
  if (!model.value.tenant_id && tenants.length > 0) {
    model.value.tenant_id = tenants[0].id;
  } else if (model.value.tenant_id && !tenants.some((item) => item.id === model.value.tenant_id)) {
    model.value.tenant_id = tenants[0].id;
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
      model.value = res.data;
      if (!tenants.some((item) => item.id === model.value.tenant_id)) {
        model.value.tenant_id = tenants[0]?.id;
      }
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
