import Axios, { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import useUsrStore from "../store/usr";
import useIndexStore from "../store/index";
import { saveAs } from "file-saver";

export const baseURL = "";

export const axios = Axios.create({
  baseURL,
  timeout: 60000,
  timeoutErrorMessage: "请求超时!",
});

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (config) => {
    const usrStore = useUsrStore();
    const indexStore = useIndexStore();
    const authorization: string = usrStore.authorization;
    if (authorization) {
      config.headers.authorization = authorization;
    }
    if ((<any>config).notLoading !== true) {
      indexStore.addLoading();
    }
    return config;
  },
  (error) => {
    const indexStore = useIndexStore();
    indexStore.minusLoading();
    return Promise.reject(error);
  },
);

// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
  (response) => {
    const indexStore = useIndexStore();
    const usrStore = useUsrStore();
    const config = response.config;
    if ((<any>config).notLoading !== true) {
      indexStore.minusLoading();
    }
    const headers = response.headers;
    if (headers["authorization"]) {
      let authorization = headers["authorization"];
      if (authorization.startsWith("Bearer ")) {
        authorization = authorization.substring(7);
      }
      usrStore.setAuthorization(authorization);
    }
    if ((<any>config).reqType === "graphql") {
      return response;
    }
    const data: any = response.data;
    if (data.key === "token_empty" || data.key === "refresh_token_expired") {
      indexStore.logout();
      return data;
    }
    if ((<any>config).showErrMsg !== false) {
      if (data.code !== 0) {
        const errMsg = <string>data.msg;
        if (errMsg) {
          ElMessage({
            offset: 0,
            type: "error",
            showClose: true,
            message: errMsg.toString(),
            duration: (<any>config).duration,
          });
        }
      }
    }
    return response;
  },
  (error) => {
    const indexStore = useIndexStore();
    indexStore.minusLoading();
    // let errMsg = "";
    // if (error.response && error.response.data) {
    //   // const code = error.response.status
    //   errMsg = error.response.data.message;
    // } else {
    //   errMsg = error;
    // }
    // if (errMsg) {
    //   ElMessage({
    //     offset: 0,
    //     type: "error",
    //     showClose: true,
    //     message: (<any>errMsg).message || errMsg.toString(),
    //   });
    // }
    return Promise.reject(error);
  },
);

/**
 * 上传文件
 * @export
 * @param {File} file 需要上传的文件
 * @param {{ [key: string]: any }} data 上传文件时需要附带的数据
 * @param {AxiosRequestConfig<FormData>} config 配置选项, type: oss 或者 tmpfile, 默认为 oss
 */
export async function uploadFile(
  file: File,
  data?: { [key: string]: any },
  config?: AxiosRequestConfig<FormData> & { type?: "oss"|"tmpfile" },
) {
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
  const res = await axios.request<{
    code: number;
    msg: string;
    data: string;
  }>(config);
  const id = res.data.data;
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
    remove?: "0"|"1";
    inline?: "0"|"1";
  },
  type: "oss" | "tmpfile" = "tmpfile",
): string {
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
  return `${ baseURL }/api/${ type }/download/${ model.filename || "" }?${ params.toString() }`;
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
  let model = { id: undefined };
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
