import {
  UserAgent,
} from "@/utils/UserAgent";
  
const loading = ref(0);
  
let windowInfo: UniApp.GetWindowInfoResult | undefined;
  
let userAgent: UserAgent | undefined;
  
let launchOptions: App.LaunchShowOption | undefined;
  
let uid = "";

export default function() {
  
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
  
  function getWindowInfo() {
    if (!windowInfo) {
      windowInfo = uni.getWindowInfo();
    }
    return windowInfo;
  }
  
  function getUserAgent(): UserAgent {
    if (userAgent) {
      return userAgent;
    }
    let ua = "";
    // #ifndef MP
    ua = navigator.userAgent;
    // #endif
    userAgent = new UserAgent(ua);
    return userAgent;
  }
  
  function setLaunchOptions(options?: App.LaunchShowOption) {
    launchOptions = options;
  }
  
  function getLaunchOptions() {
    return launchOptions!;
  }
  
  function getUid() {
    uid = uni.getStorageSync("_uid");
    if (uid) {
      return uid;
    }
    uid = uniqueID();
    uni.setStorageSync("_uid", uid);
    return uid;
  }
  
  return {
    getUid,
    getLoading,
    addLoading,
    minusLoading,
    setLaunchOptions,
    getLaunchOptions,
    getWindowInfo,
    getUserAgent,
  };
};
