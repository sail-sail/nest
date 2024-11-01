import {
  ElLoading,
} from "element-plus";

import cfg from "@/utils/config"

import {
  getOptionsByLbl,
} from "./Api";

let elLoading: ReturnType<typeof ElLoading.service>|undefined;

export default defineStore("index", function() {
  
  let notLoading = ref(false);
  
  let loading = ref(0);
  
  let mutationLoading = ref(0);
  
  let version = ref(localStorage.getItem("__version"));
  
  /** 国际化版本号 */
  let i18n_version = ref(localStorage.getItem("__i18n_version"));
  
  /**
   * 获取 i18n 版本
   */
  async function initI18nVersion() {
    if (import.meta.env.VITE_SERVER_I18N_ENABLE === "false") {
      return;
    }
    const options = await getOptionsByLbl({
      lbl: "i18n_version",
    });
    const lbl = options.find((item) => item.ky === "i18n_version")?.val;
    i18n_version.value = lbl ?? version.value;
    if (i18n_version.value !== null) {
      localStorage.setItem("__i18n_version", i18n_version.value);
    }
  }
  
  function addLoading() {
    if (notLoading.value) {
      return;
    }
    loading.value++;
    if (!elLoading) {
      elLoading = ElLoading.service({ fullscreen: true, background: "rgba(0,0,0,0)" });
    }
  }
  
  async function minusLoading() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    loading.value -= 1;
    if (loading.value < 0) {
      loading.value = 0;
    }
    if (loading.value === 0 && elLoading) {
      elLoading.close();
      elLoading = undefined;
    }
  }
  
  function reset() {
    if (elLoading) {
      elLoading.close();
      elLoading = undefined;
    }
    const menuStore = useMenuStore(cfg.pinia);
    const usrStore = useUsrStore(cfg.pinia);
    const tabsStore = useTabsStore(cfg.pinia);
    menuStore.reset();
    usrStore.reset();
    tabsStore.reset();
    loading.value = 0;
  }
  
  function logout() {
    reset();
  }
  
  return {
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
  };
  
}, { persist: false });
