/* eslint-disable @typescript-eslint/no-explicit-any */
import cfg from "./config";

import {
  isEmpty,
  uniqueID,
} from "./StringUtil";

import type {
  LoginModel,
} from "@/typings/types";

export async function uploadFile(config: {
  url?: string;
  name?: string;
  filePath?: string;
  /**
   * 文件类型，image/video/audio，仅支付宝小程序，且必填。
   * - image: 图像
   * - video: 视频
   * - audio: 音频
   */
  fileType?: 'image' | 'video' | 'audio';
  header?: { [key: string]: any };
  notLoading?: boolean;
  showErrMsg?: boolean;
  reqType?: string;
  notLogin?: boolean;
  type?: "oss" | "tmpfile";
  db?: string;
  isPublic?: boolean;
}): Promise<string> {
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
  const err: any = undefined;
  let res: any = undefined;
  try {
    if (!config.notLoading) {
      indexStore.addLoading();
    }
    if (!config.name) {
      config.name = "file";
    }
    config = config || { };
    config.type = config.type || "oss";
    if (!config.url) {
      let url = "";
      if (config?.isPublic) {
        url += `${ cfg.url }/${ config.type }/uploadPublic`;
      } else {
        url += `${ cfg.url }/${ config.type }/upload`;
      }
      config.url = url;
    }
    if (config.db) {
      config.url += `?db=${ encodeURIComponent(config.db) }`;
    }
    const authorization = usrStore.getAuthorization();
    if (authorization) {
      config.header = config.header || { };
      config.header.authorization = authorization;
    }
    res = (await uni.uploadFile(config as any)) as any;
    if (res.data) {
      res.data = JSON.parse(res.data);
    }
  } catch (err2) {
    if (config.showErrMsg) {
      const errMsg = (err2 as Error).toString() || "";
      if (errMsg) {
        uni.showToast({
          title: errMsg,
          icon: "error",
          duration: 3000,
          mask: true,
          position: "center",
        });
      }
    }
    throw err2;
  } finally {
    if (!config.notLoading) {
      indexStore.minusLoading();
    }
  }
  const header = res.header || { };
  if (header["authorization"]) {
    usrStore.setAuthorization(header["authorization"]);
  }
  if (config.reqType === "graphql") {
    return res;
  }
  if (err && config.showErrMsg) {
    const errMsg = err.errMsg || err.toString() || "";
    if (errMsg) {
      uni.showToast({
        title: errMsg,
        icon: "error",
        duration: 3000,
        mask: true,
        position: "center",
      });
    }
    throw err;
  }
  const data = res.data;
  if (data && (data.key === "token_empty" || data.key === "refresh_token_expired")) {
    usrStore.setAuthorization("");
    if (!config.notLogin) {
      if (await uniLogin()) {
        config.notLogin = true;
        return await uploadFile(config);
      } else {
        throw "refresh_token_expired";
      }
    }
  }
  if (data && data.code !== 0) {
    if (data.msg && (!config || config.showErrMsg !== false)) {
      uni.showToast({
        title: data.msg,
        icon: "none",
        duration: 3000,
        mask: true,
        position: "center",
      });
    }
    throw data;
  }
  return data.data;
}

export async function downloadFile(
  model: {
    id: string;
    filename?: string;
    remove?: "0"|"1";
    inline?: "0"|"1";
  },
  type?: "oss" | "tmpfile",
  config?: {
    id?: string;
    url?: string;
    header?: { [key: string]: any };
    notLoading?: boolean;
    showErrMsg?: boolean;
  },
) {
  if (!type) {
    type = "tmpfile";
  }
  let res: {
    tempFilePath: string;
    statusCode: number;
  };
  try {
    let paramStr = "";
    if (model.id) {
      paramStr = `${ paramStr }&id=${ encodeURIComponent(model.id) }`;
    }
    if (model.filename) {
      paramStr = `${ paramStr }&filename=${ encodeURIComponent(model.filename) }`;
    }
    if (model.inline != null) {
      paramStr = `${ paramStr }&inline=${ encodeURIComponent(model.inline) }`;
    }
    if (model.remove != null) {
      paramStr = `${ paramStr }&inline=${ encodeURIComponent(model.remove) }`;
    }
    const usrStore = useUsrStore();
    const authorization = usrStore.getAuthorization();
    if (authorization) {
      paramStr = `${ paramStr }&authorization=${ encodeURIComponent(authorization) }`;
    }
    if (paramStr.startsWith("&")) {
      paramStr = paramStr.substring(1);
    }
    let url = `${ cfg.url }/${ type }/download/${ model.filename || "" }`;
    if (paramStr) {
      url += "?" + paramStr;
    }
    config = config || { };
    config.url = url;
    res = await uni.downloadFile(config as any) as any;
  } catch (err2) {
    if (config?.showErrMsg) {
      const errMsg = (err2 as Error).toString() || "";
      if (errMsg) {
        uni.showToast({
          title: errMsg,
          icon: "error",
          duration: 3000,
          mask: true,
          position: "center",
        });
      }
    }
    throw err2;
  }
  return res;
}

export function getAttUrl(id: string, action?: string) {
  action = action || "minio/download";
  let url = `${ action }?id=${ encodeURIComponent(id) }`;
  url = `${ cfg.url }/${ url }`;
  return url;
}

/**
 * 获得下载文件的url
 * @export
 * @param {({
 *     id: string;
 *     filename?: string;
 *     inline?: "0"|"1";
 *   })} model
 * @return {string}
 */
export function getDownloadUrl(
  model: {
    id: string;
    filename?: string;
    remove?: "0"|"1";
    inline?: "0"|"1";
  },
  type?: "oss" | "tmpfile",
): string {
  if (!type) {
    type = "tmpfile";
  }
  const usrStore = useUsrStore();
  let paramStr = "";
  if (model.id) {
    paramStr = `${ paramStr }&id=${ encodeURIComponent(model.id) }`;
  }
  if (model.filename) {
    paramStr = `${ paramStr }&filename=${ encodeURIComponent(model.filename) }`;
  }
  if (model.inline != null) {
    paramStr = `${ paramStr }&inline=${ encodeURIComponent(model.inline) }`;
  }
  if (model.remove != null) {
    paramStr = `${ paramStr }&inline=${ encodeURIComponent(model.remove) }`;
  }
  const authorization = usrStore.getAuthorization();
  if (authorization) {
    paramStr = `${ paramStr }&authorization=${ encodeURIComponent(authorization) }`;
  }
  if (paramStr.startsWith("&")) {
    paramStr = paramStr.substring(1);
  }
  let url = `${ cfg.url }/${ type }/download/${ model.filename || "" }`;
  if (paramStr) {
    url += "?" + paramStr;
  }
  return url;
}

/**
 * 获得压缩后图片的url
 **/
export function getImgUrl(
  model: {
    id: string;
    format?: "webp" | "png" | "jpeg" | "jpg";
    width?: number;
    height?: number;
    quality?: number;
    filename?: string;
    inline?: "0"|"1";
    notAuthorization?: boolean;
  } | string,
): string {
  if (typeof model === "string") {
    model = {
      id: model,
      format: "webp",
    };
  }
  if (!model.id) {
    return "";
  }
  const usrStore = useUsrStore();
  let params = `id=${ encodeURIComponent(model.id) }`;
  if (model.filename) {
    params += `&filename=${ encodeURIComponent(model.filename) }`;
  }
  if (model.inline != null) {
    params += `&inline=${ encodeURIComponent(model.inline) }`;
  }
  if (model.format) {
    params += `&f=${ encodeURIComponent(model.format) }`;
  }
  if (!model.width) {
    model.width = 750;
  }
  if (model.width) {
    params += `&w=${ encodeURIComponent(model.width.toString()) }`;
  }
  if (model.height) {
    params += `&h=${ encodeURIComponent(model.height.toString()) }`;
  }
  if (model.quality) {
    params += `&q=${ encodeURIComponent(model.quality.toString()) }`;
  }
  if (model.notAuthorization !== true) {
    const authorization = usrStore.getAuthorization();
    if (authorization) {
      params += `&authorization=${ encodeURIComponent(authorization) }`;
    }
  }
  return `${ cfg.url }/oss/img?${ params }`;
}

export async function request<T>(
  config: {
    url?: string;
    reqType?: string;
    notLoading?: boolean;
    showErrMsg?: boolean;
    header?: { [key: string]: any };
    notLogin?: boolean;
    method?: string;
    data?: any;
  },
): Promise<T> {
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
  let err: Error | undefined;
  let res: any;
  try {
    if (config.reqType !== "graphql") {
      if (isEmpty(config.url)) {
        throw new Error("config.url is empty");
      }
      config.url = `${ cfg.url }/${ config.url }`;
    }
    if (!config.notLoading) {
      indexStore.addLoading();
    }
    const authorization = usrStore.getAuthorization();
    if (authorization) {
      config.header = config.header || { };
      config.header.authorization = authorization;
    }
    res = await (uni as any).request(config as any) as any;
  } catch(errTmp) {
    err = (errTmp as Error);
  } finally {
    if (!config.notLoading) {
      indexStore.minusLoading();
    }
  }
  const header = res?.header;
  if (header && header["authorization"]) {
    usrStore.setAuthorization(header["authorization"]);
  }
  if (err && (!config || config.showErrMsg !== false)) {
    const errMsg = (err as any).errMsg || err.toString() || "";
    if (errMsg) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        duration: 3000,
        mask: true,
        position: "center",
      });
    }
    throw err;
  }
  if (config.reqType === "graphql") {
    return res;
  }
  const data = res.data;
  if (data && (data.key === "token_empty" || data.key === "refresh_token_expired")) {
    usrStore.setAuthorization("");
    if (!config.notLogin) {
      if (await uniLogin()) {
        config.notLogin = true;
        return await request(config);
      } else {
        throw "refresh_token_expired";
      }
    }
  }
  if (data && data.code !== 0) {
    if (data.msg && (!config || config.showErrMsg !== false)) {
      uni.showToast({
        title: data.msg,
        icon: "none",
        duration: 3000,
        mask: true,
        position: "center",
      });
    }
    throw data;
  }
  return data.data as T;
}

export function getAppid() {
  // const appbaseInfo = uni.getAppBaseInfo();
  // let appid = (appbaseInfo as any).host?.appId;
  // return appid;
  return cfg.appid;
}

let code2SessionPromise: Promise<LoginModel | undefined> | undefined = undefined;

async function code2Session(
  model: {
    code: string;
    lang: string;
  },
) {
  if (code2SessionPromise) {
    return code2SessionPromise;
  }
  code2SessionPromise = (async function() {
  const appid = getAppid();
  const loginModel: LoginModel | undefined = await request({
    url: "wx_usr/code2Session",
    method: "POST",
    data: {
      appid,
      ...model,
    },
    showErrMsg: false,
    notLogin: true,
    notLoading: true,
  });
    
  return loginModel;
  })();
  return await code2SessionPromise;
}

export async function uniLogin() {
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
  let providers: string[] = [ ];
  try {
    const providerInfo = await uni.getProvider({ service: "oauth" });
    providers = providerInfo.provider;
  } catch (err) { /* empty */ }
  if (providers && providers.includes("weixin")) {
    let loginRes: UniApp.LoginRes | undefined;
    try {
      loginRes = await uni.login({ provider: "weixin" });
    } catch (err) { /* empty */ }
    const code = loginRes?.code;
    if (!code) {
      indexStore.setIsGuest(true);
      return false;
    }
    const appBaseInfo = indexStore.getAppBaseInfo();
    let appLanguage = appBaseInfo?.appLanguage || "zh-CN";
    if (appLanguage === "en") {
      appLanguage = "en-US";
    } else if (["zh", "zh-hans", "zh-hant", "zh-hans-cn"].includes(appLanguage?.toLocaleLowerCase())) {
      appLanguage = "zh-CN";
    }
    if (code) {
      let login_model: LoginModel | undefined;
      try {
        login_model = await code2Session({
          code,
          lang: appLanguage,
        });
      } catch(err) {
        await uni.showModal({
          title: "登录失败",
          content: (err as Error).toString(),
        });
        throw err;
      }
      if (login_model) {
        usrStore.setAuthorization(login_model.authorization);
        usrStore.setUsrId(login_model.usr_id);
        usrStore.setUsername(login_model.username);
        usrStore.setTenantId(login_model.tenant_id);
        usrStore.setLang(login_model.lang || "");
        return true;
      }
      return false;
    }
    await redirectToLogin();
    return false;
  }
  // #ifdef H5
  const userAgent = indexStore.getUserAgent();
  if (userAgent.isWxwork || userAgent.isWechat) {
    if (typeof wxwGetAppid === "undefined") {
      await redirectToLogin();
      return false;
    }
    const url = new URL(location.href);
    const code = url.searchParams.get("code");
    if (!code && !location.href.startsWith("https://open.weixin.qq.com")) {
      const state = uniqueID();
      localStorage.setItem("oauth2_state", state);
      const redirect_uri = location.href;
      const res = await wxwGetAppid();
      const appid = res?.appid;
      const agentid = res?.agentid;
      const scope = res?.scope;
      if (!appid) {
        await redirectToLogin();
        return false;
      }
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        encodeURIComponent(appid)
      }`;
      if (agentid) {
        url += `&agentid=${ encodeURIComponent(agentid) }`;
      }
      url += `&redirect_uri=${ encodeURIComponent(redirect_uri) }`;
      url += `&response_type=code`;
      url += `&scope=${ (scope || "snsapi_base") }`;
      url += `&state=${ encodeURIComponent(state) }`;
      url += "#wechat_redirect";
      location.replace(url);
      return false;
    }
  } else {
    await redirectToLogin();
  }
  // #endif
  return false;
}

async function redirectToLogin() {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  let redirect_uri: string | undefined;
  if (page) {
    const fullPath = (page as any).$page?.fullPath;
    if (fullPath) {
      redirect_uri = fullPath;
    } else {
      redirect_uri = "/" + page.route;
    }
  }
  let url = `/pages/index/Login`;
  if (redirect_uri) {
    url += `?redirect_uri=${ encodeURIComponent(redirect_uri) }`;
  }
  await uni.reLaunch({
    url,
  });
}
