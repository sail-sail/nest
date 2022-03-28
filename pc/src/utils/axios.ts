import Axios, { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import useUsrStore from "../store/usr";
import useIndexStore from "../store/index";

export const baseURL = "";

export const axios = Axios.create({
  baseURL,
  timeout: 20000,
  timeoutErrorMessage: "请求超时!",
});

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (config) => {
    const usrStore = useUsrStore();
    const indexStore = useIndexStore();
    const access_token: string = usrStore.access_token;
    if (access_token) {
      config.headers.access_token = access_token;
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
    if (headers["access_token"]) {
      usrStore.setAccess_token(headers["access_token"]);
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
    let errMsg = "";
    if (error.response && error.response.data) {
      // const code = error.response.status
      errMsg = error.response.data.message;
    } else {
      errMsg = error;
    }
    if (errMsg) {
      ElMessage({
        offset: 0,
        type: "error",
        showClose: true,
        message: (<any>errMsg).message || errMsg.toString(),
      });
    }
    return Promise.reject(error);
  },
);

/**
 * 上传文件
 * @export
 * @param {File} file 需要上传的文件
 * @param {{ [key: string]: any }} data 上传文件时需要附带的数据
 * @param {AxiosRequestConfig<FormData>} config 配置选项
 */
export async function uploadFile(
  file: File,
  data?: { [key: string]: any },
  config?: AxiosRequestConfig<FormData>,
) {
  config = config || { };
  config.url = config.url || `${ baseURL }/api/minio/upload`;
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
  const rvData = res.data;
  return rvData;
}
