// #ifdef H5
import cfg from "./config";

import {
  wxwLoginByCode,
} from "./Api";

export async function wxwGetAppid() {
  const host = cfg.domain;
  
  const res: {
    wxwGetAppid: {
      appid: string,
      agentid: string,
    },
  } = await query({
    query: /* GraphQL */ `
      query($host: String!) {
        wxwGetAppid(host: $host) {
          appid
          agentid
        }
      }
    `,
    variables: {
      host,
    },
  });
  const data = res?.wxwGetAppid;
  if (!data || !data.appid || !data.agentid) {
    await uni.showModal({
      content: "请联系管理员配置企业微信 appid 和 agentid",
      showCancel: false,
    });
    return;
  }
  return data;
}

export async function initWxWorkCfg() {
  const indexStore = useIndexStore(cfg.pinia);
  const usrStore = useUsrStore(cfg.pinia);
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
      usrStore.setAuthorization(loginModel.authorization);
      usrStore.setUsername(loginModel.username);
      usrStore.setTenantId(loginModel.tenant_id);
      usrStore.setLang(loginModel.lang);
      const url = new URL(location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      location.replace(url.toString());
      return;
    }
  }
}
// #endif
