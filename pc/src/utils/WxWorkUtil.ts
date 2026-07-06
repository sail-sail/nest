import { ElMessage } from "element-plus";

import useIndexStore from "../store/index.ts";
import useTabsStore from "../store/tabs.ts";
import useUsrStore from "../store/usr.ts";

import {
  wxwGetAppid,
  wxwLoginByCode,
} from "@/layout/Api";

import {
  createWWLoginPanel as createWWLoginPanelFromWxWorkSdk,
  WWLoginRedirectType,
  WWLoginType,
} from "@wecom/jssdk";

const wxworkOAuthStateKey = "pc.wxwork.oauth2_state";

export const authExpiredEventName = "pc-auth-expired";

export function notifyAuthExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(authExpiredEventName));
  }
}

export function detectWxWorkSsoEnv(userAgent = globalThis.navigator?.userAgent || "") {
  const ua = userAgent.toLowerCase();
  return ua.includes("wxwork") || ua.includes("micromessenger") || ua.includes("wechat");
}

export function saveWxWorkOAuthState(state: string) {
  localStorage.setItem(wxworkOAuthStateKey, state);
}

export function getWxWorkOAuthState() {
  return localStorage.getItem(wxworkOAuthStateKey);
}

export function clearWxWorkOAuthState() {
  localStorage.removeItem(wxworkOAuthStateKey);
}

export function buildWxWorkOAuthUrl(
  appid: string,
  agentid: string,
  scope: string,
  redirectUri: string,
  state: string,
) {
  const url = new URL("https://open.weixin.qq.com/connect/oauth2/authorize");
  url.searchParams.set("appid", appid);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope || "snsapi_base");
  url.searchParams.set("state", state);
  if (agentid) {
    url.searchParams.set("agentid", agentid);
  }
  url.hash = "wechat_redirect";
  return url.toString();
}

export async function initWxWorkSso() {
  const usrStore = useUsrStore();

  if (usrStore.authorization || !detectWxWorkSsoEnv(window.navigator.userAgent)) {
    return false;
  }
  
  const indexStore = useIndexStore();
  const tabsStore = useTabsStore();

  const href = new URL(window.location.href);
  const code = href.searchParams.get("code");
  const state = href.searchParams.get("state");
  if (code) {
    const savedState = getWxWorkOAuthState();
    if (savedState && state && state !== savedState) {
      clearWxWorkOAuthState();
      return false;
    }
    clearWxWorkOAuthState();
    try {
      const loginModel = await wxwLoginByCode(code, {
        notLoading: true,
        showErrMsg: false,
      });
      if (!loginModel?.authorization) {
        return false;
      }
      usrStore.authorization = loginModel.authorization;
      usrStore.username = loginModel.username;
      usrStore.tenant_id = loginModel.tenant_id;
      usrStore.lang = loginModel.lang ?? "";
      tabsStore.clearKeepAliveNames();
      await indexStore.initI18nVersion();
      const nextUrl = `${ window.location.origin }${ window.location.pathname }${ window.location.hash }`;
      window.history.replaceState({}, "", nextUrl);
      window.location.reload();
      return true;
    } catch (err) {
      ElMessage.error({
        message: err?.toString() || "企业微信登录失败",
      });
      return false;
    }
  }

  try {
    const { appid, agentid, scope } = await wxwGetAppid(window.location.host, {
      notLoading: true,
      showErrMsg: false,
    });
    const redirectUri = `${ window.location.origin }${ window.location.pathname }`;
    const oauthState = `${ Date.now() }-${ Math.random().toString(36).slice(2, 10) }`;
    saveWxWorkOAuthState(oauthState);
    const oauthUrl = buildWxWorkOAuthUrl(appid, agentid, scope || "snsapi_base", redirectUri, oauthState);
    window.location.replace(oauthUrl);
    return true;
  } catch (err) {
    ElMessage.error({
      message: err?.toString() || "企业微信登录配置异常",
    });
    return false;
  }
}

export async function createWWLoginPanel(
  el: Element | string,
) {
  let host = window.location.host;
  let redirect_uri = `${ window.location.origin }${ window.location.pathname }`;
  if (process.env.NODE_ENV === "development") {
    host = "pms.ejsexcel.com";
    redirect_uri = `https://${ host }${ window.location.pathname }`;
  }
  const {
    appid,
    agentid,
    scope,
  } = await wxwGetAppid(
    host,
    {
      notLoading: true,
      showErrMsg: false,
    },
  );
  const wwLogin = createWWLoginPanelFromWxWorkSdk({
    el,
    params: {
      login_type: WWLoginType.corpApp,
      appid,
      agentid,
      redirect_uri,
      state: `pc`,
      redirect_type: WWLoginRedirectType.callback,
    },
    onCheckWeComLogin({ isWeComLogin }) {
      console.log(isWeComLogin)
    },
    async onLoginSuccess({ code }) {
      if (!code) {
        ElMessage.error({
          message: "企业微信登录失败",
        });
        return;
      }
      try {
        const loginModel = await wxwLoginByCode(code, {
          notLoading: true,
          showErrMsg: false,
        });
        if (!loginModel?.authorization) {
          return false;
        }
        const usrStore = useUsrStore();
        const tabsStore = useTabsStore();
        const indexStore = useIndexStore();
        usrStore.authorization = loginModel.authorization;
        usrStore.username = loginModel.username;
        usrStore.tenant_id = loginModel.tenant_id;
        usrStore.lang = loginModel.lang ?? "";
        tabsStore.clearKeepAliveNames();
        await indexStore.initI18nVersion();
        const nextUrl = `${ window.location.origin }${ window.location.pathname }${ window.location.hash }`;
        window.history.replaceState({}, "", nextUrl);
        window.location.reload();
        return true;
      } catch (err) {
        ElMessage.error({
          message: err?.toString() || "企业微信登录失败",
        });
        return false;
      }
    },
    onLoginFail(err) {
      ElMessage.error({
        message: err?.toString() || "企业微信登录失败",
      });
    },
  });
  return wwLogin;
}
