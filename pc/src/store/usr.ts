import type {
  GetLoginInfo,
} from "@/typings/types";

export default defineStore("usr", function() {
  
  const tabsStore = useTabsStore();
  
  const permitsStore = usePermitStore();
  
  const authorization = ref("");
  
  const isLogining = ref(false);
  
  const tenant_id = ref<TenantId>();
  const username = ref<string>();
  const usr_id = ref<UsrId>();
  
  const loginInfo = ref<GetLoginInfo>();
  
  function refreshToken(authorization0: string) {
    authorization.value = authorization0;
  }
  
  async function login(authorization0: string) {
    authorization.value = authorization0;
    tabsStore.clearKeepAliveNames();
    await Promise.all([
      onLoginCallbacks.filter((callback) => callback()).map((callback) => callback()),
    ]);
  }
  
  function logout() {
    authorization.value = "";
    permitsStore.permits = [ ];
  }
  
  const lang = ref("");
  
  function setLang(lang0: string) {
    lang.value = lang0;
  }
  
  function clear() {
    authorization.value = "";
    lang.value = "";
  }
  
  function reset() {
    authorization.value = "";
    lang.value = "";
  }
  
  const onLoginCallbacks: (() => void | PromiseLike<void>)[] = [ ];
  
  function onLogin(callback: () => void | PromiseLike<void>) {
    onDeactivated(function() {
      const idx = onLoginCallbacks.indexOf(callback);
      if (idx !== -1) {
        onLoginCallbacks.splice(idx, 1);
      }
    });
    onActivated(function() {
      if (!onLoginCallbacks.includes(callback)) {
        onLoginCallbacks.push(callback);
      }
    });
    if (!onLoginCallbacks.includes(callback)) {
      onLoginCallbacks.push(callback);
    }
  }
  
  function hasRole(role_code: string) {
    if (!loginInfo.value) {
      return false;
    }
    return loginInfo.value.role_codes.some((item) => item === role_code);
  }
  
  function isAdmin() {
    return username.value === "admin";
  }
  
  return {
    authorization,
    isLogining,
    loginInfo,
    username,
    tenant_id,
    usr_id,
    lang,
    refreshToken,
    login,
    logout,
    onLogin,
    hasRole,
    isAdmin,
    setLang,
    clear,
    reset,
  };
  
},
{
  persist: {
    pick: [
      "authorization",
      "username",
      "usr_id",
      "tenant_id",
      "loginInfo",
      "lang",
    ],
  },
});
