import {
  error,
} from "/lib/context.ts";

import {
  getAuthModel,
  getPassword,
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
  updateById as updateByIdUsr,
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

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

import type {
  WxUsrId,
} from "/gen/wx/wx_usr/wx_usr.model.ts";

import type {
  LoginInput,
  LoginModel,
} from "/gen/types.ts";

import {
  findById as findByIdUsr,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

import {
  findLoginUsr,
  getOrgIdsById,
} from "/src/base/usr/usr.dao.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";
 
export async function code2Session(
  model: {
    appid: string;
    code: string;
    lang: string;
  },
): Promise<LoginModel> {
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
    const id: WxUsrId = await createWxUsr(
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
    const id: UsrId = await createUsr(
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
  
  const usrModel = await validateOptionUsr(
    await findByIdUsr(wx_usrModel.usr_id),
  );
  const username = usrModel.username;
  
  let org_id: OrgId | undefined = undefined;
  const org_ids = await getOrgIdsById(wx_usrModel.usr_id);
  if (!org_id) {
    org_id = org_ids[0];
  }
  if (org_id) {
    if (!org_ids.includes(org_id)) {
      org_id = undefined;
    }
  }
  
  const {
    authorization,
  } = await createTokenAuth({
    id: wx_usrModel.usr_id,
    org_id,
    wx_usr_id: wx_usrModel.id,
    tenant_id: wx_appModel.tenant_id,
    lang: model.lang,
  });
  
  const loginModel: LoginModel = {
    usr_id: wx_usrModel.usr_id,
    username,
    tenant_id: wx_appModel.tenant_id,
    org_id,
    authorization,
    lang: model.lang,
  };
  
  return loginModel;
}

/**
 * 微信用户是否已绑定
 */
export async function checkBindWxUsr() {
  const authModel = await getAuthModel();
  if (!authModel.wx_usr_id) {
    return false;
  }
  const wx_usrModel = await validateOptionWxUsr(
    await findByIdWxUsr(authModel.wx_usr_id),
  );
  const usr_id = wx_usrModel.usr_id;
  if (!usr_id) {
    return false;
  }
  const usrModel = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
  return !usrModel.is_hidden;
}

/**
 * 绑定微信用户
 * 找到这个用户, 如果这个用户是 is_hidden 为0, 代表它未绑定, 否则已被绑定
 * 未绑定的, 就找到当前的登录用户, 修改它的用户名, 密码, 跟 租户ID, 还有 is_hidden 变为 1
 * 之后再执行登录流程
 */
export async function bindWxUsr(
  input: LoginInput,
): Promise<LoginModel> {
  const authModel = await getAuthModel();
  
  const authUsrModel = await validateOptionUsr(
    await findByIdUsr(authModel.id),
  );
  if (!authUsrModel.is_hidden) {
    throw await ns("此微信已被其它用户绑定");
  }
  
  const wx_usr_id = authModel.wx_usr_id;
  if (!wx_usr_id) {
    throw "wx_usr_id can not be null";
  }
  
  const username = input.username;
  const password = input.password;
  const tenant_id = input.tenant_id;
  let org_id = input.org_id;
  const lang = input.lang;
  if (isEmpty(username) || isEmpty(password)) {
    throw await ns("用户名或密码不能为空");
  }
  if (isEmpty(tenant_id)) {
    throw await ns("请选择租户");
  }
  const password2 = await getPassword(password);
  let model = await findLoginUsr(
    username,
    password2,
    tenant_id,
  );
  if (!model || !model.id) {
    model = {
      id: authModel.id,
      default_org_id: authUsrModel.default_org_id,
      is_hidden: authUsrModel.is_hidden,
    },
    await updateTenantByIdUsr(model.id, tenant_id);
    await updateByIdUsr(
      model.id,
      {
        username,
        password: password2,
        is_hidden: 0,
      },
    );
  } else {
    if (model.is_hidden) {
      await updateByIdUsr(
        model.id,
        {
          username,
          password,
          is_hidden: 0,
        },
      );
    }
  }
  
  if (org_id === null) {
    org_id = undefined;
  }
  const org_ids = await getOrgIdsById(
    model.id,
  );
  if (!org_id) {
    org_id = model.default_org_id || org_ids[0];
  }
  if (org_id) {
    if (!org_ids.includes(org_id)) {
      org_id = undefined;
    }
  }
  
  const wx_usrModel = await validateOptionWxUsr(
    await findByIdWxUsr(wx_usr_id),
  );
  if (wx_usrModel.usr_id != model.id) {
    await updateByIdWxUsr(
      wx_usr_id,
      {
        usr_id: model.id,
        org_id,
      },
    );
  }
  const usr_id = model.id;
  
  const {
    authorization,
  } = await createTokenAuth({
    id: usr_id,
    org_id,
    tenant_id,
    lang,
    wx_usr_id,
  });
  
  const loginModel: LoginModel = {
    usr_id,
    username,
    tenant_id,
    authorization,
    org_id,
    lang,
  };
  
  return loginModel;
}

/** 解除绑定 */
export async function unBindWxUsr() {
  const authModel = await getAuthModel();
  const wx_usr_id = authModel.wx_usr_id;
  if (!wx_usr_id) {
    throw "wx_usr_id can not be null";
  }
  await updateByIdWxUsr(
    wx_usr_id,
    {
      usr_id: "" as UsrId,
    },
  );
  return true;
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
  const usr_id: UsrId = authModel.id;
  const wx_usrModel = await validateOptionWxUsr(
    await findOneWxUsr(
      {
        usr_id: [ usr_id ],
      },
    ),
  );
  const wx_usr_id: WxUsrId = wx_usrModel.id;
  
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