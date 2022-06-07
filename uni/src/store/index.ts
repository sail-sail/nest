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
  
  let launchOptions = $ref<{[key: string]: any}>({ });
  
  function setLaunchOptions(options: typeof launchOptions) {
    launchOptions = options;
  }
  
  let uid = $ref("");
  
  function setUid(uid0: typeof uid) {
    uid = uid0;
  }
  
  return $$({
    loading,
    launchOptions,
    uid,
    addLoading,
    minusLoading,
    setLaunchOptions,
    setUid,
  });
});
