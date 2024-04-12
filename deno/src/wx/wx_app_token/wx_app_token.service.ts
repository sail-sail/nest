import {
  log,
  error,
} from "/lib/context.ts";
 
import {
  isEmpty,
} from "/lib/util/string_util.ts";
 
import dayjs from "dayjs";
 
import {
  findOne as findOneWxAppToken,
  create as createWxAppToken,
  updateById as updateWxAppTokenById,
} from "/gen/wx/wx_app_token/wx_app_token.dao.ts";

import {
  findOne as findOneWxApp,
  validateOption as validateOptionWxApp,
} from "/gen/wx/wx_app/wx_app.dao.ts";
 
export async function getAccessToken(
  appid: string,
  force = false,
) {
  const wx_appModel = await validateOptionWxApp(
    await findOneWxApp({
      appid,
    }),
  );
  const wx_app_id: WxAppId = wx_appModel.id;
  const appsecret = wx_appModel.appsecret;
  
  const dateNow = dayjs();
  const wx_app_tokenModel = await findOneWxAppToken(
    {
      wx_app_id: [ wx_app_id ],
    },
  );
  if (!wx_app_tokenModel) {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${ appid }&secret=${ appsecret }`;
    const res = await fetch(url);
    const data: {
      access_token: string,
      expires_in: number,
      errcode: number,
      errmsg: string,
    } = await res.json();
    const access_token = data.access_token;
    if (!access_token) {
      error(data);
      throw data;
    }
    if (isEmpty(access_token)) {
      throw `微信小程序 获取 access_token 失败: ${ url }`;
    }
    await createWxAppToken(
      {
        wx_app_id,
        access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
      },
    );
    return access_token;
  }
  const wx_app_token_id: WxAppTokenId = wx_app_tokenModel.id;
  let access_token = wx_app_tokenModel.access_token;
  const expires_in = wx_app_tokenModel.expires_in ?? 0;
  const token_time = dayjs(wx_app_tokenModel.token_time);
  if (
    force
    || !(expires_in > 0)
    || !access_token
    || !token_time.isValid()
    || token_time.add(expires_in, "s").add(5, "m").isBefore(dateNow)
  ) {
    log(`微信小程序 access_token 过期, 重新获取: ${ JSON.stringify(wx_app_tokenModel) }`);
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${
      encodeURIComponent(appid)
    }&secret=${
      encodeURIComponent(appsecret)
    }`;
    const res = await fetch(url);
    const data: {
      errcode: number,
      errmsg: string,
      access_token: string,
      expires_in: number,
    } = await res.json();
    access_token = data.access_token;
    const expires_in = data.expires_in;
    if (!access_token) {
      error(data);
      throw data.errmsg;
    }
    await updateWxAppTokenById(
      wx_app_token_id,
      {
        access_token,
        expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
      },
    );
  }
  return access_token;
}
 
/**
 * code换取用户手机号。 每个 code 只能使用一次，code的有效期为5min
 * https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/phonenumber/phonenumber.getPhoneNumber.html
 * @param access_token 接口调用凭证
 * @param code 手机号获取凭证
 */
export async function getPhoneNumber(
  access_token: string,
  code: string,
) {
  const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${ encodeURIComponent(access_token) }`;
  const res = await fetch(
    url,
    {
      method: "POST",
      body: JSON.stringify({
        code,
      }),
    },
  );
  const data: {
    errcode: number;
    errmsg: string;
    phone_info: {
      phoneNumber: string;
      purePhoneNumber: string;
      countryCode: string;
      watermark: {
        appid: string;
        timestamp: number;
      };
    };
  } = await res.json();
  if (data.errcode != 0) {
    error(data);
    throw data.errmsg;
  }
  const phoneNumber = data.phone_info?.phoneNumber;
  return phoneNumber;
}
