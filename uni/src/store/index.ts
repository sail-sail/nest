import {
  UserAgent,
} from "@/utils/UserAgent";

import { defineStore } from "pinia";

export default defineStore("index", function() {
  
  let loading = $ref(0);
  
  function addLoading() {
    loading++;
  }
  
  function minusLoading() {
    loading--;
    if(loading < 0) {
      loading = 0;
    }
  }
  
  let systemInfo: UniApp.GetSystemInfoResult | undefined;
  
  function setSystemInfo(sys: UniApp.GetSystemInfoResult) {
    systemInfo = sys;
  }
  
  let userAgent: UserAgent | undefined;
  
  function getUserAgent() {
    if (userAgent) {
      return userAgent;
    }
    if (!systemInfo) {
      throw new Error("systemInfo is not set!");
    }
    userAgent = new UserAgent((systemInfo as any).ua);
    return userAgent;
  }
  
  let launchOptions = $ref<App.LaunchShowOption>();
  
  let uid = $ref("");
  
  function setUid(uid0: typeof uid) {
    uid = uid0;
  }
  
  return $$({
    loading,
    launchOptions,
    uid,
    systemInfo: systemInfo as UniApp.GetSystemInfoResult,
    addLoading,
    minusLoading,
    setUid,
    setSystemInfo,
    getUserAgent,
  });
});
