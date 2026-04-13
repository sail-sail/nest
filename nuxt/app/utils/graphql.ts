/* eslint-disable @typescript-eslint/no-explicit-any */
import { uuid } from "./StringUtil";

import { useAuthorization } from "@/app/composables/usr/index.ts";

declare global {
  
  interface GqlArg {
    operationName?: string,
    query: string,
    variables?: { [key: string]: any },
  }
  
  interface GqlOpt {
    showErrMsg?: boolean;
    duration?: number;
    timeout?: number;
    notLoading?: boolean;
    isMutation?: boolean;
    "Request-ID"?: string;
    authorization?: string;
  }
  
}

/**
 * 发送 GraphQL 查询请求
 */
export async function query(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  opt = opt || { };
  opt.isMutation = false;
  return await gqlQuery(gqlArg, opt);
}

/**
 * 发送 GraphQL 修改请求 
 */
export async function mutation(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  opt = opt || { };
  opt.isMutation = true;
  return await gqlQuery(gqlArg, opt);
}

export function getQueryUrl(gqlArg: GqlArg, opt?: GqlOpt, authorization0?: string): string {
  const authorization = $(useAuthorization());
  if (authorization0 == null) {
    authorization0 = authorization;
  }
  let request_id: string | undefined;
  if (opt && opt.isMutation) {
    request_id = opt["Request-ID"] || uuid();
  }
  let url = `/api/graphql?query=${ encodeURIComponent(gqlArg.query) }&variables=${ encodeURIComponent(JSON.stringify(gqlArg.variables)) }`;
  if (request_id) {
    url += `&request_id=${ request_id }`;
  }
  if (authorization0) {
    url += `&Authorization=${ authorization0 }`;
  }
  return url;
}

async function gqlQuery(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  let authorization = $(useAuthorization());
  if (opt?.authorization != null) {
    authorization = opt?.authorization;
  }
  // let duration = 3000;
  // if (opt && opt.duration != null) {
  //   duration = opt.duration;
  // }
  // gqlArg.query = gqlArg.query.trim().replace(/\s+/gm, " ");
  const headers: {
    "Request-ID"?: string;
  } = { };
  if (opt && opt.isMutation) {
    let requestId = opt["Request-ID"];
    if (!requestId) {
      requestId = uuid();
    }
    headers["Request-ID"] = requestId;
  }
  let rvData: any = undefined;
  try {
    rvData = await request({
      method: "post",
      url: `/api/graphql`,
      data: gqlArg,
      timeout: opt?.timeout,
      reqType: "graphql",
      notLoading: opt?.notLoading,
      headers,
      // showErrMsg: opt?.showErrMsg,
      // duration: opt?.duration,
      isMutation: opt?.isMutation,
      authorization,
    } as any);
  } catch (err0) {
    const err = err0 as any;
    if (err.response && err.response.data) {
      rvData = err.response;
    } else {
      if (!opt || opt.showErrMsg !== false) {
        console.error(err);
      }
      throw err;
    }
  }
  const { data: { data, errors } } = rvData;
  if (errors && errors.length > 0) {
    const is_token_expired = errors.some((item: any) => {
      if (
        item.code === "token_empty" || item.code === "refresh_token_expired" ||
        item.message === "token_empty" || item.message === "refresh_token_expired"
      ) {
        return true;
      }
      return false;
    });
    if (is_token_expired) {
      // TODO 退出登录
      // usrStore.logout();
      console.error("退出登录");
      return data;
    }
  }
  const errMsgArr: string[] = [ ];
  if (errors && errors.length > 0) {
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      if (!item.message) {
        continue;
      }
      if (errMsgArr.includes(item.message)) {
        continue;
      }
      errMsgArr.push(item.message);
    }
  }
  const errMsg = errMsgArr.join("\n");
  if (errMsg) {
    if (!opt || opt.showErrMsg !== false) {
      throw createError(errMsg);
    }
  }
  return data;
}
