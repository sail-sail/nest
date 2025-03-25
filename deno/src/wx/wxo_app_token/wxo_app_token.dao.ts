import {
  log,
  error,
} from "/lib/context.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

import {
  findOneWxoApp,
  validateOptionWxoApp,
} from "/gen/wx/wxo_app/wxo_app.dao.ts";

import {
  findOneWxoAppToken,
  createWxoAppToken,
  updateByIdWxoAppToken,
} from "/gen/wx/wxo_app_token/wxo_app_token.dao.ts";

import dayjs from "dayjs";

async function fetchAccessToken(
  appid: string,
) {
  const wxo_appModel = await validateOptionWxoApp(
    await findOneWxoApp({
      appid,
    }),
  );
  const appsecret = wxo_appModel.appsecret;
  
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${ appid }&secret=${ appsecret }`;
  const res = await fetch(url);
  const data: {
    access_token: string,
    expires_in: number,
    errcode: number,
    errmsg: string,
  } = await res.json();
  
  const access_token = data.access_token;
  const errcode = data.errcode;
  const expires_in = data.expires_in;
  
  if (errcode != 0 || isEmpty(access_token)) {
    error(data);
    throw data;
  }
  return {
    access_token,
    expires_in,
  };
}

export async function getAccessToken(
  appid: string,
  force = false,
) {
  const wxo_appModel = await validateOptionWxoApp(
    await findOneWxoApp({
      appid,
    }),
  );
  const wxo_app_id = wxo_appModel.id;
  
  const wxo_app_tokenModel = await findOneWxoAppToken(
    {
      wxo_app_id: [ wxo_app_id ],
    },
  );
  
  const dateNow = dayjs();
  const dateStr = dateNow.format("YYYY-MM-DD HH:mm:ss");
  if (!wxo_app_tokenModel) {
    const {
      access_token,
      expires_in,
    } = await fetchAccessToken(appid);
    
    // 创建 公众号接口凭据
    await createWxoAppToken(
      {
        wxo_app_id,
        access_token,
        token_time: dateStr,
        expires_in,
      },
    );
    return access_token;
  }
  const wxo_app_token_id = wxo_app_tokenModel.id;
  const access_token = wxo_app_tokenModel.access_token;
  const expires_in = wxo_app_tokenModel.expires_in ?? 0;
  const token_time = dayjs(wxo_app_tokenModel.token_time);
  if (
    force
    || !(expires_in > 0)
    || !access_token
    || !token_time.isValid()
    || token_time.add(expires_in, "s").add(5, "m").isBefore(dateNow)
  ) {
    log(`微信公众号 access_token 过期, 重新获取: ${ JSON.stringify(wxo_app_tokenModel) }`);
    const {
      access_token,
      expires_in,
    } = await fetchAccessToken(appid);
    
    await updateByIdWxoAppToken(
      wxo_app_token_id,
      {
        access_token,
        token_time: dateStr,
        expires_in,
      },
    );
    return access_token;
  }
  return access_token;
}
