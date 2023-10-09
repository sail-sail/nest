import cfg from "./config";
import useIndexStore from "@/store/index";
import useUsrStore from "@/store/usr";
import { isEmpty } from "./StringUtil";

export async function uploadFile(config: {
  url?: string;
  name?: string;
  filePath?: string;
  header?: { [key: string]: any };
  notLoading?: boolean;
  showErrMsg?: boolean;
  reqType?: string;
  notLogin?: boolean;
  type?: "oss" | "tmpfile";
}): Promise<string> {
  const indexStore = useIndexStore(cfg.pinia);
  const usrStore = useUsrStore(cfg.pinia);
  let err: any = undefined;
  let res: any = undefined;
  try {
    if (!config.notLoading) {
      indexStore.addLoading();
    }
    if (!config.name) {
      config.name = "file";
    }
    config.url = config.url || `${ cfg.url }/${ config.type }/upload`;
    const authorization = usrStore.authorization;
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
      let errMsg = (err2 as Error).toString();
      uni.showToast({
        title: errMsg,
        icon: "error",
        duration: 3000,
        mask: true,
        position: "center",
      });
    }
    throw err2;
  } finally {
    if (!config.notLoading) {
      indexStore.minusLoading();
    }
  }
  const header = res.header || { };
  if (header["authorization"]) {
    await usrStore.setAuthorization(header["authorization"]);
  }
  if (config.reqType === "graphql") {
    return res;
  }
  if (err && config.showErrMsg) {
    let errMsg = err.errMsg || err.toString();
    uni.showToast({
      title: errMsg,
      icon: "error",
      duration: 3000,
      mask: true,
      position: "center",
    });
    throw err;
  }
  const data = res.data;
  if (data && (data.key === "token_empty" || data.key === "refresh_token_expired")) {
    await usrStore.setAuthorization("");
    if (!config.notLogin) {
      if (await uniLogin()) {
        config.notLogin = true;
        return await uploadFile(config);
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
      let errMsg = (err2 as Error).toString();
      uni.showToast({
        title: errMsg,
        icon: "error",
        duration: 3000,
        mask: true,
        position: "center",
      });
    }
    throw err2;
  }
  return res;
}

export function getAttUrl(id: string, action?: string) {
  const usrStore = useUsrStore(cfg.pinia);
  action = action || "minio/download";
  let url = `${ action }?id=${ encodeURIComponent(id) }`;
  url = `${ cfg.url }/${ url }`;
  const authorization = usrStore.authorization;
  if (authorization) {
    url += `&authorization=${ authorization }`;
  }
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
  if (paramStr.startsWith("&")) {
    paramStr = paramStr.substring(1);
  }
  let url = `${ cfg.url }/${ type }/download/${ model.filename || "" }`;
  if (paramStr) {
    url += "?" + paramStr;
  }
  return url;
}

export async function request(
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
) {
  const indexStore = useIndexStore(cfg.pinia);
  const usrStore = useUsrStore(cfg.pinia);
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
    const authorization = usrStore.authorization;
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
    await usrStore.setAuthorization(header["authorization"]);
  }
  if (err && (!config || config.showErrMsg !== false)) {
    let errMsg = (err as any).errMsg || err.toString();
    uni.showToast({
      title: errMsg,
      icon: "none",
      duration: 3000,
      mask: true,
      position: "center",
    });
    throw err;
  }
  if (config.reqType === "graphql") {
    return res;
  }
  if (!res) {
    return;
  }
  const data = res.data;
  if (data && (data.key === "token_empty" || data.key === "refresh_token_expired")) {
    await usrStore.setAuthorization("");
    if (!config.notLogin) {
      if (await uniLogin()) {
        config.notLogin = true;
        return await request(config);
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

export function getAppid() {
  // const appbaseInfo = uni.getAppBaseInfo();
  // let appid = (appbaseInfo as any).host?.appId;
  // return appid;
  return cfg.appid;
}

async function code2Session(
  model: {
    code: string;
    lang: string;
  },
) {
  const appid = getAppid();
  await request({
    url: `wx_usr/code2Session`,
    method: "POST",
    data: {
      appid,
      ...model,
    },
    showErrMsg: true,
    notLogin: true,
  });
}

export async function uniLogin() {
  let providers: string[] = [ ];
  try {
    const providerInfo = await uni.getProvider({ service: "oauth" });
    providers = providerInfo.provider;
  } catch (err) {
  }
  if (providers && providers.includes("weixin")) {
    const systemInfo = uni.getSystemInfoSync();
    let appLanguage = systemInfo.appLanguage?.toLocaleLowerCase() || "zh-cn";
    if (appLanguage === "en") {
      appLanguage = "en-us";
    } else if (appLanguage === "zh" || appLanguage === "zh-hans" || appLanguage === "zh-hant" || appLanguage === "zh-hans-cn" || appLanguage === "zh-hk" || appLanguage === "zh-tw" || appLanguage === "zh-mo") {
      appLanguage = "zh-cn";
    }
    const loginRes = await uni.login({ provider: "weixin" });
    const code = loginRes?.code;
    if (code) {
      await code2Session({
        code,
        lang: appLanguage,
      });
      return true;
    }
    return false;
  }
  // #ifdef H5
  const indexStore = useIndexStore(cfg.pinia);
  const userAgent = indexStore.getUserAgent();
  if (userAgent.isWxwork || userAgent.isWechat) {
    const url = new URL(location.href);
    const code = url.searchParams.get("code");
    if (!code && !location.href.startsWith("https://open.weixin.qq.com")) {
      const redirect_uri = location.href;
      if (cfg.appid && cfg.agentid) {
        const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          encodeURIComponent(cfg.appid)
        }&redirect_uri=${
          encodeURIComponent(redirect_uri)
        }&response_type=code&scope=snsapi_base&state=STATE&agentid=${
          encodeURIComponent(cfg.agentid)
        }#wechat_redirect`;
        location.replace(url);
        return false;
      }
    }
  } else {
    const redirect_uri = location.hash.substring(1);
    let url = `/pages/index/Login`;
    if (redirect_uri) {
      url += `?redirect_uri=${ encodeURIComponent(redirect_uri) }`;
    }
    await uni.redirectTo({
      url,
    });
  }
  // #endif
  return false;
}
