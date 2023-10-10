import {
  wxwLoginByCode,
} from "./Api";

import useIndexStore from "@/store/index";
import useUsrStore from "@/store/usr";

// #ifdef H5
import cfg from "./config";

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
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
  const userAgent = indexStore.getUserAgent();
  if (userAgent.isWxwork || userAgent.isWechat) {
    const wxwAppid = await wxwGetAppid();
    if (!wxwAppid) {
      return;
    }
    const appid = wxwAppid.appid;
    const agentid = wxwAppid.agentid;
    cfg.appid = appid;
    cfg.agentid = agentid;
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
// #endif
