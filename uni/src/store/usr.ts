import type {
  GetLoginInfo,
} from "@/typings/types";

export default defineStore("usr", function() {
  
  const authorization = ref(uni.getStorageSync("authorization") || "");
  const usr_id = ref<UsrId>(uni.getStorageSync("usr_id"));
  const tenant_id = ref<TenantId>(uni.getStorageSync("tenant_id"));
  const username = ref<string>(uni.getStorageSync("username"));
  const loginInfo = ref<GetLoginInfo>(uni.getStorageSync("loginInfo"));
  
  function setAuthorization(authorization0: string) {
    if (authorization.value !== authorization0) {
      authorization.value = authorization0;
      uni.setStorageSync("authorization", authorization0);
    }
  }
  
  function getAuthorization() {
    return authorization.value;
  }
  
  function setUsrId(usr_id0: UsrId) {
    usr_id.value = usr_id0;
    uni.setStorageSync("usr_id", usr_id0);
  }
  
  function getUsrId() {
    return usr_id.value;
  }
  
  const showAuth = ref(false);
  
  function setShowAuth(showAuth1: boolean) {
    showAuth.value = showAuth1;
  }
  
  function getShowAuth() {
    return showAuth.value;
  }
  
  const lang = ref("");
  
  function setLang(lang0: string) {
    lang.value = lang0;
  }
  
  function getLang() {
    return lang.value;
  }
  
  function setLoginInfo(loginInfo0: GetLoginInfo) {
    loginInfo.value = loginInfo0;
    uni.setStorageSync("loginInfo", loginInfo0);
  }
  
  function getLoginInfo() {
    return loginInfo.value;
  }
  
  function setUsername(username0: string) {
    username.value = username0;
    uni.setStorageSync("username", username0);
  }
  
  function getUsername() {
    return username.value;
  }
  
  function setTenantId(tenant_id0: TenantId) {
    tenant_id.value = tenant_id0;
    uni.setStorageSync("tenant_id", tenant_id0);
  }
  
  function getTenantId() {
    return tenant_id.value;
  }
  
  return {
    getAuthorization,
    setAuthorization,
    getUsrId,
    setUsrId,
    getShowAuth,
    setShowAuth,
    getLang,
    setLang,
    getLoginInfo,
    setLoginInfo,
    getUsername,
    setUsername,
    getTenantId,
    setTenantId,
  };
});
