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
    :style="{
      marginBottom: (safeAreaInsets?.bottom || 0) + 'px',
    }"
  >
    <tm-button
      @click="onLogin"
      label="绑定微信"
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
  bindWxUsr,
} from "./Api";

import {
  getLoginTenants, // 根据 当前网址的域名+端口 获取 租户列表
} from "../index/Api";

import type {
  LoginInput,
} from "@/typings/types";

// import {
//   lang,
// } from "@/locales/index";

const indexStore = useIndexStore(cfg.pinia);
const usrStore = useUsrStore(cfg.pinia);

const safeAreaInsets = ref(indexStore.getSystemInfo().safeAreaInsets);

const formRef = ref<InstanceType<typeof CustomForm>>();

const model = ref<LoginInput>({
  username: "admin",
  password: "a",
  tenant_id: "" as unknown as TenantId,
  // lang,
});

let redirect_uri = cfg.homePage;
let redirect_action = "reLaunch";

async function onLogin() {
  if (!formRef.value) {
    return;
  }
  
  const {
    isPass,
  } = formRef.value.validate();
  
  if (!isPass) {
    return;
  }
  
  uni.setStorage({
    key: "oldLoginModel",
    data: model.value,
  });
  const loginModel = await bindWxUsr(model.value);
  if (!loginModel.authorization) {
    return;
  }
  uni.showToast({
    title: "绑定成功",
    icon: "success",
  });
  usrStore.setAuthorization(loginModel.authorization);
  usrStore.setUsrId(loginModel.usr_id);
  usrStore.setUsername(model.value.username);
  usrStore.setTenantId(model.value.tenant_id);
  // usrStore.setLang(model.value.lang);
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
      // model.value.lang = model.value.lang || lang;
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
  if (query?.redirect_action) {
    redirect_action = query.redirect_action;
  }
  await initFrame();
});
</script>
