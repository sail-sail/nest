import { defineStore } from "pinia";

export default defineStore("usr", function() {
  
  let access_token = $ref("");
  
  function setAccess_token(access_token0: typeof access_token) {
    access_token = access_token0;
  }
  
  let lang = $ref("");
  
  function setLang(lang0: typeof lang) {
    lang = lang0;
  }
  
  function clear() {
    access_token = "",
    lang = "";
  }
  
  function reset() {
    access_token = "",
    lang = "";
  }
  
  return $$({
    access_token,
    lang,
    setAccess_token,
    setLang,
    clear,
    reset,
  });
}, { persist: true });
