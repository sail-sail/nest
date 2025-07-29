import {
  ElLoading,
} from "element-plus";

import cfg from "@/utils/config"

import {
  getOptionsByLbl,
} from "./Api";

let elLoading: ReturnType<typeof ElLoading.service>|undefined;

const notLoading = ref(false);

const loading = ref(0);

const mutationLoading = ref(0);

const version = ref(localStorage.getItem("__version") || "0.0.0");

/** 国际化版本号 */
const i18n_version = ref<string | undefined | null>(localStorage.getItem("__i18n_version"));

export default function() {
  
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
    const menuStore = useMenuStore();
    const usrStore = useUsrStore();
    const tabsStore = useTabsStore();
    menuStore.reset();
    usrStore.reset();
    tabsStore.reset();
    loading.value = 0;
  }
  
  function logout() {
    reset();
  }
  
  return {
    get notLoading() {
      return notLoading.value;
    },
    set notLoading(value: boolean) {
      notLoading.value = value;
    },
    get loading() {
      return loading.value;
    },
    set loading(value: number) {
      loading.value = value;
    },
    get mutationLoading() {
      return mutationLoading.value;
    },
    set mutationLoading(value: number) {
      mutationLoading.value = value;
    },
    get version() {
      return version.value;
    },
    set version(value: string) {
      version.value = value;
      localStorage.setItem("__version", value);
    },
    get i18n_version() {
      return i18n_version.value;
    },
    set i18n_version(value: string | undefined | null) {
      i18n_version.value = value;
      if (value == null) {
        localStorage.removeItem("__i18n_version");
      } else {
        localStorage.setItem("__i18n_version", value);
      }
    },
    initI18nVersion,
    addLoading,
    minusLoading,
    reset,
    logout,
  };
  
};
