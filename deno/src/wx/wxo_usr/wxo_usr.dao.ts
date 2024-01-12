import {
  error,
} from "/lib/context.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

import {
  findOne as findOneWxoApp,
  validateOption as vlidateOptionWxoApp,
} from "/gen/wx/wxo_app/wxo_app.dao.ts";

// 通过code换取网页授权openid
export async function fetchOpenid(
  code: string,
  appid: string,
) {
  const wxo_appModel = await vlidateOptionWxoApp(
    await findOneWxoApp({
      appid,
    }),
  );
  const appsecret = wxo_appModel.appsecret;
  
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${ appid }&secret=${ appsecret }&code=${
    encodeURIComponent(code)
  }&grant_type=authorization_code`;
  const res = await fetch(url);
  
  const data: {
    openid: string,
    unionid?: string,
    errcode: number,
    errmsg: string,
  } = await res.json();
  
  const errcode = data.errcode;
  const openid = data.openid;
  const unionid = data.unionid;
  
  if (errcode != 0 || isEmpty(openid)) {
    error(data);
    throw data;
  }
  return {
    openid,
    unionid,
  };
}
