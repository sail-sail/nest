import {
  UserAgent,
} from "@/utils/UserAgent";

export default defineStore("index", function() {
  
  const loading = ref(0);
  
  function addLoading() {
    loading.value++;
  }
  
  function minusLoading() {
    loading.value--;
    if(loading.value < 0) {
      loading.value = 0;
    }
  }
  
  function getLoading() {
    return loading.value;
  }
  
  let systemInfo: UniApp.GetSystemInfoResult | undefined;
  
  function setSystemInfo(sys: UniApp.GetSystemInfoResult) {
    systemInfo = sys;
  }
  
  function getSystemInfo() {
    if (!systemInfo) {
      throw new Error("systemInfo is not set!");
    }
    return systemInfo;
  }
  
  let userAgent: UserAgent | undefined;
  
  function getUserAgent(): UserAgent {
    if (userAgent) {
      return userAgent;
    }
    if (!systemInfo) {
      throw new Error("systemInfo is not set!");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userAgent = new UserAgent((systemInfo as any).ua);
    return userAgent;
  }
  
  const launchOptions = ref<App.LaunchShowOption>();
  
  function setLaunchOptions(options?: App.LaunchShowOption) {
    launchOptions.value = options;
  }
  
  function getLaunchOptions() {
    return launchOptions.value!;
  }
  
  const uid = ref("");
  
  function setUid(uid0: string) {
    uid.value = uid0;
  }
  
  function getUid() {
    return uid.value;
  }
  
  return {
    getUid,
    getLoading,
    addLoading,
    minusLoading,
    setUid,
    setLaunchOptions,
    getLaunchOptions,
    getSystemInfo,
    setSystemInfo,
    getUserAgent,
  };
});
