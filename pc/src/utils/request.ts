import { ElMessage } from "element-plus";
import useUsrStore from "../store/usr";
import useIndexStore from "../store/index";
import { saveAs } from "file-saver";

import cfg from "./config";

export const baseURL = "";

export async function request<T>(
  config: {
    url?: string;
    reqType?: string;
    notLoading?: boolean;
    showErrMsg?: boolean;
    header?: Headers;
    notLogin?: boolean;
    method?: string;
    data?: any;
    duration?: number;
  },
): Promise<T> {
  const indexStore = useIndexStore(cfg.pinia);
  const usrStore = useUsrStore(cfg.pinia);
  let err: any;
  let res: {
    data: any;
    header: Headers;
  } | undefined;
  try {
    if (config.reqType !== "graphql") {
      if (isEmpty(config.url)) {
        throw new Error("config.url is empty");
      }
      if (baseURL) {
        config.url = `${ baseURL }/${ config.url }`;
      }
    }
    if (!config.notLoading) {
      indexStore.addLoading();
    }
    config.header = config.header || new Headers();
    
    const authorization = usrStore.authorization;
    if (authorization) {
      config.header.set("authorization", authorization);
    }
    
    let body = config.data;
    if (
      body != null &&
      !(body instanceof FormData) &&
      typeof body === "object"
    ) {
      config.header.set("content-type", "application/json; charset=utf-8");
      body = JSON.stringify(config.data);
    }
    const resFt = await fetch(config.url!, {
      headers: config.header,
      method: config.method || "post",
      body,
    });
    if (resFt.status !== 200) {
      let errMsg = resFt.statusText || resFt.status.toString();
      if (errMsg === "Internal Server Error") {
        errMsg = "系统正在维护，请稍后再试";
      }
      throw errMsg;
    }
    const data = await resFt.json();
    res = {
      data,
      header: resFt.headers,
    };
  } catch(errTmp) {
    err = errTmp;
    const errStr = err ?? err.toString();
    if (errStr === "TypeError: Failed to fetch") {
      err = "网络连接失败，请稍后再试";
    }
  } finally {
    if (!config.notLoading) {
      indexStore.minusLoading();
    }
  }
  const header = res?.header || new Headers();
  let authorization = header?.get("authorization");
  if (authorization) {
    if (authorization.startsWith("Bearer ")) {
      authorization = authorization.substring(7);
    }
    usrStore.refreshToken(authorization);
  }
  if (config.reqType === "graphql") {
    if (err != null) {
      throw err;
    }
    return res as T;
  }
  
  if (err != null && (!config || config.showErrMsg !== false)) {
    const errMsg = (err as any).errMsg || err.toString();
    if (errMsg) {
      ElMessage({
        offset: 0,
        type: "error",
        showClose: true,
        message: errMsg,
        duration: config.duration,
      });
    }
    throw err;
  }
  const data = res!.data;
  if (data && (data.key === "token_empty" || data.key === "refresh_token_expired")) {
    indexStore.logout();
    return data;
  }
  if (data && data.code !== 0) {
    if (data.msg && (!config || config.showErrMsg !== false)) {
      const errMsg = data.msg;
      if (errMsg) {
        ElMessage({
          offset: 0,
          type: "error",
          showClose: true,
          message: errMsg,
          duration: config.duration,
        });
      }
    }
    throw data;
  }
  return data;
}

export async function uploadFile(
  file: File,
  data?: { [key: string]: any },
  config?: {
    url?: string;
    method?: string;
    type?: "oss"|"tmpfile",
    data?: FormData;
    header?: Headers;
    notLoading?: boolean;
    showErrMsg?: boolean;
    duration?: number;
  },
) {
  const indexStore = useIndexStore(cfg.pinia);
  const usrStore = useUsrStore(cfg.pinia);
  config = config || { };
  config.type = config.type || "oss";
  config.url = config.url || `${ baseURL }/api/${ config.type }/upload`;
  config.method = config.method || "post";
  const formData = new FormData();
  formData.append("file", file);
  if (data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
  }
  config.data = formData;
  config.header = config.header || new Headers();
    
  {
    const authorization = usrStore.authorization;
    if (authorization) {
      config.header.set("authorization", authorization);
    }
  }
  let err: any = undefined;
  let res: any = undefined;
  try {
    if (!config.notLoading) {
      indexStore.addLoading();
    }
    res = await request<{
      code: number;
      msg: string;
      data: string;
    }>(config);
  } catch(errTmp) {
    err = (errTmp as Error);
  } finally {
    if (!config.notLoading) {
      indexStore.minusLoading();
    }
  }
  const header = res?.header || new Headers();
  let authorization = header?.get("authorization");
  if (authorization) {
    if (authorization.startsWith("Bearer ")) {
      authorization = authorization.substring(7);
    }
    usrStore.refreshToken(authorization);
  }
  if (err != null && (!config || config.showErrMsg !== false)) {
    const errMsg = (err as any).errMsg || err.toString();
    if (errMsg) {
      ElMessage({
        offset: 0,
        type: "error",
        showClose: true,
        message: errMsg,
        duration: config.duration,
      });
    }
    throw err;
  }
  {
    const data = res;
    if (data && (data.key === "token_empty" || data.key === "refresh_token_expired")) {
      indexStore.logout();
      return data;
    }
    if (data && data.code !== 0) {
      if (data.msg && (!config || config.showErrMsg !== false)) {
        const errMsg = data.msg;
        if (errMsg) {
          ElMessage({
            offset: 0,
            type: "error",
            showClose: true,
            message: errMsg,
            duration: config.duration,
          });
        }
      }
      throw data;
    }
  }
  const id = res.data;
  return id;
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
    inline?: "0"|"1";
  } | string,
  type: "oss" | "tmpfile" = "tmpfile",
): string {
  const usrStore = useUsrStore();
  const params = new URLSearchParams();
  if (typeof model === "string") {
    model = { id: model };
  }
  params.set("id", model.id);
  if (model.filename) {
    params.set("filename", model.filename);
  }
  if (model.inline != null) {
    params.set("inline", model.inline);
  }
  return `${ baseURL }/api/${ type }/download/${ model.filename || "" }?${ params.toString() }`;
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
  } | string,
) {
  const params = new URLSearchParams();
  if (typeof model === "string") {
    model = {
      id: model,
      format: "webp",
    };
  }
  params.set("id", model.id);
  if (model.filename) {
    params.set("filename", model.filename);
  }
  if (model.inline != null) {
    params.set("inline", model.inline);
  }
  if (model.format) {
    params.set("f", model.format);
  }
  if (model.width) {
    params.set("w", model.width.toString());
  }
  if (model.height) {
    params.set("h", model.height.toString());
  }
  if (model.quality) {
    params.set("q", model.quality.toString());
  }
  return `${ baseURL }/api/oss/img?${ params.toString() }`;
}

/**
 * 下载文件
 * @export
 * @param {({
 *     id: string;
 *     filename?: string;
 *     inline?: "0"|"1";
 *   } | string)} id
 */
export function downloadById(
  id: {
    id: string;
    filename?: string;
    remove?: "0"|"1";
    inline?: "0"|"1";
  } | string,
  type: "oss" | "tmpfile" = "tmpfile",
) {
  let model: {
    id: string,
  } = {
    id: "",
  };
  if (typeof id === "string") {
    model.id = id;
  } else {
    model = id;
  }
  if (!model || !model.id) {
    return;
  }
  const url = getDownloadUrl(model, type);
  saveAs(url);
}
