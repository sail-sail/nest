import type {
  GetLoginInfo,
} from "@/typings/types";

export default defineStore("usr", function() {
  
  let authorization = $ref("");
  
  let tenant_id = $ref<string>();
  let username = $ref<string>();
  let loginInfo = $ref<GetLoginInfo>();
  
  async function setAuthorization(authorization1: typeof authorization) {
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
    setAuthorization,
    setShowAuth,
    lang,
    loginInfo,
    username,
    tenant_id,
    setLang,
  });
}, {
  unistorage: {
    paths: [
      "authorization",
      "username",
      "tenant_id",
      "loginInfo",
      "lang",
    ],
  },
});
