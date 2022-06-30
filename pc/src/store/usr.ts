import { defineStore } from "pinia";

export default defineStore("usr", function() {
  
  let authorization = $ref("");
  
  function setAuthorization(authorization0: typeof authorization) {
    authorization = authorization0;
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
  
  return $$({
    authorization,
    lang,
    setAuthorization,
    setLang,
    clear,
    reset,
  });
  
}, { persist: true });
