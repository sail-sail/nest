import { defineStore } from "pinia";
import { ElLoading } from "element-plus";

import useMenuStore from "./menu";
import useTabsStore from "./tabs";
import useUsrStore from "./usr";

let elLoading: ReturnType<typeof ElLoading.service>;

export default defineStore("index", function() {
  
  let loading = $ref(0);
  
  let version = $ref<string>(localStorage.getItem("__version"));
  
  function addLoading() {
    loading++;
    if (elLoading) {
      elLoading.close();
      elLoading = undefined;
    }
    elLoading = ElLoading.service({ fullscreen: true, background: "rgba(0,0,0,0)" });
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
    loading,
    version,
    addLoading,
    minusLoading,
    reset,
    logout,
  });
}, { persist: false });
