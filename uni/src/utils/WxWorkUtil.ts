// #ifdef H5
import * as ww from "@wecom/jssdk"
import cfg from "./config";

import {
  wxwLoginByCode,
  wxwGetConfigSignature,
  wxwGetAgentConfigSignature,
} from "./Api";

import type {
  GetLoginInfo,
} from "#/types.ts";

let domain = "";
let appid = "";
let agentid = "";
let scope = "";

export async function wxwGetAppid(): Promise<{
  appid: string;
  agentid: string;
  scope: string;
}> {
  if (appid && agentid && domain === cfg.domain) {
    return {
      appid,
      agentid,
      scope,
    };
  }
  
  const host = cfg.domain;
  
  const res: {
    wxwGetAppid: {
      appid: string,
      agentid: string,
      scope: string,
    },
  } = await query({
    query: /* GraphQL */ `
      query($host: String!) {
        wxwGetAppid(host: $host) {
          appid
          agentid
          scope
        }
      }
    `,
    variables: {
      host,
    },
  });
  const data = res?.wxwGetAppid;
  if (!data || !data.appid || !data.agentid) {
    const err_msg = "请联系管理员配置企业微信 appid 和 agentid";
    await uni.showModal({
      content: err_msg,
      showCancel: false,
    });
    throw new Error(err_msg);
  }
  domain = host;
  appid = data.appid;
  agentid = data.agentid;
  scope = data.scope;
  return data;
}

export async function initWxWorkCfg() {
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
  const userAgent = indexStore.getUserAgent();
  if (userAgent.isWxwork || userAgent.isWechat) {
    const href = location.href;
    const url = new URL(href);
    const code = url.searchParams.get("code");
    if (code) {
      const login_model = await wxwLoginByCode(code);
      if (!login_model || !login_model.authorization) {
        return;
      }
      usrStore.setAuthorization(login_model.authorization);
      usrStore.setUsrId(login_model.usr_id);
      usrStore.setUsername(login_model.username);
      usrStore.setTenantId(login_model.tenant_id);
      usrStore.setLang(login_model.lang);
      usrStore.setLoginInfo(login_model as GetLoginInfo);
      const url = new URL(location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      location.replace(url.toString());
      return;
    }
    const {
      appid,
      agentid,
      scope,
    } = await wxwGetAppid();
    ww.register({
      corpId: appid,
      agentId: agentid,
      jsApiList: [
        "checkJsApi",
        "scanQRCode",
        "getLocation",
      ],
      getConfigSignature: async (url) => {
        return await wxwGetConfigSignature(
          appid,
          agentid,
          url,
          {
            notLoading: true,
          },
        );
      },
      getAgentConfigSignature: async (url) => {
        return await wxwGetAgentConfigSignature(
          appid,
          agentid,
          url,
          {
            notLoading: true,
          },
        );
      },
    });
  }
}
// #endif
