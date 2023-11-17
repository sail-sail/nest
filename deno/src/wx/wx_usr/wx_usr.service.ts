import {
  error,
} from "/lib/context.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findOne as findOneWxUsr,
  create as createWxUsr,
  updateTenantById as updateTenantByIdWxUsr,
  findById as findByIdWxUsr,
  updateById as updateByIdWxUsr,
  validateOption as validateOptionWxUsr,
} from "/gen/wx/wx_usr/wx_usr.dao.ts";

import {
  findOne as findOneWxApp,
  validateOption as validateOptionWxApp,
} from "/gen/wx/wx_app/wx_app.dao.ts";

import {
  createToken as createTokenAuth,
} from "/lib/auth/auth.dao.ts";

import {
  create as createUsr,
  updateTenantById as updateTenantByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  UniqueType,
} from "/gen/types.ts";

import {
  getAccessToken,
} from "/src/wx/wx_app_token/wx_app_token.service.ts";
 
export async function code2Session(
  model: {
    appid: string;
    code: string;
    lang: string;
  },
) {
  const wx_appModel = await validateOptionWxApp(
    await findOneWxApp(
      {
        appid: model.appid,
      },
    ),
  );
  const appid = wx_appModel.appid;
  const appsecret = wx_appModel.appsecret;
  const params = new URLSearchParams();
  const js_code = model.code;
  params.set("appid", appid);
  params.set("secret", appsecret);
  params.set("js_code", js_code);
  params.set("grant_type", "authorization_code");
  const url = `https://api.weixin.qq.com/sns/jscode2session?${ params.toString() }`;
  const res = await fetch(url);
  const data: {
    openid: string,
    session_key: string,
    unionid: string,
    errcode: number,
    errmsg: string,
  } = await res.json();
  const errcode = data.errcode;
  if (errcode && errcode != 0) {
    error(`WxappService.code2Session: ${ JSON.stringify(data) }`);
    throw data.errmsg;
  }
  const openid = data.openid;
  const unionid = data.unionid;
  let wx_usrModel = await findOneWxUsr(
    {
      openid,
    },
  );
  // 用户初次登录, 设置租户
  if (!wx_usrModel) {
    const id = await createWxUsr(
      {
        openid,
        lbl: openid,
        unionid,
      },
    );
    await updateTenantByIdWxUsr(id, wx_appModel.tenant_id!);
    wx_usrModel = await validateOptionWxUsr(
      await findByIdWxUsr(id),
    );
  }
  if (wx_usrModel.tenant_id !== wx_appModel.tenant_id) {
    await updateTenantByIdWxUsr(wx_usrModel.id, wx_appModel.tenant_id);
  }
  if (wx_usrModel.unionid != unionid) {
    await updateByIdWxUsr(
      wx_usrModel.id,
      {
        unionid,
      },
    );
  }
  if (!wx_usrModel.usr_id) {
    const id = await createUsr(
      {
        lbl: await ns("游客"),
        rem: await ns("微信用户"),
        is_hidden: 1,
      },
      {
        uniqueType: UniqueType.Update,
      },
    );
    await updateTenantByIdUsr(id, wx_appModel.tenant_id);
    await updateByIdWxUsr(
      wx_usrModel.id,
      {
        usr_id: id,
      },
    );
    wx_usrModel = await validateOptionWxUsr(
      await findByIdWxUsr(wx_usrModel.id),
    );
  }
  const tokenInfo = await createTokenAuth({
    id: wx_usrModel.usr_id,
    wx_usr_id: wx_usrModel.id,
    tenant_id: wx_appModel.tenant_id,
    lang: model.lang,
  });
  return tokenInfo;
}

async function fetchPhoneNumber(
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
  return data;
}

/**
 * code换取用户手机号。 每个 code 只能使用一次，code的有效期为5min
 * https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/phonenumber/phonenumber.getPhoneNumber.html
 * @param appid 小程序appid
 * @param code 手机号获取凭证
 */
export async function getPhoneNumber(
  appid: string,
  code: string,
) {
  const authModel = await getAuthModel();
  const usr_id = authModel.id;
  const wx_usrModel = await validateOptionWxUsr(
    await findOneWxUsr(
      {
        usr_id: [ usr_id ],
      },
    ),
  );
  const wx_usr_id = wx_usrModel.id;
  
  const access_token = await getAccessToken(appid);
  let data = await fetchPhoneNumber(access_token, code);
  // 42001 AccessToken过期强制重新获取, 只重试一次
  if (data.errcode == 42001) {
    const access_token = await getAccessToken(appid, true);
    data = await fetchPhoneNumber(access_token, code);
  }
  if (data.errcode != 0) {
    error(data);
    throw data.errmsg;
  }
  const mobile = data.phone_info.phoneNumber;
  if (!mobile) {
    error(`获取手机号失败: ${ JSON.stringify(data) }`);
    throw `获取手机号失败`;
  }
  await updateByIdWxUsr(
    wx_usr_id,
    {
      mobile,
    },
  );
}
