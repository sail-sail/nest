import {
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
} from "vue";

import { defineStore } from "pinia";

export default defineStore("usr", function() {
  
  let authorization = $ref("");
  
  let dept_id = $ref<string>();
  
  function refreshToken(authorization0: typeof authorization) {
    authorization = authorization0;
  }
  
  async function login(authorization0: typeof authorization) {
    authorization = authorization0;
    await Promise.all([
      onLoginCallbacks.filter((callback) => callback()).map((callback) => callback()),
    ]);
  }
  
  function logout() {
    authorization = "";
  }
  
  let lang = $ref("");
  
  function setLang(lang0: typeof lang) {
    lang = lang0;
  }
  
  function clear() {
    authorization = "",
    lang = "";
  }
  
  function reset() {
    authorization = "",
    lang = "";
  }
  
  const onLoginCallbacks: (() => void | PromiseLike<void>)[] = [ ];
  
  function onLogin(callback: () => void | PromiseLike<void>) {
    onBeforeUnmount(function() {
      const idx = onLoginCallbacks.indexOf(callback);
      if (idx !== -1) {
        onLoginCallbacks.splice(idx, 1);
      }
    });
    onMounted(function() {
      if (!onLoginCallbacks.includes(callback)) {
        onLoginCallbacks.push(callback);
      }
    });
  }
  
  return $$({
    authorization,
    dept_id,
    lang,
    refreshToken,
    login,
    logout,
    onLogin,
    setLang,
    clear,
    reset,
  });
  
}, { persist: true });
