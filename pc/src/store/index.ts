import {
  ElLoading,
} from "element-plus";

import {
  getOptionsByLbl,
} from "./Api";

let elLoading: ReturnType<typeof ElLoading.service>|undefined;

export default defineStore("index", function() {
  
  let notLoading = $ref(false);
  
  let loading = $ref(0);
  
  let mutationLoading = $ref(0);
  
  let version: string | null = $ref(localStorage.getItem("__version"));
  
  /** 国际化版本号 */
  let i18n_version: string | null = $ref(localStorage.getItem("__i18n_version"));
  
  /**
   * 获取 i18n 版本
   */
  async function initI18nVersion() {
    const options = await getOptionsByLbl({
      lbl: "国际化版本号",
    });
    const lbl = options.find((item) => item.ky === "i18n_version")?.val;
    i18n_version = lbl ?? version;
    if (i18n_version !== null) {
      localStorage.setItem("__i18n_version", i18n_version);
    }
  }
  
  function addLoading() {
    if (notLoading) {
      return;
    }
    loading++;
    if (!elLoading) {
      elLoading = ElLoading.service({ fullscreen: true, background: "rgba(0,0,0,0)" });
    }
  }
  
  function minusLoading() {
    loading -= 1;
    if (loading < 0) {
      loading = 0;
    }
    if (loading === 0 && elLoading) {
      elLoading.close();
      elLoading = undefined;
    }
  }
  
  function reset() {
    if (elLoading) {
      elLoading.close();
      elLoading = undefined;
    }
    const menuStore = useMenuStore();
    const usrStore = useUsrStore();
    const tabsStore = useTabsStore();
    menuStore.reset();
    usrStore.reset();
    tabsStore.reset();
    loading = 0;
  }
  
  function logout() {
    reset();
  }
  
  return $$({
    notLoading,
    loading,
    mutationLoading,
    version,
    i18n_version,
    initI18nVersion,
    addLoading,
    minusLoading,
    reset,
    logout,
  });
  
}, { persist: false });
