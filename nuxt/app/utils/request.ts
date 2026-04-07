/* eslint-disable @typescript-eslint/no-explicit-any */
// import { saveAs } from "file-saver";
import { useLoading } from "@/store/index";
import { useAuthorization } from "@/store/usr";

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
    authorization?: string;
  },
): Promise<T> {
  let authorization = $(useAuthorization());
  if (config?.authorization != null) {
    authorization = config?.authorization;
  }
  let loading = $(useLoading());
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
      loading++;
    }
    config.header = config.header || new Headers();
    
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
    const resFt = await $fetch.raw<any>(config.url!, {
      headers: config.header,
      method: config.method || "POST" as any,
      body,
    });
    if (resFt.status !== 200) {
      let errMsg = resFt.statusText || resFt.status.toString();
      if (errMsg === "Internal Server Error") {
        errMsg = "系统正在维护，请稍后再试";
      }
      throw errMsg;
    }
    const header = resFt.headers;
    const data = resFt._data;
    res = {
      data,
      header,
    };
  } catch(errTmp) {
    err = errTmp;
    const errStr = err && err.toString();
    if (errStr === "TypeError: Failed to fetch") {
      err = "网络连接失败，请稍后再试";
    }
  } finally {
    if (!config.notLoading) {
      loading--;
    }
  }
  const header = res?.header || new Headers();
  let authorization2 = header?.get("authorization");
  if (authorization2) {
    if (authorization2.startsWith("Bearer ")) {
      authorization2 = authorization2.substring(7);
    }
    authorization = authorization2;
  }
  if (config.reqType === "graphql") {
    if (err != null) {
      throw err;
    }
    return res as T;
  }
  
  if (err != null && (!config || config.showErrMsg !== false)) {
    const errMsg = (err as any).errMsg || err.toString();
    if (errMsg) { /* empty */ }
    throw err;
  }
  const data = res!.data;
  if (data && (data.key === "token_empty" || data.key === "refresh_token_expired")) {
    // 退出登录
    authorization = "";
    if (import.meta.client) {
      window.location.reload();
    }
    return data;
  }
  if (data && data.code !== 0) {
    if (data.msg && (!config || config.showErrMsg !== false)) {
      const errMsg = data.msg;
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
    authorization?: string;
  },
) {
  let authorization = $(useAuthorization());
  if (config?.authorization != null) {
    authorization = config?.authorization;
  }
  let loading = $(useLoading());
  config = config || { };
  config.type = config.type || "oss";
  config.url = config.url || `${ baseURL }/api/${ config.type }/upload`;
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
  
  if (authorization) {
    config.header.set("authorization", authorization);
  }
  let err: any = undefined;
  let res: any = undefined;
  try {
    if (!config.notLoading) {
      loading++;
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
      loading--;
    }
  }
  const header = res?.header || new Headers();
  let authorization2 = header?.get("authorization");
  if (authorization2) {
    if (authorization2.startsWith("Bearer ")) {
      authorization2 = authorization2.substring(7);
    }
    authorization = authorization2;
  }
  if (err != null && (!config || config.showErrMsg !== false)) {
    const errMsg = (err as any).errMsg || err.toString();
    throw err;
  }
  {
    const data = res;
    if (data && (data.key === "token_empty" || data.key === "refresh_token_expired")) {
      // 退出登录
      authorization = "";
      if (import.meta.client) {
        window.location.reload();
      }
      return data;
    }
    if (data && data.code !== 0) {
      if (data.msg && (!config || config.showErrMsg !== false)) {
        const errMsg = data.msg;
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
  // saveAs(url);
}
