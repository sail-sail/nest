import {
  error,
  log,
} from "/lib/context.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

import {
  findOne as findOneWxoApp,
  validateOption as vlidateOptionWxoApp,
} from "/gen/wx/wxo_app/wxo_app.dao.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  FetchUserInfo,
} from "./wxo_usr.model.ts";

/** 通过code换取网页授权openid */
export async function fetchOpenid(
  code: string,
  appid: string,
) {
  const wxo_app_model = await vlidateOptionWxoApp(
    await findOneWxoApp({
      appid,
    }),
  );
  const appsecret = wxo_app_model.appsecret;
  
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${
    appid
  }&secret=${
    appsecret
  }&code=${
    encodeURIComponent(code)
  }&grant_type=authorization_code`;
  
  log("wxo_usr.fetchOpenid.url", url);
  
  const res = await fetch(url);
  
  const data: {
    openid: string,
    access_token: string,
    unionid?: string,
    errcode?: number,
    errmsg?: string,
  } = await res.json();
  
  log("wxo_usr.fetchOpenid.data", data);
  
  const errcode = data.errcode;
  const openid = data.openid;
  
  if ((errcode && errcode != 0) || isEmpty(openid)) {
    error(data);
    throw new Error(data.errmsg || await ns("微信公众号获取openid失败"));
  }
  
  const unionid = data.unionid;
  const access_token = data.access_token;
  
  return {
    openid,
    access_token,
    unionid,
  };
}

/** 拉取用户信息(需scope为 snsapi_userinfo) */
export async function fetchUserInfo(
  openid: string,
  access_token: string,
  lang = "zh_CN",
): Promise<FetchUserInfo> {
  
  const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${
    encodeURIComponent(access_token)
  }&openid=${
    openid
  }&lang=${
    lang
  }`;
  
  log("wxo_usr.fetchUserInfo.url", url);
  
  const res = await fetch(url);
  
  const data: FetchUserInfo = await res.json();
  
  log("wxo_usr.fetchUserInfo.data", data);
  
  return data;
}
