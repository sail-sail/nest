import { ElMessage } from "element-plus";
import { axios } from "./axios";
import useUsrStore from "../store/usr";
import useBackground_taskStore from "../store/background_task";
export { axios, baseURL } from "./axios";

export interface GqlArg {
  operationName?: string,
  query: string,
  variables?: { [key: string]: any },
}

export interface GqlOpt {
  showErrMsg?: boolean,
  duration?: number,
  timeout?: number,
  notLoading?: boolean,
}

export function gql(strArr: TemplateStringsArray, ...args: any[]): string {
  let str = strArr[0];
  for (let i = 0; i < args.length; i++) {
    const item = args[i];
    str += `${ item }`;
    str += strArr[i + 1];
  }
  return str;
}

/**
 * @description: 发送 GraphQL 请求
 * @export
 * @param {GqlArg} gqlArg
 * @param {GqlOpt} [opt]
 * @return {Promise<any>} 
 */
export async function gqlQuery(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  let duration = 3000;
  if (opt && opt.duration != null) {
    duration = opt.duration;
  }
  gqlArg.query = gqlArg.query.trim().replace(/\s+/gm, " ");
  let rvData: any = undefined;
  try {
    rvData = await axios.request(<any> {
      method: "post",
      url: `/graphql`,
      data: gqlArg,
      timeout: opt?.timeout,
      reqType: "graphql",
      notLoading: opt?.notLoading,
      // showErrMsg: opt?.showErrMsg,
      // duration: opt?.duration,
    });
  } catch (err) {
    if ((<any>err).response && (<any>err).response.data) {
      rvData = (<any>err).response;
    } else {
      if (!opt || opt.showErrMsg !== false) {
        ElMessage({
          offset: 0,
          type: "error",
          showClose: true,
          message: (<any>err).toString(),
          duration,
        });
      }
      throw err;
    }
  }
  const { data: { data, errors } } = rvData;
  let exception = errors && errors[0] && errors[0].extensions && errors[0].extensions.exception;
  if (!exception) {
    exception = errors?.[0];
  }
  if (exception) {
    const code = exception.code;
    const usrStore = useUsrStore();
    if (code === "refresh_token_expired") {
      usrStore.setAccess_token("");
      return data;
    }
    if (code === "token_empty") {
      usrStore.setAccess_token("");
      return data;
    }
    if (code === "background_task") {
      ElMessage.success(exception.message);
      const background_taskStore = useBackground_taskStore();
      background_taskStore.listDialogVisible = true;
      return data;
    }
  }
  if (!opt || opt.showErrMsg !== false) {
    if (errors && errors.length > 0) {
      let errMsg = "";
      for (let i = 0; i < errors.length; i++) {
        const item = errors[i];
        errMsg += item.message;
        if (i !== errors.length - 1) {
          errMsg += "\n";
        }
      }
      if (errMsg) {
        ElMessage({
          offset: 0,
          type: "error",
          showClose: true,
          message: errMsg,
          duration,
        });
      }
    }
  }
  return data;
}
