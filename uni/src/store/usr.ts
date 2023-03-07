const authorization0: string = uni.getStorageSync("authorization") || "";

export default defineStore("usr", function() {
  
  let authorization = $ref(authorization0);
  
  async function setAccessToken(authorization1: typeof authorization) {
    if (authorization !== authorization1) {
      authorization = authorization1;
      await uni.setStorage({
        key: "authorization",
        data: authorization1,
      });
    }
  }
  
  let showAuth = $ref(false);
  
  function setShowAuth(showAuth1: typeof showAuth) {
    showAuth = showAuth1;
  }
  
  let lang = $ref("");
  
  function setLang(lang0: typeof lang) {
    lang = lang0;
  }
  
  return $$({
    authorization,
    showAuth,
    setAccessToken,
    setShowAuth,
    lang,
    setLang,
  });
});
