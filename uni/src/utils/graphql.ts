import { request, uniLogin } from "./request";
import cfg from "./config"

import useUsrStore from "@/store/usr";

export interface GqlArg {
  operationName?: string,
  query: string,
  variables?: { [key: string]: any },
}

export interface GqlOpt {
  showErrMsg?: boolean;
    url?: string;
    notLoading?: boolean;
    method?: string;
    data?: any;
    reqType?: string;
    notLogin?: boolean;
    duration?: number;
}

export function gql(strArr: any, ...args: any[]) {
  let str = strArr[0];
  for (let i = 0; i < args.length; i++) {
    const item = args[i];
    str += `${ item }`;
    str += strArr[i + 1];
  }
  return str;
}

/**
 *
 * @export
 * @param {GqlArg} gqlArg
 * @param {GqlOpt} config
 *   showErrMsg: boolean 是否显示错误信息, 默认为true
 * @return {*} 
 */
export async function gqlQuery(
  gqlArg: GqlArg,
  config?: GqlOpt,
): Promise<any> {
  gqlArg.query = gqlArg.query.trim().replace(/\s+/gm, " ");
  let rvData = undefined;
  try {
    config = config || { };
    config.url = "";
    if (cfg.urlBase) {
      config.url += cfg.urlBase;
    }
    config.url += `/graphql`;
    config.method = "POST";
    config.data = gqlArg;
    config.reqType = "graphql";
    rvData = await request(config);
  } catch (err) {
    if (err && (!config || config.showErrMsg !== false)) {
      let errMsg = err.errMsg || err.toString();
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
  const { data: { data, errors } } = rvData;
  const exception = errors && errors[0] && errors[0].extensions && errors[0].extensions.exception;
  if (exception) {
    if (exception.code === "token_empty" || exception.code === "refresh_token_expired") {
      const usrStore = useUsrStore();
      await usrStore.setAccessToken("");
      if (!config.notLogin) {
        if (await uniLogin()) {
          config.notLogin = true;
          return await gqlQuery(gqlArg, config);
        }
      }
    }
  }
  if (errors && (!config || config.showErrMsg !== false)) {
    let errMsg = "";
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      errMsg += item.message;
      if (i !== errors.length - 1) {
        errMsg += "\n";
      }
    }
    uni.showToast({
      title: errMsg,
      icon: "none",
      duration: config?.duration || 3000,
      mask: true,
      position: "center",
    });
  }
  return data;
}
