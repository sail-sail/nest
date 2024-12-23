import {
  UserAgent,
} from "@/utils/UserAgent";
  
const loading = ref(0);
  
let windowInfo: UniApp.GetWindowInfoResult | undefined;

let menuButtonBoundingClientRect: UniApp.GetMenuButtonBoundingClientRectRes | undefined;

let appBaseInfo: UniApp.GetAppBaseInfoResult | undefined;
  
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
  
  function getMenuButtonBoundingClientRect() {
    if (!menuButtonBoundingClientRect) {
      const windowInfo = getWindowInfo();
      menuButtonBoundingClientRect = uni.getMenuButtonBoundingClientRect?.() || {
        ...windowInfo.safeArea,
        height: 0,
        width: 0,
        bottom: windowInfo.safeArea.top,
        left: windowInfo.safeArea.right,
      };
    }
    return menuButtonBoundingClientRect;
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
  
  function getAppBaseInfo() {
    if (!appBaseInfo) {
      appBaseInfo = uni.getAppBaseInfo();
    }
    return appBaseInfo;
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
    getMenuButtonBoundingClientRect,
    getAppBaseInfo,
    getUserAgent,
  };
};
