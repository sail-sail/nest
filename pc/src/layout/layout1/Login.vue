<template>
<div class="wrap_div">
  <div class="login_div">
    <div
      style="margin-top: 20px;margin-left: 20px;font-size: 14px;"
    >
      登录
    </div>
    <el-form
      :model="model"
      ref="formRef"
      :rules="form_rules"
      :validate-on-rule-change="false"
      @keyup.enter.native="loginClk"
      class="login_form"
    >
      <el-form-item prop="tenant_id">
        <el-select
          class="from_input"
          style="width: 100%;"
          v-model="model.tenant_id"
          filterable
          default-first-option
          size="large"
        >
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
          class="from_input"
          size="large"
          type="text"
          placeholder="请输入用户名"
          v-model="model.username"
          :inputStyle="inputStyle"
          autofocus
          clearable
          :prefix-icon="User"
        >
        </el-input>
      </el-form-item>
      
      <el-form-item prop="password">
        <el-input
          class="from_input"
          size="large"
          placeholder="请输入密码"
          type="password"
          v-model="model.password" 
          :inputStyle="inputStyle"
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
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  FormItemRule,
} from "element-plus";
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
import { useRoute, useRouter } from "vue-router";

const usrStore = useUsrStore();
const indexStore = useIndexStore();
const tabsStore = useTabsStore();

const route = useRoute();
const router = useRouter();

const inputStyle = {
  backgroundColor: 'transparent',
  border: 0,
  borderBottom: '1px gray solid',
  borderRadius: 0,
};

let model = $ref({
  username: "",
  password: "",
  tenant_id: "",
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
  const access_token = await login(model);
  usrStore.setAccess_token(access_token);
  // if (access_token) {
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
.wrap_div {
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
  color: #FFF;
}
.from_input :deep(.el-input__inner) {
  color: #FFF;
  background-color: transparent;
}
</style>
