import { defineStore } from "pinia";

export default defineStore("usr", function() {
  
  let authorization = $ref("");
  
  function refreshToken(authorization0: typeof authorization) {
    authorization = authorization0;
  }
  
  async function login(authorization0: typeof authorization) {
    authorization = authorization0;
    for (let i = 0; i < onLoginCallbacks.length; i++) {
      const onLoginCallback = onLoginCallbacks[i];
      await onLoginCallback();
    }
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
    onLoginCallbacks.push(callback);
  }
  
  return $$({
    authorization,
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
