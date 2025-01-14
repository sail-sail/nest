import type {
  WxoLoginByCodeInput,
  LoginModel,
  LoginInput,
  WxoGetAppid,
} from "/gen/types.ts";

import {
  findOne as findOneDomain,
  validateOption as validateOptionDomain,
  validateIsEnabled as validateIsEnabledDomain,
} from "/gen/base/domain/domain.dao.ts";

import {
  findOne as findOneWxoApp,
  validateOption as validateOptionWxoApp,
  validateIsEnabled as validateIsEnabledWxoApp,
} from "/gen/wx/wxo_app/wxo_app.dao.ts";

import {
  findById as findByIdWxoUsr,
  findOne as findOneWxoUsr,
  create as createWxoUsr,
  updateById as updateByIdWxoUsr,
  updateTenantById as updateTenantByIdWxoUsr,
  validateOption as validateOptionWxoUsr,
} from "/gen/wx/wxo_usr/wxo_usr.dao.ts";

import {
  findById as findByIdUsr,
  create as createUsr,
  updateTenantById as updateTenantByIdUsr,
  validateOption as validateOptionUsr,
  updateById as updateByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findById as findByIdTenant,
  validateOption as validateOptionTenant,
  validateIsEnabled as validateIsEnabledTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  findById as findByIdLang,
} from "/gen/base/lang/lang.dao.ts";

import {
  fetchOpenid as fetchOpenidWxoUsr,
  fetchUserInfo as fetchUserInfoWxoUsr,
} from "./wxo_usr.dao.ts";

import type {
  FetchUserInfo,
} from "./wxo_usr.model.ts";

import {
  createToken as createTokenAuth,
  getPassword,
} from "/lib/auth/auth.dao.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  UniqueType,
} from "/gen/types.ts";

import {
  findLoginUsr,
  getOrgIdsById,
} from "/src/base/usr/usr.dao.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

/** 通过域名获取开发者ID */
export async function wxoGetAppid(
  host: string,
): Promise<WxoGetAppid> {
  // 获取域名
  const domain_model = await validateOptionDomain(
    await findOneDomain({
      lbl: host,
    }),
  );
  await validateIsEnabledDomain(domain_model);
  
  const domain_id = domain_model.id;
  
  // 获取微信公众号的开发者ID
  const wxo_app_model = await validateOptionWxoApp(
    await findOneWxoApp({
      domain_id: [ domain_id ],
    }),
  );
  await validateIsEnabledWxoApp(wxo_app_model);
  
  const appid = wxo_app_model.appid;
  const scope = wxo_app_model.scope;
  
  return {
    appid,
    scope,
  };
}

/**
 * 微信公众号单点登录
 */
export async function wxoLoginByCode(
  input: WxoLoginByCodeInput,
): Promise<LoginModel> {
  
  const {
    default: mime,
  } = await import("mime");
  
  const {
    upload: uploadOss,
  } = await import("/lib/oss/oss.dao.ts");
  
  const host = input.host;
  const code = input.code;
  const lang = input.lang || "zh_cn";
  
  // 获取域名
  const domainModel = await validateOptionDomain(
    await findOneDomain({
      lbl: host,
    }),
  );
  await validateIsEnabledDomain(domainModel);
  
  const domain_id = domainModel.id;
  
  // 获取微信公众号应用
  const wxo_app_model = await validateOptionWxoApp(
    await findOneWxoApp({
      domain_id: [ domain_id ],
    })
  );
  await validateIsEnabledWxoApp(wxo_app_model);
  
  const tenant_id = wxo_app_model.tenant_id!;
  const appid = wxo_app_model.appid;
  
  // 获取微信公众号的openid
  const {
    openid,
    unionid,
    access_token,
  } = await fetchOpenidWxoUsr(code, appid);
  
  let userinfo: FetchUserInfo | undefined;
  
  if (wxo_app_model.scope === "snsapi_userinfo") {
    userinfo = await fetchUserInfoWxoUsr(
      openid,
      access_token,
      lang,
    );
  }
  
  const lbl = userinfo?.nickname || openid;
  const headimgurl = userinfo?.headimgurl;
  const sex = userinfo?.sex;
  const province = userinfo?.province;
  const city= userinfo?.city;
  const country = userinfo?.country;
  let privilege = undefined;
  if (userinfo?.privilege) {
    privilege = userinfo.privilege.join(",");
  }
  
  let head_img = "";
  
  if (headimgurl) {
    const res = await fetch(headimgurl);
    const blob = await res.blob();
    const ext = mime.getExtension(blob.type);
    const file = new File([ blob ], lbl + ext ? "." + ext : "");
    head_img = await uploadOss(
      file,
      {
        is_public: true,
        tenant_id,
        db: "wx_wxo_usr",
      },
    );
  }
  
  // 微信公众号用户
  let wxo_usr_model = await findOneWxoUsr({
    openid,
  });
  // 用户初次登录, 设置租户
  if (!wxo_usr_model) {
    const id = await createWxoUsr(
      {
        openid,
        lbl,
        head_img,
        unionid,
        sex,
        province,
        city,
        country,
        privilege,
      },
    );
    await updateTenantByIdWxoUsr(id, tenant_id!);
    wxo_usr_model = await validateOptionWxoUsr(
      await findByIdWxoUsr(id),
    );
  }
  if (wxo_usr_model.tenant_id !== tenant_id) {
    await updateTenantByIdWxoUsr(wxo_usr_model.id, tenant_id);
  }
  if (wxo_app_model.scope === "snsapi_userinfo") {
    await updateByIdWxoUsr(
      wxo_usr_model.id,
      {
        unionid,
        lbl,
        head_img,
        sex,
        province,
        city,
        country,
        privilege,
      },
    );
  } else {
    await updateByIdWxoUsr(
      wxo_usr_model.id,
      {
        unionid,
      },
    );
  }
  if (!wxo_usr_model.usr_id) {
    const usr_id = await createUsr(
      {
        lbl,
        rem: await ns("微信公众号游客"),
        is_hidden: 1,
      },
      {
        uniqueType: UniqueType.Update,
      },
    );
    await updateTenantByIdUsr(usr_id, tenant_id);
    await updateByIdWxoUsr(
      wxo_usr_model.id,
      {
        usr_id,
        usr_id_lbl: lbl,
        create_usr_id: usr_id,
        create_usr_id_lbl: lbl,
      },
    );
    wxo_usr_model = await validateOptionWxoUsr(
      await findByIdWxoUsr(wxo_usr_model.id),
    );
  }
  
  const usr_model = await validateOptionUsr(
    await findByIdUsr(wxo_usr_model.usr_id),
  );
  const username = usr_model.username;
  
  const usr_id = wxo_usr_model.usr_id;
  const wxo_usr_id = wxo_usr_model.id;
  const org_id = usr_model.default_org_id;
  
  const {
    authorization,
  } = await createTokenAuth({
    id: usr_id,
    wxo_usr_id,
    tenant_id,
    org_id,
    lang,
  });
  
  const login_model: LoginModel = {
    usr_id,
    username,
    tenant_id,
    org_id,
    authorization,
    lang,
  };
  
  return login_model;
}

/**
 * 公众号用户是否已绑定
 */
export async function checkBindWxoUsr() {
  const authModel = await getAuthModel();
  const wxo_usr_id = authModel?.wxo_usr_id as WxoUsrId;
  if (!wxo_usr_id) {
    return false;
  }
  const wxo_usrModel = await validateOptionWxoUsr(
    await findByIdWxoUsr(wxo_usr_id),
  );
  const usr_id = wxo_usrModel.usr_id;
  if (!usr_id) {
    return false;
  }
  const usrModel = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
  return !usrModel.is_hidden;
}

/**
 * 绑定公众号用户
 * 找到这个用户, 如果这个用户是 is_hidden 为0, 代表它未绑定, 否则已被绑定
 * 未绑定的, 就找到当前的登录用户, 修改它的用户名, 密码, 跟 租户ID, 还有 is_hidden 变为 1
 * 之后再执行登录流程
 */
export async function bindWxoUsr(
  input: LoginInput,
): Promise<LoginModel> {
  const auth_model = await getAuthModel();
  
  if (!auth_model) {
    throw await ns("未登录");
  }
  
  const authUsrModel = await validateOptionUsr(
    await findByIdUsr(auth_model?.id),
  );
  if (!authUsrModel.is_hidden) {
    throw await ns("此微信已被其它用户绑定");
  }
  
  const wxo_usr_id = auth_model?.wxo_usr_id as WxoUsrId;
  if (!wxo_usr_id) {
    throw "wx_usr_id can not be null";
  }
  
  const username = input.username;
  const password = input.password;
  const tenant_id = input.tenant_id;
  let org_id = input.org_id;
  if (isEmpty(username) || isEmpty(password)) {
    throw await ns("用户名或密码不能为空");
  }
  if (isEmpty(tenant_id)) {
    throw await ns("请选择租户");
  }
  
  // 获取租户
  const tenant_model = await validateOptionTenant(
    await findByIdTenant(
      tenant_id,
    ),
  );
  await validateIsEnabledTenant(tenant_model);
  
  const lang_id = tenant_model.lang_id;
  let lang = "zh-CN";
  
  // 获取语言
  const lang_model = await findByIdLang(
    lang_id,
  );
  if (lang_model && lang_model.code) {
    lang = lang_model.code;
  }
  
  const password2 = await getPassword(password);
  let model = await findLoginUsr(
    username,
    password2,
    tenant_id,
  );
  
  if (!model || !model.id) {
    model = {
      id: auth_model.id,
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
  
  const wxo_usrModel = await validateOptionWxoUsr(
    await findByIdWxoUsr(wxo_usr_id),
  );
  if (wxo_usrModel.usr_id != model.id) {
    await updateByIdWxoUsr(
      wxo_usr_id,
      {
        usr_id: model.id,
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
    wxo_usr_id,
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

/** 公众号用户解除绑定 */
export async function unBindWxoUsr() {
  const authModel = await getAuthModel();
  const wxo_usr_id = authModel?.wxo_usr_id as WxoUsrId;
  if (!wxo_usr_id) {
    throw "wxo_usr_id can not be null";
  }
  await updateByIdWxoUsr(
    wxo_usr_id,
    {
      usr_id: "" as UsrId,
    },
  );
  return true;
}

/** 获取公众号用户信息 */
export async function getWxoUsrInfo() {
  
  const authModel = await getAuthModel();
  const wxo_usr_id = authModel?.wxo_usr_id as WxoUsrId;
  
  if (!wxo_usr_id) {
    throw "wxo_usr_id can not be null";
  }
  const wxo_usr_model = await findByIdWxoUsr(wxo_usr_id);
  
  if (!wxo_usr_model) {
    return;
  }
  
  return {
    id: wxo_usr_model.id,
    lbl: wxo_usr_model.lbl,
    head_img: wxo_usr_model.head_img,
  };
}
