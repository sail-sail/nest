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
}): Promise<string> {
  const indexStore = useIndexStore(cfg.pinia);
  const usrStore = useUsrStore(cfg.pinia);
  let err = undefined;
  let res = undefined;
  try {
    if (!config.notLoading) {
      indexStore.addLoading();
    }
    if (!config.url) {
      config.url = "minio/upload";
    }
    if (!config.name) {
      config.name = "file";
    }
    config.url = `${ cfg.url }/${ config.url }`;
    const access_token = usrStore.access_token;
    if (access_token) {
      config.header = config.header || { };
      config.header.access_token = access_token;
    }
    res = <any>await uni.uploadFile(<any>config);
    if (res.data) {
      res.data = JSON.parse(res.data);
    }
  } catch (err2) {
    if (config.showErrMsg) {
      let errMsg = err2.toString();
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
  if (header["access_token"]) {
    await usrStore.setAccessToken(header["access_token"]);
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
  if (!res) {
    return;
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
  },
) {
  const usrStore = useUsrStore(cfg.pinia);
  let res: {
    tempFilePath: string;
    statusCode: number;
  } = undefined;
  try {
    if (config.id) {
      config.url = `minio/download?id=${ encodeURIComponent(config.id) }`;
    }
    config.url = `${ cfg.url }/${ config.url }`;
    const access_token = usrStore.access_token;
    if (access_token) {
      config.header = config.header || { };
      config.header.access_token = access_token;
    }
    // #ifndef H5
    res = <any>await uni.downloadFile(<any>config);
    // #endif
    // #ifdef H5
    window.location.href = config.url;
    // #endif
  } catch (err2) {
    if (config.showErrMsg) {
      let errMsg = err2.toString();
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
  const access_token = usrStore.access_token;
  if (access_token) {
    url += `&access_token=${ access_token }`;
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
  let err = undefined;
  let res = undefined;
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
    const access_token = usrStore.access_token;
    if (access_token) {
      config.header = config.header || { };
      config.header.access_token = access_token;
    }
    res = <any>await uni.request(<any>config);
  } catch(errTmp) {
    err = errTmp;
  } finally {
    if (!config.notLoading) {
      indexStore.minusLoading();
    }
  }
  const header = res?.header;
  if (header && header["access_token"]) {
    await usrStore.setAccessToken(header["access_token"]);
  }
  if (err && (!config || config.showErrMsg !== false)) {
    let errMsg = err.errMsg || err.toString();
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
  await request({
    url: `wxapp/code2Session`,
    method: "POST",
    data: {
      code,
    },
    showErrMsg: false,
    notLogin: true,
  });
}

export async function uniLogin() {
  let providers: string[] = undefined;
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
