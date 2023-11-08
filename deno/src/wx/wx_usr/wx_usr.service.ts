import {
  error,
} from "/lib/context.ts";

import {
  findOne as findOneWxUsr,
  create as createWxUsr,
  updateTenantById as updateTenantByIdWxUsr,
  findById as findByIdWxUsr,
  updateById as updateByIdWxUsr,
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
  const params = new URLSearchParams();
  params.set("appid", wx_appModel.appid);
  params.set("secret", wx_appModel.appsecret);
  params.set("js_code", model.code);
  params.set("grant_type", "authorization_code");
  const res = await fetch(
    `https://api.weixin.qq.com/sns/jscode2session?${ params.toString() }`,
    {
      method: "GET",
    },
  );
  const data: {
    openid: string,
    session_key: string,
    unionid: string,
    errcode: number,
    errmsg: string,
  } = await res.json();
  if (data.errcode && data.errcode != 0) {
    throw `WxappService.code2Session: ${ JSON.stringify(data) }`;
  }
  data.unionid = data.unionid || "";
  let wx_usrModel = await findOneWxUsr(
    {
      openid: data.openid,
    },
  );
  // 用户初次登录, 设置租户
  if (!wx_usrModel) {
    const id = (await createWxUsr(
      {
        openid: data.openid,
        lbl: data.openid,
        session_key: data.session_key,
        unionid: data.unionid,
      },
    ))!;
    await updateTenantByIdWxUsr(id, wx_appModel.tenant_id!);
    wx_usrModel = (await findByIdWxUsr(
      id,
    ))!;
  }
  if (wx_usrModel.tenant_id !== wx_appModel.tenant_id) {
    await updateTenantByIdWxUsr(wx_usrModel.id, wx_appModel.tenant_id!);
  }
  if (wx_usrModel.session_key !== data.session_key || wx_usrModel.unionid !== data.unionid) {
    await updateByIdWxUsr(
      wx_usrModel.id,
      {
        session_key: data.session_key,
        unionid: data.unionid,
      },
    );
  }
  if (!wx_usrModel.usr_id) {
    const id = await createUsr(
      {
        lbl: wx_usrModel.openid,
        rem: await ns("微信用户"),
      },
      {
        uniqueType: UniqueType.Update,
      },
    );
    await updateTenantByIdUsr(id, wx_appModel.tenant_id!);
    wx_usrModel.usr_id = id;
  }
  const tokenInfo = await createTokenAuth({
    id: wx_usrModel.usr_id,
    wx_usr_id: wx_usrModel.id,
    tenant_id: wx_appModel.tenant_id,
    lang: model.lang,
  });
  return tokenInfo;
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
  opt: {
    force?: boolean;
  } = {
    force: false,
  },
): Promise<string> {
  const access_token = await getAccessToken(appid, opt.force);
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
  // 42001 AccessToken过期强制重新获取, 只重试一次
  if (data.errcode == 42001 && !opt.force) {
    return await getPhoneNumber(
      appid,
      code,
      {
        force: true,
      },
    );
  }
  if (data.errcode != 0) {
    error(data);
    throw data.errmsg;
  }
  const phoneNumber = data.phone_info?.phoneNumber;
  return phoneNumber;
}
