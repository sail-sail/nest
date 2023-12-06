// #ifdef H5
import {
  wxoLoginByCode,
} from "./Api";

import cfg from "./config";

import useIndexStore from "@/store/index";
import useUsrStore from "@/store/usr"; 

export async function wxoGetAppid() {
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
      content: "请联系管理员配置 appid",
      showCancel: false,
    });
    return;
  }
  return data;
}
 
export async function initWxoCfg() {
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
  const userAgent = indexStore.getUserAgent();
  if (userAgent.isWechat) {
    const wxoAppid = await wxoGetAppid();
    if (!wxoAppid) {
      return;
    }
    const appid = wxoAppid.appid;
    cfg.appid = appid;
    const href = location.href;
    const url = new URL(href);
    const code = url.searchParams.get("code");
    if (code) {
      const loginModel = await wxoLoginByCode(code);
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
