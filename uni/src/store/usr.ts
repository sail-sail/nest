import { defineStore } from "pinia";

const access_token0: string = uni.getStorageSync("access_token") || "";

export default defineStore("usr", function() {
  
  let access_token = $ref(access_token0);
  
  async function setAccessToken(access_token1: typeof access_token) {
    if (access_token !== access_token1) {
      access_token = access_token1;
      await uni.setStorage({
        key: "access_token",
        data: access_token1,
      });
    }
  }
  
  let showAuth = $ref(false);
  
  function setShowAuth(showAuth1: typeof showAuth) {
    showAuth = showAuth1;
  }
  
  return $$({
    access_token,
    showAuth,
    setAccessToken,
    setShowAuth,
  });
});
