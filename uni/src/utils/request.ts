import cfg from "./config";
import useIndexStore from "@/store/index";
import useUsrStore from "@/store/usr";
import { isEmpty } from "./util";

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
    await usrStore.setAccessToken(header["authorization"]);
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
    await usrStore.setAccessToken("");
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
  config: {
    id?: string;
    url?: string;
    header?: { [key: string]: any };
    notLoading?: boolean;
    showErrMsg?: boolean;
    type: "oss" | "tmpfile";
  },
) {
  if (!config.type) {
    config.type = "tmpfile";
  }
  const usrStore = useUsrStore(cfg.pinia);
  let res: {
    tempFilePath: string;
    statusCode: number;
  };
  try {
    const authorization: string = usrStore.authorization;
    const params = new URLSearchParams();
    if (authorization) {
      params.set("authorization", authorization);
    }
    params.set("id", model.id);
    if (model.filename) {
      params.set("filename", model.filename);
    }
    if (model.inline != null) {
      params.set("inline", model.inline);
    }
    if (model.remove != null) {
      params.set("remove", model.remove);
    }
    config.url = `${ cfg.url }/${ type }/download/${ model.filename || "" }?${ params.toString() }`;
    // const authorization = usrStore.authorization;
    // if (authorization) {
    //   config.header = config.header || { };
    //   config.header.authorization = authorization;
    // }
    res = await uni.downloadFile(config as any) as any;
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
  type: "oss" | "tmpfile",
): string {
  if (!type) {
    type = "tmpfile";
  }
  const usrStore = useUsrStore();
  const authorization: string = usrStore.authorization;
  const params = new URLSearchParams();
  if (authorization) {
    params.set("authorization", authorization);
  }
  params.set("id", model.id);
  if (model.filename) {
    params.set("filename", model.filename);
  }
  if (model.inline != null) {
    params.set("inline", model.inline);
  }
  if (model.remove != null) {
    params.set("remove", model.remove);
  }
  return `${ cfg.url }/${ type }/download/${ model.filename || "" }?${ params.toString() }`;
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
    res = await uni.request(config as any) as any;
  } catch(errTmp) {
    err = (errTmp as Error);
  } finally {
    if (!config.notLoading) {
      indexStore.minusLoading();
    }
  }
  const header = res?.header;
  if (header && header["authorization"]) {
    await usrStore.setAccessToken(header["authorization"]);
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
    await usrStore.setAccessToken("");
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

async function code2Session(code: string) {
  const appbaseInfo = uni.getAppBaseInfo();
  let appid = appbaseInfo.host?.appId;
  await request({
    url: `wx_usr/code2Session`,
    method: "POST",
    data: {
      appid,
      code,
    },
    showErrMsg: false,
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
    const loginRes = await uni.login({ provider: "weixin" });
    const code = loginRes.code;
    await code2Session(code);
    return true;
  }
  return false;
}
