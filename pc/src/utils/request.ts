/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElMessage } from "element-plus";
import useUsrStore from "../store/usr.ts";
import useIndexStore from "../store/index.ts";
import { saveAs } from "file-saver";

import cfg from "./config.ts";

export const baseURL = "";

export async function request<T>(
  config: {
    url?: string;
    reqType?: string;
    notLoading?: boolean;
    showErrMsg?: boolean;
    headers?: Headers;
    notLogin?: boolean;
    notAuthorization?: boolean;
    method?: string;
    data?: any;
    duration?: number;
    client_tenant_id?: TenantId | null;
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
    config.headers = config.headers || new Headers();
    
    if (config.notAuthorization !== true) {
      const authorization = usrStore.authorization;
      if (authorization) {
        config.headers.set("authorization", authorization);
      }
    }
    
    let client_tenant_id = config.client_tenant_id;
    if (!client_tenant_id) {
      client_tenant_id = sessionStorage.getItem("client_tenant_id") as TenantId;
    }
    if (client_tenant_id) {
      config.headers.set("TenantId", client_tenant_id);
    }
    
    let body = config.data;
    if (
      body != null &&
      !(body instanceof FormData) &&
      typeof body === "object"
    ) {
      config.headers.set("content-type", "application/json; charset=utf-8");
      body = JSON.stringify(config.data);
    }
    const resFt = await fetch(config.url!, {
      headers: config.headers,
      method: config.method || "post",
      body,
    });
    const status = resFt.status;
    if (status === 502) {
      throw new Error("服务器正在重启，请稍后再试");
    }
    if (status !== 200) {
      let errMsg = await resFt.text();
      if (!errMsg) {
        errMsg = resFt.statusText;
      }
      throw new Error(errMsg);
    }
    const data = await resFt.json();
    res = {
      data,
      header: resFt.headers,
    };
  } catch(errTmp) {
    err = errTmp;
    const errStr = err && err.toString();
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
    db?: string;
    isPublic?: boolean;
  },
) {
  const indexStore = useIndexStore(cfg.pinia);
  const usrStore = useUsrStore(cfg.pinia);
  config = config || { };
  config.type = config.type || "oss";
  if (!config.url) {
    let url = baseURL;
    if (config?.isPublic) {
      url += `/api/${ config.type }/uploadPublic`;
    } else {
      url += `/api/${ config.type }/upload`;
    }
    config.url = url;
  }
  config.method = config.method || "post";
  const formData = new FormData();
  formData.append("file", file);
  if (data) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
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
  if (config.db) {
    config.url += `?db=${ encodeURIComponent(config.db) }`;
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
  type: "oss" | "tmpfile" = "oss",
): string {
  const usrStore = useUsrStore(cfg.pinia);
  const params = new URLSearchParams();
  if (typeof model === "string") {
    model = { id: model };
  }
  params.set("id", model.id);
  if (!model.id) {
    return "";
  }
  if (model.filename) {
    params.set("filename", model.filename);
  }
  if (model.inline != null) {
    params.set("inline", model.inline);
  }
  if (usrStore.authorization) {
    params.set("authorization", usrStore.authorization);
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
    notAuthorization?: boolean;
  } | string,
) {
  const usrStore = useUsrStore(cfg.pinia);
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
  if (model.notAuthorization !== true) {
    if (usrStore.authorization) {
      params.set("authorization", usrStore.authorization);
    }
  }
  return `${ baseURL }/api/oss/img?${ params.toString() }`;
}

/**
 * 获得压缩后图片的url数组
 **/
export function getImgUrlArr(
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
): string[] {
  if (typeof model === "string") {
    model = {
      id: model,
      format: "webp",
    };
  }
  if (!model.id) {
    return [ ];
  }
  const idArr = (model.id || "").split(",");
  const imgUrlArr: string[] = [ ];
  for (const id of idArr) {
    const imgUrl = getImgUrl({
      id,
      format: model.format,
      width: model.width,
      height: model.height,
      quality: model.quality,
      filename: model.filename,
      inline: model.inline,
      notAuthorization: model.notAuthorization,
    });
    imgUrlArr.push(imgUrl);
  }
  return imgUrlArr;
}

export function getRequestUrl(
  config: {
    url?: string;
    reqType?: string;
    notLogin?: boolean;
    notAuthorization?: boolean;
    data?: any;
    client_tenant_id?: TenantId | null;
  },
): string {
  
  let url = "";
  
  if (config.reqType !== "graphql") {
    if (isEmpty(config.url)) {
      throw new Error("config.url is empty");
    }
    if (baseURL) {
      url = `${ baseURL }/${ config.url }`;
    }
  } else {
    url = config.url || "" + "/graphql";
  }
  
  const params: string[] = [ ];
  
  if (config.data) {
    for (const key in config.data) {
      if (Object.prototype.hasOwnProperty.call(config.data, key)) {
        let value = config.data[key];
        if (value == null) {
          value = "";
        }
        params.push(`${ encodeURIComponent(key) }=${ encodeURIComponent(value) }`);
      }
    }
  }
  
  let client_tenant_id = config.client_tenant_id;
  if (!client_tenant_id) {
    client_tenant_id = sessionStorage.getItem("client_tenant_id") as TenantId;
  }
  if (client_tenant_id) {
    params.push(`TenantId=${ encodeURIComponent(client_tenant_id) }`);
  }
  
  if (config.notAuthorization !== true) {
    const usrStore = useUsrStore();
    const authorization = usrStore.authorization;
    if (authorization) {
      params.push(`authorization=${ encodeURIComponent(authorization) }`);
    }
  }
  
  if (params.length > 0) {
    url += "?" + params.join("&");
  }
  
  return url;
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
