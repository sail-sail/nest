// #ifdef H5
import {
  wxoLoginByCode,
} from "./Api";

import type {
  Query,
} from "#/types";

import cfg from "./config";

export async function wxoGetAppid() {
  const host = cfg.domain;
  
  const res: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wxoGetAppid: Query["wxoGetAppid"];
  } = await query({
    query: /* GraphQL */ `
      query($host: String!) {
        wxoGetAppid(host: $host) {
          appid
          scope
        }
      }
    `,
    variables: {
      host,
    },
  });
  const data = res?.wxoGetAppid;
  if (!data || !data.appid) {
    await uni.showModal({
      content: "请联系管理员配置 appid",
      showCancel: false,
    });
    throw new Error("请联系管理员配置 appid");
  }
  return {
    appid: data.appid,
    scope: data.scope,
    agentid: undefined,
  };
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
      const model = await wxoLoginByCode(code);
      if (!model || !model.authorization) {
        return;
      }
      usrStore.setAuthorization(model.authorization);
      usrStore.setUsrId(model.usr_id);
      usrStore.setUsername(model.username);
      usrStore.setTenantId(model.tenant_id);
      usrStore.setLang(model.lang);
      const url = new URL(location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      location.replace(url.toString());
      return;
    }
  }
}
// #endif
