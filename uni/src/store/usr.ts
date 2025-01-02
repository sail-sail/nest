import type {
  GetLoginInfo,
} from "@/typings/types";
  
let authorization: string = uni.getStorageSync("authorization") || "";
let usr_id: UsrId = uni.getStorageSync("usr_id");
let tenant_id: TenantId = uni.getStorageSync("tenant_id");
let username: string = uni.getStorageSync("username");
let loginInfo: GetLoginInfo = uni.getStorageSync("loginInfo");
  
let showAuth = false;
  
let lang = "";

export default function() {
  
  function setAuthorization(authorization0: string) {
    if (authorization !== authorization0) {
      authorization = authorization0;
      uni.setStorageSync("authorization", authorization0);
    }
  }
  
  function getAuthorization() {
    return authorization;
  }
  
  function setUsrId(usr_id0: UsrId) {
    usr_id = usr_id0;
    uni.setStorageSync("usr_id", usr_id0);
  }
  
  function getUsrId() {
    return usr_id;
  }
  
  function setShowAuth(showAuth0: boolean) {
    showAuth = showAuth0;
  }
  
  function getShowAuth() {
    return showAuth;
  }
  
  function setLang(lang0: string) {
    lang = lang0;
  }
  
  function getLang() {
    return lang;
  }
  
  function setLoginInfo(loginInfo0: GetLoginInfo) {
    loginInfo = loginInfo0;
    uni.setStorageSync("loginInfo", loginInfo0);
  }
  
  function getLoginInfo() {
    return loginInfo;
  }
  
  function setUsername(username0: string) {
    username = username0;
    uni.setStorageSync("username", username0);
  }
  
  function getUsername() {
    return username;
  }
  
  function setTenantId(tenant_id0: TenantId) {
    tenant_id = tenant_id0;
    uni.setStorageSync("tenant_id", tenant_id0);
  }
  
  function getTenantId() {
    return tenant_id;
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
};
