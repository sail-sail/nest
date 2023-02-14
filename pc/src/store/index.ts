import {
  ElLoading,
} from "element-plus";

let elLoading: ReturnType<typeof ElLoading.service>|undefined;

export default defineStore("index", function() {
  
  let notLoading = $ref(false);
  
  let loading = $ref(0);
  
  let version: string|null = $ref(localStorage.getItem("__version"));
  
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
    version,
    addLoading,
    minusLoading,
    reset,
    logout,
  });
  
}, { persist: false });
