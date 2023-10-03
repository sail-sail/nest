import {
  wxwLoginByCode,
} from "./Api";

import useIndexStore from "@/store/index";
import useUsrStore from "@/store/usr";

export async function initWxWorkCfg() {
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
  const userAgent = indexStore.getUserAgent();
  if (userAgent.isWxwork || userAgent.isWechat) {
    const href = location.href;
    const url = new URL(href);
    const code = url.searchParams.get("code");
    if (code) {
      const loginModel = await wxwLoginByCode(code);
      if (!loginModel || !loginModel.authorization) {
        return;
      }
      usrStore.authorization = loginModel.authorization;
      usrStore.username = loginModel.username;
      usrStore.tenant_id = loginModel.tenant_id;
      usrStore.lang = loginModel.lang;
      const url = new URL(location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      location.replace(url.toString());
      return;
    }
  }
}
