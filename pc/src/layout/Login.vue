<template>
<div class="wrap_login_div">
  <div class="login_div">
    <div
      style="margin-top: 20px;margin-left: 20px;font-size: 14px;"
    >
      登录
    </div>
    <el-form
      ref="formRef"
      :model="model"
      :rules="form_rules"
      :validate-on-rule-change="false"
      class="login_form"
      size="large"
      @keyup.enter="loginClk"
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
          placeholder="请输入用户名"
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
          placeholder="请输入密码"
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
        @click="loginClk"
      >
        登录
      </el-button>
      
    </el-form>
  </div>
</div>
</template>

<script setup lang="ts">
import {
  User,
  Lock,
} from "@element-plus/icons-vue";

import useUsrStore from "@/store/usr";
import useIndexStore from "@/store/index";
import useTabsStore from "@/store/tabs";

import {
  login,
  getLoginTenants, // 根据 当前网址的域名+端口 获取 租户列表
} from "./Api";

import {
  type MutationLoginArgs,
} from "#/types";

const usrStore = useUsrStore();

const inputStyle = {
  backgroundColor: 'transparent',
  border: 0,
  borderBottom: '1px var(--el-text-color-regular) solid',
  borderRadius: 0,
};

let model = $ref<MutationLoginArgs>({
  username: "",
  password: "",
  tenant_id: "",
  dept_id: undefined,
});

let form_rules = $ref<Record<string, FormItemRule | FormItemRule[]>>({
  tenant_id: [
    { required: true, message: "请选择租户" },
  ],
  username: [
    { required: true, message: "请输入用户名" },
  ],
  password: [
    { required: true, message: "请输入密码" },
  ],
});

async function loginClk() {
  model.dept_id = usrStore.dept_id;
  const loginModel = await login(model);
  usrStore.dept_id = loginModel.dept_id ?? undefined;
  await usrStore.login(loginModel.authorization);
  // if (authorization) {
  //   await router.replace("/");
  //   await tabsStore.refreshTab();
  // }
}

let tenants = $ref<{
  id: string;
  lbl: string;
}[]>([ ]);

(async function() {
  tenants = await getLoginTenants({ host: window.location.host });
  if (tenants.length > 0) {
    model.tenant_id = tenants[0].id;
  }
})();
</script>

<style scoped>
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
  width: 380px;
  min-height: 320px;
  box-shadow: 0 0 5px lightblue;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login_form {
  margin: 20px;
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.from_input {
  --el-input-bg-color: transparent;
  --el-fill-color-blank: transparent;
}
.from_input :deep(.el-input__inner),.from_input {
  color: #FFF;
  border: 0 !important;
}
</style>
