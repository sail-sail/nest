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

let _safeTop = uni.getStorageSync<number | undefined>("indexStore._safeTop");
let _safeWidth = uni.getStorageSync<number | undefined>("indexStore._safeWidth");
let accountInfo: UniApp.AccountInfo | undefined;

/** 是否游客模式 */
const isGuest = ref(false);

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
      try {
        appBaseInfo = uni.getAppBaseInfo();
      } catch (e) { /* empty */ }
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
  
  /**
   * 小程序等顶部的安全距离
   */
  function getSafeTop() {
    if (_safeTop != null) {
      return _safeTop;
    }
    const menuButtonBoundingClientRect = getMenuButtonBoundingClientRect();
    let top = menuButtonBoundingClientRect.top;
    // #ifndef MP
    top = 10;
    // #endif
    _safeTop = top;
    return top;
  }
  
  /**
   * 小程序等顶部的安全宽度, 排除小程序右上角的胶囊按钮的宽度
   */
  function getSafeWidth() {
    if (_safeWidth != null) {
      return _safeWidth;
    }
    const windowInfo = getWindowInfo();
    const safeArea = windowInfo.safeArea;
    const menuButtonBoundingClientRect = getMenuButtonBoundingClientRect();
    const width = safeArea.width - menuButtonBoundingClientRect.right + menuButtonBoundingClientRect.width;
    _safeWidth = width;
    return width;
  }
  
  function getAccountInfo(): UniApp.AccountInfo | undefined {
    if (accountInfo) {
      return accountInfo;
    }
    accountInfo = uni.getAccountInfoSync?.();
    return accountInfo;
  }
  
  function setIsGuest(isGuestValue: boolean) {
    isGuest.value = isGuestValue;
  }
  
  function getIsGuest() {
    return isGuest.value;
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
    getSafeTop,
    getSafeWidth,
    getAccountInfo,
    setIsGuest,
    getIsGuest,
  };
};
