import type {
  GetLoginInfo,
} from "@/typings/types";
  
const authorization = useStorage<string>("store.usr.authorization", "");

const isLogining = ref(false);

const tenant_id = useStorage<TenantId>("store.usr.tenant_id", "" as unknown as TenantId);
const username = useStorage<string>("store.usr.username", "");
const usr_id = useStorage<UsrId>("store.usr.usr_id", "" as unknown as UsrId);

const loginInfo = ref<GetLoginInfo | undefined>(undefined);

if (localStorage.getItem("store.usr.loginInfo")) {
  loginInfo.value = JSON.parse(localStorage.getItem("store.usr.loginInfo") || "");
}

const lang = useStorage<string>("store.usr.lang", "");

const onLoginCallbacks: (() => void | PromiseLike<void>)[] = [ ];

const tabsStore = useTabsStore();

const permitsStore = usePermitStore();

export default function() {
  
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
    get authorization() {
      return authorization.value;
    },
    set authorization(authorization0: string) {
      authorization.value = authorization0;
    },
    get isLogining() {
      return isLogining.value;
    },
    set isLogining(isLogining0: boolean) {
      isLogining.value = isLogining0;
    },
    get loginInfo() {
      return loginInfo.value;
    },
    set loginInfo(loginInfo0: GetLoginInfo | undefined) {
      loginInfo.value = loginInfo0;
      if (!loginInfo0) {
        localStorage.removeItem("store.usr.loginInfo");
      } else {
        localStorage.setItem("store.usr.loginInfo", JSON.stringify(loginInfo0));
      }
    },
    get username() {
      return username.value;
    },
    set username(username0: string) {
      username.value = username0;
    },
    get tenant_id() {
      return tenant_id.value!;
    },
    set tenant_id(tenant_id0: TenantId) {
      tenant_id.value = tenant_id0;
    },
    get usr_id() {
      return usr_id.value!;
    },
    set usr_id(usr_id0: UsrId) {
      usr_id.value = usr_id0;
    },
    get lang() {
      return lang.value;
    },
    set lang(lang0: string) {
      lang.value = lang0;
    },
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
  
}
